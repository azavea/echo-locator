// @flow
import get from 'lodash/get'
import {createSelector} from 'reselect'

export default createSelector(
  state => get(state, 'data.realtorListings'),
  realtorListings => {
    if (!realtorListings) {
      return {data: []}
    }
    return realtorListings
  }
)
