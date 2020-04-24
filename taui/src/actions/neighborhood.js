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

export const setShowListings = (show) => (dispatch, getState) => {
  addActionLogItem(`Set show listings to ${show}`)
  dispatch({type: 'set show listings', payload: !!show})
}

export const setListingsLoading = (show) => (dispatch, getState) => {
  addActionLogItem(`Set listings loading to ${show}`)
  dispatch({type: 'set listings loading', payload: !!show})
}

export const setDataListings = (listingsArray) => (dispatch, getState) => {
  addActionLogItem(`Set datalistings to listings array`)
  dispatch({type: 'set datalistings', payload: listingsArray})
}

export const setShowFavorites = (show) => (dispatch, getState) => {
  addActionLogItem(`Set show favorites to ${show}`)
  dispatch({type: 'set show favorites', payload: !!show})
}
