// @flow
import Icon from '@conveyal/woonerf/components/icon'
import React from 'react'

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
      setActiveNeighborhood,
      setFavorite,
      title,
      userProfile
    } = this.props

    const markerClass = `neighborhood-summary__marker ${neighborhood.active ? 'neighborhood-summary__marker--on' : ''}`

    return (
      <div
        className='neighborhood-summary'
        role='button'
        onClick={(e) => goToDetails(e, neighborhood)}
        style={{borderTopColor: cardColor}}
      >
        <header
          className='neighborhood-summary__header'
          onMouseOver={(e) => setActiveNeighborhood(neighborhood.properties.id)}
        >
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
          <NeighborhoodListInfo
            neighborhood={neighborhood}
          />
        </div>
      </div>
    )
  }
}
