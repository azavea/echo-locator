// @flow
import lonlat from '@conveyal/lonlat'
import concat from 'lodash/concat'
import filter from 'lodash/filter'
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'
import includes from 'lodash/includes'
import orderBy from 'lodash/orderBy'
import pullAt from 'lodash/pullAt'
import {createSelector} from 'reselect'

import {
  BOOST_DOWNTOWN_RESULT_PLACE,
  DEFAULT_ACCESSIBILITY_IMPORTANCE,
  DEFAULT_CRIME_IMPORTANCE,
  DEFAULT_SCHOOLS_IMPORTANCE,
  DOWNTOWN_AREAS,
  MAX_IMPORTANCE,
  RESULTS_WITH_DOWNTOWN
} from '../constants'
import {NeighborhoodProperties} from '../types'
import scale from '../utils/scaling'

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

// extra constant weighting always given to travel time over the other two factors
const EXTRA_ACCESS_WEIGHT = 1

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

    // Give accessibility (travel time) extra weighting
    accessibilityImportance += EXTRA_ACCESS_WEIGHT

    const totalImportance = accessibilityImportance + crimeImportance + schoolsImportance

    let accessibilityPercent = accessibilityImportance / totalImportance
    let crimePercent = crimeImportance / totalImportance
    let schoolPercent = schoolsImportance / totalImportance

    const neighborhoodsWithRoutes = filter(neighborhoods.features.map((n, index) => {
      const properties: NeighborhoodProperties = n.properties
      const route = neighborhoodRoutes[index]
      const segments = useTransit ? route.routeSegments : []
      const time = useTransit ? travelTimes[index] : distanceTime(origin, n)

      // Map weighting values to percentages

      // Routable neighborhoods outside the max travel time window will be filtered out.
      // Smaller travel time is better; larger timeWeight is better (reverse range).
      const timeWeight = time < MAX_TRAVEL_TIME ? scale(time, 0, MAX_TRAVEL_TIME, 1, 0) : 1

      // Weight schools either by percentile binned into quarters if given max importance,
      // or otherwise weight by quintile.
      let educationWeight
      if (schoolsImportance === (MAX_IMPORTANCE - 1)) {
        // Group percentile ranking into quarters instead of using quintiles
        // if the importance of schools is the max importance.
        const edPercent = properties.education_percentile
          ? properties.education_percentile
          : (DEFAULT_EDUCATION_QUINTILE - 1) * 20
        const edPercentQuarter = Math.round(scale(edPercent, 0, 100, 3, 0))
        educationWeight = scale(edPercentQuarter, 0, 3, 1, 0)
      } else {
        // Use quintiles if the importance of schools is anything less than the max importance.
        const educationQuintile = properties.education_percentile_quintile
          ? properties.education_percentile_quintile
          : DEFAULT_EDUCATION_QUINTILE

        // Lowest education quintile is best (reverse range).
        educationWeight = scale(educationQuintile, MIN_QUINTILE, MAX_QUINTILE, 1, 0)
      }
      let crimeQuintile = properties.violentcrime_quintile
        ? properties.violentcrime_quintile : DEFAULT_CRIME_QUINTILE
      // Treat lowest two (safest) violent crime quintiles equally
      if (crimeQuintile === 2) {
        crimeQuintile = 1
      }
      // Lowest crime quintile is best (reverse range).
      const crimeWeight = scale(crimeQuintile, MIN_QUINTILE, MAX_QUINTILE, 1, 0)

      // Handle missing values (zero in spreadsheet) by re-assigning crime weight
      // evenly to the other two factors
      if (properties.violentcrime_quintile === 0) {
        const halfCrimePercent = crimePercent / 2
        schoolPercent += halfCrimePercent
        accessibilityPercent += halfCrimePercent
        crimePercent = 0
      }

      // Calculate weighted overall score from the percentages. Larger score is better.
      const score = (timeWeight * accessibilityPercent) +
        (crimeWeight * crimePercent) +
        (educationWeight * schoolPercent)

      return Object.assign({
        score,
        segments,
        time,
        timeWeight,
        crimeWeight,
        educationWeight
      }, n)
    }), n => !useTransit || (n.segments && n.segments.length && n.time < MAX_TRAVEL_TIME))

    const ordered = orderBy(neighborhoodsWithRoutes, ['score'], ['desc'])

    // Boost the first downtown result into the BOOST_DOWNTOWN_RESULT_PLACE
    // if there's not already a downtown result in the top RESULTS_WITH_DOWNTOWN results.
    const firstDowntownIndex = findIndex(ordered, n => {
      const townArea = n.properties['town_area']
      return townArea && includes(DOWNTOWN_AREAS, townArea)
    })
    if (firstDowntownIndex >= RESULTS_WITH_DOWNTOWN - 1) {
      // extract first downtown result, removing it from `ordered` array
      const firstDowntown = pullAt(ordered, firstDowntownIndex)
      // splice returns the members removed from the start, mutating `ordered` in place
      const reorderedStart = ordered.splice(0, BOOST_DOWNTOWN_RESULT_PLACE - 1)
      return concat(reorderedStart, firstDowntown, ordered)
    } else {
      return ordered
    }
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
