import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  country: string;
  plan: 'brasil-flex' | 'brasil-pro' | 'global-flex' | 'global-pro';
  status: 'active' | 'trial' | 'suspended' | 'cancelled';
  trialEndsAt?: string;
  avatar_url?: string;
  createdAt: string;
  updatedAt: string;
  role?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
  refreshUser: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

interface RegisterData {
  nome: string;
  email: string;
  whatsapp?: string;
  senha: string;
  pais: string;
  plan?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple API client
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://coinbitclub-market-bot.up.railway.app';

const simpleApiClient = {
  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
    
    return response.json();
  },

  async register(userData: any) {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }
    
    return response.json();
  },

  async getProfile() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;
    
    const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get profile');
    }
    
    return response.json();
  },

  async updateProfile(data: any) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;
    
    const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update profile');
    }
    
    return response.json();
  },

  async logout() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;
    
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;
      
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await simpleApiClient.getProfile();
      setUser(response.data.user);
      setError(null);
    } catch (error: any) {
      console.error('Auth check failed:', error);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-token');
      }
      setUser(null);
      
      if (error.message?.includes('401') || error.message?.includes('unauthorized')) {
        setError('Sessão expirada. Faça login novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await simpleApiClient.login(email, password);
      const { user, token } = response.data;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth-token', token);
      }
      setUser(user);
      
      // Redirect based on user status
      if (user.status === 'trial' && !user.trialEndsAt) {
        router.push('/configuracao-inicial');
      } else {
        router.push('/dashboard');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao fazer login';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await simpleApiClient.register({
        name: userData.nome,
        email: userData.email,
        phone: userData.whatsapp,
        password: userData.senha,
        country: userData.pais,
        plan: userData.plan || 'brasil-flex'
      });
      
      const { user, token } = response.data;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth-token', token);
      }
      setUser(user);
      
      // Redirect to initial setup
      router.push('/configuracao-inicial');
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao criar conta';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await simpleApiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-token');
      }
      setUser(null);
      setError(null);
      router.push('/');
    }
  };

  const updateProfile = async (data: Partial<AuthUser>) => {
    try {
      setError(null);
      const response = await simpleApiClient.updateProfile(data);
      setUser(response.data.user);
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao atualizar perfil';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await simpleApiClient.getProfile();
      setUser(response.data.user);
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    refreshUser,
    isLoading,
    isAuthenticated: !!user,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;


