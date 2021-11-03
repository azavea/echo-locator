// @flow
import { PureComponent } from 'react'
import message from '@conveyal/woonerf/message'
import Icon from '@conveyal/woonerf/components/icon'

import Listing from '../types'

type Props = {
  bhaListings: Listing,
  clickedNeighborhood: any,
  neighborhood: any,
  realtorListings: Listing,
  setBHAListings: Function => void,
  setRealtorListings: Function => void,
  setShowBHAListings: Function => void,
  setShowRealtorListings: Function => void,
  showBHAListings: boolean,
  showRealtorListings: boolean,
  userProfile: AccountProfile
};

export default class TopBar extends PureComponent<Props, State> {
  props: Props;

  constructor (props) {
    super(props)
    this.showListingsButton = this.showListingsButton.bind(this)
    this.hideListingsButton = this.hideListingsButton.bind(this)
    this.errorMessage = this.errorMessage.bind(this)
  }

  componentDidUpdate (prevProps) {
    // Checking against previous props prevents looping error handling
    if ((
      (this.props.bhaListings.error && prevProps.bhaListings !==
        this.props.bhaListings) ||
      (this.props.realtorListings.error && prevProps.realtorListings !==
        this.props.realtorListings))) {
      this.handleError()
    }
  }

  handleShowListings = (type, e) => {
    // dispatch action to get and show BHA or realtor listings here
    switch (type) {
      case 'BHA':
        this.props.setBHAListings()
        this.props.setShowBHAListings(true)
        break
      case 'Realtor':
        this.props.setRealtorListings()
        this.props.setShowRealtorListings(true)
        break
    }
  }

  handleHideListings = (type, e) => {
    // dispatch action to hide listings here
    switch (type) {
      case 'BHA':
        this.props.setShowBHAListings(false)
        break
      case 'Realtor':
        this.props.setShowRealtorListings(false)
        break
    }
  }

  handleError = () => {
    // reset button to show
    // show error message for 3 sec then reset listings state
    if (this.props.bhaListings.error) {
      this.handleHideListings('BHA')
      setTimeout(() => {
        this.props.setBHAListings({'data': []})
      }, 3000)
    }
    if (this.props.realtorListings.error) {
      this.handleHideListings('Realtor')
      setTimeout(() => {
        this.props.setRealtorListings({'data': []})
      }, 3000)
    }
  }

  showListingsButton (props) {
    const { message, handleClick } = props

    return (
      <button
        className='top-bar__button'
        onClick={handleClick}>{ message }
      </button>
    )
  }

  hideListingsButton (props) {
    const { message, handleClick } = props

    return (
      <button
        className='top-bar__button-highlighted'
        onClick={handleClick}> { message }
      </button>
    )
  }

  errorMessage () {
    return (
      <div style={{ display: 'inline-block', position: 'relative' }}>
        <Icon type='exclamation-triangle' />
        There was an error fetching your listings
      </div>
    )
  }

  render () {
    const p = this.props
    const {
      showBHAListings,
      showRealtorListings
    } = p
    const ShowListingsButton = this.showListingsButton
    const HideListingsButton = this.hideListingsButton
    const ErrorMessage = this.errorMessage

    if (!this.props.clickedNeighborhood) {
      return null
    }
    return (
      <div className='top-bar'>
        <div className='top-bar__bar'>
          <div className='top-bar__heading'>Apartments: </div>
          {showBHAListings ? (
            <HideListingsButton
              message={message('NeighborhoodDetails.HideBHAApartments')}
              handleClick={this.handleHideListings.bind(this, 'BHA')}
            />
          ) : (
            <ShowListingsButton
              message={message('NeighborhoodDetails.ShowBHAApartments')}
              handleClick={this.handleShowListings.bind(this, 'BHA')}
            />
          )}
          {showRealtorListings ? (
            <HideListingsButton
              message={message('NeighborhoodDetails.HideRealtorApartments')}
              handleClick={this.handleHideListings.bind(this, 'Realtor')}
            />
          ) : (
            <ShowListingsButton
              message={message('NeighborhoodDetails.ShowRealtorApartments')}
              handleClick={this.handleShowListings.bind(this, 'Realtor')}
            />
          )}
          { (this.props.bhaListings.error || this.props.realtorListings.error) && <ErrorMessage />}
        </div>
      </div>
    )
  }
}
