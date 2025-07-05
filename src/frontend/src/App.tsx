import { BrowserRouter, Routes, Route } from "react-router";
import { Navigate } from "react-router";

import Root from "pages/Root";
import Components from "pages/Components";
import Discover from "pages/Discover";
import Compare from "pages/Compare";

import "./App.css";

const App = () => (
    <BrowserRouter>
        <Routes>
            <Route element={<Root />}>
                <Route
                    index
                    element={<Navigate to="/discover" replace={true} />}
                />
                <Route path="discover" element={<Discover />} />
                <Route path="compare" element={<Compare />} />
                <Route path="components" element={<Components />} />
            </Route>
        </Routes>
    </BrowserRouter>
);

export default App;
