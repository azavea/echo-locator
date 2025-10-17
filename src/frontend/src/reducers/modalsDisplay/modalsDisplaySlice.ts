import { createSlice } from "@reduxjs/toolkit";
import { type RootState } from "src/store/store";

interface modalsDisplaySliceState {
    isNeighborhoodDetailsOpen: boolean;
    isEditFiltersOpen: boolean;
    isEditTripsOpen: boolean;
    isSearchModalOpen: boolean;
}

const initialState: modalsDisplaySliceState = {
    isNeighborhoodDetailsOpen: false,
    isEditFiltersOpen: false,
    isEditTripsOpen: false,
    isSearchModalOpen: false,
};

export const modalsDisplaySlice = createSlice({
    name: "modalsDisplay",
    initialState,
    reducers: {
        setIsNeighborhoodDetailsOpen: (
            state,
            { payload: status }: { payload: boolean }
        ) => {
            state.isNeighborhoodDetailsOpen = status;
        },
        setIsEditFiltersOpen: (
            state,
            { payload: status }: { payload: boolean }
        ) => {
            state.isEditFiltersOpen = status;
        },
        setIsEditTripsOpen: (
            state,
            { payload: status }: { payload: boolean }
        ) => {
            state.isEditTripsOpen = status;
        },
        setIsSearchModalOpen: (
            state,
            { payload: status }: { payload: boolean }
        ) => {
            state.isSearchModalOpen = status;
        },
    },
});

export const {
    setIsNeighborhoodDetailsOpen,
    setIsEditTripsOpen,
    setIsEditFiltersOpen,
    setIsSearchModalOpen,
} = modalsDisplaySlice.actions;

export const selectIsNeighborhoodDetailsOpen = (state: RootState) =>
    state.modalsDisplay.isNeighborhoodDetailsOpen;
export const selectIsEditFiltersOpen = (state: RootState) =>
    state.modalsDisplay.isEditFiltersOpen;
export const selectIsEditTripsOpen = (state: RootState) =>
    state.modalsDisplay.isEditTripsOpen;
export const selectIsSearchModalOpen = (state: RootState) =>
    state.modalsDisplay.isSearchModalOpen;

export default modalsDisplaySlice.reducer;
