import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";

import "./App.css";

const Root = lazy(() => import("pages/Root"));
const Components = lazy(() => import("pages/Components"));
const Discover = lazy(() => import("pages/Discover/Discover"));
const Compare = lazy(() => import("src/pages/Compare/Compare"));
const LanguageRedirect = lazy(() => import("components/LanguageRedirect"));
const AuthenticatedRoute = lazy(() => import("components/AuthenticatedRoute"));
const LogIn = lazy(() => import("pages/Auth/Login"));
const LoginCallback = lazy(() => import("pages/Auth/Callback"));
const Logout = lazy(() => import("pages/Auth/Logout"));

const LoadingFallback = () => <div>Loading page...</div>;

const App = () => (
    <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
            <Routes>
                {/* Redirect from the root path / to the default discover page */}
                <Route index element={<Navigate to="/discover" replace />} />

                {/* Public callback route, does not need a language */}
                <Route path="callback" element={<LoginCallback />} />

                {/* These handle paths without a language prefix by redirecting */}
                {/* TODO: we need to update this block as we have more pages */}
                <Route path="login" element={<LanguageRedirect to="login" />} />
                <Route
                    path="logout"
                    element={<LanguageRedirect to="logout" />}
                />
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

                <Route path="/:lang" element={<Root />}>
                    {/* These routes are accessible to everyone */}
                    <Route path="login" element={<LogIn />} />

                    {/* All routes nested under AuthenticatedRoute require a valid token */}
                    <Route element={<AuthenticatedRoute />}>
                        {/* All protected app pages go here */}
                        {/* Handle /en, /es, etc. by redirecting to discover */}
                        <Route
                            index
                            element={
                                <Navigate to="discover/:zipcode?" replace />
                            }
                        />
                        {/* TODO: we need to update this block as we have more pages */}
                        <Route
                            path="discover/:zipcode?"
                            element={<Discover />}
                        />
                        <Route path="compare" element={<Compare />} />
                        <Route path="components" element={<Components />} />
                        <Route path="logout" element={<Logout />} />
                    </Route>
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
