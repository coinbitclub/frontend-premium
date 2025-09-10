/**
 * 🔐 AUTH ADAPTER - T6 Implementation
 * Adapter para autenticação (login, refresh, 2FA, profile)
 * Baseado nas especificações resolvidas em T5
 */

import httpClient from '../http';
import type { AxiosResponse } from 'axios';

// ===============================================
// 🔧 TYPES
// ===============================================

export interface LoginRequest {
  email?: string;
  username?: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: {
    id: string | number;
    email: string;
    username?: string;
    name?: string;
    role?: string;
  };
  expiresIn: number; // 1h = 3600s
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}

export interface UserProfile {
  id: string | number;
  email: string;
  username?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  createdAt?: string;
  lastLogin?: string;
  twoFactorEnabled?: boolean;
}

export interface Setup2FARequest {
  method: 'sms';
  phoneNumber?: string;
}

export interface Setup2FAResponse {
  success: boolean;
  method: string;
  qrCode?: string;
  backupCodes?: string[];
  message: string;
}

export interface AuthError {
  success: false;
  error: string;
  code?: string;
}

// ===============================================
// 🔐 AUTH ADAPTER
// ===============================================

export class AuthAdapter {
  private readonly basePath = '/api/auth';
  private readonly enterprisePath = '/api/enterprise/auth';

  /**
   * 🔑 User Login
   * POST /api/auth/login
   * Aceita email/username + password
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // Validar que pelo menos email ou username foi fornecido
    if (!credentials.email && !credentials.username) {
      throw new Error('Email ou username é obrigatório');
    }

    const response: AxiosResponse<LoginResponse> = await httpClient.post(
      `${this.basePath}/login`,
      credentials
    );
    return response.data;
  }

  /**
   * 🔄 Refresh Token
   * POST /api/auth/refresh
   * Renovar access token usando refresh token
   */
  async refreshToken(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const response: AxiosResponse<RefreshTokenResponse> = await httpClient.post(
      `${this.basePath}/refresh`,
      request
    );
    return response.data;
  }

  /**
   * 🚪 Logout
   * POST /api/auth/logout
   */
  async logout(): Promise<{ success: boolean; message: string }> {
    const response: AxiosResponse<{ success: boolean; message: string }> = await httpClient.post(
      `${this.basePath}/logout`
    );
    return response.data;
  }

  /**
   * 👤 Get User Profile
   * GET /api/auth/profile
   */
  async getProfile(): Promise<UserProfile> {
    const response: AxiosResponse<UserProfile> = await httpClient.get(
      `${this.basePath}/profile`
    );
    return response.data;
  }

  /**
   * 🔐 Setup 2FA
   * POST /api/enterprise/auth/2fa/setup
   * Configurar autenticação de dois fatores (SMS)
   */
  async setup2FA(request: Setup2FARequest): Promise<Setup2FAResponse> {
    const response: AxiosResponse<Setup2FAResponse> = await httpClient.post(
      `${this.enterprisePath}/2fa/setup`,
      request
    );
    return response.data;
  }

  /**
   * 📱 Generate 2FA Backup Codes
   * POST /api/enterprise/auth/2fa/backup-codes
   */
  async generate2FABackupCodes(): Promise<{ success: boolean; backupCodes: string[] }> {
    const response: AxiosResponse<{ success: boolean; backupCodes: string[] }> = await httpClient.post(
      `${this.enterprisePath}/2fa/backup-codes`
    );
    return response.data;
  }

  /**
   * 📲 Send SMS 2FA
   * POST /api/enterprise/auth/2fa/sms
   */
  async sendSMS2FA(phoneNumber: string): Promise<{ success: boolean; message: string }> {
    const response: AxiosResponse<{ success: boolean; message: string }> = await httpClient.post(
      `${this.enterprisePath}/2fa/sms`,
      { phoneNumber }
    );
    return response.data;
  }

  // ===============================================
  // 🛠️ UTILITY METHODS
  // ===============================================

  /**
   * 🔍 Validate Login Credentials
   */
  validateCredentials(credentials: LoginRequest): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!credentials.email && !credentials.username) {
      errors.push('Email ou username é obrigatório');
    }

    if (!credentials.password) {
      errors.push('Password é obrigatório');
    } else if (credentials.password.length < 6) {
      errors.push('Password deve ter pelo menos 6 caracteres');
    }

    if (credentials.email && !this.isValidEmail(credentials.email)) {
      errors.push('Email inválido');
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
   * 🕒 Check if Token is Expired
   */
  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch {
      return true; // Se não conseguir decodificar, considerar expirado
    }
  }

  /**
   * 🔑 Extract User Info from Token
   */
  getUserFromToken(token: string): Partial<UserProfile> | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.sub || payload.userId,
        email: payload.email,
        username: payload.username,
        name: payload.name,
        role: payload.role
      };
    } catch {
      return null;
    }
  }
}

// ===============================================
// 🔄 SINGLETON EXPORT
// ===============================================

export const authAdapter = new AuthAdapter();
export default authAdapter;