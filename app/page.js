"use client";

import { useEffect, useState } from "react";

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState({
    name: "",
    type: "",
    cost: "",
    stock: ""
  });

  async function loadResources() {
    try {
      const res = await fetch("/api/resources");
      const data = await res.json();
      setResources(data);
    } catch (err) {
      console.error("Errore caricamento risorse:", err);
    }
  }

  useEffect(() => {
    loadResources();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name || !form.type) {
      alert("Nome e tipo obbligatori");
      return;
    }

    try {
      await fetch("/api/resources", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: form.name,
          type: form.type,
          cost: form.cost ? parseFloat(form.cost) : null,
          stock: form.stock ? parseFloat(form.stock) : null
        })
      });

      setForm({ name: "", type: "", cost: "", stock: "" });
      loadResources();
    } catch (err) {
      console.error("Errore inserimento:", err);
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Risorse</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: 20, display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input
          placeholder="Nome"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="">Seleziona tipo</option>
          <option value="uomo">Uomo</option>
          <option value="mezzo">Mezzo</option>
          <option value="materiale">Materiale</option>
        </select>

        <input
          placeholder="Costo €/unità"
          type="number"
          value={form.cost}
          onChange={(e) => setForm({ ...form, cost: e.target.value })}
        />

        <input
          placeholder="Giacenza"
          type="number"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
        />

        <button type="submit">Aggiungi</button>
      </form>

      <table border="1" cellPadding="8" style={{ background: "#fff" }}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Costo</th>
            <th>Giacenza</th>
          </tr>
        </thead>
        <tbody>
          {resources.map((r) => (
            <tr key={r.id}>
              <td>{r.name}</td>
              <td>{r.type}</td>
              <td>{r.cost ?? "-"}</td>
              <td>{r.stock ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
