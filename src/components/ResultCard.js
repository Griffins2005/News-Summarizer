// src/components/ResultCard.jsx
import React from "react";

const ResultCard = ({ result, onSave, onRemove, showSave, showRemove }) => {
  return (
    <div className="result-card">
      <div className="meta">
        {result.title && <h3>{result.title}</h3>}
        {result.author && <div className="author">By {result.author}</div>}
        {result.published_date && <div className="date">{result.published_date}</div>}
      </div>
      <div className="summary">
        <strong>Summary:</strong>
        <p>{result.summary}</p>
      </div>
      <div className="fake-news">
        <strong>Credibility:</strong>{" "}
        <span className={`label label-${result.label.toLowerCase()}`}>
          {result.label} ({result.confidence}%)
        </span>
      </div>
      {showSave && (
        <button className="btn btn-save" onClick={() => onSave(result)}>
          Save to History
        </button>
      )}
      {showRemove && (
        <button className="btn btn-remove" onClick={() => onRemove(result)}>
          Remove
        </button>
      )}
    </div>
  );
};

export default ResultCard;
