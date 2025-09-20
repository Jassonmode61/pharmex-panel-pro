import React, { useState, useMemo } from "react";
import Modal from "../components/Modal";
import Pagination from "../components/Pagination";
import exportCsv from "../utils/exportCsv";

const INITIAL_PRODUCTS = [
  { id: 1, name: "Ağrı Kesici", price: 50, stock: 100, active: true },
  { id: 2, name: "Vitamin C", price: 80, stock: 200, active: true },
  { id: 3, name: "Soğuk Algınlığı Şurubu", price: 120, stock: 50, active: false },
  { id: 4, name: "Bebek Bezi", price: 150, stock: 300, active: true },
  { id: 5, name: "Göz Damlası", price: 65, stock: 75, active: true },
  { id: 6, name: "Cilt Kremi", price: 95, stock: 40, active: false },
];

export default function Products() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 6;

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) || String(p.id).includes(q)
    );
  }, [products, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openNew = () => {
    setEditing({ id: null, name: "", price: 0, stock: 0, active: true });
    setOpen(true);
  };
  const openEdit = (row) => {
    setEditing({ ...row });
    setOpen(true);
  };
  const closeModal = () => setOpen(false);

  const saveProduct = () => {
    setProducts((prev) => {
      if (editing.id == null) {
        const nextId = prev.length ? Math.max(...prev.map((p) => p.id)) + 1 : 1;
        return [...prev, { ...editing, id: nextId }];
      }
      return prev.map((p) => (p.id === editing.id ? { ...editing } : p));
    });
    setOpen(false);
  };

  const toggleActive = (id) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, active: !p.active } : p
      )
    );
  };

  const removeProduct = (id) => {
    if (!confirm("Bu ürün silinsin mi?")) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const exportProducts = () => {
    exportCsv(
      "urunler.csv",
      filtered.map((p) => ({
        ID: p.id,
        Ürün: p.name,
        Fiyat: p.price,
        Stok: p.stock,
        Aktif: p.active ? "Evet" : "Hayır",
      }))
    );
  };

  return (
    <div className="page-wrap">
      <div className="page-topbar">
        <h1 className="page-title">Ürünler</h1>
        <div className="page-actions">
          <input
            className="input search"
            placeholder="Ara: ürün adı veya ID…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />
          <button className="btn secondary" onClick={exportProducts}>
            CSV İndir
          </button>
          <button className="btn primary" onClick={openNew}>
            Yeni Ürün
          </button>
        </div>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ürün Adı</th>
              <th>Fiyat</th>
              <th>Stok</th>
              <th>Durum</th>
              <th style={{ width: 210, textAlign: "right" }}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>₺{p.price}</td>
                <td>{p.stock}</td>
                <td>
                  <span className={`badge ${p.active ? "success" : "danger"}`}>
                    {p.active ? "Aktif" : "Pasif"}
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <div className="row-actions">
                    <button className="btn xs" onClick={() => openEdit(p)}>
                      Düzenle
                    </button>
                    <button className="btn xs" onClick={() => toggleActive(p.id)}>
                      {p.active ? "Pasifleştir" : "Aktifleştir"}
                    </button>
                    <button className="btn xs danger" onClick={() => removeProduct(p.id)}>
                      Sil
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {currentRows.length === 0 && (
              <tr>
                <td colSpan={6} className="empty">Kayıt yok.</td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination page={page} total={totalPages} onChange={setPage} />
      </div>

      {open && (
        <Modal open={open} onClose={closeModal} title={editing?.id ? "Ürün Düzenle" : "Yeni Ürün"}>
          <div className="form-grid">
            <label className="form-field">
              <span>Ürün Adı</span>
              <input
                className="input"
                value={editing.name}
                onChange={(e) =>
                  setEditing((s) => ({ ...s, name: e.target.value }))
                }
              />
            </label>
            <label className="form-field">
              <span>Fiyat</span>
              <input
                className="input"
                type="number"
                value={editing.price}
                onChange={(e) =>
                  setEditing((s) => ({ ...s, price: Number(e.target.value) }))
                }
              />
            </label>
            <label className="form-field">
              <span>Stok</span>
              <input
                className="input"
                type="number"
                value={editing.stock}
                onChange={(e) =>
                  setEditing((s) => ({ ...s, stock: Number(e.target.value) }))
                }
              />
            </label>
            <label className="form-field row">
              <input
                type="checkbox"
                checked={!!editing.active}
                onChange={(e) =>
                  setEditing((s) => ({ ...s, active: e.target.checked }))
                }
              />
              <span style={{ marginLeft: 8 }}>Aktif</span>
            </label>
          </div>
          <div className="modal-footer">
            <button className="btn" onClick={closeModal}>
              Vazgeç
            </button>
            <button className="btn primary" onClick={saveProduct}>
              Kaydet
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}