import React, { useMemo, useState } from "react";

const SAMPLE = [
  { id: 201, siparisId: 101, musteri: "Ayşe Yılmaz",  tutar: 120,  durum: "İnceleniyor",   tarih: "2025-09-10" },
  { id: 202, siparisId: 104, musteri: "Kerem Ak",     tutar: 600,  durum: "Onaylandı",     tarih: "2025-09-09" },
  { id: 203, siparisId: 102, musteri: "Mehmet Demir", tutar: 320,  durum: "Reddedildi",    tarih: "2025-09-08" },
  { id: 204, siparisId: 103, musteri: "Elif Kaya",    tutar: 180,  durum: "İnceleniyor",   tarih: "2025-09-08" },
];
const DURUMLAR = ["İnceleniyor", "Onaylandı", "Reddedildi"];

export default function Returns() {
  const [rows, setRows] = useState(SAMPLE);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [edit, setEdit] = useState(null);

  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    if (!n) return rows;
    return rows.filter(r =>
      String(r.id).includes(n) ||
      String(r.siparisId).includes(n) ||
      r.musteri.toLowerCase().includes(n) ||
      r.durum.toLowerCase().includes(n)
    );
  }, [rows, q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  function openEdit(r){ setEdit({ ...r }); }
  function closeEdit(){ setEdit(null); }
  function saveEdit(){
    setRows(prev => prev.map(p => p.id === edit.id ? { ...edit, tutar: Number(edit.tutar)||0 } : p));
    closeEdit();
  }

  return (
    <div className="card">
      <div className="card-title-row">
        <h2 className="card-title">İadeler</h2>
        <input
          className="input"
          placeholder="Ara: İade ID, Sipariş ID, müşteri…"
          value={q}
          onChange={(e)=>{ setQ(e.target.value); setPage(1); }}
          style={{ width: 280 }}
        />
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>İade ID</th>
              <th>Sipariş ID</th>
              <th>Müşteri</th>
              <th>Tutar</th>
              <th>Durum</th>
              <th>Tarih</th>
              <th style={{width:110}}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map(r=>(
              <tr key={r.id}>
                <td>#{r.id}</td>
                <td>#{r.siparisId}</td>
                <td>{r.musteri}</td>
                <td>₺{r.tutar}</td>
                <td>
                  <span className={`badge ${
                    r.durum === "Onaylandı" ? "green" :
                    r.durum === "Reddedildi" ? "red" : "amber"
                  }`}>{r.durum}</span>
                </td>
                <td>{r.tarih}</td>
                <td><button className="btn sm" onClick={()=>openEdit(r)}>Düzenle</button></td>
              </tr>
            ))}
            {pageItems.length===0 && (
              <tr><td colSpan={7} style={{color:"#94a3b8",textAlign:"center",padding:24}}>Kayıt yok.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button className="btn ghost sm" disabled={page<=1} onClick={()=>setPage(p=>p-1)}>‹ Önceki</button>
        <span className="page-info">Sayfa {page} / {totalPages}</span>
        <button className="btn ghost sm" disabled={page>=totalPages} onClick={()=>setPage(p=>p+1)}>Sonraki ›</button>
      </div>

      {edit && (
        <div className="modal-backdrop" onMouseDown={closeEdit}>
          <div className="modal-card" onMouseDown={(e)=>e.stopPropagation()}>
            <div className="modal-head">İade Düzenle: #{edit.id}</div>
            <div className="modal-body">
              <div className="modal-form">
                <div className="row">
                  <label><span>Müşteri</span>
                    <input value={edit.musteri} onChange={(e)=>setEdit({...edit, musteri:e.target.value})}/>
                  </label>
                  <label><span>Tutar</span>
                    <input type="number" value={edit.tutar} onChange={(e)=>setEdit({...edit, tutar:e.target.value})}/>
                  </label>
                </div>
                <div className="row">
                  <label><span>Durum</span>
                    <select value={edit.durum} onChange={(e)=>setEdit({...edit, durum:e.target.value})}>
                      {DURUMLAR.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </label>
                  <label><span>Tarih</span>
                    <input type="date" value={edit.tarih} onChange={(e)=>setEdit({...edit, tarih:e.target.value})}/>
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