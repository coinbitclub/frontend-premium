import axios from 'axios';

// Types and interfaces for hybrid position management
export interface RealTimePosition {
  id: string;
  pair: string;
  symbol: string;
  type: 'LONG' | 'SHORT';
  side: 'LONG' | 'SHORT';
  entryPrice: number;
  currentPrice: number;
  markPrice: number;
  quantity: number;
  size: number;
  pnl: number;
  unrealizedPnl: number;
  pnlPercent: number;
  status: 'OPEN' | 'CLOSED';
  stopLoss?: number;
  takeProfit?: number;
  leverage: number;
  marginType: string;
  positionValue: number;
  liquidationPrice: number;
  exchange: 'bybit' | 'binance';

  // Metadata from database
  operation_id?: string;
  plan_type?: string;
  commission?: number;
  slippage?: number;
  fill_percent?: number;
  entry_time?: string;

  // Status flags
  dataSource: 'exchange' | 'database';
  inSync: boolean;
  isTracked: boolean;

  // Stop-loss/Take-profit info
  sltp?: {
    calculatedFrom: 'current_price' | 'entry_price';
    riskPercent: number;
    rewardPercent: number;
    riskRewardRatio: number;
  };
}

export interface HistoricalTrade {
  operation_id: string;
  user_id: number;
  symbol: string;
  exchange: 'bybit' | 'binance';
  operation_type: 'LONG' | 'SHORT';
  entry_price: number;
  close_price?: number;
  quantity: number;
  leverage: number;
  entry_time: string;
  close_time?: string;
  status: 'OPEN' | 'CLOSED';
  pnl?: number;
  pnl_percent?: number;
  close_reason?: string;
  plan_type?: string;
  commission?: number;
  slippage?: number;
}

export interface AnalyticsSummary {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  totalPnl: number;
  averagePnl: number;
  bestTrade: number;
  worstTrade: number;
  averageHoldTime: number;
  totalVolume: number;
  profitFactor: number;
  sharpeRatio?: number;
  maxDrawdown?: number;

  // By exchange
  byExchange?: {
    exchange: string;
    trades: number;
    winRate: number;
    totalPnl: number;
  }[];

  // By pair
  byPair?: {
    pair: string;
    trades: number;
    winRate: number;
    totalPnl: number;
  }[];

  // Time period
  period?: string;
  startDate?: string;
  endDate?: string;
}

export interface ReconciliationStatus {
  isRunning: boolean;
  interval: number;
  lastRun: string;
  nextRun: string;
  lastResult?: {
    usersReconciled: number;
    discrepanciesFound: number;
    positionsUpdated: number;
  };
}

// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
const API_TIMEOUT = 15000; // 15 seconds for position fetches

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
    // Only add token if it exists and is not empty string
    if (token && token !== '') {
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
      localStorage.removeItem('auth_access_token');
      // Don't redirect, let the page handle auth state
    }
    return Promise.reject(error);
  }
);

class PositionsService {
  /**
   * Get current positions from exchange (real-time)
   * @param exchange Optional - filter by exchange (bybit or binance)
   */
  async getCurrentPositions(exchange?: 'bybit' | 'binance'): Promise<RealTimePosition[]> {
    try {
      const endpoint = exchange
        ? `/positions/current/${exchange}`
        : '/positions/current';

      const response = await apiClient.get(endpoint);

      if (response.data.success) {
        return response.data.positions || [];
      }

      console.warn('Failed to fetch current positions:', response.data);
      return [];
    } catch (error) {
      console.error('Error fetching current positions:', error);
      return [];
    }
  }

  /**
   * Get historical trades from database
   * @param options Filter options (limit, status, exchange, etc.)
   */
  async getHistoricalTrades(options?: {
    limit?: number;
    status?: 'OPEN' | 'CLOSED';
    exchange?: 'bybit' | 'binance';
    symbol?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<HistoricalTrade[]> {
    try {
      const response = await apiClient.get('/positions/history', {
        params: options
      });

      if (response.data.success) {
        return response.data.trades || [];
      }

      console.warn('Failed to fetch historical trades:', response.data);
      return [];
    } catch (error) {
      console.error('Error fetching historical trades:', error);
      return [];
    }
  }

  /**
   * Get analytics summary from database
   * @param period Time period (7d, 30d, 90d, 1y, all)
   */
  async getAnalyticsSummary(period: '7d' | '30d' | '90d' | '1y' | 'all' = '30d'): Promise<AnalyticsSummary | null> {
    try {
      const response = await apiClient.get('/positions/analytics', {
        params: { period }
      });

      if (response.data.success) {
        return response.data.analytics;
      }

      console.warn('Failed to fetch analytics summary:', response.data);
      return null;
    } catch (error) {
      console.error('Error fetching analytics summary:', error);
      return null;
    }
  }

  /**
   * Manually trigger position reconciliation
   */
  async triggerReconciliation(): Promise<boolean> {
    try {
      const response = await apiClient.post('/positions/sync');
      return response.data.success || false;
    } catch (error) {
      console.error('Error triggering reconciliation:', error);
      return false;
    }
  }

  /**
   * Get reconciliation service status
   */
  async getReconciliationStatus(): Promise<ReconciliationStatus | null> {
    try {
      const response = await apiClient.get('/positions/status');

      if (response.data.success) {
        return response.data.status;
      }

      return null;
    } catch (error) {
      console.error('Error fetching reconciliation status:', error);
      return null;
    }
  }

  /**
   * Get position by ID
   */
  async getPositionById(operationId: string): Promise<RealTimePosition | null> {
    try {
      const response = await apiClient.get(`/positions/${operationId}`);

      if (response.data.success) {
        return response.data.position;
      }

      return null;
    } catch (error) {
      console.error('Error fetching position by ID:', error);
      return null;
    }
  }
}

// Export singleton instance
const positionsService = new PositionsService();
export { positionsService };
export default positionsService;
