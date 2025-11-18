import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import { 
  FiUserPlus, 
  FiPlus, 
  FiEdit3, 
  FiTrash2, 
  FiSearch, 
  FiFilter,
  FiDownload,
  FiMail,
  FiLock,
  FiUnlock,
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
  FiUsers,
  FiCreditCard,
  FiSettings,
  FiX
} from 'react-icons/fi';
import { useLanguage } from '../../hooks/useLanguage';
import AdminLayout from '../../components/AdminLayout';

interface User {
  id: string;
  email: string;
  name: string;
  status: 'active' | 'inactive' | 'suspended';
  totalCommissions: number;
  lastLogin: string;
  registeredAt: string;
  apiKeysCount: number;
  tradingVolume: number;
  country: string;
  verified: boolean;
  robotBalance: number;
  walletBalance: number;
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
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
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState<string | null>(null);
  const { language } = useLanguage();

  // Mock data simplificado
  const mockUsers: User[] = [
    {
      id: '1',
      email: 'joao@example.com',
      name: 'João Silva',
      status: 'active',
      totalCommissions: 2500.50,
      lastLogin: '2025-08-16T08:30:00Z',
      registeredAt: '2025-01-15',
      apiKeysCount: 3,
      tradingVolume: 45000.00,
      country: 'BR',
      verified: true,
      robotBalance: 1500.00,
      walletBalance: 850.75
    },
    {
      id: '2',
      email: 'maria@example.com',
      name: 'Maria Santos',
      status: 'active',
      totalCommissions: 1250.75,
      lastLogin: '2025-08-15T14:20:00Z',
      registeredAt: '2025-03-20',
      apiKeysCount: 2,
      tradingVolume: 12000.00,
      country: 'BR',
      verified: true,
      robotBalance: 750.00,
      walletBalance: 420.50
    },
    {
      id: '3',
      email: 'carlos@example.com',
      name: 'Carlos Lima',
      status: 'suspended',
      totalCommissions: 150.00,
      lastLogin: '2025-08-10T10:15:00Z',
      registeredAt: '2025-07-01',
      apiKeysCount: 1,
      tradingVolume: 3500.00,
      country: 'BR',
      verified: false,
      robotBalance: 0,
      walletBalance: 25.00
    },
    {
      id: '4',
      email: 'ana@example.com',
      name: 'Ana Costa',
      status: 'inactive',
      totalCommissions: 0,
      lastLogin: '2025-07-20T16:45:00Z',
      registeredAt: '2025-06-10',
      apiKeysCount: 0,
      tradingVolume: 0,
      country: 'BR',
      verified: false,
      robotBalance: 0,
      walletBalance: 0
    }
  ];

