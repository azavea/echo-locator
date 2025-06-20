import { createBrowserRouter, RouterProvider } from "react-router";

import Home from "./pages/Home";
import Components from "./pages/Components";

import "./App.css";

const App = () => {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Home />,
        },
        {
            path: "/components",
            element: <Components />,
        },
    ]);

    return <RouterProvider router={router} />;
};

export default App;
