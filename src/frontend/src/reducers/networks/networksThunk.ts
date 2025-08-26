// Refactored from old codebase loadDataset and fetchAllTimesAndPathsForCoordinate at commit 6f17e33
// New source code copied from latest Taui v3
// ATTR: Taui by Conveyal, included under the MIT license (https://github.com/conveyal/taui/blob/dev/LICENSE)

import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    fetchNetworkData,
    fetchPathsData,
    fetchTimesData,
} from "src/api/networks";
import { networks } from "src/constants";
import type {
    NetworkModeOptions,
    Networks,
    LonLat,
    ParsedPathsData,
    TimesAndPathsData,
} from "./types";
import { coordinateToIndex } from "./utils/coordinateToIndex";
import { parsePathsData } from "./utils/parsePathsData";
import { parseTimesData } from "./utils/parseTimesData";
import type { RootState } from "src/store/store";

export const getNetworks = createAsyncThunk(
    "networks/getNetworks",
    async (_, { rejectWithValue }) => {
        try {
            const networkDataByMode: Record<string, any> = {};

            await Promise.all(
                Object.keys(networks).map(async network => {
                    const [requestResponse, transitiveResponse] =
                        await fetchNetworkData(network);

                    const requestData =
                        requestResponse.data.request || requestResponse.data;

                    networkDataByMode[network] = {
                        ...requestData,
                        ready: true,
                        transitive: transitiveResponse.data,
                    };
                })
            );

            // TODO: We need to explicitly set type because of
            // the Promise<any> in the API method, but this isn't
            // great practice. Refine for better types management.
            return networkDataByMode as Networks;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const getAllTimesAndPaths = createAsyncThunk<
    any,
    LonLat,
    { state: RootState }
>(
    "networks/getAllTimesAndPaths",
    async (origin: LonLat, { getState, rejectWithValue }) => {
        const state = getState();
        // Use Promise.all to fetch and parse data for all networks concurrently
        try {
            const allParsedTimeAndPathData = await Promise.all(
                Object.keys(networks).map(async network => {
                    const networkDetails =
                        state.networks.networks &&
                        state.networks.networks[network as NetworkModeOptions];
                    if(!networkDetails){
                        return {
                            name: network as NetworkModeOptions
                        };
                    }
                    const index = coordinateToIndex(networkDetails, origin);

                    // Car paths not generated in analysis,
                    // only time surface with no congestion data
                    const pathsFetchPromise =
                        network === "car"
                            ? Promise.resolve(null)
                            : fetchPathsData(network, index);
                    const timesFetchPromise = fetchTimesData(network, index);
                    const [pathsResponse, timesResponse] = await Promise.all([
                        pathsFetchPromise,
                        timesFetchPromise,
                    ]);

                    const pathsData = pathsResponse
                        ? parsePathsData(pathsResponse.value)
                        : ({} as ParsedPathsData);
                    const travelTimeSurface = parseTimesData(
                        timesResponse.value
                    );

                    return {
                        name: network as NetworkModeOptions,
                        ...pathsData,
                        travelTimeSurface: travelTimeSurface,
                        timesAndPathsDataReady: true,
                    };
                })
            );
            return allParsedTimeAndPathData.reduce(
                (dataByNetwork, data) => {
                    dataByNetwork[data.name] = data;
                    return dataByNetwork;
                },
                {} as { [key in NetworkModeOptions]: TimesAndPathsData }
            );
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);
