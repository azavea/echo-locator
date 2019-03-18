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
  centerCoordinates: Coordinate,
  zoom: number
}

type Props = {
  accessibility: number[][],
  actionLog: LogItems,
  activeTransitive: any,
  allTransitive: any,
  data: {
    grids: string[],
    neighborhoodBounds: any,
    neighborhoods: any,
    networks: Network[],
    profileLoading: boolean,
    userProfile: AccountProfile
  },
  drawIsochrones: Function[],
  drawNeighborhoodRotues: any[],
  drawOpportunityDatasets: any[],
  drawRoutes: any[],
  geocode: (string, Function) => void,
  geocoder: GeocoderStore,
  initialize: Function => void,
  isLoading: boolean,
  isochrones: any[],
  loadProfile: Function => any,
  map: MapState,
  neighborhoodBounds: any,
  neighborhoodRoutes: any,
  neighborhoodTravelTimes: any,
  neighborhoods: any,
  pointsOfInterest: any, // FeatureCollection
  pointsOfInterestOptions: PointsOfInterest,
  reverseGeocode: (string, Function) => void,
  setEnd: any => void,
  setProfile: Function => void,
  setSelectedTimeCutoff: any => void,
  setStart: any => void,
  showComparison: boolean,
  timeCutoff: any,
  travelTimes: number[],
  ui: UIStore,
  uniqueRoutes: any[],
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
          isAnonymous ? (<Redirect to='/profile' />) : <SelectAccount
            {...props}
            headOfHousehold={props.headOfHousehold}
            voucherNumber={props.voucherNumber} />)} />
        <Route path='/profile' render={() => (
          profileLoading || userProfile
            ? (<EditProfile {...props} />) : (<Redirect to='/search' />))} />
        <Route component={NoMatch} />
      </Switch>
    )
  }
}
