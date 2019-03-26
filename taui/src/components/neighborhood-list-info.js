// @flow
import message from '@conveyal/woonerf/message'

export default function NeighborhoodListInfo ({neighborhood}) {
  if (!neighborhood || !neighborhood.properties) {
    return null
  }
  return (
    <tbody>
      <tr>
        <td />
        <td>
          <span>{message('NeighborhoodInfo.RentDiff')}:
            {neighborhood.properties.rent_diff && neighborhood.properties.rent_diff.toLocaleString(
              'en-US', {style: 'currency', currency: 'USD'})}</span>
        </td>
        <td>
          <span>{neighborhood.properties.finalRentValue}</span>
        </td>
      </tr>
      <tr>
        <td />
        <td>
          <span>{message('NeighborhoodInfo.Education')}:
            {neighborhood.properties.education_percentile &&
            (neighborhood.properties.education_percentile / 100).toLocaleString(
              'en-US', {style: 'percent'})}</span>
        </td>
        <td>
          <span>{message('NeighborhoodInfo.Score')}:
            {neighborhood.score &&
              neighborhood.score.toLocaleString('en-US', {style: 'percent'})}</span>
        </td>
      </tr>
    </tbody>
  )
}
