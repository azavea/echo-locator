// @flow
import { Component, Fragment } from 'react'
import { Authenticator } from 'aws-amplify-react/dist/Auth'
import LogRocket from 'logrocket'

import {clearLocalStorage, storeConfig} from '../config'
import {ANONYMOUS_USERNAME, PROFILE_CONFIG_KEY} from '../constants'
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

      // Load the selected user profile from localStorage, if any
      this.props.loadProfile()
    }

    changeUserProfile (profile: AccountProfile) {
      storeConfig(PROFILE_CONFIG_KEY, profile)
      this.props.store.dispatch({type: 'set profile', payload: profile})
    }

    handleAuthStateChange (state, data) {
      const { userProfile } = this.props.data
      // Create new empty profile to use when browsing anonymously
      if (state === 'useAnonymous' && process.env.ALLOW_ANONYMOUS) {
        LogRocket.identify()
        const profile: AccountProfile = {
          destinations: [],
          hasVehicle: false,
          headOfHousehold: ANONYMOUS_USERNAME,
          key: ANONYMOUS_USERNAME,
          rooms: 0,
          voucherNumber: ANONYMOUS_USERNAME
        }
        this.changeUserProfile(profile)
        // Tell auth library that the anonymous user is signed in
        this.setState({authState: 'signedIn', authData: {username: ANONYMOUS_USERNAME}})
      } else if (state === 'signIn' && userProfile && userProfile.key === ANONYMOUS_USERNAME) {
        LogRocket.identify()
        // Handle full page reload when browsing site anonymously
        this.setState({authState: 'signedIn', authData: {username: ANONYMOUS_USERNAME}})
      } else if (state === 'signedOut') {
        LogRocket.identify()
        this.setState({authState: state, authData: data})
        // Clear profile in components
        this.props.store.dispatch({type: 'set profile', payload: null})
        // Clear all local storage after logout
        clearLocalStorage()
      } else {
        if (data && data.username) {
          LogRocket.identify(data.username)
        }
        this.setState({authState: state, authData: data})
      }
    }

    render () {
      const { authState, authData } = this.state
      const { userProfile } = this.props.data
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
