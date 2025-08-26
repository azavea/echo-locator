// Refactored from old codebase neighborhoodTravelTimes at commit 6f17e33

import lonlat from "@conveyal/lonlat";
import get from "lodash/get";
import { createSelector } from "@reduxjs/toolkit";
import { coordinateToIndex } from "reducers/networks/utils/coordinateToIndex";
import type { Neighborhoods } from "../types";
import type { RootState } from "store/store";
import type {
    NetworkModeOptions,
    Networks,
    LonLat,
} from "reducers/networks/types";
import { selectAllNetworksDataReady } from "src/reducers/networks/networksSlice";

// Derives neighborhood travel times for all networks, assigned by network key
// Used to generate active network travel time for ranking and range travel times for display

export default createSelector(
    [
        (state: RootState) => get(state, "networks.networks"),
        (state: RootState) => get(state, "neighborhoods.neighborhoods"),
        (state: RootState) => get(state, "networks.origin"),
        selectAllNetworksDataReady,
    ],
    (
        networks: Networks | null,
        neighborhoods: Neighborhoods | null,
        origin: LonLat | null,
        networksReady
    ) => {
        if (!networks || !networksReady || !origin || !neighborhoods) {
            return [];
        }
        return neighborhoods.features.map(neighborhood => {
            return Object.entries(networks).reduce(
                (travelTimesByNetwork, [key, network]) => {
                    const surface = network.travelTimeSurface;
                    const idx = coordinateToIndex(
                        network,
                        lonlat(neighborhood.geometry.coordinates)
                    );
                    travelTimesByNetwork[key as NetworkModeOptions] =
                        surface?.data ? surface.data[idx] : 0;
                    return travelTimesByNetwork;
                },
                {} as { [key in NetworkModeOptions]: any }
            );
        });
    }
);
