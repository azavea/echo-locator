// @flow
import Icon from '@conveyal/woonerf/components/icon'
import React from 'react'
import message from '@conveyal/woonerf/message'

import NeighborhoodListInfo from './neighborhood-list-info'

type Props = {
  cardColor: string,
  children?: any,
  downloadIsochrone?: Function,
  setShowOnMap: Function,
  showOnMap: boolean,
  title: string
}

export default class RouteCard extends React.PureComponent<Props> {
  render () {
    const {
      cardColor,
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

    const modeKey = neighborhood.segments && neighborhood.segments.length
      ? 'NeighborhoodDetails.TransitMode'
      : 'NeighborhoodDetails.DriveMode'

    return (
      <div
        className='neighborhood-summary'
        role='button'
        onClick={(e) => goToDetails(e, neighborhood)}
        style={{borderTopColor: cardColor}}
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
            <img
              className='neighborhood-summary__image'
              src='https://via.placeholder.com/120x90'
              width='120'
              alt=''
            />
            <div className='neighborhood-summary__trip'>
              <div className='neighborhood-summary__duration'>
                {Math.round(time)} {message('Units.Mins')}
              </div>
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
