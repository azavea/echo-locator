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
import AmenitiesBar from './amenities-bar'

type State = {
    amenitiesData: object[],
    componentError: null,
}

/**
 * Displays map and sidebar.
 */
export default class MainPage extends React.PureComponent<Props, State> {
  constructor (props) {
    super(props)
    this.state = {
      componentError: null,
      amenitiesData: []
    }
    this._updateAmenityData = this._updateAmenityData.bind(this)
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

  _updateAmenityData (amenities: object[]) {
    var updatedAmenities = []
    for (var i in amenities) {
      var subAmenities = amenities[i]
      for (var j in subAmenities) {
        updatedAmenities.push(subAmenities[j])
      }
    }
    this.setState({amenitiesData: updatedAmenities})
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
          activeListing={p.data.activeListing}
          listingTravelTime={p.listingTravelTime}
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
          setBHAListings={p.setBHAListings}
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
          <div className='amenities-bar'>
            <AmenitiesBar
              activeNeighborhood={p.data.activeNeighborhood}
              clickedNeighborhood={p.data.showDetails}
              amenities={p.data.amenities}
              updateMapAmenities={this._updateAmenityData}
            />
          </div>
          <Map
            {...p.map}
            activeNeighborhood={p.data.activeNeighborhood}
            activeListing={p.data.activeListing}
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
            drawListingRoute={p.drawListingRoute}
            neighborhoodBoundsExtent={p.neighborhoodBoundsExtent}
            origin={p.data.origin}
            pointsOfInterest={p.pointsOfInterest}
            routableNeighborhoods={p.routableNeighborhoods}
            showRoutes={this._showNeighborhoodRoutes()}
            setActiveNeighborhood={p.setActiveNeighborhood}
            setActiveListing={p.setActiveListing}
            setListingRoute={p.setListingRoute}
            setPage={p.setPage}
            setEndPosition={p.updateEndPosition}
            setShowDetails={p.setShowDetails}
            setShowListings={p.setShowListings}
            setStartPosition={p.updateStartPosition}
            showDetails={p.data.showDetails}
            showListings={p.data.showListings}
            dataListings={p.data.dataListings}
            bhaListings={p.data.bhaListings}
            start={p.geocoder.start}
            updateEnd={p.updateEnd}
            updateMap={p.updateMap}
            updateOrigin={p.updateOrigin}
            updateStart={p.updateStart}
            activeAmenities={this.state.amenitiesData}
          />
        </div>
      </div>
    )
  }
}
