// @flow
import API from '@aws-amplify/api'
import Auth from '@aws-amplify/auth'
import Storage from '@aws-amplify/storage'
import message from '@conveyal/woonerf/message'
import {PureComponent} from 'react'

import {
  AMPLIFY_API_NAME,
  DEFAULT_ACCESSIBILITY_IMPORTANCE,
  DEFAULT_CRIME_IMPORTANCE,
  DEFAULT_SCHOOLS_IMPORTANCE
} from '../constants'
import type {AccountProfile} from '../types'
import validateVoucherNumber from '../utils/validate-voucher-number'

/**
 * Search and select from accounts on S3.
 */
export default class SelectAccount extends PureComponent<Props> {
  state = {
    componentError: null,
    errorMessage: '',
    noResults: false,
    voucherNumber: ''
  }

  constructor (props) {
    super(props)

    this.changeVoucherNumber = this.changeVoucherNumber.bind(this)
    this.createAccount = this.createAccount.bind(this)
    this.selectAccount = this.selectAccount.bind(this)
    this.search = this.search.bind(this)
    this.testApi = this.testApi.bind(this)
  }

  changeVoucherNumber (event) {
    this.setState({'voucherNumber': event.currentTarget.value})
    this.setState({errorMessage: '', noResults: false})
  }

  createAccount () {
    const search = this.search
    const voucher = this.state.voucherNumber.toUpperCase().replace(/\s+/g, '')

    if (!voucher) {
      this.setState({errorMessage: message('Accounts.MissingVoucherNumber')})
      return
    } else if (!validateVoucherNumber(voucher)) {
      this.setState({errorMessage: message('Accounts.InvalidVoucherNumber')})
      return
    } else {
      this.setState({errorMessage: ''})
    }

    // Default profile
    const profile: AccountProfile = {
      destinations: [],
      favorites: [],
      hasVehicle: false,
      headOfHousehold: name,
      importanceAccessibility: DEFAULT_ACCESSIBILITY_IMPORTANCE,
      importanceSchools: DEFAULT_SCHOOLS_IMPORTANCE,
      importanceViolentCrime: DEFAULT_CRIME_IMPORTANCE,
      key: voucher,
      rooms: 0,
      useCommuterRail: true,
      voucherNumber: voucher
    }

    Storage.put(voucher, JSON.stringify(profile))
      .then(result => {
        search() // Refresh results; will find and go to the new profile
      })
      .catch(err => {
        console.error('Failed to post new profile to S3')
        console.error(err)
        this.setState({errorMessage: message('Accounts.CreateError')})
      })
  }

  // given an s3 key, fetch the profile for that key and use it
  goToProfile (key: string) {
    Storage.get(key, {download: true, expires: 60}).then(result => {
      const text = result.Body.toString('utf-8')
      const profile: AccountProfile = JSON.parse(text)
      this.props.changeUserProfile(profile).then(didChange => {
        if (didChange) {
          // Skip profile page and go to map if profile exists and has destinations set
          const destination = profile && profile.destinations &&
            profile.destinations.length ? '/map' : '/profile'
          this.props.history.push({pathname: destination, state: {fromApp: true}})
        } else {
          // Failed to set profile (maybe due to voucher number mismatch; shouldn't get here)
          this.setState({errorMessage: message('Accounts.SelectError')})
        }
      })
    }).catch(err => {
      // If file not found, error message returned has `code` / `name`: NoSuchKey
      // and `message`: The specified key does not exist `statusCode`: 404
      // Should not happen, as key would not have been found by s3 list operation.
      if (err.code === 'NoSuchKey') {
        console.error('Failed to get key found on s3: ' + key)
        this.setState({noResults: true})
      } else {
        console.error(err.code)
        // This is an actual error.
        // `code`: CredentialsError will occur if attempting to access when not signed in
        // (should not happen)
        this.setState({errorMessage: message('Accounts.SelectError')})
        console.error('Failed to fetch account profile from S3 for key ' + key)
        console.error(err)
      }
    })
  }

