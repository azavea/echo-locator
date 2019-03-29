// @flow
import Icon from '@conveyal/woonerf/components/icon'
import message from '@conveyal/woonerf/message'
import uniq from 'lodash/uniq'
import {PureComponent} from 'react'

import type {AccountProfile, NeighborhoodLabels} from '../types'
import getGoogleDirectionsLink from '../utils/google-directions-link'
import getNeighborhoodPropertyLabels from '../utils/neighborhood-properties'

import RouteSegments from './route-segments'

type Props = {
  changeUserProfile: any,
  neighborhood: any,
  setFavorite: any,
  userProfile: AccountProfile
}
export default class NeighborhoodDetails extends PureComponent<Props> {
  props: Props

  constructor (props) {
    super(props)

    this.state = {isFavorite: props.userProfile && props.neighborhood
      ? props.userProfile.favorites.indexOf(props.neighborhood.properties.id) !== -1
      : false
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.userProfile && nextProps.neighborhood) {
      const isFavorite = nextProps.userProfile.favorites.indexOf(
        nextProps.neighborhood.properties.id) !== -1
      this.setState({isFavorite})
    }
  }

  render () {
    const { changeUserProfile, neighborhood, origin, setFavorite, userProfile } = this.props
    const isFavorite = this.state.isFavorite
    const hasVehicle = userProfile ? userProfile.hasVehicle : false

    if (!neighborhood || !userProfile) {
      return null
    }

    // Look up the currently selected user profile destination from the origin
    const originLabel = origin ? origin.label || '' : ''
    const currentDestination = userProfile.destinations.find(d => d.location.label === originLabel)

    const labels: NeighborhoodLabels = getNeighborhoodPropertyLabels(neighborhood.properties)
    const { id, town } = neighborhood.properties
    const { time } = neighborhood

    const bestJourney = neighborhood.segments && neighborhood.segments.length
      ? neighborhood.segments[0] : null

    return (
      <div className='Card'>
        <div className='CardTitle'>
          <Icon type={isFavorite ? 'star' : 'star-o'}
            onClick={(e) => setFavorite(id, userProfile, changeUserProfile)}
            style={{cursor: 'pointer'}} />
          <span>{town} - {id}</span>
        </div>
        <RouteSegments
          hasVehicle={hasVehicle}
          routeSegments={neighborhood.segments}
          travelTime={neighborhood.time}
        />
        <table className='CardContent'>
          <tbody>
            <tr className='BestTrip'>
              <td>{!userProfile.hasVehicle &&
                <span><strong>{time}</strong> {message('Units.Mins')}</span>}
              </td>
              <td>
                <span>{message('NeighborhoodDetails.ModeSummary')} </span>
                <ModesList segments={bestJourney} />
              </td>
              <td>{currentDestination &&
                <div>
                  <span>{message('NeighborhoodDetails.FromOrigin')}</span>
                  <span> {currentDestination.purpose.toLowerCase()}</span>
                </div>}
              </td>
            </tr>
            <tr>
              <td />
              <td>
                <span>{labels.affordability}</span>
              </td>
              <td>
                <span>{message('NeighborhoodInfo.PercentCollegeGraduates')}: {
                  labels.percentCollegeGraduates}</span>
              </td>
            </tr>
            <tr>
              <td />
              <td>
                <span>{message('NeighborhoodInfo.EducationPercentile')}: {
                  labels.educationPercentile}</span>
              </td>
              <td>
                <span>{message('NeighborhoodInfo.EducationCategory')}: {labels.education}</span>
              </td>
            </tr>
            <tr>
              <td />
              <td>
                <span>{message('NeighborhoodInfo.ViolentCrime')}: {labels.violentCrime}</span>
              </td>
              <td>
                <span>{message('NeighborhoodInfo.Population')}: {labels.population}</span>
              </td>
            </tr>
            <tr>
              <td />
              <td>
                <span>{labels.hasTransitStop}</span>
              </td>
              <td>
                <span>{message('NeighborhoodInfo.NearTransit')}: {labels.nearTransitStop}</span>
              </td>
            </tr>
            <tr>
              <td />
              <td>
                <span>{message('NeighborhoodInfo.NearRailStation')}: {labels.nearRailStation}</span>
              </td>
              <td>
                <span>{message('NeighborhoodInfo.NearPark')}: {labels.nearPark}</span>
              </td>
            </tr>
          </tbody>
        </table>
        <br />
        <div>
          <a href={getGoogleDirectionsLink(id)} target='_blank'>
            {message('NeighborhoodDetails.GoogleMapsLink')}
          </a>
        </div>
      </div>
    )
  }
}

// Builds list of unqiue transit modes used in a trip
const ModesList = ({segments}) => segments && segments.length ? (
  <span>{uniq(segments.map(s => s.type)).join('/')}</span>
) : <span>{message('NeighborhoodDetails.DriveMode')}</span>
