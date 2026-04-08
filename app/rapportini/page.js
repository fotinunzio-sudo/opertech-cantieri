"use client";

import { useEffect, useState } from "react";

export default function RapportiniPage() {
  const [resources, setResources] = useState([]);
  const [reports, setReports] = useState([]);

  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [selectedResources, setSelectedResources] = useState([]);
  
  const [commesse, setCommesse] = useState([]);
  const [commessaId, setCommessaId] = useState("");
  async function loadResources() {
    const res = await fetch("/api/resources");
    const data = await res.json();
    setResources(data);
  }

  async function loadReports() {
    const res = await fetch("/api/rapportini");
    const data = await res.json();
    setReports(data);
  }

  useEffect(() => {
    loadResources();
    loadReports();
  }, []);

  function toggleResource(id) {
    setSelectedResources((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!date) {
      alert("Inserisci la data");
      return;
    }

    const res = await fetch("/api/rapportini", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        date,
        description,
        resourceIds: selectedResources
      })
    });

    if (!res.ok) {
      alert("Errore salvataggio rapportino");
      return;
    }

    // reset
    setDate("");
    setDescription("");
    setSelectedResources([]);

    // ricarica lista
    loadReports();
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Rapportini</h1>

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 10 }}>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <input
            placeholder="Descrizione lavori"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: 300 }}
          />
        </div>

        <h3>Risorse impiegate</h3>

        {resources.map((r) => (
          <div key={r.id}>
            <label>
              <input
                type="checkbox"
                checked={selectedResources.includes(r.id)}
                onChange={() => toggleResource(r.id)}
              />
              {" "}{r.name} ({r.type})
            </label>
          </div>
        ))}

        <div style={{ marginTop: 15 }}>
          <button type="submit">Salva rapportino</button>
        </div>
      </form>

      {/* LISTA RAPPORTINI */}
      <h2 style={{ marginTop: 40 }}>Rapportini salvati</h2>

      {reports.length === 0 && <p>Nessun rapportino</p>}

      {reports.map((r) => (
        <div
          key={r.id}
          style={{
            border: "1px solid #ccc",
            padding: 10,
            marginBottom: 10
          }}
        >
          <strong>Data:</strong> {r.date} <br />
          <strong>Descrizione:</strong> {r.description || "-"} <br />

          <strong>Risorse:</strong>
          <ul>
            {r.resources.map((res) => (
              <li key={res.id}>
                {res.name} ({res.type})
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
