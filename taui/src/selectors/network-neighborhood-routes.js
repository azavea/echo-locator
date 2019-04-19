// @flow
import lonlat from '@conveyal/lonlat'
import filter from 'lodash/filter'
import get from 'lodash/get'
import memoize from 'lodash/memoize'
import {createSelector} from 'reselect'

import createTransitiveRoutes from '../utils/create-transitive-routes'

import selectActiveNetworkIndex from './active-network-index'

/**
 * This assumes loaded query, paths, and targets.
 */
const memoizedTransitiveRoutes = memoize(
  (n, i, s, e) => createTransitiveRoutes(n, s, e),
  (n, i, s, e) =>
    `${n.name}-${i}-${n.originPoint.x}-${n.originPoint.y}-${lonlat.toString(e.position)}`
)

export default createSelector(
  selectActiveNetworkIndex,
  state => get(state, 'data.activeNeighborhood'),
  state => get(state, 'data.networks'),
  state => get(state, 'data.origin'),
  state => get(state, 'data.neighborhoods'),
  state => get(state, 'data.useNonECC'),
  (activeNetworkIndex, activeNeighborhood, networks, start, neighborhoods, useNonECC) => {
    const network = networks[activeNetworkIndex]
    if (!neighborhoods || !neighborhoods.features || !neighborhoods.features.length || !network) {
      return []
    }

    const filteredNeighborhoods = useNonECC ? neighborhoods.features
      : filter(neighborhoods.features, n => n.properties.ecc)

    if (!filteredNeighborhoods.length) {
      return []
    }

    // Default to first neighborhood active, as does draw-neighborhood-routes
    if (!activeNeighborhood) {
      activeNeighborhood = filteredNeighborhoods[0].id
    }

    const routes = []
    filteredNeighborhoods.map((neighborhood, neighborhoodIndex) => {
      if (
        start &&
        start.position &&
        neighborhood.geometry &&
        neighborhood.geometry.coordinates &&
        network &&
        network.ready &&
        network.originPoint &&
        network.paths &&
        network.targets
      ) {
        const end = {
          label: neighborhood.properties.town,
          position: lonlat(neighborhood.geometry.coordinates)
        }
        // journeys, places, routeSegments in result;
        // also repeated for all results: patterns, routes, stops
        const result = memoizedTransitiveRoutes(network, neighborhoodIndex, start, end)
        routes.push({
          active: neighborhood.properties.id === activeNeighborhood,
          id: neighborhood.properties.id,
          label: neighborhood.properties.town, // not unique
          journeys: result.journeys,
          patterns: result.patterns,
          places: result.places,
          routes: result.routes,
          routeSegments: result.routeSegments,
          stops: result.stops
        })
      } else {
        return []
      }
    })
    return routes
  }
)
