import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { motion, AnimatePresence } from 'framer-motion';

import { 
  FiUsers, 
  FiPlus, 
  FiEdit3, 
  FiTrash2, 
  FiSearch, 
  FiFilter,
  FiDownload,
  FiMail,
  FiLock,
  FiUnlock,
  FiStar,
  FiDollarSign,
  FiActivity,
  FiCalendar,
  FiRefreshCw,
  FiEye,
  FiShield,
  FiUserCheck,
  FiUserX,
  FiKey,
  FiTrendingUp,
  FiUserPlus,
  FiAward,
  FiTarget,
  FiX
} from 'react-icons/fi';
import { useLanguage } from '../../hooks/useLanguage';
import AdminLayout from '../../components/AdminLayout';

interface User {
  id: string;
  email: string;
  name: string;
  status: 'active' | 'inactive' | 'suspended';
  plan: 'free' | 'basic' | 'premium' | 'vip';
  isAffiliate: boolean;
  totalCommissions: number;
  referredUsers: number;
  lastLogin: string;
  registeredAt: string;
  apiKeysCount: number;
  tradingVolume: number;
  country: string;
  verified: boolean;
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  vipUsers: number;
  affiliateUsers: number;
  totalVolume: number;
  totalCommissions: number;
  newUsersToday: number;
  activeTraders: number;
}

