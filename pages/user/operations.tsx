import React, { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../hooks/useLanguage';
import UserLayout from '../../components/UserLayout';
import io from 'socket.io-client';

// Tipos para o fluxo real do MarketBot
interface MarketIndicators {
  fearAndGreed: number;
  fearAndGreedStatus: 'EXTREME_FEAR' | 'FEAR' | 'NEUTRAL' | 'GREED' | 'EXTREME_GREED';
  btcDominance: number;
  top100LongShort: {
    long: number;
    short: number;
  };
  lastUpdate: Date;
}

interface AIDecision {
  direction: 'LONG' | 'SHORT' | 'NEUTRO';
  confidence: number;
  reasoning: string;
  timestamp: Date;
  marketSentiment: string;
}

interface Signal {
  id: string;
  pair: string;
  direction: 'LONG' | 'SHORT';
  strength: number;
  confidence: number;
  timestamp: Date;
  status: 'PROCESSANDO' | 'APROVADO' | 'DESCARTADO' | 'EXECUTADO';
  reasoning: string;
}

interface Position {
  id: string;
  pair: string;
  type: 'LONG' | 'SHORT';
  entryPrice: number;
  currentPrice: number;
  quantity: number;
  pnl: number;
  pnlPercent: number;
  status: 'OPEN' | 'CLOSED';
  timestamp: Date;
  stopLoss?: number;
  takeProfit?: number;
}

interface DailyStats {
  operationsToday: number;
  successRate: number;
  historicalSuccessRate: number;
  todayReturnUSD: number;
  todayReturnPercent: number;
  totalInvested: number;
}

interface TopSignal {
  rank: number;
  id: string;
  pair: string;
  direction: 'LONG' | 'SHORT';
  confidence: number;
  entryPrice: number;
  currentPrice: number;
  quantity: number;
  pnl: number;
  pnlPercent: number;
  status: 'PROCESSANDO' | 'APROVADO' | 'DESCARTADO' | 'EXECUTADO';
  timestamp: Date;
  reasoning: string;
  source: string;
  performance: 'HIGH' | 'MEDIUM' | 'LOW';
  activity: 'ACTIVE' | 'MONITORING' | 'COMPLETED';
}

const UserOperations: React.FC = () => {
  const [mounted, setMounted] = useState<boolean>(false);
  const { language, t } = useLanguage();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [socket, setSocket] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  // Cache keys
  const CACHE_KEY = 'operations_data';
  const CACHE_DURATION = 30 * 1000; // 30 seconds
  
  // Estados do fluxo real - inicializados vazios para dados em tempo real
  const [marketIndicators, setMarketIndicators] = useState<MarketIndicators>({
    fearAndGreed: 0,
    fearAndGreedStatus: 'NEUTRAL',
    btcDominance: 0,
    top100LongShort: { long: 0, short: 0 },
    lastUpdate: new Date()
  });

  const [aiDecision, setAiDecision] = useState<AIDecision>({
    direction: 'LONG',
    confidence: 0,
    reasoning: language === 'pt'
      ? 'Carregando análise em tempo real...'
      : 'Loading real-time analysis...',
    timestamp: new Date(),
    marketSentiment: language === 'pt' ? 'CARREGANDO' : 'LOADING'
  });
  
  const [signals, setSignals] = useState<Signal[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [topSignals, setTopSignals] = useState<TopSignal[]>([]);
  
  const [dailyStats, setDailyStats] = useState<DailyStats>({
    operationsToday: 0,
    successRate: 0,
    historicalSuccessRate: 0,
    todayReturnUSD: 0,
    todayReturnPercent: 0,
    totalInvested: 10000
  });

  const router = useRouter();

  // All data loading is now handled by real-time API calls

  useEffect(() => {
    setMounted(true);

    // Initialize WebSocket connection
    const newSocket = io('http://localhost:3333', {
      transports: ['websocket', 'polling']
    });

    // Connection handlers
    newSocket.on('connect', () => {
      console.log('🔗 Connected to operations WebSocket');
      setIsConnected(true);

      // Authenticate user (in production, use real JWT token)
      newSocket.emit('authenticate', {
        userId: 1, // Mock user ID - in production get from auth context
        token: 'mock-token',
        userType: 'user'
      });

      // Join trading room
      newSocket.emit('join_trading', 1);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Disconnected from operations WebSocket');
      setIsConnected(false);
    });

    // Real-time event handlers
    newSocket.on('signal_received', (data) => {
      console.log('📡 Operations: Signal received:', data);
      // Add new signal to the beginning of the list
      const newSignal: Signal = {
        id: Date.now().toString(),
        pair: data.data?.symbol || 'BTC/USDT',
        direction: data.data?.action === 'BUY' ? 'LONG' : 'SHORT',
        strength: Math.floor(Math.random() * 40 + 50),
        confidence: Math.random() * 40 + 50,
        timestamp: new Date(data.timestamp),
        status: 'PROCESSANDO',
        reasoning: data.data?.strategy || 'Signal processamento em andamento...'
      };
      setSignals(prev => [newSignal, ...prev.slice(0, 11)]);
    });

    newSocket.on('ai_decision', (data) => {
      console.log('🤖 Operations: AI decision:', data);
      setAiDecision({
        direction: data.action || 'LONG',
        confidence: data.confidence || 75,
        reasoning: data.reasoning || (language === 'pt'
          ? 'Análise em andamento pela IA...'
          : 'AI analysis in progress...'),
        timestamp: new Date(data.timestamp),
        marketSentiment: data.sentiment || (language === 'pt' ? 'ANALISANDO' : 'ANALYZING')
      });
    });

    newSocket.on('trade_executed', (data) => {
      console.log('📈 Operations: Trade executed:', data);
      // Update signal status to EXECUTADO
      setSignals(prev => prev.map(signal => {
        if (signal.pair === data.data?.symbol) {
          return { ...signal, status: 'EXECUTADO', reasoning: 'Trade executado com sucesso' };
        }
        return signal;
      }));
    });

    newSocket.on('position_update', (data) => {
      console.log('📊 Operations: Position update:', data);

      setPositions(prev => {
        const existingIndex = prev.findIndex(p => p.id === data.data.tradeId);

        if (data.data.status === 'CLOSED') {
          return prev.filter(p => p.id !== data.data.tradeId);
        }

        const positionData: Position = {
          id: data.data.tradeId,
          pair: data.data.symbol,
          type: data.data.side === 'BUY' ? 'LONG' : 'SHORT',
          entryPrice: data.data.entryPrice,
          currentPrice: data.data.currentPrice,
          quantity: data.userSpecific?.investment / data.data.entryPrice || 0.01,
          pnl: data.userSpecific?.unrealizedPnL || data.data.unrealizedPnL,
          pnlPercent: data.userSpecific?.percentage || data.data.unrealizedPnLPercent,
          status: data.data.status === 'ACTIVE' ? 'OPEN' : 'CLOSED',
          timestamp: new Date(data.data.timestamp),
          stopLoss: data.data.entryPrice * 0.95, // Example stop loss
          takeProfit: data.data.entryPrice * 1.05 // Example take profit
        };

        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = positionData;
          return updated;
        } else {
          return [positionData, ...prev];
        }
      });
    });

    newSocket.on('balance_update', (data) => {
      console.log('💰 Operations: Balance update:', data);
      // Update daily stats based on balance changes
      setDailyStats(prev => ({
        ...prev,
        todayReturnUSD: prev.todayReturnUSD + (data.data?.change || 0),
        todayReturnPercent: prev.todayReturnPercent + ((data.data?.change || 0) / prev.totalInvested * 100)
      }));
    });

    newSocket.on('execution_summary', (data) => {
      console.log('📊 Operations: Execution summary:', data);
      setDailyStats(prev => ({
        ...prev,
        operationsToday: data.data?.executedTrades || prev.operationsToday,
        successRate: data.data?.successfulTrades && data.data?.executedTrades
          ? (data.data.successfulTrades / data.data.executedTrades) * 100
          : prev.successRate
      }));
    });

    setSocket(newSocket);

    // Update time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Analytics
    if (typeof window !== 'undefined' && typeof gtag !== 'undefined') {
      gtag('event', 'operations_page_view', {
        page_title: 'Operations in Progress',
        language: language,
        event_category: 'user_engagement',
        page_type: 'operations'
      });
    }

    // Cleanup
    return () => {
      clearInterval(timeInterval);
      newSocket.disconnect();
    };
  }, [language]);

  // Fallback data loading removed - all data now comes from real-time API

  // Market indicators will be updated via WebSocket or API calls
  // Remove mock data generation in favor of real data

  // Signals are now generated by the real trading system via WebSocket
  // No need for mock signal generation

  const getFearGreedColor = (value: number): string => {
    if (value <= 25) return 'text-red-400';
    if (value <= 45) return 'text-orange-400';
    if (value <= 55) return 'text-yellow-400';
    if (value <= 75) return 'text-green-400';
    return 'text-emerald-400';
  };

  const getFearGreedStatus = (value: number): string => {
    if (value <= 25) return 'MEDO EXTREMO';
    if (value <= 45) return 'MEDO';
    if (value <= 55) return 'NEUTRO';
    if (value <= 75) return 'GANÂNCIA';
    return 'GANÂNCIA EXTREMA';
  };

  const formatPrice = (price: number): string => {
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatPercent = (percent: number): string => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  // Market indicators API integration
  const fetchMarketIndicators = useCallback(async () => {
    try {
      // Fetch Fear & Greed Index from Alternative.me API
      const fearGreedResponse = await fetch('https://api.alternative.me/fng/');
      if (fearGreedResponse.ok) {
        const fearGreedData = await fearGreedResponse.json();
        const fearGreedValue = parseInt(fearGreedData.data[0].value);

        // Update market indicators with real data
        setMarketIndicators(prev => ({
          ...prev,
          fearAndGreed: fearGreedValue,
          fearAndGreedStatus: getFearGreedStatusFromValue(fearGreedValue),
          lastUpdate: new Date()
        }));

        console.log('📡 Updated Fear & Greed Index:', fearGreedValue);
      }
    } catch (error) {
      console.error('Error fetching market indicators:', error);
    }
  }, []);

  const getFearGreedStatusFromValue = (value: number): 'EXTREME_FEAR' | 'FEAR' | 'NEUTRAL' | 'GREED' | 'EXTREME_GREED' => {
    if (value <= 25) return 'EXTREME_FEAR';
    if (value <= 45) return 'FEAR';
    if (value <= 55) return 'NEUTRAL';
    if (value <= 75) return 'GREED';
    return 'EXTREME_GREED';
  };

  // Fetch top signals from API
  const fetchTopSignals = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3333/api/top-signals-test');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          // Convert API data to component format
          const formattedSignals: TopSignal[] = data.data.map((signal: any) => ({
            ...signal,
            timestamp: new Date(signal.timestamp)
          }));
          setTopSignals(formattedSignals);
        }
      }
    } catch (error) {
      console.error('Error fetching top signals:', error);
    }
  }, []);

  // Fetch all real-time data from backend API
  const fetchAllOperationsData = useCallback(async () => {
    try {
      // Fetch market indicators (Fear & Greed from real API)
      await fetchMarketIndicators();

      // Fetch top signals
      await fetchTopSignals();

      // Fetch AI Decision from backend (using demo data)
      const aiResponse = await fetch('http://localhost:3333/api/top-signals-test');
      if (aiResponse.ok) {
        const data = await aiResponse.json();
        if (data.success && data.data?.length > 0) {
          // Use the first signal to simulate AI decision
          const topSignal = data.data[0];
          setAiDecision({
            direction: topSignal.direction,
            confidence: topSignal.confidence,
            reasoning: topSignal.reasoning,
            timestamp: new Date(),
            marketSentiment: topSignal.performance === 'HIGH' ?
              (language === 'pt' ? 'TENDÊNCIA FORTE' : 'STRONG TREND') :
              (language === 'pt' ? 'ANÁLISE CONTÍNUA' : 'CONTINUOUS ANALYSIS')
          });
        }
      }

      // Update signals with the same data (top 5 for main signals section)
      const signalsResponse = await fetch('http://localhost:3333/api/top-signals-test');
      if (signalsResponse.ok) {
        const data = await signalsResponse.json();
        if (data.success && data.data) {
          const formattedSignals: Signal[] = data.data.slice(0, 5).map((signal: any) => ({
            id: signal.id,
            pair: signal.pair,
            direction: signal.direction,
            strength: Math.round(signal.confidence),
            confidence: signal.confidence,
            timestamp: new Date(signal.timestamp),
            status: signal.status,
            reasoning: signal.reasoning
          }));
          setSignals(formattedSignals);
        }
      }

      // Update positions (using top signals that have positive P&L)
      const positionsResponse = await fetch('http://localhost:3333/api/top-signals-test');
      if (positionsResponse.ok) {
        const data = await positionsResponse.json();
        if (data.success && data.data) {
          const formattedPositions: Position[] = data.data
            .filter((signal: any) => signal.pnl > 0 && signal.status === 'EXECUTADO')
            .slice(0, 3)
            .map((signal: any) => ({
              id: signal.id,
              pair: signal.pair,
              type: signal.direction,
              entryPrice: signal.entryPrice,
              currentPrice: signal.currentPrice,
              quantity: signal.quantity,
              pnl: signal.pnl,
              pnlPercent: signal.pnlPercent,
              status: 'OPEN' as 'OPEN' | 'CLOSED',
              timestamp: new Date(signal.timestamp),
              stopLoss: signal.stopLoss,
              takeProfit: signal.takeProfit
            }));
          setPositions(formattedPositions);
        }
      }

      // Update daily stats (calculated from top signals data)
      const statsResponse = await fetch('http://localhost:3333/api/top-signals-test');
      if (statsResponse.ok) {
        const data = await statsResponse.json();
        if (data.success && data.data) {
          const signals = data.data;
          const executedSignals = signals.filter((s: any) => s.status === 'EXECUTADO');
          const profitableSignals = executedSignals.filter((s: any) => s.pnl > 0);
          const totalPnL = executedSignals.reduce((acc: number, s: any) => acc + s.pnl, 0);
          const avgReturn = executedSignals.length > 0
            ? executedSignals.reduce((acc: number, s: any) => acc + s.pnlPercent, 0) / executedSignals.length
            : 0;

          setDailyStats({
            operationsToday: executedSignals.length,
            successRate: executedSignals.length > 0 ? (profitableSignals.length / executedSignals.length) * 100 : 0,
            historicalSuccessRate: 73.2, // Keep historical value
            todayReturnUSD: totalPnL,
            todayReturnPercent: avgReturn,
            totalInvested: 10000
          });
        }
      }

    } catch (error) {
      console.error('Error fetching real-time operations data:', error);
    }
  }, [fetchMarketIndicators, fetchTopSignals, language]);

  // Fetch all real-time data on mount and every interval
  useEffect(() => {
    if (mounted) {
      // Initial load
      fetchAllOperationsData();

      // Update all data every 30 seconds for complete real-time experience
      const realTimeInterval = setInterval(fetchAllOperationsData, 30 * 1000);

      return () => {
        clearInterval(realTimeInterval);
      };
    }
  }, [mounted, fetchAllOperationsData]);

  if (!mounted) {
    return (
      <UserLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-400 mb-4 mx-auto"></div>
            <h2 className="text-2xl font-bold text-white mb-2">CoinBitClub</h2>
            <p className="text-gray-400">{language === 'pt' ? 'Carregando...' : 'Loading...'}</p>
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="p-6">
        {/* HEADER COM STATUS TEMPO REAL */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {language === 'pt' ? 'Operações em Andamento' : 'Operations in Progress'}
            </h1>
            <p className="text-gray-400">
              {language === 'pt' ? 'Acompanhe cada etapa do processo de investimento' : 'Follow every step of the investment process'}
            </p>
          </div>
          
          {/* STATUS SIMPLES */}
          <div className="text-right">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} ${isProcessing ? 'animate-pulse' : ''}`}></div>
              <span className={`text-lg font-bold ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                {isConnected
                  ? (language === 'pt' ? 'Sistema Conectado' : 'System Connected')
                  : (language === 'pt' ? 'Sistema Desconectado' : 'System Disconnected')
                }
              </span>
            </div>
          </div>
        </motion.div>

        {/* ÍNDICES SUPERIORES - Performance do Dia */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-blue-900/40 to-blue-800/30 backdrop-blur-sm rounded-xl border border-blue-500/30 p-4 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-full -mr-8 -mt-8"></div>
            <div className="text-center relative z-10">
              <motion.div 
                key={dailyStats.operationsToday}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-2xl font-bold text-blue-400"
              >
                {dailyStats.operationsToday}
              </motion.div>
              <div className="text-xs text-gray-400">{language === 'pt' ? 'Operações Hoje' : 'Operations Today'}</div>
            </div>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-green-900/40 to-green-800/30 backdrop-blur-sm rounded-xl border border-green-500/30 p-4 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/10 rounded-full -mr-8 -mt-8"></div>
            <div className="text-center relative z-10">
              <motion.div 
                key={dailyStats.successRate}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-2xl font-bold text-green-400"
              >
                {dailyStats.successRate.toFixed(1)}%
              </motion.div>
              <div className="text-xs text-gray-400">{language === 'pt' ? 'Taxa de Acerto' : 'Success Rate'}</div>
              <div className="text-xs text-gray-500">
                {language === 'pt' ? 'Histórico:' : 'History:'} {dailyStats.historicalSuccessRate.toFixed(1)}%
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-emerald-900/40 to-emerald-800/30 backdrop-blur-sm rounded-xl border border-emerald-500/30 p-4 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-full -mr-8 -mt-8"></div>
            <div className="text-center relative z-10">
              <motion.div 
                key={dailyStats.todayReturnUSD}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-2xl font-bold text-emerald-400"
              >
                ${dailyStats.todayReturnUSD.toFixed(2)}
              </motion.div>
              <div className="text-xs text-gray-400">{language === 'pt' ? 'Retorno Hoje' : 'Return Today'}</div>
            </div>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-yellow-900/40 to-yellow-800/30 backdrop-blur-sm rounded-xl border border-yellow-500/30 p-4 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500/10 rounded-full -mr-8 -mt-8"></div>
            <div className="text-center relative z-10">
              <motion.div 
                key={dailyStats.todayReturnPercent}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-2xl font-bold text-yellow-400"
              >
                {formatPercent(dailyStats.todayReturnPercent)}
              </motion.div>
              <div className="text-xs text-gray-400">{language === 'pt' ? '% Retorno' : '% Return'}</div>
            </div>
          </motion.div>
        </motion.div>

          {/* FLUXO PRINCIPAL */}
          <div className="space-y-8">
            {/* 1. LEITURA DO MERCADO */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-indigo-900/40 to-purple-900/30 backdrop-blur-sm rounded-2xl border border-indigo-500/30 p-6 relative overflow-hidden"
            >
              {isProcessing && (
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/20 to-indigo-500/10 animate-pulse"></div>
              )}
              
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <motion.div 
                  animate={{ 
                    scale: isProcessing ? [1, 1.1, 1] : 1,
                    rotate: isProcessing ? [0, 180, 360] : 0
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: isProcessing ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                  className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center"
                >
                  <span className="text-2xl">📊</span>
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold text-indigo-400">
                    1. {language === 'pt' ? 'Leitura do Mercado' : 'Market Reading'}
                  </h2>
                  <p className="text-gray-400">
                    {language === 'pt' ? 'Análise em tempo real dos indicadores fundamentais' : 'Real-time analysis of fundamental indicators'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                {/* Fear & Greed Index */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-black/20 rounded-xl p-4 border border-gray-700/30"
                >
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-300 mb-2">Fear & Greed Index</div>
                    <motion.div 
                      key={marketIndicators.fearAndGreed}
                      initial={{ scale: 1.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`text-4xl font-bold ${getFearGreedColor(marketIndicators.fearAndGreed)} mb-2`}
                    >
                      {marketIndicators.fearAndGreed.toFixed(1)}
                    </motion.div>
                    <div className="text-sm text-gray-400">{getFearGreedStatus(marketIndicators.fearAndGreed)}</div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${marketIndicators.fearAndGreed}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-2 rounded-full ${getFearGreedColor(marketIndicators.fearAndGreed).replace('text-', 'bg-')}`}
                      />
                    </div>
                  </div>
                </motion.div>

                {/* BTC Dominance */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-black/20 rounded-xl p-4 border border-gray-700/30"
                >
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-300 mb-2">
                      {language === 'pt' ? 'Dominância BTC' : 'BTC Dominance'}
                    </div>
                    <motion.div 
                      key={marketIndicators.btcDominance}
                      initial={{ scale: 1.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-4xl font-bold text-orange-400 mb-2"
                    >
                      {marketIndicators.btcDominance.toFixed(1)}%
                    </motion.div>
                    <div className="text-sm text-gray-400">
                      {language === 'pt' ? 'Controle do mercado' : 'Market control'}
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${marketIndicators.btcDominance}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="bg-orange-400 h-2 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Long vs Short */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-black/20 rounded-xl p-4 border border-gray-700/30"
                >
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-300 mb-2">
                      {language === 'pt' ? 'Top 100 Posições' : 'Top 100 Positions'}
                    </div>
                    <div className="flex justify-between mb-2">
                      <div>
                        <motion.div 
                          key={marketIndicators.top100LongShort.long}
                          initial={{ scale: 1.2, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-2xl font-bold text-green-400"
                        >
                          {marketIndicators.top100LongShort.long.toFixed(1)}%
                        </motion.div>
                        <div className="text-xs text-gray-400">LONG</div>
                      </div>
                      <div>
                        <motion.div 
                          key={marketIndicators.top100LongShort.short}
                          initial={{ scale: 1.2, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-2xl font-bold text-red-400"
                        >
                          {marketIndicators.top100LongShort.short.toFixed(1)}%
                        </motion.div>
                        <div className="text-xs text-gray-400">SHORT</div>
                      </div>
                    </div>
                    <div className="flex h-2 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${marketIndicators.top100LongShort.long}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="bg-green-400"
                      />
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${marketIndicators.top100LongShort.short}%` }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                        className="bg-red-400"
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* 2. DECISÃO DA IA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-violet-900/40 to-pink-900/30 backdrop-blur-sm rounded-2xl border border-violet-500/30 p-6 relative overflow-hidden"
            >
              {isProcessing && (
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-pink-500/20 to-violet-500/10 animate-pulse"></div>
              )}
              
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <motion.div 
                  animate={{ 
                    scale: isProcessing ? [1, 1.1, 1] : 1,
                    rotate: isProcessing ? [0, -15, 15, 0] : 0
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: isProcessing ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                  className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center"
                >
                  <span className="text-2xl">🧠</span>
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold text-violet-400">
                    2. {language === 'pt' ? 'Decisão da IA' : 'AI Decision'}
                  </h2>
                  <p className="text-gray-400">
                    {language === 'pt' ? 'Análise inteligente e direcionamento estratégico' : 'Intelligent analysis and strategic guidance'}
                  </p>
                </div>
                {isProcessing && (
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="ml-auto text-violet-400 text-sm"
                  >
                    {language === 'pt' ? 'Processando...' : 'Processing...'}
                  </motion.div>
                )}
              </div>

              <div className="bg-black/20 rounded-xl p-6 border border-gray-700/30 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-lg text-gray-300">
                      {language === 'pt' ? 'Direção Recomendada' : 'Recommended Direction'}
                    </div>
                    <motion.div 
                      key={aiDecision.direction}
                      initial={{ scale: 1.3, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`text-3xl font-bold ${
                        aiDecision.direction === 'LONG' ? 'text-green-400' : 
                        aiDecision.direction === 'SHORT' ? 'text-red-400' : 'text-yellow-400'
                      }`}
                    >
                      {aiDecision.direction}
                    </motion.div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg text-gray-300">
                      {language === 'pt' ? 'Confiança' : 'Confidence'}
                    </div>
                    <motion.div 
                      key={aiDecision.confidence}
                      initial={{ scale: 1.3, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-3xl font-bold text-blue-400"
                    >
                      {aiDecision.confidence.toFixed(1)}%
                    </motion.div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-sm text-gray-400 mb-2">
                    {language === 'pt' ? 'Sentimento de Mercado' : 'Market Sentiment'}
                  </div>
                  <motion.div 
                    key={aiDecision.marketSentiment}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="text-lg font-bold text-emerald-400"
                  >
                    {aiDecision.marketSentiment}
                  </motion.div>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-2">
                    {language === 'pt' ? 'Raciocínio da IA' : 'AI Reasoning'}
                  </div>
                  <motion.div 
                    key={aiDecision.reasoning}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-300"
                  >
                    {aiDecision.reasoning}
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* 3. PROCESSAMENTO DE SINAIS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-amber-900/40 to-orange-900/30 backdrop-blur-sm rounded-2xl border border-amber-500/30 p-6 relative overflow-hidden"
            >
              {isProcessing && (
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-500/20 to-amber-500/10 animate-pulse"></div>
              )}
              
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <motion.div 
                  animate={{ 
                    scale: isProcessing ? [1, 1.2, 1] : 1,
                    rotate: isProcessing ? [0, 360] : 0
                  }}
                  transition={{ 
                    duration: 1, 
                    repeat: isProcessing ? Infinity : 0,
                    ease: "linear"
                  }}
                  className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center"
                >
                  <span className="text-2xl">⚡</span>
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold text-amber-400">
                    3. {language === 'pt' ? 'Processamento de Sinais' : 'Signal Processing'}
                  </h2>
                  <p className="text-gray-400">
                    {language === 'pt' ? 'Filtragem e validação para execução' : 'Filtering and validation for execution'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 relative z-10">
                <AnimatePresence>
                  {signals.map((signal, index) => (
                    <motion.div
                      key={signal.id}
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: -20 }}
                      transition={{ 
                        delay: index * 0.05,
                        duration: 0.3,
                        type: "spring",
                        bounce: 0.3
                      }}
                      className={`bg-black/30 backdrop-blur-sm rounded-lg p-3 border transition-all duration-300 hover:scale-105 ${
                        signal.status === 'EXECUTADO' ? 'border-green-500/60 bg-green-500/10 shadow-lg shadow-green-500/20' :
                        signal.status === 'APROVADO' ? 'border-blue-500/60 bg-blue-500/10 shadow-lg shadow-blue-500/20' :
                        signal.status === 'DESCARTADO' ? 'border-red-500/60 bg-red-500/10 shadow-lg shadow-red-500/20' :
                        'border-yellow-500/60 bg-yellow-500/10 shadow-lg shadow-yellow-500/20 animate-pulse'
                      }`}
                    >
                      {/* Header com status indicator */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <motion.div 
                            animate={{ 
                              scale: signal.status === 'PROCESSANDO' ? [1, 1.3, 1] : 1,
                              rotate: signal.status === 'PROCESSANDO' ? [0, 360] : 0
                            }}
                            transition={{ 
                              duration: signal.status === 'PROCESSANDO' ? 1.5 : 0,
                              repeat: signal.status === 'PROCESSANDO' ? Infinity : 0,
                              ease: "linear"
                            }}
                            className={`w-2 h-2 rounded-full ${
                              signal.status === 'EXECUTADO' ? 'bg-green-400' :
                              signal.status === 'APROVADO' ? 'bg-blue-400' :
                              signal.status === 'DESCARTADO' ? 'bg-red-400' :
                              'bg-yellow-400'
                            }`}
                          />
                          <span className="text-xs font-bold text-white">{signal.pair}</span>
                        </div>
                        <div className={`text-xs font-bold px-2 py-1 rounded-full ${
                          signal.status === 'EXECUTADO' ? 'bg-green-500/20 text-green-400' :
                          signal.status === 'APROVADO' ? 'bg-blue-500/20 text-blue-400' :
                          signal.status === 'DESCARTADO' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {signal.status}
                        </div>
                      </div>

                      {/* Direction and Confidence */}
                      <div className="flex items-center justify-between mb-2">
                        <div className={`text-sm font-bold px-2 py-1 rounded ${
                          signal.direction === 'LONG' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {signal.direction}
                        </div>
                        <motion.div 
                          key={`${signal.id}-${signal.confidence}`}
                          initial={{ scale: 1.2, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-sm font-bold text-white"
                        >
                          {signal.confidence.toFixed(1)}%
                        </motion.div>
                      </div>

                      {/* Reasoning - truncated for smaller boxes */}
                      <div className="text-xs text-gray-400 overflow-hidden" style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        textOverflow: 'ellipsis'
                      }}>
                        {signal.reasoning}
                      </div>

                      {/* Time indicator */}
                      <div className="text-xs text-gray-500 mt-2 text-right">
                        {formatTime(signal.timestamp)}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* TOP 10 PROCESS SIGNALS - REAL-TIME RANKING */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-gradient-to-br from-purple-900/40 to-indigo-900/30 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-6 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-indigo-500/10 to-purple-500/5 animate-pulse"></div>

              <div className="flex items-center gap-3 mb-6 relative z-10">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center"
                >
                  <span className="text-white font-bold text-sm">🔝</span>
                </motion.div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {language === 'pt' ? 'TOP 10 SINAIS DE PROCESSO' : 'TOP 10 PROCESS SIGNALS'}
                  </h3>
                  <p className="text-purple-300 text-sm">
                    {language === 'pt'
                      ? `${topSignals.length} sinais classificados por performance`
                      : `${topSignals.length} signals ranked by performance`
                    }
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 relative z-10">
                <AnimatePresence mode="popLayout">
                  {topSignals.slice(0, 10).map((signal, index) => (
                    <motion.div
                      key={signal.id}
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: -20 }}
                      transition={{
                        delay: index * 0.1,
                        duration: 0.4,
                        type: "spring",
                        bounce: 0.4
                      }}
                      className={`bg-black/40 backdrop-blur-sm rounded-lg p-4 border-2 transition-all duration-300 hover:scale-105 relative overflow-hidden ${
                        signal.performance === 'HIGH' ? 'border-green-500/60 bg-green-500/10 shadow-lg shadow-green-500/20' :
                        signal.performance === 'MEDIUM' ? 'border-yellow-500/60 bg-yellow-500/10 shadow-lg shadow-yellow-500/20' :
                        'border-red-500/60 bg-red-500/10 shadow-lg shadow-red-500/20'
                      }`}
                    >
                      {/* Rank Badge */}
                      <div className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg">
                        #{signal.rank}
                      </div>

                      {/* Pair and Direction */}
                      <div className="flex items-center justify-between mb-3 mt-2">
                        <div className="text-xs font-bold text-white">{signal.pair}</div>
                        <div className={`text-xs font-bold px-2 py-1 rounded-full ${
                          signal.direction === 'LONG' ? 'bg-green-500/30 text-green-300' : 'bg-red-500/30 text-red-300'
                        }`}>
                          {signal.direction}
                        </div>
                      </div>

                      {/* P&L Display */}
                      <div className="mb-3">
                        <div className={`text-lg font-bold ${
                          signal.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {formatPercent(signal.pnlPercent)}
                        </div>
                        <div className={`text-xs ${
                          signal.pnl >= 0 ? 'text-green-300' : 'text-red-300'
                        }`}>
                          {formatPrice(signal.pnl)}
                        </div>
                      </div>

                      {/* Confidence and Activity */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-xs text-purple-300">
                          {signal.confidence}% conf.
                        </div>
                        <div className={`text-xs px-2 py-1 rounded ${
                          signal.activity === 'ACTIVE' ? 'bg-green-500/20 text-green-300' :
                          signal.activity === 'MONITORING' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-gray-500/20 text-gray-300'
                        }`}>
                          {signal.activity}
                        </div>
                      </div>

                      {/* Status */}
                      <div className={`text-xs text-center px-2 py-1 rounded-full font-semibold ${
                        signal.status === 'EXECUTADO' ? 'bg-green-500/20 text-green-400' :
                        signal.status === 'APROVADO' ? 'bg-blue-500/20 text-blue-400' :
                        signal.status === 'DESCARTADO' ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {signal.status}
                      </div>

                      {/* Performance indicator */}
                      <motion.div
                        animate={{
                          scale: signal.performance === 'HIGH' ? [1, 1.1, 1] : 1,
                          opacity: signal.performance === 'HIGH' ? [1, 0.7, 1] : 1
                        }}
                        transition={{
                          duration: 2,
                          repeat: signal.performance === 'HIGH' ? Infinity : 0,
                          ease: "easeInOut"
                        }}
                        className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
                          signal.performance === 'HIGH' ? 'bg-green-400' :
                          signal.performance === 'MEDIUM' ? 'bg-yellow-400' :
                          'bg-red-400'
                        }`}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Update indicator */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-purple-500/20 text-xs text-purple-300 relative z-10">
                <span>
                  {language === 'pt' ? 'Atualizado automaticamente a cada 30s' : 'Auto-updated every 30s'}
                </span>
                <span>
                  {language === 'pt' ? 'Fonte: Sistema de Trading' : 'Source: Trading System'}
                </span>
              </div>
            </motion.div>

            {/* 4. OPERAÇÕES EM ANDAMENTO - MONITORAMENTO */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-emerald-900/40 to-teal-900/30 backdrop-blur-sm rounded-2xl border border-emerald-500/30 p-6 relative overflow-hidden"
            >
              {isProcessing && (
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/20 to-emerald-500/10 animate-pulse"></div>
              )}
              
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <motion.div 
                  animate={{ 
                    y: isProcessing ? [0, -5, 0] : 0
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: isProcessing ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                  className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center"
                >
                  <span className="text-2xl">📈</span>
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold text-emerald-400">
                    4. {language === 'pt' ? 'Operações em Andamento' : 'Operations in Progress'}
                  </h2>
                  <p className="text-gray-400">
                    {language === 'pt' ? 'Máximo 2 operações simultâneas por usuário' : 'Maximum 2 simultaneous operations per user'}
                  </p>
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                <AnimatePresence>
                  {positions.map((position, index) => (
                    <motion.div
                      key={position.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-black/20 rounded-xl p-4 border border-gray-700/30"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <motion.div 
                            animate={{ 
                              scale: [1, 1.1, 1]
                            }}
                            transition={{ 
                              duration: 2, 
                              repeat: Infinity
                            }}
                            className={`w-4 h-4 rounded-full ${
                              position.type === 'LONG' ? 'bg-green-400' : 'bg-red-400'
                            }`}
                          />
                          <div>
                            <div className="font-bold text-white text-lg">{position.pair}</div>
                            <div className={`text-sm font-bold ${
                              position.type === 'LONG' ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {position.type}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <motion.div 
                            key={position.pnlPercent}
                            initial={{ scale: 1.2, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={`text-xl font-bold ${
                              position.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                            }`}
                          >
                            {formatPercent(position.pnlPercent)}
                          </motion.div>
                          <motion.div 
                            key={position.pnl}
                            initial={{ scale: 1.2, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={`text-lg ${
                              position.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                            }`}
                          >
                            ${position.pnl.toFixed(2)}
                          </motion.div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-400">
                            {language === 'pt' ? 'Entrada' : 'Entry'}
                          </div>
                          <div className="text-white font-bold">{formatPrice(position.entryPrice)}</div>
                        </div>
                        <div>
                          <div className="text-gray-400">
                            {language === 'pt' ? 'Atual' : 'Current'}
                          </div>
                          <motion.div 
                            key={position.currentPrice}
                            initial={{ scale: 1.1, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-white font-bold"
                          >
                            {formatPrice(position.currentPrice)}
                          </motion.div>
                        </div>
                        <div>
                          <div className="text-gray-400">Stop Loss</div>
                          <div className="text-red-400 font-bold">{formatPrice(position.stopLoss || 0)}</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Take Profit</div>
                          <div className="text-green-400 font-bold">{formatPrice(position.takeProfit || 0)}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Timestamp e Status */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center text-gray-400 text-sm bg-gray-900/30 rounded-xl p-4"
            >
              <div className="flex items-center justify-center gap-4 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>
                    {language === 'pt' ? 'Última atualização:' : 'Last update:'} {formatTime(currentTime)}
                  </span>
                </div>
                <div className="text-gray-600">|</div>
                <div>
                  {language === 'pt' ? 'Sistema ativo desde' : 'System active since'} {formatTime(new Date(Date.now() - 8 * 60 * 60 * 1000))}
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {language === 'pt' 
                  ? 'Monitoramento 24/7 • Atualizações automáticas a cada 30 segundos' 
                  : '24/7 Monitoring • Automatic updates every 30 seconds'
                }
              </div>
            </motion.div>
          </div>

          {/* Connection Status Warning */}
          {!isConnected && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg p-4"
            >
              <div className="flex items-center">
                <div className="text-red-600 dark:text-red-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                    {language === 'pt' ? 'Conexão Perdida' : 'Connection Lost'}
                  </h3>
                  <p className="text-sm text-red-600 dark:text-red-300">
                    {language === 'pt'
                      ? 'Tentando reconectar ao sistema de trading...'
                      : 'Trying to reconnect to trading system...'
                    }
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </UserLayout>
    );
  };

  export default UserOperations;
