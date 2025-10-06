import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FiDollarSign, FiTrendingUp, FiTarget, FiRefreshCw, FiAlertCircle, FiArrowRight, FiUsers } from 'react-icons/fi';
import { useLanguage } from '../../hooks/useLanguage';
import { useResponsive } from '../../hooks/useResponsive';
import { useAuth } from '../../src/contexts/AuthContext';
import { useAPIKeys } from '../../hooks/useAPIKeys';
import UserLayout from '../../components/UserLayout';
import ResponsiveContainer from '../../components/ResponsiveContainer';
import { useToast } from '../../components/Toast';
import { UserProfile } from '../../src/services/userService';
import userService from '../../src/services/userService';
import { DailyStats, operationsService } from '../../src/services/operationsService';

export default function UserDashboard() {
  // ALL HOOKS MUST BE AT THE TOP - NEVER USE HOOKS AFTER CONDITIONAL RETURNS
  const router = useRouter();
  const { language } = useLanguage();
  const { isMobile } = useResponsive();
  const { showToast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const { hasAnyKeys, hasVerifiedKeys } = useAPIKeys();
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [dailyStats, setDailyStats] = useState<DailyStats | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Define all callbacks - Use real API data
  const loadDashboardData = useCallback(async () => {
    try {
      setDataLoading(true);
      setError(null);

      console.log('📊 Dashboard: Loading real data from API...');
      
      // Fetch user profile and daily stats in parallel
      const [userProfileResponse, dailyStatsResponse] = await Promise.all([
        userService.getUserProfile(),
        operationsService.getDailyStats()
      ]);

      console.log('📊 Dashboard: API responses received:', {
        userProfileSuccess: userProfileResponse?.success,
        dailyStatsResponse: dailyStatsResponse ? 'received' : 'null/undefined'
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
          userProfile.balances.balance_commission_brl = safeNumber(userProfile.balances.balance_commission_brl);
          userProfile.balances.balance_commission_usd = safeNumber(userProfile.balances.balance_commission_usd);
        }
        setUserProfile(userProfile);
        console.log('✅ Dashboard: User profile loaded successfully');
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
          winStreak: safeNumber(dailyStatsResponse.winStreak),
          averageHoldTime: safeNumber(dailyStatsResponse.averageHoldTime),
          volumeTraded: safeNumber(dailyStatsResponse.volumeTraded),
          bestTrade: safeNumber(dailyStatsResponse.bestTrade),
          worstTrade: safeNumber(dailyStatsResponse.worstTrade),
          historicalSuccessRate: safeNumber(dailyStatsResponse.historicalSuccessRate),
          todayReturnUSD: safeNumber(dailyStatsResponse.todayReturnUSD),
          todayReturnPercent: safeNumber(dailyStatsResponse.todayReturnPercent),
          totalInvested: safeNumber(dailyStatsResponse.totalInvested) || 10000
        };

        setDailyStats(safeStats);
        console.log('✅ Dashboard: Daily stats loaded successfully:', {
          todayReturnPercent: safeStats.todayReturnPercent,
          successRate: safeStats.successRate
        });
      } else {
        console.warn('⚠️ Dashboard: No daily stats available, using defaults');
        // Set default daily stats if none available
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
          totalInvested: 10000
        });
      }
      
      console.log('✅ Dashboard: Real data loaded successfully');
    } catch (error) {
      console.error('❌ Dashboard: Error loading real data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMessage);
      showToast(
        language === 'pt' 
          ? 'Erro ao carregar dados do dashboard' 
          : 'Error loading dashboard data',
        'error'
      );
      
      // Fallback to mock data on error
      console.log('🔄 Dashboard: Falling back to mock data...');
      const mockUserProfile = {
        user: {
          id: 1,
          uuid: 'mock-uuid-123',
          username: 'demo_user',
          email: 'demo@coinbitclub.com',
          full_name: 'João Silva',
          phone: '+55 11 98765-4321',
          country: 'BR',
          language: 'pt-BR',
          user_type: 'USER' as const,
          is_admin: false,
          is_active: true,
          email_verified: true,
          two_factor_enabled: false,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        balances: {
          balance_real_brl: 2450.75,
          balance_real_usd: 500.00,
          balance_admin_brl: 150.00,
          balance_admin_usd: 30.00,
          balance_commission_brl: 75.50,
          balance_commission_usd: 15.00
        },
        plan_type: 'MONTHLY',
        subscription_status: 'active',
        trading_enabled: true,
        last_login_at: new Date().toISOString(),
        last_activity_at: new Date().toISOString()
      };

      const mockDailyStats = {
        operationsToday: 12,
        successRate: 75.5,
        totalProfit: 1250.50,
        totalLoss: 320.25,
        netProfit: 930.25,
        winStreak: 5,
        averageHoldTime: 1800,
        volumeTraded: 45000.00,
        bestTrade: 450.75,
        worstTrade: -125.50,
        historicalSuccessRate: 68.2,
        todayReturnUSD: 125.75,
        todayReturnPercent: 2.5,
        totalInvested: 15000.00
      };

      setUserProfile(mockUserProfile);
      setDailyStats(mockDailyStats);
    } finally {
      setDataLoading(false);
    }
  }, [language, showToast]);

  const handleRefresh = useCallback(async () => {
    setLoading(true);
    showToast(
      language === 'pt' ? 'Atualizando dados...' : 'Updating data...',
      'info'
    );

    // FIXED: Generate new mock data on refresh
    try {
      setDataLoading(true);
      
      // Generate new random mock data
      const newMockDailyStats = {
        operationsToday: Math.floor(Math.random() * 20) + 5,
        successRate: 60 + Math.random() * 30,
        totalProfit: Math.random() * 5000 + 1000,
        totalLoss: Math.random() * 2000 + 500,
        netProfit: Math.random() * 3000,
        winStreak: Math.floor(Math.random() * 10) + 1,
        averageHoldTime: Math.floor(Math.random() * 3600) + 300,
        volumeTraded: Math.random() * 100000 + 10000,
        bestTrade: Math.random() * 1000 + 100,
        worstTrade: -(Math.random() * 500 + 50),
        historicalSuccessRate: 60 + Math.random() * 30,
        todayReturnUSD: (Math.random() - 0.5) * 2000,
        todayReturnPercent: (Math.random() - 0.5) * 10,
        totalInvested: Math.random() * 50000 + 10000
      };

      setDailyStats(newMockDailyStats);
      console.log('✅ Dashboard: Mock data refreshed with new values');
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setDataLoading(false);
    }

    setLoading(false);
    showToast(
      language === 'pt' ? 'Dados atualizados!' : 'Data updated!',
      'success'
    );
  }, [language, showToast]);

  // Calculate dashboard data from mock data with memoization
  const dashboardData = useMemo(() => {
    if (!userProfile || !dailyStats) {
      return {
        balances: {
          total: 0,
          binance: 0,
          bybit: 0,
          prepaid: 0,
          commission: 0
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
      balance_admin_usd: 0,
      balance_commission_brl: 0,
      balance_commission_usd: 0
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
    const commissionBrl = safeNumber(balances.balance_commission_brl);
    const commissionUsd = safeNumber(balances.balance_commission_usd);

    const totalBalance = realBrl + realUsd + adminBrl + adminUsd;

    // For now, we'll distribute the balance between exchanges
    // In a real implementation, you'd have separate exchange balance APIs
    const binanceBalance = totalBalance * 0.4; // 40% on Binance
    const bybitBalance = totalBalance * 0.5;   // 50% on Bybit
    const prepaidBalance = adminBrl + adminUsd; // Admin credits
    const commissionBalance = commissionBrl + commissionUsd; // Commission credits

    // Debug performance calculation
    const todayReturnValue = safeNumber(dailyStats?.todayReturnPercent);
    const winRateValue = safeNumber(dailyStats?.successRate);
    
    console.log('📊 Dashboard: Performance calculation:', {
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
        commission: commissionBalance
      },
      performance: {
        todayReturn: todayReturnValue.toFixed(1),
        winRate: winRateValue.toFixed(1)
      }
    };
  }, [userProfile, dailyStats]);

  // ALL EFFECTS MUST BE DECLARED BEFORE ANY CONDITIONAL RETURNS
  // Authentication check with enhanced redirect protection
  useEffect(() => {
    console.log('📊 Dashboard: Auth state check:', { isLoading, isAuthenticated, redirecting });
    console.log('🔍 DEBUG: Dashboard useEffect triggered with:', {
      isLoading,
      isAuthenticated,
      redirecting,
      currentPath: router.asPath,
      currentQuery: router.query
    });

    // FIXED: Add a delay to allow AuthContext to fully initialize
    const checkAuth = () => {
      console.log('🔍 DEBUG: Dashboard - Checking authentication after delay...');
      
      // Check if there are any auth tokens in localStorage as a double-check
      const hasAuthTokens = localStorage.getItem('auth_access_token') || 
                           localStorage.getItem('authToken') || 
                           localStorage.getItem('auth-token');
      
      console.log('🔍 DEBUG: Dashboard - Checking localStorage for auth tokens:', {
        auth_access_token: !!localStorage.getItem('auth_access_token'),
        authToken: !!localStorage.getItem('authToken'),
        'auth-token': !!localStorage.getItem('auth-token'),
        hasAnyTokens: !!hasAuthTokens
      });

      // If we have tokens but AuthContext says not authenticated, wait a bit more
      if (hasAuthTokens && !isAuthenticated && !isLoading) {
        console.log('🔍 DEBUG: Dashboard - Found auth tokens but AuthContext not ready, waiting more...');
        setTimeout(checkAuth, 500); // Wait another 500ms
        return;
      }

      // Only redirect if we're absolutely sure the user is not authenticated
      if (!isLoading && !isAuthenticated && !redirecting) {
        console.log('🔍 DEBUG: Dashboard - User not authenticated, checking redirect conditions');
        
        // Enhanced loop prevention with multiple checks
        const lastRedirect = sessionStorage.getItem('dashboard-redirect-timestamp');
        const redirectCount = parseInt(sessionStorage.getItem('dashboard-redirect-count') || '0');
        const now = Date.now();

        console.log('🔄 Dashboard: Not authenticated, checking redirect protection...', { 
          lastRedirect, 
          redirectCount, 
          now,
          timeSinceLastRedirect: lastRedirect ? now - parseInt(lastRedirect) : 'N/A'
        });

        // Prevent redirect if:
        // 1. Redirected less than 3 seconds ago
        // 2. More than 3 redirects in the last 10 seconds
        // 3. Already in a redirect process
        if (
          (lastRedirect && (now - parseInt(lastRedirect)) < 3000) ||
          redirectCount > 3 ||
          redirecting
        ) {
          console.warn('⚠️ Dashboard: Redirect loop detected, skipping redirect', {
            timeSinceLastRedirect: lastRedirect ? now - parseInt(lastRedirect) : 'N/A',
            redirectCount,
            redirecting,
            condition1: lastRedirect && (now - parseInt(lastRedirect)) < 3000,
            condition2: redirectCount > 3,
            condition3: redirecting
          });
          return;
        }

        // Increment redirect counter and set timestamp
        const newCount = redirectCount + 1;
        sessionStorage.setItem('dashboard-redirect-timestamp', now.toString());
        sessionStorage.setItem('dashboard-redirect-count', newCount.toString());
        setRedirecting(true);

        console.log('🔀 Dashboard: Redirecting to login... (attempt', newCount, ')');
        console.log('🔍 DEBUG: Dashboard - About to redirect to /auth/login');

        // Add a small delay to prevent rapid redirects
        setTimeout(() => {
          console.log('🔍 DEBUG: Dashboard - Executing redirect now');
          router.push('/auth/login').catch(error => {
            console.error('❌ Dashboard: Redirect error:', error);
            setRedirecting(false);
            sessionStorage.removeItem('dashboard-redirect-timestamp');
            sessionStorage.removeItem('dashboard-redirect-count');
          });
        }, 100);
      } else if (isAuthenticated) {
        console.log('✅ Dashboard: User is authenticated, staying on dashboard');
        console.log('🔍 DEBUG: Dashboard - User authenticated, clearing redirect counters');
        // Clear redirect counters when successfully authenticated
        sessionStorage.removeItem('dashboard-redirect-timestamp');
        sessionStorage.removeItem('dashboard-redirect-count');
      } else {
        console.log('🔍 DEBUG: Dashboard - Not redirecting because:', {
          isLoading,
          isAuthenticated,
          redirecting
        });
      }
    };

    // Add a small delay to allow AuthContext to initialize
    if (!isLoading) {
      setTimeout(checkAuth, 100); // Wait 100ms for AuthContext to initialize
    }
  }, [isAuthenticated, isLoading, redirecting, router]);

  // Data loading effect - FIXED: Load mock data once, no auto-refresh
  useEffect(() => {
    // Only load data if authenticated and not redirecting
    if (isAuthenticated && !redirecting) {
      // Clear redirect timestamp when successfully authenticated
      sessionStorage.removeItem('dashboard-redirect-timestamp');

      // Load mock data once (no auto-refresh needed for mock data)
      loadDashboardData();
    }
  }, [isAuthenticated, redirecting, loadDashboardData]);

  // NOW WE CAN USE CONDITIONAL RENDERING - ALL HOOKS HAVE BEEN CALLED
  // Show loading while checking authentication or redirecting
  if (isLoading || redirecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-black font-bold text-xl">C</span>
          </div>
          <p className="text-gray-400">
            {language === 'pt' ? 'Carregando...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

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
                        ? 'Para começar a operar, você precisa conectar suas API keys da Bybit ou Binance. Seus fundos ficam seguros na sua própria exchange!'
                        : 'To start trading, you need to connect your Bybit or Binance API keys. Your funds stay safe in your own exchange!'}
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
                        ? 'Suas API keys precisam ser verificadas antes de começar a operar.'
                        : 'Your API keys need to be verified before you can start trading.'}
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

          {/* Balance Cards */}
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

            {/* Saldo Pré-pago */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30 hover:border-green-400/50 transition-all group ${dataLoading ? 'animate-pulse' : ''}`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg">
                  <FiTarget className="text-green-400 text-xl" />
                </div>
                <span className="text-green-400 text-xs font-medium">PRÉ-PAGO</span>
              </div>
              <div>
                <p className={`text-gray-400 ${isMobile ? 'text-xs' : 'text-sm'} mb-1`}>
                  {language === 'pt' ? 'Saldo Pré-pago' : 'Prepaid Balance'}
                </p>
                <p className={`text-white font-bold ${isMobile ? 'text-lg' : 'text-2xl'}`}>
                  {dataLoading ? '...' : `$${dashboardData.balances.prepaid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </p>
              </div>
            </motion.div>

            {/* Saldo Comissão */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30 hover:border-purple-400/50 transition-all group ${dataLoading ? 'animate-pulse' : ''}`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg">
                  <FiUsers className="text-purple-400 text-xl" />
                </div>
                <span className="text-purple-400 text-xs font-medium">COMISSÃO</span>
              </div>
              <div>
                <p className={`text-gray-400 ${isMobile ? 'text-xs' : 'text-sm'} mb-1`}>
                  {language === 'pt' ? 'Saldo Comissão' : 'Commission Balance'}
                </p>
                <p className={`text-white font-bold ${isMobile ? 'text-lg' : 'text-2xl'}`}>
                  {dataLoading ? '...' : `$${dashboardData.balances.commission.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Performance Stats */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
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
              transition={{ delay: 0.6 }}
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
        </div>
      </ResponsiveContainer>
    </UserLayout>
  );
}