  const mockStats: UserStats = {
    totalUsers: 1247,
    activeUsers: 892,
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
  }, []);

  // Filtros de usuários
  const filteredUsers = users.filter(user => {
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  // Funções de ação
  const handleUserStatusChange = (userId: string, newStatus: 'active' | 'inactive' | 'suspended') => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'inactive': return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
      case 'suspended': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const exportData = () => {
    const csvData = filteredUsers.map(user => ({
      Email: user.email,
      Nome: user.name,
      Status: user.status,
      'Total Comissões': user.totalCommissions,
      'Volume Trading': user.tradingVolume,
      'Último Login': user.lastLogin,
      'Registro': user.registeredAt,
      'APIs Configuradas': user.apiKeysCount,
      'Verificado': user.verified ? 'Sim' : 'Não',
      'País': user.country,
      'Saldo Robô': user.robotBalance,
      'Saldo Carteira': user.walletBalance
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'usuarios.csv';
    a.click();
  };

  return (
    <>
      <Head>
        <title>Usuários - Admin CoinBitClub</title>
      </Head>
      
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                {language === 'pt' ? 'Gestão de Usuários' : 'User Management'}
              </h1>
              <p className="text-gray-400 mt-2">
                {language === 'pt' ? 'Gerencie todos os usuários da plataforma' : 'Manage all platform users'}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={exportData}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                <FiDownload className="w-4 h-4" />
                {language === 'pt' ? 'Exportar' : 'Export'}
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-all"
              >
                <FiPlus className="w-4 h-4" />
                {language === 'pt' ? 'Novo Usuário' : 'New User'}
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 backdrop-blur-md rounded-xl p-6 border border-blue-500/20"
              >
                <div className="flex items-center gap-3 mb-4">
                  <FiUsers className="text-blue-400 text-xl" />
                  <h3 className="text-white font-semibold">Total de Usuários</h3>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stats.totalUsers}</div>
                <div className="text-blue-400 text-sm">Ativos: {stats.activeUsers}</div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-green-900/50 to-emerald-800/50 backdrop-blur-md rounded-xl p-6 border border-green-500/20"
              >
                <div className="flex items-center gap-3 mb-4">
                  <FiDollarSign className="text-green-400 text-xl" />
                  <h3 className="text-white font-semibold">Volume Total</h3>
                </div>
                <div className="text-3xl font-bold text-white mb-2">${stats.totalVolume.toLocaleString()}</div>
                <div className="text-green-400 text-sm">Comissões: ${stats.totalCommissions.toLocaleString()}</div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-orange-900/50 to-amber-800/50 backdrop-blur-md rounded-xl p-6 border border-orange-500/20"
              >
                <div className="flex items-center gap-3 mb-4">
                  <FiActivity className="text-orange-400 text-xl" />
                  <h3 className="text-white font-semibold">Traders Ativos</h3>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stats.activeTraders}</div>
                <div className="text-orange-400 text-sm">Novos hoje: {stats.newUsersToday}</div>
              </motion.div>
            </div>
          )}

          {/* Filters */}
          <div className="bg-slate-900/50 backdrop-blur-md rounded-xl p-6 border border-slate-500/20">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={language === 'pt' ? 'Buscar usuários...' : 'Search users...'}
                    className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="all">Todos os Status</option>
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
                <option value="suspended">Suspenso</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-slate-900/50 backdrop-blur-md rounded-xl border border-slate-500/20 overflow-hidden">
            <div className="p-6 border-b border-slate-700/50">
              <h2 className="text-xl font-bold text-white">
                Lista de Usuários ({filteredUsers.length})
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Usuário</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-300">Comissões</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-300">Volume</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-300">Saldos</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-300">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {filteredUsers.map((user) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-white font-medium">{user.name}</div>
                            <div className="text-gray-400 text-sm">{user.email}</div>
                            <div className="flex items-center gap-2 mt-1">
                              {user.verified && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
                                  <FiShield className="w-3 h-3" />
                                  Verificado
                                </span>
                              )}
                              <span className="text-gray-500 text-xs">{user.country}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                          {user.status === 'active' && 'Ativo'}
                          {user.status === 'inactive' && 'Inativo'}
                          {user.status === 'suspended' && 'Suspenso'}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 text-right">
                        <div className="text-white font-medium">${user.totalCommissions.toLocaleString()}</div>
                      </td>
                      
                      <td className="px-6 py-4 text-right">
                        <div className="text-white font-medium">${user.tradingVolume.toLocaleString()}</div>
                        <div className="text-gray-400 text-sm">{user.apiKeysCount} APIs</div>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <div className="text-sm">
                          <div className="text-white">Robô: ${user.robotBalance.toLocaleString()}</div>
                          <div className="text-gray-400">Carteira: ${user.walletBalance.toLocaleString()}</div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                            title="Ver detalhes"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleUserStatusChange(user.id, user.status === 'active' ? 'suspended' : 'active')}
                            className={`p-2 rounded-lg transition-colors ${
                              user.status === 'active' 
                                ? 'text-red-400 hover:bg-red-500/20' 
                                : 'text-green-400 hover:bg-green-500/20'
                            }`}
                            title={user.status === 'active' ? 'Suspender' : 'Ativar'}
                          >
                            {user.status === 'active' ? <FiLock className="w-4 h-4" /> : <FiUnlock className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                            title="Deletar usuário"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* User Details Modal */}
          {selectedUser && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-slate-900 rounded-xl p-6 max-w-2xl w-full mx-4 border border-slate-700"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Detalhes do Usuário</h3>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="p-2 text-gray-400 hover:text-white rounded-lg transition-colors"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400">Nome</label>
                      <div className="text-white font-medium">{selectedUser.name}</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Email</label>
                      <div className="text-white font-medium">{selectedUser.email}</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Status</label>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedUser.status)}`}>
                        {selectedUser.status}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">País</label>
                      <div className="text-white font-medium">{selectedUser.country}</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400">Saldo Robô</label>
                      <div className="text-white font-medium">${selectedUser.robotBalance.toLocaleString()}</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Saldo Carteira</label>
                      <div className="text-white font-medium">${selectedUser.walletBalance.toLocaleString()}</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Total Comissões</label>
                      <div className="text-white font-medium">${selectedUser.totalCommissions.toLocaleString()}</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Volume Trading</label>
                      <div className="text-white font-medium">${selectedUser.tradingVolume.toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="flex-1 py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
                  >
                    Fechar
                  </button>
                  <button
                    onClick={() => {
                      handleUserStatusChange(selectedUser.id, selectedUser.status === 'active' ? 'suspended' : 'active');
                      setSelectedUser(null);
                    }}
                    className={`flex-1 py-2 px-4 rounded-lg transition-all ${
                      selectedUser.status === 'active' 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {selectedUser.status === 'active' ? 'Suspender' : 'Ativar'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminUsers;
