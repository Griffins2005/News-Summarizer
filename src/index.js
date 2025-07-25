// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import RootRoutes from "./RootRoute";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RootRoutes />
  </React.StrictMode>
);