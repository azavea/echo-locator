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
// stored profile importance is offset by one from MAX_IMPORTANCE
const PROFILE_MAX_IMPORTANCE = MAX_IMPORTANCE - 1

// default to worst, if unknown
const DEFAULT_EDUCATION_QUINTILE = 5
const DEFAULT_CRIME_QUINTILE = 5

// extra constant weighting always given to travel time over the other two factors
const EXTRA_ACCESS_WEIGHT = 2

/* eslint complexity: 0 */
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

    if (accessibilityImportance === PROFILE_MAX_IMPORTANCE) {
      // if set to very important, add more extra weight to travel time
      accessibilityImportance += 1
    }

    // Alwasy give accessibility (travel time) some extra weighting
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
      // Routable neighborhoods outside the max travel time window will be filtered out.
      // Smaller travel time is better; larger timeWeight is better (reverse range).
      const timeWeight = time < MAX_TRAVEL_TIME ? scale(time, 0, MAX_TRAVEL_TIME, 1, 0) : 1
      // Weight schools either by percentile binned into quarters if given max importance,
      // or otherwise weight by quintile.
      let educationWeight
      if (schoolsImportance === PROFILE_MAX_IMPORTANCE) {
        // "very important": instead of quintiles, group percentile ranking into quarters
        const edPercent = properties.education_percentile
          ? properties.education_percentile
          : (DEFAULT_EDUCATION_QUINTILE - 1) * 20
        let edPercentQuarter = Math.round(scale(edPercent, 0, 100, 3, 0))
        // Treat all schools not in the top quarter as being in the bottom quarter
        // to strongly prioritize the top quarter
        if (edPercentQuarter > 0) {
          edPercentQuarter = 3
        }
        educationWeight = scale(edPercentQuarter, 0, 3, 1, 0)
      } else if (schoolsImportance > 0) {
        // For "somewhat important", prioritize quintile 2 and below
        // For "important", quintile 3 and below (lower is better)
        const prioritizeQuintile = schoolsImportance === 1 ? 2 : 3
        let educationQuintile = properties.education_percentile_quintile
          ? properties.education_percentile_quintile
          : DEFAULT_EDUCATION_QUINTILE
        // Treat all quintiles above the maximum to prioritize as being in the worst quintile
        if (educationQuintile > prioritizeQuintile) {
          educationQuintile = MAX_QUINTILE
        }
        // Lowest education quintile is best (reverse range).
        educationWeight = scale(educationQuintile, MIN_QUINTILE, MAX_QUINTILE, 1, 0)
      } else {
        educationWeight = 0 // Not important
      }
      let crimeWeight = 0
      // Handle missing values (zero in spreadsheet) by re-assigning crime weight
      // evenly to the other two factors. Also do so if crime set as unimportant.
      if (properties.violentcrime_quintile === 0 || crimeImportance === 0) {
        const halfCrimePercent = crimePercent / 2
        schoolPercent += halfCrimePercent
        accessibilityPercent += halfCrimePercent
        crimePercent = 0
      } else {
        let crimeQuintile = properties.violentcrime_quintile
          ? properties.violentcrime_quintile : DEFAULT_CRIME_QUINTILE
        // Treat lowest two (safest) violent crime quintiles equally
        if (crimeQuintile === 2) {
          crimeQuintile = 1
        }
        if (crimeImportance === 1 && crimeQuintile < 5) {
          // somewhat important; treat all but worst quintile the same
          crimeQuintile = 1
        } else if (crimeImportance === 2 && crimeQuintile < 4) {
          // "important"; treat all but worst two quintiles the same
          crimeQuintile = 1
        } else if (crimeImportance === PROFILE_MAX_IMPORTANCE && crimeQuintile > 3) {
          // "very important"; push results for worst two quintiles to bottom
          // by reassigning weights for those quintiles to be 90% crime
          crimePercent = 90
          schoolPercent /= 10
          accessibilityPercent /= 10
        }
        // Lowest crime quintile is best (reverse range).
        crimeWeight = scale(crimeQuintile, MIN_QUINTILE, MAX_QUINTILE, 1, 0)
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
