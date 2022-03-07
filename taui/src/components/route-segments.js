// @flow
import { useTranslation } from 'react-i18next'

export default function RouteSegments ({hasVehicle, routeSegments, travelTime}) {
  const {t} = useTranslation()

  if (routeSegments.length === 0) {
    return null
  }

  const [bestJourney, ...alternateJourneys] = routeSegments

  return (
    <div className='route-segments'>
      <div className='route-segments__best-trip'>
        <strong>{`${t('Systems.Route')}: `}</strong>
        {bestJourney.map((segment, index) => (
          <Segment key={index} segment={segment} />
        ))}
      </div>
      {routeSegments.length > 1 &&
        <div className='route-segments__alt-trips'>
          <strong>{`${t('Systems.AlternateTripsTitle')}: `}</strong>
          {alternateJourneys.map((segments, jindex) => (
            <span key={jindex}>
              {segments.map((segment, index) => (
                <Segment key={index} segment={segment} />
              ))}
              {jindex < alternateJourneys.length - 1 && `${t('NeighborhoodDetails.Or')} `}
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
