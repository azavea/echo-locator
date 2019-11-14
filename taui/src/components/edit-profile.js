// @flow
import Storage from '@aws-amplify/storage'
import lonlat from '@conveyal/lonlat'
import message from '@conveyal/woonerf/message'
import range from 'lodash/range'
import {PureComponent} from 'react'
import Icon from '@conveyal/woonerf/components/icon'

import {
  ANONYMOUS_USERNAME,
  DEFAULT_ACCESSIBILITY_IMPORTANCE,
  DEFAULT_CRIME_IMPORTANCE,
  DEFAULT_PROFILE_DESTINATION_TYPE,
  DEFAULT_SCHOOLS_IMPORTANCE,
  MAX_ADDRESSES,
  MAX_IMPORTANCE,
  MAX_ROOMS,
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
    this.setGeocodeLocation = this.setGeocodeLocation.bind(this)
    this.setPrimaryAddress = this.setPrimaryAddress.bind(this)
    this.validDestinations = this.validDestinations.bind(this)

    const profile = props.userProfile
    this.state = this.getDefaultState(profile)
  }

  componentWillReceiveProps (nextProps) {
    // Listen for when profile to appear on props, because it is not present
    // on initial load. Only load once by checking state.
    if (!nextProps.isLoading && nextProps.userProfile && !this.state.key) {
      if (!nextProps.userProfile.destinations || !nextProps.userProfile.destinations.length) {
        nextProps.userProfile.destinations = [Object.assign({}, firstAddress)]
      }
      this.setState(nextProps.userProfile)
    }
  }

  getDefaultState (profile: AccountProfile) {
    if (profile) {
      // Read profile into an object for initial component state
      return {
        destinations: profile && profile.destinations.length
          ? profile.destinations : [Object.assign({}, firstAddress)],
        favorites: profile.favorites,
        hasVehicle: profile.hasVehicle,
        useCommuterRail: !profile.hasVehicle &&
        // Default to true for profiles that do not have the useCommuterRail property set yet
        (profile.useCommuterRail || profile.useCommuterRail === undefined),
        headOfHousehold: profile.headOfHousehold,
        importanceAccessibility: profile.importanceAccessibility ? profile.importanceAccessibility
          : DEFAULT_ACCESSIBILITY_IMPORTANCE,
        importanceSchools: profile.importanceSchools ? profile.importanceSchools
          : DEFAULT_SCHOOLS_IMPORTANCE,
        importanceViolentCrime: profile.importanceViolentCrime ? profile.importanceViolentCrime
          : DEFAULT_CRIME_IMPORTANCE,
        key: profile.key,
        rooms: profile.rooms,
        voucherNumber: profile.voucherNumber,
        componentError: null,
        errorMessage: '',
        isAnonymous: profile.key === ANONYMOUS_USERNAME
      }
    } else {
      // Use defaults for new profile
      return {
        destinations: [Object.assign({}, firstAddress)],
        favorites: [],
        hasVehicle: false,
        useCommuterRail: true,
        headOfHousehold: '',
        importanceAccessibility: DEFAULT_ACCESSIBILITY_IMPORTANCE,
        importanceSchools: DEFAULT_SCHOOLS_IMPORTANCE,
        importanceViolentCrime: DEFAULT_CRIME_IMPORTANCE,
        key: '',
        rooms: 0,
        voucherNumber: '',
        componentError: null,
        errorMessage: '',
        isAnonymous: true
      }
    }
  }

  cancel (event) {
    // Navigate back to the last page visited, discarding any changes.
    if (this.props.location.state && this.props.location.state.fromApp) {
      this.props.history.goBack()
    } else {
      // User navigated to this page directly
      window.location.reload()
    }
  }

  changeField (field, value) {
    const newState = {errorMessage: ''}
    newState[field] = value
    this.setState(newState)
  }

  getProfileFromState (): AccountProfile {
    const {
      destinations,
      hasVehicle,
      headOfHousehold,
      importanceAccessibility,
      importanceSchools,
      importanceViolentCrime,
      key,
      rooms,
      voucherNumber
    } = this.state
    const favorites = this.state.favorites || []
    const useCommuterRail = !this.state.hasVehicle && this.state.useCommuterRail

    return {
      destinations,
      favorites,
      hasVehicle,
      headOfHousehold,
      importanceAccessibility,
      importanceSchools,
      importanceViolentCrime,
      key,
      rooms,
      useCommuterRail,
      voucherNumber
    }
  }

  save () {
    const isAnonymous = this.state.isAnonymous
    const profile: AccountProfile = this.getProfileFromState()

    if (!profile || !profile.key || !profile.voucherNumber) {
      console.error('Cannot save profile: missing profile or its voucher number.')
      this.setState({errorMessage: message('Profile.SaveError')})
      return
    } else if (!profile.headOfHousehold) {
      this.setState({errorMessage: message('Profile.NameRequired')})
      return
    } else if (!this.validDestinations(profile.destinations)) {
      this.setState({errorMessage: message('Profile.AddressMissing')})
      return
    } else {
      this.setState({errorMessage: ''})
    }

    if (!isAnonymous) {
      Storage.put(profile.key, JSON.stringify(profile))
        .then(result => {
          this.props.changeUserProfile(profile).then(res => {
            if (res) {
              this.props.history.push('/map')
            } else {
              console.error('Could not change user profile after edit')
            }
          }).catch(changeError => {
            console.error('Failed to change user profile after edit')
            console.error(changeError)
          })
        })
        .catch(err => {
          console.error(err)
          this.setState({errorMessage: message('Profile.SaveError')})
        })
    } else {
      // Do not attempt to write anonymous profile to S3
      this.props.changeUserProfile(profile)
      this.props.history.push('/map')
    }
  }

  deleteProfile (key, event) {
    if (!key) {
      console.error('Cannot delete account without key')
      this.setState({errorMessage: message('Profile.SaveError')})
      return
    }

    Storage.remove(key)
      .then(result => {
        this.props.changeUserProfile(null)
        this.props.history.push('/search')
      })
      .catch(err => {
        console.error(err)
        this.setState({errorMessage: message('Profile.SaveError')})
      })
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

  // Extract co-ordinates and address string from geocode result, similar to
  // `_setStartWithFeature` in `main-page.js`
  // If `feature` is null, the field was cleared (search terms without results cannot be selected)
  setGeocodeLocation (index: number, editAddress, feature?: MapboxFeature) {
    editAddress(index, 'location', {
      label: feature ? feature.place_name : '',
      position: feature ? lonlat(feature.geometry.coordinates) : null
    })
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

  // Return true if all destinations have their location set and there is at least one.
  validDestinations (destinations: Array<AccountAddress>): boolean {
    if (!destinations || !destinations.length) {
      return false
    }

    var valid = true
    destinations.forEach(destination => {
      if (!destination || !destination.location || !destination.location.position ||
        !destination.location.label) {
        valid = false
      }
    })
    return valid
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
        className='account-profile__input account-profile__input--select'
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
      setGeocodeLocation,
      setPrimaryAddress,
      TripPurposeOptions } = props

    const showAllColumns = destinations.length > 1

    const listItems = destinations.map((destination: AccountAddress, index) => {
      return <li
        key={index}
        className='account-profile__destination'>
        <div className='account-profile__destination_field account-profile__destination_field--wide'>
          <Geocoder
            data-private
            className='account-profile__input account-profile__input--geocoder'
            geocode={geocode}
            onChange={(e) => setGeocodeLocation(index, editAddress, e)}
            placeholder={message('Geocoding.PromptText')}
            reverseGeocode={reverseGeocode}
            value={destination.location}
          />
        </div>
        <div className='account-profile__destination_field account-profile__destination_field'>
          <TripPurposeOptions
            destination={destination}
            editAddress={editAddress}
            index={index}
          />
        </div>
        {showAllColumns && <>
          <div className='account-profile__destination_field account-profile__destination_field--narrow account-profile__destination_field--center'>
            <input
              className='account-profile__input account-profile__input--radio'
              id='primary'
              type='radio'
              onChange={(e) => setPrimaryAddress(index, e)}
              checked={!!destination.primary}
            />
          </div>
          <div className='account-profile__destination_field account-profile__destination_field--xnarrow account-profile__destination_field--center'>
            <button
              id='deleteAddress'
              className='account-profile__destination-delete-button'
              data-id={index}
              onClick={(e) => deleteAddress(index, e)}
              title={message('Profile.DeleteAddress')}>
              <Icon type='times' />
            </button>
          </div>
        </>}
      </li>
    })

    return (
      <div className='account-profile__destinations'>
        <h3 className='account-profile__label'>{message('Profile.Destinations')}</h3>
        <div className='account-profile__destination-list-header'>
          <div className='account-profile__destination_field account-profile__destination_field--wide'>
            <span className='account-profile__destination-list-heading'>
              {message('Profile.Address')}
            </span>
          </div>
          <div className='account-profile__destination_field'>
            <span className='account-profile__destination-list-heading'>
              {message('Profile.Purpose')}
            </span>
          </div>
          {showAllColumns && <>
            <div className='account-profile__destination_field account-profile__destination_field--narrow account-profile__destination_field--center'>
              <span className='account-profile__destination-list-heading'>
                {message('Profile.Primary')}
              </span>
            </div>
            <div className='account-profile__destination_field account-profile__destination_field--xnarrow'>
              <span className='account-profile__destination-list-heading' />
            </div>
          </>}
        </div>
        <ul className='account-profile__destination-list'>
          {listItems}
        </ul>
        {destinations.length < MAX_ADDRESSES && <button
          className='account-profile__button account-profile__button--tertiary account-profile__button--iconLeft'
          onClick={addAddress}>
          <Icon type='plus' />
          {message('Profile.AddAddress')}
        </button>}
      </div>
    )
  }

  importanceOptions (props) {
    const { changeField, fieldName, importance } = props
    const importanceRange = range(1, MAX_IMPORTANCE + 1)
    const importanceOptions = importanceRange.map((num) => {
      const strVal = num.toString()
      const label = message('ImportanceLabels.' + strVal)
      return <option key={strVal} value={strVal}>{label}</option>
    })
    return (
      <select
        className='account-profile__input account-profile__input--wide-select'
        defaultValue={importance}
        onChange={(e) => changeField(fieldName, e.currentTarget.value)}>
        {importanceOptions}
      </select>
    )
  }

  roomOptions (props) {
    const { changeField, rooms } = props
    const roomCountOptions = range(MAX_ROOMS + 1)
    const roomOptions = roomCountOptions.map((num) => {
      const strVal = num.toString()
      return <option key={strVal} value={strVal}>{strVal}</option>
    })

    return (
      <select
        className='account-profile__input account-profile__input--select'
        defaultValue={rooms}
        onChange={(e) => changeField('rooms', e.currentTarget.value)}>
        {roomOptions}
      </select>
    )
  }

  render () {
    const addAddress = this.addAddress
    const deleteAddress = this.deleteAddress
    const editAddress = this.editAddress
    const setGeocodeLocation = this.setGeocodeLocation
    const setPrimaryAddress = this.setPrimaryAddress
    const cancel = this.cancel
    const changeField = this.changeField
    const deleteProfile = this.deleteProfile
    const save = this.save

    const { geocode, reverseGeocode } = this.props
    const {
      destinations,
      hasVehicle,
      headOfHousehold,
      importanceAccessibility,
      importanceSchools,
      importanceViolentCrime,
      errorMessage,
      isAnonymous,
      key,
      rooms,
      useCommuterRail
    } = this.state

    const DestinationsList = this.destinationsList
    const ImportanceOptions = this.importanceOptions
    const RoomOptions = this.roomOptions
    const TripPurposeOptions = this.tripPurposeOptions

    return (
      <div className='form-screen'>
        <h2 className='form-screen__heading'>{message('Profile.Title')}</h2>
        <div className='form-screen__main'>
          {key && <div className='account-profile'>
            {!isAnonymous && <div className='account-profile__field'>
              <label
                className='account-profile__label'
                htmlFor='headOfHousehold'>
                {message('Accounts.Name')}
              </label>
              <input
                data-private
                className='account-profile__input account-profile__input--text'
                id='headOfHousehold'
                type='text'
                onChange={(e) => changeField('headOfHousehold', e.currentTarget.value)}
                defaultValue={headOfHousehold || ''}
              />
            </div>}
            <div className='account-profile__field'>
              <label
                className='account-profile__label'
                htmlFor='rooms'>{message('Profile.Rooms')}</label>
              <RoomOptions
                rooms={rooms}
                changeField={changeField} />
            </div>
            <div className='account-profile__field'>
              <div
                className='account-profile__label'
                htmlFor='rooms'>{message('Profile.ChooseTravelMode')}</div>
              <div className='account-profile__field-row'>
                <div className='account-profile__field account-profile__field--inline'>
                  <input
                    className='account-profile__input account-profile__input--checkbox'
                    id='byCar'
                    name='travelMode'
                    type='radio'
                    onChange={(e) => changeField('hasVehicle', e.currentTarget.checked)}
                    defaultChecked={hasVehicle}
                  />
                  <label
                    className='account-profile__label account-profile__label--secondary'
                    htmlFor='byCar'>
                    {message('Profile.ByCar')}
                  </label>
                </div>
                <div className='account-profile__field account-profile__field--inline'>
                  <input
                    className='account-profile__input account-profile__input--checkbox'
                    id='byTransit'
                    name='travelMode'
                    type='radio'
                    onChange={(e) => changeField('hasVehicle', !e.currentTarget.checked)}
                    defaultChecked={!hasVehicle}
                  />
                  <label
                    className='account-profile__label account-profile__label--secondary'
                    htmlFor='byTransit'>
                    {message('Profile.ByTransit')}
                  </label>
                </div>
                {!hasVehicle && <div className='account-profile__field account-profile__field--inline'>
                  <input
                    className='account-profile__input account-profile__input--checkbox'
                    id='useCommuterRail'
                    type='checkbox'
                    onChange={(e) => changeField('useCommuterRail', e.currentTarget.checked)}
                    defaultChecked={useCommuterRail}
                  />
                  <label
                    className='account-profile__label account-profile__label--secondary'
                    htmlFor='useCommuterRail'>
                    {message('Profile.UseCommuterRail')}
                  </label>
                </div>}
              </div>
            </div>
            <DestinationsList
              addAddress={addAddress}
              deleteAddress={deleteAddress}
              destinations={destinations}
              editAddress={editAddress}
              geocode={geocode}
              reverseGeocode={reverseGeocode}
              setGeocodeLocation={setGeocodeLocation}
              setPrimaryAddress={setPrimaryAddress}
              TripPurposeOptions={TripPurposeOptions}
            />
            <div className='account-profile__importance-options'>
              <h3 className='account-profile__label'>
                {message('Profile.ImportanceHeading')}
              </h3>
              <div className='account-profile__field account-profile__field--inline account-profile__field--stack'>
                <label
                  className='account-profile__label account-profile__label--secondary'
                  htmlFor='importanceAccessibility'>{message('Profile.ImportanceAccessibility')}</label>
                <ImportanceOptions
                  fieldName='importanceAccessibility'
                  importance={importanceAccessibility}
                  changeField={changeField} />
              </div>
              <div className='account-profile__field account-profile__field--inline account-profile__field--stack'>
                <label
                  className='account-profile__label account-profile__label--secondary'
                  htmlFor='importanceSchools'>{message('Profile.ImportanceSchools')}</label>
                <ImportanceOptions
                  fieldName='importanceSchools'
                  importance={importanceSchools}
                  changeField={changeField} />
              </div>
              <div className='account-profile__field account-profile__field--inline account-profile__field--stack'>
                <label
                  className='account-profile__label account-profile__label--secondary'
                  htmlFor='importanceViolentCrime'>{message('Profile.ImportanceViolentCrime')}</label>
                <ImportanceOptions
                  fieldName='importanceViolentCrime'
                  importance={importanceViolentCrime}
                  changeField={changeField} />
              </div>
            </div>
            {errorMessage &&
              <p className='account-profile__error'>{errorMessage}</p>
            }
            <div className='account-profile__actions'>
              <button
                className='account-profile__button account-profile__button--primary'
                onClick={save}>{message('Profile.Go')}</button>
              <button
                className='account-profile__button account-profile__button--secondary'
                onClick={cancel}>{message('Profile.Cancel')}</button>
              {!isAnonymous && <button
                className='account-profile__button account-profile__button--tertiary account-profile__button--iconLeft'
                onClick={(e) => deleteProfile(key, e)}
              >
                <Icon type='trash' />
                {message('Profile.DeleteProfile')}
              </button>}
            </div>
          </div>}
        </div>
      </div>
    )
  }
}
