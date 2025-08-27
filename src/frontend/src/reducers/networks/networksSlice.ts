import { createSelector, createSlice } from "@reduxjs/toolkit";
import type {
    NetworksSliceState,
    LonLat
} from "./types";
import { getTimesAndPathsDataForPlace, getNetworks } from "./networksThunk";
import type { RootState } from "src/store/store";
import type { NetworkModeOptionKey } from "src/enums";

const initialState: NetworksSliceState = {
    networks: null,
    timesAndPathsData: {},
    origin: null,
    // Default to use first transit network with commuter rail
    activeMode: "peak",
    loading: false,
    error: null,
};

export const networksSlice = createSlice({
    name: "networks",
    initialState,
    reducers: {
        setOrigin: (state, { payload: origin }: { payload: LonLat }) => {
            state.origin = origin;
        },
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
            .addCase(getTimesAndPathsDataForPlace.fulfilled, (state, action) => {
                state.loading = false;
                if (state.timesAndPathsData) {
                    if(state.timesAndPathsData?.hasOwnProperty(action.payload.place)){
                        state.timesAndPathsData[action.payload.place] = {
                                ...state.timesAndPathsData[action.payload.place],
                                ...action.payload.data,
                            };
                    }
                    else {
                        state.timesAndPathsData[action.payload.place] = action.payload.data;
                    }
                }
            })
            .addCase(getTimesAndPathsDataForPlace.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.error.message ??
                    "Failed to fetch time and paths data.";
            });
    },
});

export const selectAllNetworksDataReady = createSelector(
    [(state: RootState) => state.networks.networks],
    networks =>
        !!networks &&
        Object.values(networks).every(n => n.ready && n.timesAndPathsDataReady)
);

export const { setOrigin, setActiveMode } = networksSlice.actions;

export default networksSlice.reducer;
