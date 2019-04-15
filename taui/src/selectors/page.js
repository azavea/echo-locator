// @flow
import get from 'lodash/get'
import {createSelector} from 'reselect'

export default createSelector(
  state => get(state, 'data.page', 0),
  page => {
    return page
  }
)
