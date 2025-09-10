/**
 * 👥 USE USERS HOOK - T7 Implementation
 * Hook para gerenciamento de usuários (CRUD completo)
 * Baseado no UsersAdapter implementado em T6
 */

import { useState, useEffect, useCallback } from 'react';
import { usersAdapter } from '../lib/api/adapters';
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  PaginatedUsers,
  UserStats
} from '../lib/api/adapters';
import type { UserBalance as UsersUserBalance } from '../lib/api/adapters/users.adapter';

// ===============================================
// 🔧 TYPES
// ===============================================

export interface UseUsersReturn {
  // Users List
  users: User[];
  usersLoading: boolean;
  usersError: string | null;
  usersPagination: {
    total: number;
    page: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  getUsers: (options?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
    sort?: string;
    order?: 'asc' | 'desc';
  }) => Promise<void>;
  
  // Single User
  currentUser: User | null;
  userLoading: boolean;
  userError: string | null;
  getUserById: (userId: string | number) => Promise<void>;
  
  // Create User
  createLoading: boolean;
  createError: string | null;
  createUser: (userData: CreateUserRequest) => Promise<User | null>;
  
  // Update User
  updateLoading: boolean;
  updateError: string | null;
  updateUser: (userId: string | number, userData: UpdateUserRequest) => Promise<User | null>;
  
  // Deactivate User
  deactivateLoading: boolean;
  deactivateError: string | null;
  deactivateUser: (userId: string | number) => Promise<boolean>;
  
  // Promote User
  promoteLoading: boolean;
  promoteError: string | null;
  promoteUser: (userId: string | number, newRole: 'admin' | 'moderator' | 'vip') => Promise<User | null>;
  
  // User Balance
  userBalance: UsersUserBalance | null;
  balanceLoading: boolean;
  balanceError: string | null;
  getUserBalance: (userId: string | number) => Promise<void>;
  
  // User Stats
  userStats: UserStats | null;
  statsLoading: boolean;
  statsError: string | null;
  getUserStats: () => Promise<void>;
  
  // Utilities
  validateCreateUser: (userData: CreateUserRequest) => { valid: boolean; errors: string[] };
  validateUpdateUser: (userData: UpdateUserRequest) => { valid: boolean; errors: string[] };
  formatUserDisplayName: (user: User) => string;
  searchUsers: (users: User[], query: string) => User[];
  refetchAll: () => Promise<void>;
}

// ===============================================
// 👥 USE USERS HOOK
// ===============================================

