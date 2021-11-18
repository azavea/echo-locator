// @flow
import {DECREMENT_FETCH, INCREMENT_FETCH} from '@conveyal/woonerf/fetch'
import {handleActions} from 'redux-actions'

import {REALTOR_BASE_URL, BHA_BASE_URL} from '../constants'
import {FetchState as State, IncrementPayload, DecrementPayload} from '../types'

export default handleActions(
  {
    [`${INCREMENT_FETCH}`]: (state: State, payload: IncrementPayload) => {
      const {url} = payload.payload
      // BHA and Realtor Listings fetch does not increment to update isLoading state
      if (url && (url.toString().includes(REALTOR_BASE_URL) || url.toString().includes(BHA_BASE_URL))) {
        return
      }
      return {
        ...state,
        fetches: state.fetches + 1
      }
    },
    [`${DECREMENT_FETCH}`]: (state: State, payload: DecrementPayload) => {
      return {
        ...state,
        fetches: state.fetches - 1
      }
    }
  },
  {
    fetches: 0,
    showLog: true
  }
)
