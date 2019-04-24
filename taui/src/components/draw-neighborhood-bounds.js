// @flow
import React from 'react'
import {LayerGroup} from 'react-leaflet'

import {
  NEIGHBORHOOD_BOUNDS_STYLE,
  NEIGHBORHOOD_BOUNDS_HOVER_STYLE,
  NEIGHBORHOOD_NONROUTABLE_COLOR,
  NEIGHBORHOOD_ROUTABLE_COLOR
} from '../constants'

import VGrid from './vector-grid'

export default class DrawNeighborhoodBounds extends React.PureComponent {
  _key = 0
  _getKey () { return this._key++ }

  render () {
    const p = this.props
    return <LayerGroup key={`neighborhood-boundary-${this._getKey()}`}>
      {p.neighborhoods && <VGrid
        data={p.neighborhoods}
        idField='id'
        tooltip='town'
        onClick={p.clickNeighborhood}
        zIndex={p.zIndex}
        activeStyle={NEIGHBORHOOD_BOUNDS_STYLE}
        style={NEIGHBORHOOD_BOUNDS_HOVER_STYLE}
        vectorTileLayerStyles={
          {'sliced': (properties) => {
            return Object.assign({}, NEIGHBORHOOD_BOUNDS_STYLE, {
              color: properties.routable
                ? NEIGHBORHOOD_ROUTABLE_COLOR
                : NEIGHBORHOOD_NONROUTABLE_COLOR
            })
          }}
        }
      />}
    </LayerGroup>
  }
}
