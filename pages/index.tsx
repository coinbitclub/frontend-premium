import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to landing page immediately
    router.replace('/home');
  }, [router]);

  return (
    <>
      <Head>
        <title>CoinBitClub MarketBot - Redirecting...</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-xl text-gray-300">
            Redirecionando para a landing page...
          </p>
        </div>
      </div>
    </>
  );
}