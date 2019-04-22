// @flow
import filter from 'lodash/filter'
import get from 'lodash/get'
import {createSelector} from 'reselect'

import filteredNeighborhoods from './filtered-neighborhoods-with-routes'

export default createSelector(
  filteredNeighborhoods,
  state => get(state, 'data.neighborhoodBounds'),
  state => get(state, 'data.useNonECC'),
  (filteredNeighborhoods, neighborhoodBounds, useNonECC) => {
    if (useNonECC || !neighborhoodBounds) {
      return neighborhoodBounds
    }
    const filteredFeatures = filter(neighborhoodBounds.features, n => n.properties.ecc)
    return Object.assign({}, neighborhoodBounds, {features: filteredFeatures})
  }
)
