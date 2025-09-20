import React from "react";

export default function Dashboard(){
  return (
    <>
      <h1 className="page-title">Gösterge Paneli</h1>
      <div className="cards grid-4">
        <div className="card stat">
          <div className="stat-label">Brüt Ciro</div>
          <div className="stat-value">₺9.800</div>
        </div>
        <div className="card stat">
          <div className="stat-label">Net Hakedilmiş</div>
          <div className="stat-value">₺7.794</div>
        </div>
        <div className="card stat">
          <div className="stat-label">Toplam Sipariş</div>
          <div className="stat-value">44</div>
        </div>
        <div className="card stat">
          <div className="stat-label">Ortalama Sepet</div>
          <div className="stat-value">₺223</div>
        </div>
      </div>

      <div className="card" style={{marginTop:16, height:300, display:"grid", placeItems:"center", color:"var(--muted)"}}>
        Günlük Ciro grafiği (örnek)
      </div>
    </>
  );
}