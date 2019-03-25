// @flow
import Storage from '@aws-amplify/storage'
import Icon from '@conveyal/woonerf/components/icon'
import message from '@conveyal/woonerf/message'
import remove from 'lodash/remove'
import {PureComponent} from 'react'

import {ANONYMOUS_USERNAME} from '../constants'
import type {AccountProfile} from '../types'
import getGoogleDirectionsLink from '../utils/google-directions-link'

export default class NeighborhoodDetails extends PureComponent<Props> {
  props: Props

  constructor (props) {
    super(props)
    this.setFavorite = this.setFavorite.bind(this)
  }

  // save/unsave neighborhood to/from user profile favorites list
  setFavorite () {
    const neighborhoodId = this.props.neighborhood.properties.id
    const profile: AccountProfile = {...this.props.userProfile}
    const favorites = profile.favorites || []

    const isProfileFavorite = favorites.indexOf(neighborhoodId) !== -1
    const favorite = !isProfileFavorite
    if (favorite) {
      // add to favorites
      if (isProfileFavorite) {
        console.warn('already a profile favorite')
      } else {
        favorites.push(neighborhoodId)
      }
    } else {
      // remove from favorites
      if (!isProfileFavorite) {
        console.warn('not a profile favorite to remove')
      } else {
        remove(favorites, f => f === neighborhoodId)
      }
    }

    profile.favorites = favorites
    const {changeUserProfile} = this.props
    const isAnonymous = !profile || profile.key === ANONYMOUS_USERNAME

    if (!isAnonymous) {
      Storage.put(profile.key, JSON.stringify(profile))
        .then(result => {
          changeUserProfile(profile)
        })
        .catch(err => {
          console.error(err)
          // FIXME: change error message and display somewhere
          this.setState({errorMessage: message('Profile.SaveError')})
        })
    } else {
      // Do not attempt to write anonymous profile to S3
      this.props.changeUserProfile(profile)
      this.setState({isFavorite: !this.state.isFavorite})
    }
  }

  render () {
    const { neighborhood, userProfile } = this.props

    if (!neighborhood || !userProfile) {
      return null
    }

    const { rooms } = userProfile
    const { id, town } = neighborhood.properties
    const { time } = neighborhood
    const isFavorite = userProfile.favorites.indexOf(id) !== -1

    const bestJourney = neighborhood.segments && neighborhood.segments.length
      ? neighborhood.segments[0] : null

    const setFavorite = this.setFavorite

    return (
      <div className='Card'>
        <div className='CardTitle'>
          <Icon type={isFavorite ? 'star' : 'star-o'}
            onClick={setFavorite}
            style={{cursor: 'pointer'}} />
          <span>{town} - {id}</span>
        </div>
        <table className='CardContent'>
          <tbody>
            <tr className='BestTrip'>
              <td><span className='fa fa-street-view' /></td>
              <td>
                {bestJourney.map((segment, index) => (
                  <Segment key={index} segment={segment} />
                ))}
                {time > 120
                  ? <span className='decrease'>inaccessible within 120 minutes</span>
                  : <span>in
                    <strong> {time}</strong> {message('Units.Mins')}
                  </span>}
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

// FIXME: copied from route-segments
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
