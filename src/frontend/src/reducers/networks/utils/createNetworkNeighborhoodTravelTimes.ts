// Refactored from old codebase neighborhoodTravelTimes at commit 6f17e33
import lonlat from "@conveyal/lonlat";
import { coordinateToIndex } from "./coordinateToIndex";
import type { Neighborhoods } from "reducers/neighborhoods/types";
import type { NetworkAndTimeAndPathsData } from "../types";

// Derives neighborhood travel times
// Used to generate active network travel time for ranking and range travel times for display

export default function createNeighborhoodTravelTimes(
    network: NetworkAndTimeAndPathsData,
    neighborhoods: Neighborhoods
): number[] {
    return neighborhoods.features.map(neighborhood => {
        const surface = network.travelTimeSurface;
        if (!surface?.data) return 0;
        const idx = coordinateToIndex(
            network,
            lonlat(neighborhood.geometry.coordinates)
        );
        return surface.data[idx];
    });
}
