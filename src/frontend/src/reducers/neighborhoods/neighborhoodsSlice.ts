import { createSlice } from "@reduxjs/toolkit";
import type {
    NeighborhoodsSliceState,
    Neighborhoods,
    NeighborhoodBounds,
} from "./types";
import { getNeighborhoodsAndBounds } from "./neighborhoodsThunk";

const initialState: NeighborhoodsSliceState = {
    neighborhoods: null,
    neighborhoodBounds: null,
    activeNeighborhood: null,
    loading: false,
    error: null,
};

export const neighborhoodSlice = createSlice({
    name: "neighborhoods",
    initialState,
    reducers: {
        setNeighborhoods: (
            state,
            { payload: neighborhoods }: { payload: Neighborhoods }
        ) => {
            state.neighborhoods = neighborhoods;
        },
        setNeighborhoodBounds: (
            state,
            { payload: neighborhoodBounds }: { payload: NeighborhoodBounds }
        ) => {
            state.neighborhoodBounds = neighborhoodBounds;
        },
        setActiveNeighborhood: (
            state,
            { payload: neighborhood }: { payload: string | null }
        ) => {
            state.activeNeighborhood = neighborhood;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(getNeighborhoodsAndBounds.pending, state => {
                state.loading = true;
            })
            .addCase(getNeighborhoodsAndBounds.fulfilled, (state, action) => {
                state.loading = false;
                state.neighborhoods = action.payload.neighborhoods;
                state.neighborhoodBounds = action.payload.neighborhoodBounds;
            })
            .addCase(getNeighborhoodsAndBounds.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.error.message ??
                    "Failed to fetch neighborhoods and their bounds.";
            });
    },
});

export const {
    setNeighborhoods,
    setNeighborhoodBounds,
    setActiveNeighborhood,
} = neighborhoodSlice.actions;

export default neighborhoodSlice.reducer;
