import { useEffect } from "react";

import { logout } from "api/auth";

const Logout = () => {
    useEffect(() => {
        const signOut = async () => {
            try {
                // Call the logout endpoint.
                // The Axios interceptor will automatically handle
                // clearing the token and redirecting on success.
                // If the call fails, the interceptor will also handle it.
                await logout();
            } catch (error) {
                console.error("Logout failed:", error);
            }
        };

        signOut();
    }, []);

    return null;
};

export default Logout;
