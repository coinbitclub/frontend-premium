/**
 * 👥 USERS ADAPTER - T6 Implementation
 * Adapter para gerenciamento de usuários (CRUD completo)
 * Baseado nas especificações resolvidas em T5
 */

import httpClient from '../http';
import type { AxiosResponse } from 'axios';

// ===============================================
// 🔧 TYPES
// ===============================================

export interface User {
  id: string | number;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  role: 'user' | 'admin' | 'moderator' | 'vip';
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  tradingActive?: boolean;
  balanceBrl?: number;
  balanceUsd?: number;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  emailVerified?: boolean;
  phoneNumber?: string;
  phoneVerified?: boolean;
  twoFactorEnabled?: boolean;
  avatar?: string;
  metadata?: {
    [key: string]: any;
  };
}

export interface CreateUserRequest {
  email: string;
  username?: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: 'user' | 'admin' | 'moderator' | 'vip';
  phoneNumber?: string;
  metadata?: {
    [key: string]: any;
  };
}

export interface UpdateUserRequest {
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  role?: 'user' | 'admin' | 'moderator' | 'vip';
  status?: 'active' | 'inactive' | 'suspended';
  phoneNumber?: string;
  tradingActive?: boolean;
  metadata?: {
    [key: string]: any;
  };
}

export interface PaginatedUsers {
  data: User[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface UserBalance {
  userId: string | number;
  balances: {
    BRL: number;
    USD: number;
    EUR?: number;
    [currency: string]: number | undefined;
  };
  totalUSD: number;
  totalBRL: number;
  lastUpdate: string;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  newUsersThisMonth: number;
  usersByRole: {
    [role: string]: number;
  };
  usersByStatus: {
    [status: string]: number;
  };
}

// ===============================================
// 👥 USERS ADAPTER
// ===============================================

export class UsersAdapter {
  private readonly basePath = '/api/users';
  private readonly userPath = '/api/user';

  /**
   * 📋 List Users (with pagination)
   * GET /api/users
   */
  async getUsers(options: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
    sort?: string;
    order?: 'asc' | 'desc';
  } = {}): Promise<PaginatedUsers> {
    const params = {
      page: options.page || 1,
      limit: options.limit || 20,
      sort: options.sort || 'createdAt',
      order: options.order || 'desc',
      ...options
    };

    const response: AxiosResponse<PaginatedUsers> = await httpClient.get(
      this.basePath,
      { params }
    );
    return response.data;
  }

  /**
   * ➕ Create User
   * POST /api/users
   */
  async createUser(userData: CreateUserRequest): Promise<{ success: boolean; user: User; message: string }> {
    const response: AxiosResponse<{ success: boolean; user: User; message: string }> = await httpClient.post(
      this.basePath,
      userData
    );
    return response.data;
  }

  /**
   * 👤 Get User by ID
   * GET /api/users/:id
   */
  async getUserById(userId: string | number): Promise<User> {
    const response: AxiosResponse<User> = await httpClient.get(
      `${this.basePath}/${userId}`
    );
    return response.data;
  }

  /**
   * ✏️ Update User
   * PUT /api/users/:id
   */
  async updateUser(
    userId: string | number,
    userData: UpdateUserRequest
  ): Promise<{ success: boolean; user: User; message: string }> {
    const response: AxiosResponse<{ success: boolean; user: User; message: string }> = await httpClient.put(
      `${this.basePath}/${userId}`,
      userData
    );
    return response.data;
  }

  /**
   * 🗑️ Deactivate User (soft delete)
   * DELETE /api/users/:id
   */
  async deactivateUser(userId: string | number): Promise<{ success: boolean; message: string }> {
    const response: AxiosResponse<{ success: boolean; message: string }> = await httpClient.delete(
      `${this.basePath}/${userId}`
    );
    return response.data;
  }

  /**
   * ⬆️ Promote User
   * POST /api/users/:id/promote
   */
  async promoteUser(
    userId: string | number,
    newRole: 'admin' | 'moderator' | 'vip'
  ): Promise<{ success: boolean; user: User; message: string }> {
    const response: AxiosResponse<{ success: boolean; user: User; message: string }> = await httpClient.post(
      `${this.basePath}/${userId}/promote`,
      { role: newRole }
    );
    return response.data;
  }

  /**
   * 💰 Get User Balances
   * GET /api/user/:userId/balances
   */
  async getUserBalances(userId: string | number): Promise<UserBalance> {
    const response: AxiosResponse<UserBalance> = await httpClient.get(
      `${this.userPath}/${userId}/balances`
    );
    return response.data;
  }

  /**
   * 📊 Get User Statistics
   * GET /api/users/stats (admin only)
   */
  async getUserStats(): Promise<UserStats> {
    const response: AxiosResponse<UserStats> = await httpClient.get(
      `${this.basePath}/stats`
    );
    return response.data;
  }

  // ===============================================
  // 🛠️ UTILITY METHODS
  // ===============================================

  /**
   * 🔍 Validate Create User Request
   */
  validateCreateUser(userData: CreateUserRequest): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!userData.email) {
      errors.push('Email é obrigatório');
    } else if (!this.isValidEmail(userData.email)) {
      errors.push('Email inválido');
    }

