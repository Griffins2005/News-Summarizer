//src/pages/AdminHistory.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminAuth from "../components/AdminAuth";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminHistory() {
  const [auth, setAuth] = useState(!!localStorage.getItem("adminToken"));
  const [history, setHistory] = useState([]);

  function formatLocalDate(utcString) {
    if (!utcString) return '';
    const date = new Date(utcString);
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }

  useEffect(() => {
    document.title = "Query History – Admin | News Summarizer";
    const meta = document.createElement("meta");
    meta.name = "description";
    meta.content = "Admin history for News Summarizer: See a log of all analyzed articles.";
    document.head.appendChild(meta);

    if (auth) {
      axios.get("https://news-summarizer-ai-backend.onrender.com/api/all-history/", {
        headers: { Authorization: `Token ${localStorage.getItem("adminToken")}` }
      })
      .then(res => setHistory(res.data))
      .catch(err => {
        setAuth(false);
        localStorage.removeItem("adminToken");
        alert("Not authorized or error loading history.");
      });
    }
    return () => document.head.removeChild(meta);
  }, [auth]);

  if (!auth) return <AdminAuth onAuth={() => setAuth(true)} />;

  return (
    <div className="admin-page">
      <AdminNavbar />
      <h2>Admin: Query History</h2>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>When</th>
              <th>Input</th>
              <th>Summary</th>
              <th>Label</th>
              <th>Confidence</th>
            </tr>
          </thead>
          <tbody>
            {history.map((q, i) => (
              <tr key={i}>
                <td>{formatLocalDate(q.created_at)}</td>
                <td>{q.input_value}</td>
                <td>{q.summary}</td>
                <td>{q.fake_news_label}</td>
                <td>{q.fake_news_confidence}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}