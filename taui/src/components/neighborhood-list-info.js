// @flow
import message from '@conveyal/woonerf/message'

import Meter from './meter'
import RentalUnitsMeter from './rental-units-meter'

export default function NeighborhoodListInfo ({neighborhood}) {
  if (!neighborhood || !neighborhood.properties) {
    return null
  }

  return (
    <table className='neighborhood-facts'>
      <tbody>
        <tr>
          <td className='neighborhood-facts__cell'>{message('NeighborhoodInfo.EducationCategory')}</td>
          <td className='neighborhood-facts__cell'>
            <Meter value={86} average={58} tier='high' tooltip='hello' />
          </td>
        </tr>
        <tr>
          <td className='neighborhood-facts__cell'>{message('NeighborhoodInfo.ViolentCrime')}</td>
          <td className='neighborhood-facts__cell'>
            <Meter value={72} average={66} tier='med' />
          </td>
        </tr>
        <tr>
          <td className='neighborhood-facts__cell'>{message('NeighborhoodInfo.RentalUnits')}</td>
          <td className='neighborhood-facts__cell'>
            <RentalUnitsMeter value={400} max={1000} tier='low' />
          </td>
        </tr>
      </tbody>
    </table>
  )
}
