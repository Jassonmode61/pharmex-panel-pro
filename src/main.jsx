// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";

// --- STYLES: hepsi burada toplansın ---
import "./index.css";           // reset/minimal base
import "./admin.css";           // tüm admin yerleşimi (senin büyük dosya)
import "./styles/theme.css";    // varsa
import "./styles/styles.css";   // varsa
import "./styles/modal.css";    // varsa

// İsteğe bağlı: sistem light/dark’a uysun
// document.documentElement.classList.toggle("light", window.matchMedia("(prefers-color-scheme: light)").matches);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);