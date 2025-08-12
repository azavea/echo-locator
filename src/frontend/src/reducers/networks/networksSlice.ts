import { createSlice } from "@reduxjs/toolkit";
import type { NetworkModeOptions, NetworksSliceState } from "./types";
import { getNetworks } from "./networksThunk";

const initialState: NetworksSliceState = {
    networks: null,
    origin: null,
    activeMode: "peak",
    loading: false,
    error: null,
};

export const networksSlice = createSlice({
    name: "networks",
    initialState,
    reducers: {
        setOrigin: (
            state,
            { payload: origin }: { payload: [number, number] }
        ) => {
            state.origin = origin;
        },
        setActiveMode: (
            state,
            { payload: mode }: { payload: NetworkModeOptions }
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
            });
    },
});

export const { setOrigin, setActiveMode } = networksSlice.actions;

export default networksSlice.reducer;
