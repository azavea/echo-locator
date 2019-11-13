// @flow
import API from '@aws-amplify/api'
import Auth from '@aws-amplify/auth'
import Storage from '@aws-amplify/storage'
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
      this.logoutEcholocator = this.logoutEcholocator.bind(this)

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

    // Helper to log out and clean up
    logoutEcholocator (authData) {
      LogRocket.identify()
      this.setState({authState: 'signedOut', authData: authData})
      // Clear profile in components
      this.props.store.dispatch({type: 'set profile', payload: null})
      // Clear all local storage after logout
      clearLocalStorage()
    }

    handleAuthStateChange (state, data) {
      const { userProfile } = this.props.data

      // Create new empty profile to use when browsing anonymously
      if (state === 'useAnonymous' && process.env.ALLOW_ANONYMOUS) {
        LogRocket.identify()
        const anonymousProfile: AccountProfile = {
          destinations: [],
          hasVehicle: false,
          headOfHousehold: ANONYMOUS_USERNAME,
          key: ANONYMOUS_USERNAME,
          rooms: 0,
          voucherNumber: ANONYMOUS_USERNAME
        }
        this.changeUserProfile(anonymousProfile)
        // Tell auth library that the anonymous user is signed in
        this.setState({authState: 'signedIn', authData: {username: ANONYMOUS_USERNAME}})
      } else if (state === 'signIn' && userProfile && userProfile.key === ANONYMOUS_USERNAME) {
        LogRocket.identify()
        // Handle full page reload when browsing site anonymously
        this.setState({authState: 'signedIn', authData: {username: ANONYMOUS_USERNAME}})
      } else if (state === 'signedOut') {
        this.logoutEcholocator(data)
      } else if (state === 'signedIn') {
        if (data && data.attributes) {
          const email = data.attributes.email
          LogRocket.identify(email)
          console.log('Logged in user ' + email)
          console.log(data)

          const voucher = data.attributes['custom:voucher']
          const groups = data.signInUserSession && data.signInUserSession.idToken ?
            data.signInUserSession.idToken.payload['cognito:groups'] : []

          if (voucher) {
            console.log('A client logged in. Voucher #' + voucher)
            // attempt to go to client profile directly
            Auth.currentUserInfo().then(data => {
              console.log('user info:')
              console.log(data)
              console.log('identity ID: ' + data.id)
              const key = `${voucher}_${data.id}`
              Storage.get(key, {download: true, expires: 60}).then(result => {
                const text = result.Body.toString('utf-8')
                const profile: AccountProfile = JSON.parse(text)
                this.changeUserProfile(profile).then(didChange => {
                  if (didChange) {
                    // Skip profile page and go to map if profile exists and has destinations set
                    const destination = profile && profile.destinations &&
                      profile.destinations.length ? '/map' : '/profile'
                    this.props.history.push({pathname: destination, state: {fromApp: true}})
                  } else {
                    // Failed to set profile
                    console.error('Failed to set user profile')
                    // FIXME: now what
                  }
                })
              }).catch(err => {
                // If file not found, client users only get `AccessDenied`
                // because they do not have list bucket permissions
                if (err.code === 'AccessDenied') {
                  console.error('Failed to get key found on s3: ' + key)
                  // Hit API endpoint to handle getting counselor-created profile
                  // First have to use `Auth.currentUserInfo` to get Identity ID
                  Auth.currentUserInfo().then(data => {
                    console.log('user info:')
                    console.log(data)
                    console.log('identity ID: ' + data.id)
                    // FIXME: put API name in constants? config?
                    API.post('echolocatorDevEmailProfilesApi', '/profiles', {
                      body: {
                        identityId: data.id,
                        email: email
                      }
                    }).then(response => {
                      if (response.error) {
                        console.error('Failed to POST to profiles API')
                        console.error(response.error)
                        console.error(response)
                      } else {
                        console.log('Profile API POST succeeded')
                        console.log(response)
                      }
                    }).catch(error => {
                      console.error('Profile API call failed')
                      console.error(error)
                    })
                  }).catch(err => {
                    console.error('Failed to fetch user identity ID')
                    console.error(err)
                  })
                } else {
                  console.error(err.code)
                  // This is an actual error.
                  // `code`: CredentialsError will occur if attempting to access when not signed in
                  // FIXME: now what
                  console.error('Failed to fetch account profile from S3 for key ' + key)
                  console.error(err)
                }
              })
            }).catch(err => {
              console.error(err)
            })
          } else if (groups && groups.length > 0 && groups.indexOf('counselors') > -1) {
            console.log('A counselor logged in')
            // Set a convenience property for group membership
            data.counselor = true
          } else {
            console.error('User logged in who is not a counselor and has no voucher set')
            // FIXME: do something
          }
        } else {
          console.warn('signed in with no data?', data)
        }

        console.log('finally, set auth state')
        this.setState({authState: state, authData: data})
      } else {
        console.log('Setting state ' + state)
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
