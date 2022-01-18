// @flow
import { PureComponent } from 'react'
import { withTranslation } from 'react-i18next'
import Icon from '@conveyal/woonerf/components/icon'
import Loader from 'react-loader-spinner'

import {ActiveListing, Listing} from '../types'

type Props = {
  activeListing: ActiveListing,
  bhaListings: Listing,
  clickedNeighborhood: any,
  neighborhood: any,
  realtorListings: Listing,
  setActiveListing: Function => void,
  setBHAListings: Function => void,
  setRealtorListings: Function => void,
  setShowBHAListings: Function => void,
  setShowRealtorListings: Function => void,
  showBHAListings: boolean,
  showRealtorListings: boolean,
  userProfile: AccountProfile
};

class TopBar extends PureComponent<Props, State> {
  props: Props;

  constructor (props) {
    super(props)
    this.error = this.error.bind(this)
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
    // reset listing route
    if (this.props.activeListing && this.props.activeListing.type === type) {
      this.props.setActiveListing(null)
    }
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

  toggleListingsButton = props => {
    const { onShow, onHide, pending, visible, label } = props
    return (
      <label className={`top-bar__label ${visible ? 'top-bar__label--on' : ''}`}>
        {pending ? (
          <Loader
            className='top-bar__spinner'
            type='Oval'
            color='#15379d'
            height='1.6rem'
            width='1.6rem'
          />
        ) : (
          <input
            className='top-bar__checkbox'
            type='checkbox'
            onChange={() => (visible ? onHide() : onShow())}
            checked={visible}
          />
        )}
        {label}
      </label>
    )
  }

  error ({message}) {
    return (
      <div style={{ display: 'inline-block', position: 'relative' }}>
        <Icon type='exclamation-triangle' />
        {message}
      </div>
    )
  }

  render () {
    const p = this.props
    const {
      showBHAListings,
      showRealtorListings,
      bhaListings,
      realtorListings,
      t
    } = p
    const Error = this.error
    const ToggleListingsButton = this.toggleListingsButton

    if (!this.props.clickedNeighborhood) {
      return null
    }
    return (
      <div className='top-bar'>
        <div className='top-bar__heading'>{t('NeighborhoodDetails.ApartmentsToggles')}: </div>
        {<ToggleListingsButton
          onShow={this.handleShowListings.bind(this, 'BHA')}
          onHide={this.handleHideListings.bind(this, 'BHA')}
          pending={bhaListings.pending}
          visible={showBHAListings}
          label={t('NeighborhoodDetails.BHAApartmentsToggle')}
        />}
        {<ToggleListingsButton
          onShow={this.handleShowListings.bind(this, 'Realtor')}
          onHide={this.handleHideListings.bind(this, 'Realtor')}
          pending={realtorListings.pending}
          visible={showRealtorListings}
          label={t('NeighborhoodDetails.RealtorApartmentsToggle')}
        />}
        { (bhaListings.error || realtorListings.error) &&
        <Error message={t('NeighborhoodDetails.ListingsFetchError')} />}
      </div>
    )
  }
}

export default withTranslation()(TopBar)
