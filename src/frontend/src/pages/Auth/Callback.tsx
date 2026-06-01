import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router";

import { setToken } from "reducers/auth/authSlice";
import { getApiToken } from "api/auth";
import { LOCAL_STORAGE_TOKEN_KEY } from "src/constants";
import useSupportedLanguage from "hooks/useSupportedLanguage";

const LoginCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const language = useSupportedLanguage();

    useEffect(() => {
        // This function will run once when the component mounts
        const processToken = async () => {
            // Grab the auth token from the URL
            const authToken = searchParams.get("echo_auth");

            // If no token is found, go back to sign in page.
            if (!authToken) {
                navigate(`/${language}/login`, { replace: true });
                return;
            }

            try {
                // Call the backend API to exchange auth token with API token
                const response = await getApiToken(authToken);
                const { token: apiToken } = response;
                // Add the API token to localStorage for persistence
                localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, apiToken);
                // Add the API token to the Redux state
                dispatch(setToken(apiToken));
                // Go to the /discover page
                navigate(`/${language}/discover`, { replace: true });
            } catch (error) {
                console.error("Failed to verify auth token:", error);
                // If it returns an error, bounce user back to the login page
                navigate(`/${language}/login`, { replace: true });
            }
        };

        processToken();
    }, [dispatch, navigate, searchParams, language]);

    return null;
};

export default LoginCallback;
