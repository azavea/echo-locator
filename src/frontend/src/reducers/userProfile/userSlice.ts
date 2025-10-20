import { createSlice } from "@reduxjs/toolkit";
import {
    DEFAULT_ACCESSIBILITY_IMPORTANCE,
    DEFAULT_CRIME_IMPORTANCE,
    DEFAULT_SCHOOLS_IMPORTANCE,
} from "src/constants";
import { type RootState } from "src/store/store";
import type { Destination, UserProfileSliceState } from "./types";
import { getUserProfile, updateUserProfile } from "./userProfileThunk";

const initialState: UserProfileSliceState = {
    loading: false,
    error: null,
    destinations: [],
    favorites: [],
    hasVehicle: false,
    importanceAccessibility: DEFAULT_ACCESSIBILITY_IMPORTANCE.toString(),
    importanceSchools: DEFAULT_SCHOOLS_IMPORTANCE.toString(),
    importanceViolentCrime: DEFAULT_CRIME_IMPORTANCE.toString(),
    rooms: 0,
    useCommuterRail: true,
    hasViewedStartInstructions: false,
};

export const userProfileSlice = createSlice({
    name: "userProfile",
    initialState,
    reducers: {
        setActiveDestination: (
            state,
            { payload: address }: { payload: string }
        ) => {
            state.activeDestination = address;
        },
        setDestinations: (
            state,
            { payload: destinations }: { payload: Destination[] }
        ) => {
            state.destinations = destinations;
        },
        setHasViewedStartInstructions: (
            state,
            { payload: status }: { payload: boolean }
        ) => {
            state.hasViewedStartInstructions = status;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(getUserProfile.pending, state => {
                state.loading = true;
            })
            .addCase(getUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.destinations = action.payload.destinations;
                state.favorites = action.payload.favorites;
                state.hasVehicle = action.payload.hasVehicle;
                state.importanceAccessibility =
                    action.payload.importanceAccessibility.toString();
                state.importanceSchools =
                    action.payload.importanceSchools.toString();
                state.importanceViolentCrime =
                    action.payload.importanceViolentCrime.toString();
                state.rooms = action.payload.voucherRooms || 0;
                state.useCommuterRail = action.payload.useCommuterRail;
                const activeDestination = action.payload.destinations.find(
                    des => des.primary
                );
                if (activeDestination) {
                    state.activeDestination = activeDestination.location.label;
                }
            })
            .addCase(getUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.error.message ?? "Failed to fetch user profile.";
            })
            .addCase(updateUserProfile.pending, state => {
                state.loading = true;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.destinations = action.payload.destinations;
                state.favorites = action.payload.favorites;
                state.hasVehicle = action.payload.hasVehicle;
                state.importanceAccessibility =
                    action.payload.importanceAccessibility.toString();
                state.importanceSchools =
                    action.payload.importanceSchools.toString();
                state.importanceViolentCrime =
                    action.payload.importanceViolentCrime.toString();
                state.rooms = action.payload.voucherRooms || 0;
                state.useCommuterRail = action.payload.useCommuterRail;
                const activeDestination = action.payload.destinations.find(
                    des => des.primary
                );
                if (activeDestination) {
                    state.activeDestination = activeDestination.location.label;
                }
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.error.message ?? "Failed to update user profile.";
            });
    },
});

export const {
    setActiveDestination,
    setDestinations,
    setHasViewedStartInstructions,
} = userProfileSlice.actions;

export const selectUserProfile = (state: RootState) => state.userProfile;
export const selectActiveDestination = (state: RootState) =>
    state.userProfile.activeDestination;
export const selectActiveDestinationDetails = (state: RootState) =>
    state.userProfile.destinations.find(
        d => d.location.label === state.userProfile.activeDestination
    );
export const selectUserDestinations = (state: RootState) =>
    state.userProfile.destinations;
export const selectUserBedroomCount = (state: RootState) =>
    state.userProfile.rooms;
export const selectUserHasViewedStartInstructions = (state: RootState) =>
    state.userProfile.hasViewedStartInstructions;

export default userProfileSlice.reducer;
