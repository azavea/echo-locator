// @flow
import lonlat from '@conveyal/lonlat'
import get from 'lodash/get'
import memoize from 'lodash/memoize'
import {createSelector} from 'reselect'

import createTransitiveRoutes from '../utils/create-transitive-routes'
import createDirectRoutes from '../utils/create-direct-routes'

import selectActiveNetworkIndex from './active-network-index'

/**
 * This assumes loaded query, paths, and targets.
 */
const memoizedTransitiveRoutes = memoize(
  (n, i, s, e, car) => (car ? createDirectRoutes(n, s, e) : createTransitiveRoutes(n, s, e)),
  (n, i, s, e, car) =>
    `${n.name}-${i}-${n.originPoint.x}-${n.originPoint.y}-${lonlat.toString(e.position)}-car-${car}`
)

const routeToString = s =>
  s.map(s => `${s.name}-${s.backgroundColor}-${s.type}`).join('-')

const uniqueSegments = routeSegments => {
  const foundKeys = {}
  return (routeSegments || []).reduce((uniqueRoutes, route) => {
    const key = routeToString(route)
    if (!foundKeys[key]) {
      foundKeys[key] = true
      return [...uniqueRoutes, route]
    }
    return uniqueRoutes
  }, [])
}

export default createSelector(
  selectActiveNetworkIndex,
  state => get(state, 'data.networks'),
  state => get(state, 'data.origin'),
  state => get(state, 'data.neighborhoods'),
  state => get(state, 'data.userProfile'),
  (activeNetworkIndex, networks, start, neighborhoods, profile) => {
    const network = networks[activeNetworkIndex]
    if (!neighborhoods || !neighborhoods.features || !neighborhoods.features.length || !network) {
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
        const result = memoizedTransitiveRoutes(network, neighborhoodIndex, start, end, profile.hasVehicle)
        routes.push({
          id: neighborhood.properties.id,
          label: neighborhood.properties.town, // not unique
          journeys: result.journeys,
          patterns: result.patterns,
          places: result.places,
          routes: result.routes,
          routeSegments: uniqueSegments(result.routeSegments),
          stops: result.stops
        })
      } else {
        return []
      }
    })
    return routes
  }
)
