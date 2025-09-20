// src/pages/Home.jsx
import React, { useMemo } from "react";
import { load } from "../storage";

/* Yardımcılar */
function parseMoney(val){
  if (val == null) return 0;
  if (typeof val === "number") return val;
  const s = String(val)
    .replace(/[^\d,.\-]/g,"")
    .replace(/\./g,"")
    .replace(/,/, ".");
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
}

/** Basit Donut Chart (SVG, kütüphane yok) */
function DonutChart({ data, size=180, stroke=18 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  // Donut renkleri
  const colors = [
    "#6ea8fe","#5eead4","#fbbf24","#f87171","#a78bfa",
    "#34d399","#f472b6","#60a5fa","#f59e0b","#22c55e"
  ];

  // toplam ve yüzdeler
  const total = data.reduce((s, d) => s + d.count, 0);
  let offset = 0;

  return (
    <div style={{display:"flex", alignItems:"center", gap:16, flexWrap:"wrap"}}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Arka halka */}
        <circle
          cx={size/2} cy={size/2} r={r}
          fill="none"
          stroke="rgba(255,255,255,.08)"
          strokeWidth={stroke}
        />
        {/* Dilimler */}
        {data.map((d, i) => {
          const frac = total ? d.count / total : 0;
          const len  = frac * c;
          const el = (
            <circle
              key={d.name}
              cx={size/2} cy={size/2} r={r}
              fill="none"
              stroke={colors[i % colors.length]}
              strokeWidth={stroke}
              strokeDasharray={`${len} ${c - len}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
              style={{transition:"stroke-dasharray .4s ease"}}
            />
          );
          offset += len;
          return el;
        })}
        {/* Orta boşluk metni */}
        <text
          x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
          fontSize="14" fill="#dfe7ff"
        >
          {total ? `${total} sipariş` : "Veri yok"}
        </text>
      </svg>

      {/* Lejant */}
      <div style={{minWidth:200}}>
        {data.length === 0 ? null : data.map((d, i) => (
          <div key={d.name} style={{
            display:"flex", alignItems:"center", gap:8, marginBottom:8
          }}>
            <span style={{
              width:12, height:12, borderRadius:3,
              background:colors[i % colors.length],
              display:"inline-block"
            }}/>
            <div style={{display:"flex", justifyContent:"space-between", width:"100%", gap:12}}>
              <span style={{opacity:.9}}>{d.name}</span>
              <span style={{opacity:.7}}>{d.count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home(){
  const st = load() || {};
  const orders = Array.isArray(st.orders) ? st.orders : [];

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    let totalRevenue = 0;
    const catMap = new Map();

    orders.forEach(o => {
      totalRevenue += parseMoney(o.total);
      let cat =
        o?.category ||
        (Array.isArray(o?.items) && o.items[0]?.category) ||
        "Diğer";
      if (!cat) cat = "Diğer";
      catMap.set(cat, (catMap.get(cat) || 0) + 1);
    });

    const categories = Array.from(catMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return { totalOrders, totalRevenue, categories };
  }, [orders]);

  return (
    <main className="app-shell">
      <h1 className="page-title">Başlangıç Özeti</h1>

      {/* KPI kutuları */}
      <section className="card">
        <div
          className="body"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "14px",
          }}
        >
          <div className="card" style={{ margin: 0 }}>
            <div className="head">Toplam Sipariş</div>
            <div className="body" style={{ fontSize: 24, fontWeight: 700 }}>
              {stats.totalOrders}
            </div>
          </div>
          <div className="card" style={{ margin: 0 }}>
            <div className="head">Toplam Ciro</div>
            <div className="body" style={{ fontSize: 24, fontWeight: 700 }}>
              ₺ {stats.totalRevenue.toLocaleString("tr-TR", { maximumFractionDigits: 2 })}
            </div>
          </div>
          <div className="card" style={{ margin: 0 }}>
            <div className="head">Kategori Sayısı</div>
            <div className="body" style={{ fontSize: 24, fontWeight: 700 }}>
              {stats.categories.length}
            </div>
          </div>
        </div>
      </section>

      {/* Kategori dağılımı – donut */}
      <section className="card">
        <div className="head">Kategoriye Göre Siparişler</div>
        <div className="body">
          <DonutChart
            data={stats.categories /* boşsa da grafik boş bir halka gösterir */}
            size={200}
            stroke={22}
          />
        </div>
      </section>

      {/* Son siparişler – eğer hiç yoksa bölümü göstermeyelim */}
      {orders.length > 0 && (
        <section className="card">
          <div className="head">Son Siparişler</div>
          <div className="body">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Tarih</th>
                    <th>Müşteri</th>
                    <th>Durum</th>
                    <th>Tutar</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 8).map((o, idx) => (
                    <tr key={o.id ?? idx}>
                      <td>{o.id ?? idx + 1}</td>
                      <td>{o.date ?? "-"}</td>
                      <td>{o.customerName ?? "-"}</td>
                      <td><span className="badge">{o.status ?? "-"}</span></td>
                      <td>
                        {typeof o.total === "number"
                          ? `₺ ${o.total.toLocaleString("tr-TR")}`
                          : o.total ?? "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}