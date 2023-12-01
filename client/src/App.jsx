import React, { Suspense } from "react";
// import "antd/dist/antd.css";
import "remixicon/fonts/remixicon.css";
import "./App.css";
import "./stylesheets/alignments.css";
import "./stylesheets/custom-components.css";
import "./stylesheets/form-elements.css";
import "./stylesheets/text-elements.css";
import "./stylesheets/theme.css";
import "./stylesheets/layout.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";

const SignUp = React.lazy(() => import("./pages/signup/SignUp"));
const SignIn = React.lazy(() => import("./pages/signin/SignIn"));
const Home = React.lazy(() => import("./pages/home/Home"));
const ProtectedRroute = React.lazy(() =>
  import("./components/ProtectedRroute")
);
const PublicRoute = React.lazy(() => import("./components/PublicRoute"));
const Layout = React.lazy(() => import("./components/Layout"));
const Transactions = React.lazy(() =>
  import("./pages/transactions/Transactions")
);
const Request = React.lazy(() => import("./pages/requests/Request"));
const Users = React.lazy(() => import("./pages/users/Users"));
const Profile = React.lazy(() => import("./pages/profile/Profile"));
const Loader = React.lazy(() => import("./components/Loader"));
const ResetPassword = React.lazy(() =>
  import("./pages/passwordConfig/ResetPassword")
);
const ForgotPassword = React.lazy(() =>
  import("./pages/passwordConfig/ForgotPassword")
);
const VerifyEmail = React.lazy(() => import("./pages/verifyEmail/VerifyEmail"));

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRroute>
                <Layout />
              </ProtectedRroute>
            }
          >
            <Route index element={<Home />} />
            <Route
              path="transactions"
              element={
                <Suspense fallback={<Loader />}>
                  <Transactions />
                </Suspense>
              }
            />
            <Route
              path="requests"
              element={
                <Suspense fallback={<Loader />}>
                  <Request />
                </Suspense>
              }
            />
            <Route
              path="users"
              element={
                <Suspense fallback={<Loader />}>
                  <Users />
                </Suspense>
              }
            />
            <Route
              path="profile"
              element={
                <Suspense fallback={<Loader />}>
                  <Profile />
                </Suspense>
              }
            />
            <Route
              path="loader"
              element={
                <Suspense fallback={<Loader />}>
                  <Loader />
                </Suspense>
              }
            />
          </Route>

          <Route
            path="/signup"
            element={
              <PublicRoute fallback={<Loader />}>
                <Suspense>
                  <SignUp />
                </Suspense>
              </PublicRoute>
            }
          />
          <Route
            path="/verify-email/:_id/:emailToken"
            element={
              <PublicRoute>
                <Suspense fallback={<Loader />}>
                  <VerifyEmail />
                </Suspense>
              </PublicRoute>
            }
          />
          <Route
            path="/signin"
            element={
              <PublicRoute>
                <Suspense fallback={<Loader />}>
                  <SignIn />
                </Suspense>
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <Suspense fallback={<Loader />}>
                  <ForgotPassword />
                </Suspense>
              </PublicRoute>
            }
          />

          <Route
            path="reset-password/:_id/:token"
            element={
              <PublicRoute>
                <Suspense fallback={<Loader />}>
                  <ResetPassword />
                </Suspense>
              </PublicRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
