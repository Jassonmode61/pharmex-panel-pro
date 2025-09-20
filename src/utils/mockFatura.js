// src/utils/mockFatura.js
// Basit mock e-fatura entegrasyonu.
// LocalStorage üzerinde "invoices" anahtarıyla saklar.

const STORAGE_KEY = "invoices_v1";

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeAll(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function nextInvoiceNo() {
  const list = readAll();
  const last = list[0]?.invoiceNo || "PX-000000";
  const n = parseInt(last.split("-")[1] || "0", 10) + 1;
  return `PX-${String(n).padStart(6, "0")}`;
}

function money(n) {
  const cur = localStorage.getItem("currency") || "TRY";
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: cur,
    maximumFractionDigits: 2,
  }).format(n ?? 0);
}

function fakePdfBase64(text) {
  const payload = `E-FATURA\n${text}\n(DEV MOCK)`;
  return btoa(unescape(encodeURIComponent(payload)));
}

/**
 * createInvoice(order)
 * - order: { id, total, items: [{name, qty, total}], customerName, customerAddress }
 */
export async function createInvoice(order) {
  await new Promise((r) => setTimeout(r, 500));

  const no = nextInvoiceNo();
  const KDV_ORAN = 0.20; // demo
  const araToplam = order?.total ?? 0 / (1 + KDV_ORAN);
  const kdv = (order?.total ?? 0) - araToplam;

  const pdfBase64 = fakePdfBase64(
    `FATURA NO: ${no}\nSIPARIS #${order?.id}\nTUTAR: ${money(order?.total || 0)}`
  );

  const payload = {
    id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
    invoiceNo: no,
    orderId: order?.id,
    amount: order?.total || 0,
    vatRate: KDV_ORAN,
    vatAmount: kdv,
    netAmount: araToplam,
    pdfBase64,
    createdAt: new Date().toISOString(),
    buyer: {
      name: order?.customerName || "",
      address: order?.customerAddress || "",
    },
    items: order?.items || [],
  };

  const list = readAll();
  const idx = list.findIndex((x) => x.orderId === order?.id);
  if (idx >= 0) list[idx] = payload;
  else list.unshift(payload);
  writeAll(list);

  return payload;
}

export function getInvoiceByOrder(orderId) {
  return readAll().find((x) => x.orderId === orderId) || null;
}

export function listInvoices() {
  return readAll();
}

export function deleteInvoiceByOrder(orderId) {
  const next = readAll().filter((x) => x.orderId !== orderId);
  writeAll(next);
}

export function downloadInvoiceBase64(base64, filename = "e-fatura.txt") {
  const blob = new Blob([Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))], {
    type: "text/plain;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}