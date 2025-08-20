'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ClockIcon,
  CurrencyDollarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserIcon,
  BellIcon,
  CogIcon,
  ChartBarIcon,
  EyeIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

interface Activity {
  id: string;
  type: 'trade' | 'signal' | 'user' | 'system' | 'notification';
  action: string;
  description: string;
  timestamp: Date;
  user?: string;
  amount?: number;
  status?: 'success' | 'failed' | 'pending';
  metadata?: Record<string, any>;
}

interface RecentActivityProps {
  language: 'pt' | 'en';
  userRole: 'admin' | 'premium' | 'basic';
}

const RecentActivity: React.FC<RecentActivityProps> = ({ language, userRole }) => {
  const [filter, setFilter] = useState<'all' | 'trade' | 'signal' | 'user' | 'system'>('all');
  const [showAll, setShowAll] = useState(false);

  const translations = {
    pt: {
      recentActivity: 'Atividade Recente',
      allActivity: 'Toda Atividade',
      trades: 'Trades',
      signals: 'Sinais',
      users: 'Usuários',
      system: 'Sistema',
      viewAll: 'Ver Todas',
      showLess: 'Mostrar Menos',
      filter: 'Filtrar',
      noActivity: 'Nenhuma atividade encontrada',
      just_now: 'agora mesmo',
      minutes_ago: 'min atrás',
      hours_ago: 'h atrás',
      days_ago: 'd atrás',
      // Activity types
      trade_opened: 'Trade aberto',
      trade_closed: 'Trade fechado',
      signal_created: 'Sinal criado',
      signal_updated: 'Sinal atualizado',
      user_registered: 'Usuário registrado',
      user_login: 'Login realizado',
      system_update: 'Sistema atualizado',
      notification_sent: 'Notificação enviada',
      profit: 'lucro',
      loss: 'prejuízo',
      pending: 'pendente',
      success: 'sucesso',
      failed: 'falha'
    },
    en: {
      recentActivity: 'Recent Activity',
      allActivity: 'All Activity',
      trades: 'Trades',
      signals: 'Signals',
      users: 'Users',
      system: 'System',
      viewAll: 'View All',
      showLess: 'Show Less',
      filter: 'Filter',
      noActivity: 'No activity found',
      just_now: 'just now',
      minutes_ago: 'min ago',
      hours_ago: 'h ago',
      days_ago: 'd ago',
      // Activity types
      trade_opened: 'Trade opened',
      trade_closed: 'Trade closed',
      signal_created: 'Signal created',
      signal_updated: 'Signal updated',
      user_registered: 'User registered',
      user_login: 'User logged in',
      system_update: 'System updated',
      notification_sent: 'Notification sent',
      profit: 'profit',
      loss: 'loss',
      pending: 'pending',
      success: 'success',
      failed: 'failed'
    }
  };

  const t = translations[language];

  // Simulated activity data - replace with real API data
  const activities: Activity[] = [
    {
      id: '1',
      type: 'trade',
      action: 'trade_closed',
      description: 'BTC/USDT trade closed with profit',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      user: 'John Doe',
      amount: 234.50,
      status: 'success',
      metadata: { pair: 'BTC/USDT', pnl: 234.50 }
    },
    {
      id: '2',
      type: 'signal',
      action: 'signal_created',
      description: 'New BUY signal for ETH/USDT',
      timestamp: new Date(Date.now() - 12 * 60 * 1000),
      metadata: { pair: 'ETH/USDT', type: 'BUY', confidence: 85 }
    },
    {
      id: '3',
      type: 'user',
      action: 'user_registered',
      description: 'New premium user registered',
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      user: 'Maria Silva',
      metadata: { plan: 'premium' }
    },
    {
      id: '4',
      type: 'trade',
      action: 'trade_opened',
      description: 'ADA/USDT trade opened',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      user: 'Pedro Santos',
      amount: 89.30,
      status: 'pending',
      metadata: { pair: 'ADA/USDT', type: 'BUY' }
    },
    {
      id: '5',
      type: 'system',
      action: 'system_update',
      description: 'Trading algorithm updated',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      metadata: { version: '1.2.3' }
    },
    {
      id: '6',
      type: 'notification',
      action: 'notification_sent',
      description: 'Weekly report sent to all users',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      metadata: { recipients: 1247 }
    },
    {
      id: '7',
      type: 'trade',
      action: 'trade_closed',
      description: 'SOL/USDT trade closed with loss',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      user: 'Ana Costa',
      amount: -45.20,
      status: 'failed',
      metadata: { pair: 'SOL/USDT', pnl: -45.20 }
    },
    {
      id: '8',
      type: 'signal',
      action: 'signal_updated',
      description: 'SELL signal for DOGE/USDT updated',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      metadata: { pair: 'DOGE/USDT', type: 'SELL', confidence: 78 }
    }
  ];

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    return activity.type === filter;
  });

  const displayedActivities = showAll ? filteredActivities : filteredActivities.slice(0, 5);

  const getActivityIcon = (type: Activity['type'], action: string) => {
    switch (type) {
      case 'trade':
        return action.includes('opened') ? ArrowUpIcon : ArrowDownIcon;
      case 'signal':
        return ChartBarIcon;
      case 'user':
        return UserIcon;
      case 'system':
        return CogIcon;
      case 'notification':
        return BellIcon;
      default:
        return ClockIcon;
    }
  };

  const getActivityColor = (type: Activity['type'], status?: string, amount?: number) => {
    if (type === 'trade') {
      if (amount && amount > 0) return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      if (amount && amount < 0) return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
    }
    
    switch (type) {
      case 'signal':
        return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30';
      case 'user':
        return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30';
      case 'system':
        return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30';
      case 'notification':
        return 'text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon className="h-3 w-3 text-green-500" />;
      case 'failed':
        return <XCircleIcon className="h-3 w-3 text-red-500" />;
      case 'pending':
        return <ClockIcon className="h-3 w-3 text-yellow-500" />;
      default:
        return null;
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - timestamp.getTime()) / 1000);
    
    if (diff < 60) return t.just_now;
    if (diff < 3600) return `${Math.floor(diff / 60)} ${t.minutes_ago}`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ${t.hours_ago}`;
    return `${Math.floor(diff / 86400)} ${t.days_ago}`;
  };

  const formatAmount = (amount: number) => {
    const sign = amount > 0 ? '+' : '';
    return `${sign}$${Math.abs(amount).toFixed(2)}`;
  };

  // Filter admin-only activities
  const getFilteredActivitiesForRole = () => {
    if (userRole === 'admin') return displayedActivities;
    return displayedActivities.filter(activity => 
      activity.type !== 'system' || activity.user
    );
  };

  const roleFilteredActivities = getFilteredActivitiesForRole();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {t.recentActivity}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {roleFilteredActivities.length} {t.allActivity.toLowerCase()}
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center space-x-2">
          <FunnelIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">{t.allActivity}</option>
            <option value="trade">{t.trades}</option>
            <option value="signal">{t.signals}</option>
            <option value="user">{t.users}</option>
            {userRole === 'admin' && <option value="system">{t.system}</option>}
          </select>
        </div>
      </div>

      {/* Activity List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        {roleFilteredActivities.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {roleFilteredActivities.map((activity, index) => {
              const Icon = getActivityIcon(activity.type, activity.action);
              const colorClasses = getActivityColor(activity.type, activity.status, activity.amount);
              
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${colorClasses}`}>
                      <Icon className="h-4 w-4" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {t[activity.action as keyof typeof t] || activity.action}
                          </p>
                          {getStatusIcon(activity.status)}
                        </div>
                        <div className="flex items-center space-x-2">
                          {activity.amount && (
                            <span className={`text-sm font-medium ${
                              activity.amount > 0 
                                ? 'text-green-600 dark:text-green-400' 
                                : 'text-red-600 dark:text-red-400'
                            }`}>
                              {formatAmount(activity.amount)}
                            </span>
                          )}
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatTime(activity.timestamp)}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {activity.description}
                      </p>
                      
                      {activity.user && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {language === 'pt' ? 'por' : 'by'} {activity.user}
                        </p>
                      )}

                      {/* Metadata */}
                      {activity.metadata && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {Object.entries(activity.metadata).map(([key, value]) => (
                            <span
                              key={key}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                            >
                              {key}: {value}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center">
            <EyeIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">{t.noActivity}</p>
          </div>
        )}

        {/* View More/Less Button */}
        {filteredActivities.length > 5 && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
            >
              {showAll ? t.showLess : `${t.viewAll} (${filteredActivities.length - 5} ${language === 'pt' ? 'mais' : 'more'})`}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default RecentActivity;
