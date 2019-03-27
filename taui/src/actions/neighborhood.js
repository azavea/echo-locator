// @flow
import {addActionLogItem} from './log'

export const setActiveNeighborhood = (neighborhood) => (dispatch, getState) => {
  addActionLogItem(`Updating currently selected neighborhood to ${neighborhood}`)
  dispatch({type: 'set active neighborhood', payload: neighborhood})
}

export const setShowDetails = (show) => (dispatch, getState) => {
  addActionLogItem(`Set show neighborhood details to ${show}`)
  dispatch({type: 'set show details', payload: !!show})
}
