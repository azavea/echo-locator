// @flow
import Icon from '@conveyal/woonerf/components/icon'
import message from '@conveyal/woonerf/message'
import ReactTooltip from 'react-tooltip'

import {
  TOOLTIP_HIDE_DELAY_MS,
  TOOLTIP_UPDATE_DELAY_MS
} from '../constants'
import {getTier} from '../utils/scaling'

export default function RentalUnitsMeter ({
  totalMapc,
  town,
  value
}) {
  const NUM_ICONS = 5
  const AVERAGE_VALUE = 3

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

  const averageRelation = value > AVERAGE_VALUE
    ? message('Tooltips.AboveAverage')
    : (value < AVERAGE_VALUE ? message('Tooltips.BelowAverage') : message('Tooltips.Average'))
  const tooltip = message('Tooltips.RentalUnits', {
    averageRelation: averageRelation,
    town: town,
    totalMapc: totalMapc ? (totalMapc).toLocaleString() : message('UnknownValue')
  })

  return (
    <div className='rental-units-meter'
      data-tip={tooltip}
      data-iscapture
      data-for={`rental-units-tooltip-${town}`}
      id={`rental-units-${town}`}>
      <ReactTooltip
        clickable
        delayHide={TOOLTIP_HIDE_DELAY_MS}
        delayUpdate={TOOLTIP_UPDATE_DELAY_MS}
        html
        effect='solid'
        isCapture
        id={`rental-units-tooltip-${town}`} />
      {filledIcons}
      {unfilledIcons}
    </div>
  )
}
