//src/components/ArticleResult.js
import React, { useEffect, useState } from "react";

function getConfidenceColor(label) {
  if (label === "REAL NEWS") return "#22a66a";
  if (label === "FAKE NEWS") return "#d7263d";
  if (label === "OPINION" || label === "SATIRE") return "#e3a21a";
  return "#888";
}

function ArticleResult({ data, onFeedback }) {
  const { title, author, published_date, summary, fake_news_label, fake_news_confidence, details } = data;
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = "AI Result – News Summarizer";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await onFeedback({
        title,
        fake_news_label,
        user_feedback: comment || "No comment",
      });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setComment("");
    } catch {
      setSubmitted(false);
      alert("Could not send feedback. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="article-result" aria-labelledby="ai-result-header">
      <h2 id="ai-result-header">Result</h2>
      <div className="result-info">
        {title && <div><strong>Title:</strong> {title}</div>}
        {author && <div><strong>Author:</strong> {author}</div>}
        {published_date && <div><strong>Published:</strong> {published_date}</div>}
      </div>
      <div className="summary-block">
        <strong>AI Summary:</strong>
        <p>{summary}</p>
      </div>
      <div className={`fake-label ${fake_news_label?.toLowerCase()}`} style={{ color: getConfidenceColor(fake_news_label) }}>
        <strong>Credibility:</strong> <span>{fake_news_label}</span>
        <span className="confidence">({fake_news_confidence}% confident)</span>
        <div style={{ height: "8px", width: "100%", background: "#f3f3f3", borderRadius: "5px", marginTop: "6px" }}>
          <div style={{
            height: "8px",
            width: `${fake_news_confidence}%`,
            background: getConfidenceColor(fake_news_label),
            borderRadius: "5px",
            transition: "width 0.5s"
          }} />
        </div>
      </div>
      {details &&
        <div className="detail-block" style={{ marginTop: 8, fontSize: "0.95rem", color: "#777" }}>
          <small>
            <b>AI Model:</b> NLI: <span>{details.nli_label} ({details.nli_confidence}%)</span>
            {details.sentiment && <>
              &nbsp;|&nbsp; Sentiment: <span>{details.sentiment} ({details.sentiment_score}%)</span>
            </>}
          </small>
        </div>
      }
      <form className="feedback-block" onSubmit={handleSubmit} aria-label="Feedback form" style={{ marginTop: 16 }}>
        <label htmlFor="feedback-comment" style={{ display: "block", fontWeight: 500, marginBottom: 4 }}>
          Was this prediction helpful? Let us know!
        </label>
        <textarea
          id="feedback-comment"
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Any comments, corrections, or suggestions? (Optional)"
          rows={3}
          style={{ width: "100%", borderRadius: "8px", padding: "8px", border: "1.5px solid #dde0ef", fontSize: "1rem", marginBottom: 6 }}
          aria-label="Feedback comment"
        />
        <button
          type="submit"
          className="feedback-btn"
          disabled={submitting}
          aria-disabled={submitting}
        >
          {submitting ? "Sending..." : "Submit Feedback"}
        </button>
        {submitted && <span className="feedback-thankyou" style={{ color: "#217e43", marginLeft: 14 }}>Thank you for your feedback!</span>}
      </form>
    </section>
  );
}

export default ArticleResult;