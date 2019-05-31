// @flow
export default function Meter ({
  value,
  max = 100,
  average,
  tier,
  width = 100,
  height = 12,
  tooltip
}) {
  return (
    <svg
      className='meter'
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
        width={(value / max) * width}
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
  )
}
