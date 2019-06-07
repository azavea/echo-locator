// @flow
import message from '@conveyal/woonerf/message'

import scale from '../utils/scaling'

import Meter from './meter'
import RentalUnitsMeter from './rental-units-meter'

export default function NeighborhoodListInfo ({neighborhood}) {
  if (!neighborhood || !neighborhood.properties) {
    return null
  }

  const props = neighborhood.properties
  const crime = props['violentcrime_quintile'] > 0 ? props['violentcrime_quintile'] : 1
  // Invert range for crime quintile
  const crimeQuintile = scale(crime, 1, 5, 4, 0)
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
        <tr>
          <td className='neighborhood-facts__cell'>{message('NeighborhoodInfo.ViolentCrime')}</td>
          <td className='neighborhood-facts__cell'>
            <Meter value={crimeQuintile}
              average={2}
              max={4}
              tooltip={message('NeighborhoodInfo.ViolentCrime')} />
          </td>
        </tr>
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
