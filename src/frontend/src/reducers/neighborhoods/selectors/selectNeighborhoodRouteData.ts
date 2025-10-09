import findIndex from "lodash/findIndex";
import get from "lodash/get";
import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "store/store";
import { selectAllNetworksDataReady } from "src/reducers/networks/networksSlice";
import type { Destination } from "src/reducers/userProfile/types";
import type { NeighborhoodRoutePath } from "src/reducers/networks/types";

export const makeSelectPathToNeighborhood = (
    destination: Destination,
    neighborhoodZipcode: string
) => {
    return createSelector(
        [
            (state: RootState) => get(state, "networks.activeMode"),
            (state: RootState) => get(state, "networks.timesAndRoutesData"),
            selectAllNetworksDataReady,
        ],
        (activeNetworkMode, travelTimesAndRoutes, networksReady) => {
            if (
                !travelTimesAndRoutes ||
                !networksReady ||
                !neighborhoodZipcode ||
                !destination
            ) {
                return [];
            }

            const { routesByNeighborhood } =
                travelTimesAndRoutes[destination.location.label][
                    activeNetworkMode
                ];

            const index = findIndex(
                routesByNeighborhood,
                route => route.id === neighborhoodZipcode
            );
            if (index === -1) {
                return [];
            }

            const transitive = routesByNeighborhood[index];
            // Don't return path directions for alternative routes
            const allSegments: NeighborhoodRoutePath = get(
                transitive,
                "segments[0]",
                []
            );
            return [...allSegments];
        }
    );
};
