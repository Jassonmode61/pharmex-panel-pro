import React from "react";

export default function Audit(){
  const rows = [
    { ts:"2025-09-16 22:12", type:"login", msg:"Giriş başarılı", actor:"admin" },
    { ts:"2025-09-16 22:20", type:"returns", msg:"#203 onaylandı", actor:"admin" },
  ];
  return (
    <>
      <h1 className="page-title">Denetim Kaydı</h1>
      <div className="card">
        <table className="table">
          <thead><tr><th>Zaman</th><th>Tip</th><th>Mesaj</th><th>Aktör</th></tr></thead>
        <tbody>
          {rows.map((r,i)=>(
            <tr key={i}><td>{r.ts}</td><td>{r.type}</td><td>{r.msg}</td><td>{r.actor}</td></tr>
          ))}
        </tbody>
        </table>
      </div>
    </>
  );
}