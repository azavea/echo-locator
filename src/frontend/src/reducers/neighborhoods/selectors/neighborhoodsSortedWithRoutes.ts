// Refactored from old codebase neighborhoods-sorted-with-routes at commit 6f17e33

import concat from "lodash/concat";
import findIndex from "lodash/findIndex";
import get from "lodash/get";
import includes from "lodash/includes";
import orderBy from "lodash/orderBy";
import pullAt from "lodash/pullAt";

import {
    BOOST_DOWNTOWN_RESULT_PLACE,
    DOWNTOWN_AREAS,
    MAX_TRAVEL_TIME,
    RESULTS_WITH_DOWNTOWN,
} from "../../../constants";
import { createSelector } from "@reduxjs/toolkit";

import type { Feature, Point } from "geojson";
import type { NeighborhoodProperties } from "../types";
import type { RootState } from "store/store";

import selectNeighborhoodRoutes from "../../networks/selectors/networkNeighborhoodRoutes";
import selectNeighborhoodTravelTimes from "./allNeighborhoodTravelTimes";
import importanceCriteriaScoreWeights from "reducers/userProfile/selectors/importanceCriteriaScoreWeights";
import { createNeighborhoodWeightedScore } from "../utils/createNeighborhoodWeightedScore";
import { selectAllNetworksDataReady } from "src/reducers/networks/networksSlice";

const getZipCodeListFromNeighborhoods = (
    neighborhoods: Feature<Point, NeighborhoodProperties>[]
) => neighborhoods.map(n => n.properties.id);

export default createSelector(
    [
        selectNeighborhoodRoutes,
        selectNeighborhoodTravelTimes,
        importanceCriteriaScoreWeights,
        selectAllNetworksDataReady,
        (state: RootState) => get(state, "neighborhoods.neighborhoods"),
        (state: RootState) => get(state, "networks.activeMode"),
    ],
    (
        neighborhoodRoutes,
        travelTimes,
        userScoreWeights,
        networksReady,
        neighborhoods,
        activeNetworkMode
    ) => {
        const rankedLists: { recommended: string[]; tooFar: string[] } = {
            recommended: [],
            tooFar: [],
        };

        if (!networksReady) {
            return rankedLists;
        }

        const recommendedNeighborhoodsList: Feature<
            Point,
            NeighborhoodProperties
        >[] = [];
        const tooFarNeighborhoodsList: Feature<
            Point,
            NeighborhoodProperties
        >[] = [];

        const useTransit = activeNetworkMode !== "car";
        neighborhoods &&
            neighborhoods.features.forEach((n, index) => {
                const route = neighborhoodRoutes[index];
                const segments = useTransit ? route.segments : [];
                const time = travelTimes[index][activeNetworkMode];

                const scoreAndWeights = createNeighborhoodWeightedScore(
                    n,
                    userScoreWeights,
                    time
                );

                const result = Object.assign(
                    {
                        segments,
                        time,
                        ...scoreAndWeights,
                    },
                    n
                );

                const isRoutable =
                    (useTransit && segments.length) || !useTransit;
                if (isRoutable && time < MAX_TRAVEL_TIME) {
                    recommendedNeighborhoodsList.push(result);
                } else {
                    tooFarNeighborhoodsList.push(result);
                }
            });
        const rankedRecommendedNeighborhoods = orderBy(
            recommendedNeighborhoodsList,
            ["score"],
            ["desc"]
        );
        const rankedTooFarNeighborhoodsList = orderBy(
            tooFarNeighborhoodsList,
            ["score"],
            ["desc"]
        );

        // Boost the first downtown result into the BOOST_DOWNTOWN_RESULT_PLACE
        // if there's not already a downtown result in the top RESULTS_WITH_DOWNTOWN results.
        const firstDowntownIndex = findIndex(
            rankedRecommendedNeighborhoods,
            n => {
                const townArea = n.properties["town_area"];
                return !!(townArea && includes(DOWNTOWN_AREAS, townArea));
            }
        );
        if (firstDowntownIndex >= RESULTS_WITH_DOWNTOWN - 1) {
            // extract first downtown result, removing it from `ordered` array
            const firstDowntown = pullAt(
                rankedRecommendedNeighborhoods,
                firstDowntownIndex
            );
            // splice returns the members removed from the start, mutating `ordered` in place
            const reorderedStart = rankedRecommendedNeighborhoods.splice(
                0,
                BOOST_DOWNTOWN_RESULT_PLACE - 1
            );
            const rankedAndBoostedRecommendedNeighborhoods = concat(
                reorderedStart,
                firstDowntown,
                rankedRecommendedNeighborhoods
            );
            rankedLists["recommended"] = getZipCodeListFromNeighborhoods(
                rankedAndBoostedRecommendedNeighborhoods
            );
        } else {
            rankedLists["recommended"] = getZipCodeListFromNeighborhoods(
                rankedRecommendedNeighborhoods
            );
        }

        rankedLists["tooFar"] = getZipCodeListFromNeighborhoods(
            rankedTooFarNeighborhoodsList
        );

        return rankedLists;
    }
);
