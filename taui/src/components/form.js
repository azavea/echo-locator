// @flow
import lonlat from '@conveyal/lonlat'
import message from '@conveyal/woonerf/message'
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
      network: null
    }
  }

  componentWillReceiveProps (nextProps) {
    if (!this.state.network && nextProps.networks && nextProps.networks.length) {
      const first = nextProps.networks[0]
      this.setState({network: {label: first.name, value: first.url}})
    }
  }

  _selectDestinationStart = (option?: ReactSelectOption) => {
    this.props.updateStart(option ? {
      label: option.label,
      position: lonlat(option.position)
    } : null)
  }

  _setNetwork = (option?: ReactSelectOption) => {
    this.setState({network: option})
  }

  render () {
    const p = this.props
    const {network} = this.state
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
          onChange={this._selectDestinationStart}
          placeholder={message('Geocoding.StartPlaceholder')}
          value={p.start}
        />
        <Select
          filterOptions={networkFilterOptions}
          options={networks}
          onChange={this._setNetwork}
          placeholder={message('Map.SelectNetwork')}
          value={network}
        />
      </div>
    )
  }
}
