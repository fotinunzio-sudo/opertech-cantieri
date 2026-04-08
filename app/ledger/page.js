"use client";

import { useEffect, useMemo, useState } from "react";

export default function LedgerPage() {
  const [entries, setEntries] = useState([]);
  const [commesse, setCommesse] = useState([]);

  const [form, setForm] = useState({
    date: "",
    type: "USCITA",
    description: "",
    amount: "",
    commessaId: ""
  });

  async function load() {
    const [e, c] = await Promise.all([
      fetch("/api/ledger").then(r => r.json()),
      fetch("/api/commesse").then(r => r.json())
    ]);

    setEntries(e);
    setCommesse(c);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch("/api/ledger", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...form,
        amount: parseFloat(form.amount)
      })
    });

    if (!res.ok) {
      alert("Errore");
      return;
    }

    setForm({
      date: "",
      type: "USCITA",
      description: "",
      amount: "",
      commessaId: ""
    });

    load();
  }

  const saldo = useMemo(() => {
    return entries.reduce((sum, e) => {
      return e.type === "ENTRATA"
        ? sum + e.amount
        : sum - e.amount;
    }, 0);
  }, [entries]);

  return (
    <div style={{ padding: 24 }}>
      <h1>Prima Nota</h1>

      <h2>Saldo: € {saldo.toFixed(2)}</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="USCITA">Uscita</option>
          <option value="ENTRATA">Entrata</option>
        </select>

        <input
          placeholder="Descrizione"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Importo"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />

        <select
          value={form.commessaId}
          onChange={(e) =>
            setForm({ ...form, commessaId: e.target.value })
          }
        >
          <option value="">Senza commessa</option>
          {commesse.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <button>Aggiungi</button>
      </form>

      <table border="1" cellPadding="8" style={{ background: "#fff" }}>
        <thead>
          <tr>
            <th>Data</th>
            <th>Tipo</th>
            <th>Descrizione</th>
            <th>Importo</th>
            <th>Commessa</th>
          </tr>
        </thead>

        <tbody>
          {entries.map((e) => (
            <tr key={e.id}>
              <td>{new Date(e.date).toLocaleDateString()}</td>
              <td>{e.type}</td>
              <td>{e.description}</td>
              <td>€ {e.amount.toFixed(2)}</td>
              <td>{e.commessa ? e.commessa.name : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
