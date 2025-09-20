import React, { useMemo, useState } from "react";

const INITIAL = [
  { id: 1, ad: "Ayşe Yılmaz", email: "ayse@example.com", tel: "0532 000 0011", rol: "Satıcı", durum: "Aktif" },
  { id: 2, ad: "Mehmet Demir", email: "mehmet@example.com", tel: "0533 000 0022", rol: "Satıcı", durum: "Aktif" },
  { id: 3, ad: "Elif Kaya", email: "elif@example.com", tel: "0544 000 0033", rol: "Destek", durum: "Pasif" },
  { id: 4, ad: "Kerem Ak",  email: "kerem@example.com", tel: "0555 000 0044", rol: "Satıcı", durum: "Aktif" },
];

const ROLLER = ["Satıcı", "Destek", "Admin"];
const DURUMLAR = ["Aktif", "Pasif"];

export default function Users() {
  const [rows, setRows] = useState(INITIAL);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [edit, setEdit] = useState(null);

  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    if (!n) return rows;
    return rows.filter(r =>
      String(r.id).includes(n) ||
      r.ad.toLowerCase().includes(n) ||
      r.email.toLowerCase().includes(n) ||
      r.tel.toLowerCase().includes(n) ||
      r.rol.toLowerCase().includes(n)
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
    setRows(prev => prev.map(p => p.id === edit.id ? { ...edit } : p));
    closeEdit();
  }
  function toggleDurum(id){
    setRows(prev => prev.map(p => p.id === id ? { ...p, durum: p.durum === "Aktif" ? "Pasif" : "Aktif" } : p));
  }
  function removeUser(id){
    setRows(prev => prev.filter(p => p.id !== id));
  }

  return (
    <div className="card">
      <div className="card-title-row">
        <h2 className="card-title">Kullanıcılar</h2>
        <input className="input" placeholder="Ara: ad, email, rol…"
               value={q} onChange={e=>{ setQ(e.target.value); setPage(1); }}
               style={{width:260}}/>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th><th>Ad Soyad</th><th>Email</th><th>Telefon</th><th>Rol</th><th>Durum</th><th style={{width:220}}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map(r=>(
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.ad}</td>
                <td>{r.email}</td>
                <td>{r.tel}</td>
                <td>{r.rol}</td>
                <td><span className={`badge ${r.durum === "Aktif" ? "green" : "red"}`}>{r.durum}</span></td>
                <td>
                  <div style={{display:"flex",gap:8}}>
                    <button className="btn sm" onClick={()=>openEdit(r)}>Düzenle</button>
                    <button className="btn sm ghost" onClick={()=>toggleDurum(r.id)}>
                      {r.durum === "Aktif" ? "Pasifleştir" : "Aktifleştir"}
                    </button>
                    <button className="btn sm danger" onClick={()=>removeUser(r.id)}>Sil</button>
                  </div>
                </td>
              </tr>
            ))}
            {pageItems.length===0 && (
              <tr><td colSpan={7} style={{color:"#94a3b8",textAlign:"center",padding:24}}>Kayıt bulunamadı.</td></tr>
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
            <div className="modal-head">Düzenle</div>
            <div className="modal-body">
              <div className="modal-form">
                <div className="row">
                  <label><span>Ad Soyad</span>
                    <input value={edit.ad} onChange={e=>setEdit({...edit, ad:e.target.value})}/>
                  </label>
                  <label><span>Email</span>
                    <input type="email" value={edit.email} onChange={e=>setEdit({...edit, email:e.target.value})}/>
                  </label>
                </div>
                <div className="row">
                  <label><span>Telefon</span>
                    <input value={edit.tel} onChange={e=>setEdit({...edit, tel:e.target.value})}/>
                  </label>
                  <label><span>Rol</span>
                    <select value={edit.rol} onChange={e=>setEdit({...edit, rol:e.target.value})}>
                      {ROLLER.map(r=><option key={r} value={r}>{r}</option>)}
                    </select>
                  </label>
                </div>
                <div className="row">
                  <label><span>Durum</span>
                    <select value={edit.durum} onChange={e=>setEdit({...edit, durum:e.target.value})}>
                      {DURUMLAR.map(d=><option key={d} value={d}>{d}</option>)}
                    </select>
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