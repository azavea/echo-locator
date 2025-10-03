import { createSelector, createSlice } from "@reduxjs/toolkit";
import type {
    NeighborhoodsSliceState,
    RankedNeighborhoodsLists,
} from "./types";
import { getNeighborhoodsAndBounds } from "./neighborhoodsThunk";
import type { RootState } from "src/store/store";

const initialState: NeighborhoodsSliceState = {
    neighborhoods: null,
    neighborhoodBounds: null,
    activeNeighborhood: null,
    loading: false,
    error: null,
    rankCalculating: false,
    rankedNeighborhoodsLists: {
        topTen: [],
        recommended: [],
        tooFar: [],
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
        setRankCalculating: (
            state,
            { payload: status }: { payload: boolean }
        ) => {
            state.rankCalculating = status;
        },
        setRankedNeighborhoodLists: (
            state,
            { payload: lists }: { payload: RankedNeighborhoodsLists }
        ) => {
            state.rankedNeighborhoodsLists = lists;
            state.rankCalculating = false;
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
    setActiveNeighborhood,
    setRankCalculating,
    setRankedNeighborhoodLists,
} = neighborhoodSlice.actions;

export const selectRankedNeighborhoodsLists = (state: RootState) =>
    state.neighborhoods.rankedNeighborhoodsLists;
export const selectIsRankCalculating = (state: RootState) =>
    state.neighborhoods.rankCalculating;
export const selectActiveNeighborhood = (state: RootState) =>
    state.neighborhoods.activeNeighborhood;
export const selectActiveNeighborhoodFeature = (state: RootState) =>
    state.neighborhoods.neighborhoods?.features.find(
        n => n.properties.zipcode === state.neighborhoods.activeNeighborhood
    );
export const selectActiveNeighborhoodBounds = (state: RootState) =>
    state.neighborhoods.neighborhoodBounds?.features.find(
        b => b.properties.zipcode === state.neighborhoods.activeNeighborhood
    );

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
