// @flow
import React, {Component} from 'react'
import { Link, Switch, Route } from 'react-router-dom'

import type {
  Coordinate,
  GeocoderStore,
  LogItems,
  LonLat,
  PointsOfInterest,
  UIStore
} from '../types'

import MainPage from './main-page'

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
  map: MapState,
  pointsOfInterest: any, // FeatureCollection
  pointsOfInterestOptions: PointsOfInterest,
  reverseGeocode: (string, Function) => void,
  setEnd: any => void,
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
  updateStartPosition: LonLat => void
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

  /**
   *
   */
  render () {
    const props = this.props
    return (
      <Switch>
        <Route exact path='/' component={Main} />
        <Route path='/map' render={() => <MainPage {...props} />} />
        <Route path='/foo' component={Foo} />
      </Switch>
    )
  }
}

const Main = () => (
  <div>
    <div className='Fullscreen'>
      <h3>Hello</h3>
      <div className='Logo' />
      <button onClick={() => console.log('click')}>Click me</button>
      <br />
      <Link to='/map'>Go to map</Link>
      <br />
      <Link to='/foo'>Foo!</Link>
    </div>
  </div>
)

const Foo = () => (
  <h2>Something else</h2>
)
