import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import { 
  FiUsers, 
  FiDollarSign, 
  FiActivity, 
  FiTrendingUp, 
  FiTrendingDown,
  FiAlertCircle,
  FiShield,
  FiServer,
  FiCreditCard,
  FiGift,
  FiSettings,
  FiRefreshCw,
  FiEye,
  FiBarChart,
  FiGlobe,
  FiMessageSquare,
  FiZap,
  FiPieChart,
  FiFilter,
  FiCalendar
} from 'react-icons/fi';
import { useLanguage } from '../../hooks/useLanguage';
import AdminLayout from '../../components/AdminLayout';

// Interfaces para dados globais da administração
interface GlobalStats {
  totalUsers: number;
  activeUsers: number;
  totalAffiliates: number;
  vipAffiliates: number;
  totalRevenue: number;
  monthlyRevenue: number;
  pendingCommissions: number;
  totalExpenses: number;
  systemUptime: number;
  activeOperations: number;
}

interface SystemStatus {
  binanceStatus: 'online' | 'offline' | 'maintenance';
  bybitStatus: 'online' | 'offline' | 'maintenance';
  databaseStatus: 'online' | 'offline' | 'slow';
  apiStatus: 'online' | 'offline' | 'degraded';
  openaiStatus: 'online' | 'offline' | 'degraded';
  stripeStatus: 'online' | 'offline' | 'maintenance';
  twilioStatus: 'online' | 'offline' | 'degraded';
  analyticsStatus: 'online' | 'offline' | 'degraded';
  tradingEnabled: boolean;
  lastUpdate: Date;
}

interface RecentActivity {
  id: string;
  type: 'user_signup' | 'payment' | 'trade' | 'error' | 'admin_action';
  message: string;
  timestamp: Date;
  severity: 'info' | 'warning' | 'error' | 'success';
}

