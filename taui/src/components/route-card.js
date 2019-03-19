// @flow
import Icon from '@conveyal/woonerf/components/icon'
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
  onClick = (neighborhood) => {
    console.log('TODO: go to neighborhood details')
    console.log(neighborhood)
  }
  render () {
    const {
      cardColor,
      children,
      neighborhood,
      setActiveNeighborhood,
      setShowOnMap,
      showOnMap,
      title
    } = this.props

    const onClick = this.onClick

    return (
      <div
        className={'Card'}
      >
        <div
          className='CardTitle'
          onClick={(e) => onClick(neighborhood)}
          onMouseOver={(e) => setActiveNeighborhood(neighborhood.properties.id)}
          style={{
            backgroundColor: cardColor,
            cursor: 'pointer'
          }}
        >
          {title}
          <div className='CardLinks'>
            <a
              onClick={setShowOnMap}
              title='Show/hide isochrone for network'
            >
              {showOnMap ? <Icon type='eye-slash' /> : <Icon type='eye' />}
            </a>
            <a
              onClick={(e) => console.log(e)}
              title='Download GeoJSON isochrone for network'
            >
              <Icon type='download' />
            </a>
          </div>
        </div>
        <table className='CardContent'>{children}</table>
      </div>
    )
  }
}
