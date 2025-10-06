import axios from "axios";
import { store } from "store/store"; // Import your main Redux store
import { clearToken } from "reducers/auth/authSlice";
import { LOCAL_STORAGE_TOKEN_KEY } from "src/constants";

export const API_BASE_URL = "/api";

// Create a new Axios instance with a base URL
const apiClient = axios.create({
    baseURL: API_BASE_URL,
});

// Request Interceptor: Adds the auth token to every request
apiClient.interceptors.request.use(config => {
    const token = store.getState().auth.token;
    if (token) {
        config.headers.Authorization = `Token ${token}`;
    }
    return config;
});

// Response Interceptor: Handles 401 errors globally
apiClient.interceptors.response.use(
    // For successful responses
    response => {
        if (response.config.url?.endsWith("/logout/")) {
            // Dispatch the action to clear the token from Redux
            store.dispatch(clearToken());
            // Clear the local storage
            localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
            // Redirect to the login page
            window.location.href = "/login";
        }
        return response;
    },
    // For error responses
    error => {
        // If the error is a 401 Unauthorized
        if (error.response && error.response.status === 401) {
            console.error("Stale token detected, logging out.");
            // Dispatch the action to clear the token from Redux
            store.dispatch(clearToken());
            // Clear the local storage
            localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
            // Redirect to the login page
            window.location.href = "/login";
        }
        // For all other errors, just pass along
        return Promise.reject(error);
    }
);

export default apiClient;
