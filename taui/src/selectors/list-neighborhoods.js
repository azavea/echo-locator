// @flow
import filter from 'lodash/filter'
import get from 'lodash/get'
import {createSelector} from 'reselect'

import selectPage from './page'
import neighborhoods from './filtered-neighborhoods-with-routes'

// Returns the slice of neighborhoods (all or favorites) for the current page
export default createSelector(
  selectPage,
  neighborhoods,
  state => get(state, 'data.showFavorites'),
  state => get(state, 'data.userProfile'),
  (page, neighborhoods, showFavorites, userProfile) => {
    if (!neighborhoods) {
      return []
    }
    // filter to only show favorites, if in favorites view
    return showFavorites
      ? filter(neighborhoods,
        n => userProfile.favorites.indexOf(n.properties.id) !== -1)
      : neighborhoods
  }
)
