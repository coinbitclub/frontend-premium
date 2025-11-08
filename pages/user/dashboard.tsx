import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FiDollarSign, FiTrendingUp, FiTarget, FiRefreshCw, FiAlertCircle, FiArrowRight, FiUsers, FiGift, FiCreditCard, FiTag, FiArrowDown } from 'react-icons/fi';
import { useLanguage } from '../../hooks/useLanguage';
import { useResponsive } from '../../hooks/useResponsive';
import { useAuth } from '../../src/contexts/AuthContext';
import { useAPIKeys } from '../../hooks/useAPIKeys';
import UserLayout from '../../components/UserLayout';
import ResponsiveContainer from '../../components/ResponsiveContainer';
import authService from '../../src/services/authService';
// Authentication removed - ProtectedRoute disabled
import { useToast } from '../../components/Toast';
import { UserProfile } from '../../src/services/userService';
import userService from '../../src/services/userService';
import { DailyStats, operationsService } from '../../src/services/operationsService';
import { AllExchangeBalances, exchangeBalanceService } from '../../src/services/exchangeBalanceService';

const IS_DEV = process.env.NODE_ENV === 'development';

export default function UserDashboard() {
  // ALL HOOKS MUST BE AT THE TOP - NEVER USE HOOKS AFTER CONDITIONAL RETURNS
  const router = useRouter();
  const { language } = useLanguage();
  const { isMobile } = useResponsive();
  const { showToast } = useToast();
  const { isAuthenticated } = useAuth();
  const { hasAnyKeys, hasVerifiedKeys } = useAPIKeys();
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [dailyStats, setDailyStats] = useState<DailyStats | null>(null);
  const [exchangeBalances, setExchangeBalances] = useState<AllExchangeBalances | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para modais
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [couponCode, setCouponCode] = useState('');

  // Define all callbacks - Use real API data
  const loadDashboardData = useCallback(async () => {
    try {
      setDataLoading(true);
      setError(null);

      IS_DEV && console.log('📊 Dashboard: Loading real data from API...');
      
      // Fetch user profile, daily stats, and exchange balances in parallel
      const [userProfileResponse, dailyStatsResponse, exchangeBalancesResponse] = await Promise.all([
        userService.getUserProfile(),
        operationsService.getDailyStats(),
        exchangeBalanceService.getAllExchangeBalances()
      ]);

      IS_DEV && console.log('📊 Dashboard: API responses received:', {
        userProfileSuccess: userProfileResponse?.success,
        dailyStatsResponse: dailyStatsResponse ? 'received' : 'null/undefined',
        exchangeBalancesReceived: exchangeBalancesResponse ? 'received' : 'null/undefined'
      });

      if (userProfileResponse.success) {
        // Ensure all balance values are properly handled
        const userProfile = userProfileResponse.user;
        if (userProfile.balances) {
          // Helper function to safely convert to number and handle null/NaN
          const safeNumber = (value: any): number => {
            const num = Number(value);
            return isNaN(num) || num === null || num === undefined ? 0 : num;
          };

          // Safely convert all balance values
          userProfile.balances.balance_real_brl = safeNumber(userProfile.balances.balance_real_brl);
          userProfile.balances.balance_real_usd = safeNumber(userProfile.balances.balance_real_usd);
          userProfile.balances.balance_admin_brl = safeNumber(userProfile.balances.balance_admin_brl);
          userProfile.balances.balance_admin_usd = safeNumber(userProfile.balances.balance_admin_usd);
        }
        setUserProfile(userProfile);
        IS_DEV && console.log('✅ Dashboard: User profile loaded successfully');
      } else {
        console.error('❌ Dashboard: Failed to load user profile');
        throw new Error('Failed to load user profile');
      }

      if (dailyStatsResponse && dailyStatsResponse !== null) {
        // Ensure all stats values are properly handled
        const safeNumber = (value: any): number => {
          const num = Number(value);
          return isNaN(num) || num === null || num === undefined ? 0 : num;
        };

        // Safely convert all stats values
        const safeStats = {
          ...dailyStatsResponse,
          operationsToday: safeNumber(dailyStatsResponse.operationsToday),
          successRate: safeNumber(dailyStatsResponse.successRate),
          totalProfit: safeNumber(dailyStatsResponse.totalProfit),
          totalLoss: safeNumber(dailyStatsResponse.totalLoss),
          netProfit: safeNumber(dailyStatsResponse.netProfit),
          todayReturnPercent: safeNumber(dailyStatsResponse.todayReturnPercent)
        };

        setDailyStats(safeStats);
        IS_DEV && console.log('✅ Dashboard: Daily stats loaded successfully:', safeStats);
      } else {
        IS_DEV && console.log('⚠️ Dashboard: No daily stats received - using default values');
        setDailyStats({
          operationsToday: 0,
          successRate: 0,
          totalProfit: 0,
          totalLoss: 0,
          netProfit: 0,
          winStreak: 0,
          averageHoldTime: 0,
          volumeTraded: 0,
          bestTrade: 0,
          worstTrade: 0,
          historicalSuccessRate: 0,
          todayReturnUSD: 0,
          todayReturnPercent: 0,
          totalInvested: 0
        });
      }

      if (exchangeBalancesResponse && exchangeBalancesResponse !== null) {
        setExchangeBalances(exchangeBalancesResponse);
        IS_DEV && console.log('✅ Dashboard: Exchange balances loaded successfully');
      } else {
        IS_DEV && console.log('⚠️ Dashboard: No exchange balances received');
        setExchangeBalances(null);
      }

    } catch (error) {
      console.error('❌ Dashboard: Error loading data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load dashboard data');
    } finally {
      setDataLoading(false);
    }
  }, []);

  // Handle refresh button
  const handleRefresh = useCallback(async () => {
    setLoading(true);
    await loadDashboardData();
    setLoading(false);
  }, [loadDashboardData]);

  // Handle recharge action
  const handleRecharge = useCallback(async () => {
    if (!rechargeAmount || parseFloat(rechargeAmount) <= 0) {
      showToast(
        language === 'pt' ? 'Digite um valor válido para recarga' : 'Enter a valid recharge amount',
        'error'
      );
      return;
    }

    try {
      setProcessing(true);
      // Simular processo de recarga - aqui você conectaria com sua API real
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showToast(
        language === 'pt' ? 'Recarga processada com sucesso!' : 'Recharge processed successfully!',
        'success'
      );
      setShowRechargeModal(false);
      setRechargeAmount('');
      await loadDashboardData(); // Recarregar dados
    } catch (error) {
      showToast(
        language === 'pt' ? 'Erro ao processar recarga' : 'Error processing recharge',
        'error'
      );
    } finally {
      setProcessing(false);
    }
  }, [rechargeAmount, language, showToast, loadDashboardData]);

  // Handle withdrawal action
  const handleWithdraw = useCallback(async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      showToast(
        language === 'pt' ? 'Digite um valor válido para saque' : 'Enter a valid withdrawal amount',
        'error'
      );
      return;
    }

    // Check if user has enough balance - only from Carga Robô (prepaid balance)
    if (userProfile?.balances) {
      const availableBalance = dashboardData.balances.prepaid; // Usar apenas o saldo da Carga Robô
      
      if (parseFloat(withdrawAmount) > availableBalance) {
        showToast(
          language === 'pt' ? 'Saldo insuficiente na Carga Robô para saque' : 'Insufficient Robot Charge balance for withdrawal',
          'error'
        );
        return;
      }
    }

    try {
      setProcessing(true);
      // Simular processo de saque - aqui você conectaria com sua API real
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showToast(
        language === 'pt' ? 'Solicitação de saque enviada com sucesso!' : 'Withdrawal request sent successfully!',
        'success'
      );
      setShowWithdrawModal(false);
      setWithdrawAmount('');
      await loadDashboardData(); // Recarregar dados
    } catch (error) {
      showToast(
        language === 'pt' ? 'Erro ao processar saque' : 'Error processing withdrawal',
        'error'
      );
    } finally {
      setProcessing(false);
    }
  }, [withdrawAmount, language, showToast, loadDashboardData, userProfile?.balances]);

  // Handle coupon action
  const handleCoupon = useCallback(async () => {
    if (!couponCode.trim()) {
      showToast(
        language === 'pt' ? 'Digite um código de cupom válido' : 'Enter a valid coupon code',
        'error'
      );
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
        showToast(
          `${language === 'pt' ? 'Cupom aplicado com sucesso! Valor:' : 'Coupon applied successfully! Value:'} ${data.currency === 'BRL' ? 'R$' : '$'} ${data.value}`,
          'success'
        );
        setCouponCode('');
        setShowCouponModal(false);
        loadDashboardData(); // Recarregar dados para mostrar o novo saldo
      } else {
        showToast(
          data.error || (language === 'pt' ? 'Cupom inválido' : 'Invalid coupon'),
          'error'
        );
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
      showToast(
        language === 'pt' ? 'Erro ao aplicar cupom' : 'Error applying coupon',
        'error'
      );
    } finally {
      setProcessing(false);
    }
  }, [couponCode, language, showToast, loadDashboardData]);

  // Calculate dashboard data with real exchange balances
  const dashboardData = useMemo(() => {
    if (!userProfile || !dailyStats) {
      return {
        balances: {
          total: 0,
          binance: 0,
          bybit: 0,
          prepaid: 0,
          promotional: 0
        },
        performance: {
          todayReturn: '0.0',
          winRate: '0.0'
        }
      };
    }

    const balances = userProfile.balances || {
      balance_real_brl: 0,
      balance_real_usd: 0,
      balance_admin_brl: 0,
      balance_admin_usd: 0
    };

    // Helper function to safely convert to number and handle null/NaN
    const safeNumber = (value: any): number => {
      const num = Number(value);
      return isNaN(num) || num === null || num === undefined ? 0 : num;
    };

    // Safely convert all balance values
    const realBrl = safeNumber(balances.balance_real_brl);
    const realUsd = safeNumber(balances.balance_real_usd);
    const adminBrl = safeNumber(balances.balance_admin_brl);
    const adminUsd = safeNumber(balances.balance_admin_usd);

    // Use REAL exchange balances from API
    const binanceBalance = exchangeBalances?.binance && !exchangeBalances.binance.error 
      ? safeNumber(exchangeBalances.binance.total_equity) 
      : 0;
    const bybitBalance = exchangeBalances?.bybit && !exchangeBalances.bybit.error 
      ? safeNumber(exchangeBalances.bybit.total_equity) 
      : 0;
    
    // Calculate total from real exchange balances + database balances
    const exchangeTotalBalance = binanceBalance + bybitBalance;
    const databaseTotalBalance = realBrl + realUsd + adminBrl + adminUsd;
    const totalBalance = exchangeTotalBalance || databaseTotalBalance; // Use exchange balances if available, otherwise use database
    
    const prepaidBalance = realBrl + realUsd; // Carga Robô - Saldo de recargas feitas
    const promotionalBalance = adminBrl + adminUsd; // Saldo promocional são os créditos administrativos

    // Debug performance calculation
    const todayReturnValue = safeNumber(dailyStats?.todayReturnPercent);
    const winRateValue = safeNumber(dailyStats?.successRate);
    
    IS_DEV && console.log('📊 Dashboard: Performance calculation:', {
      dailyStatsExists: !!dailyStats,
      todayReturnPercent: dailyStats?.todayReturnPercent,
      successRate: dailyStats?.successRate,
      calculatedTodayReturn: todayReturnValue,
      calculatedWinRate: winRateValue
    });

    return {
      balances: {
        total: totalBalance,
        binance: binanceBalance,
        bybit: bybitBalance,
        prepaid: prepaidBalance,
        promotional: promotionalBalance
      },
      performance: {
        todayReturn: todayReturnValue.toFixed(1),
        winRate: winRateValue.toFixed(1)
      }
    };
  }, [userProfile, dailyStats, exchangeBalances]);

  // Data loading effect - Load dashboard data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      IS_DEV && console.log('📊 Dashboard: User authenticated, loading dashboard data...');
      loadDashboardData();
    }
  }, [isAuthenticated, loadDashboardData]);

  // Show error state if there's a persistent error
  if (error && !dataLoading) {
    return (
      <UserLayout
        title={`${language === 'pt' ? 'Dashboard' : 'Dashboard'} | CoinBitClub`}
        description={language === 'pt' ? 'Dashboard do usuário' : 'User Dashboard'}
      >
        <ResponsiveContainer mobileOptimized={true} padding={isMobile ? 'sm' : 'md'}>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">!</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
                {language === 'pt' ? 'Erro ao carregar dados' : 'Error loading data'}
              </h2>
              <p className="text-gray-400 mb-4">{error}</p>
              <button
                onClick={loadDashboardData}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-semibold rounded-lg hover:from-orange-600 hover:to-yellow-600 transition-all"
              >
                {language === 'pt' ? 'Tentar novamente' : 'Try again'}
              </button>
            </div>
          </div>
        </ResponsiveContainer>
      </UserLayout>
    );
  }

  // Main dashboard render
  return (
    <UserLayout 
      title={`${language === 'pt' ? 'Dashboard' : 'Dashboard'} | CoinBitClub`}
      description={language === 'pt' ? 'Dashboard do usuário' : 'User Dashboard'}
    >
      <ResponsiveContainer mobileOptimized={true} padding={isMobile ? 'sm' : 'md'}>
        <div className={`${isMobile ? 'pt-2 space-y-6' : 'pt-4 space-y-8'}`}>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent ${
                isMobile ? 'text-2xl mb-1' : 'text-3xl mb-2'
              }`}>
                {language === 'pt' ? 'Dashboard' : 'Dashboard'}
              </h1>
              <p className={`text-gray-400 ${isMobile ? 'text-sm' : ''}`}>
                {dataLoading ? (
                  language === 'pt' ? 'Carregando...' : 'Loading...'
                ) : (
                  language === 'pt'
                    ? `Performance de hoje: ${parseFloat(dashboardData.performance.todayReturn) >= 0 ? '+' : ''}${dashboardData.performance.todayReturn}%`
                    : `Today's performance: ${parseFloat(dashboardData.performance.todayReturn) >= 0 ? '+' : ''}${dashboardData.performance.todayReturn}%`
                )}
              </p>
            </div>
            
            <button 
              onClick={handleRefresh}
              className="p-3 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl border border-gray-600/50 hover:border-orange-400/50 transition-all group"
              disabled={loading}
            >
              <FiRefreshCw className={`text-orange-400 group-hover:scale-110 transition-transform ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* API Keys Warning Banner */}
          {!hasAnyKeys && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <FiAlertCircle className="text-orange-400 text-xl flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-orange-400 font-bold mb-1">
                      {language === 'pt' ? 'Ação Necessária: Conecte suas API Keys' : 'Action Required: Connect Your API Keys'}
                    </h3>
                    <p className="text-gray-300 text-sm mb-3">
                      {language === 'pt'
                        ? 'Para começar a operar Futures, você precisa conectar suas API keys da Bybit ou Binance. Seus fundos ficam seguros na sua própria exchange!'
                        : 'To start Futures trading, you need to connect your Bybit or Binance API keys. Your funds stay safe in your own exchange!'}
                    </p>
                    <button
                      onClick={() => router.push('/settings/api-keys')}
                      className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-bold py-2 px-4 rounded-lg transition-all flex items-center gap-2 text-sm"
                    >
                      {language === 'pt' ? 'Conectar API Keys' : 'Connect API Keys'}
                      <FiArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Pending Verification Warning */}
          {hasAnyKeys && !hasVerifiedKeys && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <FiAlertCircle className="text-yellow-400 text-xl flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-yellow-400 font-bold mb-1">
                      {language === 'pt' ? 'Verificação Pendente' : 'Verification Pending'}
                    </h3>
                    <p className="text-gray-300 text-sm mb-3">
                      {language === 'pt'
                        ? 'Suas API keys precisam ser verificadas antes de começar a operar Futures.'
                        : 'Your API keys need to be verified before you can start Futures trading.'}
                    </p>
                    <button
                      onClick={() => router.push('/settings/api-keys')}
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold py-2 px-4 rounded-lg transition-all flex items-center gap-2 text-sm"
                    >
                      {language === 'pt' ? 'Verificar API Keys' : 'Verify API Keys'}
                      <FiArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Balance Cards - 5 colunas para separar saldo pré-pago e promocional */}
          <div className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-5 gap-4'}`}>
            {/* Saldo Total */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30 hover:border-orange-400/50 transition-all group ${dataLoading ? 'animate-pulse' : ''}`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-lg">
                  <FiDollarSign className="text-orange-400 text-xl" />
                </div>
                <div className={`bg-gradient-to-r ${parseFloat(dashboardData.performance.todayReturn) >= 0 ? 'from-green-500/20 to-emerald-500/20 border-green-500/30' : 'from-red-500/20 to-red-600/20 border-red-500/30'} px-2 py-1 rounded-lg border`}>
                  <span className={`${parseFloat(dashboardData.performance.todayReturn) >= 0 ? 'text-green-400' : 'text-red-400'} text-xs font-medium`}>
                    {dataLoading ? '...' : `${parseFloat(dashboardData.performance.todayReturn) >= 0 ? '+' : ''}${dashboardData.performance.todayReturn}%`}
                  </span>
                </div>
              </div>
              <div>
                <p className={`text-gray-400 ${isMobile ? 'text-xs' : 'text-sm'} mb-1`}>
                  {language === 'pt' ? 'Saldo Total' : 'Total Balance'}
                </p>
                <p className={`text-white font-bold ${isMobile ? 'text-lg' : 'text-2xl'}`}>
                  {dataLoading ? '...' : `$${dashboardData.balances.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </p>
              </div>
            </motion.div>

            {/* Saldo Binance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30 hover:border-yellow-400/50 transition-all group ${dataLoading ? 'animate-pulse' : ''}`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg">
                  <span className="text-yellow-400 font-bold text-lg">B</span>
                </div>
                <span className="text-yellow-400 text-xs font-medium">BINANCE</span>
              </div>
              <div>
                <p className={`text-gray-400 ${isMobile ? 'text-xs' : 'text-sm'} mb-1`}>
                  {language === 'pt' ? 'Saldo Binance' : 'Binance Balance'}
                </p>
                <p className={`text-white font-bold ${isMobile ? 'text-lg' : 'text-2xl'}`}>
                  {dataLoading ? '...' : `$${dashboardData.balances.binance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </p>
              </div>
            </motion.div>

            {/* Saldo Bybit */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30 hover:border-blue-400/50 transition-all group ${dataLoading ? 'animate-pulse' : ''}`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-lg">
                  <span className="text-blue-400 font-bold text-lg">By</span>
                </div>
                <span className="text-blue-400 text-xs font-medium">BYBIT</span>
              </div>
              <div>
                <p className={`text-gray-400 ${isMobile ? 'text-xs' : 'text-sm'} mb-1`}>
                  {language === 'pt' ? 'Saldo Bybit' : 'Bybit Balance'}
                </p>
                <p className={`text-white font-bold ${isMobile ? 'text-lg' : 'text-2xl'}`}>
                  {dataLoading ? '...' : `$${dashboardData.balances.bybit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </p>
              </div>
            </motion.div>

            {/* Saldo Carga Robô (Recargas) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`bg-gradient-to-br from-green-800/50 to-emerald-900/50 backdrop-blur-sm rounded-xl p-4 border border-green-700/30 hover:border-green-400/50 transition-all group ${dataLoading ? 'animate-pulse' : ''}`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg">
                  <FiCreditCard className="text-green-400 text-xl" />
                </div>
                <span className="text-green-400 text-xs font-medium">CARGA ROBÔ</span>
              </div>
              <div>
                <p className={`text-gray-400 ${isMobile ? 'text-xs' : 'text-sm'} mb-1`}>
                  {language === 'pt' ? 'Carga Robô' : 'Robot Charge'}
                </p>
                <p className={`text-white font-bold ${isMobile ? 'text-lg' : 'text-2xl'}`}>
                  {dataLoading ? '...' : `$${dashboardData.balances.prepaid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </p>
                <p className={`text-green-300 ${isMobile ? 'text-xs' : 'text-sm'} mt-1`}>
                  {language === 'pt' ? 'Saldo da carga' : 'Charge balance'}
                </p>
              </div>
            </motion.div>

            {/* Saldo Promocional */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`bg-gradient-to-br from-purple-800/50 to-pink-900/50 backdrop-blur-sm rounded-xl p-4 border border-purple-700/30 hover:border-purple-400/50 transition-all group ${dataLoading ? 'animate-pulse' : ''}`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg">
                  <FiGift className="text-purple-400 text-xl" />
                </div>
                <span className="text-purple-400 text-xs font-medium">PROMOCIONAL</span>
              </div>
              <div>
                <p className={`text-gray-400 ${isMobile ? 'text-xs' : 'text-sm'} mb-1`}>
                  {language === 'pt' ? 'Saldo Promocional' : 'Promotional Balance'}
                </p>
                <p className={`text-white font-bold ${isMobile ? 'text-lg' : 'text-2xl'}`}>
                  {dataLoading ? '...' : `$${dashboardData.balances.promotional.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </p>
                <p className={`text-purple-300 ${isMobile ? 'text-xs' : 'text-sm'} mt-1`}>
                  {language === 'pt' ? 'Cupons e bônus' : 'Coupons & bonuses'}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Botões de Ação - 3 botões: Usar Cupom, Add Carga ao Robô e Solicitar Saque */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-3 gap-4'}`}
          >
            {/* Botão Usar Cupom */}
            <button
              onClick={() => setShowCouponModal(true)}
              className="group relative overflow-hidden bg-gradient-to-br from-orange-600/20 to-yellow-600/20 hover:from-orange-600/30 hover:to-yellow-600/30 backdrop-blur-sm rounded-xl p-4 border border-orange-600/30 hover:border-orange-500/50 transition-all"
            >
              <div className="flex flex-col items-center space-y-3">
                <div className="p-3 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-xl group-hover:scale-110 transition-transform">
                  <FiTag className="text-orange-400 text-2xl" />
                </div>
                <div className="text-center">
                  <p className="text-orange-400 font-bold text-sm mb-1">
                    {language === 'pt' ? 'Usar Cupom' : 'Use Coupon'}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {language === 'pt' ? 'Aplicar desconto' : 'Apply discount'}
                  </p>
                </div>
              </div>
            </button>

            {/* Botão Add Carga ao Robô */}
            <button
              onClick={() => setShowRechargeModal(true)}
              className="group relative overflow-hidden bg-gradient-to-br from-green-600/20 to-emerald-600/20 hover:from-green-600/30 hover:to-emerald-600/30 backdrop-blur-sm rounded-xl p-4 border border-green-600/30 hover:border-green-500/50 transition-all"
            >
              <div className="flex flex-col items-center space-y-3">
                <div className="p-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl group-hover:scale-110 transition-transform">
                  <FiCreditCard className="text-green-400 text-2xl" />
                </div>
                <div className="text-center">
                  <p className="text-green-400 font-bold text-sm mb-1">
                    {language === 'pt' ? 'Add Carga ao Robô' : 'Add Robot Charge'}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {language === 'pt' ? 'Adicionar saldo' : 'Add balance'}
                  </p>
                </div>
              </div>
            </button>

            {/* Botão Solicitar Saque */}
            <button
              onClick={() => setShowWithdrawModal(true)}
              className="group relative overflow-hidden bg-gradient-to-br from-blue-600/20 to-indigo-600/20 hover:from-blue-600/30 hover:to-indigo-600/30 backdrop-blur-sm rounded-xl p-4 border border-blue-600/30 hover:border-blue-500/50 transition-all"
            >
              <div className="flex flex-col items-center space-y-3">
                <div className="p-3 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl group-hover:scale-110 transition-transform">
                  <FiArrowDown className="text-blue-400 text-2xl" />
                </div>
                <div className="text-center">
                  <p className="text-blue-400 font-bold text-sm mb-1">
                    {language === 'pt' ? 'Solicitar Saque' : 'Request Withdrawal'}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {language === 'pt' ? 'Sacar da Carga Robô' : 'Withdraw from Robot Charge'}
                  </p>
                </div>
              </div>
            </button>
          </motion.div>

          {/* Performance Stats */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className={`bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-sm rounded-xl p-4 border border-green-700/30 ${dataLoading ? 'animate-pulse' : ''}`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <FiTrendingUp className="text-green-400 text-xl" />
                <span className="text-green-400 text-xs font-medium">
                  {language === 'pt' ? 'RETORNO HOJE' : 'TODAY RETURN'}
                </span>
              </div>
              <div>
                <p className={`${parseFloat(dashboardData.performance.todayReturn) >= 0 ? 'text-green-400' : 'text-red-400'} font-bold ${isMobile ? 'text-lg' : 'text-2xl'} mb-1`}>
                  {dataLoading ? '...' : `${parseFloat(dashboardData.performance.todayReturn) >= 0 ? '+' : ''}${dashboardData.performance.todayReturn}%`}
                </p>
                <p className={`text-gray-400 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  {language === 'pt' ? 'Hoje' : 'Today'}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className={`bg-gradient-to-br from-blue-900/30 to-indigo-900/30 backdrop-blur-sm rounded-xl p-4 border border-blue-700/30 ${dataLoading ? 'animate-pulse' : ''}`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <FiTarget className="text-blue-400 text-xl" />
                <span className="text-blue-400 text-xs font-medium">
                  {language === 'pt' ? 'TAXA SUCESSO' : 'WIN RATE'}
                </span>
              </div>
              <div>
                <p className={`text-blue-400 font-bold ${isMobile ? 'text-lg' : 'text-2xl'} mb-1`}>
                  {dataLoading ? '...' : `${dashboardData.performance.winRate}%`}
                </p>
                <p className={`text-gray-400 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  {language === 'pt' ? 'Operações' : 'Trades'}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Modais */}
          {/* Modal de Recarga */}
          {showRechargeModal && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gray-900 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-700"
              >
                <h3 className="text-xl font-bold text-white mb-4">
                  {language === 'pt' ? 'Add Carga ao Robô' : 'Add Robot Charge'}
                </h3>
                <input
                  type="number"
                  value={rechargeAmount}
                  onChange={(e) => setRechargeAmount(e.target.value)}
                  placeholder={language === 'pt' ? 'Valor da recarga' : 'Recharge amount'}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white mb-4"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowRechargeModal(false)}
                    className="flex-1 py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
                  >
                    {language === 'pt' ? 'Cancelar' : 'Cancel'}
                  </button>
                  <button
                    onClick={handleRecharge}
                    disabled={processing}
                    className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all disabled:opacity-50"
                  >
                    {processing ? (language === 'pt' ? 'Processando...' : 'Processing...') : (language === 'pt' ? 'Recarregar' : 'Recharge')}
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* Modal de Saque */}
          {showWithdrawModal && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gray-900 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-700"
              >
                <h3 className="text-xl font-bold text-white mb-4">
                  {language === 'pt' ? 'Solicitar Saque da Carga Robô' : 'Request Robot Charge Withdrawal'}
                </h3>
                <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <p className="text-green-300 text-sm">
                    <strong>{language === 'pt' ? 'Saldo disponível (Carga Robô):' : 'Available balance (Robot Charge):'}</strong> {' '}
                    ${dashboardData.balances.prepaid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    {language === 'pt' ? 'Saques são processados apenas do saldo da Carga Robô' : 'Withdrawals are processed only from Robot Charge balance'}
                  </p>
                </div>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder={language === 'pt' ? 'Valor do saque' : 'Withdrawal amount'}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white mb-4"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowWithdrawModal(false)}
                    className="flex-1 py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
                  >
                    {language === 'pt' ? 'Cancelar' : 'Cancel'}
                  </button>
                  <button
                    onClick={handleWithdraw}
                    disabled={processing}
                    className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50"
                  >
                    {processing ? (language === 'pt' ? 'Processando...' : 'Processing...') : (language === 'pt' ? 'Solicitar' : 'Request')}
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* Modal de Cupom */}
          {showCouponModal && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gray-900 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-700"
              >
                <h3 className="text-xl font-bold text-white mb-4">
                  {language === 'pt' ? 'Usar Cupom' : 'Use Coupon'}
                </h3>
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder={language === 'pt' ? 'Código do cupom' : 'Coupon code'}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white mb-4"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCouponModal(false)}
                    className="flex-1 py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
                  >
                    {language === 'pt' ? 'Cancelar' : 'Cancel'}
                  </button>
                  <button
                    onClick={handleCoupon}
                    disabled={processing}
                    className="flex-1 py-2 px-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all disabled:opacity-50"
                  >
                    {processing ? (language === 'pt' ? 'Aplicando...' : 'Applying...') : (language === 'pt' ? 'Aplicar' : 'Apply')}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </ResponsiveContainer>
    </UserLayout>
  );
}
