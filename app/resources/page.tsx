"use client";

import { useEffect, useState } from "react";

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState({
    name: "",
    type: "",
    cost: ""
  });

  async function loadResources() {
    const res = await fetch("/api/resources");
    const data = await res.json();
    setResources(data);
  }

  useEffect(() => {
    loadResources();
  }, []);

  async function handleSubmit(e: any) {
    e.preventDefault();

    await fetch("/api/resources", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...form,
        cost: form.cost ? parseFloat(form.cost) : null
      })
    });

    setForm({ name: "", type: "", cost: "" });
    loadResources();
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Risorse</h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          placeholder="Nome"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Tipo (uomo, mezzo, materiale)"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        />
        <input
          placeholder="Costo"
          type="number"
          value={form.cost}
          onChange={(e) => setForm({ ...form, cost: e.target.value })}
        />
        <button type="submit">Aggiungi</button>
      </form>

      {/* LISTA */}
      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Costo</th>
          </tr>
        </thead>
        <tbody>
          {resources.map((r: any) => (
            <tr key={r.id}>
              <td>{r.name}</td>
              <td>{r.type}</td>
              <td>{r.cost}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
