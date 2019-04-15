// @flow
import message from '@conveyal/woonerf/message'

import {NeighborhoodLabels, NeighborhoodProperties} from '../types'

// convenience for finding UI label strings for a given property's quintile bucket
function lookupLabel (quintileType: string, value: number): NeighborhoodLabels {
  return (value > 0 && value < 6)
    ? message('QuintileLabels.' + quintileType + '.' + value)
    : message('UnknownValue')
}

// Returns a set of user-presentable formatted strings for a given neighborhood's properties.
export default function getNeighborhoodPropertyLabels (properties: NeighborhoodProperties) {
  const affordability = lookupLabel('Affordability', properties.overall_affordability_quintile)
  const education = lookupLabel('Education', properties.education_percentile_quintile)
  const violentCrime = lookupLabel('ViolentCrime', properties.violentcrime_quintile)

  const educationPercentile = properties.education_percentile
    ? (properties.education_percentile / 100).toLocaleString('en-US', {style: 'percent'})
    : message('UnknownValue')
  const population = properties.zipcode_population
    ? properties.zipcode_population.toLocaleString('en-US', {style: 'decimal', useGrouping: true})
    : message('UnknownValue')
  const hasTransitStop = properties.has_t_stop ? message('NeighborhoodInfo.HasTransitStop')
    : message('NeighborhoodInfo.HasNoTransitStop')
  const percentCollegeGraduates = properties.percentage_college_graduates
    ? (properties.percentage_college_graduates / 100).toLocaleString('en-US', {style: 'percent'})
    : message('UnknownValue')
  const nearTransitStop = properties.near_t_stop ? properties.near_t_stop.toLocaleString(
    'en-US', {style: 'percent'}) : message('UnknownValue')
  const nearPark = properties.near_park ? properties.near_park.toLocaleString(
    'en-US', {style: 'percent'}) : message('UnknownValue')
  const nearRailStation = properties.near_railstation ? properties.near_railstation.toLocaleString(
    'en-US', {style: 'percent'}) : message('UnknownValue')

  const labels: NeighborhoodLabels = {
    affordability,
    education,
    educationPercentile,
    hasTransitStop,
    nearPark,
    nearRailStation,
    nearTransitStop,
    percentCollegeGraduates,
    population,
    violentCrime
  }
  return labels
}
