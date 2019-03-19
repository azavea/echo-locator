// @flow
import Icon from '@conveyal/woonerf/components/icon'
import message from '@conveyal/woonerf/message'
import sortBy from 'lodash/sortBy'
import {PureComponent} from 'react'

import {NEIGHBORHOOD_RESULTS_COUNT, NETWORK_COLORS} from '../constants'
import type {PointFeature} from '../types'

import RouteCard from './route-card'
import RouteSegments from './route-segments'

type Props = {
  activeNetworkIndex: number,
  isLoading: boolean,
  neighborhoodRoutes: any,
  neighborhoods: Array<PointFeature>,
  showSpinner: boolean,
  travelTimes: number[]
}

/**
 * Sidebar content.
 */
export default class Dock extends PureComponent<Props> {
  props: Props

  constructor (props) {
    super(props)

    this.state = {
      componentError: props.componentError,
      neighborhoods: props.neighborhoods,
      neighborhoodRoutes: props.neighborhoodRoutes,
      neighborhoodsWithRoutes: null
    }

    const {neighborhoods, neighborhoodRoutes, travelTimes} = props
    if (neighborhoodRoutes && travelTimes) {
      const sorted = this.sortNeighborhoodsWithRoutes(
        neighborhoods,
        neighborhoodRoutes,
        travelTimes)

      this.state.neighborhoodsWithRoutes = sorted
    }
  }

  componentWillReceiveProps (nextProps) {
    const {
      neighborhoods,
      neighborhoodRoutes,
      travelTimes
    } = nextProps
    const sorted = this.sortNeighborhoodsWithRoutes(neighborhoods, neighborhoodRoutes, travelTimes)
    this.setState({neighborhoodsWithRoutes: sorted})
  }

  sortNeighborhoodsWithRoutes (neighborhoods, neighborhoodRoutes, travelTimes) {
    if (!neighborhoodRoutes || !neighborhoodRoutes.length || !travelTimes || !neighborhoods) {
      return
    }

    // Put the three best trips found (if any) and the best travel time on its neighborhood object
    // and sort the augmented neighborhoods.
    const neighborhoodsWithRoutes = neighborhoods.features.map((n, index) => {
      const segments = neighborhoodRoutes[index].routeSegments
      const time = travelTimes[index]
      return Object.assign({segments, time}, n)
    })
    const sorted = sortBy(neighborhoodsWithRoutes, 'time')
    return sorted.slice(0, NEIGHBORHOOD_RESULTS_COUNT)
  }

  render () {
    const {
      activeNetworkIndex,
      children,
      isLoading,
      showSpinner
    } = this.props
    const {componentError, neighborhoodsWithRoutes} = this.state
    return <div className='Taui-Dock'>
      <div className='Taui-Dock-content'>
        <div className='title'>
          {showSpinner
            ? <Icon type='spinner' className='fa-spin' />
            : <Icon type='map' />}
          {' '}
          {message('Title')}
        </div>
        {componentError &&
          <div>
            <h1>Error</h1>
            <p>componentError.info}</p>
          </div>}
        {children}
        {!isLoading && neighborhoodsWithRoutes && neighborhoodsWithRoutes.length &&
          neighborhoodsWithRoutes.map((neighborhood, index) =>
            neighborhood.segments && neighborhood.segments.length
              ? (<RouteCard
                cardColor={NETWORK_COLORS[activeNetworkIndex]}
                index={index}
                key={`${index}-route-card`}
                title={neighborhood.properties.town}>
                <RouteSegments
                  routeSegments={neighborhood.segments}
                  travelTime={neighborhood.time}
                />
              </RouteCard>) : null)}
        <div className='Attribution'>
          site made by {' '}
          <a href='https://www.azavea.com' target='_blank' />
        </div>
      </div>
    </div>
  }
}
