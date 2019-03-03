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
    accounts: [],
    componentError: null,
    errorMessage: '',
    headOfHousehold: '',
    voucherNumber: ''
  }

  constructor (props) {
    super(props)

    this.changeHeadOfHousehold = this.changeHeadOfHousehold.bind(this)
    this.changeVoucherNumber = this.changeVoucherNumber.bind(this)
    this.createAccount = this.createAccount.bind(this)
    this.deleteAccount = this.deleteAccount.bind(this)
    this.selectAccount = this.selectAccount.bind(this)
    this.search = this.search.bind(this)
  }

  changeHeadOfHousehold (event) {
    this.setState({headOfHousehold: event.currentTarget.value})
    this.setState({errorMessage: ''})
  }

  changeVoucherNumber (event) {
    this.setState({'voucherNumber': event.currentTarget.value})
    this.setState({errorMessage: ''})
  }

  createAccount () {
    const search = this.search
    const name = this.state.headOfHousehold
    const voucher = this.state.voucherNumber

    if (!name || !voucher) {
      console.error('Missing name or voucher')
      this.setState({errorMessage:
        'Enter both name and voucher to create account.'})
      return
    } else {
      this.setState({errorMessage: ''})
    }

    const key = name.toUpperCase() + '_' + voucher.toUpperCase()
    console.log('Creating account profile for ' + key)

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
        console.log(result)
        search() // refresh results
      })
      .catch(err => console.error(err))
  }

  search () {
    this.setState({errorMessage: ''})
    const searchName = this.state.headOfHousehold.toUpperCase()
    const searchVoucher = this.state.voucherNumber.toUpperCase()

    const accounts = []
    Storage.list('')
      .then(result => {
        const keys = result.map((r) => r.key)
        let name
        let voucher
        keys.forEach((key) => {
          [name, voucher] = key.split('_')
          if (searchName && name.indexOf(searchName) === -1) {
            return
          }
          if (searchVoucher && voucher.indexOf(searchVoucher) === -1) {
            return
          }
          accounts.push({
            'headOfHousehold': name,
            'key': key,
            'voucherNumber': voucher
          })
        })
        this.setState({'accounts': accounts})
      })
      .catch(err => {
        console.error(err)
        this.setState({errorMessage: err})
      })
  }

  deleteAccount (event) {
    const key = event.currentTarget.dataset.id
    const search = this.search

    console.log('Deleting account profile for ' + key)

    Storage.remove(key)
      .then(result => {
        search() // refresh search results
      })
      .catch(err => console.error(err))
  }

  selectAccount (event) {
    const key = event.currentTarget.dataset.id
    console.log('Select account ' + key)
    Storage.get(key, {download: true, expires: 60}).then(result => {
      const text = result.Body.toString('utf-8')
      const profile: AccountProfile = JSON.parse(text)
      this.props.changeUserProfile(profile)
      this.props.history.push('/profile')
    }).catch(err => {
      console.error('Failed to fetch account profile from S3 for key ' + key)
      console.error(err)
    })
  }

  accountList (props) {
    const accountList = props.accounts
    const deleteAccount = props.deleteAccount
    const selectAccount = props.selectAccount
    const listItems = accountList.map((account) =>
      <li key={account.key} className='account-list__item'>
        <button
          className='account-list__button account-list__button--select'
          data-id={account.key}
          onClick={selectAccount}>
          <span className='account-list__name'>{account.headOfHousehold}</span>
          <span className='account-list__voucher-number'>{account.voucherNumber}</span>
        </button>
        <button
          className='account-list__button account-list__button--delete'
          data-id={account.key}
          onClick={deleteAccount}
          title='Delete this account'>
          <img src='assets/trash-alt.svg' width='16' alt='Delete' />
        </button>
      </li>
    )
    return (
      <ul className='account-list'>{listItems}</ul>
    )
  }

  render () {
    const changeHeadOfHousehold = this.changeHeadOfHousehold
    const changeVoucherNumber = this.changeVoucherNumber
    const createAccount = this.createAccount
    const deleteAccount = this.deleteAccount
    const selectAccount = this.selectAccount
    const search = this.search
    const state = this.state

    const AccountList = this.accountList

    return (
      <div className='form-screen'>
        <h2 className='form-screen__heading'>{message('Accounts.Title')}</h2>
        <div className='form-screen__main'>
          <div className='account-search'>
            <div className='account-search__main'>
              <div className='account-search__field'>
                <label
                  className='account-search__label'
                  htmlFor='headOfHousehold'
                >
                  {message('Accounts.Name')}
                </label>
                <input
                  className='account-search__input'
                  id='headOfHousehold'
                  type='text'
                  onChange={changeHeadOfHousehold}
                  value={state.headOfHousehold}
                />
              </div>
              <div className='account-search__field'>
                <label
                  className='account-search__label'
                  htmlFor='voucher'
                >
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
                onClick={search}
              >
                {message('Accounts.Search')}
              </button>
            </div>
            {state.errorMessage &&
              <p className='account-search__error'>Error: {state.errorMessage}</p>
            }
            <button
              className='account-search__button account-search__button--create'
              onClick={createAccount}
            >
              {message('Accounts.Create')}
            </button>
          </div>
          <AccountList
            accounts={state.accounts}
            deleteAccount={deleteAccount}
            selectAccount={selectAccount} />
        </div>
      </div>
    )
  }
}
