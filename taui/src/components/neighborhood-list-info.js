// @flow

export default function NeighborhoodListInfo ({neighborhood}) {
  return (
    <tbody>
      <tr>
        <td />
        <td>
          <span>Education: {neighborhood.properties.education_percentile.toLocaleString()}</span>
        </td>
        <td>
          <span>Rent: {neighborhood.properties.finalRentValue}</span>
        </td>
      </tr>
    </tbody>
  )
}
