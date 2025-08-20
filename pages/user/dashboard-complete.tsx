import React, { useState, useEffect, useMemo } from 'react';
import { NextPage } from 'next';
import { motion } from 'framer-motion';
import { FiActivity, FiTrendingUp, FiTrendingDown, FiDollarSign, FiClock, FiTarget, FiPieChart, FiBarChart, FiSettings, FiRefreshCw, FiEye, FiUsers, FiLock, FiBell, FiAward, FiCpu, FiGlobe } from 'react-icons/fi';
import { useLanguage } from '../../hooks/useLanguage';
import { useResponsive } from '../../hooks/useResponsive';
import { useEnterprise } from '../../hooks/useEnterprise';
import UserLayout from '../../components/UserLayout';
import ResponsiveContainer from '../../components/ResponsiveContainer';
import { useToast } from '../../components/Toast';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface DashboardData {
  user: {
    name: string;
    plan: string;
    commissionRate: number;
    affiliateAccess: boolean;
  };
  balances: {
    total: number;
    binance: number;
    bybit: number;
    prepaid: number;
  };
  performance: {
    todayReturn: string;
    totalReturn: string;
    winRate: string;
    monthlyGain: string;
    totalTrades: number;
    activeBots: number;
  };
  aiRecommendations: Array<{
    id: string;
    title: string;
    description: string;
    confidence: number;
    type: 'buy' | 'sell' | 'hold';
    pair: string;
    expectedGain: string;
  }>;
  recentTrades: Array<{
    id: string;
    pair: string;
    type: 'buy' | 'sell';
    amount: number;
    price: number;
    profit: number;
    status: 'completed' | 'pending' | 'cancelled';
    timestamp: string;
  }>;
  notifications: Array<{
    id: string;
    title: string;
    message: string;
    type: 'success' | 'warning' | 'info';
    timestamp: string;
    read: boolean;
  }>;
}

