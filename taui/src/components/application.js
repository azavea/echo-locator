// @flow
import React, {Component} from 'react'
import { Switch, Redirect, Route } from 'react-router-dom'

import type {
  AccountProfile,
  Coordinate,
  GeocoderStore,
  LogItems,
  LonLat,
  PointsOfInterest,
  UIStore
} from '../types'

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

    // Load the selected user profile from localStorage, if any
    this.props.loadProfile()
  }

  /**
   *
   */
  render () {
    const props = this.props
    const profileLoading = this.props.data.profileLoading === undefined ? true
      : this.props.data.profileLoading
    const userProfile = this.props.data.userProfile

    return (
      <Switch>
        <Route exact path='/' render={() => (
          profileLoading || userProfile
            ? (<Redirect to='/map' />) : (<Redirect to='/search' />))} />
        <Route path='/map' render={() => (
          profileLoading || userProfile
            ? (<MainPage {...props} />) : (<Redirect to='/search' />))} />
        <Route path='/search' render={() => <SelectAccount
          {...props}
          headOfHousehold={props.headOfHousehold}
          voucherNumber={props.voucherNumber} />} />
      </Switch>
    )
  }
}
