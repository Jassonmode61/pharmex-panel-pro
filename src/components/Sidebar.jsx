import React from "react";
import { NavLink } from "react-router-dom";

const items = [
  { to: "/",          label: "Gösterge Paneli", icon: "📊" },
  { to: "/users",     label: "Kullanıcılar",    icon: "👥" },
  { to: "/catalog",   label: "Katalog",         icon: "📦" },
  { to: "/orders",    label: "Siparişler",      icon: "🧾" },
  { to: "/returns",   label: "İadeler",         icon: "↩️" },
  { to: "/reports",   label: "Raporlar",        icon: "📈" },
  { to: "/audit",     label: "Denetim",         icon: "🛡️" },
  { to: "/security",  label: "Güvenlik",        icon: "🔒" },
  { to: "/settings",  label: "Ayarlar",         icon: "⚙️" },
];

export default function Sidebar() {
  return (
    <nav className="side-nav">
      <ul className="side-list">
        {items.map((it) => (
          <li key={it.to} className="side-item">
            <NavLink
              to={it.to}
              end={it.to === "/"}
              className={({ isActive }) =>
                "side-link" + (isActive ? " active" : "")
              }
            >
              <span className="side-icon" aria-hidden>{it.icon}</span>
              <span className="side-text">{it.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}