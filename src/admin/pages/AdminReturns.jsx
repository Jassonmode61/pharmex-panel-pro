// src/admin/pages/AdminReturns.jsx
import React, { useEffect, useState } from "react";
import { getAllReturns, approveReturn as mockApprove, revokeReturn as mockRevoke } from "../lib/adminData";
import { getReturnsAPI, approveReturnAPI, revokeReturnAPI } from "../../api/http";

function StatusBadge({ status }) {
  const cls =
    status === "approved" ? "badge ok" :
    status === "pending"  ? "badge warn" : "badge";
  const label =
    status === "approved" ? "Onaylı" :
    status === "pending"  ? "Bekliyor" : status;
  return <span className={cls}>{label}</span>;
}

export default function AdminReturns() {
  const [rows, setRows]   = useState([]);
  const [loading, setL]   = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setL(true); setError("");
    try {
      // 1) Gerçek API
      const data = await getReturnsAPI(); // [{id, orderId, reason, createdAt, status}, ...]
      setRows(data);
    } catch (e) {
      // 2) API yoksa mock’a düş
      console.warn("API erişilemedi, mock'a düşüyorum:", e?.message);
      setRows(getAllReturns());
    } finally {
      setL(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function onApprove(id) {
    try {
      await approveReturnAPI(id);
      await load();
    } catch {
      // Mock fallback
      setRows(mockApprove(id));
    }
  }

  async function onRevoke(id) {
    try {
      await revokeReturnAPI(id);
      await load();
    } catch {
      // Mock fallback
      setRows(mockRevoke(id));
    }
  }

  return (
    <section className="page-block">
      <h2 className="page-title">İadeler (Admin)</h2>

      {loading && <div style={{opacity:.7, padding:8}}>Yükleniyor…</div>}
      {error   && <div className="alert error">{error}</div>}

      <div className="table-wrap" style={{ marginTop: 12 }}>
        <table>
          <thead>
            <tr>
              <th>İade No</th>
              <th>Sipariş</th>
              <th>Tarih</th>
              <th>Neden</th>
              <th>Durum</th>
              <th style={{ width: 260 }}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.orderId}</td>
                <td>{new Date(r.createdAt).toLocaleString("tr-TR")}</td>
                <td>{r.reason}</td>
                <td><StatusBadge status={r.status} /></td>
                <td>
                  <div style={{ display:"flex", gap:8 }}>
                    <button className="btn success" onClick={() => onApprove(r.id)}>
                      Onayla
                    </button>
                    <button className="btn danger" onClick={() => onRevoke(r.id)}>
                      Onayı Kaldır
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr><td colSpan={6} style={{ opacity:.7, padding:16 }}>Kayıt yok.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}