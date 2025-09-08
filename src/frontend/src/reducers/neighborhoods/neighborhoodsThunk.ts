import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    fetchNeighborhoods,
    fetchNeighborhoodBounds,
} from "../../api/neighborhoods";
import {
    selectNeighborhoodNameByZipcode,
    setRankCalculating,
    setRankedNeighborhoodLists,
} from "./neighborhoodsSlice";
import { type AppDispatch, type RootState } from "store/store";
import neighborhoodsSortedWithRoutes from "./selectors/neighborhoodsSortedWithRoutes";
import type { RankedNeighborhoodsLists } from "./types";
import groupRankingsByLikeNeigborhoodName from "./utils/groupRankingListsByName";

export const getNeighborhoodsAndBounds = createAsyncThunk(
    "neighborhoods/getNeighborhoodsAndBounds",
    async (authToken: string | null) => {
        if (!authToken) {
            throw new Error("Authentication token not found");
        }

        const [neighborhoods, neighborhoodBounds] = await Promise.all([
            fetchNeighborhoods(authToken),
            fetchNeighborhoodBounds(authToken),
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

        const neighborhoodsList = neighborhoodsSortedWithRoutes(state);
        const neighborhoodNameByZipcode =
            selectNeighborhoodNameByZipcode(state);

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
