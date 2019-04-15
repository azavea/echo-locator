// @flow
import React from 'react'
import {LayerGroup} from 'react-leaflet'

import {
  NEIGHBORHOOD_NONROUTABLE_COLOR,
  NEIGHBORHOOD_ROUTABLE_COLOR,
  NEIGHBORHOOD_STYLE
} from '../constants'

import VGrid from './vector-grid'

export default class DrawNeighborhoods extends React.PureComponent {
  _key = 0
  _getKey () { return this._key++ }

  render () {
    const p = this.props
    return <LayerGroup key={`neighborhoods-${this._getKey()}`}>
      {p.neighborhoods && <VGrid
        data={p.neighborhoods}
        idField='id'
        tooltip='town'
        zIndex={p.zIndex}
        onClick={p.clickNeighborhood}
        activeStyle={{color: NEIGHBORHOOD_NONROUTABLE_COLOR}}
        style={NEIGHBORHOOD_STYLE}
        vectorTileLayerStyles={
          {'sliced': (properties) => {
            return Object.assign({}, NEIGHBORHOOD_STYLE, {
              color: properties.routable
                ? NEIGHBORHOOD_ROUTABLE_COLOR
                : NEIGHBORHOOD_NONROUTABLE_COLOR,
              fillColor: properties.routable
                ? NEIGHBORHOOD_ROUTABLE_COLOR
                : NEIGHBORHOOD_NONROUTABLE_COLOR
            })
          }}
        } />}
    </LayerGroup>
  }
}
