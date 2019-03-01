// @flow
import Storage from '@aws-amplify/storage'
import message from '@conveyal/woonerf/message'
import React from 'react'

import type {AccountProfile} from '../types'

/**
 * Search and select from accounts on S3.
 */
export default class SelectAccount extends React.PureComponent<Props> {
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
    this.setState({headOfHousehold: event.target.value})
    this.setState({errorMessage: ''})
  }

  changeVoucherNumber (event) {
    this.setState({'voucherNumber': event.target.value})
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
    const key = event.target.dataset.id
    const search = this.search

    console.log('Deleting account profile for ' + key)

    Storage.remove(key)
      .then(result => {
        search() // refresh search results
      })
      .catch(err => console.error(err))
  }

  selectAccount (event) {
    const key = event.target.dataset.id
    console.log('Select account ' + key)
    Storage.get(key, {download: true, expires: 60}).then(result => {
      const text = result.Body.toString('utf-8')
      const profile: AccountProfile = JSON.parse(text)
      this.props.changeUserProfile(profile)
      this.props.history.push('/map')
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
      <li key={account.key}>
        {account.headOfHousehold} {account.voucherNumber}
        <button
          data-id={account.key}
          onClick={selectAccount}>{message('Accounts.Select')}
        </button>
        <button
          data-id={account.key}
          onClick={deleteAccount}>{message('Accounts.Delete')}
        </button>
      </li>
    )
    return (
      <ul className='AccountList'>{listItems}</ul>
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
      <div>
        <div className='Splash'>
          <h2 className='SplashBoxHeader'>{message('Accounts.Title')}</h2>
          <div className='SplashBox'>
            <div>
              <div>
                <label htmlFor='headOfHousehold'>{message('Accounts.Name')}</label>
                <input
                  id='headOfHousehold'
                  type='text'
                  onChange={changeHeadOfHousehold}
                  value={state.headOfHousehold}
                />
              </div>
              <div>
                <label htmlFor='voucher'>{message('Accounts.Voucher')}</label>
                <input
                  id='voucher'
                  type='text'
                  onChange={changeVoucherNumber}
                  value={state.voucherNumber}
                />
              </div>
              {state.errorMessage &&
                <p className='Error'>Error: {state.errorMessage}</p>
              }
              <button onClick={search}>{message('Accounts.Search')}</button>
            </div>
            <br />
            <button onClick={createAccount}>{message('Accounts.Create')}</button>
          </div>
        </div>
        <AccountList
          accounts={state.accounts}
          deleteAccount={deleteAccount}
          selectAccount={selectAccount} />
      </div>
    )
  }
}
