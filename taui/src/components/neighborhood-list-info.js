// @flow
import message from '@conveyal/woonerf/message'

export default function NeighborhoodListInfo ({neighborhood}) {
  return (
    <tbody>
      <tr>
        <td />
        <td>
          <span>{message('NeighborhoodInfo.Education')}:
            {neighborhood.properties.education_percentile.toLocaleString()}</span>
        </td>
        <td>
          <span>{message('NeighborhoodInfo.Affordability')}:
            {neighborhood.properties.finalRentValue}</span>
        </td>
      </tr>
    </tbody>
  )
}
