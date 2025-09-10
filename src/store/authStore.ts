// import { create } from 'zustand'; // Removido - dependência não instalada
// import { persist } from 'zustand/middleware'; // Removido - dependência não instalada

export type UserRole = 'ADMIN' | 'GESTOR' | 'OPERADOR' | 'AFILIADO' | 'USUARIO';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  profilePictureUrl?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  refreshToken: string | null;
  login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  clearAuth: () => void;
  refreshTokenAction: () => Promise<boolean>;
}

// Mock store - replace with real Zustand implementation
export const useAuthStore = (): AuthState => {
  // Verificar se há usuário logado no localStorage
  const getStoredUser = (): User | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      const userData = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (userData && token) {
        return JSON.parse(userData);
      }
    } catch (error) {
      console.error('Error parsing stored user data:', error);
    }
    
    return null;
  };

  const storedUser = getStoredUser();
  const isAuthenticated = !!storedUser;

  return {
    user: storedUser,
    isAuthenticated,
    isLoading: false,
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
    refreshToken: null,
    login: async () => ({ success: false }),
    logout: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/auth/login';
      }
    },
    setUser: (user: User) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(user));
      }
    },
    setToken: (token: string) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
      }
    },
    clearAuth: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    },
    refreshTokenAction: async () => false
  };
};

// Export useAuth as alias for compatibility
export const useAuth = useAuthStore;
