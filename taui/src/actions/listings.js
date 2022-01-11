// @flow
import fetch from '@conveyal/woonerf/fetch'

import {fwdGeocodeBatch} from '../utils/fwd-geocode'
import {REALTOR_BASE_URL, BHA_BASE_URL} from '../constants'
import { ActiveListing, Listing } from '../types'

import {addActionLogItem} from './log'

const REALTOR_ACTION_TYPE = 'set Realtor listings'
const BHA_ACTION_TYPE = 'set BHA listings'

const handleError = (error, name, actionType) => {
  console.error(`Error fetching ${name} listings.`)
  console.error(error)
  return {type: actionType, payload: {error: error}}
}

export const setRealtorListings = (payload: Listing) => (dispatch: Dispatch, getState: any) => {
  // payload used to reset listings state after error and on clicked neighborhood change
  if (payload) {
    dispatch({type: REALTOR_ACTION_TYPE, payload: payload})
  } else {
    const current = getState()
    // currently no current.data.userProfile.budget
    // and undefined value breaks API request
    const query = {
      'zipcode': current.data.activeNeighborhood,
      'budget': '10000',
      'rooms': current.data.userProfile.rooms
    }
    addActionLogItem(`Set Realtor listings`)
    dispatch({type: REALTOR_ACTION_TYPE, payload: {pending: true}})
    dispatch(fetch({
      url: REALTOR_BASE_URL,
      options: {
        method: 'post',
        body: query
      },
      next: (error, response) => {
        // handle error here instead of automatically dispatching fetch's fetchError
        if (error) {
          return handleError(error, 'Realtor', REALTOR_ACTION_TYPE)
        }
        try {
          const listings = JSON.parse(response.value.body)
          return {type: REALTOR_ACTION_TYPE, payload: {data: listings}}
        } catch (error) {
          return handleError(error, 'Realtor', REALTOR_ACTION_TYPE)
        }
      }
    }))
  }
}

export const setBHAListings = (payload: Listing) => (dispatch: Dispatch, getState: any) => {
  // payload used to reset listings state after error and on clicked neighborhood change
  if (payload) {
    dispatch({type: BHA_ACTION_TYPE, payload: payload})
  } else {
    const current = getState()
    const zipcode = current.data.activeNeighborhood
    const budget = current.data.userProfile.budget
    const rooms = current.data.userProfile.rooms
    const urlWithQuery = `${BHA_BASE_URL}zipcode=${zipcode}&rooms=${rooms}&budget=${budget}`

    addActionLogItem(`Set BHA listings`)
    dispatch({type: BHA_ACTION_TYPE, payload: {pending: true}})
    dispatch(fetch({
      url: urlWithQuery,
      next: (error, response) => {
        // handle error here instead of automatically dispatching fetch's fetchError
        if (error) {
          return handleError(error, 'BHA', BHA_ACTION_TYPE)
        }
        const listings = JSON.parse(response.value.body)
        return fwdGeocodeBatch(listings).then((data) => {
          return {type: BHA_ACTION_TYPE, payload: {data: data}}
        }).catch((error) => {
          return handleError(error, 'BHA', BHA_ACTION_TYPE)
        })
      }
    }))
  }
}

export const setActiveListing = (listing: ActiveListing) => (dispatch: Dispatch, getState: any) => {
  addActionLogItem(`Updating active listing to ${listing}`)
  dispatch({type: 'set active listing', payload: listing})
}
