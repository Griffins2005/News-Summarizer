// src/components/ArticleForm.js
import React, { useEffect, useState } from "react";
import axios from "axios";

function ArticleForm({ onResult, onError, setLoading, clearInputsFlag }) {
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [loadingLocal, setLoadingLocal] = useState(false); // FIXED NAME
  const [error, setError] = useState("");

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
      <button disabled={loadingLocal}>
        {loadingLocal ? "Analyzing..." : "Analyze"}
      </button>
      {error && <div className="error" aria-live="polite">{error}</div>}
    </form>
  );
}

export default ArticleForm;