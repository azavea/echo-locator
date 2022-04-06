// @flow
import { Component, Fragment } from 'react'
import LogRocket from 'logrocket'

import {ANONYMOUS_USERNAME, PROFILE_CONFIG_KEY} from '../constants'
import {storeConfig} from '../config'

import CustomSignIn from './custom-sign-in'
import CustomHeaderBar from './custom-header-bar'

export default function anonymousAuthenticator (Comp) {
  return class extends Component {
    constructor (props) {
      super(props)

      this.handleAnonymousLogin = this.handleAnonymousLogin.bind(this)
      this.handleProfileChange = this.handleProfileChange.bind(this)
    }

    handleProfileChange (profile: AccountProfile) {
      storeConfig(PROFILE_CONFIG_KEY, profile)
      this.props.store.dispatch({type: 'set profile', payload: profile})
    }

    handleAnonymousLogin () {
      const anonymousProfile: AccountProfile = {
        destinations: [],
        hasVehicle: false,
        headOfHousehold: ANONYMOUS_USERNAME,
        key: ANONYMOUS_USERNAME,
        rooms: 0,
        voucherNumber: ANONYMOUS_USERNAME
      }
      LogRocket.identify()
      this.handleProfileChange(anonymousProfile)
    }

    render () {
      const userProfile = this.props.data.userProfile

      if (userProfile) {
        return (
          <Fragment>
            {
              <CustomHeaderBar
                userProfile={userProfile}
                handleAuthChange={this.handleAnonymousLogin}
                handleProfileChange={this.handleProfileChange}
              />
            }
            <Comp
              {...this.props}
              userProfile={userProfile}
              handleAuthChange={this.handleAnonymousLogin}
              handleProfileChange={this.handleProfileChange}
            />
          </Fragment>
        )
      }

      return (
        <CustomSignIn
          {...this.props}
          handleAuthChange={this.handleAnonymousLogin}
        />
      )
    }
  }
}
