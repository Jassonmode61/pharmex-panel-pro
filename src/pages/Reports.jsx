import React, { useMemo, useState } from "react";

// basit para formatı
const tl = (n) =>
  new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(
    Number(n) || 0
  );

// örnek veri (istersen API'den doldurabilirsin)
const SAMPLE_ROWS = [
  { id: 101, musteri: "Ayşe Yılmaz", tutar: 250, durum: "Hazırlanıyor", tarih: "2025-09-10" },
  { id: 102, musteri: "Mehmet Demir", tutar: 320, durum: "Reddedildi",  tarih: "2025-09-09" },
  { id: 103, musteri: "Elif Kaya",    tutar: 180, durum: "Hazırlanıyor", tarih: "2025-09-08" },
  { id: 104, musteri: "Kerem Ak",     tutar: 600, durum: "Tamamlandı",   tarih: "2025-09-08" },
  // sayfalamayı görmek için 20 satır dolduruyoruz
  { id: 105, musteri: "Müşteri 5", tutar: 150, durum: "Hazırlanıyor", tarih: "2025-09-07" },
  { id: 106, musteri: "Müşteri 6", tutar: 210, durum: "Hazırlanıyor", tarih: "2025-09-07" },
  { id: 107, musteri: "Müşteri 7", tutar: 90,  durum: "Reddedildi",  tarih: "2025-09-06" },
  { id: 108, musteri: "Müşteri 8", tutar: 370, durum: "Tamamlandı",   tarih: "2025-09-06" },
  { id: 109, musteri: "Müşteri 9", tutar: 80,  durum: "Hazırlanıyor", tarih: "2025-09-05" },
  { id: 110, musteri: "Müşteri 10",tutar: 120, durum: "Hazırlanıyor", tarih: "2025-09-05" },
  { id: 111, musteri: "Müşteri 11",tutar: 220, durum: "Tamamlandı",   tarih: "2025-09-04" },
  { id: 112, musteri: "Müşteri 12",tutar: 260, durum: "Tamamlandı",   tarih: "2025-09-04" },
  { id: 113, musteri: "Müşteri 13",tutar: 310, durum: "Reddedildi",   tarih: "2025-09-03" },
  { id: 114, musteri: "Müşteri 14",tutar: 430, durum: "Hazırlanıyor", date: "2025-09-03" },
  { id: 115, musteri: "Müşteri 15",tutar: 510, durum: "Tamamlandı",   tarih: "2025-09-02" },
  { id: 116, musteri: "Müşteri 16",tutar: 190, durum: "Hazırlanıyor", tarih: "2025-09-02" },
  { id: 117, musteri: "Müşteri 17",tutar: 280, durum: "Tamamlandı",   tarih: "2025-09-01" },
  { id: 118, musteri: "Müşteri 18",tutar: 75,  durum: "Reddedildi",   tarih: "2025-09-01" },
  { id: 119, musteri: "Müşteri 19",tutar: 340, durum: "Hazırlanıyor", tarih: "2025-08-31" },
  { id: 120, musteri: "Müşteri 20",tutar: 405, durum: "Tamamlandı",   tarih: "2025-08-31" },
];

// CSV indirme
function downloadCSV(rows) {
  const header = ["ID", "Müşteri", "Tutar", "Durum", "Tarih"];
  const lines = rows.map((r) =>
    [r.id, r.musteri, r.tutar, r.durum, r.tarih].map(String).join(",")
  );
  const csv = [header.join(","), ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "rapor.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// direkt yazdır
function printRows(rows) {
  const html = `
<!doctype html>
<html lang="tr">
<head>
  <meta charset="utf-8" />
  <title>Rapor Yazdır</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body { font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; padding: 24px; }
    h1 { font-size: 18px; margin: 0 0 16px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #dadde1; padding: 8px 10px; font-size: 13px; }
    th { background: #f3f4f6; text-align: left; }
    tfoot td { font-weight: 600; }
  </style>
</head>
<body>
  <h1>Satış/İşlem Listesi</h1>
  <table>
    <thead>
      <tr><th>ID</th><th>Müşteri</th><th>Tutar</th><th>Durum</th><th>Tarih</th></tr>
    </thead>
    <tbody>
      ${rows
        .map(
          (r) =>
            `<tr><td>#${r.id}</td><td>${r.musteri}</td><td>${tl(
              r.tutar
            )}</td><td>${r.durum}</td><td>${r.tarih || ""}</td></tr>`
        )
        .join("")}
    </tbody>
  </table>
  <script>
    // içerik yüklenince yazdır, sonra pencereyi kapat
    window.addEventListener('load', function () {
      window.focus();
      window.print();
      setTimeout(function(){ window.close(); }, 200);
    });
  </script>
</body>
</html>`;
  const w = window.open("", "_blank");
  if (!w) return; // popup engellendiyse
  w.document.open();
  w.document.write(html);
  w.document.close();
}

export default function Reports() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // TODO: API'den veri çekiyorsan burada rows'u değiştir
  const rows = SAMPLE_ROWS;

  const total = useMemo(
    () => rows.reduce((s, r) => s + (Number(r.tutar) || 0), 0),
    [rows]
  );
  const totalPages = Math.ceil(rows.length / pageSize) || 1;
  const start = (page - 1) * pageSize;
  const current = rows.slice(start, start + pageSize);

  const next = () => setPage((p) => Math.min(p + 1, totalPages));
  const prev = () => setPage((p) => Math.max(p - 1, 1));

  return (
    <div className="card">
      <div className="card-head">
        <div className="title">Raporlar</div>
        <div className="actions">
          <button className="btn sm" onClick={() => downloadCSV(rows)}>
            CSV İndir
          </button>
          <button className="btn sm primary" onClick={() => printRows(rows)}>
            Yazdır
          </button>
        </div>
      </div>

      <div className="stats">
        <div className="stat">
          <div className="stat-label">Toplam İşlem</div>
          <div className="stat-value">{rows.length}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Toplam Tutar</div>
          <div className="stat-value">{tl(total)}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Ortalama</div>
          <div className="stat-value">{tl(total / (rows.length || 1))}</div>
        </div>
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
            </tr>
          </thead>
          <tbody>
            {current.map((r) => (
              <tr key={r.id}>
                <td>#{r.id}</td>
                <td>{r.musteri}</td>
                <td>{tl(r.tutar)}</td>
                <td>
                  <span
                    className={
                      "badge " +
                      (r.durum === "Tamamlandı"
                        ? "green"
                        : r.durum === "Reddedildi"
                        ? "red"
                        : "amber")
                    }
                  >
                    {r.durum}
                  </span>
                </td>
                <td>{r.tarih || ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* sayfalama */}
      <div className="pagination">
        <button className="btn sm" onClick={prev} disabled={page === 1}>
          ‹ Önceki
        </button>
        <span className="page-info">
          Sayfa {page} / {totalPages}
        </span>
        <button
          className="btn sm"
          onClick={next}
          disabled={page === totalPages}
        >
          Sonraki ›
        </button>
      </div>
    </div>
  );
}