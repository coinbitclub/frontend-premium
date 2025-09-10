/**
 * 👥 USERS TABLE - T9 Implementation
 * Componente especializado de tabela para usuários
 * Integrado com useUsers hook e DataTable component
 */

import React, { useMemo, useCallback, useEffect } from 'react';
import { EyeIcon, PencilIcon, TrashIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { DataTable, type Column } from './DataTable';
import { useUsers } from '../../hooks/useUsers';
import type { User } from '../../lib/api/adapters';

// ===============================================
// 🔧 TYPES
// ===============================================

export interface UsersTableProps {
  onView?: (user: User) => void;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  onPromote?: (user: User) => void;
  onDeactivate?: (user: User) => void;
  className?: string;
  selectable?: boolean;
  selectedUsers?: User[];
  onSelectionChange?: (users: User[]) => void;
  showActions?: boolean;
  compactMode?: boolean;
}

// ===============================================
// 👥 USERS TABLE COMPONENT
// ===============================================

export const UsersTable: React.FC<UsersTableProps> = ({
  onView,
  onEdit,
  onDelete,
  onPromote,
  onDeactivate,
  className = '',
  selectable = false,
  selectedUsers = [],
  onSelectionChange,
  showActions = true,
  compactMode = false
}) => {
  const {
    users,
    usersLoading,
    usersError,
    usersPagination,
    getUsers
  } = useUsers();
  
  // ===============================================
  // 🔄 EFFECTS
  // ===============================================
  
  useEffect(() => {
    // Load initial users data
    getUsers({ limit: compactMode ? 10 : 20 });
  }, [compactMode, getUsers]);
  
  // ===============================================
  // 🎬 HANDLERS
  // ===============================================
  
  const handlePageChange = useCallback((page: number) => {
    getUsers({ page, limit: usersPagination.limit });
  }, [getUsers, usersPagination.limit]);
  
  const handleLimitChange = useCallback((limit: number) => {
    getUsers({ page: 1, limit });
  }, [getUsers]);
  
  const handleSortChange = useCallback((sort: any) => {
    getUsers({
      page: 1,
      limit: usersPagination.limit,
      sort: sort.field,
      order: sort.direction
    });
  }, [getUsers, usersPagination.limit]);
  
  const handleFiltersChange = useCallback((filters: any) => {
    const queryParams: any = {
      page: 1,
      limit: usersPagination.limit
    };
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        queryParams[key] = value;
      }
    });
    
    getUsers(queryParams);
  }, [getUsers, usersPagination.limit]);
  
  const handleSearchChange = useCallback((search: any) => {
    getUsers({
      page: 1,
      limit: usersPagination.limit,
      search: search.query
    });
  }, [getUsers, usersPagination.limit]);
  
  // ===============================================
  // 🎨 RENDER HELPERS
  // ===============================================
  
  const getRoleColor = useCallback((role: string) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      moderator: 'bg-blue-100 text-blue-800',
      vip: 'bg-purple-100 text-purple-800',
      user: 'bg-gray-100 text-gray-800'
    };
    return colors[role as keyof typeof colors] || colors.user;
  }, []);
  
  const getStatusColor = useCallback((status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      suspended: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || colors.active;
  }, []);
  
  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }, []);
  
  // ===============================================
  // 📊 COLUMNS DEFINITION
  // ===============================================
  
  const columns = useMemo((): Column<User>[] => {
    const baseColumns: Column<User>[] = [
      {
        key: 'id',
        label: 'ID',
        width: '80px',
        sortable: true,
        render: (value) => (
          <span className="font-mono text-xs text-gray-500">#{value}</span>
        )
      },
      {
        key: 'firstName',
        label: 'Nome',
        sortable: true,
        searchable: true,
        render: (value, user) => (
          <div className="flex items-center">
            <div className="flex-shrink-0 h-8 w-8">
              <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-700">
                  {user.firstName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-900">
                {user.firstName} {user.lastName}
              </div>
              {!compactMode && (
                <div className="text-sm text-gray-500">{user.username}</div>
              )}
            </div>
          </div>
        )
      },
      {
        key: 'email',
        label: 'Email',
        sortable: true,
        searchable: true,
        filterable: true,
        render: (value) => (
          <span className="text-sm text-gray-900">{value}</span>
        )
      },
      {
        key: 'role',
        label: 'Role',
        sortable: true,
        filterable: true,
        width: '120px',
        render: (value) => (
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            getRoleColor(value)
          }`}>
            {value.toUpperCase()}
          </span>
        )
      },
      {
        key: 'status',
        label: 'Status',
        sortable: true,
        filterable: true,
        width: '120px',
        render: (value) => (
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            getStatusColor(value)
          }`}>
            {value === 'active' ? 'Ativo' :
             value === 'inactive' ? 'Inativo' :
             value === 'suspended' ? 'Suspenso' :
             value === 'pending' ? 'Pendente' : value}
          </span>
        )
      }
    ];
    
    // Add creation date column if not in compact mode
    if (!compactMode) {
      baseColumns.push({
        key: 'createdAt',
        label: 'Criado em',
        sortable: true,
        width: '120px',
        render: (value) => (
          <span className="text-sm text-gray-500">{formatDate(value)}</span>
        )
      });
    }
    
    return baseColumns;
  }, [compactMode, getRoleColor, getStatusColor, formatDate]);
  
  // ===============================================
  // 🎬 ACTIONS DEFINITION
  // ===============================================
  
  const actions = useMemo(() => {
    if (!showActions) return [];
    
    const actionsList: Array<{
      label: string;
      onClick: (row: User, index: number) => void;
      icon?: React.ReactNode;
      className?: string;
      show?: (row: User) => boolean;
    }> = [];
    
    if (onView) {
      actionsList.push({
        label: 'Ver',
        onClick: (user) => onView(user),
        icon: <EyeIcon className="h-4 w-4" />,
        className: 'text-blue-600 hover:text-blue-900'
      });
    }
    
    if (onEdit) {
      actionsList.push({
        label: 'Editar',
        onClick: (user) => onEdit(user),
        icon: <PencilIcon className="h-4 w-4" />,
        className: 'text-green-600 hover:text-green-900'
      });
    }
    
    if (onPromote) {
      actionsList.push({
        label: 'Promover',
        onClick: (user) => onPromote(user),
        icon: <UserPlusIcon className="h-4 w-4" />,
        className: 'text-purple-600 hover:text-purple-900',
        show: (user: User) => user.role !== 'admin'
      });
    }
    
    if (onDeactivate) {
      actionsList.push({
        label: 'Desativar',
        onClick: (user) => onDeactivate(user),
        icon: <TrashIcon className="h-4 w-4" />,
        className: 'text-red-600 hover:text-red-900',
        show: (user: User) => user.status === 'active'
      });
    }
    
    if (onDelete) {
      actionsList.push({
        label: 'Excluir',
        onClick: (user) => onDelete(user),
        icon: <TrashIcon className="h-4 w-4" />,
        className: 'text-red-600 hover:text-red-900'
      });
    }
    
    return actionsList;
  }, [showActions, onView, onEdit, onPromote, onDeactivate, onDelete]);
  
  // ===============================================
  // 🎨 RENDER
  // ===============================================
  
  return (
    <DataTable<User>
      data={users}
      columns={columns}
      loading={usersLoading}
      error={usersError}
      
      // Pagination
      pagination={{
        page: usersPagination.page,
        limit: usersPagination.limit,
        total: usersPagination.total,
        totalPages: Math.ceil(usersPagination.total / usersPagination.limit),
        hasNext: usersPagination.hasNext,
        hasPrev: usersPagination.hasPrev
      }}
      onPageChange={handlePageChange}
      onLimitChange={handleLimitChange}
      pageSizeOptions={compactMode ? [5, 10, 20] : [10, 20, 50, 100]}
      
      // Sorting
      onSortChange={handleSortChange}
      
      // Filtering
      onFiltersChange={handleFiltersChange}
      
      // Search
      onSearchChange={handleSearchChange}
      searchPlaceholder="Buscar usuários por nome, email..."
      
      // Actions
      actions={actions}
      
      // Selection
      selectable={selectable}
      selectedRows={selectedUsers}
      onSelectionChange={onSelectionChange}
      rowKey="id"
      
      // Styling
      className={className}
      rowClassName={(user) => {
        if (user.status === 'suspended') return 'bg-red-50';
        if (user.status === 'pending') return 'bg-yellow-50';
        if (user.role === 'admin') return 'bg-blue-50';
        return '';
      }}
      
      // Empty state
      emptyMessage="Nenhum usuário encontrado"
      emptyIcon="👥"
    />
  );
};

export default UsersTable;