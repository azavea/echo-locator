import { createSelector, createSlice } from "@reduxjs/toolkit";

import {
    getUserProfile,
    updateUserProfile,
} from "reducers/userProfile/userProfileThunk";
import { NetworkModeOptions } from "src/enums";
import type { RootState } from "store/store";
import { getAllTimesAndPathsData, getNetworks } from "./networksThunk";
import type { NetworksSliceState, TrafficType } from "./types";

import getActiveModeKey from "./utils/getActiveModeKey";

const initialState: NetworksSliceState = {
    networks: null,
    timesAndRoutesData: null,
    trafficConditions: "peak",
    // Default to use first transit network with commuter rail
    activeMode: "peak",
    loading: false,
    error: null,
};

export const networksSlice = createSlice({
    name: "networks",
    initialState,
    reducers: {
        setTrafficConditions: (
            state,
            { payload: mode }: { payload: TrafficType }
        ) => {
            state.trafficConditions = mode;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(getNetworks.pending, state => {
                state.loading = true;
            })
            .addCase(getNetworks.fulfilled, (state, action) => {
                state.loading = false;
                state.networks = action.payload;
            })
            .addCase(getNetworks.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.error.message ?? "Failed to fetch networks.";
            })
            .addCase(getAllTimesAndPathsData.pending, state => {
                state.loading = true;
            })
            .addCase(getAllTimesAndPathsData.fulfilled, (state, action) => {
                state.loading = false;
                state.timesAndRoutesData = state.timesAndRoutesData
                    ? {
                          ...state.timesAndRoutesData,
                          ...action.payload,
                      }
                    : action.payload;
            })
            .addCase(getAllTimesAndPathsData.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.error.message ??
                    "Failed to fetch all times and paths data.";
            })
            .addCase(getUserProfile.fulfilled, (state, action) => {
                state.activeMode = getActiveModeKey(
                    state.trafficConditions === NetworkModeOptions.peak,
                    action.payload.hasVehicle,
                    action.payload.useCommuterRail
                );
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.activeMode = getActiveModeKey(
                    state.trafficConditions === NetworkModeOptions.peak,
                    action.payload.hasVehicle,
                    action.payload.useCommuterRail
                );
                // Remove times and paths data for deleted destinations
                if (state.timesAndRoutesData) {
                    const newDestinationKeys = action.payload.destinations.map(
                        destination => destination.location.label
                    );
                    const cleanedTimesAndPathsData = Object.fromEntries(
                        Object.entries({ ...state.timesAndRoutesData }).filter(
                            ([key]) => newDestinationKeys.includes(key)
                        )
                    );
                    state.timesAndRoutesData = cleanedTimesAndPathsData;
                }
            });
    },
});

export const selectAllNetworksDataReady = createSelector(
    [
        (state: RootState) => state.networks.networks,
        (state: RootState) => state.networks.timesAndRoutesData,
    ],
    (networks, timesAndRoutesData) =>
        !!networks &&
        !!timesAndRoutesData &&
        Object.keys(timesAndRoutesData).length &&
        Object.values(networks).every(n => n.ready) &&
        Object.values(timesAndRoutesData).every(place =>
            Object.values(place).every(n => n.timesAndRoutesDataReady)
        )
);

export const selectInvalidTimesAndPathsData = createSelector(
    [(state: RootState) => state.networks.timesAndRoutesData],
    timesAndRoutesData =>
        timesAndRoutesData &&
        Object.keys(timesAndRoutesData).filter(key =>
            Object.values(timesAndRoutesData[key]).every(
                n => !n.timesAndRoutesDataReady
            )
        )
);

export const selectUseTransit = createSelector(
    [(state: RootState) => state.networks.activeMode],
    activeMode => activeMode !== "car"
);
export const selectActiveMode = (state: RootState) => state.networks.activeMode;
export const selectTrafficConditions = (state: RootState) =>
    state.networks.trafficConditions;

export const { setTrafficConditions } = networksSlice.actions;

export default networksSlice.reducer;
