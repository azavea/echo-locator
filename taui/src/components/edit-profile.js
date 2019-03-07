// @flow
import Storage from '@aws-amplify/storage'
import message from '@conveyal/woonerf/message'
import {PureComponent} from 'react'

import {
  DEFAULT_PROFILE_DESTINATION_TYPE,
  PROFILE_DESTINATION_TYPES
} from '../constants'
import type {AccountAddress, AccountProfile} from '../types'

import Geocoder from './geocoder'

type Props = {
  geocode: (string, Function) => void,
  reverseGeocode: (string, Function) => void
}

const firstAddress: AccountAddress = {
  location: {
    label: '',
    position: null
  },
  primary: true,
  purpose: DEFAULT_PROFILE_DESTINATION_TYPE
}

/**
 * Edit voucher holder profile.
 */
export default class EditProfile extends PureComponent<Props> {
  props: Props

  constructor (props) {
    super(props)

    this.addAddress = this.addAddress.bind(this)
    this.deleteAddress = this.deleteAddress.bind(this)
    this.deleteProfile = this.deleteProfile.bind(this)
    this.editAddress = this.editAddress.bind(this)
    this.cancel = this.cancel.bind(this)
    this.changeField = this.changeField.bind(this)
    this.getProfileFromState = this.getProfileFromState.bind(this)
    this.save = this.save.bind(this)
    this.setPrimaryAddress = this.setPrimaryAddress.bind(this)

    const profile = props.userProfile

    this.state = {
      destinations: profile ? profile.destinations : [firstAddress],
      hasVehicle: profile ? profile.hasVehicle : false,
      headOfHousehold: profile ? profile.headOfHousehold : '',
      key: profile ? profile.key : '',
      rooms: profile ? profile.rooms : 0,
      voucherNumber: profile ? profile.voucherNumber : '',
      componentError: null,
      errorMessage: ''
    }
  }

  componentWillReceiveProps (nextProps) {
    // Listen for when profile to appear on props, because it is not present
    // on initial load. Only load once by checking state.
    if (!nextProps.isLoading && nextProps.userProfile && !this.state.key) {
      if (!nextProps.userProfile.destinations.length) {
        nextProps.userProfile.destinations = [firstAddress]
      }
      this.setState(nextProps.userProfile)
    }
  }

  cancel (event) {
    console.log('TODO: implement cancel')
  }

  changeField (field, event) {
    const newState = {errorMessage: ''}
    newState[field] = event.currentTarget.value
    this.setState(newState)
  }

  getProfileFromState (): AccountProfile {
    const {destinations, hasVehicle, headOfHousehold, key, rooms, voucherNumber} = this.state
    return {
      destinations,
      hasVehicle,
      headOfHousehold,
      key,
      rooms,
      voucherNumber
    }
  }

  save () {
    const profile: AccountProfile = this.getProfileFromState()
    console.log('save profile')
    console.log(profile)
    if (!profile || !profile.key) {
      console.error('Missing profile or key')
      this.setState({errorMessage:
        'FIXME: should not happen.'})
      return
    } else {
      this.setState({errorMessage: ''})
    }

    Storage.put(profile.key, JSON.stringify(profile))
      .then(result => {
        console.log(result)
        this.props.changeUserProfile(profile)
        //this.props.history.push('/map')
      })
      .catch(err => console.error(err))
  }

  deleteProfile (key, event) {
    console.log('delete profile for key ' + key)
    if (!key) {
      console.error('Cannot delete account without key')
    }

    Storage.remove(key)
      .then(result => {
        console.log('deleted')
      })
      .catch(err => console.error(err))
  }

  addAddress () {
    const destinations = this.state.destinations.slice()
    const newAddress: AccountAddress = {
      location: {
        label: '',
        position: null
      },
      primary: !destinations.length,
      purpose: DEFAULT_PROFILE_DESTINATION_TYPE
    }
    this.setState({destinations: [...destinations, newAddress]})
  }

  deleteAddress (index: number, event) {
    const destinations = this.state.destinations.slice()
    const removedDestination = destinations.splice(index, 1)[0]
    // Do not allow deleting the current primary address
    if (removedDestination.primary) {
      this.setState({errorMessage: message('Profile.DeletePrimaryAddressError')})
      return
    }
    const newState = {destinations: destinations, errorMessage: ''}
    this.setState(newState)
  }

  // Set a `property` on a destination at list `index` to `value`
  editAddress (index: number, property: string, value) {
    const destinations = this.state.destinations.slice()
    destinations[index][property] = value
    this.setState({destinations})
  }

  // Set which destination is the primary and unset any previous primary address
  setPrimaryAddress (index: number, event) {
    const destinations = this.state.destinations.slice()
    const newDestinations = destinations.map((destination: AccountAddress, i) => {
      destination.primary = i === index
      return destination
    })
    this.setState({destinations: newDestinations})
  }

  tripPurposeOptions (props) {
    const { destination, index, editAddress } = props
    const options = PROFILE_DESTINATION_TYPES.map((key) => {
      // expects each type in constants to have a label in messages
      const messageKey = 'TripPurpose.' + key
      return <option key={key}>{message(messageKey)}</option>
    })

    return (
      <select
        className='account-profile__input'
        defaultValue={destination.purpose || DEFAULT_PROFILE_DESTINATION_TYPE}
        onChange={(e) => editAddress(index, 'purpose', e.currentTarget.value)}
        id='purpose'>
        {options}
      </select>
    )
  }

