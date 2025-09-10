/**
 * 🧪 ADAPTERS DEMO PAGE - T6 Implementation
 * Página de demonstração dos adapters implementados
 * Mostra como usar cada adapter na prática
 */

import React, { useState, useEffect } from 'react';
import {
  coreAdapter,
  authAdapter,
  tradingAdapter,
  financialAdapter,
  usersAdapter
} from '../src/lib/api/adapters';
import type {
  HealthCheckResponse,
  UserProfile,
  Position,
  UserBalance,
  User
} from '../src/lib/api/adapters';

interface AdapterDemoState {
  health: HealthCheckResponse | null;
  profile: UserProfile | null;
  positions: Position[];
  balance: UserBalance | null;
  users: User[];
  loading: { [key: string]: boolean };
  errors: { [key: string]: string | null };
}

export default function AdaptersDemo() {
  const [state, setState] = useState<AdapterDemoState>({
    health: null,
    profile: null,
    positions: [],
    balance: null,
    users: [],
    loading: {},
    errors: {}
  });

  const setLoading = (key: string, loading: boolean) => {
    setState(prev => ({
      ...prev,
      loading: { ...prev.loading, [key]: loading }
    }));
  };

  const setError = (key: string, error: string | null) => {
    setState(prev => ({
      ...prev,
      errors: { ...prev.errors, [key]: error }
    }));
  };

  // ===============================================
  // 🏗️ CORE ADAPTER DEMO
  // ===============================================

  const testCoreAdapter = async () => {
    setLoading('core', true);
    setError('core', null);
    
    try {
      const health = await coreAdapter.getHealth();
      setState(prev => ({ ...prev, health }));
    } catch (error: any) {
      setError('core', error.message);
    } finally {
      setLoading('core', false);
    }
  };

  // ===============================================
  // 🔐 AUTH ADAPTER DEMO
  // ===============================================

  const testAuthAdapter = async () => {
    setLoading('auth', true);
    setError('auth', null);
    
    try {
      // Simular login (vai falhar, mas mostra a estrutura)
      const loginResult = await authAdapter.login({
        email: 'demo@example.com',
        password: 'demo123'
      });
      
      // Se login funcionasse, poderíamos pegar o profile
      // const profile = await authAdapter.getProfile();
      // setState(prev => ({ ...prev, profile }));
      
    } catch (error: any) {
      setError('auth', `Demo: ${error.message}`);
    } finally {
      setLoading('auth', false);
    }
  };

  // ===============================================
  // 📈 TRADING ADAPTER DEMO
  // ===============================================

  const testTradingAdapter = async () => {
    setLoading('trading', true);
    setError('trading', null);
    
    try {
      const positions = await tradingAdapter.getActivePositions();
      setState(prev => ({ ...prev, positions: positions.positions || [] }));
    } catch (error: any) {
      setError('trading', error.message);
    } finally {
      setLoading('trading', false);
    }
  };

  // ===============================================
  // 💰 FINANCIAL ADAPTER DEMO
  // ===============================================

  const testFinancialAdapter = async () => {
    setLoading('financial', true);
    setError('financial', null);
    
    try {
      const balance = await financialAdapter.getBalance('demo-user');
      setState(prev => ({ ...prev, balance }));
    } catch (error: any) {
      setError('financial', error.message);
    } finally {
      setLoading('financial', false);
    }
  };

  // ===============================================
  // 👥 USERS ADAPTER DEMO
  // ===============================================

  const testUsersAdapter = async () => {
    setLoading('users', true);
    setError('users', null);
    
    try {
      const usersResult = await usersAdapter.getUsers({ limit: 5 });
      setState(prev => ({ ...prev, users: usersResult.data || [] }));
    } catch (error: any) {
      setError('users', error.message);
    } finally {
      setLoading('users', false);
    }
  };

  // ===============================================
  // 🎨 RENDER
  // ===============================================

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🧪 Adapters Demo - T6
          </h1>
          <p className="text-gray-600">
            Demonstração dos adapters implementados para integração frontend-backend
          </p>
          <div className="mt-4 text-sm text-gray-500">
            <strong>Status:</strong> 5 adapters disponíveis
          </div>
        </div>

        {/* Adapters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Core Adapter */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              🏗️ Core Adapter
            </h3>
            <button
              onClick={testCoreAdapter}
              disabled={state.loading.core}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 mb-4"
            >
              {state.loading.core ? 'Testando...' : 'Testar Health Check'}
            </button>
            
            {state.errors.core && (
              <div className="text-red-600 text-sm mb-2">{state.errors.core}</div>
            )}
            
            {state.health && (
              <div className="text-sm space-y-1">
                <div><strong>Status:</strong> {state.health.ok ? '✅ OK' : '❌ Error'}</div>
                <div><strong>Version:</strong> {state.health.version}</div>
                <div><strong>Timestamp:</strong> {new Date(state.health.ts).toLocaleString()}</div>
              </div>
            )}
          </div>

          {/* Auth Adapter */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              🔐 Auth Adapter
            </h3>
            <button
              onClick={testAuthAdapter}
              disabled={state.loading.auth}
              className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 mb-4"
            >
              {state.loading.auth ? 'Testando...' : 'Testar Login Demo'}
            </button>
            
            {state.errors.auth && (
              <div className="text-orange-600 text-sm mb-2">{state.errors.auth}</div>
            )}
            
            <div className="text-xs text-gray-500">
              Funcionalidades: login, refresh, logout, profile, 2FA
            </div>
          </div>

          {/* Trading Adapter */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📈 Trading Adapter
            </h3>
            <button
              onClick={testTradingAdapter}
              disabled={state.loading.trading}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50 mb-4"
            >
              {state.loading.trading ? 'Carregando...' : 'Buscar Posições'}
            </button>
            
            {state.errors.trading && (
              <div className="text-red-600 text-sm mb-2">{state.errors.trading}</div>
            )}
            
            {state.positions.length > 0 && (
              <div className="text-sm">
                <strong>Posições:</strong> {state.positions.length}
              </div>
            )}
          </div>

          {/* Financial Adapter */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              💰 Financial Adapter
            </h3>
            <button
              onClick={testFinancialAdapter}
              disabled={state.loading.financial}
              className="w-full bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 disabled:opacity-50 mb-4"
            >
              {state.loading.financial ? 'Carregando...' : 'Buscar Saldo'}
            </button>
            
            {state.errors.financial && (
              <div className="text-red-600 text-sm mb-2">{state.errors.financial}</div>
            )}
            
            {state.balance && (
              <div className="text-sm space-y-1">
                <div><strong>USD:</strong> ${state.balance.totalUSD}</div>
                <div><strong>BRL:</strong> R${state.balance.totalBRL}</div>
              </div>
            )}
          </div>

          {/* Users Adapter */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              👥 Users Adapter
            </h3>
            <button
              onClick={testUsersAdapter}
              disabled={state.loading.users}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50 mb-4"
            >
              {state.loading.users ? 'Carregando...' : 'Listar Usuários'}
            </button>
            
            {state.errors.users && (
              <div className="text-red-600 text-sm mb-2">{state.errors.users}</div>
            )}
            
            {state.users.length > 0 && (
              <div className="text-sm">
                <strong>Usuários:</strong> {state.users.length} encontrados
              </div>
            )}
          </div>

          {/* Adapter Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📊 Adapter Stats
            </h3>
            <div className="text-sm space-y-2">
              <div><strong>Total:</strong> 5</div>
              <div><strong>Disponíveis:</strong></div>
              <ul className="list-disc list-inside text-xs text-gray-600 ml-2">
                <li>core</li>
                <li>auth</li>
                <li>trading</li>
                <li>financial</li>
                <li>users</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>T6 - Adapters por domínio implementados com sucesso! ✅</p>
          <p className="mt-2">
            <strong>Próximo:</strong> T7 - Scaffolding de páginas/hooks (LIST/DETAILS/FORM)
          </p>
        </div>
      </div>
    </div>
  );
}