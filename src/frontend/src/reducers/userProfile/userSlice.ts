import { createSlice } from "@reduxjs/toolkit";
import type { Destination, UserProfileSliceState } from "./types";
import {
    DEFAULT_ACCESSIBILITY_IMPORTANCE,
    DEFAULT_CRIME_IMPORTANCE,
    DEFAULT_SCHOOLS_IMPORTANCE,
} from "src/constants";

const initialState: UserProfileSliceState = {
    destinations: [],
    favorites: [],
    hasVehicle: false,
    importanceAccessibility: DEFAULT_ACCESSIBILITY_IMPORTANCE.toString(),
    importanceSchools: DEFAULT_SCHOOLS_IMPORTANCE.toString(),
    importanceViolentCrime: DEFAULT_CRIME_IMPORTANCE.toString(),
    rooms: 0,
    useCommuterRail: true,
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
    },
});

export const { setActiveDestination, setDestinations } =
    userProfileSlice.actions;

export default userProfileSlice.reducer;
