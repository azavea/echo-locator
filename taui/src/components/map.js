/* eslint-disable complexity */
// @flow
import lonlat from '@conveyal/lonlat'
import Leaflet from 'leaflet'
import debounce from 'lodash/debounce'
import get from 'lodash/get'
import React, {PureComponent} from 'react'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { Carousel } from 'react-responsive-carousel'
import {
  Map as LeafletMap,
  Marker,
  Popup,
  TileLayer,
  ZoomControl
} from 'react-leaflet'

import {NEIGHBORHOOD_ACTIVE_BOUNDS_STYLE} from '../constants'
import type {
  Coordinate,
  Location,
  LonLat,
  MapEvent
} from '../types'

import DrawNeighborhoodBounds from './draw-neighborhood-bounds'
import DrawRoute from './draw-route'
import VGrid from './vector-grid'

const L = window.L
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

const listingIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const otherIcon = Leaflet.divIcon({
  className: 'LeafletIcon Other map__marker map__marker--other',
  html: iconHTML,
  iconAnchor,
  iconSize
})

const childcare = '../../assets/img/mapIcons/Childcare_Pin.png'
const park = '../../assets/img/mapIcons/Park_Pin.png'
const grocery = '../../assets/img/mapIcons/Grocery_Pin.png'
const school = '../../assets/img/mapIcons/School_Pin.png'
const convenience = '../../assets/img/mapIcons/Convenience_Pin.png'
const health = '../../assets/img/mapIcons/Health_Pin.png'
const library = '../../assets/img/mapIcons/Library_Pin.png'
const community = '../../assets/img/mapIcons/Community_Pin.png'
const worship = '../../assets/img/mapIcons/Worship_Pin.png'

const childcareIcon = Leaflet.icon({
  iconUrl: childcare,
  iconAnchor,
  iconSize
})

const parkIcon = Leaflet.icon({
  iconUrl: park,
  iconAnchor,
  iconSize
})

const groceryIcon = Leaflet.icon({
  iconUrl: grocery,
  iconAnchor,
  iconSize
})

const schoolIcon = Leaflet.icon({
  iconUrl: school,
  iconAnchor,
  iconSize
})

const convenienceIcon = Leaflet.icon({
  iconUrl: convenience,
  iconAnchor,
  iconSize
})

const healthIcon = Leaflet.icon({
  iconUrl: health,
  iconAnchor,
  iconSize
})

const libraryIcon = Leaflet.icon({
  iconUrl: library,
  iconAnchor,
  iconSize
})

const communityIcon = Leaflet.icon({
  iconUrl: community,
  iconAnchor,
  iconSize
})

const worshipIcon = Leaflet.icon({
  iconUrl: worship,
  iconAnchor,
  iconSize
})

const amenityIcons = {
  childcare: childcareIcon,
  park: parkIcon,
  grocery: groceryIcon,
  school: schoolIcon,
  convenience: convenienceIcon,
  health: healthIcon,
  library: libraryIcon,
  community: communityIcon,
  worship: worshipIcon
}

type Props = {
  activeAmenities: object[],
  centerCoordinates: Coordinate,
  clearStartAndEnd: () => void,
  drawIsochrones: Function[],
  drawListingRoute: any,
  drawOpportunityDatasets: Function[],
  drawRoute: any,
  end: null | Location,
  isLoading: boolean, // FeatureCollection
  pointsOfInterest: void | any,
  routableNeighborhoods: any,
  setEndPosition: LonLat => void,
  setStartPosition: LonLat => void,
  start: null | Location,
  updateEnd: () => void,
  updateMap: any => void,
  updateOrigin: () => void,
  updateStart: () => void,
  zoom: number,
}

type State = {
  lastClickedLabel: null | string,
  lastClickedPosition: null | Coordinate,
  showSelectStartOrEnd: boolean,
}

/**
 *
 */
export default class Map extends PureComponent<Props, State> {
  constructor (props) {
    super(props)

    this.listingPopup = this.listingPopup.bind(this)
    this.clickNeighborhood = this.clickNeighborhood.bind(this)
    this.hoverNeighborhood = this.hoverNeighborhood.bind(this)
    this.amenityPopup = this.amenityPopup.bind(this)
    this.extractAmenityAddress = this.extractAmenityAddress.bind(this)
    this.handleAmenityTypeText = this.handleAmenityTypeText.bind(this)
  }

