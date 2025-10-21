import axios from 'axios';

// Types and interfaces
export interface MarketIndicators {
  fearAndGreed: number;
  fearAndGreedStatus: 'EXTREME_FEAR' | 'FEAR' | 'NEUTRAL' | 'GREED' | 'EXTREME_GREED';
  volatility: number;
  marketTrend: 'BULLISH' | 'BEARISH' | 'SIDEWAYS';
  volumeAnalysis: number;
  supportLevel: number;
  resistanceLevel: number;
  btcDominance: number;
  top100LongShort: {
    long: number;
    short: number;
  };
  lastUpdate: string;
}

export interface AIDecision {
  direction: 'LONG' | 'SHORT' | 'HOLD';
  confidence: number;
  reason: string;
  reasoning: string;
  timestamp: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  targetPrice?: number;
  stopLoss?: number;
  leverage?: number;
  marketSentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL' | 'ANALISANDO' | 'ANALYZING';
}

export interface Signal {
  id: string;
  symbol: string;
  pair: string;
  type: 'BUY' | 'SELL' | 'HOLD';
  direction: 'LONG' | 'SHORT' | 'HOLD';
  strength: 'WEAK' | 'MODERATE' | 'STRONG' | 'VERY_STRONG';
  confidence: number;
  price: number;
  targetPrice?: number;
  stopLoss?: number;
  timestamp: string;
  source: 'AI_ANALYSIS' | 'TECHNICAL_ANALYSIS' | 'MARKET_SENTIMENT' | 'HYBRID';
  status: 'ACTIVE' | 'EXECUTED' | 'EXPIRED' | 'CANCELLED';
  profitLoss?: number;
  pnl?: number; // Profit and Loss amount
  pnlPercent?: number; // Profit and Loss percentage
  duration?: number;
  reasoning?: string;
}

export interface Position {
  id: string;
  symbol: string;
  type: 'LONG' | 'SHORT';
  entryPrice: number;
  currentPrice: number;
  amount: number;
  leverage: number;
  unrealizedPnL: number;
  realizedPnL: number;
  pnl: number; // Total P&L (unrealized + realized)
  pnlPercentage?: number; // P&L as percentage
  percentage: number;
  openTime: string;
  status: 'OPEN' | 'CLOSED' | 'PENDING';
  stopLoss?: number;
  takeProfit?: number;
  margin: number;
  marginRatio: number;
}

export interface DailyStats {
  operationsToday: number;
  successRate: number;
  totalProfit: number;
  totalLoss: number;
  netProfit: number;
  winStreak: number;
  averageHoldTime: number;
  volumeTraded: number;
  bestTrade: number;
  worstTrade: number;
  historicalSuccessRate: number;
  todayReturnUSD: number;
  todayReturnPercent: number;
  totalInvested: number;
}

export interface OperationsData {
  marketIndicators: MarketIndicators;
  aiDecision: AIDecision;
  signals: Signal[];
  positions: Position[];
  dailyStats: DailyStats;
}

// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
const API_TIMEOUT = 10000;

// Create axios instance
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

