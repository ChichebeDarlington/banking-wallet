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
                <Suspense fallback={<Loader />}>
                  <Layout />
                </Suspense>
              </ProtectedRroute>
            }
          >
            <Route index element={<Home />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="requests" element={<Request />} />
            <Route path="users" element={<Users />} />
            <Route path="profile" element={<Profile />} />
            <Route path="loader" element={<Loader />} />
          </Route>

          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            }
          />
          <Route
            path="/verify-email/:_id/:emailToken"
            element={
              <PublicRoute>
                <VerifyEmail />
              </PublicRoute>
            }
          />
          <Route
            path="/signin"
            element={
              <PublicRoute>
                <SignIn />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />

          <Route
            path="reset-password/:_id/:token"
            element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
