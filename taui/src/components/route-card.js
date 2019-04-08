// @flow
import Icon from '@conveyal/woonerf/components/icon'
import message from '@conveyal/woonerf/message'
import React from 'react'

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

    // Look for an available image to use as the summary
    let imageField = nprops['town_square_thumbnail'] ? 'town_square' : null
    if (!imageField) {
      imageField = nprops['open_space_or_landmark_thumbnail'] ? 'open_space_or_landmark' : null
    }
    if (!imageField) {
      imageField = nprops['school_thumbnail'] ? 'school' : null
    }
    if (!imageField) {
      imageField = 'street'
    }

    if (!imageField) {
      return null // Have no summary image available
    }

    const description = nprops[imageField + '_description']
    const license = nprops[imageField + '_license']
    const licenseUrl = nprops[imageField + '_license_url']
    const imageLink = nprops[imageField]
    const thumbnail = nprops[imageField + '_thumbnail']
    const userName = nprops[imageField + '_username']

    if (!thumbnail) {
      return null
    }

    // Build the attribution text to display on hover
    let attrText = userName + ' [' + license
    if (licenseUrl) {
      attrText += ' (' + licenseUrl + ')'
    }
    attrText += '], ' + message('NeighborhoodDetails.WikipediaAttribution')

    return (
      <a
        className='neighborhood-summary__image'
        target='_blank'
        title={attrText}
        href={imageLink}>
        <img
          alt={description}
          src={thumbnail} />
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
                {Math.round(time)} {message('Units.Mins')}
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
