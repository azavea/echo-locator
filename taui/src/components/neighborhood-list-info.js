// @flow
import message from '@conveyal/woonerf/message'

import Meter from './meter'
import RentalUnitsMeter from './rental-units-meter'

export default function NeighborhoodListInfo ({neighborhood}) {
  if (!neighborhood || !neighborhood.properties) {
    return null
  }

  const props = neighborhood.properties
  const crime = props['crime_percentile']
  const edPercentile = props['education_percentile']
  const houses = props['house_number_symbol']
  const isSchoolChoice = !!props['school_choice']

  return (
    <table className='neighborhood-facts'>
      <tbody>
        {!isSchoolChoice && <tr>
          <td className='neighborhood-facts__cell'>{message('NeighborhoodInfo.EducationCategory')}</td>
          <td className='neighborhood-facts__cell'>
            <Meter value={edPercentile} tooltip={message('NeighborhoodInfo.EducationCategory')} />
          </td>
        </tr>}
        {crime >= 0 && <tr>
          <td className='neighborhood-facts__cell'>{message('NeighborhoodInfo.ViolentCrime')}</td>
          <td className='neighborhood-facts__cell'>
            <Meter value={crime}
              tooltip={message('NeighborhoodInfo.ViolentCrime')} />
          </td>
        </tr>}
        <tr>
          <td className='neighborhood-facts__cell'>{message('NeighborhoodInfo.RentalUnits')}</td>
          <td className='neighborhood-facts__cell'>
            <RentalUnitsMeter value={houses} tooltip={message('NeighborhoodInfo.RentalUnits')} />
          </td>
        </tr>
      </tbody>
    </table>
  )
}
