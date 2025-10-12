import axios from 'axios';

// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
const API_TIMEOUT = 15000; // 15 seconds for exchange API calls

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

// Add response interceptor for error handling (NO AUTO-REDIRECT)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't auto-redirect on 401 - let components handle errors
    if (error.response?.status === 401) {
      console.warn('⚠️ ExchangeBalanceService: 401 Unauthorized');
    }
    return Promise.reject(error);
  }
);

// Types
export interface ExchangeBalance {
  total_equity: number;
  available_balance: number;
  wallet_balance?: number;
  margin_balance?: number;
  in_orders: number;
  environment?: string;
  error?: string;
  coins: Array<{
    coin: string;
    wallet_balance: number;
    available: number;
    equity?: number;
    locked?: number;
  }>;
}

export interface AllExchangeBalances {
  binance: ExchangeBalance | null;
  bybit: ExchangeBalance | null;
  total_usd: number;
  has_keys: boolean;
  message?: string;
}

class ExchangeBalanceService {
  /**
   * Get all exchange balances (Binance + Bybit) in one call
   */
  async getAllExchangeBalances(): Promise<AllExchangeBalances> {
    try {
      console.log('📊 Fetching all exchange balances from API...');
      const response = await apiClient.get('/user-settings/all-balances');
      
      if (response.data.success) {
        console.log('✅ Exchange balances loaded successfully:', response.data.data);
        return response.data.data;
      } else {
        console.error('❌ Failed to load exchange balances:', response.data);
        throw new Error(response.data.error || 'Failed to load exchange balances');
      }
    } catch (error) {
      console.error('❌ Error fetching exchange balances:', error);
      
      // Return empty balances on error
      return {
        binance: null,
        bybit: null,
        total_usd: 0,
        has_keys: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get balance for a specific exchange
   */
  async getExchangeBalance(exchange: 'binance' | 'bybit'): Promise<ExchangeBalance | null> {
    try {
      console.log(`📊 Fetching ${exchange} balance from API...`);
      const response = await apiClient.get('/user-settings/balance', {
        params: { exchange }
      });
      
      if (response.data.success) {
        console.log(`✅ ${exchange} balance loaded successfully`);
        return response.data.data;
      } else {
        console.error(`❌ Failed to load ${exchange} balance:`, response.data);
        return null;
      }
    } catch (error) {
      console.error(`❌ Error fetching ${exchange} balance:`, error);
      return null;
    }
  }

  /**
   * Format balance for display
   */
  formatBalance(balance: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(balance);
  }

  /**
   * Calculate total balance from all exchanges
   */
  calculateTotalBalance(balances: AllExchangeBalances): number {
    let total = 0;
    
    if (balances.binance && !balances.binance.error) {
      total += balances.binance.total_equity || 0;
    }
    
    if (balances.bybit && !balances.bybit.error) {
      total += balances.bybit.total_equity || 0;
    }
    
    return total;
  }
}

// Export singleton instance
const exchangeBalanceService = new ExchangeBalanceService();
export { exchangeBalanceService };
export default exchangeBalanceService;

