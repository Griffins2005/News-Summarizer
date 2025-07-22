// src/pages/AdminDashboard.js
import React, { useState, useEffect } from "react";
import AdminNavbar from "../components/AdminNavbar";
import axios from "axios";

function AdminDashboard({ onLogout }) {
  const [showPwChange, setShowPwChange] = useState(false);
  const [newPw, setNewPw] = useState("");
  const [success, setSuccess] = useState("");
  const [stats, setStats] = useState({ queries: 0, feedback: 0, last: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Admin Dashboard – News Summarizer";
    const meta = document.createElement("meta");
    meta.name = "description";
    meta.content = "Admin dashboard for News Summarizer: View high-level app stats and manage your account.";
    document.head.appendChild(meta);

    const fetchStats = async () => {
      setLoading(true);
      try {
        const [q, f] = await Promise.all([
          axios.get("https://news-summarizer-ai-backend.onrender.com/api/all-history/", { headers: { Authorization: `Token ${localStorage.getItem("adminToken")}` } }),
          axios.get("https://news-summarizer-ai-backend.onrender.com/api/all-feedback/", { headers: { Authorization: `Token ${localStorage.getItem("adminToken")}` } }),
        ]);
        setStats({
          queries: q.data.length,
          feedback: f.data.length,
          last: q.data[0]?.created_at || null,
        });
      } catch {}
      setLoading(false);
    };
    if (localStorage.getItem("adminToken")) fetchStats();
    return () => document.head.removeChild(meta);
  }, []);

  const changePw = (e) => {
    e.preventDefault();
    setSuccess("Please use the Django admin panel to change your password securely.");
  };

  return (
    <div className="admin-page">
      <AdminNavbar onLogout={onLogout} />
      <h2>Admin Dashboard</h2>
      <button onClick={() => setShowPwChange(v => !v)} className="admin-btn" aria-label="Change admin password">
        {showPwChange ? "Cancel" : "Change Password"}
      </button>
      {showPwChange && (
        <form onSubmit={changePw} className="admin-form">
          <input
            type="password"
            value={newPw}
            placeholder="New password"
            onChange={e => setNewPw(e.target.value)}
            className="admin-input"
          />
          <button type="submit" className="admin-btn">Set New Password</button>
        </form>
      )}
      {success && <div className="admin-success">{success}</div>}
      <div className="admin-stats" style={{ margin: "28px 0 0 0" }}>
        {loading ? "Loading stats…" :
          <>
            <strong>Total Queries:</strong> {stats.queries} &nbsp; | &nbsp;
            <strong>Total Feedback:</strong> {stats.feedback} &nbsp; | &nbsp;
            <strong>Last Query:</strong> {stats.last ? new Date(stats.last).toLocaleString() : "—"}
          </>
        }
      </div>
    </div>
  );
}

export default AdminDashboard;