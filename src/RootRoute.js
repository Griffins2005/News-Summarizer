//src/RootRoute.js
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useState } from "react";
import App from "./App";
import AdminAuth from "./components/AdminAuth";
import AdminDashboard from "./pages/AdminDashboard";
import AdminHistory from "./pages/AdminHistory";
import AdminAnalytics from "./pages/analytics";
import AdminFeedback from "./pages/AdminFeedback"; // this is now User Insights

function RootRoutes() {
  const [auth, setAuth] = useState(
    !!window.localStorage.getItem("adminToken")
  );

  const handleAuth = (token) => {
    window.localStorage.setItem("adminToken", token);
    setAuth(true);
  };

  const handleLogout = () => {
    window.localStorage.removeItem("adminToken");
    setAuth(false);
  };

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
              <AdminAuth onAuth={handleAuth} />
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
          element={auth ? <AdminAnalytics onLogout={handleLogout} /> : <Navigate to="/admin" />}
        />
      </Routes>
    </Router>
  );
}
export default RootRoutes;