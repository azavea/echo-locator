import findIndex from 'lodash/findIndex'
import get from 'lodash/get'
import {createSelector} from 'reselect'

import {STOP_STYLE, TRANSIT_STYLE, WALK_STYLE} from '../constants'
import {getSegmentPositions, getStopPositions} from '../utils/get-route-positions'

import selectNeighborhoodRoutes from './network-neighborhood-routes'

/**
 * NB: All positions are [latitude, longitude] as they go directly to Leaflet
 */
export default createSelector(
  state => get(state, 'data.activeNeighborhood'),
  state => get(state, 'data.userProfile'),
  selectNeighborhoodRoutes,
  (activeNeighborhood, profile, neighborhoodRoutes = []) => {
    if (!neighborhoodRoutes) {
      return null
    }
    const index = findIndex(neighborhoodRoutes, (route) => route.id === activeNeighborhood)
    if (index === -1) {
      return null
    }
    const transitive = neighborhoodRoutes[index]
    const applyStyle = {opacity: 1, fillOpacity: 1}
    const walkStyle = {...WALK_STYLE, ...applyStyle}
    const transitStyle = {...TRANSIT_STYLE, ...applyStyle}
    const stopStyle = {...STOP_STYLE, ...applyStyle}
    const allSegments = get(transitive, 'journeys[0].segments', [])
    // Remove final walk leg
    const segments = [...allSegments]
    profile && !profile.hasVehicle && segments.pop()
    return {
      index,
      id: transitive.id,
      label: transitive.label,
      segments: segments.map(s => getSegmentPositions(s, transitive)),
      stops: segments
        .filter(s => s.type === 'TRANSIT')
        .reduce((stops, s, i) => [
          ...stops,
          getStopPositions(s.pattern_id, s.from_stop_index, transitive),
          getStopPositions(s.pattern_id, s.to_stop_index, transitive)
        ], []),
      stopStyle,
      transitStyle,
      walkStyle
    }
  }
)
