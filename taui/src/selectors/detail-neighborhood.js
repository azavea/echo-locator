// @flow
import get from 'lodash/get'
import {createSelector} from 'reselect'

import getNeighborhoodById from '../utils/get-neighborhood'

import listNeighborhoods from './list-neighborhoods'

// Returns current active neighborhood
export default createSelector(
  state => get(state, 'data.activeNeighborhood'),
  listNeighborhoods,
  (activeNeighborhood, neighborhoods) => {
    return neighborhoods && getNeighborhoodById(neighborhoods, activeNeighborhood)
  }
)
