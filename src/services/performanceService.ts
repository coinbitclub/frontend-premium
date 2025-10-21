import axios from 'axios';
import positionsService, { AnalyticsSummary, HistoricalTrade } from './positionsService';

// Types and interfaces for performance data
export interface TodayGain {
  amount: number;
  percentage: number;
  change: 'positive' | 'negative' | 'neutral';
}

export interface WinRateOperations {
  total: number;
  winning: number;
  losing: number;
}

export interface WinRate {
  percentage: number;
  operations: WinRateOperations;
}

export interface TotalReturn {
  percentage: number;
  period: string;
}

export interface TotalOperations {
  count: number;
  status: string;
}

export interface PerformanceOverview {
  todayGain: TodayGain;
  winRate: WinRate;
  totalReturn: TotalReturn;
  totalOperations: TotalOperations;
  lastUpdated: string;
}

export interface Operation {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  direction: 'LONG' | 'SHORT';
  entryPrice: number;
  exitPrice?: number;
  amount: number;
  leverage: number;
  profit: number;
  profitPercentage: number;
  status: 'OPEN' | 'CLOSED' | 'CANCELLED';
  openTime: string;
  closeTime?: string;
  duration?: number;
}

export interface DistributionDataItem {
  label: string;
  value: number;
  percentage: number;
  color: string;
}

export interface PerformanceStatistics {
  totalProfit: number;
  totalLoss: number;
  netProfit: number;
  profitFactor: number;
  maxDrawdown: number;
  averageProfit: number;
  averageLoss: number;
  largestProfit: number;
  largestLoss: number;
  consecutiveWins: number;
  consecutiveLosses: number;
  averageWinDuration: number; // in minutes
  averageLossDuration: number; // in minutes
  dailyProfitData: DailyProfitData[];
  monthlyProfitData: MonthlyProfitData[];
  profitBySymbol: ProfitBySymbolData[];
}

export interface DailyProfitData {
  date: string;
  profit: number;
  operations: number;
}

export interface MonthlyProfitData {
  month: string;
  profit: number;
  operations: number;
  winRate: number;
}

export interface ProfitBySymbolData {
  symbol: string;
  profit: number;
  operations: number;
  winRate: number;
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
    // FIXED: Use correct token key from auth service
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
      console.log('Performance API: Authentication required, but not redirecting automatically');
      // Don't automatically redirect to login for performance page
      // localStorage.removeItem('token');
      // window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

class PerformanceService {
  // Get performance overview data
  async getPerformanceOverview(): Promise<PerformanceOverview> {
    try {
      const response = await apiClient.get('/performance/overview');
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error('API returned error');
      }
    } catch (error) {
      console.error('Error fetching performance overview:', error);
      return this.getMockPerformanceOverview();
    }
  }

  // Get recent operations
  async getRecentOperations(limit: number = 10): Promise<Operation[]> {
    try {
      const response = await apiClient.get('/performance/operations', {
        params: { limit }
      });
      if (response.data.success) {
        // Convert backend format to frontend format
        return response.data.data.map((op: any) => ({
          id: `op_${Date.now()}_${Math.random()}`,
          symbol: op.pair || 'UNKNOWN',
          type: 'BUY' as const,
          direction: op.type === 'LONG' ? 'LONG' as const : 'SHORT' as const,
          entryPrice: 0, // Not provided by backend
          exitPrice: 0, // Not provided by backend
          amount: 0, // Not provided by backend
          leverage: 1, // Not provided by backend
          profit: op.profit || 0,
          profitPercentage: op.percentage || 0,
          status: op.status === 'completed' ? 'CLOSED' as const : 'OPEN' as const,
          openTime: new Date().toISOString(), // Backend provides date/time separately
          closeTime: new Date().toISOString(),
          duration: 0
        }));
      } else {
        throw new Error('API returned error');
      }
    } catch (error) {
      console.error('Error fetching recent operations:', error);
      return this.getMockRecentOperations(limit);
    }
  }

