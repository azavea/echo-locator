// @flow
import get from "lodash/get";
import { createSelector } from "reselect";

export default createSelector(
  (state) => get(state, "data.activeNeighborhood"),
  (state) => get(state, "data.neighborhoodBounds"),
  (activeNeighborhood, neighborhoodBounds) => {
    if (!neighborhoodBounds || !activeNeighborhood) {
      return null;
    }
    // Return a GeoJSON feature collection with a single feature,
    // the MultiPolygon bounds for the currently active neighborhood.
    const geojson = Object.assign({}, neighborhoodBounds);
    geojson.features = [
      neighborhoodBounds.features.find((f) => f.properties.id === activeNeighborhood),
    ];
    return geojson;
  }
);
