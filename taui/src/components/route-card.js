// @flow
import Icon from '@conveyal/woonerf/components/icon'
import message from '@conveyal/woonerf/message'
import React from 'react'

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
      children,
      isFavorite,
      goToDetails,
      neighborhood,
      setActiveNeighborhood,
      setFavorite,
      title,
      userProfile
    } = this.props

    return (
      <div
        className={'Card'}
      >
        <div
          className='CardTitle'
          onClick={(e) => goToDetails(neighborhood)}
          onMouseOver={(e) => setActiveNeighborhood(neighborhood.properties.id)}
          style={{
            backgroundColor: cardColor,
            cursor: 'pointer'
          }}
        >
          <Icon type={isFavorite ? 'star' : 'star-o'}
            onClick={(e) => {
              e.stopPropagation()
              setFavorite(neighborhood.properties.id, userProfile)
            }}
            style={{cursor: 'pointer'}} />
          {title}
          <div className='CardLinks'>
            <a title={message('RouteCard.MarkerLink')}>
              {neighborhood.active
                ? <Icon type='dot-circle-o' />
                : <Icon type='circle-o' />}
            </a>
          </div>
        </div>
        <table className='CardContent'>{children}</table>
      </div>
    )
  }
}
