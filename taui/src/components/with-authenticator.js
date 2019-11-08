// @flow
import Auth from '@aws-amplify/auth'
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

    /**
     * Returns promise that resovles to `true` if the voucher number and `key` on the given
     * account profile match each other and the voucher number attribute on the currently
     * logged-in user's Cognito account. Counselors have no voucher number assigned in Cognito,
     * so for them, it only checks that the voucher number and key match.
     */
    checkVoucherNumber (profile: AccountProfile): Promise<boolean> {
      return new Promise((resolve, reject) => {
        // Call to get Cognito profile (copy of profile in local storage can be manipulated).
        Auth.currentUserInfo().then(data => {
          if (data && data.attributes) {
            const vnum = data.attributes['custom:voucher']
            if (!profile || !profile.voucherNumber || !profile.key) {
              console.error('Cannot verify profile voucher number because it is missing.')
              resolve(false)
            }
            // counselor account
            if (!vnum) {
              resolve(profile.voucherNumber === profile.key)
            }
            // client account; verify Cognito voucher number matches profile voucher and key
            resolve(profile.voucherNumber === vnum && vnum === profile.key)
          } else if (profile.voucherNumber === ANONYMOUS_USERNAME) {
            // anonymous login has no current user data
            resolve(profile.voucherNumber === profile.key)
          } else {
            console.error('Failed to get Cognito profile attributes for currently logged in user.')
            resolve(false)
          }
        }).catch(err => {
          console.error('Failed to fetch Cognito profile for currently logged in user.')
          console.error(err)
          resolve(false)
        })
      })
    }

    // Returns promise that resolves to `true` if successful
    changeUserProfile (profile: AccountProfile): Promise<boolean> {
      // First verify that if this is a client account, the voucher number of the profile
      // matches the voucher number of the logged-in user.
      return new Promise((resolve, reject) => {
        this.checkVoucherNumber(profile).then(isValid => {
          if (isValid) {
            storeConfig(PROFILE_CONFIG_KEY, profile)
            this.props.store.dispatch({type: 'set profile', payload: profile})
            resolve(true)
          } else {
            console.error('Cannot change user profile; voucher number does not match.')
            resolve(false)
          }
        })
      })
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
