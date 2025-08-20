'use client';

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
  FiAward,
  FiTarget,
  FiX
} from 'react-icons/fi';
import { useLanguage } from '../../../../hooks/useLanguage';
import AdminLayout from '../../../components/AdminLayout';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'affiliate';
  status: 'active' | 'trial_active' | 'inactive' | 'suspended';
  isAffiliate: boolean;
  createdAt: string;
  lastLoginAt: string;
  balance: number;
  profit: number;
  locked: number;
  planName: string;
  totalOperations: number;
  totalProfitUsd: number;
  avatar?: string;
  country?: string;
  phone?: string;
  isVip?: boolean;
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  trialUsers: number;
  affiliates: number;
  newUsers30d: number;
  totalBalance: number;
  totalProfit: number;
  suspendedUsers: number;
}

const AdminUsers: NextPage = () => {
  const [mounted, setMounted] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'trial_active' | 'inactive' | 'suspended'>('all');
  const [filterRole, setFilterRole] = useState<'all' | 'user' | 'admin' | 'affiliate'>('all');
  const { language } = useLanguage();

  // Mock data - replace with real API calls
  const mockUsers: User[] = [
    {
      id: '1',
      name: 'João Silva',
      email: 'joao@example.com',
      role: 'user',
      status: 'active',
      isAffiliate: false,
      createdAt: '2024-01-15',
      lastLoginAt: '2024-03-15',
      balance: 1500.00,
      profit: 250.00,
      locked: 0,
      planName: 'Premium',
      totalOperations: 45,
      totalProfitUsd: 250.00,
      country: 'Brasil',
      isVip: false
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria@example.com',
      role: 'affiliate',
      status: 'active',
      isAffiliate: true,
      createdAt: '2024-02-01',
      lastLoginAt: '2024-03-14',
      balance: 2800.00,
      profit: 1200.00,
      locked: 500.00,
      planName: 'VIP',
      totalOperations: 120,
      totalProfitUsd: 1200.00,
      country: 'Brasil',
      isVip: true
    },
    {
      id: '3',
      name: 'Carlos Oliveira',
      email: 'carlos@example.com',
      role: 'user',
      status: 'trial_active',
      isAffiliate: false,
      createdAt: '2024-03-01',
      lastLoginAt: '2024-03-13',
      balance: 100.00,
      profit: 25.00,
      locked: 0,
      planName: 'Trial',
      totalOperations: 8,
      totalProfitUsd: 25.00,
      country: 'Brasil',
      isVip: false
    }
  ];

  const mockStats: UserStats = {
    totalUsers: 1247,
    activeUsers: 1089,
    trialUsers: 89,
    affiliates: 156,
    newUsers30d: 234,
    totalBalance: 2847593.45,
    totalProfit: 1234567.89,
    suspendedUsers: 12
  };

  useEffect(() => {
    setMounted(true);
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      // Simulate API call
      setTimeout(() => {
        setUsers(mockUsers);
        setStats(mockStats);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading users:', error);
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleUserStatusChange = (userId: string, newStatus: User['status']) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
    }
  };

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'trial_active': return 'text-blue-400';
      case 'inactive': return 'text-gray-400';
      case 'suspended': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBg = (status: User['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 border-green-500/50';
      case 'trial_active': return 'bg-blue-500/20 border-blue-500/50';
      case 'inactive': return 'bg-gray-500/20 border-gray-500/50';
      case 'suspended': return 'bg-red-500/20 border-red-500/50';
      default: return 'bg-gray-500/20 border-gray-500/50';
    }
  };

  const getRoleColor = (role: User['role']) => {
    switch (role) {
      case 'admin': return 'text-red-400';
      case 'affiliate': return 'text-purple-400';
      case 'user': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD'
    }).format(value || 0);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Nunca';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (!mounted) return null;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center min-h-96">
          <div className="text-center">
            <FiRefreshCw className="w-8 h-8 text-red-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Carregando usuários...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
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
              {language === 'pt' ? 'Gerenciamento de Usuários' : 'Users Management'}
            </h1>
            <p className="text-gray-400 mt-1">
              {language === 'pt' ? 'Controle completo de usuários e permissões' : 'Complete control of users and permissions'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-lg transition-all"
            >
              <FiPlus className="w-4 h-4" />
              {language === 'pt' ? 'Criar Usuário' : 'Create User'}
            </button>
            <button
              onClick={loadUsers}
              className="p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg text-gray-400 hover:text-white transition-all"
            >
              <FiRefreshCw className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="col-span-1 md:col-span-1 lg:col-span-2 bg-gradient-to-br from-red-900/50 to-pink-900/50 backdrop-blur-md rounded-xl p-6 border border-red-500/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <FiUsers className="text-blue-400 text-xl" />
                <h3 className="text-white font-semibold">Total</h3>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{stats.totalUsers.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Usuários cadastrados</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="col-span-1 md:col-span-1 lg:col-span-2 bg-gradient-to-br from-red-900/50 to-pink-900/50 backdrop-blur-md rounded-xl p-6 border border-red-500/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <FiUserCheck className="text-green-400 text-xl" />
                <h3 className="text-white font-semibold">Ativos</h3>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{stats.activeUsers.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Em operação</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="col-span-1 md:col-span-1 lg:col-span-2 bg-gradient-to-br from-red-900/50 to-pink-900/50 backdrop-blur-md rounded-xl p-6 border border-red-500/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <FiStar className="text-yellow-400 text-xl" />
                <h3 className="text-white font-semibold">Afiliados</h3>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{stats.affiliates}</div>
              <div className="text-sm text-gray-400">Programa de afiliados</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="col-span-1 md:col-span-1 lg:col-span-2 bg-gradient-to-br from-red-900/50 to-pink-900/50 backdrop-blur-md rounded-xl p-6 border border-red-500/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <FiTrendingUp className="text-emerald-400 text-xl" />
                <h3 className="text-white font-semibold">Novos (30d)</h3>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{stats.newUsers30d}</div>
              <div className="text-sm text-gray-400">Últimos 30 dias</div>
            </motion.div>
          </div>
        )}
              <p className="text-2xl font-bold text-green-600">{stats.active_users}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Em Trial</h3>
              <p className="text-2xl font-bold text-blue-600">{stats.trial_users}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Afiliados</h3>
              <p className="text-2xl font-bold text-purple-600">{stats.affiliates}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Novos (30d)</h3>
              <p className="text-2xl font-bold text-orange-600">{stats.new_users_30d}</p>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="bg-white p-4 rounded-lg shadow">
          <input
            type="text"
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plano
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Saldo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Operações
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Último Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                            <span className="text-white font-medium">
                              {user.name?.charAt(0)?.toUpperCase() || '?'}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          {user.is_affiliate && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              Afiliado
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        {user.status === 'active' ? 'Ativo' : 
                         user.status === 'trial_active' ? 'Trial' :
                         user.status === 'inactive' ? 'Inativo' : 
                         user.status === 'suspended' ? 'Suspenso' : user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.plan_name || 'Sem plano'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div>Saldo: {formatCurrency(user.balance)}</div>
                        <div className="text-xs text-gray-500">
                          Lucro: {formatCurrency(user.profit)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div>{user.total_operations} operações</div>
                        <div className="text-xs text-gray-500">
                          {formatCurrency(user.total_profit_usd)} total
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.last_login_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Ver
                      </button>
                      <button className="text-green-600 hover:text-green-900 mr-3">
                        Editar
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        Suspender
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">Nenhum usuário encontrado</div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}



