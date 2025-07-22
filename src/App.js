// src/App.js
import React, { useState } from "react";
import ArticleForm from "./components/ArticleForm";
import ArticleResult from "./components/ArticleResult";
import QueryHistory from "./components/QueryHistory";
import axios from "axios";

function App() {
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [clearInputsFlag, setClearInputsFlag] = useState(false);

  React.useEffect(() => {
    document.title = "News Summarizer & Fake News Detector";
  }, []);

  const handleResult = (data) => {
    setResult(data);
    setErr("");
    if (data) {
      setHistory([data, ...history]);
    }
    // Trigger input clear
    setClearInputsFlag(f => !f);
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
      {/* ...header, disclaimer, etc */}
      {err && <div className="error-msg">{err}</div>}
      <ArticleForm
        onResult={handleResult}
        onError={handleError}
        setLoading={setLoading}
        clearInputsFlag={clearInputsFlag}
      />
      {loading && <div style={{ textAlign: "center", marginTop: 16 }}>🔄 Analyzing article, please wait...</div>}
      {result && <ArticleResult data={result} onFeedback={handleFeedback} />}
      {history.length > 0 && <QueryHistory history={history} />}
    </div>
  );
}

export default App;