// @flow
import lonlat from '@conveyal/lonlat'
import message from '@conveyal/woonerf/message'
import memoize from 'lodash/memoize'
import React from 'react'
import Select from 'react-virtualized-select'
import createFilterOptions from 'react-select-fast-filter-options'

import type {
  InputEvent,
  Location,
  MapboxFeature,
  PointsOfInterest
} from '../types'

type Props = {
  end: null | Location,
  geocode: (string, Function) => void,
  onChangeEnd: MapboxFeature => void,
  onChangeStart: MapboxFeature => void,
  onTimeCutoffChange: InputEvent => void,
  pointsOfInterest: PointsOfInterest,
  reverseGeocode: (string, Function) => void,
  selectedTimeCutoff: number,
  start: null | Location
}

const cfo = memoize(o => createFilterOptions({
  options: o,
  labelKey: 'label',
  valueKey: 'position'
}))

export default class Form extends React.PureComponent {
  props: Props

  state = {
    animating: false
  }

  _animateTimeCutoff = () => {
    this.setState({animating: true})
    this._animateTo(0)
  }

  _animateTo (cutoff: number) {
    this.props.onTimeCutoffChange({currentTarget: {value: cutoff}})
    if (cutoff < 120) setTimeout(() => this._animateTo(cutoff + 1), 50)
    else this.setState({animating: false})
  }

  _selectDestinationStart = (option?: ReactSelectOption) => {
    this.props.updateStart(option ? {
      label: option.label,
      position: lonlat(option.position)
    } : null)
  }

  render () {
    const p = this.props
    const destinations = p.userProfile ? p.userProfile.destinations : []
    const locations = destinations.map(d => d.location)
    const destinationFilterOptions = cfo(locations)
    return (
      <div>
        <Select
          filterOptions={destinationFilterOptions}
          options={locations}
          onChange={this._selectDestinationStart}
          placeholder={message('Geocoding.StartPlaceholder')}
          value={p.start}
        />
      </div>
    )
  }
}
