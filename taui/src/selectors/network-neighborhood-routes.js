// @flow
import lonlat from '@conveyal/lonlat'
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
  state => get(state, 'data.networks'),
  state => get(state, 'data.origin'),
  state => get(state, 'data.neighborhoods'),
  (activeNetworkIndex, networks, start, neighborhoods) => {
    const network = networks[activeNetworkIndex]
    if (!neighborhoods || !neighborhoods.features || !neighborhoods.features.length) {
      return []
    }

    const routes = []
    neighborhoods.features.map((neighborhood, neighborhoodIndex) => {
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
          label: neighborhood.properties.town, // not unique
          journeys: result.journeys,
          places: result.places,
          routeSegments: result.routeSegments
        })
      } else {
        return []
      }
    })
    return routes
  }
)
