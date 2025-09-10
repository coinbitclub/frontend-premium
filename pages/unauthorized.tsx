/**
 * 🚫 UNAUTHORIZED PAGE - T8 Implementation
 * Página de acesso negado para usuários sem permissão
 * Redirecionamento automático dos guards de autenticação
 */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthT8 } from '../src/providers/AuthProviderT8';

export default function UnauthorizedPage() {
  const router = useRouter();
  
  // Handle SSG/SSR - useAuthT8 might not be available during build
  let authData;
  try {
    authData = useAuthT8();
  } catch (error) {
    // During SSG, provide default values
    authData = {
      user: null,
      isAuthenticated: false,
      hasRole: () => false,
      logout: async () => {}
    };
  }
  
  const { user, isAuthenticated, hasRole, logout } = authData;
  const [countdown, setCountdown] = useState(10);

  // ===============================================
  // 🔄 COUNTDOWN REDIRECT
  // ===============================================

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push(isAuthenticated ? '/dashboard' : '/auth/login');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router, isAuthenticated]);

  // ===============================================
  // 🎬 ACTIONS
  // ===============================================

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      router.push(isAuthenticated ? '/dashboard' : '/');
    }
  };

  const handleGoHome = () => {
    router.push(isAuthenticated ? '/dashboard' : '/');
  };

  const handleLogin = () => {
    router.push('/auth/login');
  };

  const handleLogout = async () => {
    await logout();
  };

  // ===============================================
  // 🎨 RENDER HELPERS
  // ===============================================

  const getRoleColor = (role: string) => {
    const colors = {
      admin: 'text-red-600 bg-red-100',
      moderator: 'text-blue-600 bg-blue-100',
      vip: 'text-purple-600 bg-purple-100',
      user: 'text-gray-600 bg-gray-100'
    };
    return colors[role as keyof typeof colors] || colors.user;
  };

  const getRequiredRoleMessage = () => {
    const { requiredRole } = router.query;
    
    if (requiredRole) {
      const roleMessages = {
        admin: 'Esta página é restrita apenas para administradores.',
        moderator: 'Esta página requer permissões de moderador ou superior.',
        vip: 'Esta página é exclusiva para usuários VIP ou superior.',
        user: 'Esta página requer que você esteja logado.'
      };
      
      return roleMessages[requiredRole as keyof typeof roleMessages] || 
             `Esta página requer o role: ${requiredRole}`;
    }
    
    return 'Você não tem permissão para acessar esta página.';
  };

  // ===============================================
  // 🎨 RENDER
  // ===============================================

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Icon */}
        <div className="text-center">
          <div className="text-red-600 text-8xl mb-4">🚫</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Acesso Negado
          </h2>
          <p className="text-gray-600 mb-6">
            {getRequiredRoleMessage()}
          </p>
        </div>

        {/* User Info */}
        {isAuthenticated && user ? (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              👤 Suas Informações
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Nome:</span>
                <span className="text-sm text-gray-900">
                  {user.firstName} {user.lastName}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Email:</span>
                <span className="text-sm text-gray-900">{user.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Role Atual:</span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role || 'user')}`}>
                  {(user.role || 'user').toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              🔐 Não Autenticado
            </h3>
            <p className="text-gray-600 mb-4">
              Você precisa fazer login para acessar esta página.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-4">
          {isAuthenticated ? (
            <>
              <button
                onClick={handleGoHome}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                🏠 Ir para Dashboard
              </button>
              <button
                onClick={handleGoBack}
                className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors"
              >
                ← Voltar
              </button>
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                🚪 Fazer Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleLogin}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                🔐 Fazer Login
              </button>
              <button
                onClick={handleGoHome}
                className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors"
              >
                🏠 Ir para Home
              </button>
            </>
          )}
        </div>

        {/* Auto Redirect Info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-yellow-600 text-xl">⏰</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-800">
                <strong>Redirecionamento automático em {countdown} segundos</strong>
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                Você será redirecionado para {isAuthenticated ? 'o dashboard' : 'a página de login'}
              </p>
            </div>
          </div>
        </div>

        {/* Help Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">
            💡 Precisa de ajuda?
          </h4>
          <div className="text-xs text-blue-700 space-y-1">
            <p>• Se você acredita que deveria ter acesso, entre em contato com o administrador</p>
            <p>• Verifique se você está logado com a conta correta</p>
            <p>• Alguns recursos podem requerer permissões especiais</p>
          </div>
        </div>

        {/* Role Requirements */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            🛡️ Níveis de Acesso
          </h4>
          <div className="text-xs text-gray-600 space-y-1">
            <div className="flex justify-between items-center">
              <span>👤 User:</span>
              <span>Acesso básico</span>
            </div>
            <div className="flex justify-between items-center">
              <span>⭐ VIP:</span>
              <span>Recursos premium</span>
            </div>
            <div className="flex justify-between items-center">
              <span>🛡️ Moderator:</span>
              <span>Gerenciamento de usuários</span>
            </div>
            <div className="flex justify-between items-center">
              <span>👑 Admin:</span>
              <span>Acesso total ao sistema</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          <p>T8 - Auth & Guards: Página de acesso negado ✅</p>
          <p className="mt-1">
            Sistema de autenticação e autorização implementado
          </p>
        </div>
      </div>
    </div>
  );
}

// Disable SSG for this page since it requires authentication context
export async function getServerSideProps() {
  return {
    props: {}
  };
}