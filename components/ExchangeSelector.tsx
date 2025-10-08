/**
 * Exchange Selector Component
 * Allows users to select their preferred exchange (Bybit or Binance)
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';
import { userSettingsService, ExchangeInfo } from '../src/services/userSettingsService';

interface ExchangeSelectorProps {
  onExchangeChange?: (exchange: string) => void;
}

const ExchangeSelector: React.FC<ExchangeSelectorProps> = ({
  onExchangeChange
}) => {
  const [exchanges, setExchanges] = useState<ExchangeInfo[]>([]);
  const [preferredExchange, setPreferredExchange] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExchanges = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userSettingsService.getConfiguredExchanges();
      setExchanges(data.exchanges);
      setPreferredExchange(data.preferred_exchange);
    } catch (err: any) {
      console.error('Error fetching exchanges:', err);
      setError(err.response?.data?.message || 'Failed to fetch exchanges');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExchanges();
  }, []);

  const handleExchangeSelect = async (exchange: string) => {
    if (exchange === preferredExchange || updating) return;

    // Check if exchange is configured and active
    const exchangeInfo = exchanges.find(e => e.exchange.toLowerCase() === exchange.toLowerCase());
    if (!exchangeInfo) {
      setError(`${exchange} is not configured`);
      return;
    }

    if (!exchangeInfo.enabled || !exchangeInfo.verified) {
      setError(`${exchange} API keys must be enabled and verified`);
      return;
    }

    try {
      setUpdating(true);
      setError(null);
      await userSettingsService.updatePreferredExchange(exchange);
      setPreferredExchange(exchange);

      if (onExchangeChange) {
        onExchangeChange(exchange);
      }

      // Refresh exchange list
      await fetchExchanges();
    } catch (err: any) {
      console.error('Error updating preferred exchange:', err);
      setError(err.response?.data?.message || 'Failed to update preferred exchange');
    } finally {
      setUpdating(false);
    }
  };

  const getExchangeStatus = (exchange: ExchangeInfo) => {
    if (!exchange.enabled) return { text: 'Disabled', color: 'text-gray-500' };
    if (!exchange.verified) return { text: 'Unverified', color: 'text-yellow-500' };
    if (!exchange.is_active) return { text: 'Inactive', color: 'text-red-500' };
    return { text: 'Active', color: 'text-green-500' };
  };

  if (loading) {
    return (
      <div className="bg-gray-800/50 rounded-lg p-6">
        <div className="flex items-center justify-center space-x-2">
          <FiRefreshCw className="animate-spin text-blue-400" size={20} />
          <span className="text-gray-300">Loading exchanges...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 rounded-lg p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-2">Preferred Exchange</h3>
        <p className="text-sm text-gray-400">
          Select which exchange you want to use for trading. You must have API keys configured for the exchange.
        </p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start space-x-2"
        >
          <FiAlertCircle className="text-red-400 mt-0.5" size={16} />
          <p className="text-sm text-red-400">{error}</p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bybit Option */}
        {exchanges.find(e => e.exchange.toLowerCase() === 'bybit') ? (
          <ExchangeCard
            exchange={exchanges.find(e => e.exchange.toLowerCase() === 'bybit')!}
            isPreferred={preferredExchange === 'bybit'}
            onSelect={() => handleExchangeSelect('bybit')}
            updating={updating}
            getStatus={getExchangeStatus}
          />
        ) : (
          <EmptyExchangeCard exchangeName="Bybit" />
        )}

        {/* Binance Option */}
        {exchanges.find(e => e.exchange.toLowerCase() === 'binance') ? (
          <ExchangeCard
            exchange={exchanges.find(e => e.exchange.toLowerCase() === 'binance')!}
            isPreferred={preferredExchange === 'binance'}
            onSelect={() => handleExchangeSelect('binance')}
            updating={updating}
            getStatus={getExchangeStatus}
          />
        ) : (
          <EmptyExchangeCard exchangeName="Binance" />
        )}
      </div>

      {exchanges.length === 0 && (
        <div className="text-center py-8">
          <FiAlertCircle className="mx-auto text-yellow-400 mb-2" size={32} />
          <p className="text-gray-400">No exchanges configured</p>
          <p className="text-sm text-gray-500 mt-1">
            Please add API keys in the API Keys section below
          </p>
        </div>
      )}
    </div>
  );
};

interface ExchangeCardProps {
  exchange: ExchangeInfo;
  isPreferred: boolean;
  onSelect: () => void;
  updating: boolean;
  getStatus: (exchange: ExchangeInfo) => { text: string; color: string };
}

const ExchangeCard: React.FC<ExchangeCardProps> = ({
  exchange,
  isPreferred,
  onSelect,
  updating,
  getStatus
}) => {
  const status = getStatus(exchange);
  const canSelect = exchange.enabled && exchange.verified && exchange.is_active;

  return (
    <motion.button
      whileHover={canSelect ? { scale: 1.02 } : {}}
      whileTap={canSelect ? { scale: 0.98 } : {}}
      onClick={onSelect}
      disabled={updating || !canSelect}
      className={`
        relative p-4 rounded-lg border-2 transition-all text-left
        ${isPreferred
          ? 'border-blue-500 bg-blue-500/10'
          : canSelect
            ? 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
            : 'border-gray-700 bg-gray-800/30 opacity-60 cursor-not-allowed'
        }
      `}
    >
      {isPreferred && (
        <div className="absolute top-2 right-2">
          <div className="p-1 bg-blue-500 rounded-full">
            <FiCheck className="text-white" size={14} />
          </div>
        </div>
      )}

      <div className="flex items-center space-x-3 mb-2">
        <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
          <span className="text-xl font-bold text-white">
            {exchange.exchange.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h4 className="text-white font-semibold">{exchange.exchange.toUpperCase()}</h4>
          <p className={`text-xs ${status.color}`}>{status.text}</p>
        </div>
      </div>

      <div className="text-xs text-gray-400 space-y-1">
        <p>API Key: {exchange.api_key_preview}</p>
        {isPreferred && (
          <p className="text-blue-400 font-semibold">✓ Currently Selected</p>
        )}
      </div>

      {updating && (
        <div className="absolute inset-0 bg-gray-900/50 rounded-lg flex items-center justify-center">
          <FiRefreshCw className="animate-spin text-blue-400" size={24} />
        </div>
      )}
    </motion.button>
  );
};

const EmptyExchangeCard: React.FC<{ exchangeName: string }> = ({ exchangeName }) => {
  return (
    <div className="p-4 rounded-lg border-2 border-dashed border-gray-700 bg-gray-800/20">
      <div className="text-center py-4">
        <div className="w-12 h-12 bg-gray-700/50 rounded-lg flex items-center justify-center mx-auto mb-2">
          <span className="text-xl font-bold text-gray-500">
            {exchangeName.charAt(0)}
          </span>
        </div>
        <p className="text-gray-400 text-sm">{exchangeName}</p>
        <p className="text-gray-500 text-xs mt-1">Not configured</p>
      </div>
    </div>
  );
};

export default ExchangeSelector;
