// @flow
import Storage from '@aws-amplify/storage'
import message from '@conveyal/woonerf/message'
import {PureComponent} from 'react'

import type {AccountAddress, AccountProfile} from '../types'

/**
 * Edit voucher holder profile.
 */
export default class EditProfile extends PureComponent<Props> {
  constructor (props) {
    super(props)

    this.addAddress = this.addAddress.bind(this)
    this.deleteAddress = this.deleteAddress.bind(this)
    this.editAddress = this.editAddress.bind(this)
    this.cancel = this.cancel.bind(this)
    this.changeField = this.changeField.bind(this)
    this.getProfileFromState = this.getProfileFromState.bind(this)
    this.save = this.save.bind(this)

    /*
    profile: AccountProfile = {
      destinations: [],
      hasVehicle: false,
      headOfHousehold: name,
      key: key,
      rooms: 0,
      voucherNumber: voucher
    }
    */

    const profile = props.userProfile

    this.state = {
      destinations: profile ? profile.destinations : [],
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
    if (!nextProps.isLoading && nextProps.userProfile) {
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

    ///////////////////////////
    /*
    console.log('FIXME: setting test destinations')
    const newState = {'profile': this.state.profile}
    const addr1: AccountAddress = {
      address: '123 Main Street',
      primary: true,
      purpose: 'foo'
    }

    const addr2: AccountAddress = {
      address: '443 Other Blvd',
      primary: false,
      purpose: 'bar'
    }
    newState['profile']['destinations'] = [addr1, addr2]
    this.setState(newState)
    */

    Storage.put(profile.key, JSON.stringify(profile))
      .then(result => {
        console.log(result)
        this.props.changeUserProfile(profile)
        //this.props.history.push('/map')
      })
      .catch(err => console.error(err))
  }

  deleteAccount (event) {
    const key = this.state.key
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

  addAddress (event) {
    const destinations = this.state.destinations.slice()
    const newAddress: AccountAddress = {
      address: '',
      primary: !destinations.length,
      purpose: 'Work'
    }
    this.setState({destinations: [...destinations, newAddress]})
  }

  deleteAddress (index: number, event) {
    const destinations = this.state.destinations.slice()
    destinations.splice(index, 1)
    const newState = {destinations: destinations, errorMessage: ''}
    this.setState(newState)
  }

  editAddress (index: number, event) {
    const destinations = this.state.destinations.slice()
    destinations[index]['address'] = event.currentTarget.value
    const newState = {destinations: destinations}
    this.setState(newState)
  }

  destinationsList (props) {
    const { addAddress, deleteAddress, editAddress, destinations } = props
    const listItems = destinations.map((destination: AccountAddress, index) => {
      return <li
        key={index}
        className=''>
        <label
          className='account-profile__label'
          htmlFor='address'>
          {message('Profile.Address')}
        </label>
        <input
          className='account-profile__input'
          id='address'
          type='text'
          onChange={(e) => editAddress(index, e)}
          defaultValue={destination ? destination.address : ''}
        />
        <button
          className='account-profile__button account-profile__button--secondary'
          data-id={index}
          onClick={(e) => deleteAddress(index, e)}
          title={message('Profile.DeleteAddress')}>
          <img src='assets/trash-alt.svg' width='16' alt={message('Profile.Delete')} />
        </button>
      </li>
    })

    return (
      <div className=''>
        <ul className=''>
          {listItems}
        </ul>
        <button
          className='account-profile__button account-profile__button--secondary'
          onClick={addAddress}>{message('Profile.AddAddress')}</button>
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
    const cancel = this.cancel
    const changeField = this.changeField
    const deleteProfile = this.deleteProfile
    const save = this.save
    const { destinations, headOfHousehold, errorMessage, key, rooms } = this.state

    const DestinationsList = this.destinationsList
    const RoomOptions = this.roomOptions

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
                  editAddress={editAddress} />
              </div>
              {errorMessage &&
                <p className='Error'>Error: {errorMessage}</p>
              }
              <button
                className='account-profile__button account-profile__button--primary'
                onClick={save}>{message('Profile.Go')}</button>
              <button
                className='account-profile__button account-profile__button--secondary'
                onClick={cancel}>{message('Profile.Cancel')}</button>
            </div>}
            <br />
            <button
              className='account-profile__button account-profile__button--secondary'
              onClick={deleteProfile}>{message('Profile.Delete')}</button>
          </div>
        </div>
      </div>
    )
  }
}
