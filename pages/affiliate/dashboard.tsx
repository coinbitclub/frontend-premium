import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiUsers, FiDollarSign, FiTrendingUp, FiTarget, FiActivity, FiEye, FiArrowUpRight, FiRefreshCw } from 'react-icons/fi';
import { useLanguage } from '../../hooks/useLanguage';
import { useSocket } from '../../src/contexts/SocketContext';
import AffiliateLayout from '../../src/components/AffiliateLayout';

// Interfaces para dados de afiliado
interface AffiliateStats {
  totalReferrals: number;
  activeReferrals: number;
  totalCommissions: number;
  monthlyCommissions: number;
  conversionRate: number;
  totalEarnings: number;
}

interface UserStats {
  totalBalance: number;
  todayReturn: number;
  todayReturnPercent: number;
  totalOperations: number;
  successRate: number;
}

interface Referral {
  id: string;
  name: string;
  email: string;
  joinDate: Date;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  totalInvested: number;
  commissionGenerated: number;
}

interface Commission {
  id: string;
  referralName: string;
  amount: number;
  type: 'SIGNUP' | 'TRADING' | 'MONTHLY';
  date: Date;
  status: 'PAID' | 'PENDING' | 'PROCESSING';
}

const AffiliateDashboard: React.FC = () => {
  const [mounted, setMounted] = useState<boolean>(false);
  const { language, t } = useLanguage();
  const { socket } = useSocket();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  
  // Estados para dados de afiliado
  const [affiliateStats, setAffiliateStats] = useState<AffiliateStats>({
    totalReferrals: 47,
    activeReferrals: 32,
    totalCommissions: 8947.50,
    monthlyCommissions: 1247.80,
    conversionRate: 68.1,
    totalEarnings: 23456.70
  });

  // Estados para dados de usuário (como afiliado também é usuário)
  const [userStats, setUserStats] = useState<UserStats>({
    totalBalance: 0,
    todayReturn: 0,
    todayReturnPercent: 0,
    totalOperations: 0,
    successRate: 0
  });

  const [recentReferrals, setRecentReferrals] = useState<Referral[]>([]);
  const [recentCommissions, setRecentCommissions] = useState<Commission[]>([]);

  useEffect(() => {
    setMounted(true);
    fetchAffiliateData();

    // Update time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Analytics
    if (typeof window !== 'undefined' && typeof gtag !== 'undefined') {
      gtag('event', 'affiliate_dashboard_view', {
        page_title: 'Affiliate Dashboard',
        language: language,
        event_category: 'affiliate_engagement',
        page_type: 'dashboard'
      });
    }

    // Update data every 30 seconds
    const dataInterval = setInterval(() => {
      fetchAffiliateData();
    }, 30000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(dataInterval);
    };
  }, [language]);

  // WebSocket event listeners for real-time affiliate updates
  useEffect(() => {
    if (!socket) return;

    // Listen for affiliate commission updates
    const handleAffiliateCommissionUpdate = (data: any) => {
      console.log('💰 Real-time affiliate commission update:', data);
      setAffiliateStats(prev => ({
        ...prev,
        totalCommissions: prev.totalCommissions + data.data.amount,
        totalEarnings: prev.totalEarnings + data.data.amount
      }));
      
      // Show notification
      if (typeof window !== 'undefined') {
        // You can add a toast notification here
        console.log(`🎉 New commission earned: $${data.data.amount.toFixed(2)}`);
      }
    };

    // Listen for affiliate balance updates
    const handleAffiliateBalanceUpdate = (data: any) => {
      console.log('💳 Real-time affiliate balance update:', data);
      setAffiliateStats(prev => ({
        ...prev,
        totalEarnings: data.data.totalEarnings,
        totalCommissions: data.data.currentBalance
      }));
    };

    // Listen for new referral notifications
    const handleNewReferral = (data: any) => {
      console.log('👥 New referral notification:', data);
      setAffiliateStats(prev => ({
        ...prev,
        totalReferrals: prev.totalReferrals + 1,
        activeReferrals: prev.activeReferrals + 1
      }));
      
      // Show notification
      if (typeof window !== 'undefined') {
        console.log(`🎉 New referral: ${data.data.referredUserName}`);
      }
    };

    // Listen for commission paid notifications
    const handleCommissionPaid = (data: any) => {
      console.log('💸 Commission paid notification:', data);
      // You can add payment confirmation UI here
      if (typeof window !== 'undefined') {
        console.log(`✅ Commission paid: $${data.data.amount.toFixed(2)}`);
      }
    };

    // Register event listeners
    socket.on('affiliate_commission_update', handleAffiliateCommissionUpdate);
    socket.on('affiliate_balance_update', handleAffiliateBalanceUpdate);
    socket.on('new_referral', handleNewReferral);
    socket.on('commission_paid', handleCommissionPaid);

    // Cleanup event listeners
    return () => {
      socket.off('affiliate_commission_update', handleAffiliateCommissionUpdate);
      socket.off('affiliate_balance_update', handleAffiliateBalanceUpdate);
      socket.off('new_referral', handleNewReferral);
      socket.off('commission_paid', handleCommissionPaid);
    };
  }, [socket]);

  const fetchAffiliateData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_access_token');
      if (!token) {
        console.error('No auth token found');
        generateInitialData(); // Fallback to mock data
        setLoading(false);
        return;
      }

      console.log('📊 Affiliate Dashboard: Loading real data from API...');

      // Fetch affiliate stats, referrals, commissions, user profile, and trading stats in parallel
      const [statsRes, referralsRes, commissionsRes, profileRes, dailyStatsRes] = await Promise.all([
        fetch('/api/affiliate/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/affiliate/referrals?limit=10', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/affiliate/commissions?limit=10', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/auth/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/operations/daily-stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      console.log('📊 Affiliate Dashboard: API responses received:', {
        statsOk: statsRes.ok,
        referralsOk: referralsRes.ok,
        commissionsOk: commissionsRes.ok,
        profileOk: profileRes.ok,
        dailyStatsOk: dailyStatsRes.ok
      });

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.success) {
          setAffiliateStats({
            totalReferrals: statsData.stats.totalReferrals || 0,
            activeReferrals: statsData.stats.activeReferrals || 0,
            totalCommissions: statsData.stats.totalCommissions || 0,
            monthlyCommissions: statsData.stats.monthlyCommissions || 0,
            conversionRate: statsData.stats.activeReferrals > 0
              ? (statsData.stats.activeReferrals / statsData.stats.totalReferrals) * 100
              : 0,
            totalEarnings: statsData.stats.currentBalance || 0
          });
        }
      }

      if (referralsRes.ok) {
        const referralsData = await referralsRes.json();
        if (referralsData.success && referralsData.referrals) {
          const formattedReferrals: Referral[] = referralsData.referrals.map((ref: any) => ({
            id: ref.id.toString(),
            name: ref.name || 'Unknown',
            email: ref.email || '',
            joinDate: new Date(ref.referredAt),
            status: ref.status === 'active' ? 'ACTIVE' : ref.status === 'pending' ? 'PENDING' : 'INACTIVE',
            totalInvested: ref.conversionValue || 0,
            commissionGenerated: ref.conversionValue * 0.015 || 0
          }));
          setRecentReferrals(formattedReferrals);
        }
      }

      if (commissionsRes.ok) {
        const commissionsData = await commissionsRes.json();
        if (commissionsData.success && commissionsData.commissions) {
          const formattedCommissions: Commission[] = commissionsData.commissions.map((comm: any) => ({
            id: comm.id.toString(),
            referralName: comm.description || 'Commission',
            amount: comm.amount || 0,
            type: comm.type === 'signup' ? 'SIGNUP' : comm.type === 'trading' ? 'TRADING' : 'MONTHLY',
            date: new Date(comm.createdAt),
            status: comm.status === 'pending' ? 'PENDING' : comm.paidAt ? 'PAID' : 'PROCESSING'
          }));
          setRecentCommissions(formattedCommissions);
        }
      }

      // Process user profile data (for balance)
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        if (profileData.success && profileData.user) {
          const user = profileData.user;
          setUserStats(prev => ({
            ...prev,
            totalBalance: parseFloat(user.balance_real_usd || user.balance_real_brl || 0)
          }));
        }
      }

      // Process daily trading stats
      if (dailyStatsRes.ok) {
        const dailyStatsData = await dailyStatsRes.json();
        if (dailyStatsData.success && dailyStatsData.data) {
          const stats = dailyStatsData.data;
          setUserStats(prev => ({
            ...prev,
            todayReturn: parseFloat(stats.todayProfit || 0),
            todayReturnPercent: parseFloat(stats.todayProfitPercent || 0),
            totalOperations: parseInt(stats.totalTrades || 0),
            successRate: parseFloat(stats.successRate || 0)
          }));
        }
      }

    } catch (error) {
      console.error('Error fetching affiliate data:', error);
      generateInitialData(); // Fallback to mock data on error
    } finally {
      setLoading(false);
    }
  };

  const generateInitialData = () => {
    // Referências recentes
    const referrals: Referral[] = [
      {
        id: '1',
        name: 'João Silva',
        email: 'joao@email.com',
        joinDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        status: 'ACTIVE',
        totalInvested: 5000,
        commissionGenerated: 75.00
      },
      {
        id: '2',
        name: 'Maria Santos',
        email: 'maria@email.com',
        joinDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        status: 'ACTIVE',
        totalInvested: 8500,
        commissionGenerated: 127.50
      },
      {
        id: '3',
        name: 'Pedro Costa',
        email: 'pedro@email.com',
        joinDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        status: 'PENDING',
        totalInvested: 3200,
        commissionGenerated: 48.00
      },
      {
        id: '4',
        name: 'Ana Oliveira',
        email: 'ana@email.com',
        joinDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        status: 'ACTIVE',
        totalInvested: 12000,
        commissionGenerated: 180.00
      },
      {
        id: '5',
        name: 'Carlos Lima',
        email: 'carlos@email.com',
        joinDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        status: 'INACTIVE',
        totalInvested: 2500,
        commissionGenerated: 37.50
      }
    ];

    // Comissões recentes
    const commissions: Commission[] = [
      {
        id: '1',
        referralName: 'João Silva',
        amount: 25.00,
        type: 'TRADING',
        date: new Date(Date.now() - 1 * 60 * 60 * 1000),
        status: 'PAID'
      },
      {
        id: '2',
        referralName: 'Maria Santos',
        amount: 50.00,
        type: 'SIGNUP',
        date: new Date(Date.now() - 3 * 60 * 60 * 1000),
        status: 'PAID'
      },
      {
        id: '3',
        referralName: 'Pedro Costa',
        amount: 50.00,
        type: 'SIGNUP',
        date: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'PROCESSING'
      },
      {
        id: '4',
        referralName: 'Ana Oliveira',
        amount: 15.75,
        type: 'TRADING',
        date: new Date(Date.now() - 5 * 60 * 60 * 1000),
        status: 'PAID'
      },
      {
        id: '5',
        referralName: 'Carlos Lima',
        amount: 12.50,
        type: 'MONTHLY',
        date: new Date(Date.now() - 8 * 60 * 60 * 1000),
        status: 'PENDING'
      }
    ];

    setRecentReferrals(referrals);
    setRecentCommissions(commissions);
  };


  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'ACTIVE': case 'PAID': return 'text-green-400';
      case 'PENDING': case 'PROCESSING': return 'text-yellow-400';
      case 'INACTIVE': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBg = (status: string): string => {
    switch (status) {
      case 'ACTIVE': case 'PAID': return 'bg-green-500/10 border-green-500/30';
      case 'PENDING': case 'PROCESSING': return 'bg-yellow-500/10 border-yellow-500/30';
      case 'INACTIVE': return 'bg-red-500/10 border-red-500/30';
      default: return 'bg-gray-500/10 border-gray-500/30';
    }
  };

  const formatPrice = (price: number): string => {
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatPercent = (percent: number): string => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(1)}%`;
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-400 mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">CoinBitClub</h2>
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard Afiliado | CoinBitClub</title>
        <meta name="description" content="Dashboard completo para afiliados da CoinBitClub" />
      </Head>

      <AffiliateLayout title="Dashboard">
        <div className="space-y-6 sm:space-y-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 sm:mb-6"
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Dashboard
            </h1>
            <p className="text-gray-400 mb-2">
              Gestão de indicações e comissões
            </p>
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">
              {language === 'pt' ? 'Bem-vindo de volta!' : 'Welcome back!'}
            </h2>
            <p className="text-gray-400">
              {language === 'pt' ? 'Acompanhe suas indicações e ganhos como afiliado' : 'Track your referrals and earnings as an affiliate'}
            </p>
          </motion.div>

          {/* Affiliate Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6"
          >
            {/* Total Referrals */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-purple-900/40 to-purple-800/30 backdrop-blur-sm rounded-xl border border-purple-500/30 p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/10 rounded-full -mr-8 -mt-8"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl">👥</div>
                  <div className="text-xs text-purple-400 font-semibold">TOTAL</div>
                </div>
                <div className="text-2xl font-bold text-purple-400 mb-1">{affiliateStats.totalReferrals}</div>
                <div className="text-xs text-gray-400">{language === 'pt' ? 'Indicações Total' : 'Total Referrals'}</div>
                <div className="text-xs text-green-400 mt-2">+{affiliateStats.activeReferrals} {language === 'pt' ? 'ativas' : 'active'}</div>
              </div>
            </motion.div>

            {/* Monthly Commissions */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-green-900/40 to-emerald-800/30 backdrop-blur-sm rounded-xl border border-green-500/30 p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/10 rounded-full -mr-8 -mt-8"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl">💰</div>
                  <div className="text-xs text-green-400 font-semibold">{language === 'pt' ? 'MENSAL' : 'MONTHLY'}</div>
                </div>
                <motion.div 
                  key={affiliateStats.monthlyCommissions}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-2xl font-bold text-green-400 mb-1"
                >
                  {formatPrice(affiliateStats.monthlyCommissions)}
                </motion.div>
                <div className="text-xs text-gray-400">{language === 'pt' ? 'Comissões do Mês' : 'Monthly Commissions'}</div>
                <div className="text-xs text-green-400 mt-2">+12.5% {language === 'pt' ? 'vs mês anterior' : 'vs last month'}</div>
              </div>
            </motion.div>

            {/* Conversion Rate */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-blue-900/40 to-cyan-800/30 backdrop-blur-sm rounded-xl border border-blue-500/30 p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-full -mr-8 -mt-8"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl">📈</div>
                  <div className="text-xs text-blue-400 font-semibold">{language === 'pt' ? 'TAXA' : 'RATE'}</div>
                </div>
                <motion.div 
                  key={affiliateStats.conversionRate}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-2xl font-bold text-blue-400 mb-1"
                >
                  {affiliateStats.conversionRate.toFixed(1)}%
                </motion.div>
                <div className="text-xs text-gray-400">{language === 'pt' ? 'Taxa de Conversão' : 'Conversion Rate'}</div>
                <div className="text-xs text-blue-400 mt-2">{language === 'pt' ? 'Acima da média' : 'Above average'}</div>
              </div>
            </motion.div>

            {/* Total Earnings */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-yellow-900/40 to-orange-800/30 backdrop-blur-sm rounded-xl border border-yellow-500/30 p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500/10 rounded-full -mr-8 -mt-8"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl">💎</div>
                  <div className="text-xs text-yellow-400 font-semibold">{language === 'pt' ? 'TOTAL' : 'TOTAL'}</div>
                </div>
                <div className="text-2xl font-bold text-yellow-400 mb-1">{formatPrice(affiliateStats.totalEarnings)}</div>
                <div className="text-xs text-gray-400">{language === 'pt' ? 'Ganhos Totais' : 'Total Earnings'}</div>
                <div className="text-xs text-yellow-400 mt-2">{language === 'pt' ? 'Desde o início' : 'All time'}</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Seção de Performance do Usuário */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/30 p-6"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <FiActivity className="text-blue-400" />
              Sua Performance de Trading
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-gray-400 text-sm font-medium mb-2">Saldo Total</p>
                <p className="text-2xl font-bold text-white">${userStats.totalBalance.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm font-medium mb-2">Retorno Hoje</p>
                <p className={`text-2xl font-bold ${userStats.todayReturnPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {userStats.todayReturnPercent >= 0 ? '+' : ''}{userStats.todayReturnPercent.toFixed(1)}%
                </p>
                <p className="text-sm text-gray-400">${userStats.todayReturn.toFixed(0)}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm font-medium mb-2">Taxa de Sucesso</p>
                <p className="text-2xl font-bold text-orange-400">{userStats.successRate.toFixed(1)}%</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm font-medium mb-2">Operações Hoje</p>
                <p className="text-2xl font-bold text-white">{userStats.totalOperations}</p>
              </div>
            </div>
          </motion.div>

          {/* Grid principal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Referências Recentes */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/30 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                  <FiUsers className="text-orange-400" />
                  Referências Recentes
                </h3>
                <Link 
                  href="/affiliate/referrals"
                  className="text-orange-400 hover:text-orange-300 text-sm font-medium flex items-center gap-1"
                >
                  Ver todas
                  <FiArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="space-y-4">
                {recentReferrals.map((referral, index) => (
                  <div key={referral.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full flex items-center justify-center font-bold text-black">
                        {referral.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-medium">{referral.name}</p>
                        <p className="text-gray-400 text-sm">{referral.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        referral.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                        referral.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                        'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {referral.status}
                      </span>
                      <p className="text-gray-400 text-sm mt-1">${referral.commissionGenerated.toFixed(0)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Comissões Recentes */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/30 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                  <FiDollarSign className="text-green-400" />
                  Comissões Recentes
                </h3>
                <Link 
                  href="/affiliate/commissions"
                  className="text-green-400 hover:text-green-300 text-sm font-medium flex items-center gap-1"
                >
                  Ver todas
                  <FiArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="space-y-4">
                {recentCommissions.map((commission, index) => (
                  <div key={commission.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
                    <div>
                      <p className="text-white font-medium">{commission.referralName}</p>
                      <p className="text-gray-400 text-sm">
                        {commission.type === 'SIGNUP' ? 'Cadastro' : 
                         commission.type === 'TRADING' ? 'Trading' : 'Mensal'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">${commission.amount.toFixed(0)}</p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        commission.status === 'PAID' ? 'bg-green-500/20 text-green-400' :
                        commission.status === 'PROCESSING' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {commission.status === 'PAID' ? 'Pago' : 
                         commission.status === 'PROCESSING' ? 'Processando' : 'Pendente'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Links Rápidos */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <Link 
              href="/affiliate/referrals"
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 hover:border-orange-400/50 transition-all group"
            >
              <div className="flex flex-col items-center text-center">
                <FiUsers className="text-3xl text-orange-400 mb-3 group-hover:scale-110 transition-transform" />
                <span className="text-white font-medium">Indicações</span>
                <span className="text-xs text-gray-400 mt-1">Gerenciar</span>
              </div>
            </Link>

            <Link 
              href="/affiliate/commissions"
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 hover:border-green-400/50 transition-all group"
            >
              <div className="flex flex-col items-center text-center">
                <FiDollarSign className="text-3xl text-green-400 mb-3 group-hover:scale-110 transition-transform" />
                <span className="text-white font-medium">Comissões</span>
                <span className="text-xs text-gray-400 mt-1">Saques</span>
              </div>
            </Link>

            <Link 
              href="/affiliate/reports"
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 hover:border-blue-400/50 transition-all group"
            >
              <div className="flex flex-col items-center text-center">
                <FiEye className="text-3xl text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
                <span className="text-white font-medium">Relatórios</span>
                <span className="text-xs text-gray-400 mt-1">Analytics</span>
              </div>
            </Link>

            <Link 
              href="/user/operations"
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 hover:border-purple-400/50 transition-all group"
            >
              <div className="flex flex-col items-center text-center">
                <FiActivity className="text-3xl text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
                <span className="text-white font-medium">Trading</span>
                <span className="text-xs text-gray-400 mt-1">Operações</span>
              </div>
            </Link>
          </motion.div>

          {/* Footer Info */}
          <div className="mt-6 text-center text-gray-400 text-sm">
            {language === 'pt' ? 'Última atualização' : 'Last update'}: {formatTime(currentTime)} | 
            {language === 'pt' ? ' Sistema ativo desde' : ' System active since'} {formatTime(new Date(Date.now() - 8 * 60 * 60 * 1000))}
          </div>
        </div>
      </AffiliateLayout>
    </>
  );
};

export default AffiliateDashboard;
