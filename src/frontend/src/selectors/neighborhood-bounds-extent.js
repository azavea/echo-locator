// @flow
import bbox from "geojson-bbox";
import get from "lodash/get";
import { isEmpty } from "lodash";
import { createSelector } from "reselect";

export default createSelector(
  (state) => get(state, "data.neighborhoodBounds"),
  (neighborhoodBounds) => {
    if (isEmpty(neighborhoodBounds)) {
      return null;
    }
    // Get bounds to zoom to fit the neighborhood polygon map layer
    const bounds = bbox(neighborhoodBounds);
    // Build a Leaflet `Bounds` array from the geojson-bbox extent
    return [
      [bounds[1], bounds[0]],
      [bounds[3], bounds[2]],
    ];
  }
);
