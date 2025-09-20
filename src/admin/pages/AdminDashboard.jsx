// src/admin/pages/AdminDashboard.jsx
import React from "react";
import { getAllOrders, computePayouts } from "../lib/adminData";

export default function AdminDashboard(){
  const orders = getAllOrders();
  const p = computePayouts(orders);

  return (
    <section className="card">
      <h2>Admin • Özet</h2>
      <p>Toplam sipariş ve hakediş kırılımı.</p>

      <div className="grid" style={{display:"grid",gap:16,gridTemplateColumns:"repeat(3,minmax(0,1fr))"}}>
        <Stat title="Sipariş (01–15)" value={p.left.count}/>
        <Stat title="Sipariş (16–31)" value={p.right.count}/>
        <Stat title="Toplam Sipariş" value={p.all.count}/>
      </div>
    </section>
  );
}

function Stat({title,value}){
  return (
    <div className="card" style={{background:"transparent"}}>
      <div style={{fontSize:12,opacity:.7}}>{title}</div>
      <div style={{fontSize:22,fontWeight:700}}>{value}</div>
    </div>
  );
}