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
    <table className='neighborhood-summary__facts'>
      <tbody>
        <tr>
          <td className='neighborhood-summary__cell'>{message('NeighborhoodInfo.Score')}:</td>
          <td className='neighborhood-summary__cell'>{overallScore}</td>
        </tr>
        <tr>
          <td className='neighborhood-summary__cell'>{message('NeighborhoodInfo.Affordability')}:</td>
          <td className='neighborhood-summary__cell'>{labels.affordability}</td>
        </tr>
        <tr>
          <td className='neighborhood-summary__cell'>{message('NeighborhoodInfo.ViolentCrime')}:</td>
          <td className='neighborhood-summary__cell'>{labels.violentCrime}</td>
        </tr>
        <tr>
          <td className='neighborhood-summary__cell'>{message('NeighborhoodInfo.EducationCategory')}:</td>
          <td className='neighborhood-summary__cell'>{labels.education}</td>
        </tr>
      </tbody>
    </table>
  )
}
