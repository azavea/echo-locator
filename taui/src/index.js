// @flow
import Amplify from 'aws-amplify'
import message from '@conveyal/woonerf/message'
import mount from '@conveyal/woonerf/mount'
import get from 'lodash/get'
import React from 'react'
import { connect } from 'react-redux'
import { BrowserRouter, withRouter } from 'react-router-dom'
import {
  SignIn,
  withAuthenticator
} from 'aws-amplify-react'

import actions from './actions'
import awsmobile from './aws-exports'
import Application from './components/application'
import CustomSignIn from './components/custom-sign-in'
import reducers from './reducers'
import * as select from './selectors'

// Set the title
document.title = message('Title')

// configure authentication
Amplify.configure(awsmobile)

function mapStateToProps (state, ownProps) {
  return {
    ...state,
    accessibility: select.accessibility(state, ownProps),
    activeNetworkIndex: select.activeNetworkIndex(state, ownProps),
    // activeTransitive: select.activeTransitive(state, ownProps),
    allTransitiveData: select.allTransitiveData(state, ownProps),
    drawOpportunityDatasets: select.drawOpportunityDatasets(state, ownProps),
    drawRoutes: select.drawRoutes(state, ownProps),
    // drawIsochrones: select.drawIsochrones(state, ownProps),
    isochrones: select.isochrones(state, ownProps),
    isLoading: select.loading(state, ownProps),
    neighborhoods: get(state, 'data.neighborhoods'),
    neighborhoodBounds: get(state, 'data.neighborhoodBounds'),
    pointsOfInterest: get(state, 'data.pointsOfInterest'),
    pointsOfInterestOptions: select.pointsOfInterestOptions(state, ownProps),
    showComparison: select.showComparison(state, ownProps),
    travelTimes: select.travelTimes(state, ownProps),
    uniqueRoutes: select.uniqueRoutes(state, ownProps)
  }
}

const CustomAuthenticatorTheme = {
  formContainer: {'margin': '0'},
  sectionFooter: {'display': 'block'},
  button: {'backgroundColor': 'var(--blue)', 'width': '100%'}
}

const ConnectedApplication = withAuthenticator(withRouter(
  connect(mapStateToProps, actions)(Application)), true, [<CustomSignIn override={SignIn} />], null, CustomAuthenticatorTheme)

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
