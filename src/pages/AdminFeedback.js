//src/pages/AdminFeedback.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminAuth from "../components/AdminAuth";
import AdminNavbar from "../components/AdminNavbar";

// CSV Export helper
function toCSV(arr, keys) {
  const escape = (v) => `"${(""+v).replace(/"/g, '""')}"`;
  const head = keys.join(",");
  const body = arr.map(obj => keys.map(k => escape(obj[k] ?? "")).join(",")).join("\n");
  return [head, body].join("\n");
}

function getFeedbackStats(feedback) {
  let agree = 0, total = feedback.length, flagged = [];
  let wordCount = {};
  feedback.forEach(f => {
    if (/yes/i.test(f.user_feedback)) agree++;
    else if (/no|wrong|disagree|bad|incorrect/i.test(f.user_feedback)) flagged.push(f);
    (f.user_feedback || "").toLowerCase().split(/\W+/).forEach(w => {
      if (w.length > 3) wordCount[w] = (wordCount[w] || 0) + 1;
    });
  });
  let topWords = Object.entries(wordCount).sort((a, b) => b[1]-a[1]).slice(0, 8).map(([w])=>w);
  return {
    agreePercent: total ? Math.round((agree / total) * 100) : 0,
    flagged,
    topWords
  };
}

function getLabelAccuracy(history, feedback) {
  let byLabel = {};
  history.forEach(q => {
    const f = feedback.find(fb =>
      fb.title === q.article_title && fb.fake_news_label === q.fake_news_label
    );
    if (!byLabel[q.fake_news_label]) byLabel[q.fake_news_label] = [0, 0];
    byLabel[q.fake_news_label][1]++;
    if (f && /yes/i.test(f.user_feedback)) byLabel[q.fake_news_label][0]++;
  });
  let res = {};
  Object.entries(byLabel).forEach(([label, [agree, total]]) => {
    res[label] = { agree, total, percent: total ? Math.round((agree/total)*100) : 0 };
  });
  return res;
}

function getQueryTrend(history) {
  const d = {};
  history.forEach(q => {
    const date = new Date(q.created_at).toLocaleDateString();
    d[date] = (d[date] || 0) + 1;
  });
  return Object.entries(d).sort((a, b) => new Date(a[0]) - new Date(b[0]));
}

export default function AdminFeedback({ onLogout }) {
  const [auth, setAuth] = useState(!!localStorage.getItem("adminToken"));
  const [feedback, setFeedback] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [csvLink, setCsvLink] = useState(null);

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
    document.title = "User Insights & Analytics – Admin | News Summarizer";
    const meta = document.createElement("meta");
    meta.name = "description";
    meta.content = "View AI trust, user feedback, accuracy by label, word trends, and disputes for News Summarizer.";
    document.head.appendChild(meta);

    const fetchAll = async () => {
      setLoading(true);
      try {
        const [q, f] = await Promise.all([
          axios.get("https://news-summarizer-ai-backend.onrender.com/api/all-history/", { headers: { Authorization: `Token ${localStorage.getItem("adminToken")}` } }),
          axios.get("https://news-summarizer-ai-backend.onrender.com/api/all-feedback/", { headers: { Authorization: `Token ${localStorage.getItem("adminToken")}` } }),
        ]);
        setHistory(q.data);
        setFeedback(f.data);
        // Prepare CSV
        const csv = toCSV(f.data, ["created_at", "title", "fake_news_label", "user_feedback"]);
        setCsvLink(URL.createObjectURL(new Blob([csv], {type: "text/csv"})));
      } catch {}
      setLoading(false);
    };
    if (localStorage.getItem("adminToken")) fetchAll();
    return () => document.head.removeChild(meta);
  }, []);

  const feedbackStats = getFeedbackStats(feedback);
  const labelStats = getLabelAccuracy(history, feedback);
  const trend = getQueryTrend(history);

  if (!auth) return <AdminAuth onAuth={() => setAuth(true)} />;

  return (
    <div className="admin-page">
      <AdminNavbar onLogout={onLogout} />
      <h2>User Insights & Analytics</h2>
      {loading ? <div>Loading analytics…</div> :
        <>
        <section className="admin-analytics">
          <h3>User Trust in AI</h3>
          <div>
            <b>Users Agreed with AI:</b> {feedbackStats.agreePercent}%<br/>
            <b>Flagged Results:</b> {feedbackStats.flagged.length}
          </div>
          <h3>AI Accuracy by Label</h3>
          <table className="admin-table" style={{ maxWidth: 400 }}>
            <thead>
              <tr>
                <th>Label</th><th>Agreement</th><th>Accuracy %</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(labelStats).map(([label, s]) =>
                <tr key={label}>
                  <td>{label}</td>
                  <td>{s.agree}/{s.total}</td>
                  <td>
                    <div style={{
                      width: 70,
                      background: "#e9e9ee",
                      borderRadius: 5,
                      display: "inline-block",
                      verticalAlign: "middle"
                    }}>
                      <div style={{
                        width: `${s.percent}%`, height: 8,
                        background: "#22a66a", borderRadius: 5,
                        transition: "width 0.5s"
                      }}></div>
                    </div>
                    &nbsp;{s.percent}%
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <h3>Query Trend</h3>
          <div style={{maxWidth: 400}}>
            <ul style={{marginBottom:0}}>
              {trend.map(([date, count], i) =>
                <li key={i}>{date}: <b>{count}</b></li>
              )}
            </ul>
          </div>
          <h3>Feedback Word Cloud (top terms)</h3>
          <div>
            {feedbackStats.topWords.map(word =>
              <span key={word} style={{
                display: "inline-block", background: "#ddeaff", color: "#253ea7",
                borderRadius: "5px", padding: "2px 10px", margin: "0 7px 6px 0", fontWeight: 600
              }}>{word}</span>
            )}
            {feedbackStats.topWords.length === 0 && <span>No major trends yet.</span>}
          </div>
          <h3>Most Flagged Results</h3>
          <ul>
            {feedbackStats.flagged.slice(0, 5).map((f, i) => (
              <li key={i}>
                <b>{f.title?.slice(0,50)}</b>: <span style={{color:'#c00'}}>{f.user_feedback}</span>
              </li>
            ))}
            {feedbackStats.flagged.length === 0 && <li>No major disputes so far.</li>}
          </ul>
          <div style={{margin:"24px 0"}}>
            <a href={csvLink} download="user-feedback.csv" className="admin-btn">Export Feedback (CSV)</a>
          </div>
        </section>
        <h3>Raw Feedback Table</h3>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>When</th>
                <th>Title</th>
                <th>Label</th>
                <th>Feedback</th>
              </tr>
            </thead>
            <tbody>
              {feedback.map((f, i) => (
                <tr key={i}>
                  <td>{formatLocalDate(f.created_at)}</td>
                  <td>{f.title}</td>
                  <td>{f.fake_news_label}</td>
                  <td>{f.user_feedback}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
      }
    </div>
  );
}