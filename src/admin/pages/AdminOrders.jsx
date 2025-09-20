// src/admin/pages/AdminOrders.jsx
import React, { useEffect, useState } from "react";
import { getAllOrders } from "../lib/adminData";

export default function AdminOrders() {
  const [rows, setRows] = useState([]);
  useEffect(() => { setRows(getAllOrders()); }, []);

  return (
    <section className="page-block">
      <h2 className="page-title">Siparişler (Admin)</h2>
      <div className="table-wrap" style={{ marginTop: 12 }}>
        <table>
          <thead>
            <tr>
              <th>Sipariş No</th><th>Müşteri</th><th>Tarih</th><th>Tutar</th><th>Durum</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(o => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.customer}</td>
                <td>{new Date(o.createdAt).toLocaleString("tr-TR")}</td>
                <td>{o.total.toFixed(2)} ₺</td>
                <td>{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}