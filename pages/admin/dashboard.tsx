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
  FiCalendar,
  FiSend,
  FiX,
  FiCheck,
  FiUser,
  FiClock
} from 'react-icons/fi';
import { useLanguage } from '../../hooks/useLanguage';
import AdminLayout from '../../components/AdminLayout';

// Interfaces para dados globais da administração
interface GlobalStats {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  commissionRevenue: number; // Receita via comissões de recarga
  couponRevenue: number; // Receita via venda de cupons promocionais
  totalCommissions: number;
  pendingCommissions: number;
  totalExpenses: number;
  activeCoupons: number;
  couponsSold: number;
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

interface UserRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  category: 'technical' | 'financial' | 'account' | 'trading' | 'general';
  timestamp: Date;
  assignedTo?: string;
  responseCount: number;
}

const AdminDashboard: NextPage = () => {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [userRequests, setUserRequests] = useState<UserRequest[]>([]);
  const [periodFilter, setPeriodFilter] = useState<'today' | 'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedRequest, setSelectedRequest] = useState<UserRequest | null>(null);
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false);
  const { language } = useLanguage();

  // Mock data
  const mockStats: GlobalStats = {
    totalUsers: 15847,
    activeUsers: 12394,
    totalRevenue: 2847593.45,
    monthlyRevenue: 156847.23,
    commissionRevenue: 1967432.10, // Receita por comissões de recarga
    couponRevenue: 880161.35, // Receita por venda de cupons promocionais
    totalCommissions: 89156.34,
    pendingCommissions: 45891.12,
    totalExpenses: 234567.89,
    activeCoupons: 45, // Cupons ativos no sistema
    couponsSold: 1247, // Total de cupons vendidos
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

  const mockUserRequests: UserRequest[] = [
    {
      id: 'req_1',
      userId: 'user_123',
      userName: 'João Silva',
      userEmail: 'joao.silva@email.com',
      subject: 'Problema com saque',
      message: 'Olá, estou tentando fazer um saque há 3 dias mas o valor não foi processado. Podem me ajudar?',
      priority: 'high',
      status: 'pending',
      category: 'financial',
      timestamp: new Date('2024-03-15T09:30:00'),
      responseCount: 0
    },
    {
      id: 'req_2',
      userId: 'user_456',
      userName: 'Maria Santos',
      userEmail: 'maria.santos@email.com',
      subject: 'Dúvida sobre comissões',
      message: 'Como funciona o sistema de comissões? Gostaria de entender melhor os percentuais.',
      priority: 'medium',
      status: 'in_progress',
      category: 'general',
      timestamp: new Date('2024-03-15T08:45:00'),
      assignedTo: 'Admin Carlos',
      responseCount: 1
    },
    {
      id: 'req_3',
      userId: 'user_789',
      userName: 'Pedro Costa',
      userEmail: 'pedro.costa@email.com',
      subject: 'Erro na plataforma',
      message: 'A plataforma não está carregando corretamente no meu navegador. Já tentei limpar o cache.',
      priority: 'urgent',
      status: 'pending',
      category: 'technical',
      timestamp: new Date('2024-03-15T07:20:00'),
      responseCount: 0
    },
    {
      id: 'req_4',
      userId: 'user_101',
      userName: 'Ana Oliveira',
      userEmail: 'ana.oliveira@email.com',
      subject: 'Alteração de dados',
      message: 'Preciso alterar meu email cadastrado na plataforma. Como posso fazer isso?',
      priority: 'low',
      status: 'resolved',
      category: 'account',
      timestamp: new Date('2024-03-14T16:15:00'),
      assignedTo: 'Admin Sofia',
      responseCount: 3
    },
    {
      id: 'req_5',
      userId: 'user_202',
      userName: 'Carlos Ferreira',
      userEmail: 'carlos.ferreira@email.com',
      subject: 'Estratégias de trading',
      message: 'Vocês oferecem consultoria ou orientação sobre estratégias de trading?',
      priority: 'medium',
      status: 'pending',
      category: 'trading',
      timestamp: new Date('2024-03-14T14:30:00'),
      responseCount: 0
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
        setUserRequests(mockUserRequests);
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getRequestStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-red-500/20 text-red-400';
      case 'in_progress': return 'bg-yellow-500/20 text-yellow-400';
      case 'resolved': return 'bg-green-500/20 text-green-400';
      case 'closed': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical': return <FiSettings className="w-4 h-4" />;
      case 'financial': return <FiDollarSign className="w-4 h-4" />;
      case 'account': return <FiUsers className="w-4 h-4" />;
      case 'trading': return <FiTrendingUp className="w-4 h-4" />;
      case 'general': return <FiMessageSquare className="w-4 h-4" />;
      default: return <FiMessageSquare className="w-4 h-4" />;
    }
  };

  const handleOpenResponseModal = (request: UserRequest) => {
    setSelectedRequest(request);
    setResponseText('');
    setIsResponseModalOpen(true);
  };

  const handleCloseResponseModal = () => {
    setIsResponseModalOpen(false);
    setSelectedRequest(null);
    setResponseText('');
  };

  const handleSendResponse = async () => {
    if (!selectedRequest || !responseText.trim()) return;

    setIsSubmittingResponse(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the request in the list
      setUserRequests(prev => prev.map(req => 
        req.id === selectedRequest.id 
          ? { 
              ...req, 
              status: 'in_progress' as const,
              responseCount: req.responseCount + 1,
              assignedTo: 'Admin Sistema'
            }
          : req
      ));

      handleCloseResponseModal();
    } catch (error) {
      console.error('Error sending response:', error);
    } finally {
      setIsSubmittingResponse(false);
    }
  };

  const handleCloseRequest = async (requestId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update the request status to resolved
      setUserRequests(prev => prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'resolved' as const }
          : req
      ));
    } catch (error) {
      console.error('Error closing request:', error);
    }
  };

  const handleReopenRequest = async (requestId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update the request status to pending
      setUserRequests(prev => prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'pending' as const }
          : req
      ));
    } catch (error) {
      console.error('Error reopening request:', error);
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
                className="col-span-1 md:col-span-1 lg:col-span-2 bg-gradient-to-br from-green-900/50 to-emerald-900/50 backdrop-blur-md rounded-xl p-6 border border-green-500/20"
              >
                <div className="flex items-center gap-3 mb-4">
                  <FiDollarSign className="text-green-400 text-xl" />
                  <h3 className="text-white font-semibold">Receita Total</h3>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{formatCurrency(globalStats.totalRevenue)}</div>
                <div className="text-sm text-green-400">+{formatCurrency(globalStats.monthlyRevenue)} este mês</div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="col-span-1 md:col-span-1 lg:col-span-2 bg-gradient-to-br from-blue-900/50 to-indigo-900/50 backdrop-blur-md rounded-xl p-6 border border-blue-500/20"
              >
                <div className="flex items-center gap-3 mb-4">
                  <FiActivity className="text-blue-400 text-xl" />
                  <h3 className="text-white font-semibold">Comissões</h3>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{formatCurrency(globalStats.commissionRevenue)}</div>
                <div className="text-sm text-gray-400">Receita via recarga</div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="col-span-1 md:col-span-1 lg:col-span-2 bg-gradient-to-br from-purple-900/50 to-violet-900/50 backdrop-blur-md rounded-xl p-6 border border-purple-500/20"
              >
                <div className="flex items-center gap-3 mb-4">
                  <FiGift className="text-purple-400 text-xl" />
                  <h3 className="text-white font-semibold">Cupons</h3>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{formatCurrency(globalStats.couponRevenue)}</div>
                <div className="text-sm text-gray-400">{globalStats.couponsSold} vendidos</div>
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

          {/* User Requests/Tasks */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-md rounded-xl p-6 border border-indigo-500/20"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <FiMessageSquare className="text-indigo-400" />
                {language === 'pt' ? 'Solicitações de Usuários' : 'User Requests'}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">
                  {userRequests.filter(r => r.status === 'pending').length} pendentes
                </span>
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Request Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-red-400">{userRequests.filter(r => r.status === 'pending').length}</div>
                <div className="text-xs text-gray-400">Pendentes</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-yellow-400">{userRequests.filter(r => r.status === 'in_progress').length}</div>
                <div className="text-xs text-gray-400">Em Progresso</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-red-400">{userRequests.filter(r => r.priority === 'urgent').length}</div>
                <div className="text-xs text-gray-400">Urgentes</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-green-400">{userRequests.filter(r => r.status === 'resolved').length}</div>
                <div className="text-xs text-gray-400">Resolvidas</div>
              </div>
            </div>

            {/* Recent Requests */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white mb-4">
                {language === 'pt' ? 'Solicitações Recentes' : 'Recent Requests'}
              </h4>
              {userRequests.slice(0, 5).map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-800/70 transition-all cursor-pointer border border-gray-700/50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-indigo-400">
                        {getCategoryIcon(request.category)}
                      </div>
                      <div>
                        <h5 className="text-white font-medium">{request.subject}</h5>
                        <p className="text-gray-400 text-sm">
                          {request.userName} • {request.userEmail}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(request.priority)}`}>
                        {request.priority.toUpperCase()}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getRequestStatusColor(request.status)}`}>
                        {request.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                    {request.message}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-4">
                      <span>{request.timestamp.toLocaleString('pt-BR')}</span>
                      {request.assignedTo && (
                        <span className="text-blue-400">
                          Atribuído a: {request.assignedTo}
                        </span>
                      )}
                      {request.responseCount > 0 && (
                        <span className="text-green-400">
                          {request.responseCount} resposta{request.responseCount > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleOpenResponseModal(request)}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                      >
                        <FiSend className="w-3 h-3" />
                        {language === 'pt' ? 'Responder' : 'Reply'}
                      </button>
                      {request.status === 'resolved' || request.status === 'closed' ? (
                        <button 
                          onClick={() => handleReopenRequest(request.id)}
                          className="flex items-center gap-1 px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded transition-colors"
                        >
                          <FiRefreshCw className="w-3 h-3" />
                          {language === 'pt' ? 'Reabrir' : 'Reopen'}
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleCloseRequest(request.id)}
                          className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                        >
                          <FiCheck className="w-3 h-3" />
                          {language === 'pt' ? 'Resolver' : 'Resolve'}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {userRequests.length > 5 && (
                <div className="text-center pt-4">
                  <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all">
                    {language === 'pt' ? 'Ver Todas as Solicitações' : 'View All Requests'}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Response Modal */}
        <AnimatePresence>
          {isResponseModalOpen && selectedRequest && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={handleCloseResponseModal}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-700 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {language === 'pt' ? 'Responder Solicitação' : 'Reply to Request'}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {selectedRequest.subject}
                    </p>
                  </div>
                  <button
                    onClick={handleCloseResponseModal}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <FiX className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                {/* User Info */}
                <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <FiUser className="w-5 h-5 text-blue-400" />
                    <div>
                      <div className="text-white font-medium">{selectedRequest.userName}</div>
                      <div className="text-gray-400 text-sm">{selectedRequest.userEmail}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <FiClock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400">
                        {selectedRequest.timestamp.toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <span className={`px-2 py-1 rounded-full border text-xs ${getPriorityColor(selectedRequest.priority)}`}>
                      {selectedRequest.priority.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getRequestStatusColor(selectedRequest.status)}`}>
                      {selectedRequest.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Original Message */}
                <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                  <h4 className="text-white font-medium mb-2">
                    {language === 'pt' ? 'Mensagem Original:' : 'Original Message:'}
                  </h4>
                  <p className="text-gray-300 text-sm whitespace-pre-wrap">
                    {selectedRequest.message}
                  </p>
                </div>

                {/* Response Section */}
                <div className="mb-6">
                  <label className="block text-white font-medium mb-2">
                    {language === 'pt' ? 'Sua Resposta:' : 'Your Response:'}
                  </label>
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder={language === 'pt' 
                      ? 'Digite sua resposta aqui...' 
                      : 'Type your response here...'
                    }
                    rows={6}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
                  />
                  <div className="text-xs text-gray-400 mt-1">
                    {responseText.length}/1000 caracteres
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={handleCloseResponseModal}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    {language === 'pt' ? 'Cancelar' : 'Cancel'}
                  </button>
                  <button
                    onClick={() => handleCloseRequest(selectedRequest.id)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <FiCheck className="w-4 h-4" />
                    {language === 'pt' ? 'Resolver sem Resposta' : 'Resolve without Reply'}
                  </button>
                  <button
                    onClick={handleSendResponse}
                    disabled={!responseText.trim() || isSubmittingResponse}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    {isSubmittingResponse ? (
                      <FiRefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <FiSend className="w-4 h-4" />
                    )}
                    {isSubmittingResponse 
                      ? (language === 'pt' ? 'Enviando...' : 'Sending...') 
                      : (language === 'pt' ? 'Enviar Resposta' : 'Send Reply')
                    }
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </AdminLayout>
    </>
  );
};

export default AdminDashboard;
