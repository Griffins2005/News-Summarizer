//src/components/AdminAuth.js
import React, { useState } from "react";
import axios from "axios";

export default function AdminAuth({ onAuth }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/admin-token/", {
        username,
        password,
      });
      const token = res.data.token;
      localStorage.setItem("adminToken", token);
      onAuth(token);
    } catch (err) {
      setError("Login failed. Invalid credentials.");
    }
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
      <button type="submit" className="admin-btn">Login</button>
      {error && <div className="error-msg">{error}</div>}
    </form>
  );
}