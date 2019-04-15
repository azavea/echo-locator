// @flow
import Storage from '@aws-amplify/storage'
import message from '@conveyal/woonerf/message'
import {PureComponent} from 'react'

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
  }

  changeVoucherNumber (event) {
    this.setState({'voucherNumber': event.currentTarget.value})
    this.setState({errorMessage: '', noResults: false})
  }

  createAccount () {
    const search = this.search
    const voucher = this.state.voucherNumber

    if (!voucher) {
      this.setState({errorMessage: message('Accounts.MissingVoucherNumber')})
      return
    } else if (!validateVoucherNumber(voucher)) {
      this.setState({errorMessage: message('Accounts.InvalidVoucherNumber')})
      return
    } else {
      this.setState({errorMessage: ''})
    }

    const key = voucher.toUpperCase()
    const profile: AccountProfile = {
      destinations: [],
      hasVehicle: false,
      headOfHousehold: name,
      key: key,
      rooms: 0,
      voucherNumber: voucher
    }

    Storage.put(key, JSON.stringify(profile))
      .then(result => {
        search() // Refresh results; will find and go to the new profile
      })
      .catch(err => {
        console.error('Failed to post new profile to S3')
        console.error(err)
        this.setState({errorMessage: message('Accounts.CreateError')})
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

  selectAccount (key) {
    Storage.get(key, {download: true, expires: 60}).then(result => {
      const text = result.Body.toString('utf-8')
      const profile: AccountProfile = JSON.parse(text)
      this.props.changeUserProfile(profile)
      this.props.history.push({pathname: '/profile', state: {fromApp: true}})
    }).catch(err => {
      // If file not found, error message returned has `code` / `name`: NoSuchKey
      // and `message`: The specified key does not exist `statusCode`: 404
      // This is an expected case.
      if (err.code === 'NoSuchKey') {
        this.setState({noResults: true})
      } else {
        // This is an actual error.
        // `code`: CredentialsError will occur if attempting to access when not signed in
        // (should not happen)
        this.setState({errorMessage: message('Accounts.SelectError')})
        console.error('Failed to fetch account profile from S3 for key ' + key)
        console.error(err)
      }
    })
  }

  render () {
    const changeVoucherNumber = this.changeVoucherNumber
    const createAccount = this.createAccount
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
