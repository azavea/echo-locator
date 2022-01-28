// @flow
import get from 'lodash/get'
import {createSelector} from 'reselect'

import detailNeighborhood from './detail-neighborhood'

export default createSelector(
  state => get(state, 'data.userProfile'),
  detailNeighborhood,
  (userProfile, neighborhood) => {
    if (!userProfile || !neighborhood) {
      return 0
    }
    return neighborhood && userProfile && neighborhood.properties['max_rent_' + userProfile.rooms + 'br']
  }
)
