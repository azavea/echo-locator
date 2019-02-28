// @flow
import { Component, Fragment } from 'react'
import { Authenticator } from 'aws-amplify-react/dist/Auth'

import {loadDataFromJSON} from '../actions/json-data'
import {storeConfig} from '../config'
import {PROFILE_CONFIG_KEY} from '../constants'
import type {AccountProfile} from '../types'

import CustomHeaderBar from './custom-header-bar'

// Override authentication wrapper to use custom header bar
// based on:
// https://github.com/aws-amplify/amplify-js/blob/master/packages/aws-amplify-react/src/Auth/index.jsx
export default function withAuthenticator (Comp, includeGreetings = false,
  authenticatorComponents = [], federated = null, theme = null, signUpConfig = {}) {
  return class extends Component {
    constructor (props) {
      super(props)

      this.changeUserProfile = this.changeUserProfile.bind(this)
      this.handleAuthStateChange = this.handleAuthStateChange.bind(this)

      this.state = {
        authState: props.authState || null,
        authData: props.authData || null,
        userProfile: props.userProfile || null
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

      // listen for profile changes to update the header
      this.props.store.subscribe(() => {
        const newState = this.props.store.getState()
        if (newState && newState.data && newState.data.userProfile) {
          this.setState({ userProfile: newState.data.userProfile })
        }
      })
    }

    changeUserProfile (profile: AccountProfile) {
      this.setState({ userProfile: profile })
      storeConfig(PROFILE_CONFIG_KEY, profile)
      this.props.store.dispatch({type: 'set profile', payload: profile})
    }

    handleAuthStateChange (state, data) {
      this.setState({ authState: state, authData: data })
    }

    render () {
      const { authState, authData, userProfile } = this.state
      const signedIn = (authState === 'signedIn')
      if (signedIn) {
        return (
          <Fragment>
            {
              this.authConfig.includeGreetings ? <CustomHeaderBar
                authState={authState}
                authData={authData}
                changeUserProfile={this.changeUserProfile}
                federated={this.authConfig.federated || this.props.federated || {}}
                onStateChange={this.handleAuthStateChange}
                theme={theme}
                userProfile={userProfile}
              /> : null
            }
            <Comp
              {...this.props}
              authState={authState}
              authData={authData}
              changeUserProfile={this.changeUserProfile}
              userProfile={userProfile}
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
        changeUserProfile={this.changeUserProfile}
        children={this.authConfig.authenticatorComponents || []}
      />
    }
  }
}
