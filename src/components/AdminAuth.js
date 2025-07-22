//src/components/AdminAuth.js
import React, { useState } from "react";
import axios from "axios";

export default function AdminAuth({ onAuth }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Step 1: Get Token
      const res = await axios.post("https://news-summarizer-ai-backend.onrender.com/api/admin-token/", {
        username,
        password,
      });
      const token = res.data.token;
      // Step 2: Check if user is a Django superuser
      const check = await axios.post(
        "https://news-summarizer-ai-backend.onrender.com/api/admin-check/",
        {},
        { headers: { Authorization: `Token ${token}` } }
      );
      if (check.data && check.data.success) {
        localStorage.setItem("adminToken", token);
        onAuth(token);
      } else {
        setError("You do not have admin privileges.");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Login failed. Invalid credentials or not a superuser.");
      }
    }
    setLoading(false);
  };

  return (
    <form onSubmit={login} className="admin-auth-form" autoComplete="off" aria-label="Admin login form">
      <label htmlFor="admin-username">Username</label>
      <input
        id="admin-username"
        type="text"
        placeholder="Admin Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
      />
      <label htmlFor="admin-password">Password</label>
      <input
        id="admin-password"
        type="password"
        placeholder="Admin Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button type="submit" className="admin-btn" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
      {error && <div className="error-msg">{error}</div>}
    </form>
  );
}
