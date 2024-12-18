// src/App.js
import { Analytics } from "@vercel/analytics/react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-tooltip/dist/react-tooltip.css";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import ForgotPasswordScreen from "./pages/ForgotPasswordScreen";
import LoginScreen from "./pages/LoginScreen";
import ResetPasswordScreen from "./pages/ResetPasswordScreen";
import SignupScreen from "./pages/SignupScreen";
import TermsAndConditions from "./pages/TermsAndConditions";
import { isAuthenticated } from "./utils/auth";
function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Check if the user is authenticated
    const checkAuth = async () => {
      const authStatus = isAuthenticated(); // Assuming this is an async call
      setIsAuth(authStatus);
      setLoading(false); // Authentication check is complete
    };

    checkAuth();
  }, []);
  if (loading) {
    // Show a loading spinner or screen while checking authentication status
    return <div>Loading...</div>;
  }
  return (
    <>
      <Helmet>
        <title>Fitness AI Dashboard</title>
        <meta
          name="description"
          content="Analyze and track your fitness progress with customized exercise and dietary plans."
        />
        <link rel="icon" href="fitness-logo.png" />
      </Helmet>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Analytics />
      <Router>
        <Routes>
          {/* Redirect to login if not authenticated */}
          <Route
            path="/"
            element={
              isAuth ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
            }
          />

          {/* Login route */}
          <Route
            path="/login"
            element={isAuth ? <Navigate to="/dashboard" /> : <LoginScreen />}
          />

          {/* Signup route */}
          <Route
            path="/signup"
            element={isAuth ? <Navigate to="/dashboard" /> : <SignupScreen />}
          />

          {/* Forgot password route */}
          <Route
            path="/forgot-password"
            element={
              isAuth ? <Navigate to="/dashboard" /> : <ForgotPasswordScreen />
            }
          />
          {/* Reset password route */}
          <Route
            path="/reset-password"
            element={
              isAuth ? <Navigate to="/dashboard" /> : <ResetPasswordScreen />
            }
          />

          {/* Protected dashboard route */}
          <Route
            path="/dashboard"
            element={isAuth ? <Dashboard /> : <Navigate to="/login" />}
          />

          <Route
            path="/conditions"
            element={isAuth ? <TermsAndConditions /> : <Navigate to="/login" />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
