import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUserProfile } from "api/userProfile";

export const getUserProfile = createAsyncThunk(
    "userProfile/getUserProfile",
    async () => await fetchUserProfile()
);
