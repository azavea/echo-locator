import { createSelector, createSlice } from "@reduxjs/toolkit";

import { getUserProfile } from "reducers/userProfile/userProfileThunk";
import type { RootState } from "store/store";
import {
    getAllTimesAndPathsData,
    getNetworks,
    getTimesAndPathsDataForPlace,
} from "./networksThunk";
import type { NetworksSliceState } from "./types";

import { NetworkModeOptions, type NetworkModeOptionKey } from "src/enums";

const initialState: NetworksSliceState = {
    networks: null,
    timesAndRoutesData: null,
    // Default to use first transit network with commuter rail
    activeMode: "peak",
    loading: false,
    error: null,
};

export const networksSlice = createSlice({
    name: "networks",
    initialState,
    reducers: {
        setActiveMode: (
            state,
            { payload: mode }: { payload: NetworkModeOptionKey }
        ) => {
            state.activeMode = mode;
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
            .addCase(getTimesAndPathsDataForPlace.pending, state => {
                state.loading = true;
            })
            .addCase(
                getTimesAndPathsDataForPlace.fulfilled,
                (state, action) => {
                    state.loading = false;
                    state.timesAndRoutesData = {
                        ...state.timesAndRoutesData,
                        [action.payload.label]: action.payload.data,
                    };
                }
            )
            .addCase(getTimesAndPathsDataForPlace.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.error.message ??
                    "Failed to fetch time and paths data.";
            })
            .addCase(getAllTimesAndPathsData.pending, state => {
                state.loading = true;
            })
            .addCase(getAllTimesAndPathsData.fulfilled, (state, action) => {
                state.loading = false;
                state.timesAndRoutesData = action.payload;
            })
            .addCase(getAllTimesAndPathsData.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.error.message ??
                    "Failed to fetch all times and paths data.";
            })
            .addCase(getUserProfile.fulfilled, (state, action) => {
                // TODO: active mode needs to depend on a third variable
                // https://github.com/azavea/echo-locator/issues/728
                state.activeMode = action.payload.hasVehicle
                    ? (NetworkModeOptions.car as NetworkModeOptionKey)
                    : action.payload.useCommuterRail
                      ? (NetworkModeOptions.peak as NetworkModeOptionKey)
                      : (NetworkModeOptions.peakNoExpress as NetworkModeOptionKey);
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

export const selectUseTransit = createSelector(
    [(state: RootState) => state.networks.activeMode],
    activeMode => activeMode !== "car"
);
export const selectActiveMode = (state: RootState) => state.networks.activeMode;

export const { setActiveMode } = networksSlice.actions;

export default networksSlice.reducer;
