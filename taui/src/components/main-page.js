// @flow
import lonlat from '@conveyal/lonlat'
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
    const useTransit = !p.userProfile || !p.userProfile.hasVehicle
    return !p.isLoading && useTransit && !!get(p, 'neighborhoodRoutes[0]')
  }

  /**
   *
   */
  render () {
    const p = this.props
    const mapScreenClass = p.isLoading ? 'map-screen isLoading' : 'map-screen'

    return (
      <div className={mapScreenClass}>
        <Dock
          activeNeighborhood={p.data.activeNeighborhood}
          changeUserProfile={p.changeUserProfile}
          componentError={this.state.componentError}
          detailNeighborhood={p.detailNeighborhood}
          endingOffset={p.pageEndingOffset}
          haveAnotherPage={p.haveAnotherPage}
          isLoading={p.isLoading}
          neighborhoodCount={p.routableNeighborhoodCount}
          neighborhoodPage={p.displayPageNeighborhoods}
          origin={p.data.origin}
          page={p.data.page}
          setActiveNeighborhood={p.setActiveNeighborhood}
          setPage={p.setPage}
          setShowDetails={p.setShowDetails}
          setShowListings={p.setShowListings}
          setListingsLoading={p.setListingsLoading}
          setDataListings={p.setDataListings}
          setShowFavorites={p.setShowFavorites}
          showDetails={p.data.showDetails}
          showListings={p.data.showListings}
          listingsLoading={p.data.listingsLoading}
          showFavorites={p.data.showFavorites}
          userProfile={p.userProfile}>
          <Form
            geocode={p.geocode}
            networks={p.data.networks}
            reverseGeocode={p.reverseGeocode}
            setActiveNetwork={p.setActiveNetwork}
            origin={p.data.origin}
            updateOrigin={p.updateOrigin}
            userProfile={p.userProfile}
          />
        </Dock>
        <div className='main-map'>
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
            activeNeighborhoodBounds={p.activeNeighborhoodBounds}
            activeNetworkIndex={p.activeNetworkIndex}
            clearStartAndEnd={this._clearStartAndEnd}
            detailNeighborhood={p.detailNeighborhood}
            displayNeighborhoods={p.displayPageNeighborhoods}
            end={p.geocoder.end}
            isLoading={p.isLoading}
            isochrones={p.isochrones}
            drawIsochrones={p.drawIsochrones}
            drawOpportunityDatasets={p.drawOpportunityDatasets}
            drawRoute={p.drawNeighborhoodRoute}
            neighborhoodBoundsExtent={p.neighborhoodBoundsExtent}
            origin={p.data.origin}
            pointsOfInterest={p.pointsOfInterest}
            routableNeighborhoods={p.routableNeighborhoods}
            showRoutes={this._showNeighborhoodRoutes()}
            setActiveNeighborhood={p.setActiveNeighborhood}
            setPage={p.setPage}
            setEndPosition={p.updateEndPosition}
            setShowDetails={p.setShowDetails}
            setShowListings={p.setShowListings}
            setStartPosition={p.updateStartPosition}
            showDetails={p.data.showDetails}
            showListings={p.data.showListings}
            dataListings={p.data.dataListings}
            start={p.geocoder.start}
            updateEnd={p.updateEnd}
            updateMap={p.updateMap}
            updateOrigin={p.updateOrigin}
            updateStart={p.updateStart}
          />
        </div>
      </div>
    )
  }
}
