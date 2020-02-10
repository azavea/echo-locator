// @flow
import filter from 'lodash/filter'
import find from 'lodash/find'
import get from 'lodash/get'
import {createSelector} from 'reselect'

import selectPage from './page'
import neighborhoods from './neighborhoods-sorted-with-routes'

// Returns the slice of neighborhoods (all or favorites) for the current page
export default createSelector(
  selectPage,
  neighborhoods,
  state => get(state, 'data.showFavorites'),
  state => get(state, 'data.userProfile'),
  (page, neighborhoods, showFavorites, userProfile) => {
    if (!neighborhoods || !userProfile) {
      return []
    }
    // filter to only show favorites, if in favorites view
    return showFavorites
      ? filter(neighborhoods,
        n => !!find(userProfile.favorites, f => f === n.properties.id))
      : neighborhoods
  }
)
