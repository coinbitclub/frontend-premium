/**
 * 🔐 AUTHENTICATION CONTEXT - OPTIMIZED
 * High-performance authentication state management
 */

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, ReactNode } from 'react';
import authService, { User } from '../services/authService';

// Environment flag for debug logging
const IS_DEV = process.env.NODE_ENV === 'development';

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

  // Utility function to clear redirect storage - memoized
  const clearRedirectStorage = useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('login-redirect-timestamp');
      sessionStorage.removeItem('login-redirect-count');
      sessionStorage.removeItem('dashboard-redirect-timestamp');
      sessionStorage.removeItem('dashboard-redirect-count');
    }
  }, []);

  // Initialize authentication state on mount - memoized
  const initializeAuth = useCallback(async () => {
    try {
      IS_DEV && console.log('🔐 AuthContext: Initializing...');
      
      const hasTokens = authService.isAuthenticated();
      
      if (hasTokens) {
        const currentUser = authService.getCurrentUser();
        
        if (currentUser) {
          // Batch state updates
          setUser(currentUser);
          setIsAuthenticated(true);
          
          IS_DEV && console.log('✅ User authenticated from storage');
          
          // Validate token in background (non-blocking)
          authService.validateToken().catch(error => {
            IS_DEV && console.warn('⚠️ Token validation warning:', error.message);
          });
        } else {
          // Clear invalid auth state
          authService.logout();
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('❌ Auth initialization error:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Login function - memoized
  const login = useCallback(async (email: string, password: string, twoFactorCode?: string) => {
    try {
      setIsLoading(true);
      const response = await authService.login(email, password, twoFactorCode);

      if (response.success) {
        // Batch all state updates together - React 18 automatic batching
        setUser(response.user);
        setIsAuthenticated(true);
        setIsLoading(false);
        
        IS_DEV && console.log('✅ Login successful');
      } else if (response.requiresTwoFactor) {
        setIsLoading(false);
        throw new Error('2FA_REQUIRED');
      } else {
        setIsLoading(false);
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  }, []);

  // Register function - memoized
  const register = useCallback(async (userData: any) => {
    try {
      setIsLoading(true);
      await authService.register(userData);
    } catch (error) {
      console.error('❌ Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout function - memoized
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Clear React state first
      setUser(null);
      setIsAuthenticated(false);

      // Call backend logout
      await authService.logout();
      clearRedirectStorage();
      
      IS_DEV && console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout error:', error);
      
      // Ensure clean state even on error
      clearRedirectStorage();
      setUser(null);
      setIsAuthenticated(false);
      
      // Force clear storage
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
      }
    } finally {
      setIsLoading(false);
    }
  }, [clearRedirectStorage]);

  // Refresh token - memoized
  const refreshToken = useCallback(async (): Promise<boolean> => {
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
      console.error('Token refresh error:', error);
      await logout();
      return false;
    }
  }, [logout]);

  // Get profile - memoized
  const getProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const userProfile = await authService.getProfile();
      setUser(userProfile);
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update profile - memoized
  const updateProfile = useCallback((data: Partial<User>) => {
    setUser(prevUser => prevUser ? { ...prevUser, ...data } : null);
  }, []);

  // Permission checks - memoized
  const hasPermission = useCallback((permission: string): boolean => {
    return authService.hasPermission(permission);
  }, []);

  const isAdmin = useCallback((): boolean => {
    return authService.isAdmin();
  }, []);

  const isUserType = useCallback((userType: string): boolean => {
    return authService.isUserType(userType);
  }, []);

  const isTradingEnabled = useCallback((): boolean => {
    return authService.isTradingEnabled();
  }, []);

  const isTwoFactorEnabled = useCallback((): boolean => {
    return authService.isTwoFactorEnabled();
  }, []);

  // 2FA methods - memoized
  const setupTwoFactor = useCallback(async () => {
    try {
      setIsLoading(true);
      return await authService.setupTwoFactor();
    } catch (error) {
      console.error('2FA setup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyTwoFactor = useCallback(async (token: string, secret: string) => {
    try {
      setIsLoading(true);
      await authService.verifyTwoFactor(token, secret);
      await getProfile(); // Refresh profile
    } catch (error) {
      console.error('2FA verification error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [getProfile]);

  // Password methods - memoized
  const requestPasswordReset = useCallback(async (email: string) => {
    try {
      setIsLoading(true);
      await authService.requestPasswordReset(email);
    } catch (error) {
      console.error('Password reset request error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (token: string, newPassword: string) => {
    try {
      setIsLoading(true);
      await authService.resetPassword(token, newPassword);
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Session methods - memoized
  const getActiveSessions = useCallback(async () => {
    try {
      return await authService.getActiveSessions();
    } catch (error) {
      console.error('Get active sessions error:', error);
      throw error;
    }
  }, []);

  const logoutAllSessions = useCallback(async () => {
    try {
      setIsLoading(true);
      await authService.logoutAllSessions();
      await logout();
    } catch (error) {
      console.error('Logout all sessions error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  const validateToken = useCallback(async (): Promise<boolean> => {
    try {
      return await authService.validateToken();
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo<AuthContextType>(() => ({
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
  }), [
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshToken,
    getProfile,
    updateProfile,
    hasPermission,
    isAdmin,
    isUserType,
    isTradingEnabled,
    isTwoFactorEnabled,
    setupTwoFactor,
    verifyTwoFactor,
    requestPasswordReset,
    resetPassword,
    getActiveSessions,
    logoutAllSessions,
    validateToken,
  ]);

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

export default AuthContext;
