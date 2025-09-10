import React, { ReactNode, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useLanguage } from '../hooks/useLanguage';
import { FiHome, FiUser, FiSettings, FiLogOut, FiMenu, FiX, FiBell, FiGlobe, FiBarChart, FiDollarSign, FiActivity, FiTrendingUp, FiUsers } from 'react-icons/fi';

interface UserLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export default function UserLayout({ 
  children, 
  title = 'CoinBitClub', 
  description = 'Plataforma de Trading Profissional'
}: UserLayoutProps) {
  const { language, setLanguage } = useLanguage();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { 
      name: language === 'pt' ? 'Dashboard' : 'Dashboard', 
      href: '/user/dashboard', 
      icon: FiHome 
    },
    { 
      name: language === 'pt' ? 'Operações' : 'Operations', 
      href: '/user/operations', 
      icon: FiBarChart 
    },
    { 
      name: language === 'pt' ? 'Performance' : 'Performance', 
      href: '/user/performance', 
      icon: FiTrendingUp 
    },
    { 
      name: language === 'pt' ? 'Planos' : 'Plans', 
      href: '/user/plans', 
      icon: FiDollarSign 
    },
    { 
      name: language === 'pt' ? 'Conta' : 'Account', 
      href: '/user/account', 
      icon: FiUser 
    },
    { 
      name: language === 'pt' ? 'Área do Afiliado' : 'Affiliate Area', 
      href: '/affiliate/dashboard', 
      icon: FiUsers,
      isSpecial: true
    },
    { 
      name: language === 'pt' ? 'Configurações' : 'Settings', 
      href: '/user/settings', 
      icon: FiSettings 
    },
  ];

  const isActive = (path: string) => router.pathname === path;

  const handleLogout = () => {
    // Implementar logout
    router.push('/');
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Header seguindo padrão da landing page */}
        <header className="fixed top-0 w-full bg-slate-900/95 backdrop-blur-md z-50 border-b border-slate-700/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/user/dashboard" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center transform hover:scale-110 transition-transform">
                  <span className="text-black font-bold text-lg">₿</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                    CoinBitClub
                  </h1>
                  <p className="text-xs text-gray-400">MarketBot</p>
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
                          ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border border-yellow-500/30'
                          : item.isSpecial
                          ? 'text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 border border-purple-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                      }`}
                    >
                      <Icon size={16} />
                      <span>{item.name}</span>
                      {item.isSpecial && (
                        <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">
                          {language === 'pt' ? 'Novo' : 'New'}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
              
              {/* Right side items */}
              <div className="flex items-center space-x-3">
                {/* Affiliate Area Access */}
                <Link
                  href="/affiliate/dashboard"
                  className="hidden lg:flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-lg text-orange-400 hover:from-orange-500/30 hover:to-yellow-500/30 transition-all border border-orange-500/30"
                >
                  <FiUsers size={16} />
                  <span className="text-xs font-medium">
                    {language === 'pt' ? 'Área Afiliados' : 'Affiliate Area'}
                  </span>
                </Link>

                {/* Language Toggle */}
                <div className="flex items-center space-x-2 bg-slate-800/50 rounded-lg p-1">
                  <button
                    onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                      language === 'pt' 
                        ? 'bg-yellow-500 text-black' 
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    PT
                  </button>
                  <button
                    onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                      language === 'en' 
                        ? 'bg-yellow-500 text-black' 
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    EN
                  </button>
                </div>

                {/* Notifications */}
                <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all relative">
                  <FiBell size={18} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
                </button>

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
                          ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border border-yellow-500/30'
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
            {children}
          </div>
        </main>
      </div>
    </>
  );
}