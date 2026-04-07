"use client";

import { useEffect, useState } from "react";

type Resource = {
  id: number;
  name: string;
  type: string;
  cost: number | null;
};

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [form, setForm] = useState({
    name: "",
    type: "",
    cost: ""
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

  async function handleSubmit(e: React.FormEvent) {
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
          cost: form.cost ? parseFloat(form.cost) : null
        })
      });

      setForm({ name: "", type: "", cost: "" });
      loadResources();
    } catch (err) {
      console.error("Errore inserimento:", err);
    }
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
          {resources.map((r) => (
            <tr key={r.id}>
              <td>{r.name}</td>
              <td>{r.type}</td>
              <td>{r.cost ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
