// @flow
import find from 'lodash/find'

export default function getActiveNeighborhood (neighborhoods, activeNeighborhoodId) {
  var result
  if (activeNeighborhoodId) {
    result = find(neighborhoods, n => n.properties.id === activeNeighborhoodId)
  }
  if (!result && neighborhoods && neighborhoods.length) {
    result = neighborhoods[0] // default to first neighborhood
  }
  return result
}
