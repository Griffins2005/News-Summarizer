// src/components/ArticleForm.js
import React, { useEffect, useState } from "react";
import axios from "axios";

function ArticleForm({ onResult, onError, setLoading, clearInputsFlag }) {
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [loadingLocal, setLoadingLocal] = useState(false);
  const [error, setError] = useState("");

  // Clear inputs on successful analyze from parent flag
  useEffect(() => {
    if (clearInputsFlag) {
      setUrl("");
      setText("");
    }
  }, [clearInputsFlag]);

  useEffect(() => {
    document.title = "News Summarizer & Fake News Detector";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = "Summarize news & assess credibility instantly with AI.";
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setLoading?.(true);
    setLoadingLocal(true);
    setError("");
    try {
      const res = await axios.post("https://news-summarizer-ai-backend.onrender.com/api/analyze/", {
        url: url.trim() || undefined,
        text: text.trim() || undefined,
      });
      onResult(res.data);
    } catch (err) {
      const msg = err.response?.data?.error || "Sorry, something went wrong. Please check your input or try again.";
      setError(msg);
      onError?.(msg);
    }
    setLoading?.(false);
    setLoadingLocal(false);
  };

  return (
    <section className="article-form-section">
      <h2 className="article-form-title">
        <span className="emoji" role="img" aria-label="newspaper" style={{marginRight: 8, fontSize: "1.5em"}}>📰</span>
        News Summarizer &amp; Fake News Detector
      </h2>
      <p className="article-form-desc">
        Paste a news article URL <b>or</b> the article text below.<br/>
        You'll get a summary and a credibility verdict in seconds.
      </p>
      <div className="disclaimer" style={{marginTop:"18px"}}>
        <strong>Disclaimer:</strong> This tool uses public AI models for demonstration. Results may be inaccurate.<br />
        Always check original sources and use your own judgment.
      </div>
      <form className="article-form" onSubmit={submit} aria-label="Summarize news form">
        {/* Error goes HERE above inputs */}
        {error && (
          <div className="error" aria-live="polite" style={{marginBottom: '6px', marginTop: '-10px'}}>
            {error}
          </div>
        )}
        <input
          type="url"
          placeholder="Paste article URL (optional)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loadingLocal}
          autoFocus
        />
        <div className="or">OR</div>
        <textarea
          placeholder="Paste or type article text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          disabled={loadingLocal}
        />
        <button disabled={loadingLocal}>
          {loadingLocal ? "Analyzing..." : "Analyze"}
        </button>
      </form>
    </section>
  );
}

export default ArticleForm;