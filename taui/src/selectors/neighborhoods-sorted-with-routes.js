// @flow
import lonlat from '@conveyal/lonlat'
import filter from 'lodash/filter'
import get from 'lodash/get'
import orderBy from 'lodash/orderBy'
import {createSelector} from 'reselect'

import {
  DEFAULT_ACCESSIBILITY_IMPORTANCE,
  DEFAULT_CRIME_IMPORTANCE,
  DEFAULT_SCHOOLS_IMPORTANCE
} from '../constants'
import {NeighborhoodProperties} from '../types'

import selectNeighborhoodRoutes from './network-neighborhood-routes'
import neighborhoodTravelTimes from './neighborhood-travel-times'

// ~130km estimate of maximum straight-line distance drivable in area within 120 minutes
const MAX_DISTANCE = 130000
const MAX_TRAVEL_TIME = 120
const MIN_QUINTILE = 1
const MAX_QUINTILE = 5

// default to worst, if unknown
const DEFAULT_EDUCATION_QUINTILE = 5
const DEFAULT_CRIME_QUINTILE = 5

export default createSelector(
  selectNeighborhoodRoutes,
  neighborhoodTravelTimes,
  state => get(state, 'data.neighborhoods'),
  state => get(state, 'data.origin'),
  state => get(state, 'data.userProfile'),
  (neighborhoodRoutes, travelTimes, neighborhoods, origin, profile) => {
    if (!neighborhoods || !profile || !neighborhoods.features || !neighborhoods.features.length ||
      !neighborhoodRoutes || !neighborhoodRoutes.length) {
      return []
    }
    const useTransit = !profile || !profile.hasVehicle

    let accessibilityImportance = profile.importanceAccessibility
      ? parseInt(profile.importanceAccessibility) - 1 : DEFAULT_ACCESSIBILITY_IMPORTANCE
    let crimeImportance = profile.importanceViolentCrime
      ? parseInt(profile.importanceViolentCrime) - 1 : DEFAULT_CRIME_IMPORTANCE
    let schoolsImportance = profile.importanceSchools
      ? parseInt(profile.importanceSchools) - 1 : DEFAULT_SCHOOLS_IMPORTANCE

    // If everything is unimportant, rank all factors equally.
    // If at least one factor has greater than the minimum importance, other factors will be
    // instead effectively turned off by setting them to minimum importance.
    if ((accessibilityImportance + crimeImportance + schoolsImportance) === 0) {
      accessibilityImportance = crimeImportance = schoolsImportance = 1
    }

    const totalImportance = accessibilityImportance + crimeImportance + schoolsImportance

    const accessibilityPercent = accessibilityImportance / totalImportance
    const crimePercent = crimeImportance / totalImportance
    const schoolPercent = schoolsImportance / totalImportance

    const neighborhoodsWithRoutes = filter(neighborhoods.features.map((n, index) => {
      const properties: NeighborhoodProperties = n.properties
      const route = neighborhoodRoutes[index]
      const active = route.active
      const segments = useTransit ? route.routeSegments : []
      const time = useTransit ? travelTimes[index] : distanceTime(origin, n)

      // Map weighting values to percentages

      // Routable neighborhoods outside the max travel time window will be filtered out.
      // Smaller travel time is better; larger timeWeight is better (reverse range).
      const timeWeight = time < MAX_TRAVEL_TIME ? scale(time, 0, MAX_TRAVEL_TIME, 1, 0) : 1

      const eduationQuintile = properties.education_percentile_quintile
        ? properties.education_percentile_quintile
        : DEFAULT_EDUCATION_QUINTILE

      // Lowest education quintile is best (reverse range).
      const educationWeight = scale(eduationQuintile, MIN_QUINTILE, MAX_QUINTILE, 1, 0)

      // Lowest crime quintile is best (reverse range).
      const crimeQuintile = properties.violentcrime_quintile
        ? properties.violentcrime_quintile : DEFAULT_CRIME_QUINTILE
      const crimeWeight = scale(crimeQuintile, MIN_QUINTILE, MAX_QUINTILE, 1, 0)

      // Calculate weighted overall score from the percentages. Larger score is better.
      const score = (timeWeight * accessibilityPercent) +
        (crimeWeight * crimePercent) +
        (educationWeight * schoolPercent)

      return Object.assign({active,
        score,
        segments,
        time,
        timeWeight,
        crimeWeight,
        educationWeight
      }, n)
    }), n => !useTransit || (n.segments && n.segments.length && n.time < MAX_TRAVEL_TIME))

    return orderBy(neighborhoodsWithRoutes, ['score'], ['desc'])
  }
)

// Estimate drive time, using straight-line distance
const distanceTime = (origin, neighborhood) => {
  // First get distance in meters between origin and a neighborhood point
  const destination = lonlat.toLeaflet(neighborhood.geometry.coordinates)
  const distance = destination.distanceTo(origin.position)
  const normalized = distance < MAX_DISTANCE ? distance : MAX_DISTANCE
  // Then map the distance to the travel time range
  return scale(normalized, 0, MAX_DISTANCE, 0, MAX_TRAVEL_TIME)
}

// Map value from one range to another
const scale = (num, startMin, startMax, rangeMin, rangeMax) => {
  return (num - startMin) * (rangeMax - rangeMin) / (startMax - startMin) + rangeMin
}
