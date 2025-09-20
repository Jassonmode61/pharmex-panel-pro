import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { clearToken } from "../utils/auth";

export default function Shell() {
  return (
    <div className="admin-shell">
      <aside className="admin-aside">
        <div className="brand">
          <span className="pill">💊</span>
          <div>
            <div className="brand-title">Pharmex</div>
            <div className="brand-sub">Admin</div>
          </div>
        </div>

        <nav className="menu">
          <NavLink to="/" end className={({isActive}) => "menu-link" + (isActive ? " active" : "")}>Gösterge Paneli</NavLink>
          <NavLink to="/catalog" className={({isActive}) => "menu-link" + (isActive ? " active" : "")}>Katalog</NavLink>
          <NavLink to="/orders" className={({isActive}) => "menu-link" + (isActive ? " active" : "")}>Siparişler</NavLink>
          <NavLink to="/returns" className={({isActive}) => "menu-link" + (isActive ? " active" : "")}>İadeler</NavLink>
          <NavLink to="/reports" className={({isActive}) => "menu-link" + (isActive ? " active" : "")}>Raporlar</NavLink>
          <NavLink to="/audit" className={({isActive}) => "menu-link" + (isActive ? " active" : "")}>Denetim</NavLink>
          <NavLink to="/settings" className={({isActive}) => "menu-link" + (isActive ? " active" : "")}>Ayarlar</NavLink>
        </nav>
      </aside>

      <main className="admin-main">
        <div className="topbar">
          <button className="chip">Bildirimler</button>
          <button className="chip" onClick={() => { clearToken(); window.location.href="/login"; }}>Çıkış</button>
        </div>
        <div className="page">
          <Outlet />
        </div>
      </main>
    </div>
  );
}