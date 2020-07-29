// @flow
import message from '@conveyal/woonerf/message'
import React, {Component} from 'react'
import { Switch, Redirect, Route } from 'react-router-dom'

import {ANONYMOUS_USERNAME} from '../constants'
import type {
  AccountProfile,
  Coordinate,
  GeocoderStore,
  LogItems,
  LonLat,
  PointsOfInterest,
  UIStore
} from '../types'

import EditProfile from './edit-profile'
import MainPage from './main-page'
import SelectAccount from './select-account'

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
  activeNeighborhoodBounds: any,
  amenities: any,
  data: {
    amenities: any,
    bhaListings: bhaListings[],
    dataListings: Listings[],
    grids: string[],
    listingRoute: any,
    listingsLoading: boolean,
    neighborhoodBounds: any,
    neighborhoods: any,
    networks: Network[],
    page: number,
    profileLoading: boolean,
    showDetails: boolean,
    showFavorites: boolean,
    showListings: boolean,
    userProfile: AccountProfile
  },
  detailNeighborhood: any,
  displayNeighborhoods: any[],
  displayPageNeighborhoods: any[],
  drawIsochrones: Function[],
  drawNeighborhoodRoutes: any[],
  drawOpportunityDatasets: any[],
  drawRoutes: any[],
  geocode: (string, Function) => void,
  geocoder: GeocoderStore,
  initialize: Function => void,
  isLoading: boolean,
  isochrones: any[],
  language: string,
  listNeighborhoods: any[],
  listingTravelTime: any,
  loadProfile: Function => any,
  map: MapState,
  neighborhoodBounds: any,
  neighborhoodBoundsExtent: any[],
  neighborhoodRoutes: any,
  neighborhoodTravelTimes: any,
  neighborhoods: any,
  neighborhoodsSortedWithRoutes: any,
  page: number,
  pageEndingOffset: number, // FeatureCollection
  pointsOfInterest: any,
  pointsOfInterestOptions: PointsOfInterest,
  reverseGeocode: (string, Function) => void,
  routableNeighborhoodCount: number,
  routableNeighborhoods: any,
  setActiveListing: Function => void,
  setActiveNeighborhood: Function => void,
  setBHAListings: Function => void,
  setDataListings: Function => void,
  setDisplayNeighborhoods: Function => void,
  setEnd: any => void,
  setLoadingListings: Function => void,
  setPage: Function => void,
  setProfile: Function => void,
  setSelectedTimeCutoff: any => void,
  setShowDetails: Function => void,
  setShowFavorites: Function => void,
  setShowListings: Function => void,
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
export default class Application extends Component<Props, State> {
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
    return (
      <div>
        <h1>
          {message('PageNotFound')} <code>{location.pathname}</code>
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
    const isAnonymous = userProfile && userProfile.key === ANONYMOUS_USERNAME
    const isCounselor = !!props.authData.counselor && !isAnonymous
    const NoMatch = this.noMatch

    return (
      <Switch>
        <Route exact path='/' render={() => (
          profileLoading || canViewMap
            ? (<Redirect to='/map' />) : (<Redirect to='/search' />))} />
        <Route path='/map' render={() => (
          profileLoading || canViewMap
            ? (<MainPage {...props} />) : (<Redirect to='/search' />))} />
        <Route path='/search' render={() => (
          !isCounselor ? (userProfile ? (<Redirect to='/profile' />) : (console.warn('logout'))) : (
            <SelectAccount
              {...props}
              headOfHousehold={props.headOfHousehold}
              voucherNumber={props.voucherNumber} />))} />
        <Route path='/profile' render={() => (
          profileLoading || userProfile
            ? (<EditProfile {...props} />) : (<Redirect to='/search' />))} />
        <Route component={NoMatch} />
      </Switch>
    )
  }
}
