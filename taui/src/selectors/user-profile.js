// @flow
import {createSelector} from 'reselect'

export default createSelector(
  state => state.data.userProfile,
  userProfile => {
    return userProfile
  }
)
