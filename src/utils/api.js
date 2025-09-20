// src/utils/api.js

// ---- Genel ayarlar ----
export const API_BASE =
  import.meta?.env?.VITE_API_BASE?.replace(/\/+$/, "") || "http://localhost:5174";

// ---- Fetch yardımcıları ----
async function _fetchJSON(path, opts = {}) {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const headers = new Headers(opts.headers || {});
  if (!headers.has("Accept")) headers.set("Accept", "application/json");
  if (opts.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");

  const res = await fetch(url, { credentials: "include", ...opts, headers });

  // 204 vb.
  if (res.status === 204) return null;

  const ct = res.headers.get("content-type") || "";
  const data = ct.includes("application/json") ? await res.json() : await res.text();

  if (!res.ok) {
    const msg = typeof data === "string" ? data : data?.error || res.statusText;
    const err = new Error(msg || "İstek başarısız");
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const getJSON = (path, params) => {
  if (params && typeof params === "object") {
    const qs = new URLSearchParams(params).toString();
    path += (path.includes("?") ? "&" : "?") + qs;
  }
  return _fetchJSON(path, { method: "GET" });
};

export const postJSON = (path, body) =>
  _fetchJSON(path, { method: "POST", body: JSON.stringify(body ?? {}) });

export const putJSON = (path, body) =>
  _fetchJSON(path, { method: "PUT", body: JSON.stringify(body ?? {}) });

export const delJSON = (path) => _fetchJSON(path, { method: "DELETE" });

// ---- Dosya aç / indir yardımcıları ----

// “Yeni sekmede açmayı dene; tarayıcı/Popup engellerse indirmeye düş”
function openOrDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  try {
    const win = window.open(url, "_blank");
    if (!win) {
      // popup kapalı → indir
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  } finally {
    // küçük bir gecikme ile serbest bırak
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }
}

// CSV için
export function openOrFallbackCSV(csvString, filename = "rapor.csv") {
  const blob = new Blob([csvString ?? ""], { type: "text/csv;charset=utf-8" });
  openOrDownload(blob, filename);
}

// Düz HTML için (rapor önizleme/çıktı)
export function openOrFallbackHTML(htmlString, filename = "rapor.html") {
  const blob = new Blob([htmlString ?? ""], { type: "text/html;charset=utf-8" });
  openOrDownload(blob, filename);
}

// Etiket/fiş gibi küçük HTML çıktılar için ayrı isim
export function openOrFallbackLabel(htmlString, filename = "etiket.html") {
  openOrFallbackHTML(htmlString, filename);
}

// Yeni pencerede yazdır (HTML string ver)
export function openPrintHtml(htmlString) {
  const w = window.open("", "_blank", "noopener,noreferrer");
  if (!w) {
    // popup engeli varsa dosya olarak indir
    return openOrFallbackHTML(htmlString, "cikti.html");
  }
  w.document.open();
  w.document.write(String(htmlString ?? ""));
  w.document.close();
  // bazı tarayıcılarda içerik hazır beklemek iyi olur
  w.onload = () => {
    try { w.focus(); w.print(); } catch {}
  };
}

// Base64 (data URL) görseli yazdır
export function printBase64Image(dataUrl) {
  const w = window.open("", "_blank", "noopener,noreferrer");
  if (!w) return; // engellendiyse sessizce bırak
  const img = w.document.createElement("img");
  img.src = dataUrl;
  img.style.maxWidth = "100%";
  img.onload = () => {
    w.document.close();
    try { w.focus(); w.print(); } catch {}
  };
  w.document.body.appendChild(img);
}

// Varsayılan export zorunlu değil, ama isteyenler için küçük bir obje
export default {
  API_BASE,
  getJSON,
  postJSON,
  putJSON,
  delJSON,
  openOrFallbackCSV,
  openOrFallbackHTML,
  openOrFallbackLabel,
  openPrintHtml,
  printBase64Image,
};