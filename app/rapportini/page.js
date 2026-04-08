"use client";

import { useEffect, useMemo, useState } from "react";

export default function RapportiniPage() {
  const [resources, setResources] = useState([]);
  const [reports, setReports] = useState([]);
  const [commesse, setCommesse] = useState([]);
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [commessaId, setCommessaId] = useState("");
  const [selectedResources, setSelectedResources] = useState({});

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

  async function loadCommesse() {
    const res = await fetch("/api/commesse");
    const data = await res.json();
    setCommesse(data);
  }

  useEffect(() => {
    loadResources();
    loadReports();
    loadCommesse();
  }, []);

  function toggleResource(resource) {
    setSelectedResources((prev) => {
      if (prev[resource.id]) {
        const copy = { ...prev };
        delete copy[resource.id];
        return copy;
      }

      return {
        ...prev,
        [resource.id]: {
          id: resource.id,
          name: resource.name,
          unitCost: resource.cost || 0,
          quantity: 1
        }
      };
    });
  }

  function updateQuantity(id, qty) {
    setSelectedResources((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        quantity: parseFloat(qty) || 0
      }
    }));
  }

  const total = useMemo(() => {
    return Object.values(selectedResources).reduce(
      (sum, r) => sum + r.quantity * r.unitCost,
      0
    );
  }, [selectedResources]);

  const totaleReports = useMemo(() => {
    return reports.reduce((sum, r) => {
      return sum + r.resources.reduce((s, res) => s + res.totalCost, 0);
    }, 0);
  }, [reports]);

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
        commessaId,
        resources: Object.values(selectedResources)
      })
    });

    if (!res.ok) {
      alert("Errore salvataggio rapportino");
      return;
    }

    setDate("");
    setDescription("");
    setCommessaId("");
    setSelectedResources({});
    loadReports();
    loadResources();
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Rapportini</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 10 }}>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <select
            value={commessaId}
            onChange={(e) => setCommessaId(e.target.value)}
          >
            <option value="">Seleziona commessa</option>
            {commesse.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 10 }}>
          <input
            placeholder="Descrizione lavori"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: 320 }}
          />
        </div>

        <h3>Risorse impiegate</h3>

        {resources.map((r) => {
          const selected = selectedResources[r.id];

          return (
            <div key={r.id} style={{ marginBottom: 6 }}>
              <label>
                <input
                  type="checkbox"
                  checked={!!selected}
                  onChange={() => toggleResource(r)}
                />
                {" "}{r.name} ({r.type}) - € {r.cost || 0}
                {r.type === "materiale" &&
                r.stock !== null &&
                r.stock !== undefined
                  ? ` - giacenza ${r.stock}`
                  : ""}
              </label>

              {selected && (
                <input
                  type="number"
                  value={selected.quantity}
                  onChange={(e) => updateQuantity(r.id, e.target.value)}
                  style={{ marginLeft: 10, width: 70 }}
                />
              )}
            </div>
          );
        })}

        <h3>Costo rapportino corrente: € {total.toFixed(2)}</h3>

        <button type="submit">Salva rapportino</button>
      </form>

      <h2 style={{ marginTop: 40 }}>Rapportini salvati</h2>
      <h3>Totale costi complessivi: € {totaleReports.toFixed(2)}</h3>

      {reports.length === 0 && <p>Nessun rapportino</p>}

      {reports.map((r) => (
        <div
          key={r.id}
          style={{
            border: "1px solid #ccc",
            padding: 10,
            marginBottom: 10,
            background: "#fff"
          }}
        >
          <strong>Data:</strong> {r.date} <br />
          <strong>Commessa:</strong> {r.commessa ? r.commessa.name : "-"} <br />
          <strong>Descrizione:</strong> {r.description || "-"} <br />
          <strong>Risorse:</strong>
          <ul>
            {r.resources.map((item) => (
              <li key={item.id}>
                {item.resource.name} - q.tà {item.quantity} - €{" "}
                {item.totalCost.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
