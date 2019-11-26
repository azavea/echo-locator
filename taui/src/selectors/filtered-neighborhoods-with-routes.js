// @flow
import filter from 'lodash/filter'
import get from 'lodash/get'
import {createSelector} from 'reselect'

import neighborhoodsSortedWithRoutes from './neighborhoods-sorted-with-routes'

// Returns the slice of neighborhoods (all or favorites) for the current page
export default createSelector(
  neighborhoodsSortedWithRoutes,
  state => get(state, 'data.userProfile'),
  (neighborhoodsSortedWithRoutes, userProfile) => {
    if (!neighborhoodsSortedWithRoutes) {
      return []
    }

    // Filter out non-ECC neighborhoods if that option is set
    return !userProfile || !userProfile.hideNonECC ? neighborhoodsSortedWithRoutes
      : filter(neighborhoodsSortedWithRoutes, n => n.properties.ecc)
  }
)
