"use client";

import { useEffect, useState } from "react";

export default function CommessePage() {
  const [commesse, setCommesse] = useState([]);
  const [name, setName] = useState("");

  async function load() {
    const res = await fetch("/api/commesse");
    const data = await res.json();
    setCommesse(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    await fetch("/api/commesse", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name })
    });

    setName("");
    load();
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Commesse</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Nome commessa"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button>Aggiungi</button>
      </form>

      <ul>
        {commesse.map((c) => (
          <li key={c.id}>{c.name}</li>
        ))}
      </ul>
    </div>
  );
}
