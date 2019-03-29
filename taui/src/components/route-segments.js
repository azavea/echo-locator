// @flow
import message from '@conveyal/woonerf/message'

import Alert from './tr-alert'

export default function RouteSegments ({hasVehicle, routeSegments, travelTime}) {
  if (routeSegments.length === 0) {
    if (!hasVehicle) {
      return <Alert>{message('Systems.TripsEmpty')}</Alert>
    } else {
      return null
    }
  }

  const [bestJourney, ...alternateJourneys] = routeSegments

  return (
    <div className='route-segments'>
      <div className='route-segments__best-trip'>
        Take&nbsp;
        {bestJourney.map((segment, index) => (
          <Segment key={index} segment={segment} />
        ))}
        {travelTime > 120
          ? <span className='decrease'>inaccessible within 120 minutes</span>
          : <span>in <strong>{travelTime}</strong> {message('Units.Mins')}</span>
        }
      </div>
      {routeSegments.length > 1 &&
        <div className='route-segments__alt-trips'>
          {message('Systems.AlternateTripsTitle')}&nbsp;
          {alternateJourneys.map((segments, jindex) => (
            <span key={jindex}>
              {segments.map((segment, index) => (
                <Segment key={index} segment={segment} />
              ))}
              {jindex < alternateJourneys.length - 1 && 'or '}
            </span>
          ))}
        </div>
      }
    </div>
  )
}

const Segment = ({segment}) => (
  <span
    className='CardSegment'
    style={{
      backgroundColor: segment.backgroundColor || 'inherit',
      color: segment.color || 'inherit',
      textShadow: `0 0 1px ${segment.color === '#fff' ? '#333' : '#fff'}`
    }}
    title={segment.name}
  >
    <i className={`fa fa-${segment.type}`} /> {segment.name}
  </span>
)
