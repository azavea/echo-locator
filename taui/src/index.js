// @flow
import API from '@aws-amplify/api'
import Auth from '@aws-amplify/auth'
import Storage from '@aws-amplify/storage'
import message from '@conveyal/woonerf/message'
import mount from '@conveyal/woonerf/mount'
import get from 'lodash/get'
import LogRocket from 'logrocket'
import React from 'react'
import ReactGA from 'react-ga'
import { connect } from 'react-redux'
import { BrowserRouter, withRouter } from 'react-router-dom'
import {
  ConfirmSignIn,
  ConfirmSignUp,
  ForgotPassword,
  Loading,
  RequireNewPassword,
  SignIn,
  TOTPSetup,
  VerifyContact
} from 'aws-amplify-react/dist/Auth'

import actions from './actions'
import awsmobile from './aws-exports'
import { CustomAuthenticatorTheme } from './amplify-theme'
import Application from './components/application'
import CustomSignIn from './components/custom-sign-in'
import withAuthenticator from './components/with-authenticator'
import withTracker from './components/with-tracker'
import reducers from './reducers'
import * as select from './selectors'
import 'focus-visible'

import './sass/main.scss'
import './taui.css'

// Set the title
document.title = message('Title')

// configure Amplify resources (API, Cognito authentication, and S3 storage)
API.configure({endpoints: awsmobile['aws_cloud_logic_custom']})
Auth.configure(awsmobile)
Storage.configure(awsmobile)

// configure LogRocket for error, activity tracking
if (process.env.LOGROCKET_APP_ID) {
  LogRocket.init(process.env.LOGROCKET_APP_ID, {
    network: {
      isEnabled: false
    },
    console: {
      isEnabled: {
        log: false,
        debug: false,
        info: false,
        warn: true,
        error: true
      }
    },
    release: process.env.LOGROCKET_RELEASE
  })
}

// configure Google Analytics
if (process.env.GOOGLE_ANALYTICS_ID) {
  ReactGA.initialize(process.env.GOOGLE_ANALYTICS_ID)
}

function mapStateToProps (state, ownProps) {
  return {
    ...state,
    accessibility: select.accessibility(state, ownProps),
    activeNetworkIndex: select.activeNetworkIndex(state, ownProps),
    activeNeighborhoodBounds: select.activeNeighborhoodBounds(state, ownProps),
    detailNeighborhood: select.detailNeighborhood(state, ownProps),
    displayPageNeighborhoods: select.displayPageNeighborhoods(state, ownProps),
    drawNeighborhoodRoute: select.drawNeighborhoodRoute(state, ownProps),
    drawOpportunityDatasets: select.drawOpportunityDatasets(state, ownProps),
    haveAnotherPage: select.haveAnotherPage(state, ownProps),
    isLoading: select.loading(state, ownProps),
    neighborhoods: get(state, 'data.neighborhoods'),
    neighborhoodBounds: get(state, 'data.neighborhoodBounds'),
    neighborhoodBoundsExtent: select.neighborhoodBoundsExtent(state, ownProps),
    neighborhoodRoutes: select.neighborhoodRoutes(state, ownProps),
    neighborhoodsSortedWithRoutes: select.neighborhoodsSortedWithRoutes(state, ownProps),
    neighborhoodTravelTimes: select.neighborhoodTravelTimes(state, ownProps),
    page: select.page(state, ownProps),
    pageEndingOffset: select.pageEndingOffset(state, ownProps),
    pointsOfInterest: get(state, 'data.pointsOfInterest'),
    pointsOfInterestOptions: select.pointsOfInterestOptions(state, ownProps),
    routableNeighborhoodCount: select.routableNeighborhoodCount(state, ownProps),
    routableNeighborhoods: select.routableNeighborhoods(state, ownProps),
    showComparison: select.showComparison(state, ownProps),
    travelTimes: select.travelTimes(state, ownProps),
    userProfile: select.userProfile(state, ownProps)
  }
}

const ConnectedApplication = withRouter(withTracker(connect(mapStateToProps, actions)(
  withAuthenticator(Application, true, [
    <CustomSignIn override={SignIn} />,
    <ConfirmSignIn />,
    <ConfirmSignUp />,
    <ForgotPassword />,
    <Loading />,
    <RequireNewPassword />,
    <TOTPSetup />,
    <VerifyContact />
  ], null, CustomAuthenticatorTheme))))

// Create an Application wrapper
class InitializationWrapper extends React.Component {
  constructor (props) {
    super(props)

    if (window) {
      window.app = {
        action: {},
        select: {},
        store: props.store
      }

      Object.keys(actions).forEach(key => {
        window.app.action[key] = (...args) =>
          props.store.dispatch(actions[key](...args))
      })

      Object.keys(select).forEach(key => {
        window.app.select[key] = () => select[key](props.store.getState())
      })
    }
  }

  render () {
    const props = this.props
    return <BrowserRouter>
      <ConnectedApplication {...props} />
    </BrowserRouter>
  }
}

// Mount the app
mount({
  app: InitializationWrapper,
  reducers
})
