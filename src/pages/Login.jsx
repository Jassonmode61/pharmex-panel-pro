import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setSession } from "../utils/auth.js";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;

    // Basit/sabit doğrulama
    if (username === "admin" && password === "Serdar61") {
      setLoading(true);
      // İster direkt roles alanı ver, ister user.roles içinde tut
      setSession({ user: "admin", roles: ["Admin"] });
      navigate("/dashboard", { replace: true });
    } else {
      alert("Kullanıcı adı veya şifre hatalı!");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0b1530",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: 340,
          background: "#0f1b3f",
          padding: "24px 22px",
          borderRadius: 12,
          boxShadow: "0 8px 30px rgba(0,0,0,.35)",
          color: "#e8eefc",
          border: "1px solid rgba(255,255,255,.06)",
        }}
        // Safari/Chrome otomatik doldurma agresifliğini azalt
        autoComplete="off"
      >
        <h2 style={{ margin: 0, marginBottom: 18, textAlign: "center" }}>
          Pharmex Panel • Giriş
        </h2>

        <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>
          Kullanıcı adı
        </label>
        <input
          type="text"
          inputMode="text"
          name="px_user"              // yaygın alan adlarından kaçın
          autoComplete="off"          // otomatik doldurmayı kapat
          placeholder="kullanıcı adınız"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid #2a3a78",
            background: "#0b1330",
            color: "#e8eefc",
            outline: "none",
            marginBottom: 14,
          }}
        />

        <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>
          Şifre
        </label>
        <input
          type="password"
          name="px_pass"
          autoComplete="new-password" // tarayıcıya "bunu kaydetme" iması
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid #2a3a78",
            background: "#0b1330",
            color: "#e8eefc",
            outline: "none",
            marginBottom: 18,
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 8,
            border: "none",
            background: loading ? "#168c41" : "#1db954",
            color: "white",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {loading ? "Yönlendiriliyor…" : "Giriş Yap"}
        </button>
      </form>
    </div>
  );
}