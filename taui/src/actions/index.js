// @flow
import * as geocode from './geocode'
import * as grid from './grid'
import * as location from './location'
import * as log from './log'
import * as map from './map'
import * as network from './network'
import * as profile from './profile'

const setSelectedTimeCutoff = (payload: number) => ({
  type: 'set selected time cutoff',
  payload
})

export default {
  ...geocode,
  ...grid,
  ...location,
  ...log,
  ...map,
  ...network,
  ...profile,
  setSelectedTimeCutoff
}
