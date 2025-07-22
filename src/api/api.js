// src/api/api.js
const API_BASE = "http://localhost:8000/api/";

export async function analyzeArticle({ url, text }) {
  const res = await fetch(API_BASE + "analyze/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url, text }),
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Failed to analyze article");
  }
  return res.json();
}

// Add login/register endpoints here for future
