import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FiDollarSign, FiCreditCard, FiGift, FiUsers, FiSettings, FiTrendingUp, FiCheck, FiStar, FiArrowUp } from 'react-icons/fi';
import { useLanguage } from '../../hooks/useLanguage';
import StandardLayout from '../../components/StandardLayout';
import authService, { User } from '../../src/services/authService';

const UserAccount: NextPage = () => {
  const { language, t } = useLanguage();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [planStatus, setPlanStatus] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Estados para modais
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);

  // Estados para formulários
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [couponCode, setCouponCode] = useState('');

  // Estados para processamento
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if user is authenticated
      if (!authService.isAuthenticated()) {
        router.push('/auth/login');
        return;
      }

      // Get user profile from backend
      const userProfile = await authService.getProfile();
      setUser(userProfile);

      // Get plan status
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
      try {
        const planResponse = await fetch(`${baseUrl}/api/plans/status`, {
          headers: {
            'Authorization': `Bearer ${authService.getAccessToken()}`
          }
        });

        if (planResponse.ok) {
          const planData = await planResponse.json();
          setPlanStatus(planData);
        }
      } catch (planError) {
        console.warn('Plan status not available:', planError);
        // Don't fail the whole page if plan status fails
      }

    } catch (error) {
      console.error('Error loading user data:', error);
      setError('Erro ao carregar dados do usuário');
    } finally {
      setLoading(false);
    }
  };

  const handleRecharge = async () => {
    if (!rechargeAmount || parseFloat(rechargeAmount) < 20) {
      alert('Valor mínimo para recarga: R$ 20,00');
      return;
    }

    try {
      setProcessing(true);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
      const response = await fetch(`${baseUrl}/api/financial/recharge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authService.getAccessToken()}`
        },
        body: JSON.stringify({
          amount: parseFloat(rechargeAmount),
          currency: 'BRL'
        })
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to Stripe checkout
        window.location.href = data.checkout_url;
      } else {
        alert(data.error || 'Erro ao processar recarga');
      }
    } catch (error) {
      console.error('Error processing recharge:', error);
      alert('Erro ao processar recarga');
    } finally {
      setProcessing(false);
    }
  };

  const handleCoupon = async () => {
    if (!couponCode.trim()) {
      alert('Digite um código de cupom válido');
      return;
    }

    try {
      setProcessing(true);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
      const response = await fetch(`${baseUrl}/api/financial/coupons/use`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authService.getAccessToken()}`
        },
        body: JSON.stringify({
          code: couponCode.trim().toUpperCase()
        })
      });

      const data = await response.json();

      if (data.success) {
        alert(`Cupom aplicado com sucesso! Valor: ${data.currency === 'BRL' ? 'R$' : '$'} ${data.value}`);
        setCouponCode('');
        setShowCouponModal(false);
        loadUserData(); // Reload user data to update balances
      } else {
        alert(data.error || 'Cupom inválido');
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
      alert('Erro ao aplicar cupom');
    } finally {
      setProcessing(false);
    }
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400 mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">CoinBitClub</h2>
          <p className="text-gray-400">{loading ? 'Carregando dados...' : 'Carregando...'}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <StandardLayout title="Erro - Minha Conta">
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
          <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">Erro</h2>
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={loadUserData}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </StandardLayout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <StandardLayout title="Minha Conta">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Olá, {user.full_name}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Gerencie seus planos, saldos e configurações com facilidade e segurança
            </p>
          </div>

          {/* Saldos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 rounded-2xl transform transition-transform group-hover:scale-105"></div>
              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white">Saldo Principal</h3>
                  </div>
                  <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <p className="text-4xl font-black text-white">R$ {(user.balances.real_brl + user.balances.admin_brl).toFixed(2)}</p>
                  <p className="text-green-100 text-sm font-medium">Disponível para saque imediato</p>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 rounded-2xl transform transition-transform group-hover:scale-105"></div>
              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white">Comissões</h3>
                  </div>
                  <div className="w-3 h-3 bg-blue-300 rounded-full animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <p className="text-4xl font-black text-white">R$ {user.balances.commission_brl.toFixed(2)}</p>
                  <p className="text-blue-100 text-sm font-medium">Comissões de afiliados</p>
                </div>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            <button
              onClick={() => setShowRechargeModal(true)}
              className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-lg font-bold text-gray-800 dark:text-white group-hover:text-white transition-colors duration-300">Recarga</span>
              </div>
            </button>

            <button
              onClick={() => alert('Funcionalidade de saque será implementada em breve')}
              className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <span className="text-lg font-bold text-gray-800 dark:text-white group-hover:text-white transition-colors duration-300">Saque</span>
              </div>
            </button>

            <button
              onClick={() => setShowCouponModal(true)}
              className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <span className="text-lg font-bold text-gray-800 dark:text-white group-hover:text-white transition-colors duration-300">Cupom</span>
              </div>
            </button>
          </div>

          {/* Status do Plano */}
          {planStatus && (
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden mb-12">
              <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                  Status do Plano
                </h2>
                <p className="text-indigo-100">Informações da sua assinatura atual</p>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-2">Plano Atual</h3>
                    <p className="text-gray-800 dark:text-white text-2xl font-bold">{planStatus.user.planType || 'Básico'}</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-green-600 dark:text-green-400 mb-2">Status</h3>
                    <p className="text-gray-800 dark:text-white text-2xl font-bold">{planStatus.user.subscriptionStatus || 'Ativo'}</p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-purple-600 dark:text-purple-400 mb-2">Trading</h3>
                    <p className="text-gray-800 dark:text-white text-2xl font-bold">{planStatus.trading.enabled ? 'Ativo' : 'Inativo'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal de Recarga */}
        {showRechargeModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Recarregar Saldo</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Valor (R$ - mínimo R$ 20,00)
                  </label>
                  <input
                    type="number"
                    value={rechargeAmount}
                    onChange={(e) => setRechargeAmount(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Ex: 100.00"
                    min="20"
                    step="0.01"
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={handleRecharge}
                    disabled={processing}
                    className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    {processing ? 'Processando...' : 'Recarregar'}
                  </button>
                  <button
                    onClick={() => setShowRechargeModal(false)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Cupom */}
        {showCouponModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Aplicar Cupom</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Código do Cupom
                  </label>
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Ex: CBC123456"
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={handleCoupon}
                    disabled={processing}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    {processing ? 'Aplicando...' : 'Aplicar Cupom'}
                  </button>
                  <button
                    onClick={() => setShowCouponModal(false)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </StandardLayout>
  );
};

export default UserAccount;