    if (!userData.password) {
      errors.push('Password é obrigatório');
    } else if (userData.password.length < 6) {
      errors.push('Password deve ter pelo menos 6 caracteres');
    }

    if (userData.username && userData.username.length < 3) {
      errors.push('Username deve ter pelo menos 3 caracteres');
    }

    if (userData.role && !['user', 'admin', 'moderator'].includes(userData.role)) {
      errors.push('Role inválido');
    }

    if (userData.phoneNumber && !this.isValidPhoneNumber(userData.phoneNumber)) {
      errors.push('Número de telefone inválido');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * 🔍 Validate Update User Request
   */
  validateUpdateUser(userData: UpdateUserRequest): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (userData.email && !this.isValidEmail(userData.email)) {
      errors.push('Email inválido');
    }

    if (userData.username && userData.username.length < 3) {
      errors.push('Username deve ter pelo menos 3 caracteres');
    }

    if (userData.role && !['user', 'admin', 'moderator', 'vip'].includes(userData.role)) {
      errors.push('Role inválido');
    }

    if (userData.status && !['active', 'inactive', 'suspended'].includes(userData.status)) {
      errors.push('Status inválido');
    }

    if (userData.phoneNumber && !this.isValidPhoneNumber(userData.phoneNumber)) {
      errors.push('Número de telefone inválido');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * 📧 Validate Email Format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * 📱 Validate Phone Number
   */
  private isValidPhoneNumber(phone: string): boolean {
    // Formato brasileiro: +55 (11) 99999-9999 ou variações
    const phoneRegex = /^\+?55\s?\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  /**
   * 🎭 Get Role Display Name
   */
  getRoleDisplayName(role: string): string {
    const roleNames = {
      user: 'Usuário',
      admin: 'Administrador',
      moderator: 'Moderador',
      vip: 'VIP'
    };
    return roleNames[role as keyof typeof roleNames] || role;
  }

  /**
   * 🚦 Get Status Display Name
   */
  getStatusDisplayName(status: string): string {
    const statusNames = {
      active: 'Ativo',
      inactive: 'Inativo',
      suspended: 'Suspenso',
      pending: 'Pendente'
    };
    return statusNames[status as keyof typeof statusNames] || status;
  }

  /**
   * 🎨 Get Status Color
   */
  getStatusColor(status: string): string {
    const statusColors = {
      active: 'green',
      inactive: 'gray',
      suspended: 'red',
      pending: 'yellow'
    };
    return statusColors[status as keyof typeof statusColors] || 'gray';
  }

  /**
   * 🔢 Format User Display Name
   */
  formatUserDisplayName(user: User): string {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.name) {
      return user.name;
    }
    if (user.username) {
      return user.username;
    }
    return user.email;
  }

  /**
   * 🕒 Format Last Login
   */
  formatLastLogin(lastLogin?: string): string {
    if (!lastLogin) return 'Nunca';
    
    const date = new Date(lastLogin);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays} dias atrás`;
    
    return date.toLocaleDateString('pt-BR');
  }

  /**
   * 🔍 Search Users (client-side filter)
   */
  searchUsers(users: User[], query: string): User[] {
    if (!query.trim()) return users;
    
    const searchTerm = query.toLowerCase();
    return users.filter(user => 
      user.email.toLowerCase().includes(searchTerm) ||
      user.username?.toLowerCase().includes(searchTerm) ||
      user.firstName?.toLowerCase().includes(searchTerm) ||
      user.lastName?.toLowerCase().includes(searchTerm) ||
      user.name?.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * 📊 Calculate User Activity Score
   */
  calculateActivityScore(user: User): number {
    let score = 0;
    
    // Status ativo
    if (user.status === 'active') score += 30;
    
    // Email verificado
    if (user.emailVerified) score += 20;
    
    // Trading ativo
    if (user.tradingActive) score += 25;
    
    // Login recente (últimos 7 dias)
    if (user.lastLogin) {
      const daysSinceLogin = Math.floor(
        (Date.now() - new Date(user.lastLogin).getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysSinceLogin <= 7) score += 25;
    }
    
    return Math.min(score, 100);
  }
}

// ===============================================
// 🔄 SINGLETON EXPORT
// ===============================================

export const usersAdapter = new UsersAdapter();
export default usersAdapter;