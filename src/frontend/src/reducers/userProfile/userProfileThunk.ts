import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUserProfile, putUserProfile } from "api/userProfile";
import { type AppDispatch, type RootState } from "src/store/store";
import { getAllTimesAndPathsData } from "../networks/networksThunk";
import type { UserProfile } from "./types";

export const getUserProfile = createAsyncThunk(
    "userProfile/getUserProfile",
    async () => await fetchUserProfile()
);

export const updateUserProfile = createAsyncThunk(
    "userProfile/updateUserProfile",
    async (profile: UserProfile, { dispatch, getState, rejectWithValue }) => {
        const data = await putUserProfile(profile);
        const state = getState() as RootState;
        const appDispatch = dispatch as AppDispatch;
        // Fetch times and paths data for any new destinations
        const newDestinations = data.destinations.filter(
            d =>
                !state.networks.timesAndRoutesData ||
                !Object.keys(state.networks.timesAndRoutesData).includes(
                    d.location.label
                )
        );
        const pathsAndTimesData = await appDispatch(
            getAllTimesAndPathsData(newDestinations)
        );

        if (getAllTimesAndPathsData.rejected.match(pathsAndTimesData)) {
            return rejectWithValue(
                pathsAndTimesData.payload ??
                    "Error fetching paths and times data for new destinations"
            );
        }

        console.log(pathsAndTimesData);
        return data;
    }
);
