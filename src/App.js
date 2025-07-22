// src/App.js
// src/App.js
import React, { useState } from "react";
import ArticleForm from "./components/ArticleForm";
import ArticleResult from "./components/ArticleResult";
import QueryHistory from "./components/QueryHistory";

function App() {
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // For SEO
  React.useEffect(() => {
    document.title = "News Summarizer & Fake News Detector";
  }, []);

  // Called by ArticleForm when a result (or error) comes back
  const handleResult = (data) => {
    setResult(data);
    setErr("");
    if (data) {
      setHistory([data, ...history]);
    }
  };

  const handleError = (msg) => {
    setErr(msg);
    setResult(null);
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
      <ArticleForm onResult={handleResult} onError={handleError} setLoading={setLoading} />
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