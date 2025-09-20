// src/utils/auth.js

// Basit oturum mock'u: kullanıcı Admin + Destek rolleriyle varsayılır.
// İstersen localStorage ile gerçek oturum da kullanabilirsin.
export function getSession() {
  try {
    const raw = localStorage.getItem("pharmex.session");
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return {
    user: { id: 1, name: "Dev Admin", roles: ["Admin", "Destek"] },
  };
}

export function hasRole(session, roles = []) {
  if (!roles || roles.length === 0) return true;
  const userRoles = session?.user?.roles || [];
  return roles.some((r) => userRoles.includes(r));
}