'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  HomeIcon, 
  ChartBarIcon, 
  CurrencyDollarIcon,
  CogIcon,
  UserIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  ChartPieIcon,
  ClockIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: 'admin' | 'premium' | 'basic';
  language: 'pt' | 'en';
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, userRole, language }) => {
  const translations = {
    pt: {
      dashboard: 'Dashboard',
      trading: 'Trading',
      analytics: 'Analytics',
      portfolio: 'Portfólio',
      history: 'Histórico',
      settings: 'Configurações',
      profile: 'Perfil',
      notifications: 'Notificações',
      logout: 'Sair',
      admin: 'Administração',
      premium: 'Premium',
      basic: 'Básico'
    },
    en: {
      dashboard: 'Dashboard',
      trading: 'Trading',
      analytics: 'Analytics',
      portfolio: 'Portfolio',
      history: 'History',
      settings: 'Settings',
      profile: 'Profile',
      notifications: 'Notifications',
      logout: 'Logout',
      admin: 'Administration',
      premium: 'Premium',
      basic: 'Basic'
    }
  };

  const t = translations[language];

  const menuItems = [
    {
      name: t.dashboard,
      href: '/dashboard',
      icon: HomeIcon,
      current: true,
      roles: ['admin', 'premium', 'basic']
    },
    {
      name: t.trading,
      href: '/trading',
      icon: CurrencyDollarIcon,
      current: false,
      roles: ['admin', 'premium']
    },
    {
      name: t.analytics,
      href: '/analytics',
      icon: ChartBarIcon,
      current: false,
      roles: ['admin', 'premium']
    },
    {
      name: t.portfolio,
      href: '/portfolio',
      icon: ChartPieIcon,
      current: false,
      roles: ['admin', 'premium', 'basic']
    },
    {
      name: t.history,
      href: '/history',
      icon: ClockIcon,
      current: false,
      roles: ['admin', 'premium', 'basic']
    },
    {
      name: t.notifications,
      href: '/notifications',
      icon: BellIcon,
      current: false,
      roles: ['admin', 'premium', 'basic']
    }
  ];

  const bottomMenuItems = [
    {
      name: t.settings,
      href: '/settings',
      icon: CogIcon,
      roles: ['admin', 'premium', 'basic']
    },
    {
      name: t.profile,
      href: '/profile',
      icon: UserIcon,
      roles: ['admin', 'premium', 'basic']
    }
  ];

  if (userRole === 'admin') {
    bottomMenuItems.unshift({
      name: t.admin,
      href: '/admin',
      icon: ShieldCheckIcon,
      roles: ['admin']
    });
  }

  const handleLinkClick = (href: string) => {
    // Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'navigation_click', {
        page: href,
        user_role: userRole,
        event_category: 'navigation'
      });
    }
    onClose();
  };

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(userRole)
  );

  const filteredBottomItems = bottomMenuItems.filter(item => 
    item.roles.includes(userRole)
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-white dark:bg-gray-800 pt-5 pb-4 overflow-y-auto border-r border-gray-200 dark:border-gray-700">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  CoinBitClub
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {t[userRole as keyof typeof t]}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-8 flex-1 px-2 space-y-1">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => handleLinkClick(item.href)}
                  className={`
                    group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors
                    ${item.current
                      ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-r-2 border-blue-500'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    }
                  `}
                >
                  <Icon
                    className={`
                      mr-3 flex-shrink-0 h-5 w-5 transition-colors
                      ${item.current 
                        ? 'text-blue-500 dark:text-blue-400' 
                        : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400'
                      }
                    `}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Navigation */}
          <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 pt-4 px-2 space-y-1">
            {filteredBottomItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => handleLinkClick(item.href)}
                  className="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <Icon className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors" />
                  {item.name}
                </Link>
              );
            })}

            {/* Logout Button */}
            <button
              onClick={() => {
                // Analytics
                if (typeof gtag !== 'undefined') {
                  gtag('event', 'logout_click', {
                    user_role: userRole,
                    event_category: 'engagement'
                  });
                }
                // Handle logout logic here
                console.log('Logout clicked');
              }}
              className="group flex items-center w-full px-2 py-2 text-sm font-medium text-red-600 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <ArrowRightOnRectangleIcon className="mr-3 flex-shrink-0 h-5 w-5 text-red-500 dark:text-red-400" />
              {t.logout}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <motion.div
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="lg:hidden fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-4 pt-5 pb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  CoinBitClub
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {t[userRole as keyof typeof t]}
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 px-2 pb-4 space-y-1 overflow-y-auto">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => handleLinkClick(item.href)}
                  className={`
                    group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors
                    ${item.current
                      ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    }
                  `}
                >
                  <Icon
                    className={`
                      mr-3 flex-shrink-0 h-5 w-5 transition-colors
                      ${item.current 
                        ? 'text-blue-500 dark:text-blue-400' 
                        : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400'
                      }
                    `}
                  />
                  {item.name}
                </Link>
              );
            })}

            {/* Mobile Bottom Items */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 space-y-1">
              {filteredBottomItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => handleLinkClick(item.href)}
                    className="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <Icon className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors" />
                    {item.name}
                  </Link>
                );
              })}

              {/* Mobile Logout */}
              <button
                onClick={() => {
                  if (typeof gtag !== 'undefined') {
                    gtag('event', 'logout_click', {
                      user_role: userRole,
                      device: 'mobile',
                      event_category: 'engagement'
                    });
                  }
                  console.log('Mobile logout clicked');
                }}
                className="group flex items-center w-full px-2 py-2 text-sm font-medium text-red-600 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <ArrowRightOnRectangleIcon className="mr-3 flex-shrink-0 h-5 w-5 text-red-500 dark:text-red-400" />
                {t.logout}
              </button>
            </div>
          </nav>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
