/**
 * 🛡️ ADMIN PROTECTED PAGE - T8 Implementation
 * Página de exemplo protegida por guards de autenticação
 * Demonstra o uso dos guards implementados em T8
 */

import React, { useState, useEffect } from 'react';
import { AdminGuard, AuthMiddleware } from '../src/guards';
import { useAuthT8 } from '../src/providers/AuthProviderT8';
import { useUsers, useCore } from '../src/hooks';
import type { User } from '../src/lib/api/adapters';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  systemHealth: boolean;
  lastUpdate: string;
}

export default function AdminProtectedPage() {
  // Handle SSG/SSR - useAuthT8 might not be available during build
  let authData;
  try {
    authData = useAuthT8();
  } catch (error) {
    // During SSG, provide default values
    authData = {
      user: null,
      isAuthenticated: false,
      hasRole: () => false,
      hasPermission: () => false,
      canAccess: () => false
    };
  }
  
  const {
    user,
    isAuthenticated,
    hasRole,
    hasPermission,
    canAccess
  } = authData;
  
  const {
    users,
    usersLoading,
    usersError,
    getUsers,
    userStats,
    getUserStats
  } = useUsers();
  
  const {
    health,
    healthLoading,
    healthError,
    checkHealth,
    isSystemHealthy
  } = useCore();

  const [adminStats, setAdminStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    systemHealth: false,
    lastUpdate: new Date().toISOString()
  });

  // ===============================================
  // 🔄 DATA FETCHING
  // ===============================================

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // Fetch users and system health
        await Promise.all([
          getUsers({ limit: 100 }),
          getUserStats(),
          checkHealth()
        ]);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    };

    if (isAuthenticated && hasRole('admin')) {
      fetchAdminData();
    }
  }, [isAuthenticated, hasRole, getUsers, getUserStats, checkHealth]);

  // ===============================================
  // 🔄 UPDATE STATS
  // ===============================================

  useEffect(() => {
    if (userStats && health) {
      setAdminStats({
        totalUsers: userStats.totalUsers || users.length,
        activeUsers: userStats.activeUsers || users.filter(u => u.status === 'active').length,
        systemHealth: isSystemHealthy,
        lastUpdate: new Date().toISOString()
      });
    }
  }, [userStats, health, users, isSystemHealthy]);

  // ===============================================
  // 🎬 ACTIONS
  // ===============================================

  const handleRefreshData = async () => {
    await Promise.all([
      getUsers({ limit: 100 }),
      getUserStats(),
      checkHealth()
    ]);
  };

  const handleExportUsers = () => {
    const csvContent = [
      ['ID', 'Nome', 'Email', 'Role', 'Status', 'Criado em'].join(','),
      ...users.map(user => [
        user.id,
        `"${user.firstName} ${user.lastName}"`,
        user.email,
        user.role,
        user.status,
        new Date(user.createdAt).toLocaleDateString('pt-BR')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // ===============================================
  // 🎨 RENDER HELPERS
  // ===============================================

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'text-green-600 bg-green-100',
      inactive: 'text-gray-600 bg-gray-100',
      suspended: 'text-red-600 bg-red-100',
      pending: 'text-yellow-600 bg-yellow-100'
    };
    return colors[status as keyof typeof colors] || colors.active;
  };

  const getRoleColor = (role: string) => {
    const colors = {
      admin: 'text-red-600 bg-red-100',
      moderator: 'text-blue-600 bg-blue-100',
      vip: 'text-purple-600 bg-purple-100',
      user: 'text-gray-600 bg-gray-100'
    };
    return colors[role as keyof typeof colors] || colors.user;
  };

  // ===============================================
  // 🎨 RENDER
  // ===============================================

  return (
    <AuthMiddleware>
      <AdminGuard>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    🛡️ Painel Administrativo
                  </h1>
                  <p className="text-gray-600">
                    Página protegida por guards de autenticação - Acesso apenas para administradores
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleRefreshData}
                    disabled={usersLoading || healthLoading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {usersLoading || healthLoading ? '🔄' : '🔄'} Atualizar
                  </button>
                  <button
                    onClick={handleExportUsers}
                    disabled={users.length === 0}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    📊 Exportar CSV
                  </button>
                </div>
              </div>
            </div>

            {/* User Info Card */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                👤 Informações do Administrador
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nome</label>
                  <p className="text-gray-900">{user?.firstName} {user?.lastName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{user?.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user?.role || 'user')}`}>
                    {user?.role?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Permissões</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {hasPermission('manage_users') && (
                      <span className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                        👥 Usuários
                      </span>
                    )}
                    {hasPermission('manage_system') && (
                      <span className="inline-flex px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                        ⚙️ Sistema
                      </span>
                    )}
                    {hasPermission('view_analytics') && (
                      <span className="inline-flex px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                        📊 Analytics
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-semibold">👥</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total de Usuários</p>
                    <p className="text-2xl font-semibold text-gray-900">{adminStats.totalUsers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-sm font-semibold">✅</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Usuários Ativos</p>
                    <p className="text-2xl font-semibold text-gray-900">{adminStats.activeUsers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      adminStats.systemHealth ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <span className={`text-sm font-semibold ${
                        adminStats.systemHealth ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {adminStats.systemHealth ? '💚' : '❤️'}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Sistema</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {adminStats.systemHealth ? 'Saudável' : 'Problemas'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 text-sm font-semibold">🕒</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Última Atualização</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {new Date(adminStats.lastUpdate).toLocaleTimeString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  👥 Usuários Recentes ({users.length})
                </h3>
              </div>

              {usersLoading ? (
                <div className="p-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-gray-600">Carregando usuários...</p>
                </div>
              ) : usersError ? (
                <div className="p-8 text-center">
                  <div className="text-red-600 mb-2">❌ Erro ao carregar usuários</div>
                  <p className="text-gray-600">{usersError}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Usuário
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Criado em
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.slice(0, 10).map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                  <span className="text-sm font-medium text-gray-700">
                                    {user.firstName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.firstName} {user.lastName}
                                </div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => window.open(`/users-details?id=${user.id}`, '_blank')}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              👁️ Ver
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Guard Info */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">
                🛡️ Informações dos Guards
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">Guards Ativos:</h4>
                  <ul className="space-y-1 text-blue-700">
                    <li>✅ AdminGuard - Protege esta página</li>
                    <li>✅ AuthMiddleware - Intercepta requisições</li>
                    <li>✅ Token refresh automático</li>
                    <li>✅ Verificação de permissões</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">Verificações:</h4>
                  <ul className="space-y-1 text-blue-700">
                    <li>✅ Usuário autenticado: {isAuthenticated ? 'Sim' : 'Não'}</li>
                    <li>✅ Role admin: {hasRole('admin') ? 'Sim' : 'Não'}</li>
                    <li>✅ Permissão manage_users: {hasPermission('manage_users') ? 'Sim' : 'Não'}</li>
                    <li>✅ Acesso liberado: {canAccess(['admin']) ? 'Sim' : 'Não'}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-sm text-gray-500">
              <p>T8 - Auth & Guards: Página protegida implementada com sucesso! ✅</p>
              <p className="mt-1">
                <strong>Funcionalidades:</strong> AdminGuard, AuthMiddleware, Verificação de Permissões, Auto-refresh
              </p>
            </div>
          </div>
        </div>
      </AdminGuard>
    </AuthMiddleware>
  );
}

// Disable SSG for this page since it requires authentication context
export async function getServerSideProps() {
  return {
    props: {}
  };
}