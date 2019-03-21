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
  onClick = (neighborhood) => {
    console.log('TODO: #28 go to neighborhood details')
    console.log(neighborhood)
  }
  render () {
    const {
      cardColor,
      children,
      neighborhood,
      setActiveNeighborhood,
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
              onClick={(e) => console.log(e)}
              title={message('RouteCard.MarkerLink')}
            >
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
