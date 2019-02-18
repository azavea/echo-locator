// @flow
import message from '@conveyal/woonerf/message'
import React from 'react'

/**
 * Search and select from accounts on S3.
 */
export default class SelectAccount extends React.PureComponent<Props> {
  state = {
    componentError: null,
    headOfHousehold: '',
    voucherNumber: ''
  }

  constructor (props) {
    super(props)

    this.changeHeadOfHousehold = this.changeHeadOfHousehold.bind(this)
    this.changeVoucherNumber = this.changeVoucherNumber.bind(this)
    this.search = this.search.bind(this)
  }

  changeHeadOfHousehold (event) {
    this.setState({headOfHousehold: event.target.value})
  }

  changeVoucherNumber (event) {
    this.setState({'voucherNumber': event.target.value})
  }

  search () {
    console.log('search')
    console.log(this.state)
  }

  render () {
    const changeHeadOfHousehold = this.changeHeadOfHousehold
    const changeVoucherNumber = this.changeVoucherNumber
    const search = this.search
    const state = this.state

    return (
      <div>
        <div className='Splash'>
          <h2 className='SplashBoxHeader'>{message('Search.Title')}</h2>
          <div className='SplashBox'>
            <div>
              <div>
                <label htmlFor='headOfHousehold'>{message('Search.Name')}</label>
                <input
                  id='headOfHousehold'
                  type='text'
                  onChange={changeHeadOfHousehold}
                  value={state.headOfHousehold}
                />
              </div>
              <div>
                <label htmlFor='voucher'>{message('Search.Voucher')}</label>
                <input
                  id='voucher'
                  type='text'
                  onChange={changeVoucherNumber}
                  value={state.voucherNumber}
                />
              </div>
              <button onClick={search}>{message('Search.Action')}</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
