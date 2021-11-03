// @flow
import * as geocode from './geocode'
import * as grid from './grid'
import * as listings from './listings'
import * as location from './location'
import * as log from './log'
import * as map from './map'
import * as neighborhood from './neighborhood'
import * as network from './network'
import * as profile from './profile'

const setSelectedTimeCutoff = (payload: number) => ({
  type: 'set selected time cutoff',
  payload
})

export default {
  ...geocode,
  ...grid,
  ...listings,
  ...location,
  ...log,
  ...map,
  ...neighborhood,
  ...network,
  ...profile,
  setSelectedTimeCutoff
}
