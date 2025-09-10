import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '../src/store/authStore';

const DashboardRedirect = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.replace('/auth/login');
      return;
    }

    if (user && user.role) {
      // Redirecionar baseado no role do usuário
      switch (user.role.toUpperCase()) {
        case 'ADMIN':
          router.replace('/admin/dashboard');
          break;
        case 'AFILIADO':
        case 'AFFILIATE':
          // Afiliados vão para área do usuário e podem acessar área do afiliado de lá
          router.replace('/user/dashboard');
          break;
        case 'GESTOR':
        case 'MANAGER':
          router.replace('/manager/dashboard');
          break;
        case 'OPERADOR':
        case 'OPERATOR':
          router.replace('/operator/dashboard');
          break;
        case 'USUARIO':
        case 'USER':
        default:
          router.replace('/user/dashboard');
          break;
      }
    }
  }, [user, isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <div className="mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center text-black font-bold text-xl mx-auto mb-4">
            ₿
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent">
            CoinBitClub
          </h1>
          <p className="text-sm text-yellow-400 font-semibold">MARKETBOT</p>
        </div>
        <p className="text-white mb-2">Redirecionando para seu dashboard...</p>
        <p className="text-gray-400 text-sm">Carregando área personalizada</p>
      </div>
    </div>
  );
};

export default DashboardRedirect;
