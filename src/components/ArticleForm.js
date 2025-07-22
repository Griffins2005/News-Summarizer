// src/components/ArticleForm.js
import React, { useEffect, useState } from "react";
import axios from "axios";

function ArticleForm({ onResult }) {
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "News Summarizer & Fake News Detector";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = "Summarize news & assess credibility instantly with AI.";
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    onResult(null); // CLEAR previous results on every submit!
    try {
      // Validation in frontend before sending:
      if (!url.trim() && !text.trim()) {
        setError("Please enter a news URL or article text.");
        setLoading(false);
        return;
      }
      const res = await axios.post("https://news-summarizer-ai-backend.onrender.com/api/analyze/", {
        url: url.trim() || undefined,
        text: text.trim() || undefined,
      });
      onResult(res.data);
      setError(""); // Clear error if successful
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Sorry, something went wrong. Please check your input or try again.");
      }
      onResult(null); // Clear result if there's an error
    }
    setLoading(false);
  };

  return (
    <form className="article-form" onSubmit={submit} aria-label="Summarize news form">
      <input
        type="url"
        placeholder="Paste article URL (optional)"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <div className="or">OR</div>
      <textarea
        placeholder="Paste or type article text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
      />
      <button disabled={loading}>
        {loading ? "Analyzing..." : "Analyze"}
      </button>
      {error && <div className="error" aria-live="polite">{error}</div>}
    </form>
  );
}

export default ArticleForm;