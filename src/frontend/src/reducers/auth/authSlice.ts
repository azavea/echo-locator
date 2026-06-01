import { createSlice } from "@reduxjs/toolkit";

import { LOCAL_STORAGE_TOKEN_KEY } from "src/constants";

interface AuthState {
    token: string | null;
}

// Check localStorage for an existing token when the app loads
const initialState: AuthState = {
    token: localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY) || null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setToken(state, { payload: token }: { payload: string }) {
            state.token = token;
        },
        clearToken(state) {
            state.token = null;
        },
    },
});

export const { setToken, clearToken } = authSlice.actions;

export default authSlice.reducer;
