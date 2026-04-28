import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import AuthSignIn from "./pages/AuthSignIn";
import AuthSignUp from "./pages/AuthSignUp";
import AllTransactions from "./pages/AllTransactions";
import Settings from "./pages/Settings";
import EnterOTP from "./pages/EnterOTP";
import ProtectedRoute from "./components/ProtectedRoute";
import LoadingPage from "./pages/LoadingPage";

const App = () => {
  const location = useLocation();
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-in" element={<AuthSignIn />} />
        <Route path="/sign-up" element={<AuthSignUp />} />
        <Route path="/enter-otp" element={<EnterOTP />} />
        <Route path="/loading" element={<LoadingPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard/:userId" element={<Dashboard />} />
          <Route path="/transactions/:userId" element={<AllTransactions />} />
          <Route path="/settings/:userId" element={<Settings />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
