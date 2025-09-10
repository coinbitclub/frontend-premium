/**
 * 👥 USERS LIST PAGE - T7 Implementation
 * Página de listagem de usuários com paginação, busca e filtros
 * Demonstra o padrão LIST usando useUsers hook
 */

import React, { useState, useEffect } from 'react';
import { useUsers } from '../src/hooks';
import type { User } from '../src/lib/api/adapters';

interface UsersListState {
  searchQuery: string;
  selectedRole: string;
  selectedStatus: string;
  currentPage: number;
  pageSize: number;
}

export default function UsersList() {
  const {
    users,
    usersLoading,
    usersError,
    usersPagination,
    getUsers,
    deactivateUser,
    promoteUser,
    formatUserDisplayName,
    searchUsers
  } = useUsers();

  const [state, setState] = useState<UsersListState>({
    searchQuery: '',
    selectedRole: '',
    selectedStatus: '',
    currentPage: 1,
    pageSize: 20
  });

  const [localSearch, setLocalSearch] = useState('');
  const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({});

  // ===============================================
  // 🔄 FETCH USERS
  // ===============================================

  const fetchUsers = async () => {
    await getUsers({
      page: state.currentPage,
      limit: state.pageSize,
      search: state.searchQuery,
      role: state.selectedRole || undefined,
      status: state.selectedStatus || undefined,
      sort: 'createdAt',
      order: 'desc'
    });
  };

  useEffect(() => {
    fetchUsers();
  }, [state.currentPage, state.pageSize, state.searchQuery, state.selectedRole, state.selectedStatus]);

  // ===============================================
  // 🔍 SEARCH & FILTERS
  // ===============================================

  const handleSearch = () => {
    setState(prev => ({
      ...prev,
      searchQuery: localSearch,
      currentPage: 1
    }));
  };

  const handleRoleFilter = (role: string) => {
    setState(prev => ({
      ...prev,
      selectedRole: role,
      currentPage: 1
    }));
  };

  const handleStatusFilter = (status: string) => {
    setState(prev => ({
      ...prev,
      selectedStatus: status,
      currentPage: 1
    }));
  };

  const clearFilters = () => {
    setState(prev => ({
      ...prev,
      searchQuery: '',
      selectedRole: '',
      selectedStatus: '',
      currentPage: 1
    }));
    setLocalSearch('');
  };

  // ===============================================
  // 📄 PAGINATION
  // ===============================================

  const handlePageChange = (page: number) => {
    setState(prev => ({ ...prev, currentPage: page }));
  };

  const handlePageSizeChange = (size: number) => {
    setState(prev => ({
      ...prev,
      pageSize: size,
      currentPage: 1
    }));
  };

  // ===============================================
  // 🎬 USER ACTIONS
  // ===============================================

  const handleDeactivateUser = async (userId: string | number) => {
    if (!confirm('Tem certeza que deseja desativar este usuário?')) return;
    
    setActionLoading(prev => ({ ...prev, [`deactivate_${userId}`]: true }));
    
    const success = await deactivateUser(userId);
    if (success) {
      await fetchUsers(); // Refresh list
    }
    
    setActionLoading(prev => ({ ...prev, [`deactivate_${userId}`]: false }));
  };

  const handlePromoteUser = async (userId: string | number, newRole: 'admin' | 'moderator' | 'vip') => {
    if (!confirm(`Tem certeza que deseja promover este usuário para ${newRole}?`)) return;
    
    setActionLoading(prev => ({ ...prev, [`promote_${userId}`]: true }));
    
    const result = await promoteUser(userId, newRole);
    if (result) {
      await fetchUsers(); // Refresh list
    }
    
    setActionLoading(prev => ({ ...prev, [`promote_${userId}`]: false }));
  };

  // ===============================================
  // 🎨 RENDER HELPERS
  // ===============================================

  const getRoleColor = (role: string) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      moderator: 'bg-blue-100 text-blue-800',
      vip: 'bg-purple-100 text-purple-800',
      user: 'bg-gray-100 text-gray-800'
    };
    return colors[role as keyof typeof colors] || colors.user;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      suspended: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || colors.active;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // ===============================================
  // 🎨 RENDER
  // ===============================================

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            👥 Gerenciamento de Usuários
          </h1>
          <p className="text-gray-600">
            Lista completa de usuários com funcionalidades de busca, filtros e ações
          </p>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar usuários
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="Nome, email ou username..."
                  className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button
                  onClick={handleSearch}
                  className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
                >
                  🔍
                </button>
              </div>
            </div>

            {/* Role Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por Role
              </label>
              <select
                value={state.selectedRole}
                onChange={(e) => handleRoleFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos os roles</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
                <option value="vip">VIP</option>
                <option value="user">User</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por Status
              </label>
              <select
                value={state.selectedStatus}
                onChange={(e) => handleStatusFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos os status</option>
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
                <option value="suspended">Suspenso</option>
                <option value="pending">Pendente</option>
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          {(state.searchQuery || state.selectedRole || state.selectedStatus) && (
            <div className="mt-4">
              <button
                onClick={clearFilters}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                🗑️ Limpar filtros
              </button>
            </div>
          )}
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                Usuários ({usersPagination.total})
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Itens por página:</span>
                <select
                  value={state.pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {usersLoading && (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Carregando usuários...</p>
            </div>
          )}

          {/* Error State */}
          {usersError && (
            <div className="p-8 text-center">
              <div className="text-red-600 mb-2">❌ Erro ao carregar usuários</div>
              <p className="text-gray-600 mb-4">{usersError}</p>
              <button
                onClick={fetchUsers}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {/* Users Table */}
          {!usersLoading && !usersError && (
            <>
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
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-700">
                                  {formatUserDisplayName(user).charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {formatUserDisplayName(user)}
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
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            {/* View Details */}
                            <button
                              onClick={() => window.open(`/users-details?id=${user.id}`, '_blank')}
                              className="text-blue-600 hover:text-blue-900"
                              title="Ver detalhes"
                            >
                              👁️
                            </button>
                            
                            {/* Promote User */}
                            {user.role === 'user' && (
                              <button
                                onClick={() => handlePromoteUser(user.id, 'vip')}
                                disabled={actionLoading[`promote_${user.id}`]}
                                className="text-purple-600 hover:text-purple-900 disabled:opacity-50"
                                title="Promover para VIP"
                              >
                                {actionLoading[`promote_${user.id}`] ? '⏳' : '⬆️'}
                              </button>
                            )}
                            
                            {/* Deactivate User */}
                            {user.status === 'active' && (
                              <button
                                onClick={() => handleDeactivateUser(user.id)}
                                disabled={actionLoading[`deactivate_${user.id}`]}
                                className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                title="Desativar usuário"
                              >
                                {actionLoading[`deactivate_${user.id}`] ? '⏳' : '🚫'}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Empty State */}
              {users.length === 0 && (
                <div className="p-8 text-center">
                  <div className="text-gray-400 text-6xl mb-4">👥</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum usuário encontrado</h3>
                  <p className="text-gray-600">Tente ajustar os filtros ou criar um novo usuário.</p>
                </div>
              )}

              {/* Pagination */}
              {usersPagination.total > 0 && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Mostrando {((usersPagination.page - 1) * usersPagination.limit) + 1} a{' '}
                      {Math.min(usersPagination.page * usersPagination.limit, usersPagination.total)} de{' '}
                      {usersPagination.total} usuários
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handlePageChange(usersPagination.page - 1)}
                        disabled={!usersPagination.hasPrev}
                        className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        ← Anterior
                      </button>
                      <span className="px-3 py-1 text-sm text-gray-700">
                        Página {usersPagination.page}
                      </span>
                      <button
                        onClick={() => handlePageChange(usersPagination.page + 1)}
                        disabled={!usersPagination.hasNext}
                        className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Próxima →
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>T7 - Scaffolding: Página LIST implementada com useUsers hook ✅</p>
          <p className="mt-1">
            <strong>Funcionalidades:</strong> Paginação, Busca, Filtros, Ações (Promover, Desativar)
          </p>
        </div>
      </div>
    </div>
  );
}