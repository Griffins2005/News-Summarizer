// src/pages/AdminAnalytics.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminNavbar from "../components/AdminNavbar";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";

const COLORS = ["#22a66a", "#d7263d", "#e3a21a", "#345bff", "#888"];

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function AdminAnalytics({ onLogout }) {
  const [history, setHistory] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Analytics – News Summarizer";
    async function fetchData() {
      setLoading(true);
      try {
        const token = localStorage.getItem("adminToken");
        const [h, f] = await Promise.all([
          axios.get("https://news-summarizer-ai-backend.onrender.com/api/all-history/", {
            headers: { Authorization: `Token ${token}` },
          }),
          axios.get("https://news-summarizer-ai-backend.onrender.com/api/all-feedback/", {
            headers: { Authorization: `Token ${token}` },
          }),
        ]);
        setHistory(h.data);
        setFeedback(f.data);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // ---- ANALYTICS DATA PROCESSING ----

  // 1. Query count per day
  const dateCounts = {};
  history.forEach(q => {
    const date = q.created_at?.slice(0, 10);
    if (!dateCounts[date]) dateCounts[date] = 0;
    dateCounts[date]++;
  });
  const queriesOverTime = Object.entries(dateCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));

  // 2. Verdict label histogram
  const labelCounts = {};
  history.forEach(q => {
    const label = q.fake_news_label || "UNSURE";
    if (!labelCounts[label]) labelCounts[label] = 0;
    labelCounts[label]++;
  });
  const labelHist = Object.entries(labelCounts).map(([label, count]) => ({
    label, count
  }));

  // 3. AI confidence histogram
  const bins = [0, 60, 70, 80, 90, 100];
  const confHist = Array(bins.length - 1).fill(0);
  history.forEach(q => {
    const conf = q.fake_news_confidence || 0;
    for (let i = 1; i < bins.length; i++) {
      if (conf <= bins[i]) {
        confHist[i - 1]++;
        break;
      }
    }
  });
  const confidenceData = confHist.map((count, i) => ({
    range: `${bins[i]}-${bins[i+1]}`,
    count,
  }));

  // 4. Feedback sentiment (basic: YES/NO or positive/negative via keywords)
  let pos = 0, neg = 0;
  feedback.forEach(f => {
    const val = (f.user_feedback || "").toLowerCase();
    if (["yes", "good", "correct", "right", "accurate"].some(w => val.includes(w))) pos++;
    else if (["no", "wrong", "bad", "inaccurate", "error"].some(w => val.includes(w))) neg++;
  });
  const sentimentData = [
    { name: "Positive", value: pos },
    { name: "Negative", value: neg }
  ];

  // 5. Query response time (duration) histogram
  const durBins = [0, 1000, 2000, 3000, 4000, 10000];
  const durHist = Array(durBins.length - 1).fill(0);
  history.forEach(q => {
    const d = q.duration_ms || 0;
    for (let i = 1; i < durBins.length; i++) {
      if (d <= durBins[i]) {
        durHist[i - 1]++;
        break;
      }
    }
  });
  const durationData = durHist.map((count, i) => ({
    range: `${durBins[i]}-${durBins[i+1]} ms`,
    count,
  }));

  // 6. Agreement rate (feedback label matches AI verdict)
  let agreements = 0, total = 0;
  feedback.forEach(f => {
    if (!f.fake_news_label || !f.user_feedback) return;
    if (
      f.user_feedback.toLowerCase().includes("yes") ||
      f.user_feedback.toLowerCase().includes(f.fake_news_label.toLowerCase())
    ) agreements++;
    total++;
  });
  const agreementRate = total ? Math.round((agreements / total) * 100) : 0;

  // 7. Most common queries/inputs (by value)
  const inputCounts = {};
  history.forEach(q => {
    const val = q.input_value?.slice(0, 50) || "";
    if (!inputCounts[val]) inputCounts[val] = 0;
    inputCounts[val]++;
  });
  const topInputs = Object.entries(inputCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([input, count]) => ({ input, count }));

  // ---- UI ----

  if (loading) return (
    <div className="admin-page">
      <AdminNavbar onLogout={onLogout} />
      <h2>Analytics</h2>
      <div style={{textAlign: "center", margin: "2rem"}}>Loading analytics…</div>
    </div>
  );

  return (
    <div className="admin-page">
      <AdminNavbar onLogout={onLogout} />
      <h2>Advanced Analytics</h2>

      <div className="analytics-charts-grid">

        {/* Queries over time */}
        <div className="analytics-chart-block">
          <h4>Query Volume Over Time</h4>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={queriesOverTime}>
              <XAxis dataKey="date" tickFormatter={formatDate} />
              <YAxis allowDecimals={false}/>
              <Tooltip />
              <CartesianGrid stroke="#eee"/>
              <Line type="monotone" dataKey="count" stroke="#008080" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Verdict label histogram */}
        <div className="analytics-chart-block">
          <h4>AI Verdict Distribution</h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={labelHist}>
              <XAxis dataKey="label" />
              <YAxis allowDecimals={false}/>
              <Tooltip />
              <Bar dataKey="count" fill="#345bff">
                {labelHist.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Confidence histogram */}
        <div className="analytics-chart-block">
          <h4>Model Confidence Histogram</h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={confidenceData}>
              <XAxis dataKey="range" />
              <YAxis allowDecimals={false}/>
              <Tooltip />
              <Bar dataKey="count" fill="#e3a21a"/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Duration histogram */}
        <div className="analytics-chart-block">
          <h4>Response Time Histogram</h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={durationData}>
              <XAxis dataKey="range" />
              <YAxis allowDecimals={false}/>
              <Tooltip />
              <Bar dataKey="count" fill="#888"/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Feedback sentiment pie */}
        <div className="analytics-chart-block">
          <h4>User Feedback Sentiment</h4>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={sentimentData} dataKey="value" nameKey="name" outerRadius={70}>
                {sentimentData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend/>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Agreement rate */}
        <div className="analytics-chart-block">
          <h4>User Agreement Rate</h4>
          <div style={{ fontSize: 34, color: agreementRate > 70 ? "#22a66a" : "#d7263d", fontWeight: 600, textAlign: "center" }}>
            {agreementRate}% <span style={{ fontSize: 16, fontWeight: 400 }}>user agreement</span>
          </div>
        </div>

        {/* Top Inputs */}
        <div className="analytics-chart-block">
          <h4>Top Queried Inputs</h4>
          <ul style={{paddingLeft: 18}}>
            {topInputs.map((t, i) => (
              <li key={i}><strong>{t.input}</strong> &mdash; {t.count} queries</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}