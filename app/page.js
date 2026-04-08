"use client";

import { useEffect, useMemo, useState } from "react";

export default function Dashboard() {
  const [reports, setReports] = useState([]);
  const [commesse, setCommesse] = useState([]);

  async function loadData() {
    const [r1, r2] = await Promise.all([
      fetch("/api/rapportini").then(res => res.json()),
      fetch("/api/commesse").then(res => res.json())
    ]);

    setReports(r1);
    setCommesse(r2);
  }

  useEffect(() => {
    loadData();
  }, []);

  const data = useMemo(() => {
    const map = {};

    // inizializza
    commesse.forEach(c => {
      map[c.id] = {
        name: c.name,
        budget: c.budget || 0,
        cost: 0
      };
    });

    // somma costi
    reports.forEach(r => {
      if (!r.commessa) return;

      const id = r.commessa.id;

      const costo = r.resources.reduce(
        (s, res) => s + res.totalCost,
        0
      );

      if (!map[id]) {
        map[id] = { name: r.commessa.name, budget: 0, cost: 0 };
      }

      map[id].cost += costo;
    });

    return Object.values(map).map(c => {
      const perc = c.budget > 0 ? c.cost / c.budget : 0;
      const salValue = perc * c.budget;
      const margin = c.budget - c.cost;

      return {
        ...c,
        perc,
        salValue,
        margin
      };
    });
  }, [reports, commesse]);

  return (
    <div style={{ padding: 24 }}>
      <h1>Dashboard SAL lavori</h1>

      <table border="1" cellPadding="10" style={{ background: "#fff" }}>
        <thead>
          <tr>
            <th>Commessa</th>
            <th>Budget</th>
            <th>Costi</th>
            <th>SAL %</th>
            <th>Valore SAL</th>
            <th>Margine</th>
          </tr>
        </thead>

        <tbody>
          {data.map((c, i) => (
            <tr key={i}>
              <td>{c.name}</td>
              <td>€ {c.budget.toFixed(2)}</td>
              <td>€ {c.cost.toFixed(2)}</td>
              <td>{(c.perc * 100).toFixed(1)}%</td>
              <td>€ {c.salValue.toFixed(2)}</td>
              <td style={{ color: c.margin >= 0 ? "green" : "red" }}>
                € {c.margin.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {data.length === 0 && <p style={{ marginTop: 20 }}>Nessun dato</p>}
    </div>
  );
}
