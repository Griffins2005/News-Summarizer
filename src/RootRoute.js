// src/RootRoute.js
import { HashRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import App from "./App";
import AdminAuth from "./components/AdminAuth";
import AdminDashboard from "./pages/AdminDashboard";
import AdminHistory from "./pages/AdminHistory";
import AdminAnalytics from "./pages/analytics";
import AdminFeedback from "./pages/AdminFeedback";
import axios from "axios";

function RootRoutes() {
  const [auth, setAuth] = useState(!!window.localStorage.getItem("adminToken"));
  const [checking, setChecking] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [tokenError, setTokenError] = useState(""); // For improved error catching

  useEffect(() => {
    async function verifyToken() {
      const token = window.localStorage.getItem("adminToken");
      if (!token) {
        setAuth(false);
        setChecking(false);
        setUnauthorized(false);
        setTokenError("");
        return;
      }
      try {
        await axios.post(
          "https://news-summarizer-ai-backend.onrender.com/api/admin-check/",
          {},
          { headers: { Authorization: `Token ${token}` } }
        );
        setAuth(true);
        setUnauthorized(false);
        setTokenError("");
      } catch (err) {
        window.localStorage.removeItem("adminToken");
        setAuth(false);
        setUnauthorized(true);
        // Improve error message
        let msg =
          err?.response?.data?.error ||
          err?.message ||
          "Unknown error verifying admin token";
        setTokenError(msg);
        // Log for deep debug
        if (window) window.__ADMIN_AUTH_ERROR = err;
        console.warn("[Admin Auth] Token validation failed:", msg, err);
      }
      setChecking(false);
    }
    verifyToken();
  }, [auth]);

  const handleAuth = (token) => {
    window.localStorage.setItem("adminToken", token);
    setAuth(true);
    setUnauthorized(false);
    setTokenError("");
  };

  const handleLogout = () => {
    window.localStorage.removeItem("adminToken");
    setAuth(false);
    setUnauthorized(false);
    setTokenError("");
  };

  if (checking)
    return <div style={{ padding: 40, textAlign: "center" }}>Checking authentication…</div>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route
          path="/admin"
          element={
            auth ? (
              <AdminDashboard onLogout={handleLogout} />
            ) : (
              <>
                {unauthorized && (
                  <div style={{ color: "#b70000", textAlign: "center", margin: "18px 0" }}>
                    <strong>Access denied:</strong> You are not authorized to access admin pages.<br />
                    Please log in as a Django superuser.
                  </div>
                )}
                {tokenError && (
                  <div style={{
                    color: "#a30d00",
                    background: "#fff5f0",
                    padding: "10px",
                    borderRadius: "7px",
                    margin: "0 0 12px 0"
                  }}>
                    <strong>Auth error:</strong> {tokenError}
                  </div>
                )}
                <AdminAuth onAuth={handleAuth} />
              </>
            )
          }
        />
        <Route
          path="/admin/history"
          element={
            auth ? <AdminHistory onLogout={handleLogout} /> : <Navigate to="/admin" />
          }
        />
        <Route
          path="/admin/feedback"
          element={
            auth ? <AdminFeedback onLogout={handleLogout} /> : <Navigate to="/admin" />
          }
        />
        <Route
          path="/admin/analytics"
          element={
            auth ? <AdminAnalytics onLogout={handleLogout} /> : <Navigate to="/admin" />
          }
        />
      </Routes>
    </Router>
  );
}

export default RootRoutes;
