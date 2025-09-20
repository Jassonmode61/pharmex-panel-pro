// src/utils/exportCsv.js
export default function exportCsv(filename, rows) {
  const list = Array.isArray(rows) ? rows : [];
  const headers = Object.keys(list[0] || {});

  const escape = (v) => {
    const s = v == null ? "" : String(v);
    // Çift tırnak içeriyorsa CSV kuralı gereği kaçır
    return `"${s.replace(/"/g, '""')}"`;
  };

  const csv = [
    headers.map(escape).join(","),
    ...list.map((r) => headers.map((h) => escape(r[h])).join(",")),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || "veri.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}