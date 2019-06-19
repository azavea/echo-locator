// @flow
import message from '@conveyal/woonerf/message'
import React from 'react'
import {LayerGroup} from 'react-leaflet'

import {
  NEIGHBORHOOD_BOUNDS_STYLE,
  NEIGHBORHOOD_ROUTABLE_BOUNDS_STYLE
} from '../constants'

import VGrid from './vector-grid'

export default class DrawNeighborhoodBounds extends React.PureComponent {
  _key = 0
  _getKey () { return this._key++ }

  getTooltip = (feature) => {
    if (!feature || !feature.properties) return ''
    const {routable, town} = feature.properties
    const tooltipEl = document.createElement('div')
    const tooltipClass = routable ? 'map__tooltip-town' : 'map__tooltip-town map__tooltip-town--unroutable'
    tooltipEl.setAttribute('class', tooltipClass)
    const townText = document.createTextNode(routable ? town : town + ' (' + message('Map.Unreachable') + ')')
    tooltipEl.appendChild(townText)
    return tooltipEl
  }

  render () {
    const p = this.props
    const getTooltip = this.getTooltip
    return <LayerGroup key={`neighborhood-boundary-${this._getKey()}`}>
      {p.neighborhoods && <VGrid
        data={p.neighborhoods}
        idField='id'
        tooltip={(feature) => getTooltip(feature)}
        tooltipClassName='map__tooltip'
        onClick={p.clickNeighborhood}
        onMouseover={p.hoverNeighborhood}
        zIndex={p.zIndex}
        style={NEIGHBORHOOD_BOUNDS_STYLE}
        vectorTileLayerStyles={
          {'sliced': (properties) => {
            return properties.routable
              ? NEIGHBORHOOD_ROUTABLE_BOUNDS_STYLE
              : NEIGHBORHOOD_BOUNDS_STYLE
          }}
        }
      />}
    </LayerGroup>
  }
}
