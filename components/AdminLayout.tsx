import React, { ReactNode, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useLanguage } from '../hooks/useLanguage';
import { useAuth } from '../src/contexts/AuthContext';
import { 
  FiHome, 
  FiUsers, 
  FiDollarSign, 
  FiSettings, 
  FiBarChart, 
  FiLogOut, 
  FiMenu, 
  FiX, 
  FiBell, 
  FiShield,
  FiActivity,
  FiTrendingUp,
  FiFileText,
  FiUserCheck,
  FiGift,
  FiMonitor,
  FiClock,
  FiUserPlus
} from 'react-icons/fi';

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export default function AdminLayout({ 
  children, 
  title = 'Admin - CoinBitClub', 
  description = 'Painel Administrativo'
}: AdminLayoutProps) {
  const { language, setLanguage } = useLanguage();
  const { logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { 
      name: language === 'pt' ? 'Dashboard' : 'Dashboard', 
      href: '/admin/dashboard', 
      icon: FiHome 
    },
    { 
      name: language === 'pt' ? 'Usuários' : 'Users', 
      href: '/admin/users', 
      icon: FiUsers 
    },
    { 
      name: language === 'pt' ? 'Afiliados' : 'Affiliates', 
      href: '/admin/affiliates', 
      icon: FiUserPlus 
    },
    { 
      name: language === 'pt' ? 'Analytics' : 'Analytics', 
      href: '/admin/analytics', 
      icon: FiBarChart 
    },
    { 
      name: language === 'pt' ? 'Relatórios' : 'Reports', 
      href: '/admin/reports', 
      icon: FiFileText 
    },
    { 
      name: language === 'pt' ? 'Financeiro' : 'Financial', 
      href: '/admin/financial', 
      icon: FiDollarSign 
    },
    { 
      name: language === 'pt' ? 'Transações' : 'Transactions', 
      href: '/admin/transactions', 
      icon: FiActivity 
    },
    { 
      name: language === 'pt' ? 'Cupons' : 'Coupons', 
      href: '/admin/coupons', 
      icon: FiGift 
    },
    { 
      name: language === 'pt' ? 'Tempo Real' : 'Realtime', 
      href: '/admin/realtime', 
      icon: FiClock 
    },
    { 
      name: language === 'pt' ? 'Sistema' : 'System', 
      href: '/admin/system', 
      icon: FiMonitor 
    },
    { 
      name: language === 'pt' ? 'Logs' : 'Logs', 
      href: '/admin/logs', 
      icon: FiFileText 
    },
    { 
      name: language === 'pt' ? 'Configurações' : 'Settings', 
      href: '/admin/settings', 
      icon: FiSettings 
    },
  ];

  const isActive = (path: string) => router.pathname === path;

  const handleLogout = async () => {
    try {
      console.log('🚪 AdminLayout: Logout button clicked');
      await logout();
      console.log('✅ AdminLayout: Logout completed, redirecting to login');
      router.push('/auth/login');
    } catch (error) {
      console.error('❌ AdminLayout: Logout error:', error);
      // Even if error, still redirect
      router.push('/auth/login');
    }
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-x-hidden">
        {/* Header seguindo padrão da landing page */}
        <header className="fixed top-0 w-full bg-slate-900/95 backdrop-blur-md z-50 border-b border-slate-700/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/admin/dashboard" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center transform hover:scale-110 transition-transform">
                  <FiShield className="text-white text-lg" />
                </div>
                <div>
                  <h1 className="text-lg font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                    Admin Panel
                  </h1>
                  <p className="text-xs text-gray-400">CoinBitClub</p>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        isActive(item.href)
                          ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border border-red-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                      }`}
                    >
                      <Icon size={16} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
              
              {/* Right side items */}
              <div className="flex items-center space-x-3">
                {/* Language Toggle */}
                <div className="flex items-center space-x-2 bg-slate-800/50 rounded-lg p-1">
                  <button
                    onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                      language === 'pt' 
                        ? 'bg-red-500 text-white' 
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    PT
                  </button>
                  <button
                    onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                      language === 'en' 
                        ? 'bg-red-500 text-white' 
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    EN
                  </button>
                </div>

                {/* Notifications */}
                <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all relative">
                  <FiBell size={18} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* User Menu */}
                <div className="flex items-center space-x-2 bg-slate-800/50 px-3 py-2 rounded-xl">
                  <FiUserCheck className="text-slate-400" size={16} />
                  <span className="text-slate-300 text-sm font-medium">Admin</span>
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-red-600/20 border border-transparent hover:border-red-500/30 transition-all"
                >
                  <FiLogOut size={16} />
                  <span className="hidden sm:inline">
                    {language === 'pt' ? 'Sair' : 'Logout'}
                  </span>
                </button>

                {/* Mobile menu button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                >
                  {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden bg-slate-800/95 backdrop-blur-md border-t border-slate-700/30">
              <div className="px-4 py-4 space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive(item.href)
                          ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border border-red-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                      }`}
                    >
                      <Icon size={18} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="pt-16">
          <div className="container mx-auto px-4 py-6">
            {/* Admin Badge */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-xl flex items-center justify-center border border-red-500/30">
                  <FiShield className="text-red-400 text-xl" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {language === 'pt' ? 'Painel Administrativo' : 'Admin Panel'}
                  </h1>
                  <p className="text-slate-400 text-sm">
                    {language === 'pt' ? 'Controle total da plataforma' : 'Full platform control'}
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 px-4 py-2 rounded-xl border border-red-500/30">
                <span className="text-red-400 font-medium text-sm">
                  {language === 'pt' ? 'Administrador' : 'Administrator'}
                </span>
              </div>
            </div>
            
            {children}
          </div>
        </main>
      </div>
    </>
  );
}