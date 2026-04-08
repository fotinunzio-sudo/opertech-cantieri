"use client";

import { useEffect, useState } from "react";

export default function ReceiptsPage() {
  const [file, setFile] = useState(null);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [commesse, setCommesse] = useState([]);
  const [commessaId, setCommessaId] = useState("");
  const [receipts, setReceipts] = useState([]);

  async function loadData() {
    const [c, r] = await Promise.all([
      fetch("/api/commesse").then((res) => res.json()),
      fetch("/api/receipts").then((res) => res.json())
    ]);

    setCommesse(c);
    setReceipts(r);
  }

  async function runOCR(selectedFile) {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    const res = await fetch("/api/ocr", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    if (data.amount) setAmount(String(data.amount));
    if (data.date) console.log("Data OCR:", data.date);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!file) {
      alert("Seleziona un file");
      return;
    }

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

    loadData();
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Scontrini</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: 30 }}>
        <input
          type="file"
          onChange={(e) => {
            const selectedFile = e.target.files?.[0];
            setFile(selectedFile || null);
            if (selectedFile) {
              runOCR(selectedFile);
            }
          }}
        />

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

        <button type="submit">Carica</button>
      </form>

      <h2>Archivio scontrini</h2>

      {receipts.length === 0 && <p>Nessuno scontrino</p>}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
        {receipts.map((r) => (
          <div
            key={r.id}
            style={{
              border: "1px solid #ccc",
              padding: 10,
              background: "#fff",
              width: 220
            }}
          >
            <img
              src={r.fileUrl}
              alt="scontrino"
              style={{ width: "100%", height: 150, objectFit: "cover" }}
            />

            <div style={{ marginTop: 10 }}>
              <strong>€ {r.amount}</strong>
              <br />
              {r.description || "-"}
              <br />
              <small>
                {r.commessa ? r.commessa.name : "Senza commessa"}
              </small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
