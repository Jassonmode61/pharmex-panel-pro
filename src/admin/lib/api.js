// src/admin/lib/api.js
// Basit fetch wrapper. .env içinden VITE_API_BASE_URL alınır.
// Ör: VITE_API_BASE_URL=https://api.ornek.com
const BASE = import.meta.env.VITE_API_BASE_URL ?? "";

function authHeaders() {
  // İstersen token’ı burada ayarla:
  // localStorage.setItem("auth.token", "JWT_veya_API_KEY");
  const t = localStorage.getItem("auth.token");
  return t ? { Authorization: `Bearer ${t}` } : {};
}

async function request(path, options = {}) {
  if (!BASE) throw new Error("API base URL bulunamadı (VITE_API_BASE_URL).");
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...(options.headers || {}),
    },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText} – ${text}`);
  }
  // Bazı PATCH/204 cevapları boş olabilir
  if (res.status === 204) return null;
  return res.json();
}

// ---- Admin uçları ----
// Backende göre pathleri burada uyarlarsın.
export const api = {
  // Siparişler
  getOrders: () => request("/admin/orders"),

  // İadeler
  getReturns: () => request("/admin/returns"),
  approveReturn: (id) =>
    request(`/admin/returns/${encodeURIComponent(id)}/approve`, {
      method: "PATCH",
      body: JSON.stringify({ status: "approved" }),
    }),
  revokeReturn: (id) =>
    request(`/admin/returns/${encodeURIComponent(id)}/revoke`, {
      method: "PATCH",
      body: JSON.stringify({ status: "pending" }),
    }),

  // Hakedişler
  getPayouts: () => request("/admin/payouts"),
  markPayoutPaid: (id) =>
    request(`/admin/payouts/${encodeURIComponent(id)}/paid`, {
      method: "PATCH",
      body: JSON.stringify({ status: "paid" }),
    }),
};

export default api;