  state = {
    lastClickedLabel: null,
    lastClickedPosition: null,
    showSelectStartOrEnd: false,
    showListingRoute: false
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

  /*
    this.state.data.map((item, key) =>
      <Marker
        icon={otherIcon}
        key={`listings-${this._getKey()}`}
        position={[item.lat,item.lon]}
        zIndex={getZIndex()}>
      </Marker>
    )
  */

  extractAmenityAddress (address) {
    var strAddress = ''

    if (address['housenumber'] !== undefined) {
      strAddress += address['housenumber'] + ' '
    }
    if (address['street'] !== undefined) {
      strAddress += address['street'] + ', '
    }
    if (address['state'] !== undefined) {
      strAddress += address['state'] + ' '
    }
    if (address['postcode'] !== undefined) {
      strAddress += address['postcode'] + ' '
    }

    return strAddress
  }

  handleAmenityTypeText (tipo, subtipo, religion) {
    var result = ''
    if (subtipo === '') {
      return tipo.charAt(0).toUpperCase() + tipo.slice(1)
    }

    if (tipo === 'worship') {
      const d = religion['denomination']
      const r = religion['religion']
      if (d !== undefined) {
        result += d.charAt(0).toUpperCase() + d.slice(1)
      }
      if (r !== undefined) {
        result += ' ' + r.charAt(0).toUpperCase() + r.slice(1)
      }
      return result
    }

    if (subtipo.includes('_')) {
      const words = subtipo.split('_')
      for (var i in words) {
        var w = words[i]
        result += w.charAt(0).toUpperCase() + w.slice(1) + ' '
      }
      return result
    }

    result = subtipo.charAt(0).toUpperCase() + subtipo.slice(1)
    return result
  }

  amenityPopup (amenity) {
    amenity = amenity['properties']

    // might have _ in it (up to 2)
    const tipo = this.handleAmenityTypeText(amenity['type'], amenity['subtype'], amenity['religion'])
    const name = amenity['name']
    const address = this.extractAmenityAddress(amenity['address'])
    return (
      <div className='map__amenity-popup'>
        <p>{tipo} <br />
          {name} <br />
          {address} <br />
        </p>
      </div>
    )
  }

  listingPopup (photos, address, community, price, url, beds) {
    return (
      <div className='map__popup'>
        <Carousel showIndicators={false} dynamicHeight showThumbs={false} showArrows>
          {photos.map((item, key) =>
            <div key={`listings-image-${this._getKey()}`}>
              <img src={item.href} /> <br />
            </div>
          )}
        </Carousel>
        <div className='map__popup-contents'>
          <h1>{community && <div>Price: ${community.price_min} - ${community.price_max}/month</div>}</h1>
          <h1>{price && <div>Price: ${price}/month</div>}</h1>
          <h2>{beds && <div>${beds} Bed</div>}</h2>
          <div className='map__popup__line' />
          <p>{address.line} <br /></p>
          <div className='map__popup__url-wrapper'>
            <a className='map__popup__url' href={url} target='_blank'>Go to Apartment</a>
          </div>
        </div>
      </div>
    )
  }
  // Click on map marker for a neighborhood
  clickNeighborhood = (feature) => {
    // only go to routable neighborhood details
    if (feature.properties.routable) {
      this.props.setShowBHAListings(false)
      this.props.setShowRealtorListings(false)
      this.setState({showListingRoute: false})
      this.props.setActiveListing(null)
      this.props.setShowDetails(true)
      this.props.setActiveNeighborhood(feature.properties.id)
    } else {
      console.warn('clicked unroutable neighborhood ' + feature.properties.id)
    }
  }

  clickListing = (lat, lon) => {
    this.props.setActiveListing([lon, lat])
    this.setState({showListingRoute: true})
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

  /**
   * Reset state
   */
  _clearState () {
    this.setState({
      lastClickedLabel: null,
      lastClickedPosition: null,
      showSelectStartOrEnd: false,
      showListingRoute: false
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
    const hoverNeighborhood = this.hoverNeighborhood
    const styleNeighborhood = this.styleNeighborhood
    const listingPopup = this.listingPopup
    const clickListing = this.clickListing

    // Index elements with keys to reset them when elements are added / removed
    this._key = 0
    let zIndex = 0
    const getZIndex = () => zIndex++

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

        {p.showRoutes && p.drawRoute && !this.state.showListingRoute &&
          <DrawRoute
            {...p.drawRoute}
            activeNeighborhood={p.activeNeighborhood}
            key={`draw-routes-${p.drawRoute.id}-${this._getKey()}`}
            showDetails={p.showDetails}
            zIndex={getZIndex()}
          />}

        {!p.isLoading && p.routableNeighborhoods &&
          <DrawNeighborhoodBounds
            key={`start-${this._getKey()}`}
            clickNeighborhood={clickNeighborhood}
            hoverNeighborhood={hoverNeighborhood}
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

        {/*
          this.state.data.map((item, key) =>
            <Marker
              icon={otherIcon}
              key={`listings-${this._getKey()}`}
              position={[item.lat,item.lon]}
              zIndex={getZIndex()}>
            </Marker>
          )
        */}

        {
          p.showRealtorListings && p.dataListings.map((item, key) => {
            console.log(item)
            var apartmentMarker =
              <Marker
                icon={listingIcon}
                key={`listings-${this._getKey()}`}
                position={[item.address.lat, item.address.lon]}
                zIndex={getZIndex()}
                onClick={(e) => {
                  clickListing(item.address.lat, item.address.lon)
                  e.target.openPopup()
                }}
                onMouseOver={(e) => {
                  e.target.openPopup()
                }}
                onMouseOut={(e) => {
                  if (!this.state.showListingRoute) {
                    e.target.closePopup()
                  }
                }}>

                <Popup>
                  {listingPopup(item.photos, item.address, item.community, item.price, item.rdc_web_url, item.beds)}
                </Popup>

              </Marker>
            return apartmentMarker
          })
        }

        {
          p.showBHAListings && p.bhaListings.map((item, key) => {
            var apartmentMarker =
              <Marker
                icon={listingIcon}
                key={`listings-${this._getKey()}`}
                position={[item.latLon.lat, item.latLon.lng]}
                zIndex={getZIndex()}
                onClick={(e) => {
                  clickListing(item.address.lat, item.address.lon)
                  e.target.openPopup()
                }}
                onMouseOver={(e) => {
                  e.target.openPopup()
                }}
                onMouseOut={(e) => {
                  if (!this.state.showListingRoute) {
                    e.target.closePopup()
                  }
                }}>

                <Popup>
                  {listingPopup(item.photos, item.address, item.community, item.Rent, item.rdc_web_url, item.beds)}
                </Popup>

              </Marker>
            return apartmentMarker
          })
        }

        {
          p.activeNeighborhood && p.activeAmenities.map((item) => {
            const amenityType = item.properties.type
            const icon = amenityIcons[amenityType]
            const lat = parseFloat(item.location[1])
            const long = parseFloat(item.location[0])
            return (
              <Marker
                icon={icon}
                key={`amenities-${this._getKey()}`}
                position={[lat, long]}
                zIndex={getZIndex()}>
                <Popup>
                  {this.amenityPopup(item)}
                </Popup>
              </Marker>
            )
          })
        }

        {(p.showBHAListings || p.showRealtorListings) && this.state.showListingRoute && p.drawListingRoute &&
          <DrawRoute
            {...p.drawListingRoute}
            activeNeighborhood={p.activeNeighborhood}
            key={`draw-routes-${p.drawRoute.id}-${this._getKey()}`}
            showDetails={p.showDetails}
            zIndex={getZIndex()}
          />}

        {!p.showDetails && p.displayNeighborhoods && p.displayNeighborhoods.length &&
          p.displayNeighborhoods.map((n) =>
            <Marker
              icon={n.properties.id === p.activeNeighborhood ? endIcon : otherIcon}
              key={`n-${n.properties.id}-${this._getKey()}`}
              onClick={(e) => clickNeighborhood(n)}
              onHover={(e) => hoverNeighborhood(n)}
              position={lonlat.toLeaflet(n.geometry.coordinates)}
              zIndex={getZIndex()}
            />)
        }
      </LeafletMap> : null
    )
  }
  /* eslint complexity: 1 */
}
