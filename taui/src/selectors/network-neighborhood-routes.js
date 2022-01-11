// @flow
import lonlat from '@conveyal/lonlat'
import get from 'lodash/get'
import {createSelector} from 'reselect'

import {memoizedTransitiveRoutes} from '../utils/memoize-routes'
import uniqueSegments from '../utils/make-unique-segments'

import selectActiveNetworkIndex from './active-network-index'

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
