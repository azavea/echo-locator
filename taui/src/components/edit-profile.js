/* eslint-disable complexity */
// @flow
import API from '@aws-amplify/api'
import Storage from '@aws-amplify/storage'
import lonlat from '@conveyal/lonlat'
import message from '@conveyal/woonerf/message'
import find from 'lodash/find'
import range from 'lodash/range'
import {PureComponent} from 'react'
import Icon from '@conveyal/woonerf/components/icon'

import {
  AMPLIFY_API_NAME,
  ANONYMOUS_USERNAME,
  CUSTOM_VOUCHER_KEY,
  DEFAULT_ACCESSIBILITY_IMPORTANCE,
  DEFAULT_CRIME_IMPORTANCE,
  DEFAULT_PROFILE_DESTINATION_TYPE,
  DEFAULT_SCHOOLS_IMPORTANCE,
  EMAIL_REGEX,
  MAX_ADDRESSES,
  MAX_IMPORTANCE,
  MAX_ROOMS,
  PROFILE_DESTINATION_TYPES
} from '../constants'
import type {AccountAddress, AccountProfile} from '../types'

import Geocoder from './geocoder'
import Checkbox from './checkbox'

const axios = require('axios')

type Props = {
  authData: any,
  geocode: (string, Function) => void,
  language: string,
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
    this.createClientAccount = this.createClientAccount.bind(this)
    this.deleteAddress = this.deleteAddress.bind(this)
    this.deleteProfile = this.deleteProfile.bind(this)
    this.editAddress = this.editAddress.bind(this)
    this.cancel = this.cancel.bind(this)
    this.changeField = this.changeField.bind(this)
    this.getProfileFromState = this.getProfileFromState.bind(this)
    this.save = this.save.bind(this)
    this.saveToS3 = this.saveToS3.bind(this)
    this.setGeocodeLocation = this.setGeocodeLocation.bind(this)
    this.setPrimaryAddress = this.setPrimaryAddress.bind(this)
    this.validDestinations = this.validDestinations.bind(this)
    this.validBudget = this.validBudget.bind(this)
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this)
    this.removePreference = this.removePreference.bind(this)
    this.validatePhone = this.validatePhone.bind(this)

    const profile = props.userProfile
    this.state = this.getDefaultState(profile)
    this.state.showTextOptions = true
    this.state.removedPreferences = []
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

  componentDidMount () {
    const url = 'https://akk8p5k8o0.execute-api.us-east-1.amazonaws.com/staging/get-all-text-preferences'
    const json = {
      'user': this.props.userProfile.key
    }
    axios.post(url, json)
      .then(response => JSON.parse(response.data.body))
      .then(result => {
        this.setState({
          textAlertPreferences: {
            preferences: result.preferences,
            phone: result.phone.substring(2, result.phone.length)
          }
        })
      })
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.errorMessage) {
      window.scroll(0, 0)
    }
  }

  getDefaultState (profile: AccountProfile) {
    if (profile) {
      // Read profile into an object for initial component state
      return {
        clientAccountConfirmed: profile.clientAccountConfirmed || (profile.key
          ? profile.key.indexOf('_') > -1 : false),
        clientEmail: profile.clientEmail ? profile.clientEmail : '',
        clientInviteSent: profile.clientInviteSent ? profile.clientInviteSent : false,
        destinations: profile && profile.destinations.length
          ? profile.destinations : [Object.assign({}, firstAddress)],
        favorites: profile.favorites,
        hasVehicle: profile.hasVehicle,
        hasVoucher: profile.hasVoucher,
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
        budget: profile.budget,
        voucherNumber: profile.voucherNumber,
        componentError: null,
        errorMessage: '',
        isAnonymous: profile.key === ANONYMOUS_USERNAME
      }
    } else {
      // Use defaults for new profile
      return {
        clientAccountConfirmed: false,
        clientEmail: '',
        clientInviteSent: false,
        destinations: [Object.assign({}, firstAddress)],
        favorites: [],
        hasVehicle: false,
        hasVoucher: false,
        useCommuterRail: true,
        headOfHousehold: '',
        importanceAccessibility: DEFAULT_ACCESSIBILITY_IMPORTANCE,
        importanceSchools: DEFAULT_SCHOOLS_IMPORTANCE,
        importanceViolentCrime: DEFAULT_CRIME_IMPORTANCE,
        key: '',
        rooms: 0,
        budget: 0,
        voucherNumber: '',
        componentError: null,
        errorMessage: '',
        isAnonymous: true
      }
    }
  }

  validatePhone (number) {
    console.log(number)
    // If the length is not right
    if (number.length !== 10) {
      console.log('entered1')
      return false
    }
    // If any character is not a number
    for (var i = 0; i < number.length; i++) {
      if (!(number[i] >= '0' && number[i] <= '9')) {
        console.log('entered2')
        return false
      }
    }
    return true
  }

  // If the stop receiving text alerts button is clicked
  removePreference (preferences, preference) {
    // First, remove it from our preferences
    const index = preferences.indexOf(preference)
    preferences.splice(index, 1)
    const newState = {
      preferences: preferences,
      phone: this.state.textAlertPreferences.phone
    }
    this.setState({
      textAlertPreferences: newState
    })
    // Then, add it to a removedPreferences array to handle on save
    var newRemovedPreferences = this.state.removedPreferences
    newRemovedPreferences.push(preference)
    this.setState({
      removedPreferences: newRemovedPreferences
    })
  }

  // If the opt out of all text messages box is checked
  handleCheckboxChange (currentlyChecked) {
    // Just toggled from checked to not checked
    if (currentlyChecked) {
      this.setState({
        showTextOptions: true
      })
    } else {
      this.setState({
        showTextOptions: false
      })
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

  changeField (field, value, index = 0, field2 = '') {
    var newValue
    // Change subfields if it is textAlertPreferences
    if (field === 'textAlertPreferences' && field2 === 'frequency') {
      const newState = {errorMessage: ''}
      newValue = this.state.textAlertPreferences
      newValue.preferences[index].frequency = value
      newState[field] = newValue
      this.setState(newState)
    } else if (field === 'textAlertPreferences' && field2 === 'phone') {
      const newState = {errorMessage: ''}
      newValue = this.state.textAlertPreferences
      newValue.phone = value
      newState[field] = newValue
      this.setState(newState)

    // Easy change for everything else
    } else {
      const newState = {errorMessage: ''}
      newState[field] = value
      this.setState(newState)
    }
  }

  getProfileFromState (): AccountProfile {
    const {
      clientAccountConfirmed,
      clientEmail,
      clientInviteSent,
      destinations,
      hasVehicle,
      hasVoucher,
      headOfHousehold,
      importanceAccessibility,
      importanceSchools,
      importanceViolentCrime,
      key,
      rooms,
      budget,
      voucherNumber
    } = this.state
    const favorites = this.state.favorites || []
    const useCommuterRail = !this.state.hasVehicle && this.state.useCommuterRail

    return {
      clientAccountConfirmed,
      clientEmail,
      clientInviteSent,
      destinations,
      favorites,
      hasVehicle,
      hasVoucher,
      headOfHousehold,
      importanceAccessibility,
      importanceSchools,
      importanceViolentCrime,
      key,
      rooms,
      budget,
      useCommuterRail,
      voucherNumber
    }
  }

  // Write profile to S3 as JSON
  saveToS3 (saveAsKey: string, profile: AccountProfile, isCounselor: boolean,
    changeUserProfile: any): Promise<boolean> {
    var language = this.props.language
    return new Promise((resolve, reject) => {
      Storage.put(saveAsKey, JSON.stringify(profile))
        .then(result => {
          changeUserProfile(profile).then(res => {
            if (res && profile && isCounselor && !this.state.errorMessage) {
              this.props.history.push('/map')
              resolve(true)
            } else if (res && this.state.errorMessage) {
              console.warn('profile saved, but have an error')
              resolve(false)
            } else if (res && !isCounselor && profile) {
              this.setState({errorMessage: ''})
              this.props.history.push('/map')
              resolve(true)
            } else {
              console.error('Could not change user profile after edit')
              console.error('Profile save did not succeed', res)
              this.setState({errorMessage: message(language + 'Profile.SaveError')})
              resolve(false)
            }
          }).catch(changeError => {
            console.error('Failed to change user profile after edit', changeError)
            this.setState({errorMessage: message(language + 'Profile.SaveError')})
            reject(changeError)
          })
        })
        .catch(err => {
          console.error(err)
          reject(err)
        })
    })
  }

  save (isCounselor: boolean, event: any) {
    const isAnonymous = this.state.isAnonymous
    const profile: AccountProfile = this.getProfileFromState()

    var language = this.props.language

    if (!profile || !profile.key || !profile.voucherNumber) {
      console.error('Cannot save profile: missing profile or its voucher number.') // hardcode translation
      this.setState({errorMessage: message(language + 'Profile.SaveError')})
      return
    } else if (!profile.headOfHousehold) {
      this.setState({errorMessage: message(language + 'Profile.NameRequired')})
      return
    } else if (!this.validDestinations(profile.destinations)) {
      this.setState({errorMessage: message(language + 'Profile.AddressMissing')})
      return
    } else if (!this.validBudget(profile.budget, profile.hasVoucher)) {
      this.setState({errorMessage: message(language + 'Profile.InvalidBudget')})
      return
    } else if (!this.validBudget(profile.budget, profile.hasVoucher)) {
      this.setState({errorMessage: message('Profile.InvalidBudget')})
      return
    } else {
      this.setState({errorMessage: ''})
    }

    if (this.state.textAlertPreferences && !this.validatePhone(this.state.textAlertPreferences.phone)) {
      this.setState({errorMessage: 'Invalid phone number: Use format xxxxxxxxxx'})
    }

    if (!isAnonymous) {
      // Create user login account if new email set
      if (profile.key.indexOf('_') < 0 && profile.clientEmail && !profile.clientInviteSent) {
        console.log('go create user account')

        // verify it first
        if (profile.clientEmail && EMAIL_REGEX.test(profile.clientEmail)) {
          this.createClientAccount(profile.key).then(createResponse => {
            if (createResponse === 'created') {
              console.log('user account has been created (or already exists)')
              profile.clientInviteSent = true
              // Save to S3 once user account creation succeeded
              this.saveToS3(profile.key, profile, isCounselor, this.props.changeUserProfile)
            } else if (createResponse === 'exists') {
              console.log('user account already confirmed for voucher number; save new profile')
              profile.clientInviteSent = true
              profile.clientAccountConfirmed = true
              this.saveToS3(profile.key, profile, isCounselor, this.props.changeUserProfile)
            } else {
              console.error('Failed to create user account')
              // Do not save to S3 so counselor can see the error and stay on profile page
            }
          })
        } else {
          console.warn('does not look like an email', profile.clientEmail)
          this.setState({errorMessage: message(language + 'Profile.ClientEmailError')})
        }
      } else {
        console.log('Do not need to create client account; it already exists')
        // go save to s3 without attempting to first create a user account
        this.saveToS3(profile.key, profile, isCounselor, this.props.changeUserProfile)
      }
      // changing phone number if necessary
      var url = 'https://akk8p5k8o0.execute-api.us-east-1.amazonaws.com/staging/set-user-phone'
      var json = {
        'user': profile.key,
        'phone': '+1' + this.state.textAlertPreferences.phone
      }
      axios.post(url, json)
      // Remove all preferences if user checked opt out of all
      if (!this.state.showTextOptions) {
        this.state.textAlertPreferences.preferences.forEach(function (preference) {
          url = 'https://akk8p5k8o0.execute-api.us-east-1.amazonaws.com/staging/remove-text-preference'
          json = {
            'userProfile': profile.key,
            'neighborhood': preference.zipcode
          }
          axios.post(url, json)
        })
      } else {
        url = 'https://akk8p5k8o0.execute-api.us-east-1.amazonaws.com/staging/set-user-text-preferences'
        json = {
          'user': profile.key,
          'preferences': this.state.textAlertPreferences.preferences
        }
        axios.post(url, json)

        // If there are any removed preferences, do this here
        this.state.removedPreferences.forEach(function (preference) {
          url = 'https://akk8p5k8o0.execute-api.us-east-1.amazonaws.com/staging/remove-text-preference'
          json = {
            'userProfile': profile.key,
            'neighborhood': preference.zipcode
          }
          axios.post(url, json)
        })
      }
    } else {
      // Do not attempt to write anonymous profile to S3
      this.props.changeUserProfile(profile)
      this.props.history.push('/map') // where the save happens for anonymous, doesn't happen on live site
    }
  }

  getUserDataVoucherNumber (userData: any): string {
    if (!userData || !userData.UserAttributes) {
      return ''
    }
    const found = find(userData.UserAttributes, userAttr => userAttr.Name === CUSTOM_VOUCHER_KEY)
    return found ? found.Value : ''
  }

  // Resolves to 'exists', 'created', or 'failed'
  createClientAccount (key: string): Promise<string> {
    var language = this.props.language
    return new Promise((resolve, reject) => {
      if (!key) {
        console.error('Cannot create client log-in account without key')
        this.setState({errorMessage: message(language + 'Profile.CreateClientAccountError')})
        resolve('failed')
      } else if (key.indexOf('_') > -1) {
        // warn counselor instead of going to map page
        console.error('Cannot create client log-in account. It looks like it already exists')
        this.setState({errorMessage: message(language + 'Profile.CreateClientAccountError')})
        resolve('')
      }
      const clientEmail = this.state.clientEmail
      if (!clientEmail || !EMAIL_REGEX.test(clientEmail)) {
        console.warn('does not look like an email', clientEmail)
        this.setState({errorMessage: message(language + 'Profile.ClientEmailError')})
        resolve('failed')
      }

      console.log('Create client user Cognito account for ' + clientEmail)
      // Also set `response: true` in addition to `body` to get full response,
      // instead of just data (AWS library uses Axios).
      API.post(AMPLIFY_API_NAME, '/clients', {
        body: {
          email: clientEmail,
          voucher: key
        }
      }).then(response => {
        if (response.error) {
          console.error('Failed to create user')
          console.error(response)
          if (response.result === 'userExists') {
            console.warn('Account already exists')
            console.warn(response.user)
            // Find the voucher number for the existing user account
            const existingVoucherNumber = this.getUserDataVoucherNumber(response.user)
            if (existingVoucherNumber) {
              if (existingVoucherNumber === key) {
                // Search should have found the existing profile, if there was any
                // so assume this is newly created.
                console.warn('Client account already exists with matching voucher number')
                // Update state to show client account for matching email and voucher number
                // has already been confirmed.
                this.setState({clientAccountConfirmed: true})
                resolve('exists')
              } else {
                console.error('Existing client account is for a different voucher number')
                // Let counselor know that there is already a Cognito account for that e-mail
                this.setState({errorMessage: message(language + 'Profile.CreateClientAccountExistsError', {
                  voucher: existingVoucherNumber
                })})
                resolve('failed')
              }
            } else {
              // No voucher number on existing user account. Is it the email of a counselor?
              console.warn('No voucher number on existing profile. Is that a counselor email?')
              this.setState({errorMessage: message(language + 'Profile.CreateClientAccountError')})
            }
          } else if (response.result === 'inviteNotResentVoucherMismatch') {
            this.setState({errorMessage: message(language + 'Profile.CreateClientAccountExistsError', {
              voucher: this.getUserDataVoucherNumber(response.user)
            })})
          } else {
            console.error('Unrecognized error attempting to create user')
            this.setState({errorMessage: message(language + 'Profile.CreateClientAccountError')})
          }
          resolve('failed')
        } else {
          console.log('User created (or invite resent)')
          // TODO: show different message if invite resent?
          // if (response.result && response.result === 'resendingInvite') {
          this.setState({errorMessage: '', clientInviteSent: true})
          resolve('created')
        }
      }).catch(error => {
        // A 403 (as when user is not a counselor) will only return "Network Error"
        console.error('API call to create user failed')
        console.error(error)
        this.setState({errorMessage: message(language + 'Profile.CreateClientAccountError')})
        reject(error)
      })
    })
  }

  deleteProfile (key: string, isCounselor: boolean, event) {
    var language = this.props.language

    if (!key) {
      console.error('Cannot delete account without key')
      this.setState({errorMessage: message(language + 'Profile.SaveError')})
      return
    }

    Storage.remove(key)
      .then(result => {
        this.props.changeUserProfile(null)
        console.log('profile deleted from s3')
        // If a client deleted their profile, they will be logged out.
        // Logging in again will create them a blank profile.
        if (isCounselor) {
          this.props.history.push('/search')
        } else {
          console.warn('client deleted their own profile')
        }
      })
      .catch(err => {
        console.error(err)
        this.setState({errorMessage: message(language + 'Profile.SaveError')})
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
    var language = this.props.language
    const destinations = this.state.destinations.slice()
    const removedDestination = destinations.splice(index, 1)[0]
    // Do not allow deleting the current primary address
    if (removedDestination.primary) {
      this.setState({errorMessage: message(language + 'Profile.DeletePrimaryAddressError')})
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
    const { destination, index, editAddress, language } = props
    const options = PROFILE_DESTINATION_TYPES.map((key) => {
      // expects each type in constants to have a label in messages
      const messageKey = 'TripPurpose.' + key
      return <option key={key}>{message(language + messageKey)}</option>
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
      TripPurposeOptions,
      language } = props

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
            placeholder={message(language + 'Geocoding.PromptText')}
            reverseGeocode={reverseGeocode}
            value={destination.location}
          />
        </div>
        <div className='account-profile__destination_field account-profile__destination_field'>
          <TripPurposeOptions
            destination={destination}
            editAddress={editAddress}
            index={index}
            language={props.language}
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
              autoComplete='off'
            />
          </div>
          <div className='account-profile__destination_field account-profile__destination_field--xnarrow account-profile__destination_field--center'>
            <button
              id='deleteAddress'
              className='account-profile__destination-delete-button'
              data-id={index}
              onClick={(e) => deleteAddress(index, e)}
              title={message(language + 'Profile.DeleteAddress')}>
              <Icon type='times' />
            </button>
          </div>
        </>}
      </li>
    })

    return (
      <div className='account-profile__destinations'>
        <h3 className='account-profile__label'>{message(language + 'Profile.Destinations')}</h3>
        <div className='account-profile__destination-list-header'>
          <div className='account-profile__destination_field account-profile__destination_field--wide'>
            <span className='account-profile__destination-list-heading'>
              {message(language + 'Profile.Address')}
            </span>
          </div>
          <div className='account-profile__destination_field'>
            <span className='account-profile__destination-list-heading'>
              {message(language + 'Profile.Purpose')}
            </span>
          </div>
          {showAllColumns && <>
            <div className='account-profile__destination_field account-profile__destination_field--narrow account-profile__destination_field--center'>
              <span className='account-profile__destination-list-heading'>
                {message(language + 'Profile.Primary')}
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
          {message(language + 'Profile.AddAddress')}
        </button>}
      </div>
    )
  }

  importanceOptions (props) {
    const { changeField, fieldName, importance, language } = props
    const importanceRange = range(1, MAX_IMPORTANCE + 1)
    const importanceOptions = importanceRange.map((num) => {
      const strVal = num.toString()
      const label = message(language + 'ImportanceLabels.' + strVal)
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

  textOptions (props) {
    const {info, changeField, handleCheckboxChange, showTextOptions, removePreference} = props
    if (typeof info === 'undefined' || typeof info.preferences === 'undefined') {
      return (
        <div className='account-profile__text-alerts'>
          <div className='account-profile__text-alerts__wrapper'>
            <h3 className='account-profile__label'>Text Alerts</h3>
            <h4>None set yet</h4>
          </div>
          <div className='account-profile__text-alerts__text-wrapper'>
            <p>You can enable text alerts by saving a neighborhood. You'll receive alerts to your phone whenever new apartments appear.</p>
          </div>
        </div>
      )
    } else {
      return (
        <div className='account-profile__text-alerts'>
          <h3 className='account-profile__label'>Text Alerts</h3>
          <div className='account-profile__text-alerts__phone-wrapper'>
            <h5>Mobile Phone Number</h5>
            <input className='account-profile__text-alerts__phone-field' type='text' name='phone' defaultValue={info.phone} onChange={(e) => changeField('textAlertPreferences', e.currentTarget.value, 0, 'phone')} />
            <Checkbox
              label='I want to opt out of all messages'
              handleCheckboxChange={handleCheckboxChange} />
          </div>
          {showTextOptions &&
            <ul>
              {info.preferences.map((preference, index) => {
                if (typeof preference.city !== 'undefined') {
                  return (
                    <li key={index}>
                      <p className='account-profile__text-alerts__city-text'>{preference.city}</p>
                      <div className='account-profile__text-alerts-frequency-text'>
                        <p>Current Receiving Alerts</p>
                        <select
                          defaultValue={preference.frequency}
                          onChange={(e) => changeField('textAlertPreferences', e.currentTarget.value, index, 'frequency')}>
                          <option value='daily'>Daily</option>
                          <option value='weekly'>Weekly</option>
                        </select>
                      </div>
                      <button onClick={(e) => removePreference(info.preferences, preference)}>Stop Receiving Texts</button>
                    </li>
                  )
                }
              })}
            </ul>
          }
        </div>
      )
    }
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

  // handles the budget
  budgetOptions (props) {
    const { changeField, budget } = props

    return (
      <input
        className='account-profile__input account-profile__input--select'
        defaultValue={budget}
        placeholder='0' // placeholder hard coded
        type='number'
        onChange={(e) => changeField('budget', e.currentTarget.value)} />
    )
  }

  validBudget (budget, hasVoucher): boolean {
    // check if budget is actually a number
    /* if (isNaN(budget)) {
      return false
    }
    // check if budget is negative
    if(parseInt(budget) < 0) {
      console.log('false')
      return false;
    } */

    if (hasVoucher || (!hasVoucher && budget > 0)) {
      console.log('true')
      return true
    }
    return false
  }

  /* eslint-disable complexity */
  // Final render
  // TODO: refactor out yet more sub-components
  render () {
    console.log('edit-profile ', this.props.language)
    const addAddress = this.addAddress // function
    const deleteAddress = this.deleteAddress // function
    const editAddress = this.editAddress
    const setGeocodeLocation = this.setGeocodeLocation
    const setPrimaryAddress = this.setPrimaryAddress
    const cancel = this.cancel
    const changeField = this.changeField
    const createClientAccount = this.createClientAccount
    const deleteProfile = this.deleteProfile
    const save = this.save

    const { authData, geocode, reverseGeocode, language } = this.props
    const {
      clientAccountConfirmed,
      clientEmail,
      clientInviteSent,
      destinations,
      hasVehicle,
      hasVoucher,
      headOfHousehold,
      importanceAccessibility,
      importanceSchools,
      importanceViolentCrime,
      errorMessage,
      isAnonymous,
      key,
      rooms,
      budget,
      useCommuterRail,
      textAlertPreferences,
      showTextOptions
    } = this.state

    const isCounselor = !!authData.counselor && !isAnonymous

    const DestinationsList = this.destinationsList
    const ImportanceOptions = this.importanceOptions
    const RoomOptions = this.roomOptions
    const BudgetOptions = this.budgetOptions
    const TripPurposeOptions = this.tripPurposeOptions
    const TextOptions = this.textOptions
    const handleCheckboxChange = this.handleCheckboxChange
    const removePreference = this.removePreference
    return (
      <div className='form-screen'>
        <h2 className='form-screen__heading'>{message(language + 'Profile.Title')}</h2>
        {errorMessage &&
          <p className='account-profile__error'>{errorMessage}</p>
        }
        <div className='form-screen__main'>
          {key && <div className='account-profile'>
            {!isAnonymous && <div className='account-profile__field'>
              <label
                className='account-profile__label'
                htmlFor='headOfHousehold'>
                {message(language + 'Accounts.Name')}
              </label>
              <input
                data-private
                className='account-profile__input account-profile__input--text'
                id='headOfHousehold'
                type='text'
                onChange={(e) => changeField('headOfHousehold', e.currentTarget.value)}
                defaultValue={headOfHousehold || ''}
                autoComplete='off'
              />
            </div>}

            {key && isCounselor &&
              <div className='account-profile__field'>
                <label
                  className='account-profile__label'
                  htmlFor='clientEmail'>
                  {message(language + 'Profile.ClientEmailLabel')}
                </label>
                <div className='account-profile__field-row'>
                  <input
                    data-private
                    className='account-profile__input account-profile__input--text'
                    id='clientEmail'
                    type='email'
                    autoComplete='off'
                    disabled={clientInviteSent}
                    onChange={(e) => changeField('clientEmail', e.currentTarget.value)}
                    defaultValue={clientEmail || ''}
                  />
                  {clientInviteSent && !clientAccountConfirmed && <button
                    className='account-profile__button account-profile__button--secondary'
                    onClick={(e) => createClientAccount(key, e)}
                  >
                    {message(language + 'Profile.RecreateClientAccount')}
                  </button>}
                </div>
              </div>}
            {!isCounselor && key && clientEmail && clientInviteSent && <div className='account-profile__field'>
              <label
                className='account-profile__label'
                htmlFor='clientEmail'>
                {message(language + 'Profile.ClientEmailLabel')}
              </label>
              <input
                data-private
                className='account-profile__input'
                id='clientEmail'
                type='email'
                autoComplete='off'
                disabled
                defaultValue={clientEmail || ''}
              />
            </div>}

            <div className='account-profile__field'>
              <div
                className='account-profile__label'
                htmlFor='rooms'>{message(language + 'Profile.ChooseVoucher')}</div>
              <div className='account-profile__field-row'>
                <div className='account-profile__field account-profile__field--inline'>
                  <input
                    className='account-profile__input account-profile__input--checkbox'
                    id='yesVoucher'
                    name='voucherMode'
                    type='radio'
                    onChange={(e) => changeField('hasVoucher', e.currentTarget.checked)}
                    defaultChecked={hasVoucher}
                    autoComplete='off'
                  />
                  <label
                    className='account-profile__label account-profile__label--secondary'
                    htmlFor='yesVoucher'>
                    {message(language + 'Profile.YesVoucher')}
                  </label>
                </div>
                <div className='account-profile__field account-profile__field--inline'>
                  <input
                    className='account-profile__input account-profile__input--checkbox'
                    id='noVoucher'
                    name='voucherMode'
                    type='radio'
                    onChange={(e) => changeField('hasVoucher', !e.currentTarget.checked)}
                    defaultChecked={!hasVoucher}
                    autoComplete='off'
                  />
                  <label
                    className='account-profile__label account-profile__label--secondary'
                    htmlFor='noVoucher'>
                    {message(language + 'Profile.NoVoucher')}
                  </label>
                </div>
              </div>
            </div>
            {!hasVoucher &&
              <div className='account-profile__field'>
                <label
                  className='account-profile__label'
                  htmlFor='budget'>{message(language + 'Profile.Budget')}</label>
                <BudgetOptions
                  budget={budget}
                  changeField={changeField} />
              </div>
            }
            <div className='account-profile__field'>
              <label
                className='account-profile__label'
                htmlFor='rooms'>{hasVoucher ? message(language + 'Profile.RoomsVoucher') : message(language + 'Profile.RoomsNoVoucher')}</label>
              <RoomOptions
                rooms={rooms}
                changeField={changeField} />
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
              language={this.props.language}
              TripPurposeOptions={TripPurposeOptions}
            />
            <div className='account-profile__field'>
              <div
                className='account-profile__label'
                htmlFor='rooms'>{message(language + 'Profile.ChooseTravelMode')}</div>
              <div className='account-profile__field-row'>
                <div className='account-profile__field account-profile__field--inline'>
                  <input
                    className='account-profile__input account-profile__input--checkbox'
                    id='byCar'
                    name='travelMode'
                    type='radio'
                    onChange={(e) => changeField('hasVehicle', e.currentTarget.checked)}
                    defaultChecked={hasVehicle}
                    autoComplete='off'
                  />
                  <label
                    className='account-profile__label account-profile__label--secondary'
                    htmlFor='byCar'>
                    {message(language + 'Profile.ByCar')}
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
                    autoComplete='off'
                  />
                  <label
                    className='account-profile__label account-profile__label--secondary'
                    htmlFor='byTransit'>
                    {message(language + 'Profile.ByTransit')}
                  </label>
                </div>
                {!hasVehicle && <div className='account-profile__field account-profile__field--inline'>
                  <input
                    className='account-profile__input account-profile__input--checkbox'
                    id='useCommuterRail'
                    type='checkbox'
                    onChange={(e) => changeField('useCommuterRail', e.currentTarget.checked)}
                    defaultChecked={useCommuterRail}
                    autoComplete='off'
                  />
                  <label
                    className='account-profile__label account-profile__label--secondary'
                    htmlFor='useCommuterRail'>
                    {message(language + 'Profile.UseCommuterRail')}
                  </label>
                </div>}
              </div>
              {!hasVehicle && <div className='account-profile__field-description'>
                {useCommuterRail ? message(language + 'Profile.UseCommuterRailExplanation')
                  : message(language + 'Profile.ByTransitExplanation')}
              </div>}
            </div>
            <div className='account-profile__importance-options'>
              <h3 className='account-profile__label'>
                {message(language + 'Profile.ImportanceHeading')}
              </h3>
              <div className='account-profile__field account-profile__field--inline account-profile__field--stack'>
                <label
                  className='account-profile__label account-profile__label--secondary'
                  htmlFor='importanceAccessibility'>{message(language + 'Profile.ImportanceAccessibility')}</label>
                <ImportanceOptions
                  fieldName='importanceAccessibility'
                  importance={importanceAccessibility}
                  changeField={changeField}
                  language={this.props.language} />
              </div>
              <div className='account-profile__field account-profile__field--inline account-profile__field--stack'>
                <label
                  className='account-profile__label account-profile__label--secondary'
                  htmlFor='importanceSchools'>{message(language + 'Profile.ImportanceSchools')}</label>
                <ImportanceOptions
                  fieldName='importanceSchools'
                  importance={importanceSchools}
                  changeField={changeField}
                  language={this.props.language} />
              </div>
              <div className='account-profile__field account-profile__field--inline account-profile__field--stack'>
                <label
                  className='account-profile__label account-profile__label--secondary'
                  htmlFor='importanceViolentCrime'>{message('Profile.ImportanceViolentCrime')}</label>
                <ImportanceOptions
                  fieldName='importanceViolentCrime'
                  importance={importanceViolentCrime}
                  changeField={changeField}
                  language={this.props.language} />
              </div>
            </div>
            <TextOptions
              info={textAlertPreferences}
              user={key}
              changeField={changeField}
              isChecked={this.state.isChecked}
              handleCheckboxChange={handleCheckboxChange}
              showTextOptions={showTextOptions}
              removePreference={removePreference} />
            <div className='account-profile__actions'>
              <button
                className='account-profile__button account-profile__button--primary'
                onClick={(e) => save(isCounselor, e)}>{message(language + 'Profile.Go')}</button>
              <button
                className='account-profile__button account-profile__button--secondary'
                onClick={cancel}>{message(language + 'Profile.Cancel')}</button>
              {!isAnonymous && <button
                className='account-profile__button account-profile__button--tertiary account-profile__button--iconLeft'
                onClick={(e) => deleteProfile(key, isCounselor, e)}
              >
                <Icon type='trash' />
                {message(language + 'Profile.DeleteProfile')}
              </button>}
            </div>
          </div>}
        </div>
      </div>
    )
  }
  /* eslint-enable complexity */
}
