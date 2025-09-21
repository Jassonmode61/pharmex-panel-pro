import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
const LS_KEY = "pharmex_auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) setUser(JSON.parse(raw));
  }, []);

  const login = async (username, password) => {
    // basit/örnek doğrulama (frontend)
    if (username === "admin" && password === "Serdar61") {
      const u = { username: "admin" };
      localStorage.setItem(LS_KEY, JSON.stringify(u));
      setUser(u);
      return { ok: true };
    }
    return { ok: false, error: "Kullanıcı adı veya şifre hatalı" };
  };

  const logout = () => {
    localStorage.removeItem(LS_KEY);
    setUser(null);
  };

  const value = { user, isAuth: !!user, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}