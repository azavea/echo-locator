// @flow
import { Component, Fragment } from 'react'
import LogRocket from 'logrocket'
import Cookies from 'js-cookie'
import axios from 'axios'

import {ANONYMOUS_USERNAME} from '../constants'

import CustomSignIn from './custom-sign-in'
import CustomHeaderBar from './custom-header-bar'

export default function Authenticator (Comp) {
  return class extends Component {
    constructor (props) {
      super(props)

      this.state = {authToken: Cookies.get('auth_token') ? `Token ${Cookies.get('auth_token')}` : null}

      this.handleAuthChange = this.handleAuthChange.bind(this)

      // Load the selected user profile from localStorage, if any
      this.props.loadProfile()
    }

    handleAuthChange (profile: AccountProfile) {
      const userProfile = this.props.data.userProfile
      if (!this.state.authToken && !userProfile) {
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

      if (this.state.authToken) {
        axios.get(`/api/user/`, {
          headers: {
            'Authorization': this.state.authToken
          }
        })
          .then((response) => {
            console.log(response)
          })
      }

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