const AdminDashboard: NextPage = () => {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [periodFilter, setPeriodFilter] = useState<'today' | 'week' | 'month' | 'quarter' | 'year'>('month');
  const { language } = useLanguage();

  // Mock data
  const mockStats: GlobalStats = {
    totalUsers: 15847,
    activeUsers: 12394,
    totalAffiliates: 2156,
    vipAffiliates: 89,
    totalRevenue: 2847593.45,
    monthlyRevenue: 156847.23,
    pendingCommissions: 45891.12,
    totalExpenses: 234567.89,
    systemUptime: 99.7,
    activeOperations: 1247
  };

  const mockSystemStatus: SystemStatus = {
    binanceStatus: 'online',
    bybitStatus: 'online',
    databaseStatus: 'online',
    apiStatus: 'online',
    openaiStatus: 'online',
    stripeStatus: 'online',
    twilioStatus: 'online',
    analyticsStatus: 'online',
    tradingEnabled: true,
    lastUpdate: new Date()
  };

  const mockActivity: RecentActivity[] = [
    {
      id: '1',
      type: 'user_signup',
      message: 'Novo usuário cadastrado: joao@example.com',
      timestamp: new Date('2024-03-15T10:30:00'),
      severity: 'success'
    },
    {
      id: '2',
      type: 'payment',
      message: 'Pagamento processado: $250.00',
      timestamp: new Date('2024-03-15T10:25:00'),
      severity: 'success'
    },
    {
      id: '3',
      type: 'trade',
      message: 'Trade executado: BTC/USD - $12,450.00',
      timestamp: new Date('2024-03-15T10:20:00'),
      severity: 'info'
    },
    {
      id: '4',
      type: 'error',
      message: 'Falha na conexão com API externa',
      timestamp: new Date('2024-03-15T10:15:00'),
      severity: 'warning'
    }
  ];

  useEffect(() => {
    setMounted(true);
    loadDashboardData();
  }, [periodFilter]);

  const loadDashboardData = async () => {
    try {
      // Simulate API call
      setTimeout(() => {
        setGlobalStats(mockStats);
        setSystemStatus(mockSystemStatus);
        setRecentActivity(mockActivity);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-400';
      case 'offline': return 'text-red-400';
      case 'maintenance': return 'text-yellow-400';
      case 'degraded': return 'text-orange-400';
      case 'slow': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500/20 border-green-500/50';
      case 'offline': return 'bg-red-500/20 border-red-500/50';
      case 'maintenance': return 'bg-yellow-500/20 border-yellow-500/50';
      case 'degraded': return 'bg-orange-500/20 border-orange-500/50';
      case 'slow': return 'bg-yellow-500/20 border-yellow-500/50';
      default: return 'bg-gray-500/20 border-gray-500/50';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'success': return 'text-green-400';
      case 'info': return 'text-blue-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  if (!mounted) return null;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center min-h-96">
          <div className="text-center">
            <FiRefreshCw className="w-8 h-8 text-red-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Carregando dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard - Admin CoinBitClub</title>
        <meta name="description" content="Dashboard administrativo do CoinBitClub" />
      </Head>

      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                {language === 'pt' ? 'Dashboard Administrativo' : 'Administrative Dashboard'}
              </h1>
              <p className="text-gray-400 mt-1">
                {language === 'pt' ? 'Visão geral do sistema e operações globais' : 'System overview and global operations'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={periodFilter}
                onChange={(e) => setPeriodFilter(e.target.value as any)}
                className="bg-gray-800/50 border border-gray-600/50 rounded-lg text-white px-3 py-2 focus:outline-none focus:border-red-500/50"
              >
                <option value="today">Hoje</option>
                <option value="week">Esta Semana</option>
                <option value="month">Este Mês</option>
                <option value="quarter">Trimestre</option>
                <option value="year">Ano</option>
              </select>
              <button
                onClick={loadDashboardData}
                className="p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg text-gray-400 hover:text-white transition-all"
              >
                <FiRefreshCw className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* Main Stats */}
          {globalStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="col-span-1 md:col-span-1 lg:col-span-2 bg-gradient-to-br from-red-900/50 to-pink-900/50 backdrop-blur-md rounded-xl p-6 border border-red-500/20"
              >
                <div className="flex items-center gap-3 mb-4">
                  <FiUsers className="text-blue-400 text-xl" />
                  <h3 className="text-white font-semibold">Usuários</h3>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{globalStats.totalUsers.toLocaleString()}</div>
                <div className="text-sm text-gray-400">{globalStats.activeUsers.toLocaleString()} ativos</div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="col-span-1 md:col-span-1 lg:col-span-2 bg-gradient-to-br from-red-900/50 to-pink-900/50 backdrop-blur-md rounded-xl p-6 border border-red-500/20"
              >
                <div className="flex items-center gap-3 mb-4">
                  <FiDollarSign className="text-green-400 text-xl" />
                  <h3 className="text-white font-semibold">Receita</h3>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{formatCurrency(globalStats.totalRevenue)}</div>
                <div className="text-sm text-green-400">+{formatCurrency(globalStats.monthlyRevenue)} este mês</div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="col-span-1 md:col-span-1 lg:col-span-2 bg-gradient-to-br from-red-900/50 to-pink-900/50 backdrop-blur-md rounded-xl p-6 border border-red-500/20"
              >
                <div className="flex items-center gap-3 mb-4">
                  <FiTrendingUp className="text-yellow-400 text-xl" />
                  <h3 className="text-white font-semibold">Afiliados</h3>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{globalStats.totalAffiliates}</div>
                <div className="text-sm text-gray-400">{globalStats.vipAffiliates} VIP</div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="col-span-1 md:col-span-1 lg:col-span-2 bg-gradient-to-br from-red-900/50 to-pink-900/50 backdrop-blur-md rounded-xl p-6 border border-red-500/20"
              >
                <div className="flex items-center gap-3 mb-4">
                  <FiActivity className="text-emerald-400 text-xl" />
                  <h3 className="text-white font-semibold">Operações</h3>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{globalStats.activeOperations}</div>
                <div className="text-sm text-gray-400">Uptime: {globalStats.systemUptime}%</div>
              </motion.div>
            </div>
          )}

          {/* System Status */}
          {systemStatus && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-red-900/50 to-pink-900/50 backdrop-blur-md rounded-xl p-6 border border-red-500/20"
            >
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <FiShield className="text-red-400" />
                Status das Integrações
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                {Object.entries(systemStatus).map(([key, value]) => {
                  if (key === 'tradingEnabled' || key === 'lastUpdate') return null;
                  const serviceName = key.replace('Status', '').toUpperCase();
                  return (
                    <div key={key} className="bg-gray-800/50 rounded-lg p-4 text-center">
                      <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${value === 'online' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                      <div className="text-sm font-medium text-white">{serviceName}</div>
                      <div className={`text-xs ${getStatusColor(value)}`}>
                        {value === 'online' ? 'Online' : value === 'offline' ? 'Offline' : 'Maintenance'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Recent Activity */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-red-900/50 to-pink-900/50 backdrop-blur-md rounded-xl p-6 border border-red-500/20"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <FiActivity className="text-red-400" />
              Atividade Recente
            </h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg"
                >
                  <div className={`w-2 h-2 rounded-full ${getSeverityColor(activity.severity).replace('text-', 'bg-')}`}></div>
                  <div className="flex-1">
                    <div className="text-white text-sm">{activity.message}</div>
                    <div className="text-gray-400 text-xs">
                      {activity.timestamp.toLocaleString('pt-BR')}
                    </div>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full ${activity.severity === 'success' ? 'bg-green-500/20 text-green-400' : activity.severity === 'error' ? 'bg-red-500/20 text-red-400' : activity.severity === 'warning' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {activity.severity.toUpperCase()}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminDashboard;