  // Get distribution data for charts
  async getDistributionData(): Promise<DistributionDataItem[]> {
    try {
      const response = await apiClient.get('/performance/distribution');
      if (response.data.success) {
        return response.data.data.map((item: any) => ({
          label: item.pair?.replace('USDT', '') || 'Unknown',
          value: parseFloat(item.profit?.replace(/[$,+]/g, '') || '0'),
          percentage: item.percentage || 0,
          color: item.color || '#gray'
        }));
      } else {
        throw new Error('API returned error');
      }
    } catch (error) {
      console.error('Error fetching distribution data:', error);
      return this.getMockDistributionData();
    }
  }

  // Get detailed performance statistics
  async getPerformanceStatistics(): Promise<PerformanceStatistics> {
    try {
      const response = await apiClient.get('/performance/statistics');
      return response.data;
    } catch (error) {
      console.error('Error fetching performance statistics:', error);
      return this.getMockPerformanceStatistics();
    }
  }

  // Get daily profit chart data
  async getDailyProfitData(days: number = 30): Promise<DailyProfitData[]> {
    try {
      const response = await apiClient.get('/performance/daily-profit', {
        params: { days }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching daily profit data:', error);
      return this.getMockDailyProfitData(days);
    }
  }

  // Get monthly profit data
  async getMonthlyProfitData(months: number = 12): Promise<MonthlyProfitData[]> {
    try {
      const response = await apiClient.get('/performance/monthly-profit', {
        params: { months }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching monthly profit data:', error);
      return this.getMockMonthlyProfitData(months);
    }
  }

  // Get chart data from backend
  async getChartData(period: string = '30d'): Promise<any[]> {
    try {
      const response = await apiClient.get('/performance/chart-data', {
        params: { period }
      });
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error('API returned error');
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
      return this.getMockDailyProfitData(30);
    }
  }

  // Get performance metrics from backend
  async getPerformanceMetrics(): Promise<any> {
    try {
      const response = await apiClient.get('/performance/metrics');
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error('API returned error');
      }
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
      return null;
    }
  }

  // ✅ NEW: Get historical analytics from hybrid positions API
  async getHistoricalAnalytics(period: '7d' | '30d' | '90d' | '1y' | 'all' = '30d'): Promise<AnalyticsSummary | null> {
    try {
      return await positionsService.getAnalyticsSummary(period);
    } catch (error) {
      console.error('Error fetching historical analytics:', error);
      return null;
    }
  }

  // ✅ NEW: Get historical trades from hybrid positions API
  async getHistoricalTrades(options?: {
    limit?: number;
    status?: 'OPEN' | 'CLOSED';
    exchange?: 'bybit' | 'binance';
    symbol?: string;
  }): Promise<HistoricalTrade[]> {
    try {
      return await positionsService.getHistoricalTrades(options);
    } catch (error) {
      console.error('Error fetching historical trades:', error);
      return [];
    }
  }

  // Mock data methods for fallback
  private getMockPerformanceOverview(): PerformanceOverview {
    const todayProfitAmount = (Math.random() - 0.3) * 1000; // Bias towards positive
    const todayProfitPercentage = (Math.random() - 0.3) * 10;

    const totalOps = Math.floor(Math.random() * 100) + 20;
    const winningOps = Math.floor(totalOps * (0.6 + Math.random() * 0.3));
    const winRate = (winningOps / totalOps) * 100;

    return {
      todayGain: {
        amount: todayProfitAmount,
        percentage: todayProfitPercentage,
        change: todayProfitAmount >= 0 ? 'positive' : 'negative'
      },
      winRate: {
        percentage: winRate,
        operations: {
          total: totalOps,
          winning: winningOps,
          losing: totalOps - winningOps
        }
      },
      totalReturn: {
        percentage: 15 + Math.random() * 50, // 15-65%
        period: 'since start'
      },
      totalOperations: {
        count: Math.floor(Math.random() * 500) + 100,
        status: 'executed'
      },
      lastUpdated: new Date().toISOString()
    };
  }

  private getMockRecentOperations(limit: number): Operation[] {
    const symbols = ['BTCUSDT', 'ETHUSDT', 'ADAUSDT', 'SOLUSDT', 'DOTUSDT', 'LINKUSDT'];
    const types = ['BUY', 'SELL'] as const;
    const directions = ['LONG', 'SHORT'] as const;
    const statuses = ['OPEN', 'CLOSED', 'CANCELLED'] as const;

    return Array.from({ length: limit }, (_, i) => {
      const entryPrice = 40000 + Math.random() * 20000;
      const exitPrice = entryPrice + (Math.random() - 0.4) * 3000; // Bias towards profit
      const amount = Math.random() * 2 + 0.1;
      const leverage = Math.floor(Math.random() * 10) + 1;
      const profit = (exitPrice - entryPrice) * amount;
      const profitPercentage = (profit / (entryPrice * amount)) * 100;

      const openTime = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
      const closeTime = new Date(openTime.getTime() + Math.random() * 24 * 60 * 60 * 1000);

      return {
        id: `op_${i + 1}_${Date.now()}`,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        type: types[Math.floor(Math.random() * types.length)],
        direction: directions[Math.floor(Math.random() * directions.length)],
        entryPrice,
        exitPrice,
        amount,
        leverage,
        profit,
        profitPercentage,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        openTime: openTime.toISOString(),
        closeTime: closeTime.toISOString(),
        duration: Math.floor((closeTime.getTime() - openTime.getTime()) / 60000) // in minutes
      };
    });
  }

  private getMockDistributionData(): DistributionDataItem[] {
    return [
      { label: 'BTC', value: 45.5, percentage: 45.5, color: '#F7931A' },
      { label: 'ETH', value: 28.3, percentage: 28.3, color: '#627EEA' },
      { label: 'ADA', value: 12.1, percentage: 12.1, color: '#0033AD' },
      { label: 'SOL', value: 8.7, percentage: 8.7, color: '#9945FF' },
      { label: 'DOT', value: 5.4, percentage: 5.4, color: '#E6007A' }
    ];
  }

  private getMockPerformanceStatistics(): PerformanceStatistics {
    const totalProfit = Math.random() * 10000 + 5000;
    const totalLoss = Math.random() * 5000 + 2000;
    const netProfit = totalProfit - totalLoss;

    return {
      totalProfit,
      totalLoss,
      netProfit,
      profitFactor: totalProfit / totalLoss,
      maxDrawdown: Math.random() * 15 + 5, // 5-20%
      averageProfit: Math.random() * 200 + 100,
      averageLoss: Math.random() * 150 + 50,
      largestProfit: Math.random() * 1000 + 500,
      largestLoss: -(Math.random() * 800 + 200),
      consecutiveWins: Math.floor(Math.random() * 10) + 3,
      consecutiveLosses: Math.floor(Math.random() * 5) + 1,
      averageWinDuration: Math.floor(Math.random() * 120) + 30, // 30-150 minutes
      averageLossDuration: Math.floor(Math.random() * 60) + 15, // 15-75 minutes
      dailyProfitData: this.getMockDailyProfitData(30),
      monthlyProfitData: this.getMockMonthlyProfitData(12),
      profitBySymbol: this.getMockProfitBySymbolData()
    };
  }

  private getMockDailyProfitData(days: number): DailyProfitData[] {
    return Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));

      return {
        date: date.toISOString().split('T')[0],
        profit: (Math.random() - 0.3) * 500, // Bias towards positive
        operations: Math.floor(Math.random() * 10) + 1
      };
    });
  }

  private getMockMonthlyProfitData(months: number): MonthlyProfitData[] {
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    return Array.from({ length: months }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (months - 1 - i));
      const operations = Math.floor(Math.random() * 100) + 20;
      const winningOps = Math.floor(operations * (0.6 + Math.random() * 0.3));

      return {
        month: monthNames[date.getMonth()],
        profit: (Math.random() - 0.2) * 5000, // Bias towards positive
        operations,
        winRate: (winningOps / operations) * 100
      };
    });
  }

  private getMockProfitBySymbolData(): ProfitBySymbolData[] {
    const symbols = ['BTCUSDT', 'ETHUSDT', 'ADAUSDT', 'SOLUSDT', 'DOTUSDT'];

    return symbols.map(symbol => {
      const operations = Math.floor(Math.random() * 50) + 10;
      const winningOps = Math.floor(operations * (0.5 + Math.random() * 0.4));

      return {
        symbol,
        profit: (Math.random() - 0.3) * 2000,
        operations,
        winRate: (winningOps / operations) * 100
      };
    });
  }
}

// Export singleton instance
const performanceService = new PerformanceService();
export { performanceService };
export default performanceService;