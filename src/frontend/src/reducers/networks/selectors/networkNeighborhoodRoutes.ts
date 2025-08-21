// Copied from old codebase using latest commit before introducing listings: 8ca3b943a70039d7af1f41a6b825a106f6c5d23c

import lonlat from "@conveyal/lonlat";
import get from "lodash/get";
import memoize from "lodash/memoize";
import type { RootState } from "store/store";
import type { Neighborhoods } from "../../neighborhoods/types";
import type {
    NetworkModeOptions,
    Networks,
    originPoint,
    RoutableNetwork,
    Location,
    NeighborhoodRoutes,
    NeighborhoodRoutePaths,
} from "../types";
import { createSelector } from "@reduxjs/toolkit";
import createTransitiveRoutes from "../utils/createTransitiveRoutes";
import { selectAllNetworksDataReady } from "../networksSlice";

/**
 * This assumes loaded query, paths, and targets.
 */
const memoizedTransitiveRoutes = memoize(
    (
        n: RoutableNetwork,
        _i: number,
        s: Location,
        e: Location
    ): NeighborhoodRoutePaths => createTransitiveRoutes(n, s, e),
    (n, i, s, e) =>
        `${n.name}-${i}-${lonlat(s.position).toString()}-${lonlat(e.position).toString()}`
);

export default createSelector(
    [
        (state: RootState) => get(state, "networks.activeMode"),
        (state: RootState) => get(state, "networks.networks"),
        (state: RootState) => get(state, "networks.origin"),
        (state: RootState) => get(state, "neighborhoods.neighborhoods"),
        selectAllNetworksDataReady,
    ],
    (
        activeMode: NetworkModeOptions,
        networks: Networks | null,
        start: originPoint | null,
        neighborhoods: Neighborhoods | null,
        networksReady
    ) => {
        if (
            !neighborhoods ||
            !neighborhoods.features ||
            !neighborhoods.features.length ||
            !networks ||
            !activeMode ||
            !networksReady
        ) {
            return [];
        }

        const network = networks[activeMode];

        const routes: NeighborhoodRoutes = [];
        neighborhoods.features.map((neighborhood, neighborhoodIndex) => {
            if (
                start &&
                neighborhood.geometry &&
                neighborhood.geometry.coordinates &&
                network.ready &&
                network.timesAndPathsDataReady &&
                network.paths &&
                network.paths.length &&
                network.travelTimeSurface
            ) {
                const start_location = {
                    label: "start",
                    position: lonlat(start),
                };
                const end = {
                    label: neighborhood.properties.town,
                    position: lonlat(neighborhood.geometry.coordinates),
                };
                const result = memoizedTransitiveRoutes(
                    network as RoutableNetwork,
                    neighborhoodIndex,
                    start_location,
                    end
                );
                routes.push({
                    id: neighborhood.properties.id,
                    label: neighborhood.properties.town, // not unique
                    start: start_location,
                    end: end,
                    segments: result,
                });
            } else {
                return [];
            }
        });
        return routes;
    }
);
