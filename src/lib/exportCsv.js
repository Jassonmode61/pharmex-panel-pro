// src/lib/exportCsv.js
export function exportCsv(filename, rows){
  const esc = v => `"${String(v??'').replaceAll('"','""')}"`;
  const head = Object.keys(rows[0]||{}).map(esc).join(',');
  const body = rows.map(r=>Object.values(r).map(esc).join(',')).join('\n');
  const blob = new Blob([head+'\n'+body], {type:'text/csv;charset=utf-8;'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = filename; a.click();
  URL.revokeObjectURL(a.href);
}