"use client";

import { useEffect, useState } from "react";

export default function Rapportini() {
  const [resources, setResources] = useState([]);
  const [selected, setSelected] = useState([]);
  const [date, setDate] = useState("");
  const [desc, setDesc] = useState("");

  useEffect(() => {
    fetch("/api/resources")
      .then((res) => res.json())
      .then(setResources);
  }, []);

  function toggleResource(id) {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((r) => r !== id)
        : [...prev, id]
    );
  }

  async function submit() {
    await fetch("/api/rapportini", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        date,
        description: desc,
        resourceIds: selected
      })
    });

    alert("Rapportino salvato");
    setSelected([]);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Rapportino</h1>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <input
        placeholder="Descrizione lavori"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />

      <h3>Risorse impiegate</h3>

      {resources.map((r) => (
        <div key={r.id}>
          <label>
            <input
              type="checkbox"
              onChange={() => toggleResource(r.id)}
            />
            {r.name} ({r.type})
          </label>
        </div>
      ))}

      <button onClick={submit}>Salva rapportino</button>
    </div>
  );
}
