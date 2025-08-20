import React, { useState, useEffect } from 'react';
import Head from 'next/head';

export default function HomePage() {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    // Only set time on client side to avoid hydration mismatch
    setCurrentTime(new Date().toLocaleString());
  }, []);

  return (
    <>
      <Head>
        <title>CoinBitClub MarketBot - TESTE</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-yellow-400">
            CoinBitClub MarketBot
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Sistema funcionando - Teste Fast Refresh
          </p>
          <div className="text-sm text-gray-500">
            {currentTime}
          </div>
        </div>
      </div>
    </>
  );
}
