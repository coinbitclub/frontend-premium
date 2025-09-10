/**
 * 🔄 ADAPTERS INDEX - T6 Implementation
 * Exportação centralizada de todos os adapters
 * Baseado nas especificações resolvidas em T5
 */

// ===============================================
// 📦 ADAPTER IMPORTS
// ===============================================

// Import adapters first
import { coreAdapter } from './core.adapter';
import { authAdapter } from './auth.adapter';
import { tradingAdapter } from './trading.adapter';
import { financialAdapter } from './financial.adapter';
import { usersAdapter } from './users.adapter';

// Export adapters and classes
export { coreAdapter, CoreAdapter } from './core.adapter';
export type { HealthCheckResponse, SystemStatusResponse, ApiRoutesResponse, MetricsResponse } from './core.adapter';

export { authAdapter, AuthAdapter } from './auth.adapter';
export type {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  UserProfile,
  Setup2FARequest,
  Setup2FAResponse,
  AuthError
} from './auth.adapter';

export { tradingAdapter, TradingAdapter } from './trading.adapter';
export type {
  TradingSignal,
  SignalResponse,
  ExecutionResult,
  ManualOrderRequest,
  Position,
  PositionsResponse,
  MarketAnalysis,
  TradingConfig,
  SystemStatus
} from './trading.adapter';

export { financialAdapter, FinancialAdapter } from './financial.adapter';
export type {
  UserBalance,
  Transaction,
  PaginatedTransactions,
  DepositRequest,
  DepositResponse,
  WithdrawalRequest,
  WithdrawalResponse,
  CurrencyConversion,
  FinancialSummary
} from './financial.adapter';

export { usersAdapter, UsersAdapter } from './users.adapter';
export type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  PaginatedUsers,
  UserBalance as UsersUserBalance,
  UserStats
} from './users.adapter';

// ===============================================
// 🏗️ ADAPTER REGISTRY
// ===============================================

/**
 * Registry de todos os adapters disponíveis
 * Útil para debugging e listagem dinâmica
 */
export const adapterRegistry = {
  core: coreAdapter,
  auth: authAdapter,
  trading: tradingAdapter,
  financial: financialAdapter,
  users: usersAdapter
} as const;

/**
 * Tipos dos adapters registrados
 */
export type AdapterName = keyof typeof adapterRegistry;
export type AdapterInstance<T extends AdapterName> = typeof adapterRegistry[T];

// ===============================================
// 🔧 UTILITY FUNCTIONS
// ===============================================

/**
 * 📋 Get Available Adapters
 */
export function getAvailableAdapters(): AdapterName[] {
  return Object.keys(adapterRegistry) as AdapterName[];
}

/**
 * 🔍 Get Adapter by Name
 */
export function getAdapter<T extends AdapterName>(name: T): AdapterInstance<T> {
  return adapterRegistry[name];
}

/**
 * ✅ Check if Adapter Exists
 */
export function hasAdapter(name: string): name is AdapterName {
  return name in adapterRegistry;
}

/**
 * 📊 Get Adapter Stats
 */
export function getAdapterStats() {
  return {
    total: Object.keys(adapterRegistry).length,
    adapters: Object.keys(adapterRegistry),
    status: 'ready'
  };
}

// ===============================================
// 🎯 DEFAULT EXPORT
// ===============================================

/**
 * Export padrão com todos os adapters
 */
export default {
  core: coreAdapter,
  auth: authAdapter,
  trading: tradingAdapter,
  financial: financialAdapter,
  users: usersAdapter,
  
  // Utility functions
  getAvailableAdapters,
  getAdapter,
  hasAdapter,
  getAdapterStats
};

// ===============================================
// 📝 ADAPTER DOCUMENTATION
// ===============================================

/**
 * Documentação dos adapters implementados
 * 
 * @example
 * ```typescript
 * import { coreAdapter, authAdapter } from '@/lib/api/adapters';
 * 
 * // Health check
 * const health = await coreAdapter.getHealth();
 * 
 * // Login
 * const loginResult = await authAdapter.login({
 *   email: 'user@example.com',
 *   password: 'password123'
 * });
 * ```
 */
export const ADAPTER_DOCS = {
  core: {
    description: 'Endpoints básicos do sistema (health, status, métricas)',
    endpoints: 6,
    methods: ['getHealth', 'getStatus', 'getApiStatus', 'getRoutes', 'getMetrics', 'getRootInfo']
  },
  auth: {
    description: 'Autenticação (login, refresh, 2FA, profile)',
    endpoints: 7,
    methods: ['login', 'refreshToken', 'logout', 'getProfile', 'setup2FA', 'generate2FABackupCodes', 'sendSMS2FA']
  },
  trading: {
    description: 'Operações de trading (sinais, posições, execução, análise)',
    endpoints: 12,
    methods: ['processSignal', 'executeManualOrder', 'getActivePositions', 'closePosition', 'getMarketAnalysis', 'getTradingConfig', 'updateTradingConfig']
  },
  financial: {
    description: 'Operações financeiras (saldos, transações, depósitos, saques)',
    endpoints: 12,
    methods: ['getBalance', 'getTransactions', 'processDeposit', 'processWithdrawal', 'convertUsdToBrl', 'getFinancialSummary']
  },
  users: {
    description: 'Gerenciamento de usuários (CRUD completo)',
    endpoints: 7,
    methods: ['getUsers', 'createUser', 'getUserById', 'updateUser', 'deactivateUser', 'promoteUser', 'getUserBalances']
  }
} as const;