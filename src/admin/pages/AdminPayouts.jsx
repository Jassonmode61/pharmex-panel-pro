// src/admin/pages/AdminPayouts.jsx
import React, { useEffect, useState } from "react";
import { getAllPayouts, markPayoutPaid } from "../lib/adminData";

export default function AdminPayouts() {
  const [rows, setRows] = useState([]);
  useEffect(() => { setRows(getAllPayouts()); }, []);
  const markPaid = (id) => setRows(markPayoutPaid(id));

  return (
    <section className="page-block">
      <h2 className="page-title">Hakedişler (Admin)</h2>
      <div className="table-wrap" style={{ marginTop: 12 }}>
        <table>
          <thead>
            <tr><th>Hesap Dönemi</th><th>Tutar</th><th>Durum</th><th>İşlem</th></tr>
          </thead>
          <tbody>
            {rows.map(p => (
              <tr key={p.id}>
                <td>{p.period}</td>
                <td>{p.amount.toFixed(2)} ₺</td>
                <td>{p.status}</td>
                <td>
                  {p.status !== "paid" && (
                    <button className="btn success" onClick={() => markPaid(p.id)}>Ödendi İşaretle</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}