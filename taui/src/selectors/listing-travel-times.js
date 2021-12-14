// @flow
import lonlat from '@conveyal/lonlat'
import get from 'lodash/get'
import { isEmpty } from 'lodash'
import {createSelector} from 'reselect'

import {coordinateToIndex} from '../utils/coordinate-to-point'

import selectActiveNetworkIndex from './active-network-index'
import selectTravelTimeSurfaces from './travel-time-surfaces'

export default createSelector(
  selectActiveNetworkIndex,
  selectTravelTimeSurfaces,
  state => get(state, 'data.networks'),
  state => get(state, 'data.activeListing'),
  state => get(state, 'data.origin'),
  (activeNetworkIndex, surfaces, networks, listing, origin) => {
    const network = networks[activeNetworkIndex]
    const surface = surfaces[activeNetworkIndex]
    if (!network || !network.ready || !listing || isEmpty(listing) || !surface || !origin) {
      return []
    }
    const idx = coordinateToIndex(lonlat([listing.lon, listing.lat]), network)
    return surface.data[idx]
  }
)
