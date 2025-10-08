/**
 * Balance Widget Component
 * Displays user's real-time balance from their preferred exchange
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiDollarSign, FiTrendingUp, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';
import { userSettingsService, UserBalance } from '../src/services/userSettingsService';

interface BalanceWidgetProps {
  autoRefresh?: boolean;
  refreshInterval?: number; // in seconds
  showDetails?: boolean;
}

const BalanceWidget: React.FC<BalanceWidgetProps> = ({
  autoRefresh = true,
  refreshInterval = 30,
  showDetails = true
}) => {
  const [balance, setBalance] = useState<UserBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBalance = async (showRefreshAnimation = false) => {
    try {
      if (showRefreshAnimation) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const data = await userSettingsService.getMainnetBalance();
      setBalance(data);
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error('Error fetching balance:', err);
      setError(err.response?.data?.message || 'Failed to fetch balance');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBalance();

    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchBalance();
      }, refreshInterval * 1000);

      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);

    if (diffSecs < 60) return `${diffSecs}s ago`;
    if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)}m ago`;
    return date.toLocaleTimeString();
  };

  if (loading && !balance) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-xl"
      >
        <div className="flex items-center justify-center space-x-2">
          <FiRefreshCw className="animate-spin text-blue-400" size={24} />
          <span className="text-gray-300">Loading balance...</span>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-red-900/20 to-gray-900 rounded-xl p-6 shadow-xl border border-red-500/30"
      >
        <div className="flex items-center space-x-3">
          <FiAlertCircle className="text-red-400" size={24} />
          <div>
            <h3 className="text-red-400 font-semibold">Unable to fetch balance</h3>
            <p className="text-gray-400 text-sm">{error}</p>
            <button
              onClick={() => fetchBalance(true)}
              className="mt-2 text-blue-400 hover:text-blue-300 text-sm flex items-center space-x-1"
            >
              <FiRefreshCw size={14} />
              <span>Retry</span>
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!balance) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-900/30 to-gray-900 rounded-xl p-6 shadow-xl border border-blue-500/30"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <FiDollarSign className="text-blue-400" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              Balance ({balance.exchange.toUpperCase()})
            </h3>
            {lastUpdated && (
              <p className="text-xs text-gray-400">
                Updated {formatTime(lastUpdated)}
                {autoRefresh && <span className="ml-1">🔴 LIVE</span>}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={() => fetchBalance(true)}
          disabled={refreshing}
          className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors"
        >
          <FiRefreshCw
            className={`text-blue-400 ${refreshing ? 'animate-spin' : ''}`}
            size={20}
          />
        </button>
      </div>

      {/* Main Balance */}
      <div className="mb-4">
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold text-white">
            {formatCurrency(balance.total_equity)}
          </span>
          <span className="text-sm text-gray-400">Total Equity</span>
        </div>
      </div>

      {/* Balance Details */}
      {showDetails && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800/50 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Available</p>
            <p className="text-lg font-semibold text-green-400">
              {formatCurrency(balance.available_balance)}
            </p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">In Orders</p>
            <p className="text-lg font-semibold text-yellow-400">
              {formatCurrency(balance.in_orders)}
            </p>
          </div>
        </div>
      )}

      {/* Top Coins */}
      {showDetails && balance.coins && balance.coins.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <p className="text-xs text-gray-400 mb-2">Top Holdings</p>
          <div className="space-y-2">
            {balance.coins.slice(0, 3).map((coin, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-300">{coin.coin}</span>
                <div className="text-right">
                  <p className="text-white font-semibold">
                    {formatCurrency(coin.wallet_balance)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatCurrency(coin.available)} available
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default BalanceWidget;
