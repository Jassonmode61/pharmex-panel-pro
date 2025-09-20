import React from "react";
import { useNavigate } from "react-router-dom";

export default function Topbar(){
  const nav = useNavigate();
  return (
    <header className="topbar">
      {/* solda marka */}
      <div className="brand">
        <span className="pill">💊</span>
        <div>
          <div className="brand-title">Pharmex</div>
          <div className="brand-sub">Satıcı Paneli</div>
        </div>
      </div>

      {/* sağ aksiyonlar */}
      <div className="topbar-actions">
        <button className="chip" onClick={() => nav("/notifications")}>Bildirimler</button>
        <button className="chip" onClick={() => nav("/profile")}>Profil</button>
      </div>
    </header>
  );
}