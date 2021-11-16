// @flow
import { I18n } from '@aws-amplify/core'
import {
  FederatedButtons,
  ForgotPassword,
  SignIn
} from 'aws-amplify-react/dist/Auth'
import {
  FormSection,
  FormField,
  SectionBody,
  SectionFooter,
  Button,
  Link,
  Hint,
  Input,
  InputLabel,
  SectionFooterPrimaryContent,
  SectionFooterSecondaryContent
} from 'aws-amplify-react/dist/Amplify-UI/Amplify-UI-Components-React'
import React from 'react'
import { withTranslation } from 'react-i18next'

class SignInHeader extends React.Component {
  render () {
    const {t} = this.props
    return (
      <header className='auth-screen__header auth-header'>
        <h2 className='auth-header__agency'>
          <img className='auth-header__logo' src='assets/echo_combined_logo_STACKED_fullcolor.svg' alt='ECHO Logo' />
          {t('Agency')}
        </h2>
        <h1 className='auth-header__app-name' >{t('Title')}</h1>
        <p className='auth-header__greeting'>{t('SignIn.Greeting')}</p>
      </header>
    )
  }
}

const SignInHeaderTranslated = withTranslation()(SignInHeader)

class CustomSignIn extends SignIn {
  submitOnEnter = (e) => {
    if (e.key === 'Enter') {
      this.signIn(e)
    }
  }
  // Have to copy showComponent here, because `hide` non-mutable property
  // results in null being returned from call to super.
  // Based on source:
  // https://github.com/aws-amplify/amplify-js/blob/master/packages/aws-amplify-react/src/Auth/SignIn.jsx#L120
  showComponent (theme) {
    const { authState, hide = [], federated, onStateChange, onAuthEvent, override = [], t } = this.props
    const hideForgotPassword = !override.includes('ForgotPassword') &&
      hide.some(component => component === ForgotPassword)

    return (
      <div className='auth-screen'>
        <SignInHeaderTranslated />
        <FormSection theme={theme}>
          <SectionBody theme={theme}>
            <FederatedButtons
              federated={federated}
              theme={theme}
              authState={authState}
              onStateChange={onStateChange}
              onAuthEvent={onAuthEvent}
            />
            <FormField theme={theme}>
              <InputLabel>{I18n.get('Username')}</InputLabel>
              <Input
                data-private
                autoFocus
                theme={theme}
                key='username'
                onKeyPress={(e) => this.submitOnEnter(e)}
                name='username'
                onChange={this.handleInputChange}
              />
            </FormField>
            <FormField theme={theme}>
              <InputLabel>{I18n.get('Password')}</InputLabel>
              <Input
                data-private
                theme={theme}
                key='password'
                onKeyPress={(e) => this.submitOnEnter(e)}
                type='password'
                name='password'
                onChange={this.handleInputChange}
              />
              {
                !hideForgotPassword && <Hint theme={theme}>
                  {I18n.get('Forget your password? ')}
                  <Link theme={theme} onClick={() => this.changeState('forgotPassword')}>
                    {I18n.get('Reset password')}
                  </Link>
                </Hint>
              }
            </FormField>
          </SectionBody>
          <SectionFooter theme={theme}>
            <SectionFooterPrimaryContent theme={theme}>
              <Button theme={theme} onClick={this.signIn} disabled={this.state.loading}>
                {I18n.get('Sign In')}
              </Button>
            </SectionFooterPrimaryContent>
            {process.env.ALLOW_ANONYMOUS && <SectionFooterSecondaryContent theme={theme}>
              {t('SignIn.AnonymousExplanation') + ' '}
              <Link theme={theme} onClick={() => this.changeState('useAnonymous')}>
                {t('SignIn.Anonymous')}
              </Link>
            </SectionFooterSecondaryContent>}
          </SectionFooter>
        </FormSection>
      </div>
    )
  }
}

export default withTranslation()(CustomSignIn)
