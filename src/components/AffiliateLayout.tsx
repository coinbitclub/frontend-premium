import React, { ReactNode, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useLanguage } from '../../hooks/useLanguage';
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
  FiUserPlus,
  FiActivity,
  FiTrendingUp,
  FiFileText,
  FiUserCheck,
  FiPercent,
  FiShare2
} from 'react-icons/fi';

interface AffiliateLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export default function AffiliateLayout({ 
  children, 
  title = 'Afiliados - CoinBitClub', 
  description = 'Painel de Afiliados'
}: AffiliateLayoutProps) {
  const { language, setLanguage } = useLanguage();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { 
      name: language === 'pt' ? 'Dashboard' : 'Dashboard', 
      href: '/affiliate/dashboard', 
      icon: FiHome 
    },
    { 
      name: language === 'pt' ? 'Indicações' : 'Referrals', 
      href: '/affiliate/referrals', 
      icon: FiUserPlus 
    },
    { 
      name: language === 'pt' ? 'Performance' : 'Performance', 
      href: '/affiliate/performance', 
      icon: FiTrendingUp 
    },
    { 
      name: language === 'pt' ? 'Comissões' : 'Commissions', 
      href: '/affiliate/commissions', 
      icon: FiPercent 
    },
    { 
      name: language === 'pt' ? 'Links' : 'Links', 
      href: '/affiliate/links', 
      icon: FiShare2 
    },
    { 
      name: language === 'pt' ? 'Relatórios' : 'Reports', 
      href: '/affiliate/reports', 
      icon: FiFileText 
    },
    { 
      name: language === 'pt' ? 'Área do Usuário' : 'User Area', 
      href: '/user/dashboard', 
      icon: FiUserCheck,
      isSpecial: true
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
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-x-hidden">
        {/* Header seguindo padrão da landing page */}
        <header className="fixed top-0 w-full bg-slate-900/95 backdrop-blur-md z-50 border-b border-slate-700/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/affiliate/dashboard" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center transform hover:scale-110 transition-transform">
                  <FiUserPlus className="text-white text-lg" />
                </div>
                <div>
                  <h1 className="text-lg font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    Afiliados
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
                          ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30'
                          : item.isSpecial
                          ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 border border-blue-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                      }`}
                    >
                      <Icon size={16} />
                      <span>{item.name}</span>
                      {item.isSpecial && (
                        <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">
                          {language === 'pt' ? 'Trading' : 'Trading'}
                        </span>
                      )}
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
                        ? 'bg-green-500 text-white' 
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    PT
                  </button>
                  <button
                    onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                      language === 'en' 
                        ? 'bg-green-500 text-white' 
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    EN
                  </button>
                </div>

                {/* Notifications */}
                <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all relative">
                  <FiBell size={18} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
                </button>

                {/* User Menu */}
                <div className="flex items-center space-x-2 bg-slate-800/50 px-3 py-2 rounded-xl">
                  <FiUserCheck className="text-slate-400" size={16} />
                  <span className="text-slate-300 text-sm font-medium">
                    {language === 'pt' ? 'Afiliado' : 'Affiliate'}
                  </span>
                </div>

                {/* Switch to User Area */}
                <Link
                  href="/user/dashboard"
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-yellow-600/20 border border-transparent hover:border-yellow-500/30 transition-all"
                >
                  <FiUsers size={16} />
                  <span className="hidden sm:inline">
                    {language === 'pt' ? 'Área do Usuário' : 'User Area'}
                  </span>
                </Link>

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
                          ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30'
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
            {/* Affiliate Badge */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center border border-green-500/30">
                  <FiUserPlus className="text-green-400 text-xl" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {language === 'pt' ? 'Painel de Afiliados' : 'Affiliate Panel'}
                  </h1>
                  <p className="text-slate-400 text-sm">
                    {language === 'pt' ? 'Ganhe comissões indicando novos usuários' : 'Earn commissions by referring new users'}
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 px-4 py-2 rounded-xl border border-green-500/30">
                <span className="text-green-400 font-medium text-sm">
                  {language === 'pt' ? 'Taxa: 1,5%' : 'Rate: 1.5%'}
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
