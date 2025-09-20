// src/pages/Notifications.jsx
import React, { useEffect, useMemo, useState } from "react";

// Opsiyonel yardımcılar (varsayılan projende varsa kullanılır, yoksa fallback'e düşer)
let _exportCsv = null;
let _logEvent  = null;
try { _exportCsv = (await import("../utils/exporter")).exportCsv; } catch {}
try { _logEvent  = (await import("../utils/audit")).logEvent; } catch {}

// Fallback: exporter yoksa Blob ile indir
function fallbackCsv(filename, rows) {
  const csv = rows.map(r => r.map(v => {
    const s = String(v ?? "");
    // virgül/çift tırnak/linebreak kaçışları
    const needs = /[",\n]/.test(s);
    return needs ? `"${s.replace(/"/g, '""')}"` : s;
  }).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

// Fallback: audit yoksa no-op
function logInfo(payload) {
  try { _logEvent ? _logEvent(payload) : void 0; } catch {}
}

const LS_KEY = "notifications";

// Güvenli JSON parse
function readStore() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
function writeStore(arr) {
  localStorage.setItem(LS_KEY, JSON.stringify(arr));
}

export default function Notifications() {
  // seed: bir kereye mahsus demo verisi
  useEffect(() => {
    if (!localStorage.getItem(LS_KEY)) {
      const now = Date.now();
      writeStore([
        { id: 1, title: "Yeni sipariş", body: "#106 oluşturuldu", read: false, type: "order",  ts: new Date(now).toISOString() },
        { id: 2, title: "Ödeme",        body: "Payout talebi onaylandı", read: true,  type: "payout", ts: new Date(now - 86400000).toISOString() },
      ]);
    }
  }, []);

  const [q, setQ] = useState("");
  const [list, setList] = useState(() => readStore());

  // localStorage dışarıdan değişirse (başka sekme vs.), senkron tut
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === LS_KEY) setList(readStore());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const view = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const rows = list.slice().sort((a, b) => (b.ts || "").localeCompare(a.ts || ""));
    if (!needle) return rows;
    return rows.filter((x) =>
      `${x.title} ${x.body} ${x.type}`.toLowerCase().includes(needle)
    );
  }, [list, q]);

  const save = (arr) => { writeStore(arr); setList(arr); };

  const markAll = () => {
    const next = list.map((n) => ({ ...n, read: true }));
    save(next);
    logInfo({ type: "info", message: "Tüm bildirimler okundu işaretlendi", actor: "system" });
  };

  const clearRead = () => {
    const next = list.filter((n) => !n.read);
    save(next);
    logInfo({ type: "info", message: "Okunmuş bildirimler temizlendi", actor: "system" });
  };

  const toCsv = () => {
    const rows = [
      ["id", "type", "title", "body", "read", "ts"],
      ...view.map((v) => [v.id, v.type, v.title, v.body, v.read ? "okundu" : "yeni", v.ts]),
    ];
    if (_exportCsv) _exportCsv("bildirimler.csv", rows);
    else fallbackCsv("bildirimler.csv", rows);
  };

  return (
    <div className="card">
      <div className="section-header">
        <h2 className="page-title">Bildirimler</h2>
        <div className="inline" style={{ gap: 8 }}>
          <input
            className="input"
            placeholder="Ara: tür, başlık..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{ width: 260 }}
          />
          <button className="btn ghost" onClick={toCsv}>CSV</button>
          <button className="btn" onClick={markAll}>Hepsini Okundu Yap</button>
          <button className="btn danger" onClick={clearRead}>Okunmuşları Sil</button>
        </div>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Durum</th>
              <th>Tür</th>
              <th>Başlık</th>
              <th>Mesaj</th>
              <th>Zaman</th>
              <th style={{ width: 140 }}>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {view.map((n) => (
              <tr key={n.id} style={{ opacity: n.read ? 0.7 : 1 }}>
                <td>{n.read ? "Okundu" : <span className="pill-badge">Yeni</span>}</td>
                <td>{n.type}</td>
                <td>{n.title}</td>
                <td>{n.body}</td>
                <td>{n.ts ? new Date(n.ts).toLocaleString("tr-TR") : ""}</td>
                <td className="inline" style={{ gap: 8 }}>
                  {!n.read && (
                    <button
                      className="btn success"
                      onClick={() => {
                        const next = list.map((x) => (x.id === n.id ? { ...x, read: true } : x));
                        save(next);
                      }}
                    >
                      Okundu
                    </button>
                  )}
                  <button
                    className="btn danger"
                    onClick={() => {
                      const next = list.filter((x) => x.id !== n.id);
                      save(next);
                    }}
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
            {view.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: 20, color: "#94a3b8" }}>
                  Kayıt yok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}