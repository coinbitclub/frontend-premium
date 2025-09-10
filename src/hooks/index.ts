/**
 * 🔄 HOOKS INDEX - T7 Implementation
 * Exportação centralizada de todos os hooks personalizados
 * Baseado nos adapters implementados em T6
 */

// ===============================================
// 📦 HOOK IMPORTS
// ===============================================

// Core System Hooks
export { useCore } from './useCore';
export type { UseCoreReturn } from './useCore';

// Authentication Hooks
export { useAuth } from './useAuth';
export type { UseAuthReturn } from './useAuth';

// Trading Hooks
export { useTrading } from './useTrading';
export type { UseTradingReturn } from './useTrading';

// Financial Hooks
export { useFinancial } from './useFinancial';
export type { UseFinancialReturn } from './useFinancial';

// Users Management Hooks
export { useUsers } from './useUsers';
export type { UseUsersReturn } from './useUsers';

// Existing Hooks
export { useTracking, usePageTracking } from './useTracking';
export { useTranslations } from './useTranslations';
export { useWebSocket } from './useWebSocket';

// ===============================================
// 🏗️ HOOK REGISTRY
// ===============================================

/**
 * Registry de todos os hooks disponíveis
 * Útil para debugging e listagem dinâmica
 */
export const hookRegistry = {
  // T7 Hooks (baseados nos adapters)
  useCore: 'Core system operations (health, status, metrics)',
  useAuth: 'Authentication management (login, refresh, 2FA, profile)',
  useTrading: 'Trading operations (signals, positions, execution, analysis)',
  useFinancial: 'Financial operations (balance, transactions, deposits, withdrawals)',
  useUsers: 'User management (CRUD operations with pagination)',
  
  // Existing Hooks
  useTracking: 'Analytics and tracking functionality',
  useTranslations: 'Internationalization and translations',
  useWebSocket: 'WebSocket real-time communication'
} as const;

/**
 * Tipos dos hooks registrados
 */
export type HookName = keyof typeof hookRegistry;

// ===============================================
// 🔧 UTILITY FUNCTIONS
// ===============================================

/**
 * 📋 Get Available Hooks
 */
export function getAvailableHooks(): HookName[] {
  return Object.keys(hookRegistry) as HookName[];
}

/**
 * 📝 Get Hook Description
 */
export function getHookDescription(hookName: HookName): string {
  return hookRegistry[hookName];
}

/**
 * ✅ Check if Hook Exists
 */
export function hasHook(name: string): name is HookName {
  return name in hookRegistry;
}

/**
 * 📊 Get Hook Stats
 */
export function getHookStats() {
  const hooks = Object.keys(hookRegistry);
  const t7Hooks = hooks.filter(name => 
    ['useCore', 'useAuth', 'useTrading', 'useFinancial', 'useUsers'].includes(name)
  );
  const existingHooks = hooks.filter(name => 
    ['useTracking', 'useTranslations', 'useWebSocket'].includes(name)
  );
  
  return {
    total: hooks.length,
    t7Hooks: t7Hooks.length,
    existingHooks: existingHooks.length,
    hooks: {
      all: hooks,
      t7: t7Hooks,
      existing: existingHooks
    },
    status: 'ready'
  };
}

// ===============================================
// 🎯 DEFAULT EXPORT
// ===============================================

/**
 * Export padrão com todos os hooks e utilities
 */
export default {
  // Hook functions
  getAvailableHooks,
  getHookDescription,
  hasHook,
  getHookStats,
  
  // Registry
  hookRegistry
};

// ===============================================
// 📝 HOOK DOCUMENTATION
// ===============================================

/**
 * Documentação dos hooks implementados
 * 
 * @example
 * ```typescript
 * import { useCore, useAuth, useTrading } from '@/hooks';
 * 
 * function MyComponent() {
 *   // Core system operations
 *   const { health, checkHealth, isSystemHealthy } = useCore();
 *   
 *   // Authentication
 *   const { isAuthenticated, login, logout, user } = useAuth();
 *   
 *   // Trading operations
 *   const { positions, getPositions, processSignal } = useTrading();
 *   
 *   // ... component logic
 * }
 * ```
 */
export const HOOK_DOCS = {
  useCore: {
    description: 'Core system operations (health, status, metrics)',
    methods: ['checkHealth', 'getStatus', 'getRoutes', 'getMetrics', 'refetchAll'],
    computed: ['isSystemHealthy'],
    autoFetch: ['health']
  },
  useAuth: {
    description: 'Authentication management (login, refresh, 2FA, profile)',
    methods: ['login', 'logout', 'getProfile', 'refreshAccessToken', 'setup2FA'],
    computed: ['isAuthenticated'],
    storage: ['localStorage tokens'],
    autoFetch: ['profile on mount if token valid']
  },
  useTrading: {
    description: 'Trading operations (signals, positions, execution, analysis)',
    methods: ['getPositions', 'processSignal', 'executeOrder', 'getAnalysis', 'closePosition'],
    utilities: ['validateSignal', 'calculatePnL'],
    autoFetch: ['systemStatus']
  },
  useFinancial: {
    description: 'Financial operations (balance, transactions, deposits, withdrawals)',
    methods: ['getBalance', 'getTransactions', 'processDeposit', 'processWithdrawal', 'convertUsdToBrl'],
    utilities: ['validateDeposit', 'validateWithdrawal', 'formatCurrency', 'calculateFee'],
    pagination: ['transactions']
  },
  useUsers: {
    description: 'User management (CRUD operations with pagination)',
    methods: ['getUsers', 'getUserById', 'createUser', 'updateUser', 'deactivateUser', 'promoteUser'],
    utilities: ['validateCreateUser', 'validateUpdateUser', 'formatUserDisplayName', 'searchUsers'],
    pagination: ['users'],
    autoFetch: ['users on mount']
  }
} as const;