  search () {
    // Capitalize and strip whitespace from voucher numbers to normalize
    const searchVoucher = this.state.voucherNumber.toUpperCase().replace(/\s+/g, '')
    if (!searchVoucher) {
      this.setState({errorMessage: message('Accounts.SearchError')})
      return
    } else if (!validateVoucherNumber(searchVoucher)) {
      this.setState({errorMessage: message('Accounts.InvalidVoucherNumber')})
      return
    } else {
      this.setState({errorMessage: ''})
    }
    this.selectAccount(searchVoucher)
  }

  selectAccount (voucher) {
    Auth.currentSession().then(data => {
      if (data && data.idToken && data.idToken.payload) {
        const groups = data.idToken.payload['cognito:groups']
        if (groups && groups.length > 0 && groups.indexOf('counselors') > -1) {
          console.log('user is a counselor!')
          Storage.list(voucher).then(s3list => {
            console.log('found profiles matching voucher:')
            console.log(s3list)
            if (!s3list || s3list.length === 0) {
              this.setState({noResults: true})
              return
            } else if (s3list.length > 1) {
              // FIXME: what else to do?
              console.error('Found more than one profile for voucher ' + voucher)
            }
            // FIXME: store key for profile in use and use it when saving to it later
            const key = s3list[0].key
            this.goToProfile(key)
          }).catch(err => {
            this.setState({errorMessage: message('Accounts.SelectError')})
            console.error('Failed to fetch s3 contents that match voucher ' + voucher)
            console.error(err)
          })
        } else {
          console.warn('not a counselor, attempt to go directly to profile')
          Auth.currentUserInfo().then(data => {
            console.log('user info:')
            console.log(data)
            console.log('identity ID: ' + data.id)
            this.goToProfile(`${voucher}_${data.id}`)
          }).catch(err => {
            console.error(err)
          })
        }
      }
    }).catch(err => {
      console.error(err)
    })
  }

  testApi () {
    console.log('test api query')

    // Also set `response: true` in addition to `body` to get full response,
    // instead of just data (AWS library uses Axios).
    API.post(AMPLIFY_API_NAME, '/clients', {
      body: {
        email: 'kkillebrew+ok@azavea.com',
        voucher: '22222222'
      }
    }).then(response => {
      if (response.error) {
        console.error('Failed to create user')
        console.error(response.error)
      } else {
        console.log('User created!')
        console.log(response)
      }
    }).catch(error => {
      // A 403 (as when user is not a counselor) will only return "Network Error"
      console.error('API call to create user failed')
      console.error(error)
    })
  }

  render () {
    const changeVoucherNumber = this.changeVoucherNumber
    const createAccount = this.createAccount
    const testApi = this.testApi

    const state = this.state

    const search = (e) => {
      e.preventDefault()
      this.search()
    }

    return (
      <div className='form-screen'>
        <h2 className='form-screen__heading'>{message('Accounts.Title')}</h2>
        <div className='form-screen__main'>
          <div className='account-search'>
            <form onSubmit={search}>
              <div className='account-search__main'>
                <div className='account-search__field'>
                  <label
                    className='account-search__label'
                    htmlFor='voucher'>
                    {message('Accounts.Voucher')}
                  </label>
                  <input
                    className='account-search__input'
                    id='voucher'
                    type='text'
                    onChange={changeVoucherNumber}
                    value={state.voucherNumber}
                  />
                </div>
                <button
                  className='account-search__button account-search__button--search'>
                  {message('Accounts.Search')}
                </button>
                <button
                  className='account-search__button account-search__button--create'
                  onClick={testApi}>
                  Test the thing
                </button>
              </div>
            </form>
            {state.errorMessage &&
              <p className='account-search__error'>{state.errorMessage}</p>
            }
            {state.noResults && <div className='account-search__no-results'>
              <h2 className='account-search__no-results-heading'>{message('Accounts.NoResults')}</h2>
              <button
                className='account-search__button account-search__button--create'
                type='button'
                onClick={createAccount}>
                {message('Accounts.Create')}
              </button>
            </div>}
          </div>
        </div>
      </div>
    )
  }
}
