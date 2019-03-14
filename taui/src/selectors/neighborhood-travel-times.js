// @flow
import lonlat from '@conveyal/lonlat'
import find from 'lodash/find'
import get from 'lodash/get'
import {createSelector} from 'reselect'

import {coordinateToIndex} from '../utils/coordinate-to-point'

export default createSelector(
  state => get(state, 'data.networks'),
  state => get(state, 'data.neighborhoods'),
  (networks, neighborhoods) => {
    const network = find(networks, n => !!n.active)
    if (!network || !network.ready || !network.travelTimeSurface ||
      !network.travelTimeSurface.data) {
      return []
    }
    return neighborhoods.features.map(neighborhood => {
      const idx = coordinateToIndex(lonlat(neighborhood.geometry.coordinates), network)
      return network.travelTimeSurface.data[idx]
    })
  }
)
