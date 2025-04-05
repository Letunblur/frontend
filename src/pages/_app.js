// _app.js – Einstiegspunkt für deine gesamte App (Next.js Standard)
import React from 'react';
import TokenViewer from '@/components/TokenViewer'; // oder passe den Pfad an, wenn du kein @ alias nutzt
import '@/styles/globals.css'; // optional, nur wenn du globale Styles nutzt

function MyApp({ Component, pageProps }) {
  return (
    <>
      {/* Test-Component für Token */}
      <TokenViewer />

      {/* Deine reguläre Seite */}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
