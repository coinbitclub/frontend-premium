'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bars3Icon,
  BellIcon,
  UserCircleIcon,
  ChevronDownIcon,
  SunIcon,
  MoonIcon,
  LanguageIcon,
  CogIcon
} from '@heroicons/react/24/outline';

interface HeaderProps {
  onMenuClick: () => void;
  userName: string;
  userRole: 'admin' | 'premium' | 'basic';
  notifications: number;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  language: 'pt' | 'en';
  onLanguageToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  userName,
  userRole,
  notifications,
  theme,
  onThemeToggle,
  language,
  onLanguageToggle
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const translations = {
    pt: {
      search: 'Buscar...',
      notifications: 'Notificações',
      profile: 'Perfil',
      settings: 'Configurações',
      logout: 'Sair',
      lightMode: 'Modo Claro',
      darkMode: 'Modo Escuro',
      portuguese: 'Português',
      english: 'English',
      admin: 'Administrador',
      premium: 'Premium',
      basic: 'Básico',
      welcome: 'Bem-vindo',
      goodMorning: 'Bom dia',
      goodAfternoon: 'Boa tarde',
      goodEvening: 'Boa noite'
    },
    en: {
      search: 'Search...',
      notifications: 'Notifications',
      profile: 'Profile',
      settings: 'Settings',
      logout: 'Logout',
      lightMode: 'Light Mode',
      darkMode: 'Dark Mode',
      portuguese: 'Português',
      english: 'English',
      admin: 'Administrator',
      premium: 'Premium',
      basic: 'Basic',
      welcome: 'Welcome',
      goodMorning: 'Good morning',
      goodAfternoon: 'Good afternoon',
      goodEvening: 'Good evening'
    }
  };

  const t = translations[language];

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return t.goodMorning;
    if (hour < 18) return t.goodAfternoon;
    return t.goodEvening;
  };

  const formatTime = () => {
    return currentTime.toLocaleTimeString(language === 'pt' ? 'pt-BR' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'premium':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'basic':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Analytics
      if (typeof gtag !== 'undefined') {
        gtag('event', 'search', {
          search_term: searchQuery,
          user_role: userRole,
          event_category: 'engagement'
        });
      }
      console.log('Search:', searchQuery);
      // Handle search logic here
    }
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (typeof gtag !== 'undefined') {
      gtag('event', 'notification_click', {
        user_role: userRole,
        notification_count: notifications,
        event_category: 'engagement'
      });
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          {/* Greeting & Time */}
          <div className="hidden md:flex items-center space-x-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {getGreeting()}, {userName}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {formatTime()}
              </p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <button
            onClick={onThemeToggle}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={theme === 'light' ? t.darkMode : t.lightMode}
          >
            {theme === 'light' ? (
              <MoonIcon className="h-5 w-5" />
            ) : (
              <SunIcon className="h-5 w-5" />
            )}
          </button>

          {/* Language Toggle */}
          <button
            onClick={onLanguageToggle}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={language === 'pt' ? t.english : t.portuguese}
          >
            <LanguageIcon className="h-5 w-5" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={handleNotificationClick}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
            >
              <BellIcon className="h-5 w-5" />
              {notifications > 0 && (
                <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-semibold">
                    {notifications > 9 ? '9+' : notifications}
                  </span>
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
              >
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t.notifications}
                  </h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications > 0 ? (
                    <div className="p-4 space-y-3">
                      {/* Sample notifications */}
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm text-gray-900 dark:text-white">
                            New trading signal available
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            2 minutes ago
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      No new notifications
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <UserCircleIcon className="h-8 w-8 text-gray-500 dark:text-gray-400" />
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {userName}
                </p>
                <p className={`text-xs px-2 py-1 rounded-full ${getRoleColor(userRole)}`}>
                  {t[userRole as keyof typeof t]}
                </p>
              </div>
              <ChevronDownIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
              >
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {userName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t[userRole as keyof typeof t]}
                  </p>
                </div>
                
                <div className="py-2">
                  <a
                    href="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <UserCircleIcon className="mr-3 h-4 w-4" />
                    {t.profile}
                  </a>
                  <a
                    href="/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <CogIcon className="mr-3 h-4 w-4" />
                    {t.settings}
                  </a>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 py-2">
                  <button
                    onClick={() => {
                      if (typeof gtag !== 'undefined') {
                        gtag('event', 'logout_click', {
                          user_role: userRole,
                          source: 'header_menu',
                          event_category: 'engagement'
                        });
                      }
                      console.log('Logout from header');
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    {t.logout}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close menus */}
      {(showUserMenu || showNotifications) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => {
            setShowUserMenu(false);
            setShowNotifications(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;
