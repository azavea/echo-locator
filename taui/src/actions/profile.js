// @flow
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
