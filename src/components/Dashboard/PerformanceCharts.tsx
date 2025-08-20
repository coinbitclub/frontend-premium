'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

interface PerformanceChartsProps {
  language: 'pt' | 'en';
  period: string;
  successRate: number;
}

const PerformanceCharts: React.FC<PerformanceChartsProps> = ({ 
  language, 
  period, 
  successRate 
}) => {
  const [selectedChart, setSelectedChart] = useState<'pnl' | 'signals' | 'volume'>('pnl');

  const translations = {
    pt: {
      performanceCharts: 'Gráficos de Performance',
      pnlChart: 'P&L Acumulado',
      signalsChart: 'Taxa de Sucesso',
      volumeChart: 'Volume de Trading',
      totalPnL: 'P&L Total',
      successRate: 'Taxa de Sucesso',
      totalVolume: 'Volume Total',
      period: {
        '24h': 'Últimas 24h',
        '7d': 'Últimos 7 dias',
        '30d': 'Últimos 30 dias',
        '90d': 'Últimos 90 dias'
      },
      winRate: 'Taxa de Vitórias',
      avgReturn: 'Retorno Médio',
      maxDrawdown: 'Máximo Drawdown',
      sharpeRatio: 'Índice Sharpe',
      totalTrades: 'Total de Trades',
      winningTrades: 'Trades Vencedores',
      losingTrades: 'Trades Perdedores',
      bestTrade: 'Melhor Trade',
      worstTrade: 'Pior Trade',
      profitFactor: 'Fator de Lucro'
    },
    en: {
      performanceCharts: 'Performance Charts',
      pnlChart: 'Cumulative P&L',
      signalsChart: 'Success Rate',
      volumeChart: 'Trading Volume',
      totalPnL: 'Total P&L',
      successRate: 'Success Rate',
      totalVolume: 'Total Volume',
      period: {
        '24h': 'Last 24h',
        '7d': 'Last 7 days',
        '30d': 'Last 30 days',
        '90d': 'Last 90 days'
      },
      winRate: 'Win Rate',
      avgReturn: 'Average Return',
      maxDrawdown: 'Max Drawdown',
      sharpeRatio: 'Sharpe Ratio',
      totalTrades: 'Total Trades',
      winningTrades: 'Winning Trades',
      losingTrades: 'Losing Trades',
      bestTrade: 'Best Trade',
      worstTrade: 'Worst Trade',
      profitFactor: 'Profit Factor'
    }
  };

  const t = translations[language];

  // Simulated chart data - replace with real API data
  const chartData = {
    pnl: [
      { date: '2024-01-01', value: 0 },
      { date: '2024-01-02', value: 1250 },
      { date: '2024-01-03', value: 980 },
      { date: '2024-01-04', value: 2340 },
      { date: '2024-01-05', value: 1890 },
      { date: '2024-01-06', value: 3450 },
      { date: '2024-01-07', value: 4120 }
    ],
    signals: [
      { date: '2024-01-01', value: 65 },
      { date: '2024-01-02', value: 72 },
      { date: '2024-01-03', value: 68 },
      { date: '2024-01-04', value: 85 },
      { date: '2024-01-05', value: 78 },
      { date: '2024-01-06', value: 89 },
      { date: '2024-01-07', value: successRate }
    ],
    volume: [
      { date: '2024-01-01', value: 125000 },
      { date: '2024-01-02', value: 189000 },
      { date: '2024-01-03', value: 156000 },
      { date: '2024-01-04', value: 234000 },
      { date: '2024-01-05', value: 198000 },
      { date: '2024-01-06', value: 267000 },
      { date: '2024-01-07', value: 295000 }
    ]
  };

  const stats = {
    totalPnL: 4120.50,
    winRate: successRate,
    avgReturn: 2.3,
    maxDrawdown: -8.5,
    sharpeRatio: 1.82,
    totalTrades: 156,
    winningTrades: 134,
    losingTrades: 22,
    bestTrade: 450.75,
    worstTrade: -89.30,
    profitFactor: 2.85,
    totalVolume: 1264000
  };

  const chartTabs = [
    { key: 'pnl', label: t.pnlChart, icon: ArrowTrendingUpIcon },
    { key: 'signals', label: t.signalsChart, icon: ChartBarIcon },
    { key: 'volume', label: t.volumeChart, icon: ArrowTrendingDownIcon }
  ];

  const getChartColor = (type: string) => {
    switch (type) {
      case 'pnl':
        return 'from-green-500 to-emerald-600';
      case 'signals':
        return 'from-blue-500 to-indigo-600';
      case 'volume':
        return 'from-purple-500 to-violet-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const renderSimpleChart = (data: any[], type: string) => {
    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const range = maxValue - minValue;

    return (
      <div className="h-64 flex items-end space-x-2 px-4 pb-4">
        {data.map((point, index) => {
          const height = range > 0 ? ((point.value - minValue) / range) * 200 + 20 : 50;
          return (
            <motion.div
              key={index}
              initial={{ height: 0 }}
              animate={{ height }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`flex-1 bg-gradient-to-t ${getChartColor(type)} rounded-t-sm opacity-80 hover:opacity-100 transition-opacity cursor-pointer relative group`}
              style={{ height: `${height}px` }}
            >
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {type === 'pnl' && '$'}{point.value.toLocaleString()}{type === 'signals' && '%'}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t.performanceCharts}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t.period[period as keyof typeof t.period]}
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <CalendarIcon className="h-4 w-4" />
          <span>{t.period[period as keyof typeof t.period]}</span>
        </div>
      </div>

      {/* Chart Navigation */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        {chartTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setSelectedChart(tab.key as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedChart === tab.key
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Chart */}
      <motion.div
        key={selectedChart}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {chartTabs.find(tab => tab.key === selectedChart)?.label}
            </h3>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedChart === 'pnl' && '$'}{stats[selectedChart === 'pnl' ? 'totalPnL' : selectedChart === 'signals' ? 'winRate' : 'totalVolume'].toLocaleString()}{selectedChart === 'signals' && '%'}
              </p>
              <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                <ArrowUpIcon className="h-4 w-4 mr-1" />
                +12.5% vs {language === 'pt' ? 'período anterior' : 'previous period'}
              </div>
            </div>
          </div>
        </div>
        
        {renderSimpleChart(chartData[selectedChart], selectedChart)}
      </motion.div>

      {/* Performance Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t.winRate}</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">
                {stats.winRate}%
              </p>
            </div>
            <ArrowTrendingUpIcon className="h-8 w-8 text-green-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t.avgReturn}</p>
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                +{stats.avgReturn}%
              </p>
            </div>
            <ChartBarIcon className="h-8 w-8 text-blue-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t.maxDrawdown}</p>
              <p className="text-xl font-bold text-red-600 dark:text-red-400">
                {stats.maxDrawdown}%
              </p>
            </div>
            <ArrowTrendingDownIcon className="h-8 w-8 text-red-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t.sharpeRatio}</p>
              <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                {stats.sharpeRatio}
              </p>
            </div>
            <ArrowTrendingUpIcon className="h-8 w-8 text-purple-500" />
          </div>
        </motion.div>
      </div>

      {/* Detailed Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {language === 'pt' ? 'Estatísticas Detalhadas' : 'Detailed Statistics'}
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">{t.totalTrades}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.totalTrades}
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">{t.winningTrades}</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.winningTrades}
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">{t.losingTrades}</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {stats.losingTrades}
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">{t.bestTrade}</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              +${stats.bestTrade}
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">{t.worstTrade}</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              ${stats.worstTrade}
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">{t.profitFactor}</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.profitFactor}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PerformanceCharts;
