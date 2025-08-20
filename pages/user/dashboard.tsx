import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiDollarSign, FiTrendingUp, FiTarget, FiRefreshCw } from 'react-icons/fi';
import { useLanguage } from '../../hooks/useLanguage';
import { useResponsive } from '../../hooks/useResponsive';
import UserLayout from '../../components/UserLayout';
import ResponsiveContainer from '../../components/ResponsiveContainer';
import { useToast } from '../../components/Toast';

export default function UserDashboard() {
  const { language } = useLanguage();
  const { isMobile } = useResponsive();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleRefresh = () => {
    setLoading(true);
    showToast(
      language === 'pt' ? 'Atualizando dados...' : 'Updating data...',
      'info'
    );
    
    setTimeout(() => {
      setLoading(false);
      showToast(
        language === 'pt' ? 'Dados atualizados!' : 'Data updated!',
        'success'
      );
    }, 2000);
  };

  const mockData = {
    balances: {
      total: 22171.07,
      binance: 8540.32,
      bybit: 12380.75,
      prepaid: 1250
    },
    performance: {
      todayReturn: '2.8',
      winRate: '78.5'
    }
  };

  return (
    <UserLayout 
      title={`${language === 'pt' ? 'Dashboard' : 'Dashboard'} | CoinBitClub`}
      description={language === 'pt' ? 'Dashboard do usuário' : 'User Dashboard'}
    >
      <ResponsiveContainer mobileOptimized={true} padding={isMobile ? 'sm' : 'md'}>
        <div className={`${isMobile ? 'pt-2 space-y-6' : 'pt-4 space-y-8'}`}>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent ${
                isMobile ? 'text-2xl mb-1' : 'text-3xl mb-2'
              }`}>
                {language === 'pt' ? 'Dashboard' : 'Dashboard'}
              </h1>
              <p className={`text-gray-400 ${isMobile ? 'text-sm' : ''}`}>
                {language === 'pt' 
                  ? `Performance de hoje: +${mockData.performance.todayReturn}%`
                  : `Today's performance: +${mockData.performance.todayReturn}%`
                }
              </p>
            </div>
            
            <button 
              onClick={handleRefresh}
              className="p-3 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl border border-gray-600/50 hover:border-orange-400/50 transition-all group"
              disabled={loading}
            >
              <FiRefreshCw className={`text-orange-400 group-hover:scale-110 transition-transform ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Balance Cards */}
          <div className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-4 gap-6'}`}>
            {/* Saldo Total */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30 hover:border-orange-400/50 transition-all group"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-lg">
                  <FiDollarSign className="text-orange-400 text-xl" />
                </div>
                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 px-2 py-1 rounded-lg border border-green-500/30">
                  <span className="text-green-400 text-xs font-medium">+{mockData.performance.todayReturn}%</span>
                </div>
              </div>
              <div>
                <p className={`text-gray-400 ${isMobile ? 'text-xs' : 'text-sm'} mb-1`}>
                  {language === 'pt' ? 'Saldo Total' : 'Total Balance'}
                </p>
                <p className={`text-white font-bold ${isMobile ? 'text-lg' : 'text-2xl'}`}>
                  ${mockData.balances.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </motion.div>

            {/* Saldo Binance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30 hover:border-yellow-400/50 transition-all group"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg">
                  <span className="text-yellow-400 font-bold text-lg">B</span>
                </div>
                <span className="text-yellow-400 text-xs font-medium">BINANCE</span>
              </div>
              <div>
                <p className={`text-gray-400 ${isMobile ? 'text-xs' : 'text-sm'} mb-1`}>
                  {language === 'pt' ? 'Saldo Binance' : 'Binance Balance'}
                </p>
                <p className={`text-white font-bold ${isMobile ? 'text-lg' : 'text-2xl'}`}>
                  ${mockData.balances.binance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </motion.div>

            {/* Saldo Bybit */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30 hover:border-blue-400/50 transition-all group"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-lg">
                  <span className="text-blue-400 font-bold text-lg">By</span>
                </div>
                <span className="text-blue-400 text-xs font-medium">BYBIT</span>
              </div>
              <div>
                <p className={`text-gray-400 ${isMobile ? 'text-xs' : 'text-sm'} mb-1`}>
                  {language === 'pt' ? 'Saldo Bybit' : 'Bybit Balance'}
                </p>
                <p className={`text-white font-bold ${isMobile ? 'text-lg' : 'text-2xl'}`}>
                  ${mockData.balances.bybit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </motion.div>

            {/* Saldo Pré-pago */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30 hover:border-green-400/50 transition-all group"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg">
                  <FiTarget className="text-green-400 text-xl" />
                </div>
                <span className="text-green-400 text-xs font-medium">PRÉ-PAGO</span>
              </div>
              <div>
                <p className={`text-gray-400 ${isMobile ? 'text-xs' : 'text-sm'} mb-1`}>
                  {language === 'pt' ? 'Saldo Pré-pago' : 'Prepaid Balance'}
                </p>
                <p className={`text-white font-bold ${isMobile ? 'text-lg' : 'text-2xl'}`}>
                  ${mockData.balances.prepaid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Performance Stats */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-sm rounded-xl p-4 border border-green-700/30"
            >
              <div className="flex items-center space-x-3 mb-3">
                <FiTrendingUp className="text-green-400 text-xl" />
                <span className="text-green-400 text-xs font-medium">
                  {language === 'pt' ? 'RETORNO HOJE' : 'TODAY RETURN'}
                </span>
              </div>
              <div>
                <p className={`text-green-400 font-bold ${isMobile ? 'text-lg' : 'text-2xl'} mb-1`}>
                  +{mockData.performance.todayReturn}%
                </p>
                <p className={`text-gray-400 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  {language === 'pt' ? 'Hoje' : 'Today'}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 backdrop-blur-sm rounded-xl p-4 border border-blue-700/30"
            >
              <div className="flex items-center space-x-3 mb-3">
                <FiTarget className="text-blue-400 text-xl" />
                <span className="text-blue-400 text-xs font-medium">
                  {language === 'pt' ? 'TAXA SUCESSO' : 'WIN RATE'}
                </span>
              </div>
              <div>
                <p className={`text-blue-400 font-bold ${isMobile ? 'text-lg' : 'text-2xl'} mb-1`}>
                  {mockData.performance.winRate}%
                </p>
                <p className={`text-gray-400 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  {language === 'pt' ? 'Operações' : 'Trades'}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </ResponsiveContainer>
    </UserLayout>
  );
}
