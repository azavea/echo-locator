import axios from "axios";
import apiClient, { API_BASE_URL } from "./client";

interface SignInResponse {
    message: string;
}

interface APITokenResponse {
    token: string;
}

// /login API endpoint does not need auth
export const login = async (email: string): Promise<SignInResponse> => {
    const response = await axios.post<SignInResponse>(
        `${API_BASE_URL}/login/`,
        { username: email }
    );
    return response.data;
};

// /auth/login/?echo_auth= API endpoint does not need auth
export const getApiToken = async (
    authToken: string
): Promise<APITokenResponse> => {
    const response = await axios.get<APITokenResponse>(
        `${API_BASE_URL}/auth/login/?echo_auth=${authToken}`
    );
    return response.data;
};

// /logout endpoint needs authentication
export const logout = async (): Promise<any> => {
    const response = await apiClient.post("/logout/");
    return response.data;
};
