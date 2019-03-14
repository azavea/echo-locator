// @flow
import lonlat from '@conveyal/lonlat'
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'
import memoize from 'lodash/memoize'
import {createSelector} from 'reselect'

import createTransitiveRoutes from '../utils/create-transitive-routes'

/**
 * This assumes loaded query, paths, and targets.
 */
const memoizedTransitiveRoutes = memoize(
  (n, i, s, e) => createTransitiveRoutes(n, s, e),
  (n, i, s, e) =>
    `${n.name}-${i}-${n.originPoint.x}-${n.originPoint.y}-${lonlat.toString(e.position)}`
)

export default createSelector(
  state => get(state, 'data.networks'),
  state => get(state, 'geocoder.start'),
  state => get(state, 'data.neighborhoods'),
  (networks, start, neighborhoods) => {
    const networkIndex = findIndex(networks, n => !!n.active)
    if (networkIndex < 0) {
      return []
    }
    const network = networks[networkIndex]
    const td = network.transitive
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
        network.paths &&
        network.targets &&
        td.patterns
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
