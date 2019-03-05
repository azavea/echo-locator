// @flow
import { Greetings } from 'aws-amplify-react/dist/Auth'
import message from '@conveyal/woonerf/message'
import React from 'react'

import type {AccountProfile} from '../types'

export default class CustomHeaderBar extends Greetings {
  componentDidMount () {
    super.componentDidMount()
  }

  getUserName () {
    const user = this.props.authData
    // get name from attributes first
    const nameFromAttr = user.attributes
      ? (user.attributes.name ||
      (user.attributes.given_name
        ? (user.attributes.given_name + ' ' + user.attributes.family_name) : undefined))
      : undefined
    return nameFromAttr || user.name || user.username
  }

  // based on:
  // https://github.com/aws-amplify/amplify-js/blob/master/packages/aws-amplify-react/src/Auth/Greetings.jsx#L131
  render () {
    const authState = this.props.authState || this.state.authState
    const signedIn = (authState === 'signedIn')
    if (!signedIn) { return null }
    const userProfile: AccountProfile = this.props.userProfile || this.state.userProfile
    const theme = this.props.theme

    const userInfo = userProfile ? (
      <div className='app-header__user-info'>
        <span className='app-header__user-name'>{userProfile.headOfHousehold}</span>
        <span className='app-header__voucher-number'># {userProfile.voucherNumber}</span>
      </div>
    ) : null

    return (
      <header className='app-header'>
        <div className='app-header__brand'>
          <img className='app-header__logo' src='assets/BHAlogo.png' alt='' />
          <span className='app-header__app-name'>{message('Title')}</span>
        </div>
        {userInfo}
        <div className='app-header__actions'>{this.renderSignOutButton(theme)}</div>
      </header>
    )
  }
}
