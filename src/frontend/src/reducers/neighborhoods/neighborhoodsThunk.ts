import { createAsyncThunk } from "@reduxjs/toolkit";

import { fetchNeighborhoodBounds, fetchNeighborhoods } from "api/neighborhoods";
import { type AppDispatch, type RootState } from "store/store";
import {
    selectAreFiltersApplied,
    selectNeighborhoodNameByZipcode,
    selectNeighborhoodPropsByZipcode,
    setRankCalculating,
    setRankedNeighborhoodLists,
} from "./neighborhoodsSlice";
import neighborhoodsSortedWithRoutes from "./selectors/neighborhoodsSortedWithRoutes";
import type { RankedNeighborhoodsLists } from "./types";
import filterNeighborhoodsList from "./utils/filterNeighborhoodsList";
import groupRankingsByLikeNeigborhoodName from "./utils/groupRankingListsByName";

export const getNeighborhoodsAndBounds = createAsyncThunk(
    "neighborhoods/getNeighborhoodsAndBounds",
    async () => {
        const [neighborhoods, neighborhoodBounds] = await Promise.all([
            fetchNeighborhoods(),
            fetchNeighborhoodBounds(),
        ]);

        return { neighborhoods, neighborhoodBounds };
    }
);

export const getRankedNeighborhoodLists =
    () => (dispatch: AppDispatch, getState: () => RootState) => {
        const state = getState() as RootState;

        dispatch(setRankCalculating(true));
        const groupedNeighborhoodsLists: RankedNeighborhoodsLists = {
            topTen: [],
            recommended: [],
            tooFar: [],
            groupedTopTen: [],
            groupedRecommended: [],
            groupedTooFar: [],
        };

        // Get ranked list
        let neighborhoodsList = neighborhoodsSortedWithRoutes(state);
        const neighborhoodNameByZipcode =
            selectNeighborhoodNameByZipcode(state);

        // Apply regional and ecc filtering
        const isFiltered = selectAreFiltersApplied(state);
        const neighborhoodPropsByZipcode =
            selectNeighborhoodPropsByZipcode(state);
        if (neighborhoodPropsByZipcode && isFiltered) {
            neighborhoodsList = filterNeighborhoodsList(
                neighborhoodsList,
                state.neighborhoods.filters,
                isFiltered,
                neighborhoodPropsByZipcode
            );
        }

        groupedNeighborhoodsLists.topTen = neighborhoodsList.recommended.slice(
            0,
            10
        );
        groupedNeighborhoodsLists.recommended =
            neighborhoodsList.recommended.slice(10);
        groupedNeighborhoodsLists.tooFar = neighborhoodsList.tooFar;

        if (neighborhoodNameByZipcode) {
            // Filter by text search for grouped list view display
            const searchTerm = state.neighborhoods.filters.textSearch?.trim();
            const passesTextSearchFilter = (zip: string) =>
                zip.includes(searchTerm ?? "") ||
                neighborhoodNameByZipcode[zip].includes(searchTerm ?? "");

            const recommendedFilteredListView = [
                ...neighborhoodsList.recommended,
            ].filter(zip => passesTextSearchFilter(zip as string));
            const tooFarFilteredListView = [...neighborhoodsList.tooFar].filter(
                zip => passesTextSearchFilter(zip as string)
            );

            // Group neighborhoods by same name for list view display
            groupedNeighborhoodsLists.groupedTopTen =
                groupRankingsByLikeNeigborhoodName(
                    recommendedFilteredListView.slice(0, 10),
                    neighborhoodNameByZipcode
                );
            groupedNeighborhoodsLists.groupedRecommended =
                groupRankingsByLikeNeigborhoodName(
                    recommendedFilteredListView.slice(10),
                    neighborhoodNameByZipcode
                );
            groupedNeighborhoodsLists.groupedTooFar =
                groupRankingsByLikeNeigborhoodName(
                    tooFarFilteredListView,
                    neighborhoodNameByZipcode
                );
        }

        dispatch(setRankedNeighborhoodLists(groupedNeighborhoodsLists));
    };
