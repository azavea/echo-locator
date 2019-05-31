// @flow
import message from '@conveyal/woonerf/message'

import Meter from './meter'

export default function NeighborhoodListInfo ({neighborhood}) {
  if (!neighborhood || !neighborhood.properties) {
    return null
  }

  return (
    <table className='neighborhood-summary__facts'>
      <tbody>
        <tr>
          <td className='neighborhood-summary__cell'>{message('NeighborhoodInfo.EducationCategory')}:</td>
          <td className='neighborhood-summary__cell'>
            <div className='neighborhood-summary__value'>
              <Meter value={86} average={58} tier='high' tooltip='hello' />
              <span className='neighborhood-summary__percentage'>
                86%
              </span>
            </div>
          </td>
        </tr>
        <tr>
          <td className='neighborhood-summary__cell'>{message('NeighborhoodInfo.ViolentCrime')}:</td>
          <td className='neighborhood-summary__cell'>
            <div className='neighborhood-summary__value'>
              <Meter value={72} average={66} tier='med' />
              <span className='neighborhood-summary__percentage'>
                72%
              </span>
            </div>
          </td>
        </tr>
        <tr>
          <td className='neighborhood-summary__cell'>{message('NeighborhoodInfo.RentalUnits')}:</td>
          <td className='neighborhood-summary__cell'>
            <div className='neighborhood-summary__value'>
              TK
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  )
}
