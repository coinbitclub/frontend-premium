/**
 * 👤 USER SERVICE - OPTIMIZED v6.1.0
 * Frontend service for user account management and API communication
 */

export interface ExchangePreference {
  user_id: number;
  preferred_exchange: string;
  trading_mode: string;
}

export interface User {
  id: number;
  uuid: string;
  username: string;
  email: string;
  full_name: string;
  phone?: string;
  country: string;
  language: string;
  user_type: 'ADMIN' | 'GESTOR' | 'OPERADOR' | 'AFFILIATE_VIP' | 'AFFILIATE' | 'USER';
  is_admin: boolean;
  is_active: boolean;
  email_verified: boolean;
  two_factor_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserBalances {
  balance_real_brl: number;
  balance_real_usd: number;
  balance_admin_brl: number;
  balance_admin_usd: number;
  balance_commission_brl: number;
  balance_commission_usd: number;
}

export interface UserProfile {
  user: User;
  balances: UserBalances;
  plan_type: string;
  subscription_status: string;
  trading_enabled: boolean;
  last_login_at: string;
  last_activity_at: string;
}

export interface TradingSettings {
  max_leverage: number;
  take_profit_percentage: number;
  stop_loss_percentage: number;
  position_size_percentage: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  auto_trade_enabled: boolean;
  daily_loss_limit_percentage: number;
  max_open_positions: number;
  default_leverage: number;
  stop_loss_multiplier: number;
  take_profit_multiplier: number;
}

export interface PersonalSettings {
  full_name: string;
  phone: string;
  country: string;
  language: string;
}

export interface BankingSettings {
  pix_key: string;
  pix_type: 'email' | 'phone' | 'cpf' | 'random';
  bank_name: string;
  bank_account: string;
  bank_agency: string;
  bank_document: string;
}

export interface ApiKeySettings {
  binance_api_key: string;
  binance_secret_key: string;
  binance_testnet: boolean;
  binance_connected: boolean;
  bybit_api_key: string;
  bybit_secret_key: string;
  bybit_testnet: boolean;
  bybit_connected: boolean;
}

export interface NotificationSettings {
  email_notifications: boolean;
  sms_notifications: boolean;
  push_notifications: boolean;
  trade_alerts: boolean;
  report_frequency: 'daily' | 'weekly' | 'monthly';
  profit_threshold_percentage: number;
}

export interface AllUserSettings {
  trading: TradingSettings;
  personal: PersonalSettings;
  banking: BankingSettings;
  api_keys: ApiKeySettings;
  notifications: NotificationSettings;
}

class UserService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api';
    // Ensure baseUrl ends with /api
    if (!this.baseUrl.endsWith('/api')) {
      this.baseUrl = this.baseUrl.replace(/\/$/, '') + '/api';
    }
  }

  /**
   * Generic API request method with proper error handling
   */
  private async makeRequest<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
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
      // Log only in development
      if (process.env.NODE_ENV === 'development') {
        console.warn(`API request failed [${endpoint}]:`, error.message);
      }
      throw error;
    }
  }


  // ========================================
  // USER PROFILE METHODS
  // ========================================
  
  async getUserProfile(): Promise<{ success: boolean; user: UserProfile }> {
    return this.makeRequest<{ success: boolean; user: UserProfile }>('/auth/profile');
  }

  async updateUserProfile(profileData: Partial<UserProfile>): Promise<{ success: boolean; message: string }> {
    return this.makeRequest<{ success: boolean; message: string }>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  // ========================================
  // SETTINGS METHODS
  // ========================================
  
  async getAllSettings(): Promise<{ success: boolean; settings: AllUserSettings }> {
    return this.makeRequest<{ success: boolean; settings: AllUserSettings }>('/user-settings/all');
  }

  async getPreferredExchange(): Promise<{ success: boolean; settings: ExchangePreference }> {
    return this.makeRequest<{ success: boolean; settings: ExchangePreference }>('/user-settings/exchange');
  }

  async updateAllSettings(settings: Partial<AllUserSettings>): Promise<{ success: boolean; message: string }> {
    return this.makeRequest<{ success: boolean; message: string }>('/user-settings/all', {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
  }

  // ========================================
  // TRADING SETTINGS
  // ========================================
  
  async getTradingSettings(): Promise<{ success: boolean; settings: TradingSettings }> {
    return this.makeRequest<{ success: boolean; settings: TradingSettings }>('/user-settings/trading');
  }

  async updateTradingSettings(settings: Partial<TradingSettings>): Promise<{ success: boolean; message: string }> {
    return this.makeRequest<{ success: boolean; message: string }>('/user-settings/trading', {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
  }

  // ========================================
  // PERSONAL SETTINGS
  // ========================================
  
  async getPersonalSettings(): Promise<{ success: boolean; settings: PersonalSettings }> {
    return this.makeRequest<{ success: boolean; settings: PersonalSettings }>('/user-settings/personal');
  }

  async updatePersonalSettings(settings: Partial<PersonalSettings>): Promise<{ success: boolean; message: string }> {
    return this.makeRequest<{ success: boolean; message: string }>('/user-settings/personal', {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
  }

  // ========================================
  // BANKING SETTINGS
  // ========================================
  
  async getBankingSettings(): Promise<{ success: boolean; settings: BankingSettings }> {
    return this.makeRequest<{ success: boolean; settings: BankingSettings }>('/user-settings/banking');
  }

  async updateBankingSettings(settings: Partial<BankingSettings>): Promise<{ success: boolean; message: string }> {
    return this.makeRequest<{ success: boolean; message: string }>('/user-settings/banking', {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
  }

  // ========================================
  // API KEY MANAGEMENT
  // ========================================
  
  async getApiKeys(): Promise<{ success: boolean; settings: ApiKeySettings }> {
    return this.makeRequest<{ success: boolean; settings: ApiKeySettings }>('/user-settings/api-keys');
  }

  async addApiKey(
    exchange: 'binance' | 'bybit', 
    apiKey: string, 
    secretKey: string, 
    testnet: boolean = true
  ): Promise<{ success: boolean; message: string }> {
    return this.makeRequest<{ success: boolean; message: string }>('/user-settings/api-keys', {
      method: 'POST',
      body: JSON.stringify({ exchange, api_key: apiKey, secret_key: secretKey, testnet })
    });
  }

  async updateApiKey(
    exchange: 'binance' | 'bybit', 
    apiKey: string, 
    secretKey: string, 
    testnet: boolean
  ): Promise<{ success: boolean; message: string }> {
    return this.makeRequest<{ success: boolean; message: string }>(`/user-settings/api-keys/${exchange}`, {
      method: 'PUT',
      body: JSON.stringify({ api_key: apiKey, secret_key: secretKey, testnet })
    });
  }

  async deleteApiKey(exchange: 'binance' | 'bybit'): Promise<{ success: boolean; message: string }> {
    return this.makeRequest<{ success: boolean; message: string }>(`/user-settings/api-keys/${exchange}`, {
      method: 'DELETE'
    });
  }

  // ========================================
  // NOTIFICATION SETTINGS
  // ========================================
  
  async getNotificationSettings(): Promise<{ success: boolean; settings: NotificationSettings }> {
    return this.makeRequest<{ success: boolean; settings: NotificationSettings }>('/user-settings/notifications');
  }

  async updateNotificationSettings(settings: Partial<NotificationSettings>): Promise<{ success: boolean; message: string }> {
    return this.makeRequest<{ success: boolean; message: string }>('/user-settings/notifications', {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
  }

  // ========================================
  // UTILITY METHODS
  // ========================================
  
  formatBalance(amount: number, currency: 'BRL' | 'USD'): string {
    const formatter = new Intl.NumberFormat(currency === 'BRL' ? 'pt-BR' : 'en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return formatter.format(amount);
  }

  getUserTypeDisplay(userType: string): string {
    const types = {
      'ADMIN': 'Administrador',
      'GESTOR': 'Gestor',
      'OPERADOR': 'Operador',
      'AFFILIATE_VIP': 'Afiliado VIP',
      'AFFILIATE': 'Afiliado',
      'USER': 'Usuário'
    };
    return types[userType] || userType;
  }

  getPlanTypeDisplay(planType: string): string {
    const plans = {
      'MONTHLY': 'Mensal',
      'PREPAID': 'Pré-pago',
      'NONE': 'Trial'
    };
    return plans[planType] || planType;
  }

  getSubscriptionStatusDisplay(status: string): string {
    const statuses = {
      'active': 'Ativo',
      'inactive': 'Inativo',
      'expired': 'Expirado',
      'cancelled': 'Cancelado'
    };
    return statuses[status] || status;
  }
}

export default new UserService();
