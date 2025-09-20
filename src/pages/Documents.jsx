// src/pages/Documents.jsx
import React, { useState, useRef } from "react";

/**
 * Notlar
 * - KVKK ve Satıcı Sözleşmesi, public/docs altındaki PDF’lerden okunur.
 *   public/docs/kvkk.pdf
 *   public/docs/satici-sozlesmesi.pdf
 * - "Oku" modalı kapatıldıktan sonra ilgili "Onayla" butonu aktif olur.
 * - Belge yüklemeleri (Vergi Levhası vb.) gerçek upload yerine istemci tarafında dosya adını tutar.
 */

const DOCS = {
  kvkk: { key: "kvkk", title: "KVKK Aydınlatma Metni", src: "/docs/kvkk.pdf" },
  contract: { key: "contract", title: "Satıcı Sözleşmesi", src: "/docs/satici-sozlesmesi.pdf" },
};

function Badge({ children, tone = "ok" }) {
  const cn =
    "badge " + (tone === "ok" ? "ok" : tone === "warn" ? "warn" : tone === "muted" ? "muted" : "");
  return <span className={cn}>{children}</span>;
}

export default function Documents() {
  // Okundu / onaylandı durumları
  const [ack, setAck] = useState({
    kvkk: { read: false, acknowledged: false },
    contract: { read: false, acknowledged: false },
  });

  // Oku modalı
  const [modal, setModal] = useState({ open: false, key: null });

  // Belge yüklemeleri (sadece dosya adı gösteriyoruz)
  const [uploads, setUploads] = useState({
    vergi: null,
    ruhsat: null,
    oda: null,
    imza: null,
  });

  const fileRefs = {
    vergi: useRef(null),
    ruhsat: useRef(null),
    oda: useRef(null),
    imza: useRef(null),
  };

  /* ==== Oku / Onay akışı ==== */
  function openDoc(which) {
    setModal({ open: true, key: which });
  }

  function closeDoc() {
    if (!modal.key) return setModal({ open: false, key: null });
    // ilgili dokümanı okundu işaretle, onay butonunu aktif et
    setAck(prev => ({
      ...prev,
      [modal.key]: { ...prev[modal.key], read: true },
    }));
    setModal({ open: false, key: null });
  }

  function approve(which) {
    setAck(prev => ({
      ...prev,
      [which]: { ...prev[which], acknowledged: true },
    }));
  }

  /* ==== Belge yükleme ==== */
  function pick(which) {
    fileRefs[which].current?.click();
  }

  function handlePicked(which, e) {
    const f = e.target.files?.[0];
    setUploads(prev => ({ ...prev, [which]: f ? f.name : null }));
  }

  return (
    <main className="app-shell">
      <h1 className="page-title">Evraklar</h1>

      {/* Evrak Onayları */}
      <section className="card">
        <div className="head">Evrak Onayları</div>
        <div className="body" style={{ display: "grid", gap: 16 }}>
          {/* KVKK */}
          <div className="card" style={{ background: "var(--panel-2)" }}>
            <div className="body" style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <strong>KVKK Aydınlatma Metni</strong>
                {ack.kvkk.acknowledged ? <Badge>Onaylandı</Badge> : ack.kvkk.read ? <Badge tone="warn">Okundu</Badge> : <Badge tone="muted">Okunmadı</Badge>}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn" onClick={() => openDoc("kvkk")}>Oku</button>
                <button
                  className="btn success"
                  onClick={() => approve("kvkk")}
                  disabled={!ack.kvkk.read || ack.kvkk.acknowledged}
                  title={!ack.kvkk.read ? "Önce oku" : ""}
                >
                  Onayla
                </button>
              </div>
            </div>
          </div>

          {/* Satıcı Sözleşmesi */}
          <div className="card" style={{ background: "var(--panel-2)" }}>
            <div className="body" style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <strong>Satıcı Sözleşmesi</strong>
                {ack.contract.acknowledged ? <Badge>Onaylandı</Badge> : ack.contract.read ? <Badge tone="warn">Okundu</Badge> : <Badge tone="muted">Okunmadı</Badge>}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn" onClick={() => openDoc("contract")}>Oku</button>
                <button
                  className="btn success"
                  onClick={() => approve("contract")}
                  disabled={!ack.contract.read || ack.contract.acknowledged}
                  title={!ack.contract.read ? "Önce oku" : ""}
                >
                  Onayla
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Belge Yüklemeleri */}
      <section className="card">
        <div className="head">Belge Yüklemeleri</div>
        <div className="body" style={{ display: "grid", gap: 14 }}>
          {[
            { key: "vergi", label: "Vergi Levhası" },
            { key: "ruhsat", label: "Eczacı/İşletme Ruhsatı" },
            { key: "oda", label: "Oda Kayıt Belgesi" },
            { key: "imza", label: "İmza Sirküleri" },
          ].map(({ key, label }) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "space-between" }}>
              <div style={{ color: "var(--muted)" }}>{label}</div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {/* Gizli input */}
                <input
                  ref={fileRefs[key]}
                  type="file"
                  className="input-file-hidden"
                  onChange={(e) => handlePicked(key, e)}
                />
                <button type="button" className="btn primary" onClick={() => pick(key)}>
                  Dosya Seç
                </button>
                <span className="file-pill">
                  {uploads[key] ? uploads[key] : "seçili dosya yok"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* OKU Modali */}
      {modal.open && (
        <div className="modal-overlay" onClick={closeDoc}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>{DOCS[modal.key].title}</div>
              <button className="btn ghost" onClick={closeDoc}>Kapat</button>
            </div>
            <div className="modal-body" style={{ padding: 0 }}>
              {/* PDF görüntüleyici */}
              <embed
                src={DOCS[modal.key].src}
                type="application/pdf"
                style={{ display: "block", width: "100%", height: "70vh", background: "rgba(255,255,255,.04)" }}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}