// src/utils/theme.js
const KEY = "stx-theme";            // "dark" | "light" | "sys"
let mql = null;                     // matchMedia listener referansı

function setClass(cls) {
  const root = document.documentElement;
  root.classList.remove("dark", "light");
  if (cls) root.classList.add(cls);
}

function apply(theme) {
  // Sistem (OS) takibi
  if (theme === "sys") {
    if (mql) { try { mql.removeEventListener("change", handleSys); } catch {}
               try { mql.onchange = null; } catch {} }
    mql = window.matchMedia("(prefers-color-scheme: dark)");
    setClass(mql.matches ? "dark" : "light");
    try { mql.addEventListener("change", handleSys); }
    catch { mql.onchange = handleSys; } // Safari fallback
  } else {
    // manuel tema
    if (mql) { try { mql.removeEventListener("change", handleSys); } catch {}
               try { mql.onchange = null; } catch {} mql = null; }
    setClass(theme === "dark" ? "dark" : "light");
  }
}

function handleSys(e) {
  setClass(e.matches ? "dark" : "light");
}

export function initThemeFromStorage() {
  const saved = localStorage.getItem(KEY);
  const theme = saved ? JSON.parse(saved) : "dark";
  apply(theme);
}

export function setTheme(theme) {
  localStorage.setItem(KEY, JSON.stringify(theme));
  apply(theme);
}