// @flow
import filter from 'lodash/filter'
import get from 'lodash/get'
import {createSelector} from 'reselect'

import selectPage from './page'
import neighborhoodsSortedWithRoutes from './neighborhoods-sorted-with-routes'

// Returns the slice of neighborhoods (all or favorites) for the current page
export default createSelector(
  selectPage,
  neighborhoodsSortedWithRoutes,
  state => get(state, 'data.showFavorites'),
  state => get(state, 'data.userProfile'),
  (page, neighborhoodsSortedWithRoutes, showFavorites, userProfile) => {
    if (!neighborhoodsSortedWithRoutes) {
      return []
    }
    return showFavorites
      ? filter(neighborhoodsSortedWithRoutes,
        n => userProfile.favorites.indexOf(n.properties.id) !== -1)
      : neighborhoodsSortedWithRoutes
  }
)
