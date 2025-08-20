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
export const useAuthStore = () => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  token: null,
  refreshToken: null,
  login: async () => ({ success: false }),
  logout: () => {},
  setUser: () => {},
  setToken: () => {},
  clearAuth: () => {},
  refreshTokenAction: async () => false
});

// Export useAuth as alias for compatibility
export const useAuth = useAuthStore;
