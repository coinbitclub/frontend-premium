/**
 * 🛡️ AUTH GUARD - T8 Implementation
 * Guard de autenticação para proteger rotas baseado em roles e permissões
 * Integrado com AuthProviderT8
 */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthT8 } from '../providers/AuthProviderT8';

// ===============================================
// 🔧 TYPES
// ===============================================

export interface AuthGuardProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  requiredPermissions?: string[];
  fallback?: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
  allowUnauthenticated?: boolean;
}

export interface RouteGuardConfig {
  requiredRoles?: string[];
  requiredPermissions?: string[];
  redirectTo?: string;
  requireAuth?: boolean;
}

// ===============================================
// 🛡️ AUTH GUARD COMPONENT
// ===============================================

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requiredRoles,
  requiredPermissions,
  fallback,
  redirectTo = '/auth/login',
  requireAuth = true,
  allowUnauthenticated = false
}) => {
  const router = useRouter();
  const { isAuthenticated, isLoading, user, canAccess } = useAuthT8();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        // Wait for auth to initialize
        if (isLoading) {
          return;
        }

        // If authentication is not required and user is not authenticated, allow access
        if (!requireAuth || allowUnauthenticated) {
          setIsChecking(false);
          return;
        }

        // Check if user is authenticated
        if (!isAuthenticated) {
          const currentPath = router.asPath;
          const loginUrl = `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`;
          router.replace(loginUrl);
          return;
        }

        // Check role and permission requirements
        if (!canAccess(requiredRoles, requiredPermissions)) {
          // Redirect to unauthorized page or dashboard
          router.replace('/unauthorized');
          return;
        }

        setIsChecking(false);
      } catch (error) {
        console.error('Auth guard error:', error);
        router.replace(redirectTo);
      }
    };

    checkAccess();
  }, [isAuthenticated, isLoading, user, router, requiredRoles, requiredPermissions, redirectTo, requireAuth, allowUnauthenticated, canAccess]);

  // Show loading state
  if (isLoading || isChecking) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Render children if all checks pass
  return <>{children}</>;
};

// ===============================================
// 🛡️ ROLE GUARD
// ===============================================

export const RoleGuard: React.FC<{
  children: React.ReactNode;
  allowedRoles: string[];
  fallback?: React.ReactNode;
}> = ({ children, allowedRoles, fallback }) => {
  return (
    <AuthGuard
      requiredRoles={allowedRoles}
      fallback={fallback}
    >
      {children}
    </AuthGuard>
  );
};

// ===============================================
// 🛡️ PERMISSION GUARD
// ===============================================

export const PermissionGuard: React.FC<{
  children: React.ReactNode;
  requiredPermissions: string[];
  fallback?: React.ReactNode;
}> = ({ children, requiredPermissions, fallback }) => {
  return (
    <AuthGuard
      requiredPermissions={requiredPermissions}
      fallback={fallback}
    >
      {children}
    </AuthGuard>
  );
};

// ===============================================
// 🛡️ ADMIN GUARD
// ===============================================

export const AdminGuard: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => {
  return (
    <RoleGuard
      allowedRoles={['admin']}
      fallback={fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="text-red-600 text-6xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Acesso Negado</h2>
            <p className="text-gray-600 mb-4">Você precisa ser administrador para acessar esta página.</p>
            <button
              onClick={() => window.history.back()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              ← Voltar
            </button>
          </div>
        </div>
      )}
    >
      {children}
    </RoleGuard>
  );
};

// ===============================================
// 🛡️ MODERATOR GUARD
// ===============================================

export const ModeratorGuard: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => {
  return (
    <RoleGuard
      allowedRoles={['admin', 'moderator']}
      fallback={fallback}
    >
      {children}
    </RoleGuard>
  );
};

// ===============================================
// 🛡️ VIP GUARD
// ===============================================

export const VipGuard: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => {
  return (
    <RoleGuard
      allowedRoles={['admin', 'moderator', 'vip']}
      fallback={fallback}
    >
      {children}
    </RoleGuard>
  );
};

// ===============================================
// 🛡️ GUEST GUARD (for login/register pages)
// ===============================================

export const GuestGuard: React.FC<{
  children: React.ReactNode;
  redirectTo?: string;
}> = ({ children, redirectTo = '/dashboard' }) => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthT8();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated) {
      router.replace(redirectTo);
      return;
    }

    setIsChecking(false);
  }, [isAuthenticated, isLoading, router, redirectTo]);

  if (isLoading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// ===============================================
// 🛡️ HOC GUARDS
// ===============================================

/**
 * Higher-Order Component para proteger páginas com autenticação
 */
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  guardConfig: RouteGuardConfig = {}
) => {
  const WrappedComponent = (props: P) => {
    return (
      <AuthGuard
        requiredRoles={guardConfig.requiredRoles}
        requiredPermissions={guardConfig.requiredPermissions}
        redirectTo={guardConfig.redirectTo}
        requireAuth={guardConfig.requireAuth}
      >
        <Component {...props} />
      </AuthGuard>
    );
  };

  WrappedComponent.displayName = `withAuth(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

/**
 * Higher-Order Component para proteger páginas administrativas
 */
export const withAdminAuth = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return withAuth(Component, {
    requiredRoles: ['admin'],
    redirectTo: '/auth/login'
  });
};

/**
 * Higher-Order Component para proteger páginas de moderador
 */
export const withModeratorAuth = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return withAuth(Component, {
    requiredRoles: ['admin', 'moderator'],
    redirectTo: '/auth/login'
  });
};

/**
 * Higher-Order Component para páginas que requerem apenas login
 */
export const withUserAuth = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return withAuth(Component, {
    requireAuth: true,
    redirectTo: '/auth/login'
  });
};

/**
 * Higher-Order Component para páginas de guest (login/register)
 */
export const withGuestOnly = <P extends object>(
  Component: React.ComponentType<P>
) => {
  const WrappedComponent = (props: P) => {
    return (
      <GuestGuard>
        <Component {...props} />
      </GuestGuard>
    );
  };

  WrappedComponent.displayName = `withGuestOnly(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

export default AuthGuard;