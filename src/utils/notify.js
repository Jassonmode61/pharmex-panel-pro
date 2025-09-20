/**
 * Bildirim yardımcıları
 * localStorage key: "notifs_v1"
 * öğe: { id, ts, title, message, type: "info"|"success"|"warning"|"error", read: bool }
 */

const K = "notifs_v1";

export function getAll() {
  try {
    const raw = localStorage.getItem(K);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(list) {
  localStorage.setItem(K, JSON.stringify(list));
}

export function addNotif(n) {
  const list = getAll();
  const item = {
    id: crypto.randomUUID(),
    ts: new Date().toISOString(),
    title: n.title ?? "Bildirim",
    message: n.message ?? "",
    type: n.type ?? "info",
    read: false,
  };
  list.unshift(item);
  save(list);
  return item.id;
}

export function markRead(id, read = true) {
  const list = getAll().map((x) => (x.id === id ? { ...x, read } : x));
  save(list);
}

export function markAllRead() {
  const list = getAll().map((x) => ({ ...x, read: true }));
  save(list);
}

export function remove(id) {
  const list = getAll().filter((x) => x.id !== id);
  save(list);
}

export function clearAll() {
  localStorage.removeItem(K);
}

export function unreadCount() {
  return getAll().filter((x) => !x.read).length;
}

/* ---- DEV seed ---- */
if (import.meta.env.DEV) {
  const cur = getAll();
  if (cur.length === 0) {
    [
      { title: "Yeni sipariş", message: "#1057 oluşturuldu", type: "success" },
      { title: "Stok uyarısı", message: "PX-1003 stok kritik seviyede", type: "warning" },
      { title: "İade talebi", message: "#R-301 onay bekliyor", type: "info" },
      { title: "Ödeme hatası", message: "#102 faturası başarısız", type: "error" },
    ].forEach(addNotif);
  }
}