import React, { useMemo, useState } from "react";

const PRODUCTS = Array.from({ length: 55 }, (_, i) => ({
  sku: `PX-${1000 + i}`,
  ad: `Ürün ${i + 1}`,
  fiyat: 50 + i * 7 + (i % 3) * 2,  // demo
  stok: 20 + i
}));

export default function Catalog() {
  const [rows, setRows] = useState(PRODUCTS);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [edit, setEdit] = useState(null);

  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    if (!n) return rows;
    return rows.filter(r =>
      r.sku.toLowerCase().includes(n) ||
      r.ad.toLowerCase().includes(n)
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
    setRows(prev => prev.map(p => p.sku === edit.sku ? { ...edit, fiyat: Number(edit.fiyat)||0, stok: Number(edit.stok)||0 } : p));
    closeEdit();
  }

  return (
    <div className="card">
      <div className="card-title-row">
        <h2 className="card-title">Katalog</h2>
        <input
          className="input"
          placeholder="Ara: SKU veya ad…"
          value={q}
          onChange={(e) => { setQ(e.target.value); setPage(1); }}
          style={{ width: 260 }}
        />
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Ad</th>
              <th>Fiyat</th>
              <th>Stok</th>
              <th style={{ width: 110 }}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((r) => (
              <tr key={r.sku}>
                <td>{r.sku}</td>
                <td>{r.ad}</td>
                <td>₺{r.fiyat.toFixed(2)}</td>
                <td>{r.stok}</td>
                <td><button className="btn sm" onClick={() => openEdit(r)}>Düzenle</button></td>
              </tr>
            ))}
            {pageItems.length === 0 && (
              <tr><td colSpan={5} style={{ color:"#94a3b8", textAlign:"center", padding:24 }}>Kayıt bulunamadı.</td></tr>
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
            <div className="modal-head">Düzenle: {edit.sku}</div>
            <div className="modal-body">
              <div className="modal-form">
                <div className="row">
                  <label>
                    <span>SKU</span>
                    <input value={edit.sku} disabled />
                  </label>
                  <label>
                    <span>Ad</span>
                    <input value={edit.ad} onChange={(e)=>setEdit({...edit, ad:e.target.value})}/>
                  </label>
                </div>
                <div className="row">
                  <label>
                    <span>Fiyat (₺)</span>
                    <input type="number" step="0.01" value={edit.fiyat} onChange={(e)=>setEdit({...edit, fiyat:e.target.value})}/>
                  </label>
                  <label>
                    <span>Stok</span>
                    <input type="number" value={edit.stok} onChange={(e)=>setEdit({...edit, stok:e.target.value})}/>
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