import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await login(username.trim(), password);
    if (res.ok) {
      const to = loc.state?.from?.pathname || "/";
      nav(to, { replace: true });
    } else {
      setErr(res.error || "Giriş başarısız");
    }
  };

  return (
    <div style={{minHeight:"100vh",display:"grid",placeItems:"center",background:"#0f172a",color:"#e2e8f0"}}>
      <form onSubmit={onSubmit} style={{background:"#111827", padding:24, borderRadius:12, width:340}}>
        <h1 style={{marginBottom:16}}>Pharmex Panel • Giriş</h1>
        <label>Kullanıcı adı</label>
        <input
          value={username}
          onChange={e=>setUsername(e.target.value)}
          placeholder="admin"
          style={{width:"100%",padding:10,margin:"6px 0 12px",borderRadius:8,border:"1px solid #334155",background:"#0b1220",color:"#e2e8f0"}}
        />
        <label>Şifre</label>
        <input
          type="password"
          value={password}
          onChange={e=>setPassword(e.target.value)}
          placeholder="Serdar61"
          style={{width:"100%",padding:10,margin:"6px 0 16px",borderRadius:8,border:"1px solid #334155",background:"#0b1220",color:"#e2e8f0"}}
        />
        {err && <div style={{color:"#f87171",marginBottom:12}}>{err}</div>}
        <button type="submit" style={{width:"100%",padding:10,borderRadius:8,background:"#22c55e",border:"none",color:"#052e16",fontWeight:700}}>
          Giriş Yap
        </button>
        <p style={{opacity:.7,marginTop:10,fontSize:12}}>ipucu: admin / Serdar61</p>
      </form>
    </div>
  );
}