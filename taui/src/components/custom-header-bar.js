// @flow
import { Greetings } from 'aws-amplify-react/dist/Auth'
import { NavButton } from 'aws-amplify-react/dist/Amplify-UI/Amplify-UI-Components-React'
import message from '@conveyal/woonerf/message'
import React from 'react'
import { Link } from 'react-router-dom'

import {ANONYMOUS_USERNAME} from '../constants'
import type {AccountProfile} from '../types'

export default class CustomHeaderBar extends Greetings {
  constructor (props) {
    super(props)
    this.signIn = this.signIn.bind(this)
  }

  componentDidMount () {
    super.componentDidMount()
  }

  getUserName () {
    const user = this.props.authData
    // get name from attributes first
    const nameFromAttr = user.attributes ? user.attributes.email : undefined
    return nameFromAttr || user.name || user.username
  }

  signIn () {
    // Redirect to login page
    this.changeState('signedOut')
  }

  // based on:
  // https://github.com/aws-amplify/amplify-js/blob/master/packages/aws-amplify-react/src/Auth/Greetings.jsx#L131
  render () {
    const authState = this.props.authState || this.state.authState
    const signedIn = (authState === 'signedIn')
    if (!signedIn) { return null }
    const userProfile: AccountProfile = this.props.userProfile || this.state.userProfile
    const isAnonymous = userProfile && userProfile.key === ANONYMOUS_USERNAME
    const isCounselor = !!this.props.authData.counselor && !isAnonymous
    const signIn = this.signIn
    const theme = this.props.theme

    const userInfo = userProfile ? (
      <div className='app-header__user-info'>
        {!isAnonymous && <span className='app-header__user-name'>{userProfile.headOfHousehold}</span>}
        {!isAnonymous && <span className='app-header__voucher-number'># {userProfile.voucherNumber}</span>}
        <span className='app-header__button'>
          <Link to={{pathname: '/profile', state: {fromApp: true}}}>{message('Header.Edit')}</Link>
        </span>
        {isCounselor && <span className='app-header__button app-header__button--new'>
          <Link to='/search'>{message('Header.New')}</Link>
        </span>}
      </div>
    ) : null

    return (
      <header className='app-header'>
        <div className='app-header__brand'>
          <img className='app-header__logo' src='assets/BHAlogo.png' alt='' />
          <span className='app-header__app-name'>{message('Title')}</span>
        </div>
        {userInfo}
        <LanguageSelect setLanguage={this.props.setLanguage} />
        {!isAnonymous && <div className='app-header__actions'>{this.renderSignOutButton(theme)}</div>}
        {isAnonymous &&
          <div className='app-header__actions'>
            <NavButton theme={theme} onClick={(e) => signIn(e)}>
              {message('Header.SignIn')}
            </NavButton>
          </div>}
      </header>
    )
  }
}

// class for language selection, calls the necessary listeners and updates language state
class LanguageSelect extends React.Component {
  constructor (props) {
    super(props)
    this.handleEnglishClick = this.handleEnglishClick.bind(this)
    this.handleSpanishClick = this.handleSpanishClick.bind(this)
    this.handleChineseClick = this.handleChineseClick.bind(this)
  }

  handleEnglishClick () {
    this.props.setLanguage('English')
  }

  handleSpanishClick () {
    this.props.setLanguage('Spanish')
  }

  handleChineseClick () {
    this.props.setLanguage('Chinese')
  }

  render () {
    return (
      <div className='languageSelect'>
        <button onClick={this.handleEnglishClick}> English </button>
        <button onClick={this.handleSpanishClick}> Español </button>
        <button onClick={this.handleChineseClick}> 中文 </button>
      </div>
    )
  }
}
