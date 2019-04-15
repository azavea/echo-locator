// @flow
import find from 'lodash/find'

export default function getNeighborhoodById (neighborhoods, neighborhoodId) {
  return find(neighborhoods, n => n.properties.id === neighborhoodId)
}
