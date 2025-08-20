import React from 'react';
import AffiliateLayout from '../../components/AffiliateLayout';

export default function CommissionsPage() {
  return (
    <AffiliateLayout title="Minhas Comissões">
      <div className="p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Minhas Comissões
        </h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">
            Página de comissões em desenvolvimento...
          </p>
        </div>
      </div>
    </AffiliateLayout>
  );
}
