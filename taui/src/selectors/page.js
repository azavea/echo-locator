// @flow
import {createSelector} from 'reselect'

export default createSelector(
  state => state.data.page,
  page => {
    return page || 0
  }
)
