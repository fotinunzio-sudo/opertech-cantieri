export const metadata = {
  title: "Opertech Gestione Cantieri",
  description: "Applicazione web per gestione cantieri",
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
