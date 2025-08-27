import { createSlice } from "@reduxjs/toolkit";
import type { Destination, UserProfileSliceState } from "./types";
import {
    DEFAULT_ACCESSIBILITY_IMPORTANCE,
    DEFAULT_CRIME_IMPORTANCE,
    DEFAULT_SCHOOLS_IMPORTANCE,
} from "src/constants";
import type { PlaceKey } from "src/enums";

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
            { payload: place }: { payload: PlaceKey }
        ) => {
            state.activeDestination = place;
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
