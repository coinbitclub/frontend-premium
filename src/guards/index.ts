/**
 * 🛡️ GUARDS INDEX - T8 Implementation
 * Exportação centralizada de todos os guards e middleware de autenticação
 */

// ===============================================
// 📦 GUARD EXPORTS
// ===============================================

// Main Auth Guard
export {
  AuthGuard,
  type AuthGuardProps,
  type RouteGuardConfig
} from './AuthGuard';

// Specialized Guards
export {
  RoleGuard,
  PermissionGuard,
  AdminGuard,
  ModeratorGuard,
  VipGuard,
  GuestGuard
} from './AuthGuard';

// Higher-Order Components
export {
  withAuth,
  withAdminAuth,
  withModeratorAuth,
  withUserAuth,
  withGuestOnly
} from './AuthGuard';

// Auth Middleware
export {
  AuthMiddleware,
  addAuthHeaders,
  requiresAuth,
  extractErrorMessage
} from './AuthMiddleware';

// ===============================================
// 🛡️ GUARD REGISTRY
// ===============================================

/**
 * Registry de todos os guards disponíveis
 * Útil para debugging e listagem dinâmica
 */
export const guardRegistry = {
  // Component Guards
  AuthGuard: 'Main authentication guard with role and permission support',
  RoleGuard: 'Role-based access control guard',
  PermissionGuard: 'Permission-based access control guard',
  AdminGuard: 'Admin-only access guard',
  ModeratorGuard: 'Admin and moderator access guard',
  VipGuard: 'VIP, moderator and admin access guard',
  GuestGuard: 'Guest-only access guard (for login/register pages)',
  
  // HOC Guards
  withAuth: 'HOC for protecting components with authentication',
  withAdminAuth: 'HOC for admin-only components',
  withModeratorAuth: 'HOC for moderator+ components',
  withUserAuth: 'HOC for authenticated user components',
  withGuestOnly: 'HOC for guest-only components',
  
  // Middleware
  AuthMiddleware: 'HTTP request/response interceptor for authentication'
} as const;

/**
 * Tipos dos guards registrados
 */
export type GuardName = keyof typeof guardRegistry;

// ===============================================
// 🔧 UTILITY FUNCTIONS
// ===============================================

/**
 * 📋 Get Available Guards
 */
export function getAvailableGuards(): GuardName[] {
  return Object.keys(guardRegistry) as GuardName[];
}

/**
 * 📝 Get Guard Description
 */
export function getGuardDescription(guardName: GuardName): string {
  return guardRegistry[guardName];
}

/**
 * ✅ Check if Guard Exists
 */
export function hasGuard(name: string): name is GuardName {
  return name in guardRegistry;
}

/**
 * 📊 Get Guard Stats
 */
export function getGuardStats() {
  const guards = Object.keys(guardRegistry);
  const componentGuards = guards.filter(name => 
    ['AuthGuard', 'RoleGuard', 'PermissionGuard', 'AdminGuard', 'ModeratorGuard', 'VipGuard', 'GuestGuard'].includes(name)
  );
  const hocGuards = guards.filter(name => 
    ['withAuth', 'withAdminAuth', 'withModeratorAuth', 'withUserAuth', 'withGuestOnly'].includes(name)
  );
  const middlewareGuards = guards.filter(name => 
    ['AuthMiddleware'].includes(name)
  );
  
  return {
    total: guards.length,
    componentGuards: componentGuards.length,
    hocGuards: hocGuards.length,
    middlewareGuards: middlewareGuards.length,
    guards: {
      all: guards,
      component: componentGuards,
      hoc: hocGuards,
      middleware: middlewareGuards
    },
    status: 'ready'
  };
}

// ===============================================
// 🎯 DEFAULT EXPORT
// ===============================================

/**
 * Export padrão com todos os guards e utilities
 */
export default {
  // Utility functions
  getAvailableGuards,
  getGuardDescription,
  hasGuard,
  getGuardStats,
  
  // Registry
  guardRegistry
};

// ===============================================
// 📝 GUARD DOCUMENTATION
// ===============================================

/**
 * Documentação dos guards implementados
 * 
 * @example
 * ```typescript
 * import { AuthGuard, AdminGuard, withAuth } from '@/guards';
 * 
 * // Component Guard
 * function ProtectedPage() {
 *   return (
 *     <AuthGuard requiredRoles={['admin', 'moderator']}>
 *       <AdminPanel />
 *     </AuthGuard>
 *   );
 * }
 * 
 * // HOC Guard
 * const ProtectedComponent = withAuth(MyComponent, {
 *   requiredRoles: ['admin'],
 *   redirectTo: '/login'
 * });
 * 
 * // Specialized Guard
 * function AdminPage() {
 *   return (
 *     <AdminGuard>
 *       <AdminDashboard />
 *     </AdminGuard>
 *   );
 * }
 * ```
 */
export const GUARD_DOCS = {
  AuthGuard: {
    description: 'Main authentication guard with role and permission support',
    props: ['requiredRoles', 'requiredPermissions', 'fallback', 'redirectTo', 'requireAuth'],
    usage: 'Wrap components that need authentication and/or specific roles/permissions'
  },
  RoleGuard: {
    description: 'Role-based access control guard',
    props: ['allowedRoles', 'fallback'],
    usage: 'Wrap components that need specific roles'
  },
  PermissionGuard: {
    description: 'Permission-based access control guard',
    props: ['requiredPermissions', 'fallback'],
    usage: 'Wrap components that need specific permissions'
  },
  AdminGuard: {
    description: 'Admin-only access guard',
    props: ['fallback'],
    usage: 'Wrap admin-only components'
  },
  ModeratorGuard: {
    description: 'Admin and moderator access guard',
    props: ['fallback'],
    usage: 'Wrap components for moderators and admins'
  },
  VipGuard: {
    description: 'VIP, moderator and admin access guard',
    props: ['fallback'],
    usage: 'Wrap components for VIP users and above'
  },
  GuestGuard: {
    description: 'Guest-only access guard (for login/register pages)',
    props: ['redirectTo'],
    usage: 'Wrap login/register pages to redirect authenticated users'
  },
  withAuth: {
    description: 'HOC for protecting components with authentication',
    config: ['requiredRoles', 'requiredPermissions', 'redirectTo', 'requireAuth'],
    usage: 'Wrap page components that need authentication'
  },
  AuthMiddleware: {
    description: 'HTTP request/response interceptor for authentication',
    features: ['automatic token injection', 'token refresh', 'error handling', 'request logging'],
    usage: 'Wrap app root to enable automatic auth handling'
  }
} as const;