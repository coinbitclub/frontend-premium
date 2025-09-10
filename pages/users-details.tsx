/**
 * 👤 USER DETAILS PAGE - T7 Implementation
 * Página de detalhes de usuário específico
 * Demonstra o padrão DETAILS usando useUsers e useFinancial hooks
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUsers, useFinancial } from '../src/hooks';
import type { User } from '../src/lib/api/adapters';

interface UserDetailsState {
  activeTab: 'profile' | 'balance' | 'transactions' | 'activity';
  editMode: boolean;
}

export default function UserDetails() {
  const router = useRouter();
  const { id } = router.query;
  
  const {
    currentUser,
    userLoading,
    userError,
    getUserById,
    updateUser,
    updateLoading,
    updateError,
    promoteUser,
    promoteLoading,
    deactivateUser,
    deactivateLoading,
    formatUserDisplayName
  } = useUsers();
  
  const {
    balance,
    balanceLoading,
    balanceError,
    getBalance,
    transactions,
    transactionsLoading,
    transactionsError,
    getTransactions,
    transactionsPagination
  } = useFinancial();

  const [state, setState] = useState<UserDetailsState>({
    activeTab: 'profile',
    editMode: false
  });

  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    role: 'user' as 'user' | 'admin' | 'moderator' | 'vip',
    status: 'active' as 'active' | 'inactive' | 'suspended'
  });

  // ===============================================
  // 🔄 FETCH DATA
  // ===============================================

  useEffect(() => {
    if (id && typeof id === 'string') {
      getUserById(id);
    }
  }, [id, getUserById]);

  useEffect(() => {
    if (currentUser) {
      // Populate edit form with current user data
      setEditForm({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        phoneNumber: currentUser.phoneNumber || '',
        role: currentUser.role as any,
        status: currentUser.status as any
      });
      
      // Fetch financial data
      getBalance(String(currentUser.id));
      getTransactions(String(currentUser.id), { limit: 10 });
    }
  }, [currentUser, getBalance, getTransactions]);

  // ===============================================
  // 🎬 ACTIONS
  // ===============================================

  const handleTabChange = (tab: UserDetailsState['activeTab']) => {
    setState(prev => ({ ...prev, activeTab: tab }));
  };

  const handleEditToggle = () => {
    setState(prev => ({ ...prev, editMode: !prev.editMode }));
  };

  const handleSaveChanges = async () => {
    if (!currentUser) return;
    
    const result = await updateUser(currentUser.id, {
      firstName: editForm.firstName,
      lastName: editForm.lastName,
      email: editForm.email,
      phoneNumber: editForm.phoneNumber,
      role: editForm.role,
      status: editForm.status
    });
    
    if (result) {
      setState(prev => ({ ...prev, editMode: false }));
    }
  };

  const handlePromoteUser = async (newRole: 'admin' | 'moderator' | 'vip') => {
    if (!currentUser) return;
    if (!confirm(`Tem certeza que deseja promover este usuário para ${newRole}?`)) return;
    
    await promoteUser(currentUser.id, newRole);
  };

  const handleDeactivateUser = async () => {
    if (!currentUser) return;
    if (!confirm('Tem certeza que deseja desativar este usuário?')) return;
    
    const success = await deactivateUser(currentUser.id);
    if (success) {
      // Refresh user data
      getUserById(String(currentUser.id));
    }
  };

  // ===============================================
  // 🎨 RENDER HELPERS
  // ===============================================

  const getRoleColor = (role: string) => {
    const colors = {
      admin: 'bg-red-100 text-red-800 border-red-200',
      moderator: 'bg-blue-100 text-blue-800 border-blue-200',
      vip: 'bg-purple-100 text-purple-800 border-purple-200',
      user: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[role as keyof typeof colors] || colors.user;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-gray-100 text-gray-800 border-gray-200',
      suspended: 'bg-red-100 text-red-800 border-red-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    return colors[status as keyof typeof colors] || colors.active;
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency === 'BRL' ? 'BRL' : 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  // ===============================================
  // 🎨 RENDER
  // ===============================================

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Carregando detalhes do usuário...</p>
        </div>
      </div>
    );
  }

  if (userError || !currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Usuário não encontrado</h2>
          <p className="text-gray-600 mb-4">{userError || 'O usuário solicitado não existe.'}</p>
          <button
            onClick={() => router.push('/users-list')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            ← Voltar para lista
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => router.push('/users-list')}
                className="text-blue-600 hover:text-blue-800 mb-2 flex items-center"
              >
                ← Voltar para lista
              </button>
              <h1 className="text-3xl font-bold text-gray-900">
                👤 {formatUserDisplayName(currentUser)}
              </h1>
              <p className="text-gray-600">ID: {currentUser.id}</p>
            </div>
            <div className="flex space-x-2">
              {!state.editMode ? (
                <>
                  <button
                    onClick={handleEditToggle}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    ✏️ Editar
                  </button>
                  {currentUser.role === 'user' && (
                    <button
                      onClick={() => handlePromoteUser('vip')}
                      disabled={promoteLoading}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
                    >
                      {promoteLoading ? '⏳' : '⬆️'} Promover
                    </button>
                  )}
                  {currentUser.status === 'active' && (
                    <button
                      onClick={handleDeactivateUser}
                      disabled={deactivateLoading}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                    >
                      {deactivateLoading ? '⏳' : '🚫'} Desativar
                    </button>
                  )}
                </>
              ) : (
                <>
                  <button
                    onClick={handleSaveChanges}
                    disabled={updateLoading}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {updateLoading ? '⏳' : '💾'} Salvar
                  </button>
                  <button
                    onClick={handleEditToggle}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                  >
                    ❌ Cancelar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* User Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Role Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Role</h3>
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${getRoleColor(currentUser.role)}`}>
              {currentUser.role.toUpperCase()}
            </span>
          </div>

          {/* Status Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Status</h3>
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(currentUser.status)}`}>
              {currentUser.status.toUpperCase()}
            </span>
          </div>

          {/* Join Date Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Membro desde</h3>
            <p className="text-gray-600">{formatDate(currentUser.createdAt)}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'profile', label: '👤 Perfil', count: null },
                { id: 'balance', label: '💰 Saldo', count: null },
                { id: 'transactions', label: '📋 Transações', count: transactions.length },
                { id: 'activity', label: '📊 Atividade', count: null }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    state.activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  {tab.count !== null && (
                    <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Profile Tab */}
            {state.activeTab === 'profile' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Informações do Perfil</h3>
                
                {updateError && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="text-red-800">{updateError}</div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                    {state.editMode ? (
                      <input
                        type="text"
                        value={editForm.firstName}
                        onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{currentUser.firstName || 'Não informado'}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sobrenome</label>
                    {state.editMode ? (
                      <input
                        type="text"
                        value={editForm.lastName}
                        onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{currentUser.lastName || 'Não informado'}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    {state.editMode ? (
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{currentUser.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                    {state.editMode ? (
                      <input
                        type="tel"
                        value={editForm.phoneNumber}
                        onChange={(e) => setEditForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{currentUser.phoneNumber || 'Não informado'}</p>
                    )}
                  </div>
                  
                  {state.editMode && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                        <select
                          value={editForm.role}
                          onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value as any }))}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="user">User</option>
                          <option value="vip">VIP</option>
                          <option value="moderator">Moderator</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select
                          value={editForm.status}
                          onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value as any }))}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="active">Ativo</option>
                          <option value="inactive">Inativo</option>
                          <option value="suspended">Suspenso</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Balance Tab */}
            {state.activeTab === 'balance' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Saldo do Usuário</h3>
                
                {balanceLoading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-2 text-gray-600">Carregando saldo...</p>
                  </div>
                ) : balanceError ? (
                  <div className="text-center py-8">
                    <div className="text-red-600 mb-2">❌ Erro ao carregar saldo</div>
                    <p className="text-gray-600">{balanceError}</p>
                  </div>
                ) : balance ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-green-800 mb-2">Total USD</h4>
                      <p className="text-2xl font-bold text-green-900">{formatCurrency(balance.totalUSD, 'USD')}</p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-blue-800 mb-2">Total BRL</h4>
                      <p className="text-2xl font-bold text-blue-900">{formatCurrency(balance.totalBRL, 'BRL')}</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">Última Atualização</h4>
                      <p className="text-gray-900">{formatDate(balance.lastUpdate)}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-6xl mb-4">💰</div>
                    <p className="text-gray-600">Nenhum saldo encontrado</p>
                  </div>
                )}
              </div>
            )}

            {/* Transactions Tab */}
            {state.activeTab === 'transactions' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Transações Recentes</h3>
                
                {transactionsLoading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-2 text-gray-600">Carregando transações...</p>
                  </div>
                ) : transactionsError ? (
                  <div className="text-center py-8">
                    <div className="text-red-600 mb-2">❌ Erro ao carregar transações</div>
                    <p className="text-gray-600">{transactionsError}</p>
                  </div>
                ) : transactions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {transactions.map((transaction) => (
                          <tr key={transaction.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {transaction.type}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(transaction.amount, transaction.currency)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                                transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {transaction.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(transaction.createdAt)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-6xl mb-4">📋</div>
                    <p className="text-gray-600">Nenhuma transação encontrada</p>
                  </div>
                )}
              </div>
            )}

            {/* Activity Tab */}
            {state.activeTab === 'activity' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Atividade do Usuário</h3>
                <div className="text-center py-8">
                  <div className="text-gray-400 text-6xl mb-4">📊</div>
                  <p className="text-gray-600">Funcionalidade de atividade em desenvolvimento</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>T7 - Scaffolding: Página DETAILS implementada com useUsers e useFinancial hooks ✅</p>
          <p className="mt-1">
            <strong>Funcionalidades:</strong> Visualização, Edição, Promoção, Desativação, Saldo, Transações
          </p>
        </div>
      </div>
    </div>
  );
}