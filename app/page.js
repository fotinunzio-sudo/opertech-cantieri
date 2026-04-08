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

  // 🔥 COSTI PER COMMESSA
  const costiPerCommessa = useMemo(() => {
    const map = {};

    reports.forEach((r) => {
      const commessaId = r.commessa?.id || "senza";

      const costoReport = r.resources.reduce(
        (sum, res) => sum + res.totalCost,
        0
      );

      if (!map[commessaId]) {
        map[commessaId] = {
          name: r.commessa?.name || "Senza commessa",
          total: 0
        };
      }

      map[commessaId].total += costoReport;
    });

    return Object.values(map);
  }, [reports]);

  const totaleGenerale = useMemo(() => {
    return costiPerCommessa.reduce((sum, c) => sum + c.total, 0);
  }, [costiPerCommessa]);

  return (
    <div style={{ padding: 24 }}>
      <h1>Dashboard Cantieri</h1>

      <h2>Totale generale: € {totaleGenerale.toFixed(2)}</h2>

      <h3 style={{ marginTop: 30 }}>Costi per commessa</h3>

      <table border="1" cellPadding="10" style={{ background: "#fff" }}>
        <thead>
          <tr>
            <th>Commessa</th>
            <th>Totale €</th>
          </tr>
        </thead>
        <tbody>
          {costiPerCommessa.map((c, i) => (
            <tr key={i}>
              <td>{c.name}</td>
              <td>{c.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {costiPerCommessa.length === 0 && (
        <p style={{ marginTop: 20 }}>Nessun dato disponibile</p>
      )}
    </div>
  );
}
