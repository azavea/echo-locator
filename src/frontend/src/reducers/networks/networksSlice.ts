import { createSelector, createSlice } from "@reduxjs/toolkit";
import type { NetworksSliceState } from "./types";
import { getTimesAndPathsDataForPlace, getNetworks } from "./networksThunk";
import type { RootState } from "src/store/store";
import type { NetworkModeOptionKey } from "src/enums";

const initialState: NetworksSliceState = {
    networks: null,
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
                    if (
                        state.timesAndRoutesData &&
                        state.timesAndRoutesData?.hasOwnProperty(
                            action.payload.place
                        )
                    ) {
                        state.timesAndRoutesData[action.payload.place] = {
                            ...state.timesAndRoutesData[action.payload.place],
                            ...action.payload.data,
                        };
                    } else {
                        state.timesAndRoutesData = {
                            [action.payload.place]: action.payload.data,
                        };
                    }
                }
            )
            .addCase(getTimesAndPathsDataForPlace.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.error.message ??
                    "Failed to fetch time and paths data.";
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
        Object.values(networks).every(n => n.ready) &&
        Object.values(timesAndRoutesData).every(place =>
            Object.values(place).every(n => n.timesAndRoutesDataReady)
        )
);

export const { setActiveMode } = networksSlice.actions;

export default networksSlice.reducer;
