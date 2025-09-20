// src/utils/print.js
export function printHTML(html, title = "Pharmex Rapor") {
  // Kullanıcı etkileşimi ile çağrıldığı için Safari/Chrome engellemez
  const w = window.open("", "_blank", "noopener,noreferrer");
  if (!w) return; // popup engellendiyse sessiz çık

  w.document.open();
  w.document.write(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <title>${title}</title>
        <style>
          body{font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif; padding:24px;}
          table{border-collapse: collapse; width:100%;}
          th,td{border:1px solid #ddd; padding:8px; font-size:12px;}
          th{background:#f5f5f5;}
        </style>
      </head>
      <body>${html}</body>
    </html>
  `);
  w.document.close();

  // Safari bazen hemen print'e izin vermiyor; kısa bir tik beklet.
  w.onload = () => { w.focus(); w.print(); };
  setTimeout(() => { try { w.close(); } catch {} }, 500);
}

export function downloadCSV(filename, csvText) {
  const blob = new Blob([csvText], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}