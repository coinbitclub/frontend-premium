/**
 * 🔧 USER SETTINGS SERVICE - OPTIMIZED
 * Handles API calls for user exchange preferences, balance, and trading settings
 */

export interface ExchangePreference {
  user_id: number;
  preferred_exchange: string;
  trading_mode: string;
}

export interface ExchangeInfo {
  id: string | number;
  exchange: string;
  api_key_preview: string;
  is_active: boolean;
  enabled: boolean;
  verified: boolean;
  is_preferred: boolean;
  configured_at: string;
}

export interface UserBalance {
  exchange: string;
  total_equity: number;
  available_balance: number;
  wallet_balance?: number;
  margin_balance?: number;
  in_orders: number;
  coins: Array<{
    coin: string;
    wallet_balance: number;
    available: number;
    equity?: number;
    locked?: number;
  }>;
  timestamp: string;
}

export interface TradingSettings {
  trading_mode: string;
  risk_level: string;
  max_open_positions: number;
  default_leverage: number;
  balance_brl: number;
  balance_usd: number;
}

class UserSettingsService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api';
    // Ensure baseUrl ends with /api
    if (!this.baseUrl.endsWith('/api')) {
      this.baseUrl = this.baseUrl.replace(/\/$/, '') + '/api';
    }
  }

  /**
   * Generic API request method
   */
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_access_token') : null;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(error.error || `HTTP ${response.status}`);
      }
      
      return response.json();
    } catch (error: any) {
      console.error(`API request failed [${endpoint}]:`, error.message);
      throw error;
    }
  }

  /**
   * Get user's preferred exchange
   */
  async getPreferredExchange(): Promise<ExchangePreference> {
    return this.makeRequest<ExchangePreference>('/user/settings/exchange');
  }

  /**
   * Update user's preferred exchange
   */
  async updatePreferredExchange(exchange: string): Promise<ExchangePreference> {
    return this.makeRequest<ExchangePreference>('/user/settings/exchange', {
      method: 'PUT',
      body: JSON.stringify({ preferred_exchange: exchange })
    });
  }

  /**
   * Get all configured exchanges for user
   */
  async getConfiguredExchanges(): Promise<{
    preferred_exchange: string;
    exchanges: ExchangeInfo[];
    total: number;
  }> {
    return this.makeRequest('/user/settings/exchanges');
  }

  /**
   * Get user's real-time balance from preferred exchange
   */
  async getMainnetBalance(): Promise<UserBalance> {
    return this.makeRequest<UserBalance>('/user/settings/balance');
  }

  /**
   * Get user's trading settings
   */
  async getTradingSettings(): Promise<TradingSettings> {
    return this.makeRequest<TradingSettings>('/user/settings/trading');
  }

  /**
   * Update user's trading settings
   */
  async updateTradingSettings(settings: {
    risk_level?: string;
    max_open_positions?: number;
    default_leverage?: number;
  }): Promise<TradingSettings> {
    return this.makeRequest<TradingSettings>('/user/settings/trading', {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
  }
}

export const userSettingsService = new UserSettingsService();
export default userSettingsService;
