import { createSlice } from "@reduxjs/toolkit";
import { type RootState } from "src/store/store";

interface modalsDisplaySliceState {
    isNeighborhoodDetailsOpen: boolean;
    isEditFiltersOpen: boolean;
    isEditTripsOpen: boolean;
    isSearchModalOpen: boolean;
    isEditProfileWizardOpen: boolean;
    isEditTripsWizardOpen: boolean;
}

const initialState: modalsDisplaySliceState = {
    isNeighborhoodDetailsOpen: false,
    isEditFiltersOpen: false,
    isEditTripsOpen: false,
    isSearchModalOpen: false,
    isEditProfileWizardOpen: false,
    isEditTripsWizardOpen: false,
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
        setIsEditProfileWizardOpen: (
            state,
            { payload: status }: { payload: boolean }
        ) => {
            state.isEditProfileWizardOpen = status;
        },
        setIsEditTripsWizardOpen: (
            state,
            { payload: status }: { payload: boolean }
        ) => {
            state.isEditTripsWizardOpen = status;
        },
    },
});

export const {
    setIsNeighborhoodDetailsOpen,
    setIsEditTripsOpen,
    setIsEditFiltersOpen,
    setIsSearchModalOpen,
    setIsEditProfileWizardOpen,
    setIsEditTripsWizardOpen,
} = modalsDisplaySlice.actions;

export const selectIsNeighborhoodDetailsOpen = (state: RootState) =>
    state.modalsDisplay.isNeighborhoodDetailsOpen;
export const selectIsEditFiltersOpen = (state: RootState) =>
    state.modalsDisplay.isEditFiltersOpen;
export const selectIsEditTripsOpen = (state: RootState) =>
    state.modalsDisplay.isEditTripsOpen;
export const selectIsSearchModalOpen = (state: RootState) =>
    state.modalsDisplay.isSearchModalOpen;
export const selectIsEditProfileWizardOpen = (state: RootState) =>
    state.modalsDisplay.isEditProfileWizardOpen;
export const selectIsEditTripsWizardOpen = (state: RootState) =>
    state.modalsDisplay.isEditTripsWizardOpen;

export default modalsDisplaySlice.reducer;
