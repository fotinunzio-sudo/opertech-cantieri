"use client";

import { useEffect, useState } from "react";

export default function CommessePage() {
  const [commesse, setCommesse] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });

  async function loadCommesse() {
    const res = await fetch("/api/commesse");
    const data = await res.json();
    setCommesse(data);
  }

  useEffect(() => {
    loadCommesse();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name) {
      alert("Nome commessa obbligatorio");
      return;
    }

    const res = await fetch("/api/commesse", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    if (!res.ok) {
      alert("Errore salvataggio commessa");
      return;
    }

    setForm({ name: "", description: "" });
    loadCommesse();
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Commesse</h1>

      <form
        onSubmit={handleSubmit}
        style={{ marginBottom: 20, display: "flex", gap: 8, flexWrap: "wrap" }}
      >
        <input
          placeholder="Nome commessa"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Descrizione"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          style={{ width: 280 }}
        />
        <button type="submit">Aggiungi</button>
      </form>

      <table border="1" cellPadding="8" style={{ background: "#fff" }}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Descrizione</th>
          </tr>
        </thead>
        <tbody>
          {commesse.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.description || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
