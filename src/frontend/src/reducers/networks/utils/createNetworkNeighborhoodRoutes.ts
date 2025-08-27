// Refactored from old codebase at latest commit before introducing listings: 8ca3b94
// New code copied from latest Taui v3 to support routes with MapLibre
// ATTR: Taui by Conveyal, included under the MIT license (https://github.com/conveyal/taui/blob/dev/LICENSE)

import lonlat from "@conveyal/lonlat";
import memoize from "lodash/memoize";

import type { Neighborhoods } from "reducers/neighborhoods/types";
import type {
    Location,
    LonLat,
    NeighborhoodRoutePaths,
    NeighborhoodRoutes,
    NetworkAndTimeAndPathsData,
} from "reducers/networks/types";
import createTransitiveRoutes from "./createTransitiveRoutes";

/**
 * This assumes loaded query, paths, and targets.
 */
const memoizedTransitiveRoutes = memoize(
    (
        n: NetworkAndTimeAndPathsData,
        _i: number,
        s: Location,
        e: Location
    ): NeighborhoodRoutePaths => createTransitiveRoutes(n, s, e),
    (n, i, s, e) =>
        `${n.name}-${i}-${lonlat(s.position).toString()}-${lonlat(e.position).toString()}`
);

const createNetworkNeighborhoodRoutes = (
    network: NetworkAndTimeAndPathsData,
    start: LonLat,
    neighborhoods: Neighborhoods
): NeighborhoodRoutes =>
    neighborhoods.features.reduce((routes, neighborhood, neighborhoodIndex) => {
        if (
            start &&
            neighborhood.geometry &&
            neighborhood.geometry.coordinates &&
            network.ready &&
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
                network,
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
        return routes;
    }, [] as NeighborhoodRoutes);

export default createNetworkNeighborhoodRoutes;
