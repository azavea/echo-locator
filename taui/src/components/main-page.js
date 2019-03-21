// @flow
import lonlat from '@conveyal/lonlat'
import message from '@conveyal/woonerf/message'
import get from 'lodash/get'
import memoize from 'lodash/memoize'
import React from 'react'

import type {
  InputEvent,
  MapboxFeature,
  MapEvent
} from '../types'
import downloadJson from '../utils/download-json'

import Dock from './dock'
import Form from './form'
import Log from './log'
import Map from './map'

/**
 * Displays map and sidebar.
 */
export default class MainPage extends React.PureComponent<Props> {
  state = {
    componentError: null
  }

  componentDidMount () {
    this.props.initialize()
  }

  _saveRefToConfig = (ref) => {
    this._refToConfig = ref
  }

  _updateConfig = () => {
    try {
      const json = JSON.parse(this._refToConfig.value)
      this.props.loadDatasetFromJSON(json)
    } catch (e) {
      console.error(e)
      window.alert('Invalid JSON!')
    }
  }

  _clearStartAndEnd = () => {
    const {setEnd, setStart} = this.props
    setStart(null)
    setEnd(null)
  }

  _setStartWithEvent = (event: MapEvent) => {
    this.props.updateStartPosition(lonlat(event.latlng || event.target._latlng))
  }

  _setStartWithFeature = (feature?: MapboxFeature) => {
    if (!feature) {
      this._clearStartAndEnd()
    } else {
      this.props.updateStart({
        label: feature.place_name,
        position: lonlat(feature.geometry.coordinates)
      })
    }
  }

  _setEndWithEvent = (event: MapEvent) => {
    this.props.updateEndPosition(lonlat(event.latlng || event.target._latlng))
  }

  _setEndWithFeature = (feature?: MapboxFeature) => {
    if (!feature) {
      this.props.setEnd(null)
    } else {
      this.props.updateEnd({
        label: feature.place_name,
        position: lonlat(feature.geometry.coordinates)
      })
    }
  }

  _onTimeCutoffChange = (event: InputEvent) => {
    this.props.setSelectedTimeCutoff(parseInt(event.currentTarget.value, 10))
  }

  _setShowOnMap = memoize(index => () => {
    const p = this.props
    const network = p.data.networks[index]
    const showOnMap = !network.showOnMap
    p.setNetwork({
      ...network,
      showOnMap
    })
    if (showOnMap) p.setActiveNetwork(network.name)
  })

  _downloadIsochrone = memoize(index => () => {
    const p = this.props
    const isochrone = p.isochrones[index]
    if (isochrone) {
      const name = p.data.networks[index].name
      const ll = lonlat.toString(p.geocoder.start.position)
      downloadJson({
        data: isochrone,
        filename: `${name}-${ll}-${p.timeCutoff.selected}min-isochrone.json`
      })
    } else {
      window.alert('No isochrone has been generated for this network.')
    }
  })

  _showNeighborhoodRoutes () {
    const p = this.props
    return !p.isLoading && !!get(p, 'neighborhoodRoutes[0]')
  }

  _showRoutes () {
    const p = this.props
    return !p.isLoading && get(p, 'allTransitiveData[0].journeys[0]')
  }

  /**
   *
   */
  render () {
    const p = this.props

    return (
      <div className={p.isLoading ? 'isLoading' : ''}>
        <div className='Fullscreen'>
          <svg width='0' height='0' style={{position: 'absolute'}}>
            <defs>
              <filter id='shadow'>
                <feDropShadow dx='1' dy='1' stdDeviation='1' />
              </filter>
            </defs>
          </svg>
          <Map
            {...p.map}
            activeNeighborhood={p.data.activeNeighborhood}
            activeNetworkIndex={p.activeNetworkIndex}
            clearStartAndEnd={this._clearStartAndEnd}
            end={p.geocoder.end}
            isLoading={p.isLoading}
            isochrones={p.isochrones}
            drawIsochrones={p.drawIsochrones}
            drawOpportunityDatasets={p.drawOpportunityDatasets}
            drawRoutes={p.drawNeighborhoodRoutes}
            neighborhoods={p.neighborhoods}
            neighborhoodBounds={p.neighborhoodBounds}
            origin={p.data.origin}
            pointsOfInterest={p.pointsOfInterest}
            showRoutes={this._showNeighborhoodRoutes()}
            setActiveNeighborhood={p.setActiveNeighborhood}
            setEndPosition={p.updateEndPosition}
            setStartPosition={p.updateStartPosition}
            start={p.geocoder.start}
            updateEnd={p.updateEnd}
            updateMap={p.updateMap}
            updateOrigin={p.updateOrigin}
            updateStart={p.updateStart}
          />
        </div>
        <Dock
          activeNetworkIndex={p.activeNetworkIndex}
          componentError={this.state.componentError}
          isLoading={p.isLoading}
          neighborhoodsSortedWithRoutes={p.neighborhoodsSortedWithRoutes}
          setActiveNeighborhood={p.setActiveNeighborhood}
          showSpinner={p.ui.fetches > 0}>
          <Form
            geocode={p.geocode}
            networks={p.data.networks}
            reverseGeocode={p.reverseGeocode}
            setActiveNetwork={p.setActiveNetwork}
            origin={p.data.origin}
            updateOrigin={p.updateOrigin}
            userProfile={p.userProfile}
          />
          {p.ui.showLog &&
            <div className='Card'>
              <div className='CardTitle'>
                <span className='fa fa-terminal' /> {message('Log.Title')}
              </div>
              <Log items={p.actionLog} />
            </div>}
        </Dock>
      </div>
    )
  }
}
