import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    neighborhoods: [],
    neighborhoodBounds: [],
    activeNeighborhood: null
};

export const neighborhoodSlice = createSlice({
    name: 'neighborhoods',
    initialState,
    reducers: {
        setNeighborhoods: (state, { payload: neighborhoods }) => {
            state.neighborhoods = neighborhoods
        },
        setNeighborhoodBounds: (state, { payload: neighborhoodBounds }) => {
            state.neighborhoodBounds = neighborhoodBounds
        },
        setActiveNeighborhood: (state, { payload: neighborhood }) => {
            state.activeNeighborhood = neighborhood
        },
    },
});

export const {
    setNeighborhoods,
    setNeighborhoodBounds,
    setActiveNeighborhood
} = neighborhoodSlice.actions;

export default neighborhoodSlice.reducer;
