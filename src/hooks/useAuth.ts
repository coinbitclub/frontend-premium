/**
 * 🔐 USE AUTH HOOK - T7 Implementation
 * Hook para gerenciamento de autenticação (login, refresh, 2FA, profile)
 * Baseado no AuthAdapter implementado em T6
 */

import { useState, useEffect, useCallback } from 'react';
import { authAdapter } from '../lib/api/adapters';
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  UserProfile,
  Setup2FARequest,
  Setup2FAResponse
} from '../lib/api/adapters';

// ===============================================
// 🔧 TYPES
// ===============================================

export interface UseAuthReturn {
  // Authentication State
  isAuthenticated: boolean;
  user: UserProfile | null;
  accessToken: string | null;
  refreshToken: string | null;
  
  // Login
  loginLoading: boolean;
  loginError: string | null;
  login: (credentials: LoginRequest) => Promise<boolean>;
  
  // Logout
  logoutLoading: boolean;
  logoutError: string | null;
  logout: () => Promise<void>;
  
  // Profile
  profileLoading: boolean;
  profileError: string | null;
  getProfile: () => Promise<void>;
  
  // Token Refresh
  refreshLoading: boolean;
  refreshError: string | null;
  refreshAccessToken: () => Promise<boolean>;
  
  // 2FA
  twoFactorLoading: boolean;
  twoFactorError: string | null;
  setup2FA: (request: Setup2FARequest) => Promise<Setup2FAResponse | null>;
  
  // Utilities
  isTokenExpired: (token?: string) => boolean;
  clearAuth: () => void;
}

// ===============================================
// 🔐 USE AUTH HOOK
// ===============================================

