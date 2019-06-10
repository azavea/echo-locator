// @flow
import Icon from '@conveyal/woonerf/components/icon'
import ReactTooltip from 'react-tooltip'

import {getTier} from '../utils/scaling'

export default function RentalUnitsMeter ({
  value,
  tooltip
}) {
  const NUM_ICONS = 5

  if (value > NUM_ICONS || value < 0) {
    console.warn('Rental unit meter count out of range')
    if (value < 0) {
      value = 0
    } else {
      value = NUM_ICONS
    }
  }

  const unfilledCount = NUM_ICONS - value
  const tier = getTier(value / NUM_ICONS)

  const filledIcons = []
  for (let i = 0; i < value; i++) {
    filledIcons.push(
      <span
        key={i}
        className={`rental-units-meter__icon rental-units-meter__icon--${tier}`}
      >
        <Icon type='home' />
      </span>
    )
  }

  const unfilledIcons = []
  for (let i = 0; i < unfilledCount; i++) {
    unfilledIcons.push(
      <span
        key={i}
        className='rental-units-meter__icon'
      >
        <Icon type='home' />
      </span>
    )
  }

  return (
    <div className='rental-units-meter'
      data-tip={tooltip}>
      <ReactTooltip />
      {filledIcons}
      {unfilledIcons}
    </div>
  )
}
