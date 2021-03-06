/* eslint-disable complexity */
// @flow
import Icon from '@conveyal/woonerf/components/icon'
import message from '@conveyal/woonerf/message'
import uniq from 'lodash/uniq'
import {PureComponent} from 'react'

import {ROUND_TRIP_MINUTES} from '../constants'
import type {AccountProfile, NeighborhoodImageMetadata} from '../types'
import getCraigslistSearchLink from '../utils/craigslist-search-link'
import getGoogleDirectionsLink from '../utils/google-directions-link'
import getGoSection8SearchLink from '../utils/gosection8-search-link'
import getHotpadsSearchLink from '../utils/hotpads-search-link'
import getZillowSearchLink from '../utils/zillow-search-link'
import {getFirstNeighborhoodImage, getNeighborhoodImage} from '../utils/neighborhood-images'
import Popup from '../components/text-alert-popup'

import RouteSegments from './route-segments'
import NeighborhoodListInfo from './neighborhood-list-info'

type Props = {
  activeListing: any,
  changeUserProfile: any,
  listingTravelTime: any,
  listingsLoading: boolean,
  neighborhood: any,
  setFavorite: any,
  showBHAListings: boolean,
  showRealtorListings: boolean,
  userProfile: AccountProfile
}
export default class NeighborhoodDetails extends PureComponent<Props> {
  props: Props

