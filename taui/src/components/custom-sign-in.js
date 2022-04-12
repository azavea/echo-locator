// @flow
import React from 'react'
import { Link } from 'react-router-dom'
import { withTranslation } from 'react-i18next'

class SignInHeader extends React.Component {
  render () {
    const {t} = this.props
    return (
      <header className='auth-screen__header auth-header'>
        <h2 className='auth-header__agency'>{t('Agency')}</h2>
        <h1 className='auth-header__app-name'>
          <img
            className='auth-header__logo'
            src='assets/echo_combined_logo_STACKED_fullcolor.svg'
            alt={t('Title')}
          />
        </h1>
        <p className='auth-header__greeting'>{t('SignIn.Greeting')}</p>
      </header>
    )
  }
}

const SignInHeaderTranslated = withTranslation()(SignInHeader)

class CustomSignIn extends React.Component {
  render () {
    const { t } = this.props
    return (
      <div className='auth-screen'>
        <SignInHeaderTranslated />
        <div className='auth-screen__main auth-main'>
          <div className='auth-main__anonymous-login'>
            {`${t('SignIn.AnonymousExplanation')} `}
            <Link to='/profile' onClick={() => {
              this.props.handleAuthChange()
              this.props.history.push('/profile')
            }}>
              {t('SignIn.Anonymous')}
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

export default withTranslation()(CustomSignIn)
