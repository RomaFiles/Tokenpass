import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        <link rel="icon" href="/models/ticket.png?v=1" type="image/png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/models/ticket.png?v=1" />
        <link rel="icon" type="image/png" sizes="32x32" href="/models/ticket.png?v=1" />
        <link rel="icon" type="image/png" sizes="16x16" href="/models/ticket.png?v=1" />
        <meta name="theme-color" content="#0d76fc" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
