// @flow
import lonlat from "@conveyal/lonlat";
import get from "lodash/get";
import { createSelector } from "reselect";

import { memoizedTransitiveRoutes } from "../utils/memoize-routes";
import uniqueSegments from "../utils/make-unique-segments";

import selectActiveNetworkIndex from "./active-network-index";

export default createSelector(
  selectActiveNetworkIndex,
  (state) => get(state, "data.networks"),
  (state) => get(state, "data.origin"),
  (state) => get(state, "data.activeListing"),
  (state) => get(state, "data.userProfile"),
  (activeNetworkIndex, networks, start, destination, profile) => {
    const network = networks[activeNetworkIndex];
    if (!destination || !network) {
      return [];
    }

    if (
      start &&
      start.position &&
      destination &&
      destination.lat &&
      destination.lon &&
      network &&
      network.ready &&
      network.originPoint &&
      network.paths &&
      network.targets
    ) {
      const end = {
        label: "listing",
        position: lonlat([destination.lon, destination.lat]),
      };
      /* Similar to network-neighborhood-listings,
      except only one destination so only one route returned */
      const result = memoizedTransitiveRoutes(
        network,
        destination.id,
        start,
        end,
        profile.hasVehicle
      );
      return {
        id: destination.id,
        label: "listing", // not unique
        journeys: result.journeys,
        patterns: result.patterns,
        places: result.places,
        routes: result.routes,
        routeSegments: uniqueSegments(result.routeSegments),
        stops: result.stops,
      };
    } else {
      return {};
    }
  }
);
