import './globals.css';

export const metadata = {
  title: 'Encuesta CSAT · Pago Nube',
  description: 'Resultados de la encuesta CSAT — Pago Nube AR',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
