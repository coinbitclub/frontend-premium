import React, { ReactNode, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useLanguage } from '../hooks/useLanguage';
import { FiHome, FiUser, FiSettings, FiLogOut, FiMenu, FiX, FiBell, FiGlobe } from 'react-icons/fi';

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
      name: language === 'pt' ? 'Perfil' : 'Profile', 
      href: '/user/profile', 
      icon: FiUser 
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
      
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        {/* Navigation Header */}
        <header className="bg-gray-800/90 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between items-center">
              {/* Logo and Mobile Menu */}
              <div className="flex items-center">
                <Link href="/user/dashboard" className="flex items-center">
                  <div className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                    CoinBitClub
                  </div>
                </Link>
                
                {/* Mobile menu button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="ml-4 lg:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                >
                  {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                </button>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex space-x-6">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                          : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                      }`}
                    >
                      <Icon size={16} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
              
              {/* Right side items */}
              <div className="flex items-center space-x-4">
                {/* Language Toggle */}
                <button
                  onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
                  title={language === 'pt' ? 'Switch to English' : 'Mudar para Português'}
                >
                  <FiGlobe size={18} />
                  <span className="ml-1 text-xs">{language.toUpperCase()}</span>
                </button>

                {/* Notifications */}
                <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors relative">
                  <FiBell size={18} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
                </button>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-red-600/20 border border-transparent hover:border-red-500/30 transition-colors"
                >
                  <FiLogOut size={16} />
                  <span className="hidden sm:inline">
                    {language === 'pt' ? 'Sair' : 'Logout'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-700/50">
              <div className="px-4 py-4 space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                          : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
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
        <main className="container mx-auto px-4 py-6">
          {children}
        </main>
      </div>
    </>
  );
}
