// @flow
import Icon from '@conveyal/woonerf/components/icon'
import message from '@conveyal/woonerf/message'
import React from 'react'
import Popup from '../components/text-alert-popup';  

import {ROUND_TRIP_MINUTES} from '../constants'
import type {NeighborhoodImageMetadata} from '../types'
import {getFirstNeighborhoodImage} from '../utils/neighborhood-images'
import MapMarkerIcon from '../icons/map-marker-icon'

import NeighborhoodListInfo from './neighborhood-list-info'

type Props = {
  children?: any,
  downloadIsochrone?: Function,
  title: string
}

export default class RouteCard extends React.PureComponent<Props> {
  constructor (props) {
    super(props)

    this.state = {
      showTextPopup: false,
      showOptOutMessage:false
    }

    this.summaryImage = this.summaryImage.bind(this)

    this.toggleTextPopup = this.toggleTextPopup.bind(this)
    this.setFavoriteAndToggle = this.setFavoriteAndToggle.bind(this)

  }

  toggleTextPopup(isFavorite) {
    if (!this.state.showTextPopup && !this.state.showOptOutMessage) {
      console.log('entered')
      if (isFavorite) {
        this.setState({
          showOptOutMessage: true
        })
      }
      else {
        console.log('entered2')
        this.setState({
          showTextPopup: true
        });
      }
    }
    else {
      this.setState({
        showTextPopup: false,
        showOptOutMessage: false
      })
    }
  }

  setFavoriteAndToggle(id, userProfile, setFavorite) {
    this.toggleTextPopup();
    setFavorite(id, userProfile);
  }

  summaryImage (props) {
    const nprops = props.nprops
    const image: NeighborhoodImageMetadata = getFirstNeighborhoodImage(nprops)
    if (!image) {
      return null
    }

    return (
      <div
        className='neighborhood-summary__image'
        title={image.attribution}>
        <img
          alt={image.description}
          src={image.thumbnail} />
      </div>
    )
  }

  render () {
    const {
      activeNeighborhood,
      isFavorite,
      goToDetails,
      neighborhood,
      origin,
      setActiveNeighborhood,
      setFavorite,
      title,
      userProfile
  } = this.props

    const active = activeNeighborhood === neighborhood.properties.id
    const markerClass = `neighborhood-summary__marker ${active ? 'neighborhood-summary__marker--on' : ''}`
    const { time } = neighborhood
    const originLabel = origin ? origin.label || '' : ''
    const currentDestination = userProfile.destinations.find(d => originLabel.endsWith(d.location.label))


    const modeKey = userProfile.hasVehicle
      ? 'NeighborhoodDetails.DriveMode'
      : 'NeighborhoodDetails.TransitMode'

    const SummaryImage = this.summaryImage

    const roundedTripTime = Math.round(time / ROUND_TRIP_MINUTES) * ROUND_TRIP_MINUTES

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
              e.preventDefault()
              e.stopPropagation()
              e.nativeEvent.stopImmediatePropagation()
              this.toggleTextPopup(isFavorite)
            }}
          />
          <div className='neighborhood-summary__name'>
            <div className='neighborhood-summary__title'>{title}</div>
          </div>
          <MapMarkerIcon className={markerClass} active={active} />
        </header>
        {this.state.showTextPopup ?  
        <Popup  
            userProfile={userProfile}
            id={neighborhood.properties.id}
            closePopup={this.toggleTextPopup.bind(this)}  
            setFavorite={setFavorite.bind(this, neighborhood.properties.id, userProfile)}
            optIn={true}
            setFavoriteAndToggle={this.setFavoriteAndToggle.bind(this, neighborhood.properties.id, userProfile, setFavorite)}
        />  
        : null  
        } 
        {this.state.showOptOutMessage ?  
        <Popup 
            userProfile={userProfile}
            id={neighborhood.properties.id} 
            closePopup={this.toggleTextPopup.bind(this)}
            setFavorite={setFavorite.bind(this, neighborhood.properties.id, userProfile)}
            optIn={false}
            setFavoriteAndToggle={this.setFavoriteAndToggle.bind(this, neighborhood.properties.id, userProfile, setFavorite)}
        />  
        : null  
        } 
        <div className='neighborhood-summary__contents'>
          <div className='neighborhood-summary__descriptive'>
            <SummaryImage nprops={neighborhood.properties} />
            <div className='neighborhood-summary__trip'>
              <div className='neighborhood-summary__duration'>
                {message('Units.About')} {roundedTripTime} {message('Units.Mins')}
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
