// @flow
import { Component, Fragment } from 'react'
import LogRocket from 'logrocket'

import {ANONYMOUS_USERNAME} from '../constants'

import CustomSignIn from './custom-sign-in'
import CustomHeaderBar from './custom-header-bar'

export default function anonymousAuthenticator (Comp) {
  return class extends Component {
    constructor (props) {
      super(props)

      this.handleAuthChange = this.handleAuthChange.bind(this)

      // Load the selected user profile from localStorage, if any
      this.props.loadProfile()
    }

    handleAuthChange (profile: AccountProfile) {
      const userProfile = this.props.data.userProfile
      if (!userProfile) {
        profile = {
          destinations: [],
          hasVehicle: false,
          headOfHousehold: ANONYMOUS_USERNAME,
          key: ANONYMOUS_USERNAME,
          rooms: 0,
          voucherNumber: ANONYMOUS_USERNAME
        }
        LogRocket.identify()
      }
      this.props.setProfile(profile)
    }

    render () {
      const userProfile = this.props.data.userProfile

      if (userProfile) {
        return (
          <Fragment>
            {
              <CustomHeaderBar
                userProfile={userProfile}
                handleAuthChange={this.handleAuthChange}
              />
            }
            <Comp
              {...this.props}
              userProfile={userProfile}
              handleAuthChange={this.handleAuthChange}
            />
          </Fragment>
        )
      }

      return (
        <CustomSignIn
          {...this.props}
          handleAuthChange={this.handleAuthChange}
        />
      )
    }
  }
}
