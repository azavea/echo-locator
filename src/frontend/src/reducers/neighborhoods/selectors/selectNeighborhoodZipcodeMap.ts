import get from "lodash/get";

import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "src/store/store";
import {
    selectAllNetworksDataReady,
    selectUseTransit,
} from "src/reducers/networks/networksSlice";
import type { NeighborhoodDetails } from "../types";
import { createNeighborhoodCommutes } from "../utils/createNeighborhoodCommutes";

export default createSelector(
    [
        selectAllNetworksDataReady,
        selectUseTransit,
        (state: RootState) => get(state, "neighborhoods.neighborhoods"),
        (state: RootState) => get(state, "networks.timesAndRoutesData"),
        (state: RootState) => get(state, "userProfile.destinations"),
        (state: RootState) => get(state, "userProfile.useCommuterRail"),
    ],
    (
        networksReady,
        useTransit,
        neighborhoods,
        travelTimesAndRoutes,
        destinations,
        useCommuterRail
    ) => {
        if (!travelTimesAndRoutes || !networksReady || !neighborhoods) {
            return {};
        }

        return neighborhoods.features.reduce(
            (neighborhoodDetailMap, neighborhood, index) => {
                const commuteMap = createNeighborhoodCommutes(
                    index,
                    travelTimesAndRoutes,
                    destinations,
                    useTransit,
                    useCommuterRail
                );
                const { id } = neighborhood.properties;
                neighborhoodDetailMap[id] = {
                    ...neighborhood.properties,
                    commutes: commuteMap,
                };
                return neighborhoodDetailMap;
            },
            {} as NeighborhoodDetails
        );
    }
);
