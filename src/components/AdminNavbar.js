// src/components/AdminNavbar.js
import React from "react";
import { Link, useLocation } from "react-router-dom";

function AdminNavbar({ onLogout }) {
  const location = useLocation();
  return (
    <nav className="admin-navbar" aria-label="Admin Navigation">
      <Link to="/admin" className={`admin-navlink${location.pathname === "/admin" ? " active" : ""}`}>Dashboard</Link>
      <Link to="/admin/history" className={`admin-navlink${location.pathname === "/admin/history" ? " active" : ""}`}>Query History</Link>
      <Link to="/admin/analytics" className={`admin-navlink${location.pathname === "/admin/analytics" ? " active" : ""}`}>Analytics</Link>
      <Link to="/admin/feedback" className={`admin-navlink${location.pathname === "/admin/feedback" ? " active" : ""}`}>User Insights</Link>
      <button className="admin-navlink admin-logout" onClick={onLogout}>Logout</button>
    </nav>
  );
}
export default AdminNavbar;