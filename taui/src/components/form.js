// @flow
import lonlat from '@conveyal/lonlat'
import message from '@conveyal/woonerf/message'
import find from 'lodash/find'
import memoize from 'lodash/memoize'
import React from 'react'
import Select from 'react-virtualized-select'
import createFilterOptions from 'react-select-fast-filter-options'

import type {
  AccountAddress,
  AccountProfile,
  Location
} from '../types'

type Props = {
  end: null | Location,
  geocode: (string, Function) => void,
  reverseGeocode: (string, Function) => void,
  start: null | Location,
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

export default class Form extends React.PureComponent {
  props: Props

  constructor (props) {
    super(props)
    this.state = {
      destination: null,
      network: null
    }
  }

  componentWillReceiveProps (nextProps) {
    if (!this.state.network && nextProps.networks && nextProps.networks.length) {
      const first = nextProps.networks[0]
      const network = {label: first.name, value: first.url}
      this.setState({network: network})
      this.props.setActiveNetwork(network.label)
      if (this.state.destination) {
        this.props.updateOrigin(this.state.destination, network.label)
      }
    }

    if (!this.state.destination && nextProps.userProfile && nextProps.userProfile.destinations) {
      const destinations = nextProps.userProfile.destinations
      if (!destinations.length) {
        console.error('No profile destinations available')
      } else {
        // Set default destination to the primary profile destination
        const destination = find(destinations, d => !!d.primary)
        if (!destination) {
          console.error('No primary destination set on profile')
          return
        }
        const destinationObj = {
          label: destination.location.label,
          position: destination.location.position
        }
        this.setState({destination: destinationObj})
        if (this.state.network) {
          this.props.updateOrigin(destinationObj, this.state.network.label)
        }
      }
    }
  }

  selectDestination = (option?: ReactSelectOption) => {
    const destinationObj = option ? {
      label: option.label,
      position: lonlat(option.position)
    } : null
    this.setState({destination: destinationObj})
    this.props.updateOrigin(destinationObj, this.state.network.label)
  }

  setNetwork = (option?: ReactSelectOption) => {
    this.setState({network: option})
    this.props.setActiveNetwork(option.label)
  }

  render () {
    const p = this.props
    const {destination, network} = this.state
    const destinations: Array<AccountAddress> = p.userProfile ? p.userProfile.destinations : []
    const locations = destinations.map(d => d.location)
    const destinationFilterOptions = createDestinationsFilter(locations)
    const networks = p.networks.map(n => ({label: n.name, value: n.url}))
    const networkFilterOptions = createNetworksFilter(networks)

    return (
      <div>
        <Select
          filterOptions={destinationFilterOptions}
          options={locations}
          onChange={this.selectDestination}
          placeholder={message('Geocoding.StartPlaceholder')}
          value={destination}
        />
        <Select
          filterOptions={networkFilterOptions}
          options={networks}
          onChange={this.setNetwork}
          placeholder={message('Map.SelectNetwork')}
          value={network}
        />
      </div>
    )
  }
}
