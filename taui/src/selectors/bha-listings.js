// @flow
import get from 'lodash/get'
import {createSelector} from 'reselect'

export default createSelector(
  state => get(state, 'data.bhaListings'),
  bhaListings => {
    if (!bhaListings) {
      return {data: []}
    }
    return bhaListings
  }
)
