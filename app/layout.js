export const metadata = {
  title: "Opertech Gestione Cantieri",
  description: "Applicazione web per gestione cantieri, commesse, risorse e rapportini"
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body
        style={{
          margin: 0,
          fontFamily: "Arial, sans-serif",
          background: "#f4f6f8",
          color: "#111"
        }}
      >
        {children}
      </body>
    </html>
  );
}
