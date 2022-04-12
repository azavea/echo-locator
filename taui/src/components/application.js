// @flow
import { withTranslation } from 'react-i18next'
import React, {Component} from 'react'
import { Switch, Redirect, Route } from 'react-router-dom'

import type {
  AccountProfile,
  ActiveListing,
  ActiveListingDetail,
  Coordinate,
  GeocoderStore,
  LogItems,
  LonLat,
  PointsOfInterest,
  UIStore,
  Listing
} from '../types'

import EditProfile from './edit-profile'
import MainPage from './main-page'

type Network = {
  active: boolean,
  name: string
}

type MapState = {
  bounds: any[],
  centerCoordinates: Coordinate,
  zoom: number
}

type Props = {
  accessibility: number[][],
  actionLog: LogItems,
  activeListing: ActiveListing,
  activeNeighborhoodBounds: any,
  bhaListings: Listing,
  data: {
    grids: string[],
    neighborhoodBounds: any,
    neighborhoods: any,
    networks: Network[],
    page: number,
    profileLoading: boolean,
    showDetails: boolean,
    showFavorites: boolean,
    userProfile: AccountProfile
  },
  detailListing: ActiveListingDetail,
  detailNeighborhood: any,
  displayNeighborhoods: any[],
  displayPageNeighborhoods: any[],
  drawIsochrones: Function[],
  drawListingRoute: {},
  drawNeighborhoodRotues: any[],
  drawOpportunityDatasets: any[],
  drawRoutes: any[],
  estMaxRent: Number,
  geocode: (string, Function) => void,
  geocoder: GeocoderStore,
  initialize: Function => void,
  isLoading: boolean,
  isochrones: any[],
  listNeighborhoods: any[],
  listingRoute: {},
  loadProfile: Function => any,
  map: MapState,
  neighborhoodBounds: any,
  neighborhoodBoundsExtent: any[],
  neighborhoodRoutes: any,
  neighborhoodTravelTimes: any,
  neighborhoods: any,
  neighborhoodsSortedWithRoutes: any,
  page: number,
  pageEndingOffset: number,
  pointsOfInterest: any, // FeatureCollection
  pointsOfInterestOptions: PointsOfInterest,
  realtorListings: Listing,
  reverseGeocode: (string, Function) => void,
  routableNeighborhoodCount: number,
  routableNeighborhoods: any,
  setActiveListing: Function => void,
  setActiveNeighborhood: Function => void,
  setBHAListings: Function => void,
  setDisplayNeighborhoods: Function => void,
  setEnd: any => void,
  setPage: Function => void,
  setProfile: Function => void,
  setRealtorListings: Function => void,
  setSelectedTimeCutoff: any => void,
  setShowBHAListings: Function => void,
  setShowDetails: Function => void,
  setShowFavorites: Function => void,
  setShowRealtorListings: Function => void,
  setStart: any => void,
  showComparison: boolean,
  showFavorites: boolean,
  timeCutoff: any,
  travelTimes: number[],
  ui: UIStore,
  updateEnd: any => void,
  updateEndPosition: LonLat => void,
  updateMap: any => void,
  updateOrigin: any => void,
  updateStart: any => void,
  updateStartPosition: LonLat => void,
  updateUserProfile: AccountProfile => void
}

type State = {
  componentError: any
}

/**
 *
 */
class Application extends Component<Props, State> {
  state = {
    componentError: null
  }

  /**
   * Top level component error catch
   */
  componentDidCatch (error, info) {
    this.setState({
      componentError: {
        error, info
      }
    })
  }

  /**
   * Initialize the application.
   */
  componentDidMount () {
    if (window) {
      window.Application = this
    }
  }

  noMatch ({location}) {
    const {t} = this.props
    return (
      <div>
        <h1>
          {t('PageNotFound')} <code>{location.pathname}</code>
        </h1>
      </div>
    )
  }

  /**
   *
   */
  render () {
    const props = this.props
    const profileLoading = this.props.data.profileLoading === undefined ? true
      : this.props.data.profileLoading
    const userProfile = this.props.data.userProfile
    // Can navigate to map once at least one destination set on the profile.
    const canViewMap = userProfile && userProfile.destinations && userProfile.destinations.length
    const NoMatch = this.noMatch
    return (
      <Switch>
        <Route exact path='/' render={() => (
          profileLoading || canViewMap
            ? (<Redirect to='/map' />) : (<Redirect to='/profile' />))} />
        <Route path='/map' render={() => (
          profileLoading || canViewMap
            ? (<MainPage {...props} />) : (<Redirect to='/profile' />))} />
        <Route path='/profile' render={() => (
          profileLoading || userProfile
            ? (<EditProfile {...props} />) : (<Redirect to='/' />))} />
        <Route component={NoMatch} />
      </Switch>
    )
  }
}
export default withTranslation()(Application)
