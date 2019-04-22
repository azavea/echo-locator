// @flow
import React from 'react'
import {LayerGroup} from 'react-leaflet'

import {
  NEIGHBORHOOD_BOUNDS_STYLE
} from '../constants'

import VGrid from './vector-grid'

export default class DrawNeighborhoodBounds extends React.PureComponent {
  _key = 0
  _getKey () { return this._key++ }

  render () {
    const p = this.props
    return <LayerGroup key={`neighborhood-boundary-${this._getKey()}`}>
      {p.neighborhoodBounds && <VGrid
        data={p.neighborhoodBounds}
        idField='id'
        zIndex={p.zIndex}
        activeStyle={NEIGHBORHOOD_BOUNDS_STYLE}
        style={NEIGHBORHOOD_BOUNDS_STYLE}
        vectorTileLayerStyles={
          {'sliced': (properties) => {
            return NEIGHBORHOOD_BOUNDS_STYLE
          }}
        }
      />}
    </LayerGroup>
  }
}
