// src/pages/Security.jsx
import React, { useState } from "react";

export default function Security(){
  const [twofa, setTwofa] = useState(true);
  const [pwd, setPwd] = useState({ old:"", n1:"", n2:"" });

  const sessions = [
    { device:"Bu cihaz (Safari / macOS)", ip:"127.0.0.1", last:"şimdi", current:true },
    { device:"iPhone", ip:"10.0.0.8", last:"2 gün önce", current:false },
  ];

  return (
    <div className="card security-page">
      <h2 className="page-title">Güvenlik</h2>

      <section className="sec-block">
        <div className="sec-title">İki Aşamalı Doğrulama</div>
        <label className="switch-line">
          <input type="checkbox" checked={twofa} onChange={(e)=>setTwofa(e.target.checked)} />
          <span>2FA aktif</span>
        </label>
        <div className="sec-hint">(Demo: server’a istek atmıyoruz, yalnızca UI durumu değişir)</div>
      </section>

      <section className="sec-block">
        <div className="sec-title">Şifre Değiştir</div>
        <div className="sec-grid">
          <label><span>Mevcut Şifre</span><input type="password" value={pwd.old} onChange={(e)=>setPwd({...pwd,old:e.target.value})}/></label>
          <label><span>Yeni Şifre</span><input type="password" value={pwd.n1} onChange={(e)=>setPwd({...pwd,n1:e.target.value})}/></label>
          <label><span>Yeni Şifre (tekrar)</span><input type="password" value={pwd.n2} onChange={(e)=>setPwd({...pwd,n2:e.target.value})}/></label>
          <div className="sec-actions"><button className="btn">Güncelle</button></div>
        </div>
      </section>

      <section className="sec-block">
        <div className="sec-title">Aktif Oturumlar</div>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Cihaz</th><th>IP</th><th>Son erişim</th><th></th></tr></thead>
            <tbody>
              {sessions.map((s,i)=>(
                <tr key={i}>
                  <td>
                    {s.device}{" "}
                    {s.current && <span className="badge green">bu cihaz</span>}
                  </td>
                  <td>{s.ip}</td>
                  <td>{s.last}</td>
                  <td style={{textAlign:"right"}}>
                    {!s.current && <button className="btn danger sm">Oturumu Sonlandır</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}