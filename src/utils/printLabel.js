export function openPrintWindow(htmlString) {
  const w = window.open('', '_blank', 'noopener,noreferrer');
  if (!w) return alert('Pop-up engellendi, lütfen izin verin.');
  w.document.open();
  w.document.write(htmlString);
  w.document.close();
}

export function printShippingLabel({ id, customer, address }) {
  // API etiketi (server tarafı HTML + auto-print)
  // demo: serverdaki en son takip numarasını ya da belirli birini kullanabilirsiniz.
  // Şimdilik sadece yeni pencere açalım (server endpointine yönlendirme):
  const track = window.prompt('Takip numarası (örn: PX255750570):', 'PX255750570');
  if (!track) return;
  const url = `/api/labels/${encodeURIComponent(track)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}