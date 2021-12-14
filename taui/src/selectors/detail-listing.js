// @flow
import lonlat from '@conveyal/lonlat'
import get from 'lodash/get'
import {createSelector} from 'reselect'

// import {NeighborhoodProperties} from '../types'
import scale from '../utils/scaling'

import selectListingRoute from './network-listing-route'
import listingTravelTime from './listing-travel-times'

// ~130km estimate of maximum straight-line distance drivable in area within 120 minutes
const MAX_DISTANCE = 130000
const MAX_TRAVEL_TIME = 120

/* eslint complexity: 0 */
export default createSelector(
  selectListingRoute,
  listingTravelTime,
  state => get(state, 'data.activeListing'),
  state => get(state, 'data.origin'),
  state => get(state, 'data.userProfile'),
  (ListingRoute, travelTime, listing, origin, profile) => {
    if (!listing || !profile || !ListingRoute) {
      return null
    }
    const useTransit = !profile || !profile.hasVehicle

    const segments = useTransit ? ListingRoute.routeSegments : []
    const time = useTransit ? travelTime : distanceTime(origin, listing)
    // Lisitings called from within routable neighborhoods filtered within max travel time window,
    // so it's assumed listings also within max travel time window.
    // Smaller travel time is better; larger timeWeight is better (reverse range).
    const timeWeight = time < MAX_TRAVEL_TIME ? scale(time, 0, MAX_TRAVEL_TIME, 1, 0) : 1

    return Object.assign({
      segments,
      time,
      timeWeight
    }, listing)
  }
)

// Estimate drive time, using straight-line distance
const distanceTime = (origin, listing) => {
  // First get distance in meters between origin and a neighborhood point
  const destination = lonlat.toLeaflet([listing.lon, listing.lat])
  const distance = destination.distanceTo(origin.position)
  const normalized = distance < MAX_DISTANCE ? distance : MAX_DISTANCE
  // Then map the distance to the travel time range
  return scale(normalized, 0, MAX_DISTANCE, 0, MAX_TRAVEL_TIME)
}
