// @flow
import Icon from '@conveyal/woonerf/components/icon'

export default function RentalUnitsMeter ({
  value,
  max,
  tier,
  tooltip
}) {
  const NUM_ICONS = 5
  const filledCount = Math.round(NUM_ICONS * value / max)
  const unfilledCount = NUM_ICONS - filledCount

  const filledIcons = []
  for (let i = 0; i < filledCount; i++) {
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
    <div className='rental-units-meter'>
      {filledIcons}
      {unfilledIcons}
    </div>
  )
}
