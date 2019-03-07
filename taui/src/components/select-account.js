// @flow
import Storage from '@aws-amplify/storage'
import message from '@conveyal/woonerf/message'
import {PureComponent} from 'react'

import type {AccountProfile} from '../types'

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

    // TODO: #61 validate voucher number

    if (!voucher) {
      console.error('Missing voucher')
      this.setState({errorMessage:
        'Enter a voucher number to create a profile.'})
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
        this.setState({errorMessage: 'Accounts.CreateError'})
      })
  }

  search () {
    // Capitalize and strip whitespace from voucher numbers to normalize
    const searchVoucher = this.state.voucherNumber.toUpperCase().replace(/\s+/g, '')
    if (!searchVoucher) {
      this.setState({errorMessage: message('Accounts.SearchError')})
      return
    } else {
      this.setState({errorMessage: ''})
    }

    var found = false
    Storage.list('')
      .then(result => {
        const keys = result.map((r) => r.key)
        keys.forEach((key) => {
          if (searchVoucher && key === searchVoucher) {
            this.selectAccount(key)
            found = true
          }
        })
        if (!found) {
          this.setState({noResults: true})
        }
      })
      .catch(err => {
        console.error(err)
        this.setState({errorMessage: message('Accounts.SearchError')})
      })
  }

  selectAccount (key) {
    Storage.get(key, {download: true, expires: 60}).then(result => {
      const text = result.Body.toString('utf-8')
      const profile: AccountProfile = JSON.parse(text)
      this.props.changeUserProfile(profile)
      this.props.history.push('/profile')
    }).catch(err => {
      console.error('Failed to fetch account profile from S3 for key ' + key)
      console.error(err)
      this.setState({errorMessage: message('Accounts.SelectError')})
    })
  }

  render () {
    const changeVoucherNumber = this.changeVoucherNumber
    const createAccount = this.createAccount
    const search = this.search
    const state = this.state

    return (
      <div className='form-screen'>
        <h2 className='form-screen__heading'>{message('Accounts.Title')}</h2>
        <div className='form-screen__main'>
          <div className='account-search'>
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
                className='account-search__button account-search__button--search'
                onClick={search}>
                {message('Accounts.Search')}
              </button>
            </div>
            {state.errorMessage &&
              <p className='account-search__error'>{state.errorMessage}</p>
            }
            {state.noResults && <div className='account-search__no_results'>
              <h2>{message('Accounts.NoResults')}</h2>
              <button
                className='account-search__button account-search__button--create'
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
