// @flow
import { withTranslation } from 'react-i18next'
import React from 'react'
import {LayerGroup} from 'react-leaflet'

import {
  NEIGHBORHOOD_BOUNDS_STYLE,
  NEIGHBORHOOD_ROUTABLE_BOUNDS_STYLE
} from '../constants'

import VGrid from './vector-grid'

class DrawNeighborhoodBounds extends React.PureComponent {
  _key = 0
  _getKey () { return this._key++ }

  getTooltip = (feature, t) => {
    if (!feature || !feature.properties) return ''
    const {routable, town} = feature.properties
    const tooltipEl = document.createElement('div')
    const tooltipClass = routable ? 'map__tooltip-town' : 'map__tooltip-town map__tooltip-town--unroutable'
    tooltipEl.setAttribute('class', tooltipClass)
    const townText = document.createTextNode(routable ? town : town + ' (' + t('Map.Unreachable') + ')')
    tooltipEl.appendChild(townText)
    return tooltipEl
  }

  render () {
    const p = this.props
    const {t} = this.props
    const getTooltip = this.getTooltip
    return <LayerGroup key={`neighborhood-boundary-${this._getKey()}`}>
      {p.neighborhoods && <VGrid
        data={p.neighborhoods}
        idField='id'
        tooltip={(feature) => getTooltip(feature, t)}
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

export default withTranslation()(DrawNeighborhoodBounds)
