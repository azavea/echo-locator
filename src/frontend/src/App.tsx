import { createBrowserRouter, Navigate, RouterProvider } from "react-router";

import Root from "pages/Root";
import Components from "pages/Components";
import Discover from "pages/Discover";
import Compare from "pages/Compare";

import "./App.css";

const App = () => {
    const router = createBrowserRouter([
        {
            path: "/",
            Component: Root,
            children: [
                // TODO: update redirect logic when we build frontend auth
                {
                    index: true,
                    element: <Navigate to="/discover" replace={true} />,
                },
                { path: "discover", Component: Discover },
                { path: "compare", Component: Compare },
                { path: "components", Component: Components },
            ],
        },
    ]);

    return <RouterProvider router={router} />;
};

export default App;
