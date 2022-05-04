// @flow
import { withTranslation } from 'react-i18next'
import { Greetings } from 'aws-amplify-react/dist/Auth'
import { NavButton } from 'aws-amplify-react/dist/Amplify-UI/Amplify-UI-Components-React'
import React from 'react'
import { Link } from 'react-router-dom'

import {ANONYMOUS_USERNAME} from '../constants'
import type {AccountProfile} from '../types'

class CustomHeaderBar extends Greetings {
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
    const {t, i18n} = this.props
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
          <Link to={{pathname: '/profile', state: {fromApp: true}}}>{t('Header.Edit')}</Link>
        </span>
        {isCounselor && <span className='app-header__button app-header__button--new'>
          <Link to='/search'>{t('Header.New')}</Link>
        </span>}
      </div>
    ) : null

    return (
      <header className='app-header'>
        <div className='app-header__brand'>
          <img className='app-header__logo' src='assets/echo_combined_logo_fullcolor.svg' alt={t('Title')} />
        </div>
        {userInfo}
        <div className='app-header__languageSelect'>
          <button className={`app-header__button ${i18n.language === 'en' ? 'app-header__button--on' : ''}`} onClick={() => i18n.changeLanguage('en')}>English</button>
          <button className={`app-header__button ${i18n.language === 'es' ? 'app-header__button--on' : ''}`} onClick={() => i18n.changeLanguage('es')}>Español</button>
          <button className={`app-header__button ${i18n.language === 'zh' ? 'app-header__button--on' : ''}`} onClick={() => i18n.changeLanguage('zh')}>中文</button>
        </div>
        {!isAnonymous && <div className='app-header__actions'>{this.renderSignOutButton(theme)}</div>}
        {isAnonymous &&
        <div className='app-header__actions'>
          <NavButton theme={theme} onClick={(e) => signIn(e)}>
            {t('Header.SignIn')}
          </NavButton>
        </div>}
      </header>
    )
  }
}

export default withTranslation()(CustomHeaderBar)
