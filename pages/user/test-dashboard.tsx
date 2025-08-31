import React from 'react';
import UserLayout from '../../components/UserLayout';

export default function TestDashboard() {
  return (
    <UserLayout title="Test Dashboard">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-4">Test Dashboard</h1>
        <p className="text-gray-300">
          Esta é uma página de teste para verificar se o UserLayout está funcionando corretamente.
        </p>
        <div className="mt-6 p-4 bg-gray-800 rounded-lg">
          <h2 className="text-lg font-semibold text-orange-400 mb-2">Status</h2>
          <p className="text-green-400">✓ UserLayout carregado com sucesso</p>
          <p className="text-green-400">✓ Componentes básicos funcionando</p>
          <p className="text-green-400">✓ Estilos aplicados corretamente</p>
        </div>
      </div>
    </UserLayout>
  );
}
