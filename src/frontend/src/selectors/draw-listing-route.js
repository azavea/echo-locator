import get from "lodash/get";
import { createSelector } from "reselect";

import { STOP_STYLE, TRANSIT_STYLE, WALK_STYLE } from "../constants";
import { getSegmentPositions, getStopPositions } from "../utils/get-route-positions";

import selectListingRoute from "./network-listing-route";

/**
 * NB: All positions are [latitude, longitude] as they go directly to Leaflet
 */
export default createSelector(
  (state) => get(state, "data.userProfile"),
  selectListingRoute,
  (profile, listingRoute = {}) => {
    if (!listingRoute) {
      return null;
    }

    const applyStyle = { opacity: 1, fillOpacity: 1 };
    const walkStyle = { ...WALK_STYLE, ...applyStyle };
    const transitStyle = { ...TRANSIT_STYLE, ...applyStyle };
    const stopStyle = { ...STOP_STYLE, ...applyStyle };
    const segments = get(listingRoute, "journeys[0].segments", []);
    return {
      id: listingRoute.id,
      label: listingRoute.label,
      segments: segments.map((s) => getSegmentPositions(s, listingRoute)),
      stops: segments
        .filter((s) => s.type === "TRANSIT")
        .reduce(
          (stops, s) => [
            ...stops,
            getStopPositions(s.pattern_id, s.from_stop_index, listingRoute),
            getStopPositions(s.pattern_id, s.to_stop_index, listingRoute),
          ],
          []
        ),
      stopStyle,
      transitStyle,
      walkStyle,
    };
  }
);
