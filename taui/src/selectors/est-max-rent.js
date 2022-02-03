// @flow
import get from 'lodash/get'
import {createSelector} from 'reselect'

import detailNeighborhood from './detail-neighborhood'

export default createSelector(
  state => get(state, 'data.userProfile'),
  detailNeighborhood,
  (userProfile, neighborhood) => {
    if (!userProfile || !userProfile.rooms || !neighborhood || !neighborhood.properties || !neighborhood.properties['max_rent_' + userProfile.rooms + 'br']) {
      return 0
    }
    return neighborhood.properties['max_rent_' + userProfile.rooms + 'br']
  }
)
