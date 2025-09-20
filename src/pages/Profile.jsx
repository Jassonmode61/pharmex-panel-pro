import React, { useState } from "react";

export default function Profile(){
  const [u, setU] = useState({ ad:"Dev Admin", email:"admin@example.com", tel:"" });
  const [msg, setMsg] = useState("");

  function save(){
    setMsg("Profil güncellendi (demo).");
    setTimeout(()=>setMsg(""), 1600);
  }

  return (
    <div className="card">
      <h2 className="card-title">Profil</h2>
      <div className="form" style={{maxWidth:520}}>
        <label><span>Ad Soyad</span>
          <input value={u.ad} onChange={e=>setU({...u, ad:e.target.value})}/>
        </label>
        <label><span>E-posta</span>
          <input type="email" value={u.email} onChange={e=>setU({...u, email:e.target.value})}/>
        </label>
        <label><span>Telefon</span>
          <input value={u.tel} onChange={e=>setU({...u, tel:e.target.value})}/>
        </label>
        <div style={{display:"flex",gap:8}}>
          <button className="btn primary" onClick={save}>Kaydet</button>
          {msg && <div className="muted">{msg}</div>}
        </div>
      </div>
    </div>
  );
}