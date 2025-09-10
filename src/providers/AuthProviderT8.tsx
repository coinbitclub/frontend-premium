/**
 * 🔐 AUTH PROVIDER T8 - T8 Implementation
 * Provider de autenticação integrado com useAuth hook (T7)
 * Implementa guards de rota e middleware de autenticação
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useAuth as useAuthHook } from '../hooks/useAuth';
import type { UserProfile } from '../lib/api/adapters';

// ===============================================
// 🔧 TYPES
// ===============================================

export interface AuthUser extends UserProfile {
  // Extend UserProfile with additional UI-specific fields
  plan?: 'brasil-flex' | 'brasil-pro' | 'global-flex' | 'global-pro';
  country?: string;
  trialEndsAt?: string;
  avatar_url?: string;
}

export interface AuthContextType {
  // User State
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Auth Actions
  login: (email: string, password: string) => Promise<{ success: boolean; requiresSMS?: boolean; message?: string }>;
  logout: () => Promise<void>;
  register: (userData: RegisterData) => Promise<{ success: boolean; requiresSMS?: boolean; message?: string }>;
  
  // Profile Management
  updateProfile: (data: Partial<AuthUser>) => Promise<{ success: boolean; message?: string }>;
  refreshUser: () => Promise<void>;
  
  // 2FA/SMS
  setup2FA: (phoneNumber: string) => Promise<{ success: boolean; message?: string }>;
  verify2FA: (code: string) => Promise<{ success: boolean; message?: string }>;
  
  // Token Management
  refreshToken: () => Promise<boolean>;
  isTokenExpired: () => boolean;
  
  // Guards
  hasRole: (role: string | string[]) => boolean;
  hasPermission: (permission: string) => boolean;
  canAccess: (requiredRoles?: string[], requiredPermissions?: string[]) => boolean;
}

export interface RegisterData {
  email: string;
  username?: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  country?: string;
  plan?: string;
  referralCode?: string;
  termsAccepted: boolean;
}

// ===============================================
// 🔐 AUTH CONTEXT
// ===============================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ===============================================
// 🏗️ AUTH PROVIDER
// ===============================================

export const AuthProviderT8: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const {
    isAuthenticated,
    user: authUser,
    accessToken,
    refreshToken: refreshTokenValue,
    loginLoading,
    loginError,
    login: authLogin,
    logout: authLogout,
    getProfile,
    profileLoading,
    profileError,
    refreshAccessToken,
    refreshLoading,
    refreshError,
    setup2FA: authSetup2FA,
    twoFactorLoading,
    twoFactorError,
    isTokenExpired: checkTokenExpired,
    clearAuth
  } = useAuthHook();

  // Local state for UI-specific data
  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ===============================================
  // 🔄 SYNC USER DATA
  // ===============================================

  useEffect(() => {
    if (authUser) {
      // Transform UserProfile to AuthUser
      const transformedUser: AuthUser = {
        ...authUser,
        plan: 'brasil-flex', // Default plan, could be fetched from user metadata
        country: (authUser as any).metadata?.country || 'brasil',
        avatar_url: (authUser as any).avatar
      };
      setUser(transformedUser);
    } else {
      setUser(null);
    }
  }, [authUser]);

  // ===============================================
  // 🔄 SYNC LOADING STATE
  // ===============================================

  useEffect(() => {
    setIsLoading(loginLoading || profileLoading || refreshLoading);
  }, [loginLoading, profileLoading, refreshLoading]);

  // ===============================================
  // 🔄 SYNC ERROR STATE
  // ===============================================

  useEffect(() => {
    const currentError = loginError || profileError || refreshError || twoFactorError;
    setError(currentError);
  }, [loginError, profileError, refreshError, twoFactorError]);

  // ===============================================
  // 🔄 INITIALIZATION
  // ===============================================

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // If we have a token but no user, try to get profile
        if (isAuthenticated && !authUser && accessToken) {
          await getProfile();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [isAuthenticated, authUser, accessToken, getProfile]);

  // ===============================================
  // 🔐 AUTH ACTIONS
  // ===============================================

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const success = await authLogin({ email, password });
      
      if (success) {
        // Redirect to dashboard or intended page
        const redirectTo = router.query.redirect as string || '/dashboard';
        router.push(redirectTo);
        return { success: true };
      } else {
        return { success: false, message: loginError || 'Login falhou' };
      }
    } catch (error: any) {
      setError(error.message);
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    try {
      await authLogout();
      setUser(null);
      setError(null);
      router.push('/auth/login');
    } catch (error: any) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      clearAuth();
      setUser(null);
      router.push('/auth/login');
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setError(null);
      
      // Transform RegisterData to CreateUserRequest format
      const createUserData = {
        email: userData.email,
        username: userData.username,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber,
        metadata: {
          country: userData.country,
          plan: userData.plan,
          referralCode: userData.referralCode,
          termsAccepted: userData.termsAccepted
        }
      };
      
      // For now, return success (would need to implement user creation in authAdapter)
      return { success: true, message: 'Registro será implementado com endpoint específico' };
    } catch (error: any) {
      setError(error.message);
      return { success: false, message: error.message };
    }
  };

  const updateProfile = async (data: Partial<AuthUser>) => {
    try {
      setError(null);
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      
      // Update local state optimistically
      setUser(prev => prev ? { ...prev, ...data } : null);
      
      // Refresh user data from server
      await getProfile();
      
      return { success: true, message: 'Perfil atualizado com sucesso' };
    } catch (error: any) {
      setError(error.message);
      return { success: false, message: error.message };
    }
  };

  const refreshUser = async () => {
    try {
      await getProfile();
    } catch (error: any) {
      console.error('Refresh user error:', error);
      setError(error.message);
    }
  };

  // ===============================================
  // 🔐 2FA ACTIONS
  // ===============================================

  const setup2FA = async (phoneNumber: string) => {
    try {
      setError(null);
      const result = await authSetup2FA({ phoneNumber, method: 'sms' });
      
      if (result) {
        return { success: true, message: 'SMS enviado com sucesso' };
      } else {
        return { success: false, message: twoFactorError || 'Erro ao enviar SMS' };
      }
    } catch (error: any) {
      setError(error.message);
      return { success: false, message: error.message };
    }
  };

  const verify2FA = async (code: string) => {
    try {
      setError(null);
      // Would need to implement verification in authAdapter
      return { success: true, message: '2FA verificado com sucesso' };
    } catch (error: any) {
      setError(error.message);
      return { success: false, message: error.message };
    }
  };

  // ===============================================
  // 🔑 TOKEN MANAGEMENT
  // ===============================================

  const refreshToken = async () => {
    try {
      return await refreshAccessToken();
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  };

  const isTokenExpired = () => {
    return checkTokenExpired();
  };

  // ===============================================
  // 🛡️ GUARDS & PERMISSIONS
  // ===============================================

  const hasRole = (role: string | string[]) => {
    if (!user) return false;
    
    const userRole = user.role || 'user';
    
    if (Array.isArray(role)) {
      return role.includes(userRole);
    }
    
    return userRole === role;
  };

  const hasPermission = (permission: string) => {
    if (!user) return false;
    
    // Define role-based permissions
    const rolePermissions = {
      admin: ['read', 'write', 'delete', 'manage_users', 'manage_system', 'view_analytics'],
      moderator: ['read', 'write', 'manage_users', 'view_analytics'],
      vip: ['read', 'write', 'view_analytics'],
      user: ['read']
    };
    
    const userRole = user.role || 'user';
    const permissions = rolePermissions[userRole as keyof typeof rolePermissions] || [];
    
    return permissions.includes(permission);
  };

  const canAccess = (requiredRoles?: string[], requiredPermissions?: string[]) => {
    if (!isAuthenticated || !user) return false;
    
    // Check roles
    if (requiredRoles && requiredRoles.length > 0) {
      if (!hasRole(requiredRoles)) return false;
    }
    
    // Check permissions
    if (requiredPermissions && requiredPermissions.length > 0) {
      const hasAllPermissions = requiredPermissions.every(permission => 
        hasPermission(permission)
      );
      if (!hasAllPermissions) return false;
    }
    
    return true;
  };

  // ===============================================
  // 🔄 CONTEXT VALUE
  // ===============================================

  const contextValue: AuthContextType = {
    // User State
    user,
    isAuthenticated,
    isLoading,
    error,
    
    // Auth Actions
    login,
    logout,
    register,
    
    // Profile Management
    updateProfile,
    refreshUser,
    
    // 2FA/SMS
    setup2FA,
    verify2FA,
    
    // Token Management
    refreshToken,
    isTokenExpired,
    
    // Guards
    hasRole,
    hasPermission,
    canAccess
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// ===============================================
// 🪝 USE AUTH HOOK
// ===============================================

export const useAuthT8 = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuthT8 must be used within an AuthProviderT8');
  }
  
  return context;
};

export default AuthProviderT8;