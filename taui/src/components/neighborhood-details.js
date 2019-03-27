// @flow
import Icon from '@conveyal/woonerf/components/icon'
import message from '@conveyal/woonerf/message'
import uniq from 'lodash/uniq'
import {PureComponent} from 'react'

import type {AccountProfile} from '../types'
import getGoogleDirectionsLink from '../utils/google-directions-link'

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

    if (!neighborhood || !userProfile) {
      return null
    }

    // Look up the currently selected user profile destination from the origin
    const originLabel = origin ? origin.label || '' : ''
    const currentDestination = userProfile.destinations.find(d => d.location.label === originLabel)

    const { id, town } = neighborhood.properties
    const { time } = neighborhood

    const bestJourney = neighborhood.segments && neighborhood.segments.length
      ? neighborhood.segments[0] : null

    return (
      <div className='Card'>
        <div className='CardTitle'>
          <Icon type={isFavorite ? 'star' : 'star-o'}
            onClick={(e) => setFavorite(neighborhood.properties.id, userProfile, changeUserProfile)}
            style={{cursor: 'pointer'}} />
          <span>{town} - {id}</span>
        </div>
        <table className='CardContent'>
          <tbody>
            <tr className='BestTrip'>
              <td><span><strong>{time}</strong> {message('Units.Mins')}</span></td>
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
const ModesList = ({segments}) => (
  <span>{uniq(segments.map(s => s.type)).join('/')}</span>
)
