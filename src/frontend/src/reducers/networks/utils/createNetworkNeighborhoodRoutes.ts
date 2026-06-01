// Refactored from old codebase at latest commit before introducing listings: 8ca3b94
// New code copied from latest Taui v3 to support routes with MapLibre
// ATTR: Taui by Conveyal, included under the MIT license (https://github.com/conveyal/taui/blob/dev/LICENSE)

import lonlat from "@conveyal/lonlat";

import type { Neighborhoods } from "reducers/neighborhoods/types";
import type {
    LonLat,
    NeighborhoodRoutes,
    NetworkAndTimeAndPathsData,
} from "reducers/networks/types";
import createTransitiveRoutes from "./createTransitiveRoutes";

const createNetworkNeighborhoodRoutes = (
    network: NetworkAndTimeAndPathsData,
    start: LonLat,
    neighborhoods: Neighborhoods
): NeighborhoodRoutes =>
    neighborhoods.features.reduce((routes, neighborhood) => {
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
            const result = createTransitiveRoutes(network, start_location, end);
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
