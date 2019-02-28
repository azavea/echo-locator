// @flow
import React, {Component} from 'react'
import { Link, Switch, Route } from 'react-router-dom'
import Storage from '@aws-amplify/storage'

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
    networks: Network[]
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
  updateUserProfile: AccountProfile => void,
  userProfile: AccountProfile
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
    return (
      <Switch>
        <Route exact path='/' render={() => <Main {...props} />} />
        <Route path='/map' render={() => <MainPage {...props} />} />
        <Route path='/test' render={() => <Test {...props} />} />
        <Route path='/select' render={() => <SelectAccount
          {...props}
          headOfHousehold={props.headOfHousehold}
          voucherNumber={props.voucherNumber} />} />
      </Switch>
    )
  }
}

const Main = () => (
  <div>
    <div className='Splash'>
      <h2 className='SplashBoxHeader'>New Search</h2>
      <div className='SplashBox'>
        <Link to='/map'>Go to map</Link>
        <br />
        <Link to='/test'>Test route</Link>
        <br />
        <Link to='/select'>Select account</Link>
      </div>
    </div>
  </div>
)

const testS3 = () => {
  console.log('testS3')
  /*
  Storage.put('test.txt', 'Hello, world!')
    .then(result => console.log(result))
    .catch(err => console.log(err))
  */
  // Storage.get('test.txt').then(result => console.log(result)).catch(err => console.error(err))

  Storage.list('')
    .then(result => {
      console.log(result)
      const keys = result.map((r) => r.key)
      console.log(keys)
    })
    .catch(err => console.log(err))
}

const Test = () => {
  return (
    <div>
      <h2>Something else</h2>
      <br />
      <button onClick={() => testS3()}>Click me</button>
    </div>
  )
}
