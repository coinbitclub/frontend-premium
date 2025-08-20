// 🎮 NAVIGATION SYSTEM PREMIUM
// Sistema de navegação dinâmico por role com gestos mobile

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { 
  Home,
  TrendingUp,
  Wallet,
  Settings,
  User,
  BarChart3,
  Users,
  Shield,
  Network,
  FileText,
  Eye,
  Wrench,
  History,
  DollarSign,
  Bell,
  ChevronRight,
  Activity
} from 'lucide-react';

// 🎯 INTERFACE NAVIGATION
interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<any>;
  badge?: string | number;
  color?: 'gold' | 'blue' | 'pink' | 'success' | 'warning' | 'error';
  submenu?: NavigationItem[];
  requiredRole?: string[];
  isLive?: boolean;
}

interface NavigationSystemProps {
  userRole: 'USUARIO' | 'AFILIADO' | 'ADMIN' | 'GESTOR' | 'OPERADOR';
  userLevel?: 'basic' | 'premium' | 'enterprise' | 'normal' | 'vip';
  variant?: 'sidebar' | 'mobile' | 'tabs' | 'breadcrumb';
  onNavigate?: (href: string) => void;
}

// 📱 NAVIGATION CONFIGS POR PERFIL
const getNavigationConfig = (role: string, level?: string): NavigationItem[] => {
  const configs: Record<string, NavigationItem[]> = {
    USUARIO: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        href: '/user/dashboard',
        icon: Home,
        color: 'gold'
      },
      {
        id: 'trading',
        label: 'Trading',
        href: '/user/trading',
        icon: TrendingUp,
        badge: 'Live',
        color: 'success',
        isLive: true
      },
      {
        id: 'operations',
        label: 'Operações',
        href: '/user/operations',
        icon: History,
        color: 'blue'
      },
      {
        id: 'balance',
        label: 'Saldos',
        href: '/user/balance',
        icon: Wallet,
        color: 'gold',
        submenu: [
          {
            id: 'real-balance',
            label: 'Real Balance',
            href: '/user/balance/real',
            icon: DollarSign,
            color: 'gold'
          },
          {
            id: 'admin-balance',
            label: 'Admin Balance',
            href: '/user/balance/admin',
            icon: Shield,
            color: 'blue'
          },
          {
            id: 'commission-balance',
            label: 'Comissões',
            href: '/user/balance/commission',
            icon: Network,
            color: 'success'
          },
          {
            id: 'prepaid-balance',
            label: 'Pré-pago',
            href: '/user/balance/prepaid',
            icon: Wallet,
            color: 'pink'
          }
        ]
      },
      {
        id: 'settings',
        label: 'Configurações',
        href: '/user/settings',
        icon: Settings,
        color: 'blue',
        submenu: [
          {
            id: 'api-keys',
            label: 'API Keys',
            href: '/user/settings/api-keys',
            icon: Shield,
            color: 'warning'
          },
          {
            id: 'trading-config',
            label: 'Trading Config',
            href: '/user/settings/trading',
            icon: TrendingUp,
            color: 'success'
          },
          {
            id: 'notifications',
            label: 'Notificações',
            href: '/user/settings/notifications',
            icon: Bell,
            color: 'blue'
          }
        ]
      },
      {
        id: 'profile',
        label: 'Perfil',
        href: '/user/profile',
        icon: User,
        color: 'blue'
      }
    ],

    AFILIADO: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        href: '/affiliate/dashboard',
        icon: Home,
        color: 'pink'
      },
      {
        id: 'network',
        label: 'Rede',
        href: '/affiliate/network',
        icon: Network,
        color: 'pink'
      },
      {
        id: 'earnings',
        label: 'Ganhos',
        href: '/affiliate/earnings',
        icon: DollarSign,
        color: 'success',
        submenu: [
          {
            id: 'commissions',
            label: 'Comissões',
            href: '/affiliate/earnings/commissions',
            icon: DollarSign,
            color: 'success'
          },
          {
            id: 'history',
            label: 'Histórico',
            href: '/affiliate/earnings/history',
            icon: History,
            color: 'blue'
          },
          {
            id: 'withdrawals',
            label: 'Saques',
            href: '/affiliate/earnings/withdrawals',
            icon: Wallet,
            color: 'warning'
          }
        ]
      },
      {
        id: 'tools',
        label: 'Ferramentas',
        href: '/affiliate/tools',
        icon: Wrench,
        color: 'blue',
        submenu: [
          {
            id: 'referral-links',
            label: 'Links de Indicação',
            href: '/affiliate/tools/referral-links',
            icon: Network,
            color: 'pink'
          },
          {
            id: 'marketing',
            label: 'Material Marketing',
            href: '/affiliate/tools/marketing',
            icon: FileText,
            color: 'blue'
          },
          {
            id: 'analytics',
            label: 'Analytics',
            href: '/affiliate/tools/analytics',
            icon: BarChart3,
            color: 'success'
          }
        ]
      }
    ],

    ADMIN: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        href: '/admin/dashboard',
        icon: Home,
        color: 'blue'
      },
      {
        id: 'users',
        label: 'Usuários',
        href: '/admin/users',
        icon: Users,
        color: 'blue',
        submenu: [
          {
            id: 'all-users',
            label: 'Todos Usuários',
            href: '/admin/users/all',
            icon: Users,
            color: 'blue'
          },
          {
            id: 'active-users',
            label: 'Usuários Ativos',
            href: '/admin/users/active',
            icon: Activity,
            color: 'success'
          },
          {
            id: 'new-users',
            label: 'Novos Usuários',
            href: '/admin/users/new',
            icon: Users,
            color: 'gold'
          },
          {
            id: 'affiliates',
            label: 'Afiliados',
            href: '/admin/users/affiliates',
            icon: Network,
            color: 'pink'
          }
        ]
      },
      {
        id: 'operations',
        label: 'Operações',
        href: '/admin/operations',
        icon: TrendingUp,
        badge: 'Live',
        color: 'success',
        isLive: true
      },
      {
        id: 'financial',
        label: 'Financeiro',
        href: '/admin/financial',
        icon: DollarSign,
        color: 'gold',
        submenu: [
          {
            id: 'overview',
            label: 'Visão Geral',
            href: '/admin/financial/overview',
            icon: BarChart3,
            color: 'gold'
          },
          {
            id: 'transactions',
            label: 'Transações',
            href: '/admin/financial/transactions',
            icon: History,
            color: 'blue'
          },
          {
            id: 'withdrawals',
            label: 'Saques',
            href: '/admin/financial/withdrawals',
            icon: Wallet,
            color: 'warning'
          },
          {
            id: 'commissions',
            label: 'Comissões',
            href: '/admin/financial/commissions',
            icon: Network,
            color: 'success'
          }
        ]
      },
      {
        id: 'analytics',
        label: 'Analytics',
        href: '/admin/analytics',
        icon: BarChart3,
        color: 'success'
      },
      {
        id: 'settings',
        label: 'Configurações',
        href: '/admin/settings',
        icon: Settings,
        color: 'blue'
      }
    ],

    GESTOR: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        href: '/manager/dashboard',
        icon: Home,
        color: 'success'
      },
      {
        id: 'monitoring',
        label: 'Monitoramento',
        href: '/manager/monitoring',
        icon: Eye,
        badge: 'Live',
        color: 'success',
        isLive: true
      },
      {
        id: 'reports',
        label: 'Relatórios',
        href: '/manager/reports',
        icon: FileText,
        color: 'blue'
      },
      {
        id: 'support',
        label: 'Suporte',
        href: '/manager/support',
        icon: Users,
        color: 'warning'
      }
    ],

    OPERADOR: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        href: '/operator/dashboard',
        icon: Home,
        color: 'warning'
      },
      {
        id: 'trading',
        label: 'Trading Control',
        href: '/operator/trading',
        icon: TrendingUp,
        badge: 'Live',
        color: 'success',
        isLive: true
      },
      {
        id: 'signals',
        label: 'Sinais',
        href: '/operator/signals',
        icon: BarChart3,
        color: 'blue'
      },
      {
        id: 'bots',
        label: 'Bots',
        href: '/operator/bots',
        icon: Wrench,
        color: 'warning'
      }
    ]
  };

  return configs[role] || [];
};

