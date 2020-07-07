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
  (n, s, e) => createTransitiveRoutes(n, s, e),
  (n, s, e) =>
    `${n.name}-${n.originPoint.x}-${n.originPoint.y}-${lonlat.toString(e.position)}`
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
  state => get(state, 'data.activeListing'),
  (activeNetworkIndex, networks, start, activeListing) => {
    const network = networks[activeNetworkIndex]
    if (!network || !activeListing) {
      return []
    }

    var routes = {}
    if (
      start &&
      start.position &&
      network &&
      network.ready &&
      network.originPoint &&
      network.paths &&
      network.targets &&
      activeListing
    ) {
      const end = {
        label: 'activeListing',
        position: lonlat(activeListing)
      }
      // journeys, places, routeSegments in result;
      // also repeated for all results: patterns, routes, stops
      const result = memoizedTransitiveRoutes(network, start, end)
      routes = {
        journeys: result.journeys,
        patterns: result.patterns,
        places: result.places,
        routes: result.routes,
        routeSegments: uniqueSegments(result.routeSegments),
        stops: result.stops
      }
    } else {
      return {}
    }
    return routes
  }
)
