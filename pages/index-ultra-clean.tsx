import React from 'react';
import Head from 'next/head';
import RobotDemoLanding from '../components/RobotDemoLanding';

// Página principal ULTRA-LIMPA - zero Fast Refresh loops
export default function HomePage() {
  return (
    <>
      <Head>
        <title>CoinBitClub - Trading Bot de Criptomoedas</title>
        <meta name="description" content="Plataforma premium de trading automatizado de criptomoedas" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gray-900">
        <RobotDemoLanding />
      </main>
    </>
  );
}
