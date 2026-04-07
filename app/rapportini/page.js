"use client";
import { useState } from "react";

export default function Rapportino() {
  const [data, setData] = useState({
    data: "",
    cantiere: "",
    risorse: [],
    materiali: [],
    note: ""
  });

  const risorseDisponibili = [
    "Operaio Mario Rossi",
    "Escavatore CAT 320",
    "Autocarro Iveco"
  ];

  const materialiDisponibili = [
    "Calcestruzzo",
    "Rete metallica",
    "Bulloni"
  ];

  const toggleSelezione = (tipo, valore) => {
    setData((prev) => {
      const lista = prev[tipo];
      return {
        ...prev,
        [tipo]: lista.includes(valore)
          ? lista.filter((v) => v !== valore)
          : [...lista, valore]
      };
    });
  };

  const submit = () => {
    console.log("RAPPORTINO:", data);
    alert("Rapportino salvato (mock)");
  };

  return (
    <main style={styles.container}>
      <h1>📋 Rapportino Giornaliero</h1>

      {/* DATA */}
      <input
        type="date"
        style={styles.input}
        onChange={(e) => setData({ ...data, data: e.target.value })}
      />

      {/* CANTIERE */}
      <input
        placeholder="Nome cantiere"
        style={styles.input}
        onChange={(e) => setData({ ...data, cantiere: e.target.value })}
      />

      {/* RISORSE */}
      <Section title="👷 Risorse">
        {risorseDisponibili.map((r) => (
          <Checkbox
            key={r}
            label={r}
            checked={data.risorse.includes(r)}
            onChange={() => toggleSelezione("risorse", r)}
          />
        ))}
      </Section>

      {/* MATERIALI */}
      <Section title="📦 Materiali">
        {materialiDisponibili.map((m) => (
          <Checkbox
            key={m}
            label={m}
            checked={data.materiali.includes(m)}
            onChange={() => toggleSelezione("materiali", m)}
          />
        ))}
      </Section>

      {/* NOTE */}
      <textarea
        placeholder="Note lavorazioni..."
        style={styles.textarea}
        onChange={(e) => setData({ ...data, note: e.target.value })}
      />

      <button onClick={submit} style={styles.button}>
        💾 Salva Rapportino
      </button>
    </main>
  );
}

/* COMPONENTI */

function Section({ title, children }) {
  return (
    <div style={styles.section}>
      <h3>{title}</h3>
      {children}
    </div>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label style={styles.checkbox}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      {label}
    </label>
  );
}

/* STILI */

const styles = {
  container: {
    padding: "30px",
    maxWidth: "600px",
    margin: "auto",
    fontFamily: "Arial"
  },
  input: {
    display: "block",
    width: "100%",
    padding: "10px",
    marginBottom: "15px"
  },
  textarea: {
    width: "100%",
    height: "100px",
    marginTop: "15px"
  },
  section: {
    marginBottom: "20px"
  },
  checkbox: {
    display: "block",
    marginBottom: "5px"
  },
  button: {
    marginTop: "20px",
    padding: "10px",
    background: "#2e7d32",
    color: "white",
    border: "none",
    cursor: "pointer"
  }
};
