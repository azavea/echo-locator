// @flow
import {addActionLogItem} from './log'

export const setActiveNeighborhood = (neighborhood) => (dispatch, getState) => {
  addActionLogItem(`Updating currently selected neighborhood to ${neighborhood}`)
  dispatch({type: 'set active neighborhood', payload: neighborhood})
}

export const setDisplayNeighborhoods = (neighborhoods) => (dispatch, getState) => {
  addActionLogItem(`Updating currently displayed neighborhoods`)
  dispatch({type: 'set display neighborhoods', payload: neighborhoods})
}

export const setPage = (page) => (dispatch, getState) => {
  addActionLogItem(`Set neighborhood list display page`)
  dispatch({type: 'set page', payload: page})
}

export const setShowDetails = (show) => (dispatch, getState) => {
  addActionLogItem(`Set show neighborhood details to ${show}`)
  dispatch({type: 'set show details', payload: !!show})
}

export const setShowFavorites = (show) => (dispatch, getState) => {
  addActionLogItem(`Set show favorites to ${show}`)
  dispatch({type: 'set show favorites', payload: !!show})
}
