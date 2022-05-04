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
  constructor (props) {
    super(props)
    this.state = {value: ''}

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange (e) {
    this.setState({value: e.target.value})
  }

  handleSubmit (e) {
    e.preventDefault()
    this.props.setLoginMessage('Thank you! Please check your email for a link to sign into ECHO.')
    this.props.sendLoginLink(this.state.value)
  }

  render () {
    const { t } = this.props
    return (
      <div className='auth-screen'>
        <SignInHeaderTranslated />
        <div className='auth-screen__main auth-main'>
          <form onSubmit={this.handleSubmit}>
            <fieldset>
              <label>
                <p>Email address</p>
                <input name='email' value={this.state.value} onChange={this.handleChange} />
              </label>
            </fieldset>
            <button type='submit' className='auth-main__button auth-main__button--primary'>SIGN IN</button>
            <div className='auth-main__success-message'>
              {this.props.data.loginMessage}
            </div>
          </form>
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
