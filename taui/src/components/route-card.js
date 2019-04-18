// @flow
import Icon from '@conveyal/woonerf/components/icon'
import message from '@conveyal/woonerf/message'
import React from 'react'

import type {NeighborhoodImageMetadata} from '../types'
import {getFirstNeighborhoodImage} from '../utils/neighborhood-images'

import NeighborhoodListInfo from './neighborhood-list-info'

type Props = {
  children?: any,
  downloadIsochrone?: Function,
  setShowOnMap: Function,
  showOnMap: boolean,
  title: string
}

export default class RouteCard extends React.PureComponent<Props> {
  constructor (props) {
    super(props)
    this.summaryImage = this.summaryImage.bind(this)
  }

  summaryImage (props) {
    const nprops = props.nprops
    const image: NeighborhoodImageMetadata = getFirstNeighborhoodImage(nprops)
    if (!image) {
      return null
    }

    return (
      <a
        className='neighborhood-summary__image'
        target='_blank'
        title={image.attribution}
        href={image.imageLink}>
        <img
          alt={image.description}
          src={image.thumbnail} />
      </a>
    )
  }

  render () {
    const {
      isFavorite,
      goToDetails,
      neighborhood,
      origin,
      setActiveNeighborhood,
      setFavorite,
      title,
      userProfile
    } = this.props

    const markerClass = `neighborhood-summary__marker ${neighborhood.active ? 'neighborhood-summary__marker--on' : ''}`
    const { time } = neighborhood
    const originLabel = origin ? origin.label || '' : ''
    const currentDestination = userProfile.destinations.find(d => d.location.label === originLabel)

    const modeKey = userProfile.hasVehicle
      ? 'NeighborhoodDetails.DriveMode'
      : 'NeighborhoodDetails.TransitMode'

    const SummaryImage = this.summaryImage

    return (
      <div
        className='neighborhood-summary'
        role='button'
        onClick={(e) => goToDetails(e, neighborhood)}
        onMouseOver={(e) => setActiveNeighborhood(neighborhood.properties.id)}
      >
        <header className='neighborhood-summary__header'>
          <Icon
            className='neighborhood-summary__star'
            type={isFavorite ? 'star' : 'star-o'}
            onClick={(e) => {
              e.stopPropagation()
              setFavorite(neighborhood.properties.id, userProfile)
            }}
          />
          {title}
          <Icon className={markerClass} type='map-marker' />
        </header>
        <div className='neighborhood-summary__contents'>
          <div className='neighborhood-summary__descriptive'>
            <SummaryImage nprops={neighborhood.properties} />
            <div className='neighborhood-summary__trip'>
              {!userProfile.hasVehicle && <div className='neighborhood-summary__duration'>
                {message('Units.About')} {Math.round(time)} {message('Units.Mins')}
              </div>}
              <div className='neighborhood-summary__trajectory'>
                <span className='neighborhood-summary__mode'>
                  {message(modeKey)}
                  &nbsp;
                  {message('NeighborhoodDetails.FromOrigin')}
                </span>
                &nbsp;
                <span className='neighborhood-summary__location'>
                  {currentDestination && currentDestination.purpose.toLowerCase()}
                </span>
              </div>
            </div>
          </div>
          <NeighborhoodListInfo
            neighborhood={neighborhood}
          />
        </div>
      </div>
    )
  }
}
