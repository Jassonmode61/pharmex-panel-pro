import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setToken } from "../utils/auth";

export default function Login() {
  const nav = useNavigate();
  const [username, setUsername] = useState("");

  function submit(e) {
    e.preventDefault();
    // demo: direkt token yaz
    setToken("demo-token");
    nav("/", { replace: true });
  }

  return (
    <div style={{minHeight:"100vh",display:"grid",placeItems:"center",background:"var(--bg)"}}>
      <div className="card" style={{width:380}}>
        <div className="brand" style={{marginBottom:12}}>
          <span className="pill">💊</span>
          <div>
            <div className="brand-title">Pharmex</div>
            <div className="brand-sub">Satıcı Paneli</div>
          </div>
        </div>
        <h2 style={{margin:"8px 0 16px"}}>Giriş Yap</h2>
        <form onSubmit={submit} className="form-grid">
          <div className="field">
            <label className="label">Kullanıcı Adı</label>
            <input className="input" value={username} onChange={e=>setUsername(e.target.value)} placeholder="admin" />
          </div>
          <button className="btn" type="submit">Giriş</button>
        </form>
        <div className="hint" style={{marginTop:10}}>Demo: Şifre yok; “Giriş” yeterli.</div>
      </div>
    </div>
  );
}