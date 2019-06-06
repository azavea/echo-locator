// @flow
import {getTier} from '../utils/scaling'

export default function Meter ({
  value,
  max = 100,
  average = 50,
  width = 100,
  height = 12,
  tooltip
}) {
  const percentage = value / max
  const percentageLabel = Math.round(percentage * 100)
  const tier = getTier(percentage)

  return (
    <div className='meter'>
      <svg
        className='meter__chart'
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        title={tooltip}
      >
        <rect
          className='meter__track'
          x='0'
          y='0'
          width={width}
          height={height}
        />
        <rect
          className={`meter__fill meter__fill--${tier}`}
          x='0'
          y='0'
          width={percentage * width}
          height={height}
        />
        <rect
          className='meter__average'
          x={(average / max) * width}
          y='0'
          width='1'
          height={height}
        />
      </svg>
      <span className='meter__percentage'>
        {percentageLabel}%
      </span>
    </div>
  )
}
