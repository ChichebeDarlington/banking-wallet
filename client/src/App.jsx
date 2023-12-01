// import "antd/dist/antd.css";
import "remixicon/fonts/remixicon.css";
import "./App.css";
import SignUp from "./pages/signup/SignUp";
import SignIn from "./pages/signin/SignIn";
import "./stylesheets/alignments.css";
import "./stylesheets/custom-components.css";
import "./stylesheets/form-elements.css";
import "./stylesheets/text-elements.css";
import "./stylesheets/theme.css";
import "./stylesheets/layout.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import ProtectedRroute from "./components/ProtectedRroute";
import PublicRoute from "./components/PublicRoute";
import Layout from "./components/Layout";
import Transactions from "./pages/transactions/Transactions";
import Request from "./pages/requests/Request";
import Users from "./pages/users/Users";
import Profile from "./pages/profile/Profile";
import Loader from "./components/Loader";
import ResetPassword from "./pages/passwordConfig/ResetPassword";
import ForgotPassword from "./pages/passwordConfig/ForgotPassword";
import VerifyEmail from "./pages/verifyEmail/VerifyEmail";

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
