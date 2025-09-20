export function exportCsv(filename, rows){
  if(!rows?.length) return;
  const csv = rows.map(r => r.map(v => {
    const s = (v==null?"":String(v)).replaceAll('"','""');
    return `"${s}"`;
  }).join(",")).join("\n");
  const blob = new Blob([csv], {type:"text/csv;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  setTimeout(()=>URL.revokeObjectURL(url), 500);
}