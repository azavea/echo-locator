// @flow
import type {Location, LonLat} from '../types'

import {addActionLogItem} from './log'
import {
  fetchAllTimesAndPathsForCoordinate,
  setNetworksToLoading
} from './network'
import {reverseGeocode} from './geocode'

export const setEnd = (end: any) => {
  return {
    type: 'set end',
    payload: end
  }
}

export const setStart = (start: any) => {
  return {
    type: 'set start',
    payload: start
  }
}

export const updateOrigin = (value?: Location, network?: string) =>
  value && value.label && value.position && network
    ? [
      setNetworksToLoading(),
      addActionLogItem(`Updating origin to ${value.label} for network ${network}`),
      setStart(value),
      fetchAllTimesAndPathsForCoordinate(value.position)
    ]
    : [
      addActionLogItem('Clearing origin'),
      setStart()
    ]

/**
 * Update the start
 */
export const updateStart = (value?: Location) =>
  value && value.label && value.position
    ? [
      setNetworksToLoading(),
      addActionLogItem(`Updating start to ${value.label}`),
      setStart(value),
      fetchAllTimesAndPathsForCoordinate(value.position)
    ]
    : [
      addActionLogItem('Clearing start'),
      setStart()
    ]

export const updateStartPosition = (position: LonLat) => [
  reverseGeocode(position, features =>
    setStart({position, label: features[0].place_name})
  ),
  fetchAllTimesAndPathsForCoordinate(position)
]

/**
 * Update the end point
 */
export const updateEnd = (value?: Location) => [
  addActionLogItem(value ? `Updating end to ${value.label}` : 'Clearing end'),
  setEnd(value)
]

export const updateEndPosition = (position: LonLat) =>
  reverseGeocode(position, features =>
    setEnd({position, label: features[0].place_name})
  )
