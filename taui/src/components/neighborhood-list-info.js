// @flow
import message from '@conveyal/woonerf/message'

import {NeighborhoodProperties} from '../types'

// convenience for finding UI label strings for a given property's quintile bucket
function lookupLabel (quintileType: string, value: number) {
  return (value > 0 && value < 6)
    ? message('QuintileLabels.' + quintileType + '.' + value)
    : message('UnknownValue')
}

export default function NeighborhoodListInfo ({neighborhood}) {
  if (!neighborhood || !neighborhood.properties) {
    return null
  }

  const properties: NeighborhoodProperties = neighborhood.properties
  const affordabilityLabel = lookupLabel('Affordability', properties.overall_affordability_quintile)
  const educationLabel = lookupLabel('Education', properties.education_percentile_quintile)
  const violentCrimeLabel = lookupLabel('ViolentCrime', properties.violentcrime_quintile)

  const educationPercentileLabel = properties.education_percentile
    ? (properties.education_percentile / 100).toLocaleString('en-US', {style: 'percent'})
    : message('UnknownValue')
  const populationLabel = properties.zipcode_population
    ? properties.zipcode_population.toLocaleString('en-US', {style: 'decimal', useGrouping: true})
    : message('UnknownValue')
  const overallScore = neighborhood.score
    ? neighborhood.score.toLocaleString('en-US', {style: 'percent'})
    : message('UnknownValue')

  return (
    <tbody>
      <tr>
        <td />
        <td>
          <span>{affordabilityLabel}</span>
        </td>
        <td>
          <span>{message('NeighborhoodInfo.Score')}: {overallScore}</span>
        </td>
      </tr>
      <tr>
        <td />
        <td>
          <span>{message('NeighborhoodInfo.ViolentCrime')}: {violentCrimeLabel}</span>
        </td>
        <td>
          <span>{message('NeighborhoodInfo.Population')}: {populationLabel}</span>
        </td>
      </tr>
      <tr>
        <td />
        <td>
          <span>{message('NeighborhoodInfo.EducationPercentile')}: {educationPercentileLabel}</span>
        </td>
        <td>
          <span>{message('NeighborhoodInfo.EducationCategory')}: {educationLabel}</span>
        </td>
      </tr>
    </tbody>
  )
}