export const useUsers = (): UseUsersReturn => {
  // Users List State
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [usersPagination, setUsersPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    hasNext: false,
    hasPrev: false
  });
  
  // Single User State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);
  
  // Create User State
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  
  // Update User State
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  
  // Deactivate User State
  const [deactivateLoading, setDeactivateLoading] = useState(false);
  const [deactivateError, setDeactivateError] = useState<string | null>(null);
  
  // Promote User State
  const [promoteLoading, setPromoteLoading] = useState(false);
  const [promoteError, setPromoteError] = useState<string | null>(null);
  
  // User Balance State
  const [userBalance, setUserBalance] = useState<UsersUserBalance | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [balanceError, setBalanceError] = useState<string | null>(null);
  
  // User Stats State
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);

  // ===============================================
  // 📋 GET USERS LIST
  // ===============================================

  const getUsers = useCallback(async (options: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
    sort?: string;
    order?: 'asc' | 'desc';
  } = {}): Promise<void> => {
    try {
      setUsersLoading(true);
      setUsersError(null);
      
      const usersData = await usersAdapter.getUsers(options);
      
      setUsers(usersData.data);
      setUsersPagination({
        total: usersData.total,
        page: usersData.page,
        limit: usersData.limit,
        hasNext: usersData.hasNext,
        hasPrev: usersData.hasPrev
      });
    } catch (error: any) {
      setUsersError(error.message || 'Erro ao obter usuários');
      console.error('Users error:', error);
    } finally {
      setUsersLoading(false);
    }
  }, []);

  // ===============================================
  // 👤 GET USER BY ID
  // ===============================================

  const getUserById = useCallback(async (userId: string | number): Promise<void> => {
    try {
      setUserLoading(true);
      setUserError(null);
      
      const userData = await usersAdapter.getUserById(userId);
      setCurrentUser(userData);
    } catch (error: any) {
      setUserError(error.message || 'Erro ao obter usuário');
      console.error('User error:', error);
    } finally {
      setUserLoading(false);
    }
  }, []);

  // ===============================================
  // ➕ CREATE USER
  // ===============================================

  const createUser = useCallback(async (userData: CreateUserRequest): Promise<User | null> => {
    try {
      setCreateLoading(true);
      setCreateError(null);
      
      // Validate user data
      const validation = usersAdapter.validateCreateUser(userData);
      if (!validation.valid) {
        setCreateError(validation.errors.join(', '));
        return null;
      }
      
      const result = await usersAdapter.createUser(userData);
      
      if (result.success) {
        // Add new user to local state
        setUsers(prev => [result.user, ...prev]);
        return result.user;
      } else {
        setCreateError(result.message || 'Erro ao criar usuário');
        return null;
      }
    } catch (error: any) {
      setCreateError(error.message || 'Erro ao criar usuário');
      console.error('Create user error:', error);
      return null;
    } finally {
      setCreateLoading(false);
    }
  }, []);

  // ===============================================
  // ✏️ UPDATE USER
  // ===============================================

  const updateUser = useCallback(async (
    userId: string | number,
    userData: UpdateUserRequest
  ): Promise<User | null> => {
    try {
      setUpdateLoading(true);
      setUpdateError(null);
      
      // Validate user data
      const validation = usersAdapter.validateUpdateUser(userData);
      if (!validation.valid) {
        setUpdateError(validation.errors.join(', '));
        return null;
      }
      
      const result = await usersAdapter.updateUser(userId, userData);
      
      if (result.success) {
        // Update user in local state
        setUsers(prev => prev.map(user => 
          user.id === userId ? result.user : user
        ));
        
        // Update current user if it's the same
        if (currentUser?.id === userId) {
          setCurrentUser(result.user);
        }
        
        return result.user;
      } else {
        setUpdateError(result.message || 'Erro ao atualizar usuário');
        return null;
      }
    } catch (error: any) {
      setUpdateError(error.message || 'Erro ao atualizar usuário');
      console.error('Update user error:', error);
      return null;
    } finally {
      setUpdateLoading(false);
    }
  }, [currentUser]);

  // ===============================================
  // 🗑️ DEACTIVATE USER
  // ===============================================

  const deactivateUser = useCallback(async (userId: string | number): Promise<boolean> => {
    try {
      setDeactivateLoading(true);
      setDeactivateError(null);
      
      const result = await usersAdapter.deactivateUser(userId);
      
      if (result.success) {
        // Update user status in local state
        setUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, status: 'inactive' } : user
        ));
        
        return true;
      } else {
        setDeactivateError(result.message || 'Erro ao desativar usuário');
        return false;
      }
    } catch (error: any) {
      setDeactivateError(error.message || 'Erro ao desativar usuário');
      console.error('Deactivate user error:', error);
      return false;
    } finally {
      setDeactivateLoading(false);
    }
  }, []);

  // ===============================================
  // ⬆️ PROMOTE USER
  // ===============================================

  const promoteUser = useCallback(async (
    userId: string | number,
    newRole: 'admin' | 'moderator' | 'vip'
  ): Promise<User | null> => {
    try {
      setPromoteLoading(true);
      setPromoteError(null);
      
      const result = await usersAdapter.promoteUser(userId, newRole);
      
      if (result.success) {
        // Update user in local state
        setUsers(prev => prev.map(user => 
          user.id === userId ? result.user : user
        ));
        
        return result.user;
      } else {
        setPromoteError(result.message || 'Erro ao promover usuário');
        return null;
      }
    } catch (error: any) {
      setPromoteError(error.message || 'Erro ao promover usuário');
      console.error('Promote user error:', error);
      return null;
    } finally {
      setPromoteLoading(false);
    }
  }, []);

  // ===============================================
  // 💰 GET USER BALANCE
  // ===============================================

  const getUserBalance = useCallback(async (userId: string | number): Promise<void> => {
    try {
      setBalanceLoading(true);
      setBalanceError(null);
      
      const balanceData = await usersAdapter.getUserBalances(userId);
      setUserBalance(balanceData);
    } catch (error: any) {
      setBalanceError(error.message || 'Erro ao obter saldo do usuário');
      console.error('User balance error:', error);
    } finally {
      setBalanceLoading(false);
    }
  }, []);

  // ===============================================
  // 📊 GET USER STATS
  // ===============================================

  const getUserStats = useCallback(async (): Promise<void> => {
    try {
      setStatsLoading(true);
      setStatsError(null);
      
      const statsData = await usersAdapter.getUserStats();
      setUserStats(statsData);
    } catch (error: any) {
      setStatsError(error.message || 'Erro ao obter estatísticas');
      console.error('User stats error:', error);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // ===============================================
  // 🛠️ UTILITIES
  // ===============================================

  const validateCreateUser = useCallback((userData: CreateUserRequest): { valid: boolean; errors: string[] } => {
    return usersAdapter.validateCreateUser(userData);
  }, []);

  const validateUpdateUser = useCallback((userData: UpdateUserRequest): { valid: boolean; errors: string[] } => {
    return usersAdapter.validateUpdateUser(userData);
  }, []);

  const formatUserDisplayName = useCallback((user: User): string => {
    return usersAdapter.formatUserDisplayName(user);
  }, []);

  const searchUsers = useCallback((users: User[], query: string): User[] => {
    return usersAdapter.searchUsers(users, query);
  }, []);

  const refetchAll = useCallback(async (): Promise<void> => {
    await Promise.allSettled([
      getUsers(),
      getUserStats()
    ]);
  }, [getUsers, getUserStats]);

  // ===============================================
  // 🚀 AUTO FETCH ON MOUNT
  // ===============================================

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // ===============================================
  // 📤 RETURN
  // ===============================================

  return {
    // Users List
    users,
    usersLoading,
    usersError,
    usersPagination,
    getUsers,
    
    // Single User
    currentUser,
    userLoading,
    userError,
    getUserById,
    
    // Create User
    createLoading,
    createError,
    createUser,
    
    // Update User
    updateLoading,
    updateError,
    updateUser,
    
    // Deactivate User
    deactivateLoading,
    deactivateError,
    deactivateUser,
    
    // Promote User
    promoteLoading,
    promoteError,
    promoteUser,
    
    // User Balance
    userBalance,
    balanceLoading,
    balanceError,
    getUserBalance,
    
    // User Stats
    userStats,
    statsLoading,
    statsError,
    getUserStats,
    
    // Utilities
    validateCreateUser,
    validateUpdateUser,
    formatUserDisplayName,
    searchUsers,
    refetchAll
  };
};

export default useUsers;