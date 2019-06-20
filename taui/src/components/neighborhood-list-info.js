// @flow
import message from '@conveyal/woonerf/message'

import {
  BOSTON_TOWN_AREA,
  BOSTON_SCHOOL_CHOICE_LINK,
  CAMBRIDGE_SCHOOL_CHOICE_LINK
} from '../constants'

import Meter from './meter'
import RentalUnitsMeter from './rental-units-meter'

export default function NeighborhoodListInfo ({neighborhood}) {
  if (!neighborhood || !neighborhood.properties) {
    return null
  }

  const props = neighborhood.properties
  const zipcode = props['id']
  const crime = props['crime_percentile']
  const edPercentile = props['education_percentile']
  const houses = props['house_number_symbol']
  const isSchoolChoice = !!props['school_choice']
  const totalMapc = props['total_mapc']
  const town = props['town']
  const townArea = props['town_area']
  const isBoston = townArea && townArea === BOSTON_TOWN_AREA

  const crimeMessage = isBoston ? 'Tooltips.ViolentCrimeBoston' : 'Tooltips.ViolentCrime'
  const crimeTooltip = message(crimeMessage, {
    averageRelation: getAverageRelationPercentage(crime),
    crimePercentile: crime,
    town: town
  })

  const edTooltip = message('Tooltips.Education', {
    averageRelation: getAverageRelationPercentage(edPercentile),
    edPercentile: edPercentile,
    town: town
  })

  const schoolChoiceLink = isBoston ? BOSTON_SCHOOL_CHOICE_LINK : CAMBRIDGE_SCHOOL_CHOICE_LINK

  return (
    <table className='neighborhood-facts'>
      <tbody>
        <tr>
          <td className='neighborhood-facts__cell'>{message('NeighborhoodInfo.EducationCategory')}</td>
          {!isSchoolChoice && <td className='neighborhood-facts__cell'>
            <Meter
              category='school'
              value={edPercentile}
              id={zipcode}
              tooltip={edTooltip} />
          </td>}
          {isSchoolChoice && <td className='neighborhood-facts__text'>
            <a href={schoolChoiceLink} target='blank'>
              {message('NeighborhoodInfo.SchoolChoice')}
            </a>
          </td>}
        </tr>
        {crime >= 0 && <tr>
          <td className='neighborhood-facts__cell'>{message('NeighborhoodInfo.ViolentCrime')}</td>
          <td className='neighborhood-facts__cell'>
            <Meter
              category='crime'
              value={crime}
              id={zipcode}
              tooltip={crimeTooltip} />
          </td>
        </tr>}
        <tr>
          <td className='neighborhood-facts__cell'>{message('NeighborhoodInfo.RentalUnits')}</td>
          <td className='neighborhood-facts__cell'>
            <RentalUnitsMeter value={houses} totalMapc={totalMapc} id={zipcode} town={town} />
          </td>
        </tr>
      </tbody>
    </table>
  )
}

// Fetch the UI string for percentage meter tooltips to say above/about/below average
const AVERAGE_PERCENTAGE = 50
const getAverageRelationPercentage = (val) => {
  return val > AVERAGE_PERCENTAGE
    ? message('Tooltips.AboveAverage')
    : (val < AVERAGE_PERCENTAGE ? message('Tooltips.BelowAverage') : message('Tooltips.Average'))
}
