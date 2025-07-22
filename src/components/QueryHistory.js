import React from "react";

function QueryHistory({ history }) {
  return (
    <section className="query-history">
      <h3>Recent Analyses</h3>
      <ul>
        {history.map((item, idx) => (
          <li key={idx}>
            <strong>{item.title || "Untitled"}</strong>
            <span className="fake-label" style={{fontWeight: 600, marginLeft: 10}}>
              {item.fake_news_label} ({item.fake_news_confidence}%)
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
export default QueryHistory;
