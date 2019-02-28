// @flow
import { Greetings } from 'aws-amplify-react/dist/Auth'
import {
  NavBar,
  Nav,
  NavItem
} from 'aws-amplify-react/dist/Amplify-UI/Amplify-UI-Components-React'
import AmplifyTheme from 'aws-amplify-react/dist/Amplify-UI/Amplify-UI-Theme'
import message from '@conveyal/woonerf/message'
import React from 'react'

import type {AccountProfile} from '../types'

export default class CustomHeaderBar extends Greetings {
  componentDidMount () {
    super.componentDidMount()
  }

  getUserName () {
    const user = this.props.authData
    // get name from attributes first
    const nameFromAttr = user.attributes
      ? (user.attributes.name ||
      (user.attributes.given_name
        ? (user.attributes.given_name + ' ' + user.attributes.family_name) : undefined))
      : undefined
    return nameFromAttr || user.name || user.username
  }

  // based on:
  // https://github.com/aws-amplify/amplify-js/blob/master/packages/aws-amplify-react/src/Auth/Greetings.jsx#L131
  render () {
    const authState = this.props.authState || this.state.authState
    const signedIn = (authState === 'signedIn')
    if (!signedIn) { return null }
    const theme = this.props.theme || AmplifyTheme
    const userProfile: AccountProfile = this.props.userProfile || this.state.userProfile

    return (
      <NavBar theme={theme}>
        <Nav theme={theme}>
          <NavItem theme={theme}>
            <div className='LogoNavbar'>
              <span className='TitleNavbar'>{message('Title')}</span>
            </div>
          </NavItem>
          {userProfile && <NavItem theme={theme}>{userProfile.headOfHousehold}</NavItem>}
          <NavItem theme={theme}>{this.renderSignOutButton(theme)}</NavItem>
        </Nav>
      </NavBar>
    )
  }
}
