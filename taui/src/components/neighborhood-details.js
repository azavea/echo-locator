// @flow
import Icon from '@conveyal/woonerf/components/icon'
import message from '@conveyal/woonerf/message'
import uniq from 'lodash/uniq'
import {PureComponent} from 'react'

import {ROUND_TRIP_MINUTES} from '../constants'
import type {AccountProfile, NeighborhoodImageMetadata} from '../types'
import getCraigslistSearchLink from '../utils/craigslist-search-link'
import getGoogleDirectionsLink from '../utils/google-directions-link'
import getGoogleSearchLink from '../utils/google-search-link'
import getGoSection8SearchLink from '../utils/gosection8-search-link'
import getHotpadsSearchLink from '../utils/hotpads-search-link'
import getNeighborhoodImage from '../utils/neighborhood-images'
import getZillowSearchLink from '../utils/zillow-search-link'
import PolygonIcon from '../icons/polygon-icon'

import NeighborhoodListInfo from './neighborhood-list-info'
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

    this.neighborhoodStats = this.neighborhoodStats.bind(this)
    this.neighborhoodImage = this.neighborhoodImage.bind(this)
    this.neighborhoodImages = this.neighborhoodImages.bind(this)
    this.neighborhoodLinks = this.neighborhoodLinks.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.userProfile && nextProps.neighborhood) {
      const isFavorite = nextProps.userProfile.favorites.indexOf(
        nextProps.neighborhood.properties.id) !== -1
      this.setState({isFavorite})
    }
  }

  neighborhoodStats (props) {
    const { neighborhood, userProfile } = props
    const { rooms } = userProfile
    const maxSubsidy = neighborhood.properties['max_rent_' + rooms + 'br'] || '–––'

    return (
      <div className='neighborhood-details__stats'>
        <div className='neighborhood-details__rent'>
          <div className='neighborhood-details__rent-label'>{message('NeighborhoodDetails.MaxRent')}</div>
          <div className='neighborhood-details__rent-value'>${maxSubsidy}</div>
          <div className='neighborhood-details__rent-rooms'>{rooms}br</div>
        </div>
        <NeighborhoodListInfo neighborhood={neighborhood} />
      </div>
    )
  }

  neighborhoodImage (props) {
    const image: NeighborhoodImageMetadata = getNeighborhoodImage(props.nprops, props.imageField)
    if (!image) {
      return null
    }

    return (
      <a
        className='neighborhood-details__image'
        target='_blank'
        title={image.attribution}
        href={image.imageLink}>
        <img
          alt={image.description}
          src={image.thumbnail} />
      </a>
    )
  }

  neighborhoodImages (props) {
    const nprops = props.neighborhood.properties
    const NeighborhoodImage = this.neighborhoodImage

    // Use street picture if any of the other three images are missing
    const showStreet = !nprops.open_space_or_landmark_thumbnail ||
      !nprops.school_thumbnail || !nprops.town_square_thumbnail

    return (
      <div className='neighborhood-details__images'>
        {nprops.open_space_or_landmark_thumbnail && <NeighborhoodImage
          imageField='open_space_or_landmark'
          nprops={nprops} />}
        {nprops.school_thumbnail && <NeighborhoodImage
          imageField='school'
          nprops={nprops} />}
        {nprops.town_square_thumbnail && <NeighborhoodImage
          imageField='town_square'
          nprops={nprops} />}
        {showStreet && nprops.street_thumbnail && <NeighborhoodImage
          imageField='street'
          nprops={nprops} />}
      </div>
    )
  }

  neighborhoodLinks (props) {
    const { neighborhood, userProfile } = props
    const { rooms } = userProfile
    const maxSubsidy = neighborhood.properties['max_rent_' + rooms + 'br']

    return (
      <>
        <h6 className='neighborhood-details__link-heading'>
          Search for {rooms}br with max rent ${maxSubsidy}
        </h6>
        <div className='neighborhood-details__links'>
          <a
            className='neighborhood-details__link'
            href={getZillowSearchLink(
              neighborhood.properties.id,
              userProfile.rooms,
              maxSubsidy)}
            target='_blank'
          >
            {message('NeighborhoodDetails.ZillowSearchLink')}
          </a>
          <a
            className='neighborhood-details__link'
            href={getCraigslistSearchLink(
              neighborhood.properties.id,
              userProfile.rooms,
              maxSubsidy)}
            target='_blank'
          >
            {message('NeighborhoodDetails.CraigslistSearchLink')}
          </a>
          <a
            className='neighborhood-details__link'
            href={getHotpadsSearchLink(
              neighborhood.properties.id,
              userProfile.rooms,
              maxSubsidy)}
            target='_blank'
          >
            {message('NeighborhoodDetails.HotpadsSearchLink')}
          </a>
          <a
            className='neighborhood-details__link'
            href={getGoSection8SearchLink(
              neighborhood.properties.id,
              userProfile.rooms,
              maxSubsidy)}
            target='_blank'
          >
            {message('NeighborhoodDetails.GoSection8SearchLink')}
          </a>
        </div>
        <h6 className='neighborhood-details__link-heading'>
          {message('NeighborhoodDetails.MoreSearchToolsLinksHeading')}
        </h6>
        <div className='neighborhood-details__links'>
          <a
            className='neighborhood-details__link'
            href='https://www.masshousing.com/portal/server.pt/community/rental_housing/240/looking_for_an_affordable_apartment_'
            target='_blank'
          >
            {message('NeighborhoodDetails.MassHousingLink')}
          </a>
          <a
            className='neighborhood-details__link'
            href='https://www.bostonhousing.org/en/Apartment-Listing.aspx?btype=8,7,6,5,4,3,2,1'
            target='_blank'
          >
            {message('NeighborhoodDetails.BHAApartmentsLink')}
          </a>
          <a
            className='neighborhood-details__link'
            href='https://www.apartments.com/'
            target='_blank'
          >
            {message('NeighborhoodDetails.ApartmentsDotComLink')}
          </a>
          <a
            className='neighborhood-details__link'
            href='https://eeclead.force.com/EEC_ChildCareSearch'
            target='_blank'
          >
            {message('NeighborhoodDetails.ChildCareSearchLink')}
          </a>
          <a
            className='neighborhood-details__link'
            href='http://bha.cvrapps.com/'
            target='_blank'
          >
            {message('NeighborhoodDetails.RentEstimatorLink')}
          </a>
        </div>
        <h6 className='neighborhood-details__link-heading'>
          {message('NeighborhoodDetails.AboutNeighborhoodLinksHeading')}
        </h6>
        <div className='neighborhood-details__links'>
          {neighborhood.properties.town_link && <a
            className='neighborhood-details__link'
            href={neighborhood.properties.town_link}
            target='_blank'
          >
            {message('NeighborhoodDetails.WebsiteLink')}
          </a>}
          {neighborhood.properties.wikipedia_link && <a
            className='neighborhood-details__link'
            href={neighborhood.properties.wikipedia_link}
            target='_blank'
          >
            {message('NeighborhoodDetails.WikipediaLink')}
          </a>}
          <a
            className='neighborhood-details__link'
            href={getGoogleSearchLink(neighborhood.properties.id)}
            target='_blank'
          >
            {message('NeighborhoodDetails.GoogleSearchLink')}
          </a>
        </div>
      </>
    )
  }

  render () {
    const { changeUserProfile, neighborhood, origin, setFavorite, userProfile } = this.props
    const isFavorite = this.state.isFavorite
    const hasVehicle = userProfile ? userProfile.hasVehicle : false
    const NeighborhoodStats = this.neighborhoodStats
    const NeighborhoodImages = this.neighborhoodImages
    const NeighborhoodLinks = this.neighborhoodLinks

    if (!neighborhood || !userProfile) {
      return null
    }

    // Look up the currently selected user profile destination from the origin
    const originLabel = origin ? origin.label || '' : ''
    const currentDestination = userProfile.destinations.find(d => originLabel.endsWith(d.location.label))
    const { id, town } = neighborhood.properties
    const description = neighborhood.properties['town_website_description']

    const bestJourney = neighborhood.segments && neighborhood.segments.length
      ? neighborhood.segments[0] : null

    const roundedTripTime = Math.round(neighborhood.time / ROUND_TRIP_MINUTES) * ROUND_TRIP_MINUTES

    // lat,lon strings for Google Directions link from neighborhood to current destination
    const destinationCoordinateString = origin.position.lat + ',' + origin.position.lon
    const originCoordinateString = neighborhood.geometry.coordinates[1] +
      ',' + neighborhood.geometry.coordinates[0]

    return (
      <div className='neighborhood-details'>
        <div className='neighborhood-details__section'>
          <header className='neighborhood-details__header'>
            <Icon
              className='neighborhood-details__star'
              type={isFavorite ? 'star' : 'star-o'}
              onClick={(e) => setFavorite(id, userProfile, changeUserProfile)}
            />
            <div className='neighborhood-details__name'>
              <div className='neighborhood-details__title'>{town} &ndash; {id}</div>
            </div>
            <PolygonIcon className='neighborhood-details__marker' />
          </header>
        </div>
        <div className='neighborhood-details__section'>
          <div className='neighborhood-details__trip'>
            {message('Units.About')}&nbsp;
            {roundedTripTime}&nbsp;
            {message('Units.Mins')}&nbsp;
            <ModesList segments={bestJourney} />&nbsp;
            {message('NeighborhoodDetails.FromOrigin')}&nbsp;
            {currentDestination && currentDestination.purpose.toLowerCase()}
            <a
              className='neighborhood-details__directions'
              href={getGoogleDirectionsLink(
                originCoordinateString,
                destinationCoordinateString,
                hasVehicle)}
              target='_blank'
            >
              {message('NeighborhoodDetails.DirectionsLink')}
            </a>
          </div>
          {!hasVehicle && <RouteSegments
            hasVehicle={hasVehicle}
            routeSegments={neighborhood.segments}
            travelTime={neighborhood.time}
          />}
        </div>
        <div className='neighborhood-details__section'>
          <NeighborhoodStats
            neighborhood={neighborhood}
            userProfile={userProfile} />
        </div>
        <div className='neighborhood-details__section'>
          <NeighborhoodLinks
            hasVehicle={hasVehicle}
            neighborhood={neighborhood}
            origin={origin}
            userProfile={userProfile} />
        </div>
        <div className='neighborhood-details__section'>
          <NeighborhoodImages neighborhood={neighborhood} />
          <div className='neighborhood-details__desc'>
            {description}
          </div>
        </div>
      </div>
    )
  }
}

// Builds list of unqiue transit modes used in a trip
const ModesList = ({segments}) => segments && segments.length ? (
  <>
    {message('NeighborhoodDetails.ModeSummary')}&nbsp;
    {uniq(segments.map(s => s.type)).join('/')}
  </>
) : message('NeighborhoodDetails.DriveMode')
