// 🏗️ DASHBOARD GRID SYSTEM PREMIUM
// Sistema de grid responsivo para dashboards de trading

import React from 'react';
import { motion } from 'framer-motion';

interface GridProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'dashboard' | 'trading' | 'analytics' | 'financial';
  responsive?: boolean;
}

// 📊 DASHBOARD GRID CONTAINER
export const DashboardGrid: React.FC<GridProps> = ({
  children,
  className = '',
  variant = 'dashboard',
  responsive = true
}) => {
  const getGridClasses = (): string => {
    const base = 'grid gap-4 lg:gap-6';
    
    if (!responsive) return `${base} ${className}`;
    
    switch (variant) {
      case 'dashboard':
        return `${base} grid-cols-1 md:grid-cols-2 xl:grid-cols-4 ${className}`;
      case 'trading':
        return `${base} grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 ${className}`;
      case 'analytics':
        return `${base} grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${className}`;
      case 'financial':
        return `${base} grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 ${className}`;
      default:
        return `${base} grid-cols-1 md:grid-cols-2 xl:grid-cols-3 ${className}`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, staggerChildren: 0.1 }}
      className={getGridClasses()}
    >
      {children}
    </motion.div>
  );
};

// 📱 MOBILE-FIRST GRID ITEM
interface GridItemProps {
  children: React.ReactNode;
  span?: 1 | 2 | 3 | 4;
  mobileSpan?: 1 | 2;
  tabletSpan?: 1 | 2 | 3;
  className?: string;
}

export const GridItem: React.FC<GridItemProps> = ({
  children,
  span = 1,
  mobileSpan,
  tabletSpan,
  className = ''
}) => {
  const getSpanClasses = (): string => {
    let classes = '';
    
    // Mobile span
    if (mobileSpan) {
      classes += mobileSpan === 2 ? 'col-span-2 ' : 'col-span-1 ';
    }
    
    // Tablet span
    if (tabletSpan) {
      classes += tabletSpan === 3 ? 'md:col-span-3 ' : 
                  tabletSpan === 2 ? 'md:col-span-2 ' : 'md:col-span-1 ';
    }
    
    // Desktop span
    classes += span === 4 ? 'xl:col-span-4 ' :
               span === 3 ? 'xl:col-span-3 ' :
               span === 2 ? 'xl:col-span-2 ' : 'xl:col-span-1 ';
    
    return classes.trim();
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      className={`${getSpanClasses()} ${className}`}
    >
      {children}
    </motion.div>
  );
};

// 📊 LAYOUT ESPECÍFICOS POR PERFIL

// 💰 USER BALANCE LAYOUT (4 tipos de saldo)
export const UserBalanceLayout: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => (
  <DashboardGrid variant="financial" className="mb-6">
    {children}
  </DashboardGrid>
);

// 📈 TRADING LAYOUT (interface de trading)
export const TradingLayout: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => (
  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
    {/* Coluna principal - Charts */}
    <div className="lg:col-span-3 space-y-4">
      {children}
    </div>
    
    {/* Sidebar - Controles */}
    <div className="lg:col-span-1 space-y-4">
      {/* Sidebar content será injetado pelos children */}
    </div>
  </div>
);

// 👑 ADMIN LAYOUT (dashboard executivo)
export const AdminDashboardLayout: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => (
  <div className="space-y-6">
    {/* KPIs principais - sempre no topo */}
    <DashboardGrid variant="dashboard" className="mb-8">
      {children}
    </DashboardGrid>
  </div>
);

// 🤝 AFFILIATE LAYOUT (métricas de afiliado)
export const AffiliateDashboardLayout: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => (
  <div className="space-y-6">
    {/* Métricas de afiliado */}
    <DashboardGrid variant="analytics">
      {children}
    </DashboardGrid>
  </div>
);

// 📱 RESPONSIVE SECTION WRAPPER
interface ResponsiveSectionProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export const ResponsiveSection: React.FC<ResponsiveSectionProps> = ({
  children,
  title,
  subtitle,
  action,
  className = ''
}) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className={`bg-white dark:bg-gray-800 rounded-xl p-4 lg:p-6 shadow-lg ${className}`}
  >
    {(title || action) && (
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          {title && (
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        {action && (
          <div className="mt-3 sm:mt-0">
            {action}
          </div>
        )}
      </div>
    )}
    {children}
  </motion.section>
);

// 📊 METRICS ROW (para KPIs horizontais)
export const MetricsRow: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
    {children}
  </div>
);

// 🎮 MOBILE NAVIGATION TABS
interface MobileTabsProps {
  tabs: { label: string; value: string; icon?: React.ReactNode }[];
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const MobileTabs: React.FC<MobileTabsProps> = ({
  tabs,
  activeTab,
  onTabChange
}) => (
  <div className="md:hidden mb-4">
    <div className="flex rounded-lg bg-gray-100 dark:bg-gray-800 p-1">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={`
            flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
            ${activeTab === tab.value
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }
          `}
        >
          {tab.icon}
          <span className="hidden sm:inline">{tab.label}</span>
        </button>
      ))}
    </div>
  </div>
);

// 📱 MOBILE GESTURES CONTAINER
export const MobileGesturesContainer: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => (
  <div className="
    touch-pan-y touch-pan-x
    overscroll-contain
    md:overscroll-auto
    select-none md:select-auto
  ">
    {children}
  </div>
);

// 🎯 QUICK ACTIONS BAR (mobile)
interface QuickAction {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'primary' | 'success' | 'danger';
}

interface QuickActionsProps {
  actions: QuickAction[];
  className?: string;
}

export const QuickActionsBar: React.FC<QuickActionsProps> = ({
  actions,
  className = ''
}) => (
  <div className={`flex gap-2 p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 ${className}`}>
    {actions.map((action, index) => (
      <motion.button
        key={index}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={action.onClick}
        className={`
          flex-1 flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-200
          ${action.variant === 'primary' ? 'bg-blue-500 text-white' :
            action.variant === 'success' ? 'bg-green-500 text-white' :
            action.variant === 'danger' ? 'bg-red-500 text-white' :
            'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }
        `}
      >
        {action.icon}
        <span className="text-xs font-medium">{action.label}</span>
      </motion.button>
    ))}
  </div>
);

// 🔄 REAL-TIME DATA CONTAINER
export const RealTimeContainer: React.FC<{ 
  children: React.ReactNode;
  isLive?: boolean;
  lastUpdate?: Date;
}> = ({ 
  children, 
  isLive = false,
  lastUpdate 
}) => (
  <div className="relative">
    {isLive && (
      <div className="absolute -top-2 -right-2 z-10">
        <div className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          LIVE
        </div>
      </div>
    )}
    {lastUpdate && !isLive && (
      <div className="absolute -top-2 -right-2 z-10">
        <div className="px-2 py-1 bg-gray-500 text-white text-xs rounded-full">
          {lastUpdate.toLocaleTimeString()}
        </div>
      </div>
    )}
    {children}
  </div>
);

export default DashboardGrid;