  destinationsList (props) {
    const {
      addAddress,
      deleteAddress,
      geocode,
      editAddress,
      destinations,
      reverseGeocode,
      setPrimaryAddress,
      TripPurposeOptions } = props

    // Maximum number of destinations user may add
    const maxAddressesAllowed = 3

    const listItems = destinations.map((destination: AccountAddress, index) => {
      return <li
        key={index}
        className='account-profile__destination_row'>
        <div className='account-profile__destination_field'>
          <label
            className='account-profile__label'
            htmlFor='address'>
            {message('Profile.Address')}
          </label>
          <Geocoder
            className='account-profile__input'
            geocode={geocode}
            onChange={(result) => editAddress(index, 'location', {
              label: result ? result['place_name'] : '',
              position: result ? {lat: result['center'][0], lon: result['center'][1]} : {}
            })}
            placeholder={message('Geocoding.PromptText')}
            reverseGeocode={reverseGeocode}
            value={destination.location}
          />
        </div>
        <div className='account-profile__destination_narrow_field'>
          <label
            className='account-profile__label'
            htmlFor='purpose'>
            {message('Profile.Purpose')}
          </label>
          <TripPurposeOptions
            destination={destination}
            editAddress={editAddress}
            index={index}
          />
        </div>
        <div className='account-profile__destination_narrow_field'>
          <label
            className='account-profile__label'
            htmlFor='primary'>
            {message('Profile.Primary')}
          </label>
          <input
            className='account-profile__input'
            id='primary'
            type='radio'
            onChange={(e) => setPrimaryAddress(index, e)}
            checked={!!destination.primary}
          />
        </div>
        <div className='account-profile__destination_narrow_field'>
          <button
            className='account-profile__button account-profile__button--secondary'
            data-id={index}
            onClick={(e) => deleteAddress(index, e)}
            title={message('Profile.DeleteAddress')}>
            <img src='assets/trash-alt.svg' width='16' alt={message('Profile.Delete')} />
          </button>
        </div>
      </li>
    })

    return (
      <div className=''>
        <ul className=''>
          {listItems}
        </ul>
        {destinations.length < maxAddressesAllowed && <button
          className='account-profile__button account-profile__button--secondary'
          onClick={addAddress}>{message('Profile.AddAddress')}
        </button>}
      </div>
    )
  }

  roomOptions (props) {
    const { changeField, rooms } = props
    const maxRooms = 4
    const roomCountOptions = Array.from(new Array(maxRooms + 1), (val, i) => i)
    const roomOptions = roomCountOptions.map((num) => {
      const strVal = num.toString()
      return <option key={strVal} value={strVal}>{strVal}</option>
    })

    return (
      <select
        className='account-profile__input'
        defaultValue={rooms}
        onChange={(e) => changeField('rooms', e)}>
        {roomOptions}
      </select>
    )
  }

  render () {
    const addAddress = this.addAddress
    const deleteAddress = this.deleteAddress
    const editAddress = this.editAddress
    const setPrimaryAddress = this.setPrimaryAddress
    const cancel = this.cancel
    const changeField = this.changeField
    const deleteProfile = this.deleteProfile
    const save = this.save

    const { geocode, reverseGeocode } = this.props
    const { destinations, headOfHousehold, errorMessage, key, rooms } = this.state

    const DestinationsList = this.destinationsList
    const RoomOptions = this.roomOptions
    const TripPurposeOptions = this.tripPurposeOptions

    return (
      <div className='form-screen'>
        <h2 className='form-screen__heading'>{message('Profile.Title')}</h2>
        <div className='form-screen__main'>
          <div className='account-profile'>
            {key && <div className='account-profile__main'>
              <div className='account-profile__field'>
                <label
                  className='account-profile__label'
                  htmlFor='headOfHousehold'>
                  {message('Accounts.Name')}
                </label>
                <input
                  className='account-profile__input'
                  id='headOfHousehold'
                  type='text'
                  onChange={(e) => changeField('headOfHousehold', e)}
                  defaultValue={headOfHousehold || ''}
                />
              </div>
              <div className='account-profile__field'>
                <label
                  className='account-profile__label'
                  htmlFor='rooms'>{message('Profile.Rooms')}</label>
                <RoomOptions
                  rooms={rooms}
                  changeField={changeField} />
              </div>
              <div className=''>
                <h2>{message('Profile.Destinations')}</h2>
                <DestinationsList
                  addAddress={addAddress}
                  deleteAddress={deleteAddress}
                  destinations={destinations}
                  editAddress={editAddress}
                  geocode={geocode}
                  reverseGeocode={reverseGeocode}
                  setPrimaryAddress={setPrimaryAddress}
                  TripPurposeOptions={TripPurposeOptions}
                />
              </div>
              {errorMessage &&
                <p className='account-profile__error'>{errorMessage}</p>
              }
              <div className='account-profile__destination_row'>
                <button
                  className='account-profile__button account-profile__button--primary
                    account-profile__destination_narrow_field'
                  onClick={save}>{message('Profile.Go')}</button>
                <button
                  className='account-profile__button account-profile__button--secondary
                    account-profile__destination_narrow_field'
                  onClick={cancel}>{message('Profile.Cancel')}</button>
                <button
                  className='account-profile__button account-profile__button--secondary
                    account-profile__destination_narrow_field'
                  onClick={(e) => deleteProfile(key, e)}
                >{message('Profile.Delete')}</button>
              </div>
            </div>}
          </div>
        </div>
      </div>
    )
  }
}
