// Basit oturum yardımcıları (localStorage tabanlı)

const KEY = "pharmex.session";

// Oturumu kaydet
export function setSession(session) {
  try {
    localStorage.setItem(KEY, JSON.stringify(session));
  } catch (_) {
    // storage kapalıysa sessiz geç
  }
}

// Oturumu getir (yoksa null döner)
export function getSession() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

// Oturumu temizle
export function clearSession() {
  try {
    localStorage.removeItem(KEY);
  } catch (_) {}
}

// Rollerden en az birine sahip mi?
export function hasRole(session, roles = []) {
  if (!roles || roles.length === 0) return true;
  const userRoles = session?.roles || session?.user?.roles || [];
  return roles.some((r) => userRoles.includes(r));
}