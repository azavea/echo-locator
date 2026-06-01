import { createSelector, createSlice } from "@reduxjs/toolkit";
import { NEIGHBORHOOD_REGIONS } from "src/constants";
import type { RootState } from "store/store";
import { getNeighborhoodsAndBounds } from "./neighborhoodsThunk";
import type {
    FiltersState,
    NeighborhoodBounds,
    NeighborhoodProperties,
    NeighborhoodsSliceState,
    RankedNeighborhoodsLists,
} from "./types";

const initialState: NeighborhoodsSliceState = {
    neighborhoods: null,
    neighborhoodBounds: null,
    activeNeighborhood: null,
    loading: false,
    error: null,
    filters: { ecc: false, regions: NEIGHBORHOOD_REGIONS, textSearch: null },
    rankCalculating: false,
    rankedNeighborhoodsLists: {
        topTen: [],
        recommended: [],
        tooFar: [],
        groupedTopTen: [],
        groupedRecommended: [],
        groupedTooFar: [],
        groupedSearchableTopTen: [],
        groupedSearchableRecommended: [],
        groupedSearchableTooFar: [],
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
        setNeighborhoodFilters: (
            state,
            { payload: filters }: { payload: FiltersState }
        ) => {
            state.filters = filters;
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
    setNeighborhoodFilters,
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
export const selectNeighborhoodPropsByZipcode = (state: RootState) =>
    state.neighborhoods.neighborhoods?.features.reduce(
        (neighborhoodPropsMap, neighborhood) => ({
            ...neighborhoodPropsMap,
            [neighborhood.properties.zipcode]: neighborhood.properties,
        }),
        {} as Record<string, NeighborhoodProperties>
    );
export const selectAreFiltersApplied = (state: RootState) => {
    const searchTerm = state.neighborhoods.filters.textSearch?.trim();
    return (
        state.neighborhoods.filters.ecc ||
        state.neighborhoods.filters.regions?.length <
            NEIGHBORHOOD_REGIONS.length ||
        !!searchTerm
    );
};
export const selectNeighborhoodFilters = (state: RootState) =>
    state.neighborhoods.filters;

export const selectNeighborhoodFilterSuggestions = (state: RootState) => {
    const { neighborhoods } = state.neighborhoods;
    // Return distinct town names formatted as Autocomplete Suggestion
    return [
        ...new Set(neighborhoods?.features.map(f => f.properties.town)),
    ].map(name => {
        return { name: name };
    });
};

export const selectFilterableNeighborhoodBounds = createSelector(
    [
        selectRankedNeighborhoodsLists,
        selectAreFiltersApplied,
        (state: RootState) => state.neighborhoods.neighborhoodBounds,
        // Filters state unused in fn, but passed in to pick up changes
        (state: RootState) => state.neighborhoods.filters,
    ],
    (rankedNeighborhoodsLists, isFiltered, neighborhoodBounds, filters) => {
        if (isFiltered) {
            // Use searchable grouped lists since to include text search filtering.
            // If text search, include tooFar list in results since high specificity
            // that we would still want to display even if "not a match".
            const {
                groupedSearchableTopTen,
                groupedSearchableRecommended,
                groupedSearchableTooFar,
            } = rankedNeighborhoodsLists;
            const tooFarIfTextSearch = filters.textSearch?.trim()
                ? groupedSearchableTooFar
                : [];
            const filteredList = [
                ...groupedSearchableTopTen,
                ...groupedSearchableRecommended,
                ...tooFarIfTextSearch,
            ].flat();
            return {
                type: "FeatureCollection",
                features: neighborhoodBounds?.features.filter(f =>
                    filteredList.includes(f.properties.zipcode)
                ),
            } as NeighborhoodBounds;
        }
        return neighborhoodBounds;
    }
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
