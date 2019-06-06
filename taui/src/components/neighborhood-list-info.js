// @flow
import message from '@conveyal/woonerf/message'

import Meter from './meter'
import RentalUnitsMeter from './rental-units-meter'

export default function NeighborhoodListInfo ({neighborhood}) {
  if (!neighborhood || !neighborhood.properties) {
    return null
  }

  const props = neighborhood.properties
  const crimeQuintile = props['violentcrime_quintile']
  const edPercentile = props['education_percentile']
  const houses = props['house_number_symbol']
  const isSchoolChoice = !!props['school_choice']

  return (
    <table className='neighborhood-facts'>
      <tbody>
        {!isSchoolChoice && <tr>
          <td className='neighborhood-facts__cell'>{message('NeighborhoodInfo.EducationCategory')}</td>
          <td className='neighborhood-facts__cell'>
            <Meter value={edPercentile} />
          </td>
        </tr>}
        <tr>
          <td className='neighborhood-facts__cell'>{message('NeighborhoodInfo.ViolentCrime')}</td>
          <td className='neighborhood-facts__cell'>
            <Meter value={crimeQuintile} average={3} max={5} />
          </td>
        </tr>
        <tr>
          <td className='neighborhood-facts__cell'>{message('NeighborhoodInfo.RentalUnits')}</td>
          <td className='neighborhood-facts__cell'>
            <RentalUnitsMeter value={houses} />
          </td>
        </tr>
      </tbody>
    </table>
  )
}
