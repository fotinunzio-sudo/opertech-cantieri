"use client";

import { useEffect, useState } from "react";

export default function ReceiptsPage() {
  const [file, setFile] = useState(null);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [commesse, setCommesse] = useState([]);
  const [commessaId, setCommessaId] = useState("");

  useEffect(() => {
    fetch("/api/commesse")
      .then(res => res.json())
      .then(setCommesse);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("amount", amount);
    formData.append("description", description);
    formData.append("commessaId", commessaId);

    const res = await fetch("/api/receipts", {
      method: "POST",
      body: formData
    });

    if (!res.ok) {
      alert("Errore upload");
      return;
    }

    setFile(null);
    setAmount("");
    setDescription("");
    setCommessaId("");

    alert("Scontrino registrato");
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Carica scontrino</h1>

      <form onSubmit={handleSubmit}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />

        <input
          type="number"
          placeholder="Importo"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <input
          placeholder="Descrizione"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          value={commessaId}
          onChange={(e) => setCommessaId(e.target.value)}
        >
          <option value="">Senza commessa</option>
          {commesse.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <button>Carica</button>
      </form>
    </div>
  );
}
