import filter from 'lodash/filter'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import {createSelector} from 'reselect'

import selectNeighborhoodRoutes from './network-neighborhood-routes'
import travelTimes from './travel-times'

/**
 * NB: All positions are [latitude, longitude] as they go directly to Leaflet
 */
export default createSelector(
  selectNeighborhoodRoutes,
  travelTimes,
  state => get(state, 'data.neighborhoods'),
  (neighborhoodRoutes, travelTimes, neighborhoods) => {
    if (!neighborhoods || !neighborhoods.features || !neighborhoods.features.length ||
      !neighborhoodRoutes || !neighborhoodRoutes.length) {
      return []
    }
    const neighborhoodsWithRoutes = filter(neighborhoods.features.map((n, index) => {
      const route = neighborhoodRoutes[index]
      const active = route.active
      const segments = route.routeSegments
      const time = travelTimes[index]
      return Object.assign({active, segments, time}, n)
    }), n => n.segments && n.segments.length)

    return sortBy(neighborhoodsWithRoutes, 'time')
  }
)
