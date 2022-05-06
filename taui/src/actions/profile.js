// @flow
import axios from 'axios'

import {retrieveConfig, storeConfig} from '../config'
import {PROFILE_CONFIG_KEY} from '../constants'

import {addActionLogItem} from './log'

export const loadProfile = () => (dispatch, getState) => {
  try {
    dispatch({type: 'set profile loading', payload: true})
    const json = retrieveConfig(PROFILE_CONFIG_KEY)
    dispatch({type: 'set profile', payload: json})
    return json
  } catch (e) {
    console.error('Error parsing localStorage configuration ' + PROFILE_CONFIG_KEY, e)
  }

  return {}
}

export const setProfile = (profile) => (dispatch, getState) => {
  try {
    addActionLogItem(`Updating currently selected account profile to  ${profile}`)
    storeConfig(PROFILE_CONFIG_KEY, profile)
    dispatch({type: 'set profile', payload: profile})
  } catch (e) {
    console.error('Error parsing localStorage configuration ' + PROFILE_CONFIG_KEY, e)
  }
}

export const sendLoginLink = (email) => (dispatch, getState) => {
  addActionLogItem(`Sending login link to ${email}`)
  axios.post('/api/login/', {
    email: email
  }
  )
  dispatch({type: 'set login message', payload: 'SignIn.LoginLinkSent'})
}

export const setAuthToken = (authToken) => (dispatch, getState) => {
  addActionLogItem('Updating authToken')
  axios.get(`/api/user/`, {
    headers: {
      'Authorization': `Token ${authToken}`
    }
  })
    .then((response) => {
      dispatch({type: 'set auth token', payload: authToken})
      dispatch({type: 'set profile', payload: response.data})
    })
    .catch((error) => {
      console.error('Error fetching user profile', error)
      dispatch({type: 'set login message', payload: 'SignIn.NoProfileFound'})
    })
}

export const setLoginMessage = (loginMessage) => (dispatch, getState) => {
  try {
    dispatch({type: 'set login message', payload: loginMessage})
  } catch (e) {
    console.error('Error updating login message', e)
  }
}
