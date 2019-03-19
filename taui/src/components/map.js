// @flow
import lonlat from '@conveyal/lonlat'
import Icon from '@conveyal/woonerf/components/icon'
import message from '@conveyal/woonerf/message'
import Leaflet from 'leaflet'
import find from 'lodash/find'
import React, {PureComponent} from 'react'
import {
  Map as LeafletMap,
  Marker,
  Popup,
  TileLayer,
  ZoomControl
} from 'react-leaflet'
import VectorGrid from 'react-leaflet-vectorgrid/dist/react-leaflet-vectorgrid'

import {STOP_STYLE} from '../constants'
import type {
  Coordinate,
  Location,
  LonLat,
  MapEvent
} from '../types'

import DrawRoute from './draw-route'
import Gridualizer from './gridualizer'

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
 * Temporary class that fixes VectorGrid's `getFeature`
 */
class VGrid extends VectorGrid {
  _propagateEvent (eventHandler, e) {
    if (!eventHandler) return
    const featureId = this._getFeatureId(e.layer)
    const feature = this.getFeature(featureId)
    if (feature) {
      Leaflet.DomEvent.stopPropagation(e)
      eventHandler(feature)
    }
  }

  createLeafletElement (props) {
    const le = super.createLeafletElement(props)
    le.options.rendererFactory = Leaflet.canvas.tile
    return le
  }

  getFeature (featureId) {
    const p = this.props
    return find(p.data.features, f => f.properties[p.idField] === featureId)
  }
}

/**
 *
 */
export default class Map extends PureComponent<Props, State> {
  state = {
    lastClickedLabel: null,
    lastClickedPosition: null,
    showSelectStartOrEnd: false
  }

  componentDidCatch (error) {
    console.error(error)
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

  _clickNeighborhood = (feature) => {
    // TODO: #27 implement interactivity
    console.log('clicked neighborhood:')
    console.log(feature)
    this.props.setActiveNeighborhood(feature.properties.id)
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

    // Index elements with keys to reset them when elements are added / removed

    this._key = 0
    let zIndex = 0
    const getZIndex = () => zIndex++

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
            zIndex={getZIndex()} />}

        {!p.isLoading && p.neighborhoods &&
          <VGrid
            data={p.neighborhoods}
            style={STOP_STYLE}
            idField='id'
            tooltip='town'
            onClick={this._clickNeighborhood}
            zIndex={getZIndex()} />}

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
