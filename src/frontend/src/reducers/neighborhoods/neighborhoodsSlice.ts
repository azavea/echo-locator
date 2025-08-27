import { createSlice } from "@reduxjs/toolkit";
import type { NeighborhoodsSliceState } from "./types";
import { getNeighborhoodsAndBounds } from "./neighborhoodsThunk";
import allNeighborhoodTravelTimes from "./selectors/allNeighborhoodTravelTimes";
import drawNeighborhoodRoute from "./selectors/drawNeighborhoodRoute";

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

export const { setActiveNeighborhood } = neighborhoodSlice.actions;

export { allNeighborhoodTravelTimes as selectNeighborhoodTravelTimes };
export { drawNeighborhoodRoute as selectNeighborhoodRouteGeoJson };

export default neighborhoodSlice.reducer;
