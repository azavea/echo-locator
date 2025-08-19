import { createSlice } from "@reduxjs/toolkit";
import type {
    NetworkModeOptions,
    NetworksSliceState,
    originPoint,
    TimesAndPathsByNetwork,
} from "./types";
import { getAllTimesAndPaths, getNetworks } from "./networksThunk";

const initialState: NetworksSliceState = {
    networks: null,
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
        setOrigin: (state, { payload: origin }: { payload: originPoint }) => {
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
            })
            .addCase(getAllTimesAndPaths.pending, state => {
                state.loading = true;
            })
            .addCase(getAllTimesAndPaths.fulfilled, (state, action) => {
                state.loading = false;
                if (state.networks) {
                    for (const key in action.payload as TimesAndPathsByNetwork) {
                        const mode = key as NetworkModeOptions;
                        if (state.networks?.hasOwnProperty(mode)) {
                            state.networks[mode] = {
                                ...state.networks[mode],
                                ...action.payload[mode],
                            };
                        } else {
                            state.networks[mode] = action.payload[mode];
                        }
                    }
                }
            })
            .addCase(getAllTimesAndPaths.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.error.message ??
                    "Failed to fetch time and paths data.";
            });
    },
});

export const { setOrigin, setActiveMode } = networksSlice.actions;

export default networksSlice.reducer;
