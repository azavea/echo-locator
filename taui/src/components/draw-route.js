// @flow
import get from 'lodash/get'
import React from 'react'
import {CircleMarker, FeatureGroup, Polyline} from 'react-leaflet'

export default class DrawRoute extends React.PureComponent {
  componentWillReceiveProps (nextProps) {
    // Zoom to active route on going to detail view
    if (nextProps.activeNeighborhood !== nextProps.id) {
      return
    }
    const needToZoom = nextProps.showDetails && !this.props.showDetails
    if (needToZoom) {
      if (this.refs) {
        const layer = get(this.refs, 'features.leafletElement')
        if (layer) {
          layer._map.fitBounds(layer.getBounds())
        }
      }
    }
  }

  render () {
    const p = this.props
    return <FeatureGroup ref='features'>
      {p.segments.map((segment, i) => {
        if (segment.type === 'WALK') {
          return <Polyline
            className='WalkSegment'
            key={`walk-segment-${i}`}
            positions={segment.positions}
            {...p.walkStyle}
          />
        } else {
          return <Polyline
            className='TransitSegment'
            key={`transit-segment-${i}`}
            {...p.transitStyle}
            positions={segment.positions}
            color={segment.color}
          />
        }
      })}
      {p.stops.map((s, i) =>
        <CircleMarker
          className='Stop'
          key={`stop-${i}`}
          center={s}
          {...p.stopStyle}
        />)}
    </FeatureGroup>
  }
}
