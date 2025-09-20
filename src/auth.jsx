// src/auth.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const KEY = "pharmex_user";
const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // LocalStorage'tan oturumu yükle
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  // Oturum değişince persist et
  useEffect(() => {
    try {
      if (user) localStorage.setItem(KEY, JSON.stringify(user));
      else localStorage.removeItem(KEY);
    } catch {}
  }, [user]);

  const loginAs = (payload) => setUser(payload);
  const logout = () => setUser(null);

  const value = useMemo(() => ({ user, setUser, loginAs, logout }), [user]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}