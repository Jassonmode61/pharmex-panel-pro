import { useMemo, useState } from "react";
import ordersData from "../data/orders.json";

const TRY = (v) =>
  new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(v || 0);

const COMMISSION_RATE = 7;   // %
const DELIVERY_FEE = 30;     // ₺

function dParse(s) { return new Date(s + "T00:00:00"); }
const getY = (d) => d.getFullYear();
const getM = (d) => d.getMonth() + 1;

export default function Payouts() {
  const first = ordersData?.[0] ? dParse(ordersData[0].date) : new Date();
  const [month, setMonth] = useState(getM(first));
  const [year, setYear]   = useState(getY(first));

  // Ay/Yıl filtreli siparişler
  const filtered = useMemo(() => (
    (ordersData || []).filter(o => {
      const d = dParse(o.date);
      return getY(d) === Number(year) && getM(d) === Number(month);
    })
  ), [month, year]);

  // Dönemlere (01–15 / 16–31) böl ve toplamları çıkar
  const halves = useMemo(() => {
    const base = () => ({ count:0, gross:0, commission:0, delivery:0, net:0, rows:[] });
    const h = { first: base(), second: base() };

    filtered.forEach(o => {
      const d = dParse(o.date);
      const key = d.getDate() <= 15 ? "first" : "second";
      const rowTotal = Number(o.total || 0);
      h[key].count += 1;
      h[key].gross += rowTotal;
      h[key].rows.push(o);
    });

    ["first","second"].forEach(k => {
      const g = h[k].gross;
      const c = (g * COMMISSION_RATE) / 100;
      const del = h[k].count * DELIVERY_FEE;
      h[k].commission = c;
      h[k].delivery   = del;
      h[k].net        = g - c + del;
    });

    return h;
  }, [filtered]);

  // Aylık toplam
  const totals = useMemo(() => {
    const gross = (halves.first.gross + halves.second.gross);
    const commission = (gross * COMMISSION_RATE)/100;
    const delivery = (halves.first.count + halves.second.count) * DELIVERY_FEE;
    const net = gross - commission + delivery;
    return { gross, commission, delivery, net };
  }, [halves]);

  // Yazdır: seçili dönemin özetinden “fatura” çıktısı
  function printHalfInvoice(which) {
    const label = which === "first" ? "01–15" : "16–31";
    const data  = halves[which];
    const html = `
<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8"/>
<title>Hakediş – ${label} (${month}/${year})</title>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<style>
  @page{ margin:16mm; }
  *{ box-sizing:border-box; }
  body{ font:14px/1.5 -apple-system,Segoe UI,Roboto,Helvetica,Arial; color:#111; padding:0; margin:0; }
  .wrap{ max-width:840px; margin:0 auto; padding:20px; }
  h1{ font-size:20px; margin:0 0 8px; }
  .muted{ color:#555; }
  .grid{ display:grid; grid-template-columns:1fr 1fr; gap:12px; margin:14px 0 8px; }
  .card{ border:1px solid #e5e7eb; border-radius:10px; padding:12px; }
  .kv{ display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px dashed #e5e7eb; }
  .kv:last-child{ border-bottom:0; }
  table{ width:100%; border-collapse:collapse; margin-top:14px; }
  th,td{ border:1px solid #e5e7eb; padding:8px 10px; text-align:left; }
  thead th{ background:#f8fafc; }
  tfoot td{ font-weight:700; }
</style>
</head>
<body>
<div class="wrap">
  <h1>Hakediş Özeti – ${label} (${String(month).padStart(2,"0")}/${year})</h1>
  <div class="muted">Komisyon: %${COMMISSION_RATE} · Teslimat Ücreti (30₺)</div>

  <div class="grid">
    <div class="card">
      <div class="kv"><span>Toplam Sipariş</span><strong>${data.count} adet</strong></div>
      <div class="kv"><span>Brüt Ciro</span><strong>${TRY(data.gross)}</strong></div>
      <div class="kv"><span>Komisyon (%${COMMISSION_RATE})</span><strong>-${TRY(data.commission)}</strong></div>
      <div class="kv"><span>Teslimat Ücreti (30₺)</span><strong>+${TRY(data.delivery)}</strong></div>
      <div class="kv"><span>Net Hakediş</span><strong>${TRY(data.net)}</strong></div>
    </div>
    <div class="card">
      <div><strong>Dönem:</strong> ${label} · ${String(month).padStart(2,"0")}/${year}</div>
      <div><strong>Tarih:</strong> ${new Date().toLocaleString("tr-TR")}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr><th>#</th><th>Tarih</th><th>Müşteri</th><th>Durum</th><th style="text-align:right">Tutar</th></tr>
    </thead>
    <tbody>
      ${data.rows.map(o=>`
        <tr>
          <td>${o.id}</td>
          <td>${o.date}</td>
          <td>${o.customerName || ""}</td>
          <td>${o.status || ""}</td>
          <td style="text-align:right">${TRY(Number(o.total||0))}</td>
        </tr>
      `).join("")}
    </tbody>
    <tfoot>
      <tr><td colspan="4" style="text-align:right">Brüt</td><td style="text-align:right">${TRY(data.gross)}</td></tr>
      <tr><td colspan="4" style="text-align:right">Komisyon</td><td style="text-align:right">-${TRY(data.commission)}</td></tr>
      <tr><td colspan="4" style="text-align:right">Teslimat Ücreti (30₺)</td><td style="text-align:right">+${TRY(data.delivery)}</td></tr>
      <tr><td colspan="4" style="text-align:right">Net</td><td style="text-align:right">${TRY(data.net)}</td></tr>
    </tfoot>
  </table>
</div>
<script>
  window.addEventListener('load', function(){
    setTimeout(function(){ window.focus(); window.print(); }, 150);
  });
</script>
</body>
</html>
    `;
    const w = window.open("", "_blank", "noopener,noreferrer,width=900,height=1000");
    w.document.open(); w.document.write(html); w.document.close();
  }

  const years = useMemo(() => {
    const ys = new Set();
    (ordersData || []).forEach(o => ys.add(getY(dParse(o.date))));
    const arr = Array.from(ys).sort();
    return arr.length ? arr : [2024, 2025, 2026, 2027];
  }, []);

  return (
    <main>
      <h1>Hakedişler</h1>

      {/* Ay/Yıl seçimi + oran bilgisi */}
      <section className="page-block">
        <div style={{ display:"flex", gap:12, alignItems:"center", flexWrap:"wrap" }}>
          <div>
            <label style={{ display:"block", opacity:.8, marginBottom:6 }}>Ay</label>
            <select value={month} onChange={e=>setMonth(Number(e.target.value))}>
              {["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"]
                .map((name, i)=><option key={i+1} value={i+1}>{name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display:"block", opacity:.8, marginBottom:6 }}>Yıl</label>
            <select value={year} onChange={e=>setYear(Number(e.target.value))}>
              {years.map(y=><option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div style={{ marginLeft:"auto", opacity:.85 }}>
            Komisyon: <strong>%{COMMISSION_RATE}</strong> · Teslimat Ücreti <strong>(30₺)</strong>
          </div>
        </div>
      </section>

      {/* 01–15 ve 16–31 kartları + Fatura Yazdır */}
      <section className="page-block">
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          <div className="card">
            <div className="head">01–15</div>
            <div className="body" style={{ display:"grid", gap:8 }}>
              <Row label="Toplam Sipariş" value={`${halves.first.count} adet`} />
              <Row label="Brüt Ciro" value={TRY(halves.first.gross)} />
              <Row label={`Komisyon (%${COMMISSION_RATE})`} value={`-${TRY(halves.first.commission)}`} />
              <Row label="Teslimat Ücreti (30₺)" value={`+${TRY(halves.first.delivery)}`} />
              <Row label="Net Hakediş" value={TRY(halves.first.net)} bold />
              <div style={{ display:"flex", justifyContent:"flex-end", marginTop:6 }}>
                <button className="btn primary" onClick={()=>printHalfInvoice("first")}>Bu Dönem İçin Fatura Yazdır</button>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="head">16–31</div>
            <div className="body" style={{ display:"grid", gap:8 }}>
              <Row label="Toplam Sipariş" value={`${halves.second.count} adet`} />
              <Row label="Brüt Ciro" value={TRY(halves.second.gross)} />
              <Row label={`Komisyon (%${COMMISSION_RATE})`} value={`-${TRY(halves.second.commission)}`} />
              <Row label="Teslimat Ücreti (30₺)" value={`+${TRY(halves.second.delivery)}`} />
              <Row label="Net Hakediş" value={TRY(halves.second.net)} bold />
              <div style={{ display:"flex", justifyContent:"flex-end", marginTop:6 }}>
                <button className="btn primary" onClick={()=>printHalfInvoice("second")}>Bu Dönem İçin Fatura Yazdır</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Aylık özet kartları */}
      <section className="page-block">
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
          <Mini title="Brüt Ciro" value={TRY(totals.gross)} />
          <Mini title={`Komisyon (%${COMMISSION_RATE})`} value={TRY(totals.commission)} />
          <Mini title="Teslimat Ücreti (30₺)" value={TRY(totals.delivery)} />
          <Mini title="Net Hakediş" value={TRY(totals.net)} />
        </div>
      </section>
    </main>
  );
}

function Row({label, value, bold}) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", borderBottom:"1px dashed rgba(255,255,255,.1)", padding:"6px 0" }}>
      <span style={{ opacity:.85 }}>{label}</span>
      <span style={{ fontWeight: bold ? 700 : 500 }}>{value}</span>
    </div>
  );
}

function Mini({title, value}) {
  return (
    <div className="card">
      <div className="head">{title}</div>
      <div className="body" style={{ fontSize:22, fontWeight:700 }}>{value}</div>
    </div>
  );
}