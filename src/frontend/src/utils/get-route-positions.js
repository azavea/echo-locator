// @flow
/* Return positions to create segments and stops in
drawNeighborhoodRoute and drawListingRoute selectors
*/
import polyline from "@mapbox/polyline";
import get from "lodash/get";

export function getSegmentPositions(segment, transitive) {
  if (segment.type === "WALK" || segment.type === "CAR")
    return getDirectLinePositions(segment, transitive);
  return getTransitPositions(segment, transitive);
}

function getDirectLinePositions(segment, transitive) {
  function ll(l) {
    if (l.place_id) {
      const p = transitive.places.find((p) => p.place_id === l.place_id);
      return [p.place_lat, p.place_lon];
    }
    const s = transitive.stops.find((s) => s.stop_id === l.stop_id);
    return [s.stop_lat, s.stop_lon];
  }
  return {
    type: segment.type,
    positions: [ll(segment.from), ll(segment.to)],
  };
}

function getTransitPositions(segment, transitive) {
  const p = transitive.patterns.find((p) => segment.pattern_id === p.pattern_id);
  const stops = p.stops.slice(segment.from_stop_index, segment.to_stop_index);
  const route = transitive.routes.find((r) => p.route_id === r.route_id);
  const routeColor = get(route, "route_color"); // could be null
  return {
    color: `#${routeColor || "333"}`,
    type: "TRANSIT",
    positions: stops.reduce((lls, s) => [...lls, ...polyline.decode(s.geometry)], []),
  };
}

export function getStopPositions(pid, sindex, transitive) {
  const p = transitive.patterns.find((p) => pid === p.pattern_id);
  const sid = p.stops[sindex].stop_id;
  const stop = transitive.stops.find((s) => sid === s.stop_id);
  return [stop.stop_lat, stop.stop_lon];
}
