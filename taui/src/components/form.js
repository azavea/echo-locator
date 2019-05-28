// @flow
import lonlat from '@conveyal/lonlat'
import message from '@conveyal/woonerf/message'
import find from 'lodash/find'
import filter from 'lodash/filter'
import memoize from 'lodash/memoize'
import React from 'react'
import Select from 'react-virtualized-select'
import createFilterOptions from 'react-select-fast-filter-options'

import {SELECT_STYLE, SELECT_WRAPPER_STYLE} from '../constants'
import type {
  AccountAddress,
  AccountProfile,
  Location
} from '../types'

type Props = {
  networks: any[],
  setActiveNetwork: (string) => void,
  updateOrigin: (Location) => void,
  userProfile: AccountProfile
}

const createDestinationsFilter = memoize(o => createFilterOptions({
  options: o,
  labelKey: 'label',
  valueKey: 'position'
}))

const createNetworksFilter = memoize(o => createFilterOptions({
  options: o
}))

export default class Form extends React.PureComponent<Props> {
  props: Props

  constructor (props) {
    super(props)

    this.getProfileNetworks = this.getProfileNetworks.bind(this)
    this.setNetwork = this.setNetwork.bind(this)

    const {networks, userProfile} = props

    const destination = userProfile && userProfile.destinations
      ? this.getPrimaryDestination(userProfile.destinations) : null

    const useNetworks = this.getProfileNetworks(networks, userProfile)

    this.state = {
      destination,
      network: useNetworks ? {
        label: useNetworks[0].name, value: useNetworks[0].url
      } : null
    }

    if (this.state.destination) {
      props.updateOrigin(this.state.destination)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (!nextProps) {
      return
    }
    if (!this.state.network && nextProps.networks && nextProps.networks.length &&
      nextProps.userProfile) {
      this.setStateNetwork(nextProps.networks, nextProps.userProfile)
    }

    if (!this.state.destination && nextProps.userProfile && nextProps.userProfile.destinations) {
      const destinations = nextProps.userProfile.destinations
      if (!destinations.length) {
        console.error('No profile destinations available')
      } else {
        // Set default destination to the primary profile destination
        const destination = this.getPrimaryDestination(destinations)
        if (destination) {
          this.setState({destination})
          this.props.updateOrigin(destination)
        }
      }
    }
  }

  // Filter networks to list/use based on user profile setting
  // to use commuter rail/express bus or not.
  getProfileNetworks (networks, userProfile): any[] {
    const useCommuter = !userProfile || userProfile.useCommuterRail === undefined ||
      !!userProfile.useCommuterRail
    return networks ? filter(networks, n => !!n.commuter === useCommuter) : null
  }

  getPrimaryDestination = (destinations) => {
    const destination = find(destinations, d => !!d.primary)
    if (!destination) {
      console.error('No primary destination set on profile')
      return
    }
    const position = destination.location.position
    return (position.lat !== 0 && position.lon !== 0) ? {
      label: destination.location.label,
      position: position
    } : null
  }

  setStateNetwork = (networks, userProfile) => {
    const useNetworks = this.getProfileNetworks(networks, userProfile)
    const first = useNetworks[0]
    const network = {label: first.name, value: first.url}
    this.setState({network})
    this.props.setActiveNetwork(network.label)
  }

  selectDestination = (option?: ReactSelectOption) => {
    const destinationObj = option ? {
      label: option.label,
      position: lonlat(option.position)
    } : null
    this.setState({destination: destinationObj})
    this.props.updateOrigin(destinationObj)
  }

  setNetwork = (option?: ReactSelectOption) => {
    this.setState({network: option})
    if (option) {
      this.props.setActiveNetwork(option.label)
    }
  }

  render () {
    const {userProfile} = this.props
    const {destination, network} = this.state
    const destinations: Array<AccountAddress> = userProfile ? userProfile.destinations : []
    const locations = destinations.map(d => d.location)
    const destinationFilterOptions = createDestinationsFilter(locations)
    const useNetworks = this.getProfileNetworks(this.props.networks, userProfile)
    const networks = useNetworks.map(n => ({label: n.name, value: n.url}))
    const networkFilterOptions = createNetworksFilter(networks)

    const setNetwork = this.setNetwork

    return (
      <div className='map-sidebar__travel-form'>
        <Select
          clearable={false}
          filterOptions={destinationFilterOptions}
          options={locations}
          optionHeight={38}
          onChange={this.selectDestination}
          placeholder={message('Geocoding.StartPlaceholder')}
          style={SELECT_STYLE}
          wrapperStyle={SELECT_WRAPPER_STYLE}
          value={destination}
        />
        {!userProfile.hasVehicle && <Select
          clearable={false}
          filterOptions={networkFilterOptions}
          options={networks}
          onChange={(e) => setNetwork(e)}
          placeholder={message('Map.SelectNetwork')}
          style={SELECT_STYLE}
          wrapperStyle={SELECT_WRAPPER_STYLE}
          value={network}
        />}
      </div>
    )
  }
}
