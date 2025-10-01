import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router";

import { type RootState } from "store/store";

const AuthenticatedRoute = () => {
    const token = useSelector((state: RootState) => state.auth.token);
    const location = useLocation();

    if (!token) {
        // If no token exists, redirect to the sign-in page
        // Pass the current location so it can redirect back after login
        return <Navigate to={`/login`} state={{ from: location }} replace />;
    }

    // If a token exists, render the child component
    return <Outlet />;
};

export default AuthenticatedRoute;
