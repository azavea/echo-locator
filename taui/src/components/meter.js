// @flow
import ReactTooltip from 'react-tooltip'

import {TOOLTIP_HIDE_DELAY_MS} from '../constants'
import {getTier} from '../utils/scaling'

export default function Meter ({
  value,
  max = 100,
  average = 50,
  width = 100,
  height = 10,
  tooltip,
  category,
  id
}) {
  const percentage = value / max
  const percentageLabel = Math.round(percentage * 100)
  const tier = getTier(percentage)

  return (
    <div className='meter'
      data-iscapture
      data-delay-hide={TOOLTIP_HIDE_DELAY_MS}
      data-effect='solid'
      data-for={`meter-tooltip-${category}-${id}`}
      data-id={`meter-${category}-${id}`}
      id={`meter-${category}-${id}`}
      data-tip={tooltip}>
      <ReactTooltip
        clickable
        html
        effect='solid'
        isCapture
        delayHide={TOOLTIP_HIDE_DELAY_MS}
        className='map-sidebar__tooltip'
        data-id={`meter-tooltip-${category}-${id}`}
        id={`meter-tooltip-${category}-${id}`} />
      <svg
        className='meter__chart'
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
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
