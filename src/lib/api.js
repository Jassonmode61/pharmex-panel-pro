// src/lib/api.js
const BASE = import.meta.env.VITE_API_URL || "/api";

/** basit GET */
export async function apiGet(path, opts = {}) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), opts.timeout ?? 12000);
  try {
    const res = await fetch(BASE + path, {
      headers: { "Accept": "application/json" },
      signal: ctrl.signal,
      credentials: "same-origin",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(id);
  }
}

/** basit POST */
export async function apiPost(path, data = {}, opts = {}) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), opts.timeout ?? 12000);
  try {
    const res = await fetch(BASE + path, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(data),
      signal: ctrl.signal,
      credentials: "same-origin",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(id);
  }
}