// @flow
import get from "lodash/get";
import { createSelector } from "reselect";

import getNeighborhoodById from "../utils/get-neighborhood";

import neighborhoodsSortedWithRoutes from "./neighborhoods-sorted-with-routes";

// Returns current active neighborhood
export default createSelector(
  (state) => get(state, "data.activeNeighborhood"),
  neighborhoodsSortedWithRoutes,
  (activeNeighborhood, neighborhoods) => {
    return neighborhoods && getNeighborhoodById(neighborhoods, activeNeighborhood);
  }
);
