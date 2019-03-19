// @flow

export default function NeighborhoodListInfo ({neighborhood}) {
  return (
    <tbody>
      <tr className='AlternateTrips'>
        <td>
          <span>Neighborhood {neighborhood.properties.id}</span>
        </td>
        <td>
          <span>Education {neighborhood.properties.education_percentile}</span>
        </td>
        <td>
          <span>Rent {neighborhood.properties.finalRentValue}</span>
        </td>
      </tr>
    </tbody>
  )
}
