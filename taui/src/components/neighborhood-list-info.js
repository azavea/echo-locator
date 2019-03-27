// @flow
import message from '@conveyal/woonerf/message'

import {NeighborhoodLabels} from '../types'
import getNeighborhoodPropertyLabels from '../utils/neighborhood-properties'

export default function NeighborhoodListInfo ({neighborhood}) {
  if (!neighborhood || !neighborhood.properties) {
    return null
  }

  const labels: NeighborhoodLabels = getNeighborhoodPropertyLabels(neighborhood.properties)

  // Overall score is a derived value and not a neighborhood property (so not in `labels`).
  const overallScore = neighborhood.score
    ? neighborhood.score.toLocaleString('en-US', {style: 'percent'})
    : message('UnknownValue')

  return (
    <tbody>
      <tr>
        <td />
        <td>
          <span>{labels.affordability}</span>
        </td>
        <td>
          <span>{message('NeighborhoodInfo.Score')}: {overallScore}</span>
        </td>
      </tr>
      <tr>
        <td />
        <td>
          <span>{message('NeighborhoodInfo.ViolentCrime')}: {labels.violentCrime}</span>
        </td>
        <td>
          <span>{message('NeighborhoodInfo.EducationCategory')}: {labels.education}</span>
        </td>
      </tr>
    </tbody>
  )
}
