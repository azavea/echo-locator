// @flow
import React from 'react'
import {LayerGroup} from 'react-leaflet'

import {
  NEIGHBORHOOD_BOUNDS_STYLE,
  NEIGHBORHOOD_HOVER_COLOR,
  NEIGHBORHOOD_NONROUTABLE_COLOR,
  NEIGHBORHOOD_ROUTABLE_COLOR
} from '../constants'

import VGrid from './vector-grid'

export default class DrawNeighborhoodBounds extends React.PureComponent {
  _key = 0
  _getKey () { return this._key++ }

  hoverStyle = (feature) => {
    return Object.assign({}, NEIGHBORHOOD_BOUNDS_STYLE, {
      fillColor: feature.active || feature.routable
        ? NEIGHBORHOOD_HOVER_COLOR
        : NEIGHBORHOOD_NONROUTABLE_COLOR
    })
  }

  render () {
    const p = this.props
    const hoverStyle = this.hoverStyle
    return <LayerGroup key={`neighborhood-boundary-${this._getKey()}`}>
      {p.neighborhoods && <VGrid
        data={p.neighborhoods}
        idField='id'
        tooltip='town'
        hoverStyle={(feature) => hoverStyle(feature)}
        onClick={p.clickNeighborhood}
        onMouseover={p.hoverNeighborhood}
        zIndex={p.zIndex}
        style={NEIGHBORHOOD_BOUNDS_STYLE}
        vectorTileLayerStyles={
          {'sliced': (properties) => {
            return Object.assign({}, NEIGHBORHOOD_BOUNDS_STYLE, {
              fillColor: properties.active
                ? NEIGHBORHOOD_HOVER_COLOR
                : (properties.routable
                  ? NEIGHBORHOOD_ROUTABLE_COLOR
                  : NEIGHBORHOOD_NONROUTABLE_COLOR)
            })
          }}
        }
      />}
    </LayerGroup>
  }
}
