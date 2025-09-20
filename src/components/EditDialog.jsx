import React from "react";

export default function EditDialog({ open, title="Düzenle", values={}, onChange, onClose, onSave }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-title">{title}</div>

        <div className="modal-body">
          {Object.keys(values).length === 0 ? (
            <div>Yükleniyor…</div>
          ) : (
            Object.entries(values).map(([k,v]) => (
              <label key={k} className="form-row">
                <span>{k}</span>
                <input
                  value={v ?? ""}
                  onChange={(e)=>onChange(k, e.target.value)}
                />
              </label>
            ))
          )}
        </div>

        <div className="modal-actions">
          <button className="btn" onClick={onClose}>İptal</button>
          <button className="btn btn-primary" onClick={onSave}>Kaydet</button>
        </div>
      </div>
    </div>
  );
}