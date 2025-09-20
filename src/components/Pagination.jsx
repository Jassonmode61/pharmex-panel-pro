import React from "react";

/**
 * Ortak sayfalama bileşeni
 * Props:
 *  - page:        mevcut sayfa (1 tabanlı)
 *  - total:       toplam kayıt sayısı
 *  - pageSize:    sayfa başına kayıt
 *  - onPageChange(nextPage)
 *  - labelPrefix: "Toplam X ..." satırında X'ten önceki metin (örn: "iade", "kayıt")
 */
export default function Pagination({
  page = 1,
  total = 0,
  pageSize = 10,
  onPageChange,
  labelPrefix = "kayıt",
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);

  const goPrev = () => onPageChange?.(Math.max(1, safePage - 1));
  const goNext = () => onPageChange?.(Math.min(totalPages, safePage + 1));

  return (
    <div className="pagination">
      <div className="muted">
        Toplam {total} {labelPrefix} • Sayfa {safePage}/{totalPages}
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <button onClick={goPrev} disabled={safePage === 1}>
          Önceki
        </button>
        <button onClick={goNext} disabled={safePage === totalPages}>
          Sonraki
        </button>
      </div>
    </div>
  );
}