// @flow
import { Component, Fragment } from 'react'
import { Authenticator } from 'aws-amplify-react/dist/Auth'

import CustomHeaderBar from './custom-header-bar'

// Override authentication wrapper to use custom header bar
// based on:
// https://github.com/aws-amplify/amplify-js/blob/master/packages/aws-amplify-react/src/Auth/index.jsx
export default function withAuthenticator (Comp, includeGreetings = false,
  authenticatorComponents = [], federated = null, theme = null, signUpConfig = {}) {
  return class extends Component {
    constructor (props) {
      super(props)

      this.handleAuthStateChange = this.handleAuthStateChange.bind(this)

      this.state = {
        authState: props.authState || null,
        authData: props.authData || null
      }

      this.authConfig = {}

      if (typeof includeGreetings === 'object' && includeGreetings !== null) {
        this.authConfig = Object.assign(this.authConfig, includeGreetings)
      } else {
        this.authConfig = {
          includeGreetings,
          authenticatorComponents,
          federated,
          theme,
          signUpConfig
        }
      }
    }

    handleAuthStateChange (state, data) {
      this.setState({ authState: state, authData: data })
    }

    render () {
      const { authState, authData } = this.state
      const signedIn = (authState === 'signedIn')
      if (signedIn) {
        return (
          <Fragment>
            {
              this.authConfig.includeGreetings ? <CustomHeaderBar
                authState={authState}
                authData={authData}
                federated={this.authConfig.federated || this.props.federated || {}}
                onStateChange={this.handleAuthStateChange}
                theme={theme}
              /> : null
            }
            <Comp
              {...this.props}
              authState={authState}
              authData={authData}
              onStateChange={this.handleAuthStateChange}
            />
          </Fragment>
        )
      }

      return <Authenticator
        {...this.props}
        theme={this.authConfig.theme}
        federated={this.authConfig.federated || this.props.federated}
        hideDefault={this.authConfig.authenticatorComponents &&
            this.authConfig.authenticatorComponents.length > 0}
        signUpConfig={this.authConfig.signUpConfig}
        onStateChange={this.handleAuthStateChange}
        children={this.authConfig.authenticatorComponents || []}
      />
    }
  }
}
