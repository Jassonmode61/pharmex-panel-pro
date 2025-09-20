import { NavLink } from "react-router-dom";

export default function Navbar() {
  const items = [
    { to: "/", label: "Başlangıç", end: true },
    { to: "/urunler", label: "Ürün Yönetimi" },
    { to: "/siparisler", label: "Siparişler" },
    { to: "/iadeler", label: "İadeler" },
    { to: "/evraklar", label: "Evraklar" },
    { to: "/ayarlar", label: "Ayarlar" },
  ];

  // Inline stiller -> CSS yüklenmese bile menü düzgün/sağa hizalı kalsın
  const headerStyle = {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    background: "var(--bg, #0b1221)",
    borderBottom: "1px solid rgba(255,255,255,.08)",
  };
  const innerStyle = {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "10px 16px",
    display: "flex",
    alignItems: "center",
    gap: 16,
  };
  const brandStyle = { display: "flex", alignItems: "baseline", gap: 6 };
  const linksStyle = {
    display: "flex",
    gap: 8,
    marginLeft: "auto",              // sağa hizala
    alignItems: "center",
  };
  const btnBase = {
    appearance: "none",
    border: "1px solid rgba(255,255,255,.08)",
    background: "rgba(255,255,255,.06)",
    color: "#e9edf5",
    fontSize: 14,
    padding: "8px 12px",
    borderRadius: 8,
    textDecoration: "none",
    lineHeight: 1.2,
  };
  const btnActive = {
    background: "#0e6dfd",
    borderColor: "#0e6dfd",
    color: "#fff",
  };

  return (
    <header className="navbar" style={headerStyle}>
      <div className="nav-inner" style={innerStyle}>
        <div className="brand" style={brandStyle}>
          <span style={{ fontSize: 18 }}>💊</span>
          <span style={{ fontWeight: 700, letterSpacing: ".2px" }}>Pharmex</span>
          <span style={{ opacity: .75, fontSize: 13 }}>Satıcı Paneli</span>
        </div>

        <nav className="nav-links" aria-label="Ana menü" style={linksStyle}>
          {items.map(it => (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.end}
              style={({ isActive }) => ({
                ...btnBase,
                ...(isActive ? btnActive : null),
              })}
            >
              {it.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}