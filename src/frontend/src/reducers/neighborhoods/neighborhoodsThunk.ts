import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchNeighborhoods, fetchNeighborhoodBounds } from "api/neighborhoods";
import {
    selectNeighborhoodNameByZipcode,
    setRankCalculating,
    setRankedNeighborhoodLists,
} from "./neighborhoodsSlice";
import { type AppDispatch, type RootState } from "store/store";
import neighborhoodsSortedWithRoutes from "./selectors/neighborhoodsSortedWithRoutes";
import type { RankedNeighborhoodsLists } from "./types";
import groupRankingsByLikeNeigborhoodName from "./utils/groupRankingListsByName";
import selectNeighborhoodZipcodeMap from "./selectors/selectNeighborhoodZipcodeMap";
import filterNeighborhoodsList from "./utils/filterNeighborhoodsList";

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

        // Apply filters
        if (
            state.neighborhoods.neighborhoods &&
            Object.keys(state.neighborhoods.filters)
        ) {
            neighborhoodsList = filterNeighborhoodsList(
                neighborhoodsList,
                state.neighborhoods.neighborhoods,
                state.neighborhoods.filters
            );
        }

        // Group for list display
        groupedNeighborhoodsLists.topTen = neighborhoodsList.recommended.slice(
            0,
            10
        );
        groupedNeighborhoodsLists.recommended =
            neighborhoodsList.recommended.slice(10);
        groupedNeighborhoodsLists.tooFar = neighborhoodsList.tooFar;

        if (neighborhoodNameByZipcode) {
            groupedNeighborhoodsLists.groupedTopTen =
                groupRankingsByLikeNeigborhoodName(
                    groupedNeighborhoodsLists.topTen,
                    neighborhoodNameByZipcode
                );
            groupedNeighborhoodsLists.groupedTooFar =
                groupRankingsByLikeNeigborhoodName(
                    neighborhoodsList.tooFar,
                    neighborhoodNameByZipcode
                );
            groupedNeighborhoodsLists.groupedRecommended =
                groupRankingsByLikeNeigborhoodName(
                    neighborhoodsList.recommended.slice(10),
                    neighborhoodNameByZipcode
                );
        }

        dispatch(setRankedNeighborhoodLists(groupedNeighborhoodsLists));
    };
