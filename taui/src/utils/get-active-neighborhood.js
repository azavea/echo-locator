// @flow
import find from 'lodash/find'

export default function getActiveNeighborhood (neighborhoods, activeNeighborhoodId) {
  return find(neighborhoods.features, n => n.properties.id === activeNeighborhoodId)
}
