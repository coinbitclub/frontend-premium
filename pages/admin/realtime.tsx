import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMonitor, 
  FiActivity, 
  FiUsers, 
  FiDatabase,
  FiTrendingUp,
  FiTrendingDown,
  FiZap,
  FiEye,
  FiRefreshCw,
  FiMessageSquare,
  FiShield,
  FiTarget,
  FiPlay,
  FiPause,
  FiX,
  FiDollarSign,
  FiClock,
  FiChevronRight,
  FiAlertTriangle,
  FiCheckCircle,
  FiXCircle
} from 'react-icons/fi';
import { useLanguage } from '../../hooks/useLanguage';
import AdminLayout from '../../components/AdminLayout';

// Interfaces para o sistema em tempo real
interface MarketReading {
  fearAndGreed: number;
  fearAndGreedStatus: 'EXTREME_FEAR' | 'FEAR' | 'NEUTRAL' | 'GREED' | 'EXTREME_GREED';
  btcDominance: number;
  top100Direction: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  aiDirection: 'LONG' | 'SHORT' | 'NEUTRO';
  confidence: number;
  reasoning: string;
  lastUpdate: Date;
}

interface WebhookSignal {
  id: string;
  type: 'LONG' | 'SHORT' | 'LONG_FORTE' | 'SHORT_FORTE' | 'FECHE_LONG' | 'FECHE_SHORT';
  symbol: string;
  price: number;
  timestamp: Date;
  status: 'PROCESSANDO' | 'EXECUTADO' | 'REJEITADO';
  reasoning?: string;
}

interface ActiveOperation {
  id: string;
  symbol: string;
  type: 'LONG' | 'SHORT';
  entryPrice: number;
  currentPrice: number;
  quantity: number;
  pnl: number;
  pnlPercent: number;
  startTime: Date;
  duration: string;
  status: 'ATIVA' | 'PENDENTE' | 'FINALIZADA';
}

interface SystemMetrics {
  usersOnline: number;
  activeOperations: number;
  totalPnlToday: number;
  signalsToday: number;
  systemHealth: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  lastUpdate: Date;
}

