// @flow
import lonlat from "@conveyal/lonlat";
import get from "lodash/get";
import { createSelector } from "reselect";

import { coordinateToIndex } from "../utils/coordinate-to-point";

import selectActiveNetworkIndex from "./active-network-index";
import selectTravelTimeSurfaces from "./travel-time-surfaces";

export default createSelector(
  selectActiveNetworkIndex,
  selectTravelTimeSurfaces,
  (state) => get(state, "data.networks"),
  (state) => get(state, "data.neighborhoods"),
  (state) => get(state, "data.origin"),
  (activeNetworkIndex, surfaces, networks, neighborhoods, origin) => {
    const network = networks[activeNetworkIndex];
    const surface = surfaces[activeNetworkIndex];
    if (!network || !network.ready || !surface || !origin) {
      return [];
    }
    return neighborhoods.features.map((neighborhood) => {
      const idx = coordinateToIndex(lonlat(neighborhood.geometry.coordinates), network);
      return surface.data[idx];
    });
  }
);
