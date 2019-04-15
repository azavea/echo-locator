// @flow
import {createSelector} from 'reselect'

import {SIDEBAR_PAGE_SIZE} from '../constants'

import haveAnotherPage from './have-another-page'
import selectPage from './page'
import listNeighborhoods from './list-neighborhoods'

export default createSelector(
  haveAnotherPage,
  selectPage,
  listNeighborhoods,
  (haveAnotherPage, page, neighborhoods) => {
    if (!neighborhoods) {
      return 0
    }
    const startingOffset = page * SIDEBAR_PAGE_SIZE
    return haveAnotherPage
      ? startingOffset + SIDEBAR_PAGE_SIZE
      : neighborhoods.length
  }
)
