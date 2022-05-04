// @flow
import get from 'lodash/get'
import {createSelector} from 'reselect'

export default createSelector(
  state => get(state, 'loginMessage'),
  loginMessage => {
    return loginMessage
  }
)
