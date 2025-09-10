/**
 * 🔒 AUTH MIDDLEWARE - T8 Implementation
 * Middleware de autenticação para interceptar requisições HTTP
 * Adiciona tokens automaticamente e gerencia refresh de tokens
 */

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthT8 } from '../providers/AuthProviderT8';
import httpClient from '../lib/api/http';
import type { AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

// ===============================================
// 🔧 TYPES
// ===============================================

interface AuthMiddlewareProps {
  children: React.ReactNode;
}

interface RequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// ===============================================
// 🔒 AUTH MIDDLEWARE COMPONENT
// ===============================================

export const AuthMiddleware: React.FC<AuthMiddlewareProps> = ({ children }) => {
  const router = useRouter();
  const { 
    isAuthenticated, 
    user, 
    refreshToken, 
    isTokenExpired, 
    logout 
  } = useAuthT8();

  useEffect(() => {
    // ===============================================
    // 📤 REQUEST INTERCEPTOR
    // ===============================================
    
    const axiosInstance = httpClient.getAxiosInstance();
    
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Add user context headers if available
        if (user) {
          config.headers = config.headers || {};
          config.headers['X-User-ID'] = user.id.toString();
          config.headers['X-User-Role'] = user.role || 'user';
          
          // Add tenant header if available (from user metadata)
          if ((user as any).metadata?.tenantId) {
            config.headers['X-Tenant-ID'] = (user as any).metadata.tenantId;
          }
        }
        
        // Add request timestamp
        config.headers = config.headers || {};
        config.headers['X-Request-Time'] = new Date().toISOString();
        
        console.log('🔒 Auth Middleware - Request:', {
          url: config.url,
          method: config.method,
          hasAuth: !!config.headers?.Authorization,
          userId: config.headers['X-User-ID']
        });
        
        return config;
      },
      (error) => {
        console.error('🔒 Auth Middleware - Request Error:', error);
        return Promise.reject(error);
      }
    );

    // ===============================================
    // 📥 RESPONSE INTERCEPTOR
    // ===============================================
    
    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log successful responses
        console.log('🔒 Auth Middleware - Response:', {
          url: response.config.url,
          status: response.status,
          hasData: !!response.data
        });
        
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as RequestConfig;
        
        console.error('🔒 Auth Middleware - Response Error:', {
          url: originalRequest?.url,
          status: error.response?.status,
          message: error.message
        });
        
        // Handle 403 Forbidden errors
        if (error.response?.status === 403) {
          console.log('🔒 Auth Middleware - Access forbidden, redirecting...');
          
          // Redirect to unauthorized page
          router.push('/unauthorized');
          return Promise.reject(error);
        }
        
        // Handle 404 Not Found errors
        if (error.response?.status === 404) {
          console.log('🔒 Auth Middleware - Resource not found');
          // Let the component handle 404 errors
        }
        
        // Handle 500 Server errors
        if (error.response?.status === 500) {
          console.error('🔒 Auth Middleware - Server error');
          // Could show a global error notification here
        }
        
        return Promise.reject(error);
      }
    );

    // ===============================================
    // 🧹 CLEANUP
    // ===============================================
    
    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [isAuthenticated, user, refreshToken, isTokenExpired, logout, router]);

  // ===============================================
  // 🔄 TOKEN REFRESH SCHEDULER
  // ===============================================
  
  useEffect(() => {
    if (!isAuthenticated) return;
    
    // Set up automatic token refresh
    const refreshInterval = setInterval(async () => {
      try {
        // Check if token will expire in the next 5 minutes
        const token = localStorage.getItem('accessToken');
        if (token) {
          // Decode JWT to check expiration (simplified)
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expirationTime = payload.exp * 1000; // Convert to milliseconds
            const currentTime = Date.now();
            const timeUntilExpiration = expirationTime - currentTime;
            
            // If token expires in less than 5 minutes, refresh it
            if (timeUntilExpiration < 5 * 60 * 1000) {
              console.log('🔒 Auth Middleware - Proactive token refresh...');
              await refreshToken();
            }
          } catch (decodeError) {
            console.error('🔒 Auth Middleware - Token decode error:', decodeError);
          }
        }
      } catch (error) {
        console.error('🔒 Auth Middleware - Scheduled refresh error:', error);
      }
    }, 60000); // Check every minute
    
    return () => {
      clearInterval(refreshInterval);
    };
  }, [isAuthenticated, refreshToken]);

  // ===============================================
  // 🔄 NETWORK STATUS MONITORING
  // ===============================================
  
  useEffect(() => {
    const handleOnline = () => {
      console.log('🔒 Auth Middleware - Network back online');
      // Could trigger a token refresh or user data sync here
    };
    
    const handleOffline = () => {
      console.log('🔒 Auth Middleware - Network offline');
      // Could show offline notification here
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return <>{children}</>;
};

// ===============================================
// 🔒 AUTH INTERCEPTOR UTILITIES
// ===============================================

/**
 * Utility to manually add auth headers to a request config
 */
export const addAuthHeaders = (config: AxiosRequestConfig): AxiosRequestConfig => {
  const token = localStorage.getItem('accessToken');
  
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
};

/**
 * Utility to check if a request needs authentication
 */
export const requiresAuth = (url: string): boolean => {
  const publicEndpoints = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/forgot-password',
    '/api/auth/reset-password',
    '/health',
    '/status'
  ];
  
  return !publicEndpoints.some(endpoint => url.includes(endpoint));
};

/**
 * Utility to extract error message from API response
 */
export const extractErrorMessage = (error: AxiosError): string => {
  if (error.response?.data) {
    const data = error.response.data as any;
    
    // Try different error message formats
    if (data.message) return data.message;
    if (data.error) return data.error;
    if (data.detail) return data.detail;
    if (typeof data === 'string') return data;
  }
  
  // Fallback to generic messages based on status code
  switch (error.response?.status) {
    case 400:
      return 'Dados inválidos fornecidos';
    case 401:
      return 'Não autorizado. Faça login novamente';
    case 403:
      return 'Acesso negado. Você não tem permissão para esta ação';
    case 404:
      return 'Recurso não encontrado';
    case 422:
      return 'Dados de entrada inválidos';
    case 429:
      return 'Muitas tentativas. Tente novamente mais tarde';
    case 500:
      return 'Erro interno do servidor. Tente novamente mais tarde';
    case 503:
      return 'Serviço temporariamente indisponível';
    default:
      return error.message || 'Erro desconhecido';
  }
};

export default AuthMiddleware;