const AdminRealtimePanel: NextPage = () => {
  const [mounted, setMounted] = useState(false);
  const [marketReading, setMarketReading] = useState<MarketReading | null>(null);
  const [webhookSignals, setWebhookSignals] = useState<WebhookSignal[]>([]);
  const [activeOperations, setActiveOperations] = useState<ActiveOperation[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isClosingAllOperations, setIsClosingAllOperations] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    setMounted(true);
    loadRealtimeData();

    // Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'admin_realtime_view', {
        event_category: 'admin_navigation',
        page_title: 'Admin Realtime Panel'
      });
    }

    // Auto-refresh a cada 5 segundos
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(loadRealtimeData, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const loadRealtimeData = async () => {
    try {
      // Simular dados em tempo real
      await new Promise(resolve => setTimeout(resolve, 500));

      // Market Reading
      setMarketReading({
        fearAndGreed: Math.floor(Math.random() * 100),
        fearAndGreedStatus: ['EXTREME_FEAR', 'FEAR', 'NEUTRAL', 'GREED', 'EXTREME_GREED'][Math.floor(Math.random() * 5)] as any,
        btcDominance: 45 + Math.random() * 10,
        top100Direction: ['BULLISH', 'BEARISH', 'NEUTRAL'][Math.floor(Math.random() * 3)] as any,
        aiDirection: ['LONG', 'SHORT', 'NEUTRO'][Math.floor(Math.random() * 3)] as any,
        confidence: 70 + Math.random() * 30,
        reasoning: 'Análise baseada em indicadores técnicos e sentimento do mercado',
        lastUpdate: new Date()
      });

      // System Metrics
      setSystemMetrics({
        usersOnline: 1234 + Math.floor(Math.random() * 500),
        activeOperations: 89 + Math.floor(Math.random() * 50),
        totalPnlToday: 15000 + Math.random() * 10000 - 5000,
        signalsToday: 45 + Math.floor(Math.random() * 20),
        systemHealth: 'HEALTHY',
        lastUpdate: new Date()
      });

      // Webhook Signals (últimos 10)
      const signalTypes = ['LONG', 'SHORT', 'LONG_FORTE', 'SHORT_FORTE', 'FECHE_LONG', 'FECHE_SHORT'];
      const newSignals = Array.from({ length: 5 }, (_, i) => ({
        id: `signal_${Date.now()}_${i}`,
        type: signalTypes[Math.floor(Math.random() * signalTypes.length)] as any,
        symbol: ['BTCUSDT', 'ETHUSDT', 'ADAUSDT', 'SOLUSDT'][Math.floor(Math.random() * 4)],
        price: 40000 + Math.random() * 20000,
        timestamp: new Date(Date.now() - i * 60000),
        status: ['PROCESSANDO', 'EXECUTADO', 'REJEITADO'][Math.floor(Math.random() * 3)] as any,
        reasoning: 'Sinal gerado pela IA baseado em análise técnica'
      }));
      setWebhookSignals(prev => [...newSignals, ...prev.slice(0, 15)]);

      // Active Operations
      const operations = Array.from({ length: 8 }, (_, i) => {
        const pnl = (Math.random() - 0.5) * 2000;
        return {
          id: `op_${Date.now()}_${i}`,
          symbol: ['BTCUSDT', 'ETHUSDT', 'ADAUSDT', 'SOLUSDT'][Math.floor(Math.random() * 4)],
          type: ['LONG', 'SHORT'][Math.floor(Math.random() * 2)] as any,
          entryPrice: 40000 + Math.random() * 20000,
          currentPrice: 40000 + Math.random() * 20000,
          quantity: Math.random() * 2,
          pnl: pnl,
          pnlPercent: (pnl / 1000) * 100,
          startTime: new Date(Date.now() - Math.random() * 3600000),
          duration: `${Math.floor(Math.random() * 60)}m`,
          status: 'ATIVA' as any
        };
      });
      setActiveOperations(operations);

    } catch (error) {
      console.error('Erro ao carregar dados em tempo real:', error);
    }
  };

  const handleCloseAllOperations = async () => {
    setIsClosingAllOperations(true);
    
    try {
      // Simular chamada da API para fechar todas as operações
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Atualizar operações para finalizada
      setActiveOperations(prev => prev.map(op => ({
        ...op,
        status: 'FINALIZADA' as any
      })));
      
      alert(language === 'pt' 
        ? 'Todas as operações foram solicitadas para encerramento!' 
        : 'All operations have been requested for closure!'
      );
    } catch (error) {
      console.error('Erro ao fechar operações:', error);
    } finally {
      setIsClosingAllOperations(false);
    }
  };

  const getSignalTypeColor = (type: string) => {
    switch (type) {
      case 'LONG':
      case 'LONG_FORTE':
        return 'text-green-400 bg-green-500/20';
      case 'SHORT':
      case 'SHORT_FORTE':
        return 'text-red-400 bg-red-500/20';
      case 'FECHE_LONG':
      case 'FECHE_SHORT':
        return 'text-yellow-400 bg-yellow-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'EXECUTADO':
        return 'text-green-400';
      case 'PROCESSANDO':
        return 'text-yellow-400';
      case 'REJEITADO':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getFearGreedColor = (value: number) => {
    if (value <= 25) return 'text-red-400 bg-red-500/20';
    if (value <= 45) return 'text-orange-400 bg-orange-500/20';
    if (value <= 55) return 'text-yellow-400 bg-yellow-500/20';
    if (value <= 75) return 'text-green-400 bg-green-500/20';
    return 'text-emerald-400 bg-emerald-500/20';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(language === 'pt' ? 'pt-BR' : 'en-US');
  };

  const formatPnl = (pnl: number, pnlPercent: number) => {
    const sign = pnl >= 0 ? '+' : '';
    return `${sign}${formatCurrency(pnl)} (${sign}${pnlPercent.toFixed(2)}%)`;
  };

  const getPnlColor = (pnl: number) => {
    return pnl >= 0 ? 'text-green-400' : 'text-red-400';
  };

  if (!mounted) {
    return (
      <AdminLayout title={language === 'pt' ? 'Painel Tempo Real' : 'Real-time Panel'}>
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <p className="text-gray-300">
              {language === 'pt' ? 'Carregando painel em tempo real...' : 'Loading real-time panel...'}
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={language === 'pt' ? 'Painel Tempo Real' : 'Real-time Panel'}>
      <div className="space-y-6">
        {/* Header com Controles */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              {language === 'pt' ? 'Monitoramento em Tempo Real' : 'Real-time Monitoring'}
            </h1>
            <p className="text-gray-400">
              {language === 'pt' ? 'Acompanhamento de operações e sinais da IA' : 'Operations and AI signals monitoring'}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                autoRefresh
                  ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                  : 'bg-gray-500/20 text-gray-400 border border-gray-500/50'
              }`}
            >
              <FiRefreshCw className={autoRefresh ? 'animate-spin' : ''} />
              <span>{autoRefresh ? 'Auto' : 'Manual'}</span>
            </button>

            <button
              onClick={handleCloseAllOperations}
              disabled={isClosingAllOperations || activeOperations.length === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg hover:bg-red-500/30 transition-all disabled:opacity-50"
            >
              {isClosingAllOperations ? (
                <>
                  <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>{language === 'pt' ? 'Fechando...' : 'Closing...'}</span>
                </>
              ) : (
                <>
                  <FiX />
                  <span>{language === 'pt' ? 'Fechar Todas' : 'Close All'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Métricas do Sistema */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <FiUsers className="text-2xl text-blue-400" />
              <span className="text-xs text-gray-400">ONLINE</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {systemMetrics?.usersOnline.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">
              {language === 'pt' ? 'Usuários Online' : 'Users Online'}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <FiActivity className="text-2xl text-green-400" />
              <span className="text-xs text-gray-400">ATIVAS</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {systemMetrics?.activeOperations}
            </div>
            <div className="text-sm text-gray-400">
              {language === 'pt' ? 'Operações Ativas' : 'Active Operations'}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <FiDollarSign className="text-2xl text-yellow-400" />
              <span className="text-xs text-gray-400">HOJE</span>
            </div>
            <div className={`text-2xl font-bold mb-1 ${getPnlColor(systemMetrics?.totalPnlToday || 0)}`}>
              {formatCurrency(systemMetrics?.totalPnlToday || 0)}
            </div>
            <div className="text-sm text-gray-400">
              {language === 'pt' ? 'PnL Total (Hoje)' : 'Total PnL (Today)'}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <FiZap className="text-2xl text-purple-400" />
              <span className="text-xs text-gray-400">HOJE</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {systemMetrics?.signalsToday}
            </div>
            <div className="text-sm text-gray-400">
              {language === 'pt' ? 'Sinais (Hoje)' : 'Signals (Today)'}
            </div>
          </motion.div>
        </div>

        {/* Leitura do Mercado e IA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6"
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <FiEye className="mr-3 text-purple-400" />
            {language === 'pt' ? 'Leitura do Mercado & IA' : 'Market & AI Reading'}
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Fear & Greed */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-300">Fear & Greed Index</h4>
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full text-2xl font-bold ${getFearGreedColor(marketReading?.fearAndGreed || 50)}`}>
                  {marketReading?.fearAndGreed}
                </div>
                <div className="mt-2 text-sm text-gray-400">
                  {marketReading?.fearAndGreedStatus}
                </div>
              </div>
            </div>

            {/* BTC Dominance */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-300">BTC Dominance</h4>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">
                  {marketReading?.btcDominance.toFixed(1)}%
                </div>
                <div className="mt-2 text-sm text-gray-400">
                  Top 100: <span className={
                    marketReading?.top100Direction === 'BULLISH' ? 'text-green-400' :
                    marketReading?.top100Direction === 'BEARISH' ? 'text-red-400' : 'text-yellow-400'
                  }>
                    {marketReading?.top100Direction}
                  </span>
                </div>
              </div>
            </div>

            {/* AI Direction */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-300">Direção da IA</h4>
              <div className="text-center">
                <div className={`text-3xl font-bold ${
                  marketReading?.aiDirection === 'LONG' ? 'text-green-400' :
                  marketReading?.aiDirection === 'SHORT' ? 'text-red-400' : 'text-yellow-400'
                }`}>
                  {marketReading?.aiDirection}
                </div>
                <div className="mt-2 text-sm text-gray-400">
                  Confiança: {marketReading?.confidence.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-700/30 rounded-lg">
            <div className="text-sm text-gray-400 mb-2">Análise da IA:</div>
            <div className="text-white">{marketReading?.reasoning}</div>
            <div className="text-xs text-gray-500 mt-2">
              Última atualização: {marketReading?.lastUpdate && formatTime(marketReading.lastUpdate)}
            </div>
          </div>
        </motion.div>

        {/* Grid: Sinais do Webhook e Operações Ativas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sinais do Webhook */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <FiMessageSquare className="mr-3 text-blue-400" />
              {language === 'pt' ? 'Sinais do Webhook' : 'Webhook Signals'}
            </h3>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              <AnimatePresence>
                {webhookSignals.slice(0, 10).map((signal, index) => (
                  <motion.div
                    key={signal.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg border border-gray-600/30"
                  >
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${getSignalTypeColor(signal.type)}`}>
                        {signal.type}
                      </span>
                      <div>
                        <div className="text-white font-medium">{signal.symbol}</div>
                        <div className="text-sm text-gray-400">{formatCurrency(signal.price)}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${getStatusColor(signal.status)}`}>
                        {signal.status}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatTime(signal.timestamp)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Operações Ativas */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <FiTarget className="mr-3 text-green-400" />
              {language === 'pt' ? 'Operações Ativas' : 'Active Operations'}
            </h3>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              <AnimatePresence>
                {activeOperations.map((operation, index) => (
                  <motion.div
                    key={operation.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-3 bg-gray-700/30 rounded-lg border border-gray-600/30"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          operation.type === 'LONG' ? 'text-green-400 bg-green-500/20' : 'text-red-400 bg-red-500/20'
                        }`}>
                          {operation.type}
                        </span>
                        <span className="text-white font-medium">{operation.symbol}</span>
                      </div>
                      <span className="text-xs text-gray-400">{operation.duration}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-400">Entrada: </span>
                        <span className="text-white">{formatCurrency(operation.entryPrice)}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Atual: </span>
                        <span className="text-white">{formatCurrency(operation.currentPrice)}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">PnL: </span>
                        <span className={getPnlColor(operation.pnl)}>
                          {formatPnl(operation.pnl, operation.pnlPercent)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Qtd: </span>
                        <span className="text-white">{operation.quantity.toFixed(4)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminRealtimePanel;
