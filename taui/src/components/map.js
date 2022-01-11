// @flow
import lonlat from '@conveyal/lonlat'
import Leaflet from 'leaflet'
import debounce from 'lodash/debounce'
import get from 'lodash/get'
import React, {PureComponent} from 'react'
import { withTranslation } from 'react-i18next'
import {
  Map as LeafletMap,
  Marker,
  Popup,
  TileLayer,
  ZoomControl
} from 'react-leaflet'

import {NEIGHBORHOOD_ACTIVE_BOUNDS_STYLE} from '../constants'
import type {
  ActiveListing,
  Coordinate,
  Location,
  LonLat,
  MapEvent,
  Listing
} from '../types'
import standardizeData from '../utils/standardize-listings-data'

import DrawNeighborhoodBounds from './draw-neighborhood-bounds'
import DisplayRouteLayers from './display-route-layers'
import VGrid from './vector-grid'

const TILE_URL = Leaflet.Browser.retina && process.env.LEAFLET_RETINA_URL
  ? process.env.LEAFLET_RETINA_URL
  : process.env.LEAFLET_TILE_URL

const LABEL_URL = Leaflet.Browser.retina && process.env.LABEL_RETINA_URL
  ? process.env.LABEL_RETINA_URL
  : process.env.LABEL_URL

const TILE_OPTIONS = {
  attribution: process.env.LEAFLET_ATTRIBUTION,
  tileSize: 512,
  zoomOffset: -1
}

const iconWidth = 20
const iconHeight = 20
const iconSize = [iconWidth, iconHeight]
const iconAnchor = [iconWidth / 2, iconHeight + 13] // height plus the pointer size
const popupAnchor = [-1, (-iconHeight) - 12] // height minus ~the pointer size
const iconHTML = '' // <div className="innerMarker"></div>'

const endIcon = Leaflet.divIcon({
  className: 'LeafletIcon End map__marker map__marker--end',
  html: iconHTML,
  iconAnchor,
  iconSize
})

const startIcon = Leaflet.divIcon({
  className: 'LeafletIcon Start map__marker map__marker--start',
  html: iconHTML,
  iconAnchor,
  iconSize
})

const listingIcon = Leaflet.divIcon({
  className: 'LeafletIcon Listing map__marker map__marker--listing',
  html: iconHTML,
  iconSize: iconSize,
  iconAnchor: iconAnchor,
  popupAnchor: popupAnchor
})

const otherIcon = Leaflet.divIcon({
  className: 'LeafletIcon Other map__marker map__marker--other',
  html: iconHTML,
  iconAnchor,
  iconSize
})

type Props = {
  activeListing: ActiveListing,
  bhaListings: Listing,
  centerCoordinates: Coordinate,
  clearStartAndEnd: () => void,
  drawIsochrones: Function[],
  drawListingRoute: {},
  drawNeighborhoodRoute: any,
  drawOpportunityDatasets: Function[],
  end: null | Location,
  hasVehicle: Boolean,
  isLoading: boolean,
  pointsOfInterest: void | any, // FeatureCollection
  realtorListings: Listing,
  routableNeighborhoods: any,
  setEndPosition: LonLat => void,
  setShowBHAListings: Function => void,
  setShowRealtorListings: Function => void,
  setStartPosition: LonLat => void,
  start: null | Location,
  updateEnd: () => void,
  updateMap: any => void,
  updateOrigin: () => void,
  updateStart: () => void,
  zoom: number
}

type State = {
  lastClickedLabel: null | string,
  lastClickedPosition: null | Coordinate,
  listingRouteDelay: null | setTimeout,
  showSelectStartOrEnd: boolean,
}

/**
 *
 */
class Map extends PureComponent<Props, State> {
  constructor (props) {
    super(props)
    this.clickNeighborhood = this.clickNeighborhood.bind(this)
    this.hoverNeighborhood = this.hoverNeighborhood.bind(this)
  }

  state = {
    lastClickedLabel: null,
    lastClickedPosition: null,
    listingRouteDelay: null,
    showSelectStartOrEnd: false
  }

  componentDidCatch (error) {
    console.error(error)
  }

  componentWillReceiveProps (nextProps) {
    const needToZoomOut = !nextProps.showDetails && this.props.showDetails
    const map = this.refs ? get(this.refs, 'map.leafletElement') : null

    if (needToZoomOut && nextProps.neighborhoodBoundsExtent) {
      map.fitBounds(nextProps.neighborhoodBoundsExtent)
    }
  }

