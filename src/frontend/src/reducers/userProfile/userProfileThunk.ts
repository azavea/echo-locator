import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUserProfile, putUserProfile } from "api/userProfile";
import type { UserProfile } from "./types";

export const getUserProfile = createAsyncThunk(
    "userProfile/getUserProfile",
    async () => await fetchUserProfile()
);

export const updateUserProfile = createAsyncThunk(
    "userProfile/updateUserProfile",
    async (profile: UserProfile) => await putUserProfile(profile)
);
