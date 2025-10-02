import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../hooks/useLanguage';
import { useAPIKeys } from '../../hooks/useAPIKeys';
import { useToast } from '../../components/Toast';
import UserLayout from '../../components/UserLayout';
import {
  FiKey,
  FiPlus,
  FiTrash2,
  FiCheck,
  FiX,
  FiRefreshCw,
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle,
  FiClock
} from 'react-icons/fi';

interface APIKeyFormData {
  apiKey: string;
  apiSecret: string;
}

const APIKeysSettings: React.FC = () => {
  const { language } = useLanguage();
  const { showToast } = useToast();
  const {
    bybit,
    binance,
    loading,
    error,
    addAPIKey,
    verifyAPIKey,
    deleteAPIKey,
    refreshAPIKeys,
    hasAnyKeys,
    hasVerifiedKeys
  } = useAPIKeys();

  const [showForm, setShowForm] = useState<{ bybit: boolean; binance: boolean }>({
    bybit: false,
    binance: false
  });

  const [formData, setFormData] = useState<{ bybit: APIKeyFormData; binance: APIKeyFormData }>({
    bybit: { apiKey: '', apiSecret: '' },
    binance: { apiKey: '', apiSecret: '' }
  });

  const [processing, setProcessing] = useState<{ bybit: boolean; binance: boolean }>({
    bybit: false,
    binance: false
  });

  const handleAddKey = async (exchange: 'bybit' | 'binance') => {
    const data = formData[exchange];

    // Trim whitespace from inputs
    const apiKey = data.apiKey.trim();
    const apiSecret = data.apiSecret.trim();

    if (!apiKey || !apiSecret) {
      showToast(
        language === 'pt' ? 'Preencha todos os campos' : 'Fill all fields',
        'error'
      );
      return;
    }

    setProcessing(prev => ({ ...prev, [exchange]: true }));

    try {
      const result = await addAPIKey(exchange, apiKey, apiSecret);

      if (result.success) {
        showToast(
          language === 'pt'
            ? `API Key ${exchange} adicionada com sucesso!`
            : `${exchange} API Key added successfully!`,
          'success'
        );
        setShowForm(prev => ({ ...prev, [exchange]: false }));
        setFormData(prev => ({
          ...prev,
          [exchange]: { apiKey: '', apiSecret: '' }
        }));
      } else {
        showToast(result.error || 'Error adding API key', 'error');
      }
    } catch (error) {
      showToast(
        language === 'pt' ? 'Erro ao adicionar API key' : 'Error adding API key',
        'error'
      );
    } finally {
      setProcessing(prev => ({ ...prev, [exchange]: false }));
    }
  };

  const handleVerifyKey = async (exchange: 'bybit' | 'binance') => {
    setProcessing(prev => ({ ...prev, [exchange]: true }));

    try {
      const result = await verifyAPIKey(exchange);

      if (result.success) {
        showToast(
          language === 'pt'
            ? `API Key ${exchange} verificada com sucesso!`
            : `${exchange} API Key verified successfully!`,
          'success'
        );
      } else {
        showToast(result.error || 'Error verifying API key', 'error');
      }
    } catch (error) {
      showToast(
        language === 'pt' ? 'Erro ao verificar API key' : 'Error verifying API key',
        'error'
      );
    } finally {
      setProcessing(prev => ({ ...prev, [exchange]: false }));
    }
  };

  const handleDeleteKey = async (exchange: 'bybit' | 'binance') => {
    if (!confirm(language === 'pt'
      ? `Tem certeza que deseja remover a API Key ${exchange}?`
      : `Are you sure you want to remove ${exchange} API Key?`
    )) {
      return;
    }

    setProcessing(prev => ({ ...prev, [exchange]: true }));

    try {
      const result = await deleteAPIKey(exchange);

      if (result.success) {
        showToast(
          language === 'pt'
            ? `API Key ${exchange} removida com sucesso`
            : `${exchange} API Key removed successfully`,
          'success'
        );
      } else {
        showToast(result.error || 'Error deleting API key', 'error');
      }
    } catch (error) {
      showToast(
        language === 'pt' ? 'Erro ao remover API key' : 'Error deleting API key',
        'error'
      );
    } finally {
      setProcessing(prev => ({ ...prev, [exchange]: false }));
    }
  };

  const renderExchangeCard = (
    exchange: 'bybit' | 'binance',
    status: typeof bybit | typeof binance,
    color: string
  ) => {
    const isConnected = status?.has_key || false;
    const isVerified = status?.verified || false;
    const isEnabled = status?.enabled || false;

    return (
      <div className={`bg-gradient-to-br from-${color}-900/30 to-${color}-800/30 backdrop-blur-sm rounded-xl border border-${color}-500/30 p-6`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 bg-${color}-500/20 rounded-full flex items-center justify-center`}>
              <span className={`text-${color}-400 font-bold text-lg`}>
                {exchange === 'bybit' ? 'By' : 'B'}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white capitalize">{exchange}</h3>
              <p className="text-gray-400 text-sm">
                {language === 'pt' ? 'Exchange de Criptomoedas' : 'Cryptocurrency Exchange'}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2">
            {isConnected && (
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                isVerified
                  ? 'bg-green-500/20 border border-green-500/30'
                  : 'bg-yellow-500/20 border border-yellow-500/30'
              }`}>
                {isVerified ? (
                  <><FiCheckCircle className="text-green-400 text-sm" />
                  <span className="text-green-400 text-xs font-medium">
                    {language === 'pt' ? 'Verificado' : 'Verified'}
                  </span></>
                ) : (
                  <><FiClock className="text-yellow-400 text-sm" />
                  <span className="text-yellow-400 text-xs font-medium">
                    {language === 'pt' ? 'Pendente' : 'Pending'}
                  </span></>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        {isConnected ? (
          <div className="space-y-4">
            {/* API Key Info */}
            <div className="p-4 bg-black/20 rounded-lg border border-gray-700/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">API Key</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  isEnabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {isEnabled ? (language === 'pt' ? 'Ativo' : 'Active') : (language === 'pt' ? 'Inativo' : 'Inactive')}
                </span>
              </div>
              <div className="text-white font-mono text-sm">{status?.masked_key || '****...****'}</div>
            </div>

            {/* Verification Status */}
            {status?.verified_at && (
              <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-center gap-2 text-green-400 text-sm">
                  <FiCheckCircle />
                  <span>
                    {language === 'pt' ? 'Verificado em' : 'Verified at'}{' '}
                    {new Date(status.verified_at).toLocaleString(language === 'pt' ? 'pt-BR' : 'en-US')}
                  </span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              {!isVerified && (
                <button
                  onClick={() => handleVerifyKey(exchange)}
                  disabled={processing[exchange]}
                  className={`flex-1 bg-${color}-500 hover:bg-${color}-600 disabled:bg-${color}-500/50 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2`}
                >
                  {processing[exchange] ? (
                    <><FiRefreshCw className="w-4 h-4 animate-spin" />
                    {language === 'pt' ? 'Verificando...' : 'Verifying...'}</>
                  ) : (
                    <><FiCheck className="w-4 h-4" />
                    {language === 'pt' ? 'Verificar' : 'Verify'}</>
                  )}
                </button>
              )}
              <button
                onClick={() => handleDeleteKey(exchange)}
                disabled={processing[exchange]}
                className="bg-red-500/20 hover:bg-red-500/30 disabled:bg-red-500/10 text-red-400 font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <FiTrash2 className="w-4 h-4" />
                {language === 'pt' ? 'Remover' : 'Remove'}
              </button>
            </div>
          </div>
        ) : showForm[exchange] ? (
          <div className="space-y-4">
            {/* API Key Input */}
            <div>
              <label className="block text-gray-300 text-sm mb-2">
                API Key
              </label>
              <input
                type="text"
                value={formData[exchange].apiKey}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  [exchange]: { ...prev[exchange], apiKey: e.target.value }
                }))}
                className="w-full bg-black/20 border border-gray-600 rounded-lg p-3 text-white focus:border-${color}-400 focus:outline-none font-mono text-sm"
                placeholder={`Enter your ${exchange} API Key`}
              />
            </div>

            {/* API Secret Input */}
            <div>
              <label className="block text-gray-300 text-sm mb-2">
                API Secret
              </label>
              <input
                type="password"
                value={formData[exchange].apiSecret}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  [exchange]: { ...prev[exchange], apiSecret: e.target.value }
                }))}
                className="w-full bg-black/20 border border-gray-600 rounded-lg p-3 text-white focus:border-${color}-400 focus:outline-none font-mono text-sm"
                placeholder={`Enter your ${exchange} API Secret`}
              />
            </div>

            {/* Warning */}
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <div className="flex items-start gap-2 text-yellow-400 text-sm">
                <FiAlertCircle className="flex-shrink-0 mt-0.5" />
                <p>
                  {language === 'pt'
                    ? 'Importante: Crie uma API key apenas com permissões de leitura e trading. NUNCA habilite permissão de saque!'
                    : 'Important: Create an API key with only read and trading permissions. NEVER enable withdrawal permission!'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => handleAddKey(exchange)}
                disabled={processing[exchange]}
                className={`flex-1 bg-${color}-500 hover:bg-${color}-600 disabled:bg-${color}-500/50 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2`}
              >
                {processing[exchange] ? (
                  <><FiRefreshCw className="w-4 h-4 animate-spin" />
                  {language === 'pt' ? 'Adicionando...' : 'Adding...'}</>
                ) : (
                  <><FiCheck className="w-4 h-4" />
                  {language === 'pt' ? 'Adicionar' : 'Add'}</>
                )}
              </button>
              <button
                onClick={() => setShowForm(prev => ({ ...prev, [exchange]: false }))}
                disabled={processing[exchange]}
                className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-600/50 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <FiX className="w-4 h-4" />
                {language === 'pt' ? 'Cancelar' : 'Cancel'}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <FiKey className="w-12 h-12 mx-auto mb-3 text-gray-500 opacity-50" />
            <p className="text-gray-400 mb-4">
              {language === 'pt'
                ? `API ${exchange} não conectada`
                : `${exchange} API not connected`}
            </p>
            <button
              onClick={() => setShowForm(prev => ({ ...prev, [exchange]: true }))}
              className={`bg-${color}-500/20 hover:bg-${color}-500/30 text-${color}-400 px-6 py-2 rounded-lg transition-colors flex items-center gap-2 mx-auto`}
            >
              <FiPlus className="w-4 h-4" />
              {language === 'pt' ? 'Conectar' : 'Connect'}
            </button>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <UserLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-400 mb-4 mx-auto"></div>
            <h2 className="text-2xl font-bold text-white mb-2">CoinBitClub</h2>
            <p className="text-gray-400">
              {language === 'pt' ? 'Carregando API Keys...' : 'Loading API Keys...'}
            </p>
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent mb-2">
                {language === 'pt' ? 'API Keys' : 'API Keys'}
              </h1>
              <p className="text-gray-400 text-lg">
                {language === 'pt'
                  ? 'Conecte suas exchanges para começar a operar'
                  : 'Connect your exchanges to start trading'}
              </p>
            </div>
            <button
              onClick={refreshAPIKeys}
              className="p-3 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl border border-gray-600/50 hover:border-orange-400/50 transition-all group"
            >
              <FiRefreshCw className="text-orange-400 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </motion.div>

        {/* Info Banner */}
        {!hasAnyKeys && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 p-4 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30 rounded-xl"
          >
            <div className="flex items-start gap-3">
              <FiAlertCircle className="text-orange-400 text-xl flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-orange-400 font-bold mb-1">
                  {language === 'pt' ? 'Ação Necessária' : 'Action Required'}
                </h3>
                <p className="text-gray-300 text-sm">
                  {language === 'pt'
                    ? 'Você precisa conectar pelo menos uma API key (Bybit ou Binance) para começar a operar. Seus fundos ficam seguros na sua própria exchange!'
                    : 'You need to connect at least one API key (Bybit or Binance) to start trading. Your funds stay safe in your own exchange!'}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Exchange Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {renderExchangeCard('bybit', bybit, 'blue')}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {renderExchangeCard('binance', binance, 'yellow')}
          </motion.div>
        </div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700/30"
        >
          <h3 className="text-xl font-bold text-white mb-4">
            {language === 'pt' ? 'Como criar uma API Key?' : 'How to create an API Key?'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bybit Instructions */}
            <div>
              <h4 className="text-blue-400 font-bold mb-2">Bybit</h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-300 text-sm">
                <li>{language === 'pt' ? 'Acesse bybit.com e faça login' : 'Access bybit.com and login'}</li>
                <li>{language === 'pt' ? 'Vá em Conta → API' : 'Go to Account → API'}</li>
                <li>{language === 'pt' ? 'Clique em "Criar Nova Chave"' : 'Click "Create New Key"'}</li>
                <li>{language === 'pt' ? 'Habilite: Leitura + Trading' : 'Enable: Read + Trading'}</li>
                <li>{language === 'pt' ? 'DESABILITE: Saque' : 'DISABLE: Withdrawal'}</li>
                <li>{language === 'pt' ? 'Copie e cole aqui' : 'Copy and paste here'}</li>
              </ol>
            </div>

            {/* Binance Instructions */}
            <div>
              <h4 className="text-yellow-400 font-bold mb-2">Binance</h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-300 text-sm">
                <li>{language === 'pt' ? 'Acesse binance.com e faça login' : 'Access binance.com and login'}</li>
                <li>{language === 'pt' ? 'Vá em Perfil → API Management' : 'Go to Profile → API Management'}</li>
                <li>{language === 'pt' ? 'Clique em "Create API"' : 'Click "Create API"'}</li>
                <li>{language === 'pt' ? 'Habilite: Spot & Futures Trading' : 'Enable: Spot & Futures Trading'}</li>
                <li>{language === 'pt' ? 'DESABILITE: Enable Withdrawals' : 'DISABLE: Enable Withdrawals'}</li>
                <li>{language === 'pt' ? 'Copie e cole aqui' : 'Copy and paste here'}</li>
              </ol>
            </div>
          </div>
        </motion.div>
      </div>
    </UserLayout>
  );
};

export default APIKeysSettings;
