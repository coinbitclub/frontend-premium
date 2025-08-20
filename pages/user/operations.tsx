import React, { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../hooks/useLanguage';
import UserLayout from '../../components/UserLayout';

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

const UserOperations: React.FC = () => {
  const [mounted, setMounted] = useState<boolean>(false);
  const { language, t } = useLanguage();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Cache keys
  const CACHE_KEY = 'operations_data';
  const CACHE_DURATION = 30 * 1000; // 30 seconds
  
  // Estados do fluxo real com valores padrão otimizados
  const [marketIndicators, setMarketIndicators] = useState<MarketIndicators>({
    fearAndGreed: 42,
    fearAndGreedStatus: 'FEAR',
    btcDominance: 56.8,
    top100LongShort: { long: 62.3, short: 37.7 },
    lastUpdate: new Date()
  });
  
  const [aiDecision, setAiDecision] = useState<AIDecision>({
    direction: 'LONG',
    confidence: 78.5,
    reasoning: language === 'pt' 
      ? 'Fear extremo + dominância BTC estável + posições short excessivas = oportunidade de compra'
      : 'Extreme fear + stable BTC dominance + excessive short positions = buying opportunity',
    timestamp: new Date(),
    marketSentiment: language === 'pt' ? 'RECUPERAÇÃO IMINENTE' : 'IMMINENT RECOVERY'
  });
  
  const [signals, setSignals] = useState<Signal[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  
  const [dailyStats, setDailyStats] = useState<DailyStats>({
    operationsToday: 8,
    successRate: 87.5,
    historicalSuccessRate: 73.2,
    todayReturnUSD: 247.80,
    todayReturnPercent: 2.48,
    totalInvested: 10000
  });

  const router = useRouter();

  // Optimized data loading with cache
  const loadOperationsData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Check cache first
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setSignals(data.signals || []);
          setPositions(data.positions || []);
          setDailyStats(data.dailyStats || dailyStats);
          setIsLoading(false);
          return;
        }
      }

      // Generate data with shorter delay
      await new Promise(resolve => setTimeout(resolve, 200));
      await generateInitialData();
      
    } catch (error) {
      console.error('Error loading operations data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [CACHE_KEY, CACHE_DURATION, dailyStats]);

  useEffect(() => {
    setMounted(true);
    loadOperationsData();
    
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
    
    // Update data every 10 seconds for real-time feel
    const dataInterval = setInterval(() => {
      setIsProcessing(true);
      setTimeout(() => {
        updateRealTimeData();
        setIsProcessing(false);
      }, 1000); // 1 second processing animation
    }, 10000);

    // Generate new signals every 3-7 seconds to show movement
    const signalInterval = setInterval(() => {
      generateNewSignal();
    }, Math.random() * 4000 + 3000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(dataInterval);
      clearInterval(signalInterval);
    };
  }, [language]);

  const generateInitialData = () => {
    // Muitos sinais em diferentes estágios para dar sensação de movimento
    const initialSignals: Signal[] = [
      {
        id: '1',
        pair: 'BTC/USDT',
        direction: 'LONG',
        strength: 85,
        confidence: 78.5,
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        status: 'EXECUTADO',
        reasoning: 'Divergência bullish + volume crescente'
      },
      {
        id: '2',
        pair: 'ETH/USDT',
        direction: 'LONG',
        strength: 72,
        confidence: 68.2,
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        status: 'APROVADO',
        reasoning: 'Suporte forte em $3.200 + momentum positivo'
      },
      {
        id: '3',
        pair: 'ADA/USDT',
        direction: 'SHORT',
        strength: 45,
        confidence: 52.1,
        timestamp: new Date(Date.now() - 8 * 60 * 1000),
        status: 'DESCARTADO',
        reasoning: 'Confidence abaixo do limiar mínimo (60%)'
      },
      {
        id: '4',
        pair: 'SOL/USDT',
        direction: 'LONG',
        strength: 88,
        confidence: 82.7,
        timestamp: new Date(Date.now() - 1 * 60 * 1000),
        status: 'PROCESSANDO',
        reasoning: 'Análise em andamento...'
      },
      {
        id: '5',
        pair: 'MATIC/USDT',
        direction: 'LONG',
        strength: 76,
        confidence: 71.3,
        timestamp: new Date(Date.now() - 30 * 1000),
        status: 'PROCESSANDO',
        reasoning: 'Rompimento de resistência detectado'
      },
      {
        id: '6',
        pair: 'DOT/USDT',
        direction: 'SHORT',
        strength: 63,
        confidence: 65.8,
        timestamp: new Date(Date.now() - 45 * 1000),
        status: 'APROVADO',
        reasoning: 'Padrão de reversão confirmado'
      },
      {
        id: '7',
        pair: 'LINK/USDT',
        direction: 'LONG',
        strength: 59,
        confidence: 58.2,
        timestamp: new Date(Date.now() - 15 * 1000),
        status: 'DESCARTADO',
        reasoning: 'Volume insuficiente para entrada'
      },
      {
        id: '8',
        pair: 'UNI/USDT',
        direction: 'LONG',
        strength: 91,
        confidence: 84.6,
        timestamp: new Date(Date.now() - 10 * 1000),
        status: 'PROCESSANDO',
        reasoning: 'Breakout em canal ascendente'
      },
      {
        id: '9',
        pair: 'AVAX/USDT',
        direction: 'SHORT',
        strength: 67,
        confidence: 69.1,
        timestamp: new Date(Date.now() - 60 * 1000),
        status: 'EXECUTADO',
        reasoning: 'Topo duplo formado + divergência'
      },
      {
        id: '10',
        pair: 'ATOM/USDT',
        direction: 'LONG',
        strength: 54,
        confidence: 56.7,
        timestamp: new Date(Date.now() - 20 * 1000),
        status: 'DESCARTADO',
        reasoning: 'Confluência de indicadores fraca'
      },
      {
        id: '11',
        pair: 'FTM/USDT',
        direction: 'LONG',
        strength: 82,
        confidence: 79.4,
        timestamp: new Date(Date.now() - 5 * 1000),
        status: 'PROCESSANDO',
        reasoning: 'Momentum bullish + alta de volume'
      },
      {
        id: '12',
        pair: 'ALGO/USDT',
        direction: 'SHORT',
        strength: 48,
        confidence: 51.9,
        timestamp: new Date(Date.now() - 90 * 1000),
        status: 'DESCARTADO',
        reasoning: 'Sinal abaixo do threshold de risco'
      }
    ];

    // Posições abertas sendo monitoradas
    const initialPositions: Position[] = [
      {
        id: '1',
        pair: 'BTC/USDT',
        type: 'LONG',
        entryPrice: 67432.50,
        currentPrice: 67589.20,
        quantity: 0.0148,
        pnl: 156.70 * 0.0148,
        pnlPercent: 0.23,
        status: 'OPEN',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        stopLoss: 66800,
        takeProfit: 68500
      },
      {
        id: '2',
        pair: 'ETH/USDT',
        type: 'LONG',
        entryPrice: 3247.80,
        currentPrice: 3289.45,
        quantity: 1.52,
        pnl: 41.65 * 1.52,
        pnlPercent: 1.28,
        status: 'OPEN',
        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
        stopLoss: 3180,
        takeProfit: 3380
      }
    ];

    setSignals(initialSignals);
    setPositions(initialPositions);
  };

  const updateRealTimeData = () => {
    // Atualizar indicadores de mercado
    setMarketIndicators(prev => ({
      ...prev,
      fearAndGreed: Math.max(0, Math.min(100, prev.fearAndGreed + (Math.random() - 0.5) * 5)),
      btcDominance: Math.max(50, Math.min(70, prev.btcDominance + (Math.random() - 0.5) * 0.5)),
      top100LongShort: {
        long: Math.max(30, Math.min(80, prev.top100LongShort.long + (Math.random() - 0.5) * 2)),
        short: Math.max(20, Math.min(70, prev.top100LongShort.short + (Math.random() - 0.5) * 2))
      },
      lastUpdate: new Date()
    }));

    // Atualizar preços das posições
    setPositions(prev => prev.map(pos => {
      const priceChange = (Math.random() - 0.5) * pos.currentPrice * 0.002;
      const newPrice = pos.currentPrice + priceChange;
      const pnl = (newPrice - pos.entryPrice) * pos.quantity * (pos.type === 'LONG' ? 1 : -1);
      const pnlPercent = ((newPrice - pos.entryPrice) / pos.entryPrice) * 100 * (pos.type === 'LONG' ? 1 : -1);
      
      return {
        ...pos,
        currentPrice: newPrice,
        pnl,
        pnlPercent
      };
    }));

    // Atualizar decisão da IA
    setAiDecision(prev => ({
      ...prev,
      confidence: Math.max(60, Math.min(95, prev.confidence + (Math.random() - 0.5) * 5)),
      timestamp: new Date()
    }));

    // Atualizar estatísticas diárias
    setDailyStats(prev => ({
      ...prev,
      operationsToday: prev.operationsToday + (Math.random() > 0.7 ? 1 : 0),
      successRate: Math.max(75, Math.min(95, prev.successRate + (Math.random() - 0.5) * 2)),
      todayReturnUSD: prev.todayReturnUSD + (Math.random() - 0.3) * 50,
      todayReturnPercent: prev.todayReturnPercent + (Math.random() - 0.3) * 0.5
    }));
  };

  const generateNewSignal = () => {
    const cryptoPairs = [
      'BTC/USDT', 'ETH/USDT', 'ADA/USDT', 'SOL/USDT', 'MATIC/USDT', 'DOT/USDT',
      'LINK/USDT', 'UNI/USDT', 'AVAX/USDT', 'ATOM/USDT', 'FTM/USDT', 'ALGO/USDT',
      'XRP/USDT', 'DOGE/USDT', 'LTC/USDT', 'BCH/USDT', 'TRX/USDT', 'EOS/USDT',
      'XLM/USDT', 'VET/USDT', 'FIL/USDT', 'ICP/USDT', 'THETA/USDT', 'AAVE/USDT'
    ];

    const reasonings = [
      'Breakout confirmado + volume alto',
      'Suporte testado com sucesso',
      'Divergência detectada no RSI',
      'Padrão harmônico identificado',
      'Momentum crescente confirmado',
      'Resistência rompida com força',
      'Canal de alta em formação',
      'Pullback em tendência principal',
      'Confluência de médias móveis',
      'Zona de demanda ativada',
      'Reversão em suporte chave',
      'Setup de continuação detectado',
      'Volume anômalo identificado',
      'Squeeze momentum building',
      'Elliott Wave em desenvolvimento'
    ];

    const newSignal: Signal = {
      id: Date.now().toString(),
      pair: cryptoPairs[Math.floor(Math.random() * cryptoPairs.length)],
      direction: Math.random() > 0.6 ? 'LONG' : 'SHORT',
      strength: Math.floor(Math.random() * 40 + 50), // 50-90
      confidence: Math.random() * 40 + 50, // 50-90%
      timestamp: new Date(),
      status: Math.random() > 0.8 ? 'PROCESSANDO' : 
               Math.random() > 0.6 ? 'APROVADO' :
               Math.random() > 0.3 ? 'EXECUTADO' : 'DESCARTADO',
      reasoning: reasonings[Math.floor(Math.random() * reasonings.length)]
    };

    // Add new signal and keep only the latest 12
    setSignals(prev => [newSignal, ...prev.slice(0, 11)]);
  };

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
              <div className={`w-3 h-3 rounded-full ${isProcessing ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}></div>
              <span className="text-lg font-bold text-green-400">
                {language === 'pt' ? 'Sistema Ativo' : 'System Active'}
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
        </div>
      </UserLayout>
    );
  };

  export default UserOperations;
