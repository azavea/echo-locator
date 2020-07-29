// @flow
import API from '@aws-amplify/api'
import Auth from '@aws-amplify/auth'
import Storage from '@aws-amplify/storage'
import { Component, Fragment } from 'react'
import { Authenticator } from 'aws-amplify-react/dist/Auth'
import LogRocket from 'logrocket'

import {clearLocalStorage, storeConfig} from '../config'
import {AMPLIFY_API_NAME,
  ANONYMOUS_USERNAME,
  CUSTOM_VOUCHER_KEY,
  PROFILE_CONFIG_KEY} from '../constants'
import type {AccountProfile} from '../types'
import storeDefaultProfile from '../utils/store-default-profile'

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
      this.setClientProfile = this.setClientProfile.bind(this)
      this.fetchAndSetProfile = this.fetchAndSetProfile.bind(this)
      this.goToClientProfile = this.goToClientProfile.bind(this)
      this.handleUserSignIn = this.handleUserSignIn.bind(this)
      this.setLanguage = this.setLanguage.bind(this)

      this.state = {
        authState: props.authState || null,
        authData: props.authData || null,
        language: 'English' // default language
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

    // callback for language setting
    setLanguage (lang: string) {
      if (lang === 'English') {
        lang = ''
      }
      this.setState({language: lang})
    }

    /**
     * Returns promise that resolves to `true` if the `key` on the given account profile contains
     * the voucher number and the voucher number matches the custom attribute on the currently
     * logged-in user's Cognito account. Counselors have no voucher number assigned in Cognito,
     * so for them, it only checks that the key contains the voucher number.
     */
    checkVoucherNumber (profile: AccountProfile): Promise<boolean> {
      return new Promise((resolve, reject) => {
        // Call to get Cognito profile (copy of profile in local storage can be manipulated).
        Auth.currentUserInfo().then(data => {
          if (data && data.attributes) {
            const vnum = data.attributes[CUSTOM_VOUCHER_KEY]
            if (!profile || !profile.voucherNumber || !profile.key) {
              console.error('Cannot verify profile voucher number because it is missing.')
              resolve(false)
              return
            }
            // counselor account
            if (!vnum) {
              resolve(profile.key.indexOf(profile.voucherNumber) > -1)
            } else {
              // client account; verify Cognito voucher number matches profile voucher and key
              resolve(profile.voucherNumber === vnum && profile.key.indexOf(vnum) > -1)
            }
          } else if (profile.voucherNumber === ANONYMOUS_USERNAME) {
            // anonymous login has no current user data
            resolve(profile.key.indexOf(profile.voucherNumber) > -1)
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
        if (!profile) {
          console.log('clear local profile')
          storeConfig(PROFILE_CONFIG_KEY, null)
          this.props.store.dispatch({type: 'set profile', payload: null})
          if (this.state.authData && this.state.authData.attributes &&
              this.state.authData.attributes[CUSTOM_VOUCHER_KEY]) {
            // logout user if client deleted their own account
            // A new, blank profile will be created on next login
            console.warn('log out client after deleting profile')
            this.logoutEcholocator(this.state.authData)
          }
          return
        }
        this.checkVoucherNumber(profile).then(isValid => {
          if (isValid) {
            storeConfig(PROFILE_CONFIG_KEY, profile)
            this.props.store.dispatch({type: 'set profile', payload: profile})
          } else if (profile) {
            console.error('Cannot change user profile; voucher number does not match.')
          }
          resolve(isValid)
        })
      })
    }

    // Fetch profile from S3 and set it in local storage
    fetchAndSetProfile (key: string, email: string): Promise<boolean> {
      return new Promise((resolve, reject) => {
        Storage.get(key, {download: true, expires: 60}).then(s3Result => {
          const text = s3Result.Body.toString('utf-8')
          const profile: AccountProfile = JSON.parse(text)
          // Ensure profile key always matches S3 key
          // In case it has been copied from a counselor-created profile,
          // it might not yet.
          // Also check that the email address is set.
          const needsChanges = (profile.key !== key) || (profile.clientEmail !== email)
          if (profile.key !== key) {
            console.warn('Correcting profile key')
            profile.key = key
          } else if (profile.clientEmail !== email) {
            console.warn('Correcting profile email')
            profile.clientEmail = email
            profile.clientInviteSent = true // User re-created their own profile
          }
          if (needsChanges) {
            Storage.put(key, JSON.stringify(profile)).then(saveResult => {
              // Do not resolve here, but in user profile change below
            }).catch(saveError => {
              console.error('Failed to update profile key on S3')
              console.error(saveError)
            })
          }
          this.changeUserProfile(profile).then(didChange => {
            if (didChange) {
              // Skip profile page and go to map if profile exists and has destinations set
              const destination = profile && profile.destinations &&
                profile.destinations.length ? '/map' : '/profile'
              this.props.history.push({pathname: destination, state: {fromApp: true}})
              resolve(true)
            } else {
              // Failed to set profile
              console.error('Failed to set user profile')
              resolve(false)
            }
          })
        }).catch(err => {
          console.warn('Failed to fetch profile from S3 at ' + key)
          reject(err)
        })
      })
    }

    // Get the profile from S3 for the currently logged-in user,
    // or create them a new, blank profile and put it on S3.
    goToClientProfile (voucher: string, email: string): Promise<boolean> {
      return new Promise((resolve, reject) => {
        Auth.currentUserInfo().then(data => {
          const identityId = data.id
          const key = `${voucher}_${identityId}`
          this.fetchAndSetProfile(key, email).then(fetchAndSetWorked => {
            resolve(fetchAndSetWorked)
          }).catch(err => {
            // If file not found, client users only get `AccessDenied`
            // because they do not have list bucket permissions
            if (err.code === 'AccessDenied') {
              console.error('Failed to get key found on s3: ' + key)
              // Hit API endpoint to handle getting counselor-created profile
              // First have to use `Auth.currentUserInfo` to get Identity ID
              this.setClientProfile(identityId, email, voucher).then(itWorked => {
                if (!itWorked) {
                  console.warn('Failed to setClientProfile')
                  resolve(false)
                } else {
                  // retry s3 get; now it should exist
                  this.fetchAndSetProfile(key, email).then(retryWorked => {
                    resolve(retryWorked)
                  }).catch(retryErr => {
                    // Shouldn't happen
                    console.error('Failed to get S3 profile after setting it')
                    console.error(retryErr)
                    resolve(false)
                  })
                }
              })
            } else {
              console.error(err.code)
              console.error('Failed to fetch account profile from S3 for key ' + key)
              console.error(err)
              resolve(false)
            }
          })
        }).catch(err => {
          console.error('Failed to fetch user info for identity ID')
          console.error(err)
          resolve(false)
        })
      })
    }

    setClientProfile (identityId: string, email: string, voucher: string): Promise<boolean> {
      return new Promise((resolve, reject) => {
        API.post(AMPLIFY_API_NAME, '/profiles', {
          body: {
            identityId,
            email
          }
        }).then(response => {
          if (response.error) {
            if (response.error === 'No profiles found on S3 for voucher') {
              // There is no counselor-created profile to edit, so
              // make a default profile.
              const key = `${voucher}_${identityId}`
              storeDefaultProfile(voucher, key).then(s3PutResult => {
                resolve(true)
              }).catch(s3PutError => {
                console.error('Failed to store default profile to s3')
                console.error(s3PutError)
                resolve(false)
              })
            } else if (response.error.indexOf('Profile exists for another email') === 0) {
              // Profile for this user voucher number exists for another user.
              // The login account for this user has just been deleted; log out.
              console.error('Email mismatch on profile. User account deleted.')
              resolve(false)
            } else {
              console.error('Failed to POST to profiles API')
              console.error(response)
              resolve(false)
            }
          } else {
            resolve(true)
          }
        }).catch(err => {
          console.error('Profile API call failed')
          console.error(err)
          resolve(false)
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

    handleUserSignIn (state: string, data: any) {
      const email = data.attributes.email
      LogRocket.identify(email)
      const voucher = data.attributes[CUSTOM_VOUCHER_KEY]
      const groups = data.signInUserSession && data.signInUserSession.idToken
        ? data.signInUserSession.idToken.payload['cognito:groups'] : []

      if (groups && groups.length > 0 && groups.indexOf('counselors') > -1) {
        // Set a convenience property for group membership
        data.counselor = true
        this.setState({authState: state, authData: data})
      } else if (voucher) {
        // attempt to go to client profile directly
        this.goToClientProfile(voucher, email).then(succeeded => {
          if (succeeded) {
            this.setState({authState: state, authData: data})
          } else {
            console.warn('Failed to load client profile; logging out')
            this.logoutEcholocator(this.state.authData)
          }
        })
      } else {
        // Shouldn't happen
        console.error('User logged in who is not a counselor and has no voucher set')
        this.setState({authState: state, authData: data})
      }
    }

    handleAuthStateChange (state: string, data: any) {
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
          this.handleUserSignIn(state, data)
        } else {
          // On user's first login, auth data user attributes are not set.
          // Fetch user data, then handle the login.
          console.warn('signed in with no data', data)
          Auth.currentAuthenticatedUser({bypassCache: true}).then(userData => {
            this.handleUserSignIn(state, userData)
          }).catch(userDataErr => {
            console.error('Failed to get user data for new user login')
            console.error(userDataErr)
            this.setState({authState: state, authData: data})
          })
        }
      } else {
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
                setLanguage={this.setLanguage}
              /> : null
            }
            <Comp
              {...this.props}
              authState={authState}
              authData={authData}
              changeUserProfile={this.changeUserProfile}
              userProfile={userProfile}
              onStateChange={this.handleAuthStateChange}
              language={this.state.language}
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
