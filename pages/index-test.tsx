import React from 'react';
import Head from 'next/head';

export default function TestPage() {
  return (
    <>
      <Head>
        <title>Test Page - MarketBot</title>
        <meta name="description" content="Página de teste simples" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-yellow-400">
            🚀 MARKETBOT - TESTE SIMPLES
          </h1>
          <p className="text-xl text-slate-300 mb-8">
            Se você está vendo esta página sem erros de Fast Refresh, 
            o problema foi identificado e está na página principal.
          </p>
          <div className="bg-slate-800 rounded-lg p-6 border border-yellow-500/20">
            <h2 className="text-2xl font-bold text-green-400 mb-2">✅ TESTE APROVADO</h2>
            <p className="text-slate-300">
              Servidor funcionando corretamente sem problemas de Fast Refresh!
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
