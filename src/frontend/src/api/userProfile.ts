import type { UserProfile } from "reducers/userProfile/types";
import apiClient from "./client";

// /user endpoint needs authentication
export const fetchUserProfile = async (): Promise<UserProfile> => {
    const response = await apiClient.get("/user/");
    return response.data;
};