const AdminUsers: NextPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all');
  const [filterPlan, setFilterPlan] = useState<'all' | 'free' | 'basic' | 'premium' | 'vip'>('all');
  const [filterType, setFilterType] = useState<'all' | 'affiliate' | 'regular'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState<string | null>(null);
  const { language } = useLanguage();

  // Mock data - em produção viria da API
  const mockUsers: User[] = [
    {
      id: '1',
      email: 'joao@example.com',
      name: 'João Silva',
      status: 'active',
      plan: 'vip',
      isAffiliate: true,
      totalCommissions: 2500.50,
      referredUsers: 15,
      lastLogin: '2025-08-16T08:30:00Z',
      registeredAt: '2025-01-15',
      apiKeysCount: 3,
      tradingVolume: 45000.00,
      country: 'BR',
      verified: true
    },
    {
      id: '2',
      email: 'maria@example.com',
      name: 'Maria Santos',
      status: 'active',
      plan: 'premium',
      isAffiliate: false,
      totalCommissions: 0,
      referredUsers: 0,
      lastLogin: '2025-08-15T14:20:00Z',
      registeredAt: '2025-03-20',
      apiKeysCount: 2,
      tradingVolume: 12000.00,
      country: 'BR',
      verified: true
    },
    {
      id: '3',
      email: 'carlos@example.com',
      name: 'Carlos Lima',
      status: 'suspended',
      plan: 'basic',
      isAffiliate: true,
      totalCommissions: 150.00,
      referredUsers: 3,
      lastLogin: '2025-08-10T10:15:00Z',
      registeredAt: '2025-07-01',
      apiKeysCount: 1,
      tradingVolume: 3500.00,
      country: 'BR',
      verified: false
    },
    {
      id: '4',
      email: 'ana@example.com',
      name: 'Ana Costa',
      status: 'inactive',
      plan: 'free',
      isAffiliate: false,
      totalCommissions: 0,
      referredUsers: 0,
      lastLogin: '2025-07-20T16:45:00Z',
      registeredAt: '2025-06-10',
      apiKeysCount: 0,
      tradingVolume: 0,
      country: 'BR',
      verified: false
    }
  ];

  const mockStats: UserStats = {
    totalUsers: 1247,
    activeUsers: 892,
    vipUsers: 45,
    affiliateUsers: 156,
    totalVolume: 2450000.00,
    totalCommissions: 125400.50,
    newUsersToday: 23,
    activeTraders: 234
  };

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setUsers(mockUsers);
      setStats(mockStats);
      setLoading(false);
    }, 1000);

    // Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'admin_users_view', {
        event_category: 'admin_navigation',
        page_title: 'Admin Users Management'
      });
    }
  }, []);

  const handleExportUsers = () => {
    try {
      // Criar dados para exportação
      const exportData = filteredUsers.map(user => ({
        ID: user.id,
        Nome: user.name,
        Email: user.email,
        Status: user.status,
        Plano: user.plan,
        'É Afiliado': user.isAffiliate ? 'Sim' : 'Não',
        'Volume Trading': user.tradingVolume,
        'Comissões Totais': user.totalCommissions,
        'Usuários Indicados': user.referredUsers,
        'API Keys': user.apiKeysCount,
        País: user.country,
        Verificado: user.verified ? 'Sim' : 'Não',
        'Último Login': new Date(user.lastLogin).toLocaleString('pt-BR'),
        'Data Registro': new Date(user.registeredAt).toLocaleDateString('pt-BR')
      }));

      // Converter para CSV
      const headers = Object.keys(exportData[0]);
      const csvContent = [
        headers.join(','),
        ...exportData.map(row => headers.map(header => `"${row[header]}"`).join(','))
      ].join('\n');

      // Download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `usuarios_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('Dados de usuários exportados com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar dados de usuários:', error);
    }
  };

  const handleUserStatusChange = (userId: string, newStatus: 'active' | 'inactive' | 'suspended') => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );

    if (typeof gtag !== 'undefined') {
      gtag('event', 'user_status_changed', {
        event_category: 'admin_action',
        user_id: userId,
        new_status: newStatus
      });
    }
  };

  const handlePlanUpgrade = (userId: string, newPlan: 'free' | 'basic' | 'premium' | 'vip') => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId ? { ...user, plan: newPlan } : user
      )
    );

    if (typeof gtag !== 'undefined') {
      gtag('event', 'user_plan_upgraded', {
        event_category: 'admin_action',
        user_id: userId,
        new_plan: newPlan
      });
    }
  };

  const handleAffiliateToggle = (userId: string) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId ? { ...user, isAffiliate: !user.isAffiliate } : user
      )
    );
  };

  const handlePasswordReset = (userId: string) => {
    // Simular reset de senha
    setShowPasswordReset(userId);
    setTimeout(() => setShowPasswordReset(null), 3000);

    if (typeof gtag !== 'undefined') {
      gtag('event', 'password_reset_sent', {
        event_category: 'admin_action',
        user_id: userId
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    const matchesPlan = filterPlan === 'all' || user.plan === filterPlan;
    const matchesType = filterType === 'all' || 
                       (filterType === 'affiliate' && user.isAffiliate) ||
                       (filterType === 'regular' && !user.isAffiliate);
    
    return matchesSearch && matchesStatus && matchesPlan && matchesType;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString('pt-BR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'inactive': return 'text-gray-400';
      case 'suspended': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 border-green-500/50';
      case 'inactive': return 'bg-gray-500/20 border-gray-500/50';
      case 'suspended': return 'bg-red-500/20 border-red-500/50';
      default: return 'bg-gray-500/20 border-gray-500/50';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'free': return 'text-gray-400';
      case 'basic': return 'text-blue-400';
      case 'premium': return 'text-pink-400';
      case 'vip': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getPlanBg = (plan: string) => {
    switch (plan) {
      case 'free': return 'bg-gray-500/20 border-gray-500/50';
      case 'basic': return 'bg-blue-500/20 border-blue-500/50';
      case 'premium': return 'bg-pink-500/20 border-pink-500/50';
      case 'vip': return 'bg-yellow-500/20 border-yellow-500/50';
      default: return 'bg-gray-500/20 border-gray-500/50';
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Gestão de Usuários - CoinBitClub Admin">
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <p className="text-gray-300">
              {language === 'pt' ? 'Carregando usuários...' : 'Loading users...'}
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Gestão de Usuários - CoinBitClub Admin">
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900/30 via-blue-900/30 to-purple-900/30 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-3">
                  <FiUsers className="text-purple-400" />
                  {language === 'pt' ? 'Gestão de Usuários' : 'User Management'}
                </h1>
                <p className="text-gray-400 mt-1">
                  {language === 'pt' ? 'Gerenciar usuários, planos e permissões' : 'Manage users, plans and permissions'}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={handleExportUsers}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-400 rounded-lg transition-all"
                >
                  <FiDownload className="w-4 h-4" />
                  <span className="text-sm">{language === 'pt' ? 'Exportar' : 'Export'}</span>
                </button>

                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 text-purple-400 rounded-lg transition-all"
                >
                  <FiPlus className="w-4 h-4" />
                  <span className="text-sm">{language === 'pt' ? 'Novo Usuário' : 'New User'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-2 bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-md rounded-xl p-6 border border-purple-500/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <FiUsers className="text-purple-400 text-xl" />
                <h3 className="text-white font-semibold">Total</h3>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{stats?.totalUsers.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Usuários registrados</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-2 bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-md rounded-xl p-6 border border-purple-500/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <FiUserCheck className="text-green-400 text-xl" />
                <h3 className="text-white font-semibold">Ativos</h3>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{stats?.activeUsers.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Online recentemente</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-2 bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-md rounded-xl p-6 border border-purple-500/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <FiAward className="text-yellow-400 text-xl" />
                <h3 className="text-white font-semibold">VIP</h3>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{stats?.vipUsers}</div>
              <div className="text-sm text-gray-400">Membros VIP</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-2 bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-md rounded-xl p-6 border border-purple-500/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <FiTarget className="text-orange-400 text-xl" />
                <h3 className="text-white font-semibold">Afiliados</h3>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{stats?.affiliateUsers}</div>
              <div className="text-sm text-gray-400">Parceiros ativos</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2 bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-md rounded-xl p-6 border border-purple-500/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <FiDollarSign className="text-green-400 text-xl" />
                <h3 className="text-white font-semibold">Volume Total</h3>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{formatCurrency(stats?.totalVolume || 0)}</div>
              <div className="text-sm text-gray-400">Em negociações</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2 bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-md rounded-xl p-6 border border-purple-500/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <FiTrendingUp className="text-blue-400 text-xl" />
                <h3 className="text-white font-semibold">Novos Hoje</h3>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{stats?.newUsersToday}</div>
              <div className="text-sm text-gray-400">Registros hoje</div>
            </motion.div>
          </div>

          {/* Filters and Search */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-md rounded-xl p-6 border border-purple-500/20"
          >
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder={language === 'pt' ? 'Buscar usuários...' : 'Search users...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <FiFilter className="text-gray-400 w-4 h-4" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="bg-gray-800/50 border border-gray-600/50 rounded-lg text-white px-3 py-2 focus:outline-none focus:border-purple-500/50"
                  >
                    <option value="all">Todos os Status</option>
                    <option value="active">Ativos</option>
                    <option value="inactive">Inativos</option>
                    <option value="suspended">Suspensos</option>
                  </select>
                </div>

                <select
                  value={filterPlan}
                  onChange={(e) => setFilterPlan(e.target.value as any)}
                  className="bg-gray-800/50 border border-gray-600/50 rounded-lg text-white px-3 py-2 focus:outline-none focus:border-purple-500/50"
                >
                  <option value="all">Todos os Planos</option>
                  <option value="free">Free</option>
                  <option value="basic">Basic</option>
                  <option value="premium">Premium</option>
                  <option value="vip">VIP</option>
                </select>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="bg-gray-800/50 border border-gray-600/50 rounded-lg text-white px-3 py-2 focus:outline-none focus:border-purple-500/50"
                >
                  <option value="all">Todos os Tipos</option>
                  <option value="affiliate">Afiliados</option>
                  <option value="regular">Regulares</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {/* Refresh data */}}
                  className="p-2 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50 rounded-lg text-gray-400 hover:text-white transition-all"
                >
                  <FiRefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Users List */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-md rounded-xl border border-purple-500/20 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-700/50">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <FiActivity className="text-purple-400" />
                Lista de Usuários ({filteredUsers.length})
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/50 border-b border-gray-700/50">
                  <tr>
                    <th className="text-left p-4 text-gray-300 font-medium">Usuário</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Status</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Plano</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Tipo</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Volume</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Último Acesso</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredUsers.map((user, index) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-b border-gray-700/30 hover:bg-gray-800/30 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold`}>
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-white font-semibold flex items-center gap-2">
                                {user.name}
                                {user.verified && <FiShield className="w-4 h-4 text-green-400" title="Verificado" />}
                              </div>
                              <div className="text-sm text-gray-400">{user.email}</div>
                              <div className="text-xs text-gray-500">
                                Registro: {formatDate(user.registeredAt)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusBg(user.status)}`}>
                            <div className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-green-400' : user.status === 'suspended' ? 'bg-red-400' : 'bg-gray-400'}`}></div>
                            <span className={getStatusColor(user.status)}>
                              {user.status === 'active' ? 'Ativo' : user.status === 'suspended' ? 'Suspenso' : 'Inativo'}
                            </span>
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getPlanBg(user.plan)}`}>
                            {user.plan === 'vip' && <FiAward className="w-3 h-3" />}
                            {user.plan === 'premium' && <FiStar className="w-3 h-3" />}
                            <span className={getPlanColor(user.plan)}>
                              {user.plan.toUpperCase()}
                            </span>
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col gap-1">
                            {user.isAffiliate && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-medium">
                                <FiTarget className="w-3 h-3" />
                                Afiliado
                              </span>
                            )}
                            <div className="text-xs text-gray-400">
                              {user.apiKeysCount} API Keys
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-white font-medium">{formatCurrency(user.tradingVolume)}</div>
                          {user.isAffiliate && (
                            <div className="text-sm text-green-400">
                              {formatCurrency(user.totalCommissions)} comissões
                            </div>
                          )}
                          {user.referredUsers > 0 && (
                            <div className="text-xs text-gray-400">
                              {user.referredUsers} indicações
                            </div>
                          )}
                        </td>
                        <td className="p-4 text-gray-300">{formatDateTime(user.lastLogin)}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedUser(user)}
                              className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-400 hover:text-blue-300 transition-all"
                              title="Ver detalhes"
                            >
                              <FiEye className="w-4 h-4" />
                            </button>
                            
                            <button
                              onClick={() => handlePasswordReset(user.id)}
                              className="p-2 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg text-yellow-400 hover:text-yellow-300 transition-all"
                              title="Reset senha"
                            >
                              {showPasswordReset === user.id ? <FiMail className="w-4 h-4" /> : <FiKey className="w-4 h-4" />}
                            </button>
                            
                            <button
                              onClick={() => handleUserStatusChange(user.id, user.status === 'active' ? 'suspended' : 'active')}
                              className={`p-2 rounded-lg transition-all ${
                                user.status === 'active' 
                                  ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400' 
                                  : 'bg-green-500/20 hover:bg-green-500/30 text-green-400'
                              }`}
                              title={user.status === 'active' ? 'Suspender' : 'Ativar'}
                            >
                              {user.status === 'active' ? <FiUserX className="w-4 h-4" /> : <FiUserCheck className="w-4 h-4" />}
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>

      {/* User Details Modal */}
      <UserDetailsModal 
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
        onPlanUpgrade={handlePlanUpgrade}
        onAffiliateToggle={handleAffiliateToggle}
        language={language}
      />

      {/* Create User Modal */}
      <CreateUserModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        language={language}
      />
    </AdminLayout>
  );
};

// Modal Components
const UserDetailsModal: React.FC<{
  user: User | null;
  onClose: () => void;
  onPlanUpgrade: (userId: string, plan: 'free' | 'basic' | 'premium' | 'vip') => void;
  onAffiliateToggle: (userId: string) => void;
  language: string;
}> = ({ user, onClose, onPlanUpgrade, onAffiliateToggle, language }) => {
  if (!user) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 w-full max-w-2xl border border-purple-500/20 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">
            Detalhes do Usuário
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-all"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* User Info */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-xl font-bold text-white flex items-center gap-2">
                  {user.name}
                  {user.verified && <FiShield className="w-5 h-5 text-green-400" />}
                </div>
                <div className="text-gray-400">{user.email}</div>
                <div className="text-sm text-gray-500">
                  Membro desde {new Date(user.registeredAt).toLocaleDateString('pt-BR')}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">Plano Atual</div>
              <select
                value={user.plan}
                onChange={(e) => onPlanUpgrade(user.id, e.target.value as any)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg text-white px-3 py-2 focus:outline-none focus:border-purple-500"
              >
                <option value="free">Free</option>
                <option value="basic">Basic</option>
                <option value="premium">Premium</option>
                <option value="vip">VIP</option>
              </select>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">Status Afiliado</div>
              <button
                onClick={() => onAffiliateToggle(user.id)}
                className={`w-full px-4 py-2 rounded-lg font-medium transition-all ${
                  user.isAffiliate 
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50' 
                    : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                }`}
              >
                {user.isAffiliate ? 'Remover Afiliação' : 'Tornar Afiliado'}
              </button>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Volume Trading</div>
              <div className="text-lg font-bold text-white">{formatCurrency(user.tradingVolume)}</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">API Keys</div>
              <div className="text-lg font-bold text-white">{user.apiKeysCount}</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Indicações</div>
              <div className="text-lg font-bold text-white">{user.referredUsers}</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Comissões</div>
              <div className="text-lg font-bold text-white">{formatCurrency(user.totalCommissions)}</div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Último Acesso</div>
              <div className="text-white">{new Date(user.lastLogin).toLocaleString('pt-BR')}</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">País</div>
              <div className="text-white">{user.country}</div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-all"
          >
            Fechar
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const CreateUserModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  language: string;
}> = ({ isOpen, onClose, language }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    plan: 'free' as 'free' | 'basic' | 'premium' | 'vip',
    isAffiliate: false,
    country: 'BR',
    verified: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui seria a lógica de criação do usuário
    console.log('Creating user:', formData);
    
    // Simular criação bem-sucedida
    alert('Usuário criado com sucesso! Um email de boas-vindas foi enviado.');
    onClose();
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      password: '',
      plan: 'free',
      isAffiliate: false,
      country: 'BR',
      verified: false
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 w-full max-w-2xl border border-purple-500/20 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-3">
            <FiUserPlus className="text-purple-400" />
            Criar Novo Usuário
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-all"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nome Completo *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50"
                placeholder="Digite o nome completo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50"
                placeholder="email@exemplo.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Senha Temporária *
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50"
                placeholder="Senha será enviada por email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                País
              </label>
              <select
                value={formData.country}
                onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
              >
                <option value="BR">Brasil</option>
                <option value="US">Estados Unidos</option>
                <option value="UK">Reino Unido</option>
                <option value="PT">Portugal</option>
                <option value="ES">Espanha</option>
                <option value="OTHER">Outro</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Plano Inicial
            </label>
            <select
              value={formData.plan}
              onChange={(e) => setFormData(prev => ({ ...prev, plan: e.target.value as any }))}
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
            >
              <option value="free">Free - Recursos básicos</option>
              <option value="basic">Basic - Ferramentas intermediárias</option>
              <option value="premium">Premium - Recursos avançados</option>
              <option value="vip">VIP - Acesso completo</option>
            </select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isAffiliate"
                checked={formData.isAffiliate}
                onChange={(e) => setFormData(prev => ({ ...prev, isAffiliate: e.target.checked }))}
                className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
              />
              <label htmlFor="isAffiliate" className="text-sm text-gray-300">
                Habilitar como afiliado
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="verified"
                checked={formData.verified}
                onChange={(e) => setFormData(prev => ({ ...prev, verified: e.target.checked }))}
                className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
              />
              <label htmlFor="verified" className="text-sm text-gray-300">
                Marcar como verificado
              </label>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <FiMail className="text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-300">
                <strong>Email Automático:</strong> O usuário receberá um email de boas-vindas com instruções de acesso e a senha temporária para fazer login.
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg transition-all font-medium"
            >
              Criar Usuário
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminUsers;
