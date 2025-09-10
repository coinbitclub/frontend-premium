/**
 * 📦 API EXPORTS - T2 Implementation
 * Exportações centralizadas da camada de API
 */

// HTTP Client
export { default as httpClient, HttpClient } from './http';
export type { ApiResponse, AuthTokens } from './http';

// Re-export axios types for convenience
export type { AxiosResponse, AxiosError } from 'axios';

// Fallback types if SDK is not available
export type ApiPaths = Record<string, any>;
export type ApiComponents = Record<string, any>;

// Common response types
export interface HealthCheckResponse {
  ok: boolean;
  ts: string;
  version: string;
}

export interface ErrorResponse {
  error: string;
  code?: string;
}

// ===============================================
// 🔄 ADAPTERS EXPORT
// ===============================================

// Export all adapters and their types
export * from './adapters';

// Import adapters for direct access
import adapters from './adapters';
export { adapters };

// Individual adapter exports for convenience
export {
  coreAdapter,
  authAdapter,
  tradingAdapter,
  financialAdapter,
  usersAdapter
} from './adapters';

// ===============================================
// 🎯 API CLIENT FACADE
// ===============================================

/**
 * Unified API client with all adapters
 * Provides a single entry point for all API operations
 */
export const apiClient = {
  // Core system endpoints
  core: adapters.core,
  
  // Authentication
  auth: adapters.auth,
  
  // Trading operations
  trading: adapters.trading,
  
  // Financial operations
  financial: adapters.financial,
  
  // User management
  users: adapters.users,
  
  // Utility functions
  getAvailableAdapters: adapters.getAvailableAdapters,
  getAdapter: adapters.getAdapter,
  hasAdapter: adapters.hasAdapter,
  getAdapterStats: adapters.getAdapterStats
};

// Default export
export default apiClient;