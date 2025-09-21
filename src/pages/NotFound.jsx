// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="card" style={{ padding: "32px" }}>
      <h1 style={{ marginBottom: 8 }}>404</h1>
      <p>Aradığın sayfa bulunamadı.</p>
      <p style={{ marginTop: 16 }}>
        <Link to="/">⟵ Ana sayfaya dön</Link>
      </p>
    </div>
  );
}