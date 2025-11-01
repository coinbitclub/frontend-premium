import React from 'react';

export default function TestHome() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        MarketBot - Teste Simples
      </h1>
      <div className="max-w-4xl mx-auto">
        <p className="text-xl text-center text-slate-300 mb-8">
          Se você está vendo esta página, o servidor está funcionando!
        </p>
        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Status do Sistema</h2>
          <p>✅ Next.js funcionando</p>
          <p>✅ React funcionando</p>
          <p>✅ Tailwind CSS funcionando</p>
        </div>
      </div>
    </div>
  );
}
