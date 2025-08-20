'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpIcon,
  ArrowDownIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface DashboardOverviewProps {
  language: 'pt' | 'en';
  period: string;
  successRate: number;
}

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ElementType;
  color: string;
  language: 'pt' | 'en';
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  color,
  language
}) => {
  const getChangeIcon = () => {
    if (changeType === 'increase') return ArrowUpIcon;
    if (changeType === 'decrease') return ArrowDownIcon;
    return null;
  };

  const getChangeColor = () => {
    if (changeType === 'increase') return 'text-green-600 dark:text-green-400';
    if (changeType === 'decrease') return 'text-red-600 dark:text-red-400';
    return 'text-gray-500 dark:text-gray-400';
  };

  const ChangeIcon = getChangeIcon();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {title}
            </h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {value}
            </p>
          </div>
        </div>
        
        {ChangeIcon && (
          <div className={`flex items-center space-x-1 ${getChangeColor()}`}>
            <ChangeIcon className="h-4 w-4" />
            <span className="text-sm font-medium">
              {Math.abs(change)}%
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  language,
  period,
  successRate
}) => {
  const translations = {
    pt: {
      overview: 'Visão Geral',
      totalBalance: 'Saldo Total',
      activeSignals: 'Sinais Ativos',
      successRate: 'Taxa de Sucesso',
      totalUsers: 'Usuários Totais',
      todayPnL: 'P&L Hoje',
      weeklyGrowth: 'Crescimento Semanal',
      recentPerformance: 'Performance Recente',
      signalAccuracy: 'Precisão dos Sinais',
      tradingVolume: 'Volume de Trading',
      activeTrades: 'Trades Ativos',
      completedTrades: 'Trades Concluídos',
      period: {
        '24h': 'Últimas 24h',
        '7d': 'Últimos 7 dias',
        '30d': 'Últimos 30 dias',
        '90d': 'Últimos 90 dias'
      }
    },
    en: {
      overview: 'Overview',
      totalBalance: 'Total Balance',
      activeSignals: 'Active Signals',
      successRate: 'Success Rate',
      totalUsers: 'Total Users',
      todayPnL: "Today's P&L",
      weeklyGrowth: 'Weekly Growth',
      recentPerformance: 'Recent Performance',
      signalAccuracy: 'Signal Accuracy',
      tradingVolume: 'Trading Volume',
      activeTrades: 'Active Trades',
      completedTrades: 'Completed Trades',
      period: {
        '24h': 'Last 24h',
        '7d': 'Last 7 days',
        '30d': 'Last 30 days',
        '90d': 'Last 90 days'
      }
    }
  };

  const t = translations[language];

  // Simulated data - replace with real API data
  const metrics = [
    {
      title: t.totalBalance,
      value: '$127,450.80',
      change: 12.5,
      changeType: 'increase' as const,
      icon: CurrencyDollarIcon,
      color: 'bg-gradient-to-br from-green-500 to-green-600'
    },
    {
      title: t.activeSignals,
      value: '24',
      change: 8.2,
      changeType: 'increase' as const,
      icon: ArrowTrendingUpIcon,
      color: 'bg-gradient-to-br from-blue-500 to-blue-600'
    },
    {
      title: t.successRate,
      value: `${successRate}%`,
      change: 3.1,
      changeType: 'increase' as const,
      icon: CheckCircleIcon,
      color: 'bg-gradient-to-br from-purple-500 to-purple-600'
    },
    {
      title: t.totalUsers,
      value: '1,247',
      change: 15.3,
      changeType: 'increase' as const,
      icon: UserGroupIcon,
      color: 'bg-gradient-to-br from-orange-500 to-orange-600'
    }
  ];

  const performanceData = [
    {
      title: t.todayPnL,
      value: '+$2,340.50',
      change: 4.2,
      changeType: 'increase' as const,
      icon: ChartBarIcon,
      color: 'bg-gradient-to-br from-emerald-500 to-emerald-600'
    },
    {
      title: t.weeklyGrowth,
      value: '+18.7%',
      change: 2.8,
      changeType: 'increase' as const,
      icon: ArrowTrendingUpIcon,
      color: 'bg-gradient-to-br from-indigo-500 to-indigo-600'
    }
  ];

  const tradeStats = {
    activeTrades: 12,
    completedTrades: 156,
    winRate: successRate,
    totalVolume: '$45,230.00'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t.overview}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t.period[period as keyof typeof t.period]} • {t.successRate}: {successRate}%
          </p>
        </div>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <MetricCard {...metric} language={language} />
          </motion.div>
        ))}
      </div>

      {/* Performance Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {performanceData.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
          >
            <MetricCard {...metric} language={language} />
          </motion.div>
        ))}
      </div>

      {/* Detailed Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t.recentPerformance}
        </h3>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <ArrowTrendingUpIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {tradeStats.activeTrades}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t.activeTrades}
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {tradeStats.completedTrades}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t.completedTrades}
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {tradeStats.winRate}%
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t.signalAccuracy}
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {tradeStats.totalVolume}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t.tradingVolume}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Success Rate Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800"
      >
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t.signalAccuracy}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {t.period[period as keyof typeof t.period]}
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {successRate}%
            </p>
            <div className="flex items-center text-sm text-green-600 dark:text-green-400 mt-1">
              <ArrowUpIcon className="h-4 w-4 mr-1" />
              +2.3% vs {language === 'pt' ? 'período anterior' : 'previous period'}
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${successRate}%` }}
              transition={{ duration: 1, delay: 1 }}
              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardOverview;