  // Click on map marker for a neighborhood
  clickNeighborhood = (feature) => {
    // only go to routable neighborhood details
    if (feature.properties.routable) {
      this.props.setShowBHAListings(false)
      this.props.setShowRealtorListings(false)
      this.props.setShowDetails(true)
      this.props.setActiveListing(null)
      this.props.setActiveNeighborhood(feature.properties.id)
    } else {
      console.warn('clicked unroutable neighborhood ' + feature.properties.id)
    }
  }

  // Debounced version of setActiveNeighborhood used on hover
  debouncedSetActive = debounce(this.props.setActiveNeighborhood, 100)

  // Hover over neighborhood map bounds or marker
  hoverNeighborhood = (feature, event) => {
    if (this.props.showDetails || !feature || !feature.properties) return
    if (feature.properties.routable) {
      this.debouncedSetActive(feature.properties.id)
    }
  }

  /* Display listing routing on hover with 500ms delay, cancel on mouseout.
  On click, route immediately and do not cancel on mouseout */
  handleSetActiveListing = (event, detail) => {
    if (detail) {
      const listingDetail = {
        id: detail.id,
        lat: detail.lat,
        lon: detail.lon,
        type: detail.type
      }
      if (event.type === 'mouseover') {
        this.setState({listingRouteDelay: setTimeout(() => this.props.setActiveListing(listingDetail), 500)})
      } else if (event.type === 'mouseout') {
        clearTimeout(this.state.listingRouteDelay)
        this.setState({listingRouteDelay: null})
      } else if (event.type === 'click') {
        clearTimeout(this.state.listingRouteDelay)
        this.props.setActiveListing(listingDetail)
      }
    } else {
      this.props.setActiveListing(null)
    }
  }
  /*
  Create Popups:
  popupDetailOnHover on hover and open url link on click
  */
  popupDetailOnHover = (data) => {
    const {
      photos,
      rent,
      beds,
      address
    } = data
    const {t} = this.props
    const popupHeight = 320
    const popupWidth = 240
    const popupHeightNoPhotos = 160
    const calcHeight = photos && photos.length > 0 ? popupHeight : popupHeightNoPhotos
    return <div className='map__popup' style={{ width: popupWidth, height: calcHeight }}>
      {photos && photos.length > 0 &&
        <img className='map__popup__image' style={{
          width: '100%',
          height: 160,
          objectFit: 'cover',
          display: 'block'}} src={photos[0].href} key={`listings-image-${this._getKey()}`}
        />
      }
      <div className='map__popup-contents' style={{paddingTop: 20}}>
        {rent && <h1>{t('Map.PopupDetails.RentAmount', { rent: rent })}</h1>}
        {beds && <h2>{beds.split(' ')[0] + ' ' + t('NeighborhoodDetails.BedroomAbbr')}</h2>}
        <div className='map__popup__line' />
        {address && <h1>{address}</h1>}
        <p>{t('Map.PopupDetails.ClickForDetails')}</p>
      </div>
    </div>
  }

  /**
   * Reset state
   */
  _clearState () {
    clearTimeout(this.state.listingRouteDelay)
    this.setState({
      lastClickedLabel: null,
      lastClickedPosition: null,
      listingRouteDelay: null,
      showSelectStartOrEnd: false
    })
  }

  _clearStartAndEnd = (): void => {
    this.props.clearStartAndEnd()
    this._clearState()
  }

  _onMapClick = (e: Leaflet.MouseEvent): void => {
    this.setState((previousState) => ({
      lastClickedPosition: e.latlng || e.target._latlng,
      showSelectStartOrEnd: !previousState.showSelectStartOrEnd
    }))
  }

  _setEnd = (): void => {
    const p = this.props
    const s = this.state
    if (s.lastClickedPosition) {
      const position = lonlat(s.lastClickedPosition)
      if (s.lastClickedLabel) p.updateEnd({label: s.lastClickedLabel, position})
      else p.setEndPosition(position)
    }
    this._clearState()
  }

  _setStart = (): void => {
    const p = this.props
    const s = this.state
    if (s.lastClickedPosition) {
      const position = lonlat(s.lastClickedPosition)
      if (s.lastClickedLabel) p.updateStart({label: s.lastClickedLabel, position})
      else p.setStartPosition(position)
    }
    this._clearState()
  }

  _setZoom = (e: MapEvent) => {
    const zoom = e.target._zoom
    this.props.updateMap({zoom})
  }

  _clickPoi = (feature) => {
    this.setState({
      lastClickedLabel: feature.properties.label,
      lastClickedPosition: lonlat.toLeaflet(feature.geometry.coordinates),
      showSelectStartOrEnd: true
    })
  }

  _key = 0
  _getKey () { return this._key++ }

