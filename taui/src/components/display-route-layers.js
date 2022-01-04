// @flow
import React, {PureComponent} from 'react'

import type { ActiveListing } from '../types'

import DrawRoute from './draw-route'

type Props = {
  activeListing: ActiveListing,
  drawListingRoute: {},
  drawNeighborhoodRoute: any,
  getKey: any,
  getZIndex: any,
  hasVehicle: Boolean,
  neighborhood: String,
  showDetails: Boolean,
  showRoutes: Function => void
}
/**
 *
 */
export default class DisplayRouteLayers extends PureComponent<Props, State> {
  props: Props
  render () {
    const p = this.props
    return p.activeListing ? (
      p.drawListingRoute &&
        <DrawRoute
          {...p.drawListingRoute}
          activeNeighborhood={p.neighborhood}
          hasVehicle={p.hasVehicle}
          key={`draw-routes-${p.drawListingRoute.id}-${p.getKey}`}
          showDetails={p.showDetails}
          zIndex={p.getZIndex} />
    ) : (
      p.showRoutes && p.drawNeighborhoodRoute &&
        <DrawRoute
          {...p.drawNeighborhoodRoute}
          activeNeighborhood={p.neighborhood}
          hasVehicle={p.hasVehicle}
          key={`draw-routes-${p.drawNeighborhoodRoute.id}-${p.getKey}`}
          showDetails={p.showDetails}
          zIndex={p.getZIndex}
        />
    )
  }
}
