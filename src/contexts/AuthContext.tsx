/**
 * 🔐 AUTHENTICATION CONTEXT - REACT CONTEXT
 * Contexto de autenticação para gerenciar estado global do usuário
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import authService, { User } from '../services/authService';

interface AuthContextType {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Authentication methods
  login: (email: string, password: string, twoFactorCode?: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  
  // User methods
  getProfile: () => Promise<void>;
  updateProfile: (data: Partial<User>) => void;
  
  // Permission checks
  hasPermission: (permission: string) => boolean;
  isAdmin: () => boolean;
  isUserType: (userType: string) => boolean;
  isTradingEnabled: () => boolean;
  isTwoFactorEnabled: () => boolean;
  
  // 2FA methods
  setupTwoFactor: () => Promise<any>;
  verifyTwoFactor: (token: string, secret: string) => Promise<void>;
  
  // Password methods
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  
  // Session methods
  getActiveSessions: () => Promise<any>;
  logoutAllSessions: () => Promise<void>;
  validateToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize authentication state
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      
      // Check if user is already authenticated
      if (authService.isAuthenticated()) {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
          
          // Validate token with server
          const isValid = await authService.validateToken();
          if (!isValid) {
            await logout();
          }
        }
      }
    } catch (error) {
      console.error('❌ Auth initialization error:', error);
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string, twoFactorCode?: string) => {
    try {
      setIsLoading(true);
      const response = await authService.login(email, password, twoFactorCode);
      
      if (response.success) {
        setUser(response.user);
        setIsAuthenticated(true);
      } else if (response.requiresTwoFactor) {
        // Return the response so the component can handle 2FA
        throw new Error('2FA_REQUIRED');
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    try {
      setIsLoading(true);
      await authService.register(userData);
    } catch (error) {
      console.error('❌ Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Even if logout fails on server, clear local state
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const success = await authService.refreshAccessToken();
      if (success) {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
        }
      } else {
        await logout();
      }
      return success;
    } catch (error) {
      console.error('❌ Token refresh error:', error);
      await logout();
      return false;
    }
  };

  const getProfile = async () => {
    try {
      setIsLoading(true);
      const userProfile = await authService.getProfile();
      setUser(userProfile);
    } catch (error) {
      console.error('❌ Get profile error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
    }
  };

  const hasPermission = (permission: string): boolean => {
    return authService.hasPermission(permission);
  };

  const isAdmin = (): boolean => {
    return authService.isAdmin();
  };

  const isUserType = (userType: string): boolean => {
    return authService.isUserType(userType);
  };

  const isTradingEnabled = (): boolean => {
    return authService.isTradingEnabled();
  };

  const isTwoFactorEnabled = (): boolean => {
    return authService.isTwoFactorEnabled();
  };

  const setupTwoFactor = async () => {
    try {
      setIsLoading(true);
      const result = await authService.setupTwoFactor();
      return result;
    } catch (error) {
      console.error('❌ 2FA setup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyTwoFactor = async (token: string, secret: string) => {
    try {
      setIsLoading(true);
      await authService.verifyTwoFactor(token, secret);
      // Refresh profile to get updated 2FA status
      await getProfile();
    } catch (error) {
      console.error('❌ 2FA verification error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const requestPasswordReset = async (email: string) => {
    try {
      setIsLoading(true);
      await authService.requestPasswordReset(email);
    } catch (error) {
      console.error('❌ Password reset request error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      setIsLoading(true);
      await authService.resetPassword(token, newPassword);
    } catch (error) {
      console.error('❌ Password reset error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getActiveSessions = async () => {
    try {
      const sessions = await authService.getActiveSessions();
      return sessions;
    } catch (error) {
      console.error('❌ Get active sessions error:', error);
      throw error;
    }
  };

  const logoutAllSessions = async () => {
    try {
      setIsLoading(true);
      await authService.logoutAllSessions();
      await logout(); // Also logout current session
    } catch (error) {
      console.error('❌ Logout all sessions error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const validateToken = async (): Promise<boolean> => {
    try {
      return await authService.validateToken();
    } catch (error) {
      console.error('❌ Token validation error:', error);
      return false;
    }
  };

  const contextValue: AuthContextType = {
    // User state
    user,
    isAuthenticated,
    isLoading,
    
    // Authentication methods
    login,
    register,
    logout,
    refreshToken,
    
    // User methods
    getProfile,
    updateProfile,
    
    // Permission checks
    hasPermission,
    isAdmin,
    isUserType,
    isTradingEnabled,
    isTwoFactorEnabled,
    
    // 2FA methods
    setupTwoFactor,
    verifyTwoFactor,
    
    // Password methods
    requestPasswordReset,
    resetPassword,
    
    // Session methods
    getActiveSessions,
    logoutAllSessions,
    validateToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Higher-order component for protected routes
interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermission?: string;
  requiredUserType?: string;
  adminOnly?: boolean;
  tradingRequired?: boolean;
  fallback?: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
  requiredUserType,
  adminOnly = false,
  tradingRequired = false,
  fallback = <div>Acesso negado</div>
}) => {
  const { isAuthenticated, user, hasPermission, isAdmin, isUserType, isTradingEnabled } = useAuth();

  // Check authentication
  if (!isAuthenticated || !user) {
    return <div>Faça login para acessar esta página</div>;
  }

  // Check admin requirement
  if (adminOnly && !isAdmin()) {
    return <>{fallback}</>;
  }

  // Check user type requirement
  if (requiredUserType && !isUserType(requiredUserType)) {
    return <>{fallback}</>;
  }

  // Check permission requirement
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <>{fallback}</>;
  }

  // Check trading requirement
  if (tradingRequired && !isTradingEnabled()) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default AuthContext;
