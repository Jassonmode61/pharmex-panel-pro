import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function TopNav() {
  const { user } = useAuth();

  const Item = ({ to, children }) => (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        padding: "8px 12px",
        borderRadius: 8,
        textDecoration: "none",
        color: isActive ? "#111827" : "#e5e7eb",
        background: isActive ? "#22c55e" : "transparent",
      })}
    >
      {children}
    </NavLink>
  );

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        backdropFilter: "saturate(180%) blur(6px)",
        background: "rgba(2,6,23,.6)",
        borderBottom: "1px solid #1f2937",
      }}
    >
      <div
        style={{
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          color: "#e5e7eb",
        }}
      >
        {/* Sol: logo / başlık */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link to="/" style={{ color: "#22c55e", fontWeight: 800, letterSpacing: .3, textDecoration: "none" }}>
            Pharmex Panel
          </Link>
          {/* örnek menü linkleri */}
          <nav style={{ display: "flex", gap: 6, marginLeft: 8 }}>
            <Item to="/">Ana Sayfa</Item>
            <Item to="/orders">Siparişler</Item>
            <Item to="/reports">Raporlar</Item>
          </nav>
        </div>

        {/* Sağ: kullanıcı + çıkış */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ opacity: .8, fontSize: 14 }}>
            {user ? `👋 ${user.username}` : ""}
          </span>

          {/* Çıkış linki */}
          <Link
            to="/logout"
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              textDecoration: "none",
              background: "#ef4444",
              color: "#111827",
              fontWeight: 700,
            }}
          >
            Çıkış Yap
          </Link>
        </div>
      </div>
    </header>
  );
}