"use client";

import { useEffect, useMemo, useState } from "react";

export default function Dashboard() {
  const [reports, setReports] = useState([]);
  const [commesse, setCommesse] = useState([]);
  const [invoices, setInvoices] = useState([]);

  async function loadData() {
    const [r1, r2, r3] = await Promise.all([
      fetch("/api/rapportini").then(r => r.json()),
      fetch("/api/commesse").then(r => r.json()),
      fetch("/api/invoices").then(r => r.json())
    ]);

    setReports(r1);
    setCommesse(r2);
    setInvoices(r3);
  }

  useEffect(() => {
    loadData();
  }, []);

  const data = useMemo(() => {
    const map = {};

    commesse.forEach(c => {
      map[c.id] = {
        name: c.name,
        budget: c.budget || 0,
        cost: 0,
        invoiced: 0
      };
    });

    // costi
    reports.forEach(r => {
      if (!r.commessa) return;

      const id = r.commessa.id;

      const costo = r.resources.reduce(
        (s, res) => s + res.totalCost,
        0
      );

      map[id].cost += costo;
    });

    // fatturato
    invoices.forEach(i => {
      if (!map[i.commessaId]) return;
      map[i.commessaId].invoiced += i.amount;
    });

    return Object.values(map).map(c => {
      const sal = c.cost;
      const daFatturare = sal - c.invoiced;
      const margin = c.budget - c.cost;

      return {
        ...c,
        sal,
        daFatturare,
        margin
      };
    });
  }, [reports, commesse, invoices]);

  return (
    <div style={{ padding: 24 }}>
      <h1>Controllo economico lavori</h1>

      <table border="1" cellPadding="10" style={{ background: "#fff" }}>
        <thead>
          <tr>
            <th>Commessa</th>
            <th>Budget</th>
            <th>Costi</th>
            <th>SAL</th>
            <th>Fatturato</th>
            <th>Da fatturare</th>
            <th>Margine</th>
          </tr>
        </thead>

        <tbody>
          {data.map((c, i) => (
            <tr key={i}>
              <td>{c.name}</td>
              <td>€ {c.budget.toFixed(2)}</td>
              <td>€ {c.cost.toFixed(2)}</td>
              <td>€ {c.sal.toFixed(2)}</td>
              <td>€ {c.invoiced.toFixed(2)}</td>
              <td
                style={{
                  color: c.daFatturare > 0 ? "orange" : "green"
                }}
              >
                € {c.daFatturare.toFixed(2)}
              </td>
              <td style={{ color: c.margin >= 0 ? "green" : "red" }}>
                € {c.margin.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
