// @flow
import Icon from '@conveyal/woonerf/components/icon'
import message from '@conveyal/woonerf/message'
import {PureComponent} from 'react'

import getGoogleDirectionsLink from '../utils/google-directions-link'

export default class NeighborhoodDetails extends PureComponent<Props> {
  props: Props

  constructor (props) {
    super(props)

    this.state = {
      isFavorite: false
    }
    this.setFavorite = this.setFavorite.bind(this)
  }

  setFavorite () {
    console.log('TODO: #33 save/unsave neighborhood to favorites')
    this.setState({isFavorite: !this.state.isFavorite})
  }

  render () {
    const { neighborhood } = this.props
    const { isFavorite } = this.state

    if (!neighborhood) {
      return null
    }

    const { id, town } = neighborhood.properties
    const { time } = neighborhood

    const bestJourney = neighborhood.segments && neighborhood.segments.length
      ? neighborhood.segments[0] : null

    const setFavorite = this.setFavorite

    return (
      <div className='Card'>
        <div className='CardTitle'>
          <Icon type={isFavorite ? 'star' : 'star-o'}
            onClick={setFavorite}
            style={{cursor: 'pointer'}} />
          <span>{town} - {id}</span>
        </div>
        <table className='CardContent'>
          <tbody>
            <tr className='BestTrip'>
              <td><span className='fa fa-street-view' /></td>
              <td>
                {bestJourney.map((segment, index) => (
                  <Segment key={index} segment={segment} />
                ))}
                {time > 120
                  ? <span className='decrease'>inaccessible within 120 minutes</span>
                  : <span>in
                    <strong> {time}</strong> {message('Units.Mins')}
                  </span>}
              </td>
            </tr>
          </tbody>
        </table>
        <br />
        <div>
          <a href={getGoogleDirectionsLink(id)} target='_blank'>
            {message('NeighborhoodDetails.GoogleMapsLink')}
          </a>
        </div>
      </div>
    )
  }
}

// FIXME: copied from route-segments
const Segment = ({segment}) => (
  <span
    className='CardSegment'
    style={{
      backgroundColor: segment.backgroundColor || 'inherit',
      color: segment.color || 'inherit',
      textShadow: `0 0 1px ${segment.color === '#fff' ? '#333' : '#fff'}`
    }}
    title={segment.name}
  >
    <i className={`fa fa-${segment.type}`} /> {segment.name}
  </span>
)