class OperationsService {
  // Get all operations data
  async getAllOperationsData(language: string = 'en'): Promise<OperationsData> {
    try {
      const response = await apiClient.get('/operations/dashboard', {
        params: { language }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching operations data:', error);

      // Return mock data as fallback
      return this.getMockOperationsData();
    }
  }

  // Update real-time market indicators
  async updateRealTimeData(): Promise<MarketIndicators> {
    try {
      const response = await apiClient.get('/operations/market-indicators');
      return response.data;
    } catch (error) {
      console.error('Error updating real-time data:', error);

      // Return mock data as fallback
      return this.getMockMarketIndicators();
    }
  }

  // Generate new AI signal
  async generateNewSignal(): Promise<Signal> {
    try {
      const response = await apiClient.post('/operations/generate-signal');
      return response.data;
    } catch (error) {
      console.error('Error generating new signal:', error);

      // Return mock signal as fallback
      return this.getMockSignal();
    }
  }

  // Get trading signals
  async getSignals(limit: number = 20): Promise<Signal[]> {
    try {
      const response = await apiClient.get('/operations/signals', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching signals:', error);
      return this.getMockSignals();
    }
  }

  // Get open positions (UPDATED: Now uses real-time hybrid API)
  async getPositions(): Promise<Position[]> {
    try {
      // Use new hybrid positions endpoint for real-time data
      const response = await apiClient.get('/positions/current');

      if (response.data.success && response.data.positions) {
        // Transform real-time positions to match Position interface
        return response.data.positions.map((pos: any) => ({
          id: pos.id || pos.operation_id,
          symbol: pos.pair || pos.symbol,
          type: pos.type || pos.side,
          entryPrice: pos.entryPrice || pos.entry_price,
          currentPrice: pos.currentPrice || pos.markPrice,
          amount: pos.quantity || pos.size,
          leverage: pos.leverage || 1,
          unrealizedPnL: pos.pnl || pos.unrealizedPnl || 0,
          realizedPnL: 0,
          pnl: pos.pnl || pos.unrealizedPnl || 0,
          pnlPercentage: pos.pnlPercent || pos.pnl_percent || 0,
          percentage: pos.pnlPercent || pos.pnl_percent || 0,
          openTime: pos.entry_time || pos.timestamp || new Date().toISOString(),
          status: pos.status === 'OPEN' ? 'OPEN' : 'CLOSED',
          stopLoss: pos.stopLoss || pos.stop_loss,
          takeProfit: pos.takeProfit || pos.take_profit,
          margin: pos.positionValue ? pos.positionValue / (pos.leverage || 1) : 0,
          marginRatio: 0.5
        }));
      }

      // Fallback to legacy endpoint if new endpoint fails
      const legacyResponse = await apiClient.get('/operations/positions');
      return legacyResponse.data;
    } catch (error) {
      console.error('Error fetching positions:', error);
      return this.getMockPositions();
    }
  }

  // Get daily statistics
  async getDailyStats(): Promise<DailyStats> {
    try {
      const response = await apiClient.get('/operations/daily-stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching daily stats:', error);
      return this.getMockDailyStats();
    }
  }

  // Execute trading signal
  async executeSignal(signalId: string, amount: number): Promise<Position> {
    try {
      const response = await apiClient.post('/operations/execute-signal', {
        signalId,
        amount
      });
      return response.data;
    } catch (error) {
      console.error('Error executing signal:', error);
      throw error;
    }
  }

  // Close position
  async closePosition(positionId: string): Promise<Position> {
    try {
      const response = await apiClient.post(`/operations/positions/${positionId}/close`);
      return response.data;
    } catch (error) {
      console.error('Error closing position:', error);
      throw error;
    }
  }

  // Mock data methods for fallback
  private getMockOperationsData(): OperationsData {
    return {
      marketIndicators: this.getMockMarketIndicators(),
      aiDecision: this.getMockAIDecision(),
      signals: this.getMockSignals(),
      positions: this.getMockPositions(),
      dailyStats: this.getMockDailyStats()
    };
  }

  private getMockMarketIndicators(): MarketIndicators {
    return {
      fearAndGreed: Math.floor(Math.random() * 100),
      fearAndGreedStatus: ['EXTREME_FEAR', 'FEAR', 'NEUTRAL', 'GREED', 'EXTREME_GREED'][Math.floor(Math.random() * 5)] as any,
      volatility: Math.random() * 100,
      marketTrend: ['BULLISH', 'BEARISH', 'SIDEWAYS'][Math.floor(Math.random() * 3)] as any,
      volumeAnalysis: Math.random() * 100,
      supportLevel: 45000 + Math.random() * 5000,
      resistanceLevel: 52000 + Math.random() * 5000,
      btcDominance: 40 + Math.random() * 20,
      top100LongShort: {
        long: 30 + Math.random() * 40,
        short: 30 + Math.random() * 40
      },
      lastUpdate: new Date().toISOString()
    };
  }

  private getMockAIDecision(): AIDecision {
    const directions = ['LONG', 'SHORT', 'HOLD'] as const;
    const riskLevels = ['LOW', 'MEDIUM', 'HIGH'] as const;
    const sentiments = ['BULLISH', 'BEARISH', 'NEUTRAL', 'ANALISANDO', 'ANALYZING'] as const;

    const reason = 'AI analysis suggests favorable market conditions based on technical indicators and sentiment analysis.';

    return {
      direction: directions[Math.floor(Math.random() * directions.length)],
      confidence: Math.floor(Math.random() * 40) + 60, // 60-100%
      reason,
      reasoning: reason,
      timestamp: new Date().toISOString(),
      riskLevel: riskLevels[Math.floor(Math.random() * riskLevels.length)],
      targetPrice: 50000 + Math.random() * 10000,
      stopLoss: 45000 + Math.random() * 5000,
      leverage: Math.floor(Math.random() * 10) + 1,
      marketSentiment: sentiments[Math.floor(Math.random() * sentiments.length)]
    };
  }

  private getMockSignals(): Signal[] {
    const symbols = ['BTCUSDT', 'ETHUSDT', 'ADAUSDT', 'SOLUSDT', 'DOTUSDT'];
    const types = ['BUY', 'SELL', 'HOLD'] as const;
    const directions = ['LONG', 'SHORT', 'HOLD'] as const;
    const strengths = ['WEAK', 'MODERATE', 'STRONG', 'VERY_STRONG'] as const;
    const sources = ['AI_ANALYSIS', 'TECHNICAL_ANALYSIS', 'MARKET_SENTIMENT', 'HYBRID'] as const;
    const statuses = ['ACTIVE', 'EXECUTED', 'EXPIRED', 'CANCELLED'] as const;

    return Array.from({ length: 10 }, (_, i) => {
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      const profitLoss = (Math.random() - 0.5) * 1000;
      const pnl = (Math.random() - 0.3) * 500; // Bias towards profit
      const pnlPercent = (Math.random() - 0.3) * 15; // Percentage gain/loss

      return {
        id: `signal_${i + 1}`,
        symbol,
        pair: symbol,
        type: types[Math.floor(Math.random() * types.length)],
        direction: directions[Math.floor(Math.random() * directions.length)],
        strength: strengths[Math.floor(Math.random() * strengths.length)],
        confidence: Math.floor(Math.random() * 40) + 60,
        price: 40000 + Math.random() * 20000,
        targetPrice: 45000 + Math.random() * 15000,
        stopLoss: 35000 + Math.random() * 10000,
        timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
        source: sources[Math.floor(Math.random() * sources.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        profitLoss,
        pnl,
        pnlPercent,
        duration: Math.floor(Math.random() * 3600),
        reasoning: 'Technical analysis indicates favorable entry point based on RSI and moving averages.'
      };
    });
  }

  private getMockSignal(): Signal {
    const symbols = ['BTCUSDT', 'ETHUSDT', 'ADAUSDT', 'SOLUSDT', 'DOTUSDT'];
    const types = ['BUY', 'SELL', 'HOLD'] as const;
    const directions = ['LONG', 'SHORT', 'HOLD'] as const;
    const strengths = ['WEAK', 'MODERATE', 'STRONG', 'VERY_STRONG'] as const;
    const sources = ['AI_ANALYSIS', 'TECHNICAL_ANALYSIS', 'MARKET_SENTIMENT', 'HYBRID'] as const;

    const symbol = symbols[Math.floor(Math.random() * symbols.length)];

    const pnl = (Math.random() - 0.3) * 500; // Bias towards profit
    const pnlPercent = (Math.random() - 0.3) * 15; // Percentage gain/loss

    return {
      id: `signal_${Date.now()}`,
      symbol,
      pair: symbol,
      type: types[Math.floor(Math.random() * types.length)],
      direction: directions[Math.floor(Math.random() * directions.length)],
      strength: strengths[Math.floor(Math.random() * strengths.length)],
      confidence: Math.floor(Math.random() * 40) + 60,
      price: 40000 + Math.random() * 20000,
      targetPrice: 45000 + Math.random() * 15000,
      stopLoss: 35000 + Math.random() * 10000,
      timestamp: new Date().toISOString(),
      source: sources[Math.floor(Math.random() * sources.length)],
      status: 'ACTIVE',
      pnl,
      pnlPercent,
      duration: Math.floor(Math.random() * 3600),
      reasoning: 'AI analysis suggests strong buy signal based on market conditions.'
    };
  }

  private getMockPositions(): Position[] {
    const symbols = ['BTCUSDT', 'ETHUSDT', 'ADAUSDT', 'SOLUSDT'];
    const types = ['LONG', 'SHORT'] as const;
    const statuses = ['OPEN', 'CLOSED', 'PENDING'] as const;

    return Array.from({ length: 5 }, (_, i) => {
      const entryPrice = 40000 + Math.random() * 20000;
      const currentPrice = entryPrice + (Math.random() - 0.5) * 5000;
      const amount = Math.random() * 2;
      const leverage = Math.floor(Math.random() * 10) + 1;
      const unrealizedPnL = (currentPrice - entryPrice) * amount;

      const realizedPnL = Math.random() * 100 - 50; // Random realized P&L
      const totalPnL = unrealizedPnL + realizedPnL;
      const pnlPercentage = (totalPnL / (entryPrice * amount)) * 100;

      return {
        id: `position_${i + 1}`,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        type: types[Math.floor(Math.random() * types.length)],
        entryPrice,
        currentPrice,
        amount,
        leverage,
        unrealizedPnL,
        realizedPnL,
        pnl: totalPnL,
        pnlPercentage,
        percentage: (unrealizedPnL / (entryPrice * amount)) * 100,
        openTime: new Date(Date.now() - Math.random() * 86400000).toISOString(),
        status: statuses[Math.floor(Math.random() * statuses.length)],
        stopLoss: entryPrice * 0.95,
        takeProfit: entryPrice * 1.1,
        margin: (entryPrice * amount) / leverage,
        marginRatio: 0.5
      };
    });
  }

  private getMockDailyStats(): DailyStats {
    const operationsToday = Math.floor(Math.random() * 20) + 5;
    const successfulOps = Math.floor(operationsToday * (0.6 + Math.random() * 0.3));

    return {
      operationsToday,
      successRate: (successfulOps / operationsToday) * 100,
      totalProfit: Math.random() * 5000 + 1000,
      totalLoss: Math.random() * 2000 + 500,
      netProfit: Math.random() * 3000,
      winStreak: Math.floor(Math.random() * 10) + 1,
      averageHoldTime: Math.floor(Math.random() * 3600) + 300,
      volumeTraded: Math.random() * 100000 + 10000,
      bestTrade: Math.random() * 1000 + 100,
      worstTrade: -(Math.random() * 500 + 50),
      historicalSuccessRate: 60 + Math.random() * 30,
      todayReturnUSD: (Math.random() - 0.5) * 2000,
      todayReturnPercent: (Math.random() - 0.5) * 10,
      totalInvested: Math.random() * 50000 + 10000
    };
  }
}

// Export singleton instance
const operationsService = new OperationsService();
export { operationsService };
export default operationsService;