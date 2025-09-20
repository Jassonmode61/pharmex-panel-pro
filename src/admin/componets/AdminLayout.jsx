// src/admin/components/AdminLayout.jsx
import React from "react";

export default function AdminLayout({ tab, setTab, children }) {
  return (
    <div className="app-shell">
      <h1>Yönetim</h1>

      <div className="toolbar" style={{display:"flex",gap:8,flexWrap:"wrap",margin:"14px 0"}}>
        <button className={`btn ${tab==="dashboard" ? "primary":""}`} onClick={()=>setTab("dashboard")}>Özet</button>
        <button className={`btn ${tab==="orders" ? "primary":""}`} onClick={()=>setTab("orders")}>Siparişler</button>
        <button className={`btn ${tab==="returns" ? "primary":""}`} onClick={()=>setTab("returns")}>İadeler</button>
        <button className={`btn ${tab==="payouts" ? "primary":""}`} onClick={()=>setTab("payouts")}>Hakediş</button>
      </div>

      {children}
    </div>
  );
}