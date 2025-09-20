// src/utils/mockKargo.js
const SHIP_KEY = "shipments_v1";

function readList() {
  try { return JSON.parse(localStorage.getItem(SHIP_KEY) || "[]"); }
  catch { return []; }
}
function writeList(list) {
  localStorage.setItem(SHIP_KEY, JSON.stringify(list));
}

export function getShipmentByOrder(orderId) {
  const rows = readList();
  return rows.find((x) => String(x.orderId) === String(orderId));
}

export async function createShipment(order, carrier = "PharmExpress", meta = {}) {
  // küçük gecikme hissi
  await new Promise((r) => setTimeout(r, 250));

  const rows = readList();
  const id = crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`;
  const trackingNumber = `PEX${String(rows.length + 1).padStart(8, "0")}`;

  const entry = {
    id,
    trackingNumber,
    carrier,
    orderId: order?.id ?? "-",
    recipient: order?.customerName ?? "-",
    address: order?.customerAddress ?? "-",
    createdAt: new Date().toISOString(),
    ...meta,
  };
  rows.unshift(entry);
  writeList(rows);

  // audit
  const AK = "audit_v1";
  const audit = JSON.parse(localStorage.getItem(AK) || "[]");
  audit.unshift({
    id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
    time: new Date().toISOString(),
    type: "shipment.create",
    msg: `Kargo oluşturuldu (${trackingNumber})`,
    meta: { orderId: entry.orderId, carrier: entry.carrier, trackingNumber },
  });
  localStorage.setItem(AK, JSON.stringify(audit));

  return entry;
}