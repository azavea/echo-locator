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
import message from '@conveyal/woonerf/message'
import React from 'react'

class SignInHeader extends React.Component {
  render () {
    return (
      <header className='auth-screen__header auth-header'>
        <h2 className='auth-header__agency'>
          <img className='auth-header__logo' src='assets/echo_combined_logo_STACKED_fullcolor.svg' alt='' />
          {message('Agency')}
        </h2>
        <h1 className='auth-header__app-name' >{message('Title')}</h1>
        <p className='auth-header__greeting'>{message('SignIn.Greeting')}</p>
      </header>
    )
  }
}

export default class CustomSignIn extends SignIn {
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
    const { authState, hide = [], federated, onStateChange, onAuthEvent, override = [] } = this.props
    const hideForgotPassword = !override.includes('ForgotPassword') &&
      hide.some(component => component === ForgotPassword)

    return (
      <div className='auth-screen'>
        <SignInHeader />
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
              {message('SignIn.AnonymousExplanation') + ' '}
              <Link theme={theme} onClick={() => this.changeState('useAnonymous')}>
                {message('SignIn.Anonymous')}
              </Link>
            </SectionFooterSecondaryContent>}
          </SectionFooter>
        </FormSection>
      </div>
    )
  }
}
