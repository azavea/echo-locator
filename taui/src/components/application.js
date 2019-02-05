// @flow
import lonlat from '@conveyal/lonlat'
import React, {Component} from 'react'

import type {
  Coordinate,
  GeocoderStore,
  LogItems,
  LonLat,
  PointsOfInterest,
  UIStore
} from '../types'
import {getAsObject} from '../utils/hash'

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
    const p = this.props
    return (
      <div className={p.isLoading ? 'isLoading' : ''}>
        <div className='Fullscreen'>
          <svg width='0' height='0' style={{position: 'absolute'}}>
            <defs>
              <filter id='shadow'>
                <feDropShadow dx='1' dy='1' stdDeviation='1' />
              </filter>
            </defs>
          </svg>
          <h3>Hello</h3>
        </div>
      </div>
    )
  }
}
