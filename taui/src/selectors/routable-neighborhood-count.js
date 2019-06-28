// @flow
import {createSelector} from 'reselect'

import neighborhoodsSortedWithRoutes from './neighborhoods-sorted-with-routes'

// Returns currently reachable neighborhood count
export default createSelector(
  neighborhoodsSortedWithRoutes,
  (neighborhoods) => {
    return neighborhoods ? neighborhoods.length : 0
  }
)
