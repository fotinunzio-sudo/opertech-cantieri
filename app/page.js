export default function Home() {
  return (
    <main style={styles.container}>
      {/* HEADER */}
      <header style={styles.header}>
        <h1 style={styles.title}>🚀 Opertech</h1>
        <p style={styles.subtitle}>Gestione Cantieri & Contabilità</p>
      </header>

      {/* GRID MODULI */}
      <div style={styles.grid}>
        <Card title="📋 Rapportino Giornaliero" desc="Inserisci attività giornaliere di cantiere" />
        <Card title="👷 Risorse" desc="Gestione personale, mezzi e attrezzature" />
        <Card title="📦 Magazzino" desc="Materiali e giacenze" />
        <Card title="💸 Spese" desc="Registrazione costi con centro di costo" />
        <Card title="📊 Contabilità" desc="Analisi costi e produzione" />
        <Card title="⚙️ Impostazioni" desc="Configurazione sistema" />
      </div>
    </main>
  );
}

function Card({ title, desc }) {
  return (
    <div style={styles.card}>
      <h2 style={styles.cardTitle}>{title}</h2>
      <p style={styles.cardDesc}>{desc}</p>
      <button style={styles.button}>Apri</button>
    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
    fontFamily: "Arial, sans-serif",
    background: "#f5f7fa",
    minHeight: "100vh"
  },
  header: {
    marginBottom: "40px"
  },
  title: {
    fontSize: "32px",
    margin: 0
  },
  subtitle: {
    color: "#666"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px"
  },
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
  },
  cardTitle: {
    marginBottom: "10px"
  },
  cardDesc: {
    color: "#666",
    marginBottom: "20px"
  },
  button: {
    background: "#2e7d32",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "6px",
    cursor: "pointer"
  }
};
