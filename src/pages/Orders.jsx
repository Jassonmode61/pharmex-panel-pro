import React, { useMemo, useState } from "react";

const INITIAL = [
  { id: 101, musteri: "Ayşe Yılmaz", tutar: 250, durum: "Hazırlanıyor", tarih: "2025-09-10" },
  { id: 102, musteri: "Mehmet Demir", tutar: 320, durum: "Reddedildi",  tarih: "2025-09-09" },
  { id: 103, musteri: "Elif Kaya",     tutar: 180, durum: "Hazırlanıyor", tarih: "2025-09-08" },
  { id: 104, musteri: "Kerem Ak",      tutar: 600, durum: "Tamamlandı",   tarih: "2025-09-08" },
];

const DURUMLAR = ["Hazırlanıyor", "Tamamlandı", "Reddedildi"];

export default function Orders() {
  const [data, setData] = useState(INITIAL);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [edit, setEdit] = useState(null);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return data;
    return data.filter(
      (r) =>
        String(r.id).includes(needle) ||
        r.musteri.toLowerCase().includes(needle) ||
        String(r.tutar).includes(needle) ||
        r.durum.toLowerCase().includes(needle)
    );
  }, [data, q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  function openEdit(row) {
    setEdit({ ...row });
  }
  function closeEdit() {
    setEdit(null);
  }
  function saveEdit() {
    setData((prev) => prev.map((r) => (r.id === edit.id ? { ...edit, tutar: Number(edit.tutar) || 0 } : r)));
    closeEdit();
  }

  return (
    <div className="card">
      <div className="card-title-row">
        <h2 className="card-title">Siparişler</h2>
        <input
          className="input"
          placeholder="Ara: ID, müşteri…"
          value={q}
          onChange={(e) => { setQ(e.target.value); setPage(1); }}
          style={{ width: 260 }}
        />
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Müşteri</th>
              <th>Tutar</th>
              <th>Durum</th>
              <th>Tarih</th>
              <th style={{ width: 110 }}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.musteri}</td>
                <td>₺{r.tutar}</td>
                <td>
                  <span className={`badge ${r.durum === "Tamamlandı" ? "green" : r.durum === "Reddedildi" ? "red" : "amber"}`}>
                    {r.durum}
                  </span>
                </td>
                <td>{r.tarih}</td>
                <td>
                  <button className="btn sm" onClick={() => openEdit(r)}>Düzenle</button>
                </td>
              </tr>
            ))}
            {pageItems.length === 0 && (
              <tr><td colSpan={6} style={{ color: "#94a3b8", textAlign: "center", padding: 24 }}>Kayıt bulunamadı.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button className="btn ghost sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>‹ Önceki</button>
        <span className="page-info">Sayfa {page} / {totalPages}</span>
        <button className="btn ghost sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Sonraki ›</button>
      </div>

      {/* Modal */}
      {edit && (
        <div className="modal-backdrop" onMouseDown={closeEdit}>
          <div className="modal-card" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-head">Düzenle: {edit.id}</div>
            <div className="modal-body">
              <div className="modal-form">
                <div className="row">
                  <label>
                    <span>Müşteri</span>
                    <input value={edit.musteri} onChange={(e) => setEdit({ ...edit, musteri: e.target.value })} />
                  </label>
                  <label>
                    <span>Tutar</span>
                    <input type="number" value={edit.tutar} onChange={(e) => setEdit({ ...edit, tutar: e.target.value })} />
                  </label>
                </div>
                <div className="row">
                  <label>
                    <span>Durum</span>
                    <select value={edit.durum} onChange={(e) => setEdit({ ...edit, durum: e.target.value })}>
                      {DURUMLAR.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </label>
                  <label>
                    <span>Tarih</span>
                    <input type="date" value={edit.tarih} onChange={(e) => setEdit({ ...edit, tarih: e.target.value })} />
                  </label>
                </div>
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn ghost" onClick={closeEdit}>İptal</button>
              <button className="btn primary" onClick={saveEdit}>Kaydet</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}