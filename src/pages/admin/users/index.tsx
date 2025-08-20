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

        {/* Filters and Search */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-red-900/50 to-pink-900/50 backdrop-blur-md rounded-xl p-6 border border-red-500/20"
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
                  className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50"
                />
              </div>

              <div className="flex items-center gap-2">
                <FiFilter className="text-gray-400 w-4 h-4" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="bg-gray-800/50 border border-gray-600/50 rounded-lg text-white px-3 py-2 focus:outline-none focus:border-red-500/50"
                >
                  <option value="all">Todos os Status</option>
                  <option value="active">Ativos</option>
                  <option value="trial_active">Trial Ativo</option>
                  <option value="inactive">Inativos</option>
                  <option value="suspended">Suspensos</option>
                </select>
              </div>

              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as any)}
                className="bg-gray-800/50 border border-gray-600/50 rounded-lg text-white px-3 py-2 focus:outline-none focus:border-red-500/50"
              >
                <option value="all">Todas as Funções</option>
                <option value="user">Usuário</option>
                <option value="affiliate">Afiliado</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg text-gray-400 hover:text-white transition-all">
                <FiDownload className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Users Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-red-900/50 to-pink-900/50 backdrop-blur-md rounded-xl border border-red-500/20 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-red-500/20">
                  <th className="text-left p-4 text-gray-300 font-semibold">Usuário</th>
                  <th className="text-left p-4 text-gray-300 font-semibold">Função</th>
                  <th className="text-left p-4 text-gray-300 font-semibold">Status</th>
                  <th className="text-left p-4 text-gray-300 font-semibold">Plano</th>
                  <th className="text-left p-4 text-gray-300 font-semibold">Saldo</th>
                  <th className="text-left p-4 text-gray-300 font-semibold">Lucro</th>
                  <th className="text-left p-4 text-gray-300 font-semibold">Operações</th>
                  <th className="text-left p-4 text-gray-300 font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-red-500/10 hover:bg-red-500/5 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center">
                            <FiUsers className="text-white text-sm" />
                          </div>
                          <div>
                            <div className="text-white font-medium flex items-center gap-2">
                              {user.name}
                              {user.isVip && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
                                  <FiAward className="w-3 h-3" />
                                  VIP
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-400">{user.email}</div>
                            <div className="text-xs text-gray-500">ID: {user.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`font-medium ${getRoleColor(user.role)}`}>
                          {user.role.toUpperCase()}
                        </span>
                        {user.isAffiliate && (
                          <div className="text-xs text-purple-400 mt-1">Afiliado</div>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBg(user.status)}`}>
                          <span className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(user.status).replace('text-', 'bg-')}`}></span>
                          {user.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-white font-medium">{user.planName}</span>
                      </td>
                      <td className="p-4">
                        <div className="text-white font-medium">{formatCurrency(user.balance)}</div>
                        {user.locked > 0 && (
                          <div className="text-xs text-orange-400">
                            Bloqueado: {formatCurrency(user.locked)}
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="text-green-400 font-medium">{formatCurrency(user.profit)}</div>
                        <div className="text-xs text-gray-400">
                          Total: {formatCurrency(user.totalProfitUsd)}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-white font-medium">{user.totalOperations}</div>
                        <div className="text-xs text-gray-400">operações</div>
                      </td>
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

                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 hover:text-red-300 transition-all"
                            title="Excluir usuário"
                          >
                            <FiTrash2 className="w-4 h-4" />
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

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <FiUsers className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">Nenhum usuário encontrado</h3>
            <p className="text-gray-400">Tente ajustar os filtros ou criar um novo usuário.</p>
          </motion.div>
        )}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <UserDetailsModal 
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          language={language}
        />
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <CreateUserModal 
          onClose={() => setShowCreateModal(false)}
          language={language}
        />
      )}
    </AdminLayout>
  );
};

// Modal Components
const UserDetailsModal: React.FC<{
  user: User;
  onClose: () => void;
  language: string;
}> = ({ user, onClose, language }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 w-full max-w-2xl border border-red-500/20"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Detalhes do Usuário</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-all"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <label className="text-gray-400">Nome:</label>
            <p className="text-white font-medium">{user.name}</p>
          </div>
          <div>
            <label className="text-gray-400">Email:</label>
            <p className="text-white font-medium">{user.email}</p>
          </div>
          <div>
            <label className="text-gray-400">Função:</label>
            <p className="text-white font-medium">{user.role}</p>
          </div>
          <div>
            <label className="text-gray-400">Status:</label>
            <p className="text-white font-medium">{user.status}</p>
          </div>
          <div>
            <label className="text-gray-400">Plano:</label>
            <p className="text-white font-medium">{user.planName}</p>
          </div>
          <div>
            <label className="text-gray-400">País:</label>
            <p className="text-white font-medium">{user.country || 'N/A'}</p>
          </div>
          <div>
            <label className="text-gray-400">Cadastro:</label>
            <p className="text-white font-medium">{new Date(user.createdAt).toLocaleDateString('pt-BR')}</p>
          </div>
          <div>
            <label className="text-gray-400">Último Login:</label>
            <p className="text-white font-medium">{new Date(user.lastLoginAt).toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const CreateUserModal: React.FC<{
  onClose: () => void;
  language: string;
}> = ({ onClose, language }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 w-full max-w-md border border-red-500/20"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Criar Novo Usuário</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-all"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center py-8">
          <FiPlus className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-white mb-2">
            Funcionalidade em Desenvolvimento
          </h4>
          <p className="text-gray-400 mb-6">
            A criação manual de usuários será implementada em breve.
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-all"
          >
            Entendi
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminUsers;
