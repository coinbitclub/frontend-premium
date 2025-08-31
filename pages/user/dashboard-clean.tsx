import React, { useState, useEffect, useMemo } from 'react';
import { NextPage } from 'next';
import { motion } from 'framer-motion';
import { FiActivity, FiTrendingUp, FiTrendingDown, FiDollarSign, FiClock, FiTarget, FiPieChart, FiBarChart, FiSettings, FiRefreshCw, FiEye, FiUsers, FiLock } from 'react-icons/fi';
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
  };
  aiRecommendations: Array<{
    id: string;
    title: string;
    description: string;
    confidence: number;
    type: 'buy' | 'sell' | 'hold';
  }>;
  recentTrades: Array<{
    id: string;
    pair: string;
    type: 'buy' | 'sell';
    amount: number;
    price: number;
    profit: number;
    timestamp: string;
  }>;
}

export default function UserDashboard() {
  const { language } = useLanguage();
  const { isMobile, isTablet } = useResponsive();
  const { showToast } = useToast();
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
      winRate: '78.5'
    },
    aiRecommendations: [
      {
        id: '1',
        title: 'Compra BTC/USDT',
        description: 'Tendência de alta detectada baseada em análise técnica',
        confidence: 85,
        type: 'buy'
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
        timestamp: '2024-01-15T10:30:00Z'
      }
    ]
  });

  const [showAffiliateModal, setShowAffiliateModal] = useState(false);

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
    showToast(
      language === 'pt' ? 'Atualizando dados...' : 'Updating data...',
      'info'
    );
    loadDashboardData();
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Simular carregamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setLoading(false);
      
      showToast(
        language === 'pt' ? 'Dados atualizados com sucesso!' : 'Data updated successfully!',
        'success'
      );
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(language === 'pt' ? 'Erro ao carregar dados' : 'Error loading data');
      setLoading(false);
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
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400"></div>
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
                
                <button 
                  onClick={handleRefresh}
                  className={`p-3 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl border border-gray-600/50 hover:border-orange-400/50 transition-all group ${
                    isMobile ? 'ml-4' : ''
                  }`}
                  disabled={loading}
                >
                  <FiRefreshCw className={`text-orange-400 group-hover:scale-110 transition-transform ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {/* Balance Cards */}
              <div className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-4 gap-6'}`}>
                {/* Saldo Total */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30 hover:border-orange-400/50 transition-all group"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-lg">
                      <FiDollarSign className="text-orange-400 text-xl" />
                    </div>
                    <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 px-2 py-1 rounded-lg border border-green-500/30">
                      <span className="text-green-400 text-xs font-medium">+2.8%</span>
                    </div>
                  </div>
                  <div>
                    <p className={`text-gray-400 ${isMobile ? 'text-xs' : 'text-sm'} mb-1`}>
                      {language === 'pt' ? 'Saldo Total' : 'Total Balance'}
                    </p>
                    <p className={`text-white font-bold ${isMobile ? 'text-lg' : 'text-2xl'}`}>
                      ${dashboardData?.balances.total.toLocaleString()}
                    </p>
                  </div>
                </motion.div>

                {/* Saldo Binance */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
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
                      ${dashboardData?.balances.binance.toLocaleString()}
                    </p>
                  </div>
                </motion.div>

                {/* Saldo Bybit */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
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
                      ${dashboardData?.balances.bybit.toLocaleString()}
                    </p>
                  </div>
                </motion.div>

                {/* Saldo Pré-pago */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
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
                      ${dashboardData?.balances.prepaid.toLocaleString()}
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Affiliate Section */}
              {dashboardData?.user.affiliateAccess && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
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
                        <Link 
                          href="/affiliate/dashboard"
                          className={`bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-bold ${isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-2'} rounded-xl transition-all inline-flex items-center gap-2`}
                          onClick={() => {
                            trackEvent('affiliate_access_click', {
                              commission_rate: dashboardData?.user.commissionRate,
                              user_plan: dashboardData?.user.plan,
                              device_type: deviceType
                            });
                          }}
                        >
                          {language === 'pt' ? 'Acessar' : 'Access'}
                          <span className="text-lg">→</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </ResponsiveContainer>
    </UserLayout>
  );
}