// 🎨 NAVIGATION COMPONENT
export const NavigationSystem: React.FC<NavigationSystemProps> = ({
  userRole,
  userLevel,
  variant = 'sidebar',
  onNavigate
}) => {
  const router = useRouter();
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);
  const [activeTab, setActiveTab] = React.useState('dashboard');

  const navigation = getNavigationConfig(userRole, userLevel);
  const currentPath = router.pathname;

  // Toggle submenu
  const toggleSubmenu = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Handle navigation
  const handleNavigate = (href: string) => {
    if (onNavigate) {
      onNavigate(href);
    } else {
      router.push(href);
    }
  };

  // Check if item is active
  const isItemActive = (item: NavigationItem): boolean => {
    return currentPath === item.href || currentPath.startsWith(item.href + '/');
  };

  // SIDEBAR VARIANT
  if (variant === 'sidebar') {
    return (
      <nav className="space-y-2 p-4">
        {navigation.map((item) => (
          <NavigationItemSidebar
            key={item.id}
            item={item}
            isActive={isItemActive(item)}
            isExpanded={expandedItems.includes(item.id)}
            onToggle={() => toggleSubmenu(item.id)}
            onNavigate={handleNavigate}
            currentPath={currentPath}
          />
        ))}
      </nav>
    );
  }

  // MOBILE VARIANT
  if (variant === 'mobile') {
    return (
      <div className="grid grid-cols-4 gap-1 p-4 bg-white dark:bg-gray-800">
        {navigation.slice(0, 4).map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNavigate(item.href)}
            className={`
              flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-200
              ${isItemActive(item) 
                ? `bg-${item.color}-100 dark:bg-${item.color}-900/20 text-${item.color}-600 dark:text-${item.color}-400`
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }
            `}
          >
            <div className="relative">
              <item.icon className="w-6 h-6" />
              {item.isLive && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              )}
              {item.badge && (
                <div className="absolute -top-2 -right-2 px-1 py-0.5 bg-red-500 text-white text-xs rounded-full">
                  {item.badge}
                </div>
              )}
            </div>
            <span className="text-xs font-medium text-center">{item.label}</span>
          </motion.button>
        ))}
      </div>
    );
  }

  // TABS VARIANT
  if (variant === 'tabs') {
    return (
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        {navigation.map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleNavigate(item.href)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
              ${isItemActive(item)
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }
            `}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
            {item.badge && (
              <span className={`px-1.5 py-0.5 text-xs rounded-full bg-${item.color}-500 text-white`}>
                {item.badge}
              </span>
            )}
          </motion.button>
        ))}
      </div>
    );
  }

  return null;
};

// 🔗 SIDEBAR NAVIGATION ITEM
interface NavigationItemSidebarProps {
  item: NavigationItem;
  isActive: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  onNavigate: (href: string) => void;
  currentPath: string;
}

const NavigationItemSidebar: React.FC<NavigationItemSidebarProps> = ({
  item,
  isActive,
  isExpanded,
  onToggle,
  onNavigate,
  currentPath
}) => {
  const hasSubmenu = item.submenu && item.submenu.length > 0;

  return (
    <div>
      <motion.button
        whileHover={{ x: 4 }}
        onClick={() => hasSubmenu ? onToggle() : onNavigate(item.href)}
        className={`
          w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200
          ${isActive 
            ? `bg-${item.color}-100 dark:bg-${item.color}-900/20 text-${item.color}-600 dark:text-${item.color}-400 border-l-4 border-${item.color}-500` 
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }
        `}
      >
        <div className="relative">
          <item.icon className="w-5 h-5 flex-shrink-0" />
          {item.isLive && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          )}
        </div>
        <span className="flex-1 font-medium">{item.label}</span>
        {item.badge && (
          <span className={`px-2 py-0.5 text-xs rounded-full bg-${item.color}-500 text-white`}>
            {item.badge}
          </span>
        )}
        {hasSubmenu && (
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="w-4 h-4" />
          </motion.div>
        )}
      </motion.button>

      {/* Submenu */}
      <AnimatePresence>
        {hasSubmenu && isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="ml-8 mt-1 space-y-1">
              {item.submenu?.map((subItem) => (
                <motion.button
                  key={subItem.id}
                  whileHover={{ x: 2 }}
                  onClick={() => onNavigate(subItem.href)}
                  className={`
                    w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all duration-200
                    ${currentPath === subItem.href
                      ? `text-${subItem.color}-600 dark:text-${subItem.color}-400 bg-${subItem.color}-50 dark:bg-${subItem.color}-900/10`
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }
                  `}
                >
                  <subItem.icon className="w-4 h-4" />
                  {subItem.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavigationSystem;
