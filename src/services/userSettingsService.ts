/**
 * User Settings Service
 * Handles API calls for user exchange preferences, balance, and trading settings
 */

import { apiService } from './apiService';

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
  /**
   * Get user's preferred exchange
   */
  async getPreferredExchange(): Promise<ExchangePreference> {
    try {
      const response = await apiService.get('/user/settings/exchange');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching preferred exchange:', error);
      throw error;
    }
  }

  /**
   * Update user's preferred exchange
   */
  async updatePreferredExchange(exchange: string): Promise<ExchangePreference> {
    try {
      const response = await apiService.put('/user/settings/exchange', {
        preferred_exchange: exchange
      });
      return response.data;
    } catch (error: any) {
      console.error('Error updating preferred exchange:', error);
      throw error;
    }
  }

  /**
   * Get all configured exchanges for user
   */
  async getConfiguredExchanges(): Promise<{
    preferred_exchange: string;
    exchanges: ExchangeInfo[];
    total: number;
  }> {
    try {
      const response = await apiService.get('/user/settings/exchanges');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching configured exchanges:', error);
      throw error;
    }
  }

  /**
   * Get user's real-time balance from preferred exchange
   */
  async getMainnetBalance(): Promise<UserBalance> {
    try {
      const response = await apiService.get('/user/settings/balance');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching mainnet balance:', error);
      throw error;
    }
  }

  /**
   * Get user's trading settings
   */
  async getTradingSettings(): Promise<TradingSettings> {
    try {
      const response = await apiService.get('/user/settings/trading');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching trading settings:', error);
      throw error;
    }
  }

  /**
   * Update user's trading settings
   */
  async updateTradingSettings(settings: {
    risk_level?: string;
    max_open_positions?: number;
    default_leverage?: number;
  }): Promise<TradingSettings> {
    try {
      const response = await apiService.put('/user/settings/trading', settings);
      return response.data;
    } catch (error: any) {
      console.error('Error updating trading settings:', error);
      throw error;
    }
  }
}

export const userSettingsService = new UserSettingsService();
export default userSettingsService;
