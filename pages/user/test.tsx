import React from 'react';
import UserLayout from '../../components/UserLayout';

export default function TestUserPage() {
  return (
    <UserLayout title="Teste | CoinBitClub">
      <div className="p-8">
        <h1 className="text-3xl font-bold text-white mb-4">
          Teste do UserLayout
        </h1>
        <p className="text-gray-300">
          Se você consegue ver esta página, o UserLayout está funcionando corretamente!
        </p>
        
        <div className="mt-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
          <h2 className="text-xl font-semibold text-green-400 mb-2">✅ Sucesso!</h2>
          <p className="text-green-200">
            O componente UserLayout foi carregado sem erros.
          </p>
        </div>
      </div>
    </UserLayout>
  );
}
