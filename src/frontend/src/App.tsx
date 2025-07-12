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
            <Route index element={<Navigate to="/en/discover" replace />} />
            <Route path="/:lang" element={<Root />}>
                <Route path="discover" element={<Discover />} />
                <Route path="compare" element={<Compare />} />
                <Route path="components" element={<Components />} />
            </Route>
        </Routes>
    </BrowserRouter>
);

export default App;
