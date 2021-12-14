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
  (activeNetworkIndex, networks, start, destination) => {
    const network = networks[activeNetworkIndex]
    if (!destination || !network) {
      return []
    }

    if (start &&
        start.position &&
        destination &&
        destination.lat &&
        destination.lon &&
        network &&
        network.ready &&
        network.originPoint &&
        network.paths &&
        network.targets
    ) {
      const end = {
        label: 'listing',
        position: lonlat([destination.lon, destination.lat])
      }
      /* Similar to network-neighborhood-listings,
      except only one destination so only one route returned */
      const result = memoizedTransitiveRoutes(network, destination.id, start, end)
      return {
        id: destination.id,
        label: 'listing', // not unique
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
  }
)