  /* eslint complexity: 0 */
  render () {
    const p = this.props
    const clickNeighborhood = this.clickNeighborhood
    const handleSetActiveListing = this.handleSetActiveListing
    const hoverNeighborhood = this.hoverNeighborhood
    const styleNeighborhood = this.styleNeighborhood
    const popupDetailOnHover = this.popupDetailOnHover

    // Index elements with keys to reset them when elements are added / removed
    this._key = 0
    let zIndex = 0
    const getZIndex = () => zIndex++

    /* Create Markers and Popups for BHA and Realtor Listings */
    const listingsMarker = (data) => {
      const {
        url,
        lat,
        lon
      } = data
      return <Marker
        icon={listingIcon}
        key={`listings-${this._getKey()}`}
        position={[lat, lon]}
        zIndex={getZIndex()}
        onClick={(e): ((e) => void) => {
          handleSetActiveListing(e, data)
          window.open(url, '_blank', 'noopener,noreferrer')
        }}
        onmouseover={(e): ((e) => void) => {
          handleSetActiveListing(e, data)
          e.target.openPopup()
        }}
        onmouseout={(e): ((e) => void) => {
          handleSetActiveListing(e, data)
          e.target.closePopup()
        }}
      >
        <Popup autoPan={false} closeButton={false} className='listing-detail-popup'>{popupDetailOnHover(data)}</Popup>
      </Marker>
    }

    const createMarkerWithStandardizedData = standardizeData(listingsMarker)
    return (
      p.routableNeighborhoods ? <LeafletMap
        bounds={p.neighborhoodBoundsExtent}
        center={p.centerCoordinates}
        className='Taui-Map map'
        onZoomend={this._setZoom}
        zoom={p.zoom}
        onClick={this._onMapClick}
        ref='map'
        zoomControl={false}
      >
        <ZoomControl position='topright' />
        <TileLayer
          {...TILE_OPTIONS}
          url={TILE_URL}
          zIndex={getZIndex()}
        />

        {LABEL_URL &&
          <TileLayer
            {...TILE_OPTIONS}
            key={`tile-layer-${this._getKey()}`}
            url={LABEL_URL}
            zIndex={getZIndex()}
          />}

        <DisplayRouteLayers
          activeListing={p.activeListing}
          drawListingRoute={p.drawListingRoute}
          drawNeighborhoodRoute={p.drawNeighborhoodRoute}
          getKey={this._getKey()}
          getZIndex={getZIndex()}
          hasVehicle={p.hasVehicle}
          neighborhood={p.activeNeighborhood}
          showDetails={p.showDetails}
          showRoutes={p.showRoutes}
        />

        {!p.isLoading && p.routableNeighborhoods &&
          <DrawNeighborhoodBounds
            key={`start-${this._getKey()}`}
            clickNeighborhood={clickNeighborhood}
            hoverNeighborhood={hoverNeighborhood}
            isLoading={p.isLoading}
            neighborhoods={p.routableNeighborhoods}
            styleNeighborhood={styleNeighborhood}
            zIndex={getZIndex()}
          />}

        {!p.isLoading && p.activeNeighborhoodBounds &&
          <VGrid
            data={p.activeNeighborhoodBounds}
            interactive={false}
            key={`active-bounds-${p.activeNeighborhood}-${this._getKey()}`}
            vectorTileLayerStyles={
              {'sliced': NEIGHBORHOOD_ACTIVE_BOUNDS_STYLE}
            }
            zIndex={getZIndex()}
          />}

        {p.origin &&
          <Marker
            icon={startIcon}
            key={`start-${this._getKey()}`}
            position={p.origin.position}
            zIndex={getZIndex()}>
            <Popup>
              <span>{p.origin.label}</span>
            </Popup>
          </Marker>}

        {p.showRealtorListings && p.realtorListings.data && p.realtorListings.data.map((item, key) => createMarkerWithStandardizedData(item, 'Realtor'))}

        {p.showBHAListings && p.bhaListings.data && p.bhaListings.data.map((item, key) => createMarkerWithStandardizedData(item, 'BHA'))}

        {!p.showDetails && p.displayNeighborhoods && p.displayNeighborhoods.length &&
          p.displayNeighborhoods.map((n) =>
            <Marker
              icon={n.properties.id === p.activeNeighborhood ? endIcon : otherIcon}
              key={`n-${n.properties.id}-${this._getKey()}`}
              onClick={(e) => clickNeighborhood(n)}
              onHover={(e) => hoverNeighborhood(n)}
              position={lonlat.toLeaflet(n.geometry.coordinates)}
              zIndex={getZIndex()}
            />)}
      </LeafletMap> : null
    )
  }
  /* eslint complexity: 1 */
}

export default withTranslation()(Map)
