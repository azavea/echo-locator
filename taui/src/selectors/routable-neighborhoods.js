// @flow
import find from 'lodash/find'
import get from 'lodash/get'
import map from 'lodash/map'
import {createSelector} from 'reselect'

import networkNeighborhoodRoutes from './network-neighborhood-routes'

export default createSelector(
  networkNeighborhoodRoutes,
  state => get(state, 'data.neighborhoods'),
  (neighborhoodRoutes, neighborhoods) => {
    if (!neighborhoodRoutes || !neighborhoodRoutes.length) {
      return neighborhoods
    }
    const routableNeighborhoods = map(neighborhoods.features, n => {
      const route = find(neighborhoodRoutes, r => r.id === n.properties.id)
      const routable = route && route.journeys && route.journeys.length
      const neighborhood = Object.assign({}, n)
      neighborhood.properties.routable = routable
      return neighborhood
    })

    const result = Object.assign({}, neighborhoods, {features: routableNeighborhoods})
    console.log('recalculated routable neighborhoods')
    return result
  }
)
