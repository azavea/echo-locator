// @flow
import lonlat from '@conveyal/lonlat'
import Leaflet from 'leaflet'
import filter from 'lodash/filter'
import React, {PureComponent} from 'react'
import {
  Map as LeafletMap,
  Marker,
  Popup,
  TileLayer,
  ZoomControl
} from 'react-leaflet'

import {NEIGHBORHOOD_BOUNDS_STYLE} from '../constants'
import type {
  Coordinate,
  Location,
  LonLat,
  MapEvent
} from '../types'
import getNeighborhoodById from '../utils/get-neighborhood'

import DrawNeighborhoods from './draw-neighborhoods'
import DrawRoute from './draw-route'
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
const iconHTML = '' // <div className="innerMarker"></div>'

const startIcon = Leaflet.divIcon({
  className: 'LeafletIcon Start map__marker map__marker--start',
  html: iconHTML,
  iconAnchor,
  iconSize
})

const endIcon = Leaflet.divIcon({
  className: 'LeafletIcon End map__marker map__marker--end',
  html: iconHTML,
  iconAnchor,
  iconSize
})

const otherIcon = Leaflet.divIcon({
  className: 'LeafletIcon Other map__marker map__marker--other',
  html: iconHTML,
  iconAnchor,
  iconSize
})

type Props = {
  allTransitiveData: any[],
  centerCoordinates: Coordinate,
  clearStartAndEnd: () => void,
  drawIsochrones: Function[],
  drawOpportunityDatasets: Function[],
  drawRoutes: any[],
  end: null | Location,
  isLoading: boolean,
  neighborhoodBounds: any,
  neighborhoods: any,
  pointsOfInterest: void | any, // FeatureCollection
  setEndPosition: LonLat => void,
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
  showSelectStartOrEnd: boolean
}

/**
 *
 */
export default class Map extends PureComponent<Props, State> {
  constructor (props) {
    super(props)
    this.clickNeighborhood = this.clickNeighborhood.bind(this)
  }

  state = {
    lastClickedLabel: null,
    lastClickedPosition: null,
    showSelectStartOrEnd: false
  }

  componentDidCatch (error) {
    console.error(error)
  }

  // Click on map marker for a neighborhood
  clickNeighborhood = (feature) => {
    // only go to routable neighborhood details
    if (feature.properties.routable) {
      this.props.setActiveNeighborhood(feature.properties.id)
      this.props.setShowDetails(true)
    } else {
      console.warn('clicked unroutable neighborhood ' + feature.properties.id)
    }
  }

  /**
   * Reset state
   */
  _clearState () {
    this.setState({
      lastClickedLabel: null,
      lastClickedPosition: null,
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

    const otherNeighborhoods = (p.displayNeighborhoods && !p.showDetails)
      ? filter(p.displayNeighborhoods, n => !n.active)
      : []

    // Index elements with keys to reset them when elements are added / removed
    this._key = 0
    let zIndex = 0
    const getZIndex = () => zIndex++

    const activeNeighborhood = p.neighborhoods
      ? getNeighborhoodById(p.neighborhoods.features, p.activeNeighborhood)
      : null

    return (
      <LeafletMap
        center={p.centerCoordinates}
        className='Taui-Map map'
        onZoomend={this._setZoom}
        zoom={p.zoom}
        onClick={this._onMapClick}
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

        {p.showRoutes && p.drawRoutes.map(drawRoute =>
          <DrawRoute
            {...drawRoute}
            key={`draw-routes-${drawRoute.id}-${this._getKey()}`}
            zIndex={getZIndex()}
          />)}

        {!p.isLoading && p.neighborhoodBounds &&
          <VGrid
            data={p.neighborhoodBounds}
            idField='id'
            tooltip='town'
            vectorTileLayerStyles={
              {'sliced': NEIGHBORHOOD_BOUNDS_STYLE}
            }
            zIndex={getZIndex()} />}

        {!p.isLoading && p.neighborhoods &&
          <DrawNeighborhoods
            clickNeighborhood={clickNeighborhood}
            neighborhoods={p.neighborhoods}
            key={`neighborhoods-${this._getKey()}`}
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

        {activeNeighborhood &&
          <Marker
            icon={endIcon}
            key={`end-${this._getKey()}`}
            position={lonlat.toLeaflet(activeNeighborhood.geometry.coordinates)}
            zIndex={getZIndex()}
          >
            <Popup>
              <span>{activeNeighborhood.properties.town} {activeNeighborhood.properties.id}</span>
            </Popup>
          </Marker>}

        {otherNeighborhoods && otherNeighborhoods.length &&
          otherNeighborhoods.map((other) =>
            <Marker
              icon={otherIcon}
              key={`other-${other.properties.id}-${this._getKey()}`}
              position={lonlat.toLeaflet(other.geometry.coordinates)}
              zIndex={getZIndex()}
            >
              <Popup>
                <span>{other.properties.town} {other.properties.id}</span>
              </Popup>
            </Marker>)}
      </LeafletMap>
    )
  }
  /* eslint complexity: 1 */
}