export const useAuth = (): UseAuthReturn => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  
  // Login State
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  // Logout State
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  
  // Profile State
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  
  // Refresh State
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);
  
  // 2FA State
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);
  const [twoFactorError, setTwoFactorError] = useState<string | null>(null);

  // ===============================================
  // 💾 LOCAL STORAGE HELPERS
  // ===============================================

  const saveTokensToStorage = (tokens: { accessToken: string; refreshToken: string }) => {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  };

  const loadTokensFromStorage = () => {
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    
    if (storedAccessToken && storedRefreshToken) {
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
      return { accessToken: storedAccessToken, refreshToken: storedRefreshToken };
    }
    
    return null;
  };

  const clearTokensFromStorage = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  // ===============================================
  // 🔑 LOGIN
  // ===============================================

  const login = useCallback(async (credentials: LoginRequest): Promise<boolean> => {
    try {
      setLoginLoading(true);
      setLoginError(null);
      
      // Validate credentials
      const validation = authAdapter.validateCredentials(credentials);
      if (!validation.valid) {
        setLoginError(validation.errors.join(', '));
        return false;
      }
      
      const loginResult = await authAdapter.login(credentials);
      
      if (loginResult.success) {
        // Save tokens
        setAccessToken(loginResult.accessToken);
        setRefreshToken(loginResult.refreshToken);
        saveTokensToStorage({
          accessToken: loginResult.accessToken,
          refreshToken: loginResult.refreshToken
        });
        
        // Set user data
        setUser(loginResult.user);
        setIsAuthenticated(true);
        
        return true;
      } else {
        setLoginError('Login falhou');
        return false;
      }
    } catch (error: any) {
      setLoginError(error.message || 'Erro ao fazer login');
      console.error('Login error:', error);
      return false;
    } finally {
      setLoginLoading(false);
    }
  }, []);

  // ===============================================
  // 🚪 LOGOUT
  // ===============================================

  const logout = useCallback(async (): Promise<void> => {
    try {
      setLogoutLoading(true);
      setLogoutError(null);
      
      // Call logout endpoint
      await authAdapter.logout();
    } catch (error: any) {
      setLogoutError(error.message || 'Erro ao fazer logout');
      console.error('Logout error:', error);
    } finally {
      // Clear auth state regardless of API call result
      clearAuth();
      setLogoutLoading(false);
    }
  }, []);

  // ===============================================
  // 👤 GET PROFILE
  // ===============================================

  const getProfile = useCallback(async (): Promise<void> => {
    try {
      setProfileLoading(true);
      setProfileError(null);
      
      const profileData = await authAdapter.getProfile();
      setUser(profileData);
    } catch (error: any) {
      setProfileError(error.message || 'Erro ao obter perfil');
      console.error('Profile error:', error);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  // ===============================================
  // 🔄 REFRESH TOKEN
  // ===============================================

  const refreshAccessToken = useCallback(async (): Promise<boolean> => {
    try {
      setRefreshLoading(true);
      setRefreshError(null);
      
      if (!refreshToken) {
        setRefreshError('Refresh token não disponível');
        return false;
      }
      
      const refreshResult = await authAdapter.refreshToken({ refreshToken });
      
      if (refreshResult.success) {
        setAccessToken(refreshResult.accessToken);
        
        // Update refresh token if provided
        if (refreshResult.refreshToken) {
          setRefreshToken(refreshResult.refreshToken);
        }
        
        // Save updated tokens
        saveTokensToStorage({
          accessToken: refreshResult.accessToken,
          refreshToken: refreshResult.refreshToken || refreshToken
        });
        
        return true;
      } else {
        setRefreshError('Falha ao renovar token');
        return false;
      }
    } catch (error: any) {
      setRefreshError(error.message || 'Erro ao renovar token');
      console.error('Refresh token error:', error);
      return false;
    } finally {
      setRefreshLoading(false);
    }
  }, [refreshToken]);

  // ===============================================
  // 🔐 2FA SETUP
  // ===============================================

  const setup2FA = useCallback(async (request: Setup2FARequest): Promise<Setup2FAResponse | null> => {
    try {
      setTwoFactorLoading(true);
      setTwoFactorError(null);
      
      const result = await authAdapter.setup2FA(request);
      return result;
    } catch (error: any) {
      setTwoFactorError(error.message || 'Erro ao configurar 2FA');
      console.error('2FA setup error:', error);
      return null;
    } finally {
      setTwoFactorLoading(false);
    }
  }, []);

  // ===============================================
  // 🛠️ UTILITIES
  // ===============================================

  const isTokenExpired = useCallback((token?: string): boolean => {
    const tokenToCheck = token || accessToken;
    if (!tokenToCheck) return true;
    
    return authAdapter.isTokenExpired(tokenToCheck);
  }, [accessToken]);

  const clearAuth = useCallback((): void => {
    setIsAuthenticated(false);
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    clearTokensFromStorage();
  }, []);

  // ===============================================
  // 🚀 INITIALIZATION
  // ===============================================

  useEffect(() => {
    // Load tokens from storage on mount
    const tokens = loadTokensFromStorage();
    
    if (tokens && !isTokenExpired(tokens.accessToken)) {
      setIsAuthenticated(true);
      
      // Try to get user profile
      getProfile().catch(() => {
        // If profile fetch fails, clear auth
        clearAuth();
      });
    } else if (tokens && tokens.refreshToken) {
      // Try to refresh token
      refreshAccessToken().then((success) => {
        if (success) {
          setIsAuthenticated(true);
          getProfile();
        } else {
          clearAuth();
        }
      });
    }
  }, []);

  // ===============================================
  // 📤 RETURN
  // ===============================================

  return {
    // Authentication State
    isAuthenticated,
    user,
    accessToken,
    refreshToken,
    
    // Login
    loginLoading,
    loginError,
    login,
    
    // Logout
    logoutLoading,
    logoutError,
    logout,
    
    // Profile
    profileLoading,
    profileError,
    getProfile,
    
    // Token Refresh
    refreshLoading,
    refreshError,
    refreshAccessToken,
    
    // 2FA
    twoFactorLoading,
    twoFactorError,
    setup2FA,
    
    // Utilities
    isTokenExpired,
    clearAuth
  };
};

export default useAuth;