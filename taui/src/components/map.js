// @flow
import lonlat from '@conveyal/lonlat'
import Leaflet from 'leaflet'
import React, {PureComponent} from 'react'
import {
  Map as LeafletMap,
  Marker,
  Popup,
  TileLayer,
  ZoomControl
} from 'react-leaflet'

import {NEIGHBORHOOD_BOUNDS_STYLE, STOP_STYLE} from '../constants'
import type {
  Coordinate,
  Location,
  LonLat,
  MapEvent
} from '../types'
import getActiveNeighborhood from '../utils/get-active-neighborhood'

import DrawNeighborhoods from './draw-neighborhoods'
import DrawRoute from './draw-route'
import Gridualizer from './gridualizer'
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
  className: 'LeafletIcon Start',
  html: iconHTML,
  iconAnchor,
  iconSize
})

const endIcon = Leaflet.divIcon({
  className: 'LeafletIcon End',
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

  _setEndWithEvent = (event: MapEvent) => {
    this.props.setEndPosition(lonlat(event.latlng || event.target._latlng))
  }

  _setStartWithEvent = (event: MapEvent) => {
    console.warn('should not trigger _setStartWithEvent')
    // this.props.setStartPosition(lonlat(event.latlng || event.target._latlng))
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

    // Index elements with keys to reset them when elements are added / removed
    this._key = 0
    let zIndex = 0
    const getZIndex = () => zIndex++

    const activeNeighborhood = p.neighborhoods
      ? getActiveNeighborhood(p.neighborhoods.features, p.activeNeighborhood)
      : null

    return (
      <LeafletMap
        center={p.centerCoordinates}
        className='Taui-Map'
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

        {p.drawOpportunityDatasets.map((drawTile, i) => drawTile &&
          <Gridualizer
            drawTile={drawTile}
            key={`draw-od-${i}-${this._getKey()}`}
            zIndex={getZIndex()}
            zoom={p.zoom}
          />)}

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

        {(!p.start || !p.end) && p.pointsOfInterest &&
          <VGrid
            data={p.pointsOfInterest}
            idField='label'
            key={`poi-${this._getKey()}`}
            minZoom={10}
            onClick={this._clickPoi}
            style={STOP_STYLE}
            tooltip='label'
            zIndex={getZIndex()}
          />}

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
            onDragEnd={this._setStartWithEvent}
            position={p.origin.position}
            zIndex={getZIndex()}>
            <Popup>
              <span>{p.origin.label}</span>
            </Popup>
          </Marker>}

        {activeNeighborhood &&
          <Marker
            draggable
            icon={endIcon}
            key={`end-${this._getKey()}`}
            position={lonlat.toLeaflet(activeNeighborhood.geometry.coordinates)}
            zIndex={getZIndex()}
          >
            <Popup>
              <span>{activeNeighborhood.properties.town} {activeNeighborhood.properties.id}</span>
            </Popup>
          </Marker>}

        {p.end &&
          <Marker
            draggable
            icon={endIcon}
            key={`end-${this._getKey()}`}
            onDragEnd={this._setEndWithEvent}
            position={p.end.position}
            zIndex={getZIndex()}
          >
            <Popup>
              <span>{p.end.label}</span>
            </Popup>
          </Marker>}

      </LeafletMap>
    )
  }
  /* eslint complexity: 1 */
}
