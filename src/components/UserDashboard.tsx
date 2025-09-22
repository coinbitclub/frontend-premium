/**
 * 👤 USER DASHBOARD - FRONTEND
 * Main dashboard component for authenticated users
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/apiService';

interface UserBalances {
  real: { brl: number; usd: number };
  admin: { brl: number; usd: number };
  commission: { brl: number; usd: number };
  total: { brl: number; usd: number };
}

interface TradingStatus {
  status: string;
  activePositions: number;
  maxPositions: number;
  canTrade: boolean;
}

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [balances, setBalances] = useState<UserBalances | null>(null);
  const [tradingStatus, setTradingStatus] = useState<TradingStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [balancesData, tradingData] = await Promise.all([
        apiService.getBalances(),
        apiService.getTradingStatus()
      ]);

      setBalances(balancesData.balances);
      setTradingStatus(tradingData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserTypeDisplay = (userType: string) => {
    const types = {
      ADMIN: 'Administrador',
      GESTOR: 'Gestor',
      OPERADOR: 'Operador',
      AFFILIATE_VIP: 'Afiliado VIP',
      AFFILIATE: 'Afiliado',
      USER: 'Usuário'
    };
    return types[userType as keyof typeof types] || userType;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Bem-vindo, {user?.full_name || user?.email}!
          </h1>
          <div className="flex items-center space-x-4">
            <span className="px-3 py-1 bg-blue-600 rounded-full text-sm">
              {getUserTypeDisplay(user?.user_type || 'USER')}
            </span>
            <span className="text-gray-400">
              ID: {user?.id}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Balance BRL */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Saldo Total BRL</h3>
            <p className="text-2xl font-bold text-green-400">
              R$ {balances?.total.brl.toFixed(2) || '0.00'}
            </p>
          </div>

          {/* Total Balance USD */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Saldo Total USD</h3>
            <p className="text-2xl font-bold text-blue-400">
              $ {balances?.total.usd.toFixed(2) || '0.00'}
            </p>
          </div>

          {/* Active Positions */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Posições Ativas</h3>
            <p className="text-2xl font-bold text-yellow-400">
              {tradingStatus?.activePositions || 0} / {tradingStatus?.maxPositions || 0}
            </p>
          </div>

          {/* Trading Status */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Status Trading</h3>
            <p className={`text-2xl font-bold ${
              tradingStatus?.canTrade ? 'text-green-400' : 'text-red-400'
            }`}>
              {tradingStatus?.canTrade ? 'Ativo' : 'Inativo'}
            </p>
          </div>
        </div>

        {/* Balance Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Real Balances */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Saldos Reais</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>BRL:</span>
                <span className="font-semibold">R$ {balances?.real.brl.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span>USD:</span>
                <span className="font-semibold">$ {balances?.real.usd.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </div>

          {/* Admin Balances */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Saldos Admin</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>BRL:</span>
                <span className="font-semibold">R$ {balances?.admin.brl.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span>USD:</span>
                <span className="font-semibold">$ {balances?.admin.usd.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Commission Balances (if applicable) */}
        {(user?.user_type === 'AFFILIATE' || user?.user_type === 'AFFILIATE_VIP') && (
          <div className="bg-gray-800 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold mb-4">Saldos de Comissão</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex justify-between">
                <span>BRL:</span>
                <span className="font-semibold text-purple-400">
                  R$ {balances?.commission.brl.toFixed(2) || '0.00'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>USD:</span>
                <span className="font-semibold text-purple-400">
                  $ {balances?.commission.usd.toFixed(2) || '0.00'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button className="bg-blue-600 hover:bg-blue-700 p-4 rounded-lg transition-colors">
            <h4 className="font-semibold mb-2">Iniciar Trading</h4>
            <p className="text-sm text-gray-300">Abrir nova posição</p>
          </button>

          <button className="bg-green-600 hover:bg-green-700 p-4 rounded-lg transition-colors">
            <h4 className="font-semibold mb-2">Depositar</h4>
            <p className="text-sm text-gray-300">Adicionar fundos</p>
          </button>

          <button className="bg-purple-600 hover:bg-purple-700 p-4 rounded-lg transition-colors">
            <h4 className="font-semibold mb-2">Ver Histórico</h4>
            <p className="text-sm text-gray-300">Transações e trades</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
