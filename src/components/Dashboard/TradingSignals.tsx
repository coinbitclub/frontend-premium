'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  FunnelIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface Signal {
  id: string;
  pair: string;
  type: 'BUY' | 'SELL';
  status: 'active' | 'completed' | 'cancelled';
  entryPrice: number;
  currentPrice: number;
  targetPrice: number;
  stopLoss: number;
  pnl: number;
  pnlPercent: number;
  confidence: number;
  timeframe: string;
  timestamp: Date;
  volume: number;
}

interface TradingSignalsProps {
  language: 'pt' | 'en';
  period: string;
}

const TradingSignals: React.FC<TradingSignalsProps> = ({ language, period }) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');
  const [sortBy, setSortBy] = useState<'timestamp' | 'pnl' | 'confidence'>('timestamp');

  const translations = {
    pt: {
      tradingSignals: 'Sinais de Trading',
      allSignals: 'Todos os Sinais',
      activeSignals: 'Sinais Ativos',
      completedSignals: 'Concluídos',
      cancelledSignals: 'Cancelados',
      pair: 'Par',
      type: 'Tipo',
      entry: 'Entrada',
      current: 'Atual',
      target: 'Alvo',
      stopLoss: 'Stop Loss',
      pnl: 'P&L',
      confidence: 'Confiança',
      time: 'Tempo',
      status: 'Status',
      active: 'Ativo',
      completed: 'Concluído',
      cancelled: 'Cancelado',
      buy: 'COMPRA',
      sell: 'VENDA',
      refresh: 'Atualizar',
      filter: 'Filtrar',
      sortBy: 'Ordenar por',
      timestamp: 'Horário',
      noSignals: 'Nenhum sinal encontrado',
      volume: 'Volume'
    },
    en: {
      tradingSignals: 'Trading Signals',
      allSignals: 'All Signals',
      activeSignals: 'Active Signals',
      completedSignals: 'Completed',
      cancelledSignals: 'Cancelled',
      pair: 'Pair',
      type: 'Type',
      entry: 'Entry',
      current: 'Current',
      target: 'Target',
      stopLoss: 'Stop Loss',
      pnl: 'P&L',
      confidence: 'Confidence',
      time: 'Time',
      status: 'Status',
      active: 'Active',
      completed: 'Completed',
      cancelled: 'Cancelled',
      buy: 'BUY',
      sell: 'SELL',
      refresh: 'Refresh',
      filter: 'Filter',
      sortBy: 'Sort by',
      timestamp: 'Timestamp',
      noSignals: 'No signals found',
      volume: 'Volume'
    }
  };

  const t = translations[language];

  // Simulated data - replace with real API data
  const signals: Signal[] = [
    {
      id: '1',
      pair: 'BTC/USDT',
      type: 'BUY',
      status: 'active',
      entryPrice: 45200,
      currentPrice: 46150,
      targetPrice: 47500,
      stopLoss: 44000,
      pnl: 950,
      pnlPercent: 2.1,
      confidence: 85,
      timeframe: '4H',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      volume: 125000
    },
    {
      id: '2',
      pair: 'ETH/USDT',
      type: 'SELL',
      status: 'completed',
      entryPrice: 3250,
      currentPrice: 3180,
      targetPrice: 3100,
      stopLoss: 3350,
      pnl: 70,
      pnlPercent: 2.15,
      confidence: 92,
      timeframe: '1H',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      volume: 89000
    },
    {
      id: '3',
      pair: 'ADA/USDT',
      type: 'BUY',
      status: 'active',
      entryPrice: 0.45,
      currentPrice: 0.47,
      targetPrice: 0.52,
      stopLoss: 0.42,
      pnl: 0.02,
      pnlPercent: 4.44,
      confidence: 78,
      timeframe: '2H',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      volume: 45000
    },
    {
      id: '4',
      pair: 'SOL/USDT',
      type: 'SELL',
      status: 'cancelled',
      entryPrice: 155,
      currentPrice: 158,
      targetPrice: 145,
      stopLoss: 162,
      pnl: -3,
      pnlPercent: -1.94,
      confidence: 65,
      timeframe: '1D',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      volume: 67000
    }
  ];

  const filteredSignals = signals.filter(signal => {
    if (filter === 'all') return true;
    return signal.status === filter;
  });

  const sortedSignals = [...filteredSignals].sort((a, b) => {
    switch (sortBy) {
      case 'pnl':
        return b.pnl - a.pnl;
      case 'confidence':
        return b.confidence - a.confidence;
      case 'timestamp':
      default:
        return b.timestamp.getTime() - a.timestamp.getTime();
    }
  });

  const getStatusIcon = (status: Signal['status']) => {
    switch (status) {
      case 'active':
        return <ClockIcon className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <XCircleIcon className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: Signal['status']) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    }
  };

  const getPnLColor = (pnl: number) => {
    if (pnl > 0) return 'text-green-600 dark:text-green-400';
    if (pnl < 0) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 dark:text-green-400';
    if (confidence >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - timestamp.getTime()) / 1000 / 60);
    
    if (diff < 60) {
      return `${diff}m ${language === 'pt' ? 'atrás' : 'ago'}`;
    } else if (diff < 1440) {
      const hours = Math.floor(diff / 60);
      return `${hours}h ${language === 'pt' ? 'atrás' : 'ago'}`;
    } else {
      return timestamp.toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US');
    }
  };

  const formatPrice = (price: number) => {
    if (price < 1) {
      return price.toFixed(4);
    } else if (price < 100) {
      return price.toFixed(2);
    } else {
      return price.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t.tradingSignals}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {sortedSignals.length} {t.allSignals.toLowerCase()}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              // Refresh signals
              if (typeof gtag !== 'undefined') {
                gtag('event', 'refresh_signals', {
                  event_category: 'engagement'
                });
              }
            }}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title={t.refresh}
          >
            <ArrowPathIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="flex items-center space-x-2">
          <FunnelIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t.filter}:
          </span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">{t.allSignals}</option>
            <option value="active">{t.activeSignals}</option>
            <option value="completed">{t.completedSignals}</option>
            <option value="cancelled">{t.cancelledSignals}</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t.sortBy}:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="timestamp">{t.timestamp}</option>
            <option value="pnl">{t.pnl}</option>
            <option value="confidence">{t.confidence}</option>
          </select>
        </div>
      </div>

      {/* Signals Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.pair}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.type}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.entry}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.current}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.target}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.pnl}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.confidence}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.status}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.time}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {sortedSignals.length > 0 ? (
                sortedSignals.map((signal, index) => (
                  <motion.tr
                    key={signal.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {signal.pair}
                        </span>
                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                          {signal.timeframe}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {signal.type === 'BUY' ? (
                          <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
                        )}
                        <span className={`text-sm font-medium ${
                          signal.type === 'BUY' 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {signal.type === 'BUY' ? t.buy : t.sell}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      ${formatPrice(signal.entryPrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      ${formatPrice(signal.currentPrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      ${formatPrice(signal.targetPrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <span className={`font-medium ${getPnLColor(signal.pnl)}`}>
                          ${signal.pnl > 0 ? '+' : ''}{signal.pnl.toFixed(2)}
                        </span>
                        <span className={`block text-xs ${getPnLColor(signal.pnl)}`}>
                          {signal.pnlPercent > 0 ? '+' : ''}{signal.pnlPercent.toFixed(2)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getConfidenceColor(signal.confidence)}`}>
                        {signal.confidence}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(signal.status)}`}>
                        {getStatusIcon(signal.status)}
                        <span className="ml-1">{t[signal.status]}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatTime(signal.timestamp)}
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">{t.noSignals}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default TradingSignals;
