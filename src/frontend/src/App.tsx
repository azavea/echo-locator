import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { Navigate } from "react-router";

import "./App.css";

const Root = lazy(() => import("pages/Root"));
const Components = lazy(() => import("pages/Components"));
const Discover = lazy(() => import("pages/Discover/Discover"));
const Compare = lazy(() => import("pages/Compare"));
const LanguageRedirect = lazy(() => import("components/LanguageRedirect"));

const LoadingFallback = () => <div>Loading page...</div>;

const App = () => (
    <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
            <Routes>
                {/* Redirect from the root path / to the default language page */}
                <Route index element={<Navigate to="/en/discover" replace />} />

                {/* Handle paths without a language prefix */}
                {/* TODO: we need to update this block as we have more pages */}
                <Route
                    path="discover"
                    element={<LanguageRedirect to="discover" />}
                />
                <Route
                    path="compare"
                    element={<LanguageRedirect to="compare" />}
                />
                <Route
                    path="components"
                    element={<LanguageRedirect to="components" />}
                />

                {/* Language-specific pages */}
                <Route path="/:lang" element={<Root />}>
                    {/* Handle /en, /es, etc. by redirecting to discover */}
                    <Route index element={<Navigate to="discover" replace />} />

                    {/* Rest of app pages */}
                    <Route path="discover/:zipcode?" element={<Discover />} />
                    <Route path="compare" element={<Compare />} />
                    <Route path="components" element={<Components />} />
                </Route>

                {/* Catch-all */}
                <Route
                    path="*"
                    element={<Navigate to="/en/discover" replace />}
                />
            </Routes>
        </Suspense>
    </BrowserRouter>
);

export default App;