  constructor (props) {
    super(props)

    this.state = {isFavorite: props.userProfile && props.neighborhood
      ? props.userProfile.favorites.indexOf(props.neighborhood.properties.id) !== -1
      : false,
    showTextPopup: false,
    showOptOutMessage: false,
    showFullDescription: false
    }

    this.neighborhoodStats = this.neighborhoodStats.bind(this)
    this.neighborhoodImage = this.neighborhoodImage.bind(this)
    this.neighborhoodImages = this.neighborhoodImages.bind(this)
    this.summaryImage = this.summaryImage.bind(this)
    this.neighborhoodLinks = this.neighborhoodLinks.bind(this)

    this.starButton = this.starButton.bind(this)

    this.toggleTextPopup = this.toggleTextPopup.bind(this)
    this.toggleDescription = this.toggleDescription.bind(this)

    this.setFavoriteAndToggle = this.setFavoriteAndToggle.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.userProfile && nextProps.neighborhood) {
      const isFavorite = nextProps.userProfile.favorites.indexOf(
        nextProps.neighborhood.properties.id) !== -1
      this.setState({isFavorite})
    }
  }

  // Toggle visibility of text alert popup
  toggleTextPopup () {
    if (!this.state.showTextPopup && !this.state.showOptOutMessage) {
      if (this.state.isFavorite) {
        this.setState({
          showOptOutMessage: true
        })
      } else {
        this.setState({
          showTextPopup: true
        })
      }
    } else {
      this.setState({
        showTextPopup: false,
        showOptOutMessage: false
      })
    }
  }

  toggleDescription () {
    this.setState({
      showFullDescription: !this.state.showFullDescription
    })
  }

  setFavoriteAndToggle (id, userProfile, changeUserProfile, setFavorite) {
    this.toggleTextPopup()
    setFavorite(id, userProfile, changeUserProfile)
  }

  neighborhoodStats (props) {
    const { neighborhood } = props
    return (
      <div className='neighborhood-details__stats'>
        <NeighborhoodListInfo neighborhood={neighborhood} />
      </div>
    )
  }

  starButton (props) {
    const isFavorite = this.state.isFavorite
    const toggleTextPopup = this.toggleTextPopup

    return (
      <button className='neighborhood-details__star'>
        <Icon
          type={isFavorite ? 'heart' : 'heart-o'}
          style={{color: '#02b3cd'}}
          onClick={(e) => {
            toggleTextPopup(isFavorite)
          }} />
      </button>
    )
  }

  neighborhoodImage (props) {
    const image: NeighborhoodImageMetadata = getNeighborhoodImage(props.nprops.neighborhood, props.imageField)
    if (!image) {
      return null
    }

    return (
      <div
        className='neighborhood-summary__image'
        title={image.attribution}
        href={image.imageLink}>
        <img
          alt={image.description}
          src={image.thumbnail} />
      </div>
    )
  }

  summaryImage (props) {
    const image: NeighborhoodImageMetadata = getFirstNeighborhoodImage(props.neighborhood)
    if (!image) {
      return null
    }

    return (
      <div
        className='neighborhood-summary__image'
        title={image.attribution}>
        <img
          alt={image.description}
          src={image.thumbnail} />
      </div>
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
    const { rooms, budget, hasVoucher } = userProfile
    const maxSubsidy = neighborhood.properties['max_rent_' + rooms + 'br']

    return (
      <>
        <h6 className='neighborhood-details__link-heading'>
          Search for {rooms}BR with a max rent of ${hasVoucher ? maxSubsidy : budget}
        </h6>
        <div className='neighborhood-details__links'>
          <a
            className='neighborhood-details__link'
            href={getZillowSearchLink(
              neighborhood.properties.id,
              userProfile.rooms,
              hasVoucher ? maxSubsidy : budget)}
            target='_blank'
          >
            {message('NeighborhoodDetails.ZillowSearchLink')}
          </a>
          <a
            className='neighborhood-details__link'
            href={getCraigslistSearchLink(
              neighborhood.properties.id,
              userProfile.rooms,
              hasVoucher ? maxSubsidy : budget)}
            target='_blank'
          >
            {message('NeighborhoodDetails.CraigslistSearchLink')}
          </a>
          <a
            className='neighborhood-details__link'
            href={getHotpadsSearchLink(
              neighborhood.properties.id,
              userProfile.rooms,
              hasVoucher ? maxSubsidy : budget)}
            target='_blank'
          >
            {message('NeighborhoodDetails.HotpadsSearchLink')}
          </a>
          <a
            className='neighborhood-details__link'
            href={getGoSection8SearchLink(
              neighborhood.properties.id,
              userProfile.rooms,
              hasVoucher ? maxSubsidy : budget)}
            target='_blank'
          >
            {message('NeighborhoodDetails.GoSection8SearchLink')}
          </a>
        </div>
        <div className='neighborhood-details__line' />
        <h6 className='neighborhood-details__link-heading'>
          {message('NeighborhoodDetails.MoreSearchToolsLinksHeading')}
        </h6>
        <div className='neighborhood-details__links'>
          <a
            className='neighborhood-details__link'
            href='https://www.metrohousingboston.org/apartment-listings/'
            target='_blank'
          >
            {message('NeighborhoodDetails.MetroHousingLink')}
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
      </>
    )
  }

  render () {
    const {
      changeUserProfile,
      neighborhood,
      origin,
      setFavorite,
      activeListing,
      listingTravelTime,
      userProfile
    } = this.props
    const hasVehicle = userProfile ? userProfile.hasVehicle : false
    const NeighborhoodStats = this.neighborhoodStats
    const SummaryImage = this.summaryImage
    const NeighborhoodLinks = this.neighborhoodLinks

    const StarButton = this.starButton

    if (!neighborhood || !userProfile) {
      return null
    }

    // Look up the currently selected user profile destination from the origin
    const originLabel = origin ? origin.label || '' : ''
    const currentDestination = userProfile.destinations.find(d => originLabel.endsWith(d.location.label))
    const { id, town } = neighborhood.properties
    const { rooms, budget, hasVoucher } = userProfile
    const description = neighborhood.properties['town_website_description']
    const maxSubsidy = neighborhood.properties['max_rent_' + rooms + 'br']

    const bestJourney = neighborhood.segments && neighborhood.segments.length
      ? neighborhood.segments[0] : null

    const listingTime = listingTravelTime

    const roundedTripTime = Math.round(neighborhood.time / ROUND_TRIP_MINUTES) * ROUND_TRIP_MINUTES

    // lat,lon strings for Google Directions link from neighborhood to current destination
    const destinationCoordinateString = origin.position.lat + ',' + origin.position.lon
    const originCoordinateString = neighborhood.geometry.coordinates[1] +
      ',' + neighborhood.geometry.coordinates[0]
    return (
      <div className='neighborhood-details'>
        <div className='neighborhood-details__header-section'>
          <header className='neighborhood-details__header'>
            <SummaryImage neighborhood={neighborhood.properties} />
          </header>
          <div className='neighborhood-details__name'>
            <div className='neighborhood-details__title'>{town} &ndash; {id}</div>
            <StarButton />
          </div>
          {!this.state.showFullDescription &&
            <div className='neighborhood-details__desc'>
              {description.substring(0, 80)}...&nbsp;
              <button className='neighborhood-details__button' onClick={this.toggleDescription}>
                Read More
              </button>
            </div>
          }
          {this.state.showFullDescription &&
            <div className='neighborhood-details__desc'>
              {description} &nbsp;
              <button className='neighborhood-details__button' onClick={this.toggleDescription}>
                Read Less
              </button>
              <h6 className='neighborhood-details__link-heading' style={{marginTop: '1rem'}}>
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
              </div>
            </div>
          }
          <div className='neighborhood-details__header-line' />
          <NeighborhoodStats
            neighborhood={neighborhood}
            userProfile={userProfile} />
          <div className='neighborhood-details__header-line' />
          <div className='neighborhood-details__rent'>
            <span className='neighborhood-details__rent-label'>{hasVoucher ? message('NeighborhoodDetails.MaxRent') : 'Budget'} </span>
            <span className='neighborhood-details__rent-value'>${hasVoucher ? maxSubsidy : budget} </span>
            <span className='neighborhood-details__rent-rooms'>{rooms}BR</span>
          </div>
        </div>
        {this.state.showTextPopup
          ? <div className='popup' onClick={(e) => { e.stopPropagation() }}>
            <Popup
              id={id}
              city={town}
              userProfile={userProfile}
              closePopup={this.toggleTextPopup.bind(this)}
              setFavorite={setFavorite.bind(this, id, userProfile, changeUserProfile)}
              optIn
              setFavoriteAndToggle={this.setFavoriteAndToggle.bind(this, id, userProfile, changeUserProfile, setFavorite)}
              activeNeighborhoods={this.state.activeNeighborhoods}
            />
          </div>
          : null
        }
        {this.state.showOptOutMessage
          ? <div className='popup' onClick={(e) => { e.stopPropagation() }}>
            <Popup
              id={id}
              city={town}
              userProfile={userProfile}
              closePopup={this.toggleTextPopup.bind(this)}
              setFavorite={setFavorite.bind(this, id, userProfile, changeUserProfile)}
              optIn={false}
              setFavoriteAndToggle={this.setFavoriteAndToggle.bind(this, id, userProfile, changeUserProfile, setFavorite)}
              activeNeighborhoods={this.state.activeNeighborhoods}
            />
          </div>
          : null
        }
        {!activeListing &&
        <div className='neighborhood-details__section'>
          <div className='neighborhood-details__title'>
            Transit Directions
          </div>
          <div className='neighborhood-details__trip'>
            <div>
              {message('Units.About')}&nbsp;
              {roundedTripTime}&nbsp;
              {message('Units.Mins')}&nbsp;
              <ModesList segments={bestJourney} />&nbsp;
              {message('NeighborhoodDetails.FromOrigin')}&nbsp;
              <span style={{fontWeight: 'bold'}}>{currentDestination && currentDestination.purpose.toLowerCase()}</span>
            </div>
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
          {!hasVehicle &&
            <div>
              <div className='neighborhood-details__line' />
              <RouteSegments
                hasVehicle={hasVehicle}
                routeSegments={neighborhood.segments}
                travelTime={neighborhood.time}
              />
            </div>
          }
        </div>}
        {activeListing &&
          <div className='neighborhood-details__section'>
            <div className='neighborhood-details__title'>
              {message('NeighborhoodDetails.Section8Link')}
            </div>
            <div className='neighborhood-details__trip'>
              {listingTime}&nbsp;
              {message('Units.Mins')}&nbsp;to selected listing
              <a
                className='neighborhood-details__directions'
                href={getGoogleDirectionsLink(
                  activeListing[1] + ',' + activeListing[0],
                  destinationCoordinateString,
                  hasVehicle)}
                target='_blank'
              >
                {message('NeighborhoodDetails.DirectionsLink')}
              </a>
            </div>
          </div>
        }
        <div className='neighborhood-details__section'>
          <NeighborhoodLinks
            hasVehicle={hasVehicle}
            neighborhood={neighborhood}
            origin={origin}
            userProfile={userProfile} />
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
