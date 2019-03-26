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
    <tbody>
      <tr className='BestTrip'>
        <td><span className='fa fa-street-view' /></td>
        <td>
          <span>Take </span>
          {bestJourney.map((segment, index) => (
            <Segment key={index} segment={segment} />
          ))}
          {travelTime > 120
            ? <span className='decrease'>inaccessible within 120 minutes</span>
            : <span>in
              <strong> {travelTime}</strong> {message('Units.Mins')}
            </span>}
        </td>
      </tr>
      {routeSegments.length > 1 &&
        <tr className='AlternateTrips'>
          <td><span className='fa fa-map-signs' /></td>
          <td>
            <span>{message('Systems.AlternateTripsTitle')} </span>
            {alternateJourneys.map((segments, jindex) => (
              <span key={jindex}>
                {segments.map((segment, index) => (
                  <Segment key={index} segment={segment} />
                ))}
                {jindex < alternateJourneys.length - 1 && <span>or </span>}
              </span>
            ))}
          </td>
        </tr>}
    </tbody>
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
