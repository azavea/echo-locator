// Refactored from old codebase loadDataset and fetchAllTimesAndPathsForCoordinate at commit 6f17e33
// New source code copied from latest Taui v3
// ATTR: Taui by Conveyal, included under the MIT license (https://github.com/conveyal/taui/blob/dev/LICENSE)

import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchNetworkData } from "src/api/networks";
import { networks } from "src/constants";
import type { NetworkModeOptionKey } from "src/enums";
import type { RootState } from "src/store/store";
import type { Destination } from "../userProfile/types";
import type { Networks } from "./types";
import { fetchAndProcessDataByDestination } from "./utils/fetchAndProcessDataByDestination";

export const getNetworks = createAsyncThunk(
    "networks/getNetworks",
    async (_, { rejectWithValue }) => {
        try {
            const networkDataByMode: Record<string, any> = {};

            await Promise.all(
                Object.keys(networks).map(async networkKeyString => {
                    const network = networkKeyString as NetworkModeOptionKey;
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

export const getAllTimesAndPathsData = createAsyncThunk<
    any,
    Destination[],
    { state: RootState }
>(
    "data/getAllTimesAndPathsData",
    async (destinations, { getState, rejectWithValue }) => {
        const state = getState();

        if (destinations.length === 0) {
            return null;
        }

        try {
            const results = await Promise.all(
                destinations.map(destination =>
                    fetchAndProcessDataByDestination(destination, state)
                )
            );

            return Object.fromEntries(
                results.map(result => [result.label, result.data])
            );
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);
