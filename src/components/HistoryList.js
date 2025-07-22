// src/components/HistoryList.jsx
import React from "react";
import ResultCard from "./ResultCard";

const HistoryList = ({ history, onRemove }) => (
  <div className="history-list">
    <h2>Query History</h2>
    {history.length === 0 && <div className="empty">No history yet.</div>}
    {history.map((item, idx) => (
      <ResultCard
        key={idx}
        result={item}
        showRemove
        onRemove={onRemove}
      />
    ))}
  </div>
);

export default HistoryList;