const UserDashboard: NextPage = () => {
  const { language } = useLanguage();
  const { isMobile, isTablet } = useResponsive();
  const { addToast } = useToast() as any;
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const enterprise = useEnterprise();

  const deviceType = useMemo(() => {
    return isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';
  }, [isMobile, isTablet]);

  const router = useRouter();

  // Cache key for localStorage
  const CACHE_KEY = 'dashboard_data_cache';
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  const [dashboardData, setDashboardData] = useState<DashboardData>({
    user: {
      name: 'Usuario Premium',
      plan: 'Premium',
      commissionRate: 5,
      affiliateAccess: true
    },
    balances: {
      total: 22171.07,
      binance: 8540.32,
      bybit: 12380.75,
      prepaid: 1250
    },
    performance: {
      todayReturn: '2.8',
      totalReturn: '45.6',
      winRate: '78.5',
      monthlyGain: '12.4',
      totalTrades: 342,
      activeBots: 8
    },
    aiRecommendations: [
      {
        id: '1',
        title: language === 'pt' ? 'Compra BTC/USDT' : 'Buy BTC/USDT',
        description: language === 'pt' ? 'Tendência de alta detectada baseada em análise técnica' : 'Upward trend detected based on technical analysis',
        confidence: 85,
        type: 'buy',
        pair: 'BTC/USDT',
        expectedGain: '3.2%'
      },
      {
        id: '2',
        title: language === 'pt' ? 'Venda ETH/USDT' : 'Sell ETH/USDT',
        description: language === 'pt' ? 'Sinais de resistência identificados' : 'Resistance signals identified',
        confidence: 72,
        type: 'sell',
        pair: 'ETH/USDT',
        expectedGain: '1.8%'
      },
      {
        id: '3',
        title: language === 'pt' ? 'Manter ADA/USDT' : 'Hold ADA/USDT',
        description: language === 'pt' ? 'Consolidação em andamento' : 'Consolidation in progress',
        confidence: 65,
        type: 'hold',
        pair: 'ADA/USDT',
        expectedGain: '2.1%'
      }
    ],
    recentTrades: [
      {
        id: '1',
        pair: 'BTC/USDT',
        type: 'buy',
        amount: 0.1,
        price: 43500,
        profit: 125.50,
        status: 'completed',
        timestamp: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        pair: 'ETH/USDT',
        type: 'sell',
        amount: 2.5,
        price: 2680,
        profit: -45.30,
        status: 'completed',
        timestamp: '2024-01-15T09:15:00Z'
      },
      {
        id: '3',
        pair: 'ADA/USDT',
        type: 'buy',
        amount: 1000,
        price: 0.52,
        profit: 78.90,
        status: 'pending',
        timestamp: '2024-01-15T08:45:00Z'
      }
    ],
    notifications: [
      {
        id: '1',
        title: language === 'pt' ? 'Operação Concluída' : 'Operation Completed',
        message: language === 'pt' ? 'BTC/USDT executada com sucesso' : 'BTC/USDT executed successfully',
        type: 'success',
        timestamp: '2024-01-15T10:30:00Z',
        read: false
      },
      {
        id: '2',
        title: language === 'pt' ? 'Novo Sinal IA' : 'New AI Signal',
        message: language === 'pt' ? 'Oportunidade detectada em ETH/USDT' : 'Opportunity detected in ETH/USDT',
        type: 'info',
        timestamp: '2024-01-15T09:20:00Z',
        read: true
      }
    ]
  });

  const [showAffiliateModal, setShowAffiliateModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const trackEvent = (event: string, data: any) => {
    try {
      if (enterprise) {
        enterprise.trackEvent(event, data);
      }
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadDashboardData();
  }, []);

  const handleRefresh = () => {
    addToast(
      language === 'pt' ? 'Atualizando dados...' : 'Updating data...',
      'info'
    );
    loadDashboardData();
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Simular carregamento realista
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simular dados atualizados
      setDashboardData(prev => ({
        ...prev,
        balances: {
          ...prev.balances,
          total: prev.balances.total + (Math.random() - 0.5) * 100
        },
        performance: {
          ...prev.performance,
          todayReturn: (parseFloat(prev.performance.todayReturn) + (Math.random() - 0.5) * 0.5).toFixed(1)
        }
      }));
      
      setLoading(false);
      
      addToast(
        language === 'pt' ? 'Dados atualizados com sucesso!' : 'Data updated successfully!',
        'success'
      );
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(language === 'pt' ? 'Erro ao carregar dados' : 'Error loading data');
      setLoading(false);
    }
  };

  const handleAffiliateAccess = () => {
    if (dashboardData?.user.affiliateAccess) {
      router.push('/affiliate/dashboard');
    } else {
      setShowAffiliateModal(true);
    }
  };

  // Loading state
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    );
  }

  return (
    <UserLayout 
      title={`${language === 'pt' ? 'Dashboard' : 'Dashboard'} | CoinBitClub`}
      description={language === 'pt' ? 'Dashboard do usuário - Sistema de Trading com IA' : 'User Dashboard - AI Trading System'}
    >
      <ResponsiveContainer mobileOptimized={true} padding={isMobile ? 'sm' : 'md'}>
        <div className={`${isMobile ? 'pt-2 space-y-6' : 'pt-4 space-y-8'}`}>
          {loading ? (
            <div className={`flex items-center justify-center ${isMobile ? 'h-32' : 'h-64'}`}>
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400"></div>
                <p className="text-gray-400">
                  {language === 'pt' ? 'Carregando dados...' : 'Loading data...'}
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Header Actions */}
              <div className={`flex items-center justify-between ${isMobile ? 'mb-6' : 'mb-8'}`}>
                <div className={isMobile ? 'flex-1' : ''}>
                  <h1 className={`font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent ${
                    isMobile ? 'text-2xl mb-1' : 'text-3xl mb-2'
                  }`}>
                    {language === 'pt' ? 'Dashboard' : 'Dashboard'}
                  </h1>
                  <p className={`text-gray-400 ${isMobile ? 'text-sm' : ''}`}>
                    {language === 'pt' 
                      ? `Performance de hoje: +${dashboardData?.performance.todayReturn}%`
                      : `Today's performance: +${dashboardData?.performance.todayReturn}%`
                    }
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={handleRefresh}
                    className={`p-3 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl border border-gray-600/50 hover:border-orange-400/50 transition-all group ${
                      isMobile ? '' : 'mr-2'
                    }`}
                    disabled={loading}
                  >
                    <FiRefreshCw className={`text-orange-400 group-hover:scale-110 transition-transform ${loading ? 'animate-spin' : ''}`} />
                  </button>

                  {/* Quick Actions */}
                  {!isMobile && (
                    <div className="flex space-x-2">
                      <Link 
                        href="/user/operations"
                        className="p-3 bg-gradient-to-r from-blue-800/50 to-blue-700/50 rounded-xl border border-blue-600/50 hover:border-blue-400/50 transition-all group"
                      >
                        <FiBarChart className="text-blue-400 group-hover:scale-110 transition-transform" />
                      </Link>
                      <Link 
                        href="/user/settings"
                        className="p-3 bg-gradient-to-r from-purple-800/50 to-purple-700/50 rounded-xl border border-purple-600/50 hover:border-purple-400/50 transition-all group"
                      >
                        <FiSettings className="text-purple-400 group-hover:scale-110 transition-transform" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Stats Overview */}
              <div className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-4 gap-6'}`}>
                {/* Performance Overview */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-sm rounded-xl p-4 border border-green-700/30"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <FiTrendingUp className="text-green-400 text-xl" />
                    <span className="text-green-400 text-xs font-medium">
                      {language === 'pt' ? 'GANHO MENSAL' : 'MONTHLY GAIN'}
                    </span>
                  </div>
                  <div>
                    <p className={`text-green-400 font-bold ${isMobile ? 'text-lg' : 'text-2xl'} mb-1`}>
                      +{dashboardData?.performance.monthlyGain}%
                    </p>
                    <p className={`text-gray-400 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                      {language === 'pt' ? 'Este mês' : 'This month'}
                    </p>
                  </div>
                </motion.div>

                {/* Win Rate */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 backdrop-blur-sm rounded-xl p-4 border border-blue-700/30"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <FiTarget className="text-blue-400 text-xl" />
                    <span className="text-blue-400 text-xs font-medium">
                      {language === 'pt' ? 'TAXA SUCESSO' : 'WIN RATE'}
                    </span>
                  </div>
                  <div>
                    <p className={`text-blue-400 font-bold ${isMobile ? 'text-lg' : 'text-2xl'} mb-1`}>
                      {dashboardData?.performance.winRate}%
                    </p>
                    <p className={`text-gray-400 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                      {dashboardData?.performance.totalTrades} {language === 'pt' ? 'operações' : 'trades'}
                    </p>
                  </div>
                </motion.div>

                {/* Active Bots */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-xl p-4 border border-purple-700/30"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <FiCpu className="text-purple-400 text-xl" />
                    <span className="text-purple-400 text-xs font-medium">
                      {language === 'pt' ? 'BOTS ATIVOS' : 'ACTIVE BOTS'}
                    </span>
                  </div>
                  <div>
                    <p className={`text-purple-400 font-bold ${isMobile ? 'text-lg' : 'text-2xl'} mb-1`}>
                      {dashboardData?.performance.activeBots}
                    </p>
                    <p className={`text-gray-400 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                      {language === 'pt' ? 'Funcionando' : 'Running'}
                    </p>
                  </div>
                </motion.div>

                {/* Notifications */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-br from-orange-900/30 to-red-900/30 backdrop-blur-sm rounded-xl p-4 border border-orange-700/30"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <FiBell className="text-orange-400 text-xl" />
                    <span className="text-orange-400 text-xs font-medium">
                      {language === 'pt' ? 'ALERTAS' : 'ALERTS'}
                    </span>
                  </div>
                  <div>
                    <p className={`text-orange-400 font-bold ${isMobile ? 'text-lg' : 'text-2xl'} mb-1`}>
                      {dashboardData?.notifications.filter(n => !n.read).length}
                    </p>
                    <p className={`text-gray-400 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                      {language === 'pt' ? 'Não lidas' : 'Unread'}
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Balance Cards */}
              <div className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-4 gap-6'}`}>
                {/* Saldo Total */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30 hover:border-orange-400/50 transition-all group"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-lg">
                      <FiDollarSign className="text-orange-400 text-xl" />
                    </div>
                    <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 px-2 py-1 rounded-lg border border-green-500/30">
                      <span className="text-green-400 text-xs font-medium">+{dashboardData?.performance.todayReturn}%</span>
                    </div>
                  </div>
                  <div>
                    <p className={`text-gray-400 ${isMobile ? 'text-xs' : 'text-sm'} mb-1`}>
                      {language === 'pt' ? 'Saldo Total' : 'Total Balance'}
                    </p>
                    <p className={`text-white font-bold ${isMobile ? 'text-lg' : 'text-2xl'}`}>
                      ${dashboardData?.balances.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </motion.div>

                {/* Saldo Binance */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30 hover:border-yellow-400/50 transition-all group"
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
                      ${dashboardData?.balances.binance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </motion.div>

                {/* Saldo Bybit */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30 hover:border-blue-400/50 transition-all group"
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
                      ${dashboardData?.balances.bybit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </motion.div>

                {/* Saldo Pré-pago */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30 hover:border-green-400/50 transition-all group"
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
                      ${dashboardData?.balances.prepaid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Affiliate Section */}
              {dashboardData?.user.affiliateAccess && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="bg-gradient-to-br from-orange-900/30 via-yellow-900/20 to-red-900/30 backdrop-blur-sm rounded-2xl border border-orange-500/30 overflow-hidden"
                >
                  <div className={`${isMobile ? 'p-4' : 'p-6'} relative`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-yellow-500/10"></div>
                    
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`${isMobile ? 'p-3' : 'p-4'} bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-xl`}>
                          <FiUsers className={`text-orange-400 ${isMobile ? 'text-2xl' : 'text-3xl'}`} />
                        </div>
                        
                        <div>
                          <h3 className={`font-bold text-white ${isMobile ? 'text-lg' : 'text-xl'} mb-1`}>
                            {language === 'pt' ? 'Área de Afiliados' : 'Affiliate Area'}
                          </h3>
                          <p className={`text-orange-200 ${isMobile ? 'text-sm' : ''}`}>
                            {language === 'pt' ? 'Taxa de Comissão' : 'Commission Rate'}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className={`text-orange-400 font-bold ${isMobile ? 'text-xl' : 'text-2xl'} mb-1`}>
                          {dashboardData?.user.commissionRate}%
                        </div>
                        <button 
                          onClick={handleAffiliateAccess}
                          className={`bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-bold ${isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-2'} rounded-xl transition-all inline-flex items-center gap-2`}
                        >
                          {language === 'pt' ? 'Acessar' : 'Access'}
                          <span className="text-lg">→</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* AI Recommendations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/30"
              >
                <div className={`${isMobile ? 'p-4' : 'p-6'}`}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg">
                        <FiCpu className="text-purple-400 text-xl" />
                      </div>
                      <h3 className="text-xl font-bold text-white">
                        {language === 'pt' ? 'Recomendações IA' : 'AI Recommendations'}
                      </h3>
                    </div>
                    <span className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-3 py-1 rounded-full text-purple-400 text-xs font-medium border border-purple-500/30">
                      {language === 'pt' ? 'Atualizado agora' : 'Updated now'}
                    </span>
                  </div>

                  <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-3 gap-4'}`}>
                    {dashboardData?.aiRecommendations.map((rec, index) => (
                      <div
                        key={rec.id}
                        className={`bg-gradient-to-br from-gray-700/30 to-gray-800/30 rounded-xl p-4 border border-gray-600/30 hover:border-purple-400/50 transition-all group cursor-pointer`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className={`flex items-center space-x-2`}>
                            <div className={`w-3 h-3 rounded-full ${
                              rec.type === 'buy' ? 'bg-green-400' : 
                              rec.type === 'sell' ? 'bg-red-400' : 'bg-yellow-400'
                            }`}></div>
                            <span className={`text-xs font-medium ${
                              rec.type === 'buy' ? 'text-green-400' : 
                              rec.type === 'sell' ? 'text-red-400' : 'text-yellow-400'
                            }`}>
                              {rec.type.toUpperCase()}
                            </span>
                          </div>
                          <span className="text-xs text-gray-400">{rec.confidence}%</span>
                        </div>
                        
                        <h4 className="text-white font-semibold mb-2">{rec.title}</h4>
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{rec.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300 text-sm font-medium">{rec.pair}</span>
                          <span className="text-green-400 text-sm font-bold">+{rec.expectedGain}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Recent Trades */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/30"
              >
                <div className={`${isMobile ? 'p-4' : 'p-6'}`}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-lg">
                        <FiActivity className="text-blue-400 text-xl" />
                      </div>
                      <h3 className="text-xl font-bold text-white">
                        {language === 'pt' ? 'Operações Recentes' : 'Recent Trades'}
                      </h3>
                    </div>
                    <Link 
                      href="/user/operations"
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                    >
                      {language === 'pt' ? 'Ver todas' : 'View all'}
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {dashboardData?.recentTrades.slice(0, isMobile ? 3 : 5).map((trade) => (
                      <div
                        key={trade.id}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-700/30 to-gray-800/30 rounded-xl border border-gray-600/30 hover:border-blue-400/50 transition-all"
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-2 h-2 rounded-full ${
                            trade.status === 'completed' ? 'bg-green-400' :
                            trade.status === 'pending' ? 'bg-yellow-400' : 'bg-red-400'
                          }`}></div>
                          
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-white font-medium">{trade.pair}</span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                trade.type === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                              }`}>
                                {trade.type.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-gray-400 text-sm">
                              {trade.amount} @ ${trade.price.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className={`font-bold ${trade.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {trade.profit >= 0 ? '+' : ''}${trade.profit.toFixed(2)}
                          </div>
                          <p className="text-gray-400 text-xs">
                            {new Date(trade.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Quick Actions Mobile */}
              {isMobile && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="grid grid-cols-2 gap-4"
                >
                  <Link 
                    href="/user/operations"
                    className="bg-gradient-to-br from-blue-800/50 to-blue-900/50 backdrop-blur-sm rounded-xl p-6 border border-blue-700/30 hover:border-blue-400/50 transition-all group"
                  >
                    <div className="flex flex-col items-center text-center">
                      <FiBarChart className="text-3xl text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
                      <span className="text-white font-medium">
                        {language === 'pt' ? 'Operações' : 'Operations'}
                      </span>
                      <span className="text-xs text-gray-400 mt-1">
                        {language === 'pt' ? 'Histórico' : 'History'}
                      </span>
                    </div>
                  </Link>

                  <Link 
                    href="/user/settings"
                    className="bg-gradient-to-br from-purple-800/50 to-purple-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-700/30 hover:border-purple-400/50 transition-all group"
                  >
                    <div className="flex flex-col items-center text-center">
                      <FiSettings className="text-3xl text-purple-400 mb-3 group-hover:scale-110 group-hover:rotate-90 transition-all" />
                      <span className="text-white font-medium">
                        {language === 'pt' ? 'Configurações' : 'Settings'}
                      </span>
                      <span className="text-xs text-gray-400 mt-1">
                        {language === 'pt' ? 'Definições' : 'Preferences'}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              )}

              {/* Modal de Acesso Negado aos Afiliados */}
              {showAffiliateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-8 max-w-md w-full"
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiLock className="text-3xl text-yellow-400" />
                      </div>
                      
                      <h3 className="text-2xl font-bold text-white mb-4">
                        {language === 'pt' ? 'Acesso Restrito' : 'Restricted Access'}
                      </h3>
                      
                      <p className="text-gray-300 mb-6 leading-relaxed">
                        {language === 'pt' 
                          ? 'Para acessar a área de afiliados, você precisa fazer a adesão ao Plano de Afiliados. Entre em contato com nossa equipe para mais informações sobre como participar do programa.'
                          : 'To access the affiliate area, you need to join the Affiliate Plan. Contact our team for more information about how to participate in the program.'
                        }
                      </p>
                      
                      <div className="flex space-x-3">
                        <button
                          onClick={() => setShowAffiliateModal(false)}
                          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-xl transition-all"
                        >
                          {language === 'pt' ? 'Fechar' : 'Close'}
                        </button>
                        <button
                          onClick={() => {
                            setShowAffiliateModal(false);
                            router.push('/contact');
                          }}
                          className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-bold py-3 px-6 rounded-xl transition-all"
                        >
                          {language === 'pt' ? 'Contatar' : 'Contact'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </>
          )}
        </div>
      </ResponsiveContainer>
    </UserLayout>
  );
};

export default UserDashboard;
