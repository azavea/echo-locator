import { createSelector, createSlice } from "@reduxjs/toolkit";
import type {
    NeighborhoodsSliceState,
    RankedNeighborhoodsLists,
} from "./types";
import { getNeighborhoodsAndBounds } from "./neighborhoodsThunk";
import drawNeighborhoodRoute from "./selectors/drawNeighborhoodRoute";
import type { RootState } from "src/store/store";

const initialState: NeighborhoodsSliceState = {
    neighborhoods: null,
    neighborhoodBounds: null,
    activeNeighborhood: null,
    loading: false,
    error: null,
    rankedNeighborhoodsLists: {
        topTen: [],
        groupedTopTen: [],
        groupedRecommended: [],
        groupedTooFar: [],
    },
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
        setRankedNeighborhoodLists: (
            state,
            { payload: lists }: { payload: RankedNeighborhoodsLists }
        ) => {
            state.rankedNeighborhoodsLists = lists;
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

export const { setActiveNeighborhood, setRankedNeighborhoodLists } =
    neighborhoodSlice.actions;

export { drawNeighborhoodRoute as selectNeighborhoodRouteGeoJson };

export const selectNeighborhoodNameByZipcode = createSelector(
    [(state: RootState) => state.neighborhoods.neighborhoods],
    neighborhoods =>
        neighborhoods &&
        neighborhoods.features.reduce(
            (zipMap, f) => {
                zipMap[f.properties.id] = f.properties.town;
                return zipMap;
            },
            {} as { [key: string]: string }
        )
);

export default neighborhoodSlice.reducer;
