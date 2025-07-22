// src/App.js
import React, { useState } from "react";
import ArticleForm from "./components/ArticleForm";
import ArticleResult from "./components/ArticleResult";
import QueryHistory from "./components/QueryHistory";
import axios from "axios";

function App() {
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // Set document title/SEO (basic)
  React.useEffect(() => {
    document.title = "News Summarizer & Fake News Detector";
    // You can set meta tags via <meta name="description" ...> in public/index.html
  }, []);

  const handleResult = async (input) => {
    setLoading(true);
    setErr("");
    setResult(null);
    try {
      const res = await axios.post("https://news-summarizer-ai-backend.onrender.com/api/analyze/", input);
      setResult(res.data);
      setHistory([res.data, ...history]);
    } catch (e) {
      let msg = e.response?.data?.error || "Sorry, something went wrong.";
      if (msg.includes("Could not extract text")) {
        msg += " Some sites (like paywalled/news) can’t be fetched. Try another link or paste the article text!";
      }
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (feedbackData) => {
    try {
      await axios.post("https://news-summarizer-ai-backend.onrender.com/api/feedback/", feedbackData);
      alert("Thanks for your feedback!");
    } catch {
      alert("Could not send feedback. Please try again later.");
    }
  };

  return (
    <div className="main-container">
      <header>
        <h1>📰 News Summarizer & Fake News Detector</h1>
        <p className="tagline">Summarize news & assess credibility instantly with AI.</p>
      </header>
      <div className="disclaimer">
        <strong>Disclaimer:</strong> This tool uses public AI models for demonstration. Results may be inaccurate. Always check original sources and use your own judgment!
      </div>
      {err && <div className="error-msg">{err}</div>}
      <ArticleForm onResult={handleResult} loading={loading} />
      {loading && <div style={{ textAlign: "center", marginTop: 16 }}>🔄 Analyzing article, please wait...</div>}
      {result && <ArticleResult data={result} onFeedback={handleFeedback} />}
      {history.length > 0 && <QueryHistory history={history} />}
      <footer>
        <p>Made with 💡 using Django, React, Transformers</p>
      </footer>
    </div>
  );
}
export default App;