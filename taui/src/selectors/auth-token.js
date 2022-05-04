// @flow
import get from 'lodash/get'
import {createSelector} from 'reselect'

export default createSelector(
  state => get(state, 'authToken'),
  authToken => {
    return authToken
  }
)
