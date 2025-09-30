/**
 * 👤 USER SERVICE - COINBITCLUB ENTERPRISE v6.0.0
 * Frontend service for user account management and API communication
 */

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

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('auth_access_token');
    
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
    } catch (error) {
      if (error.message.includes('Network error') || error.message.includes('404') || error.message.includes('401') || error.message.includes('Token de acesso necessário')) {
        console.warn('Backend not available or authentication required, using mock data for development');
        return this.getMockData(endpoint);
      }
      throw error;
    }
  }

  private getMockData(endpoint: string) {
    switch (endpoint) {
      case '/auth/profile':
      case '/user/profile':
        return {
          success: true,
          user: {
            id: 1,
            uuid: 'mock-uuid-123',
            username: 'demo_user',
            email: 'demo@coinbitclub.com',
            full_name: 'João Silva',
            phone: '+55 11 98765-4321',
            country: 'BR',
            language: 'pt-BR',
            user_type: 'USER',
            is_admin: false,
            is_active: true,
            email_verified: true,
            two_factor_enabled: false,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z'
          },
          balances: {
            balance_real_brl: 2450.75,
            balance_real_usd: 500.00,
            balance_admin_brl: 150.00,
            balance_admin_usd: 30.00,
            balance_commission_brl: 75.50,
            balance_commission_usd: 15.00
          },
          plan_type: 'MONTHLY',
          subscription_status: 'active',
          trading_enabled: true,
          last_login_at: new Date().toISOString(),
          last_activity_at: new Date().toISOString()
        };

      case '/user-settings/all':
        return {
          success: true,
          settings: {
            trading: {
              max_leverage: 5,
              take_profit_percentage: 15,
              stop_loss_percentage: 10,
              position_size_percentage: 30,
              risk_level: 'MEDIUM',
              auto_trade_enabled: true,
              daily_loss_limit_percentage: 10,
              max_open_positions: 2,
              default_leverage: 5,
              stop_loss_multiplier: 2.0,
              take_profit_multiplier: 3.0
            },
            personal: {
              full_name: 'João Silva',
              phone: '+55 11 98765-4321',
              country: 'BR',
              language: 'pt-BR'
            },
            banking: {
              pix_key: 'joao.silva@email.com',
              pix_type: 'email',
              bank_name: '001 - Banco do Brasil',
              bank_account: '12345-6',
              bank_agency: '1234-5',
              bank_document: '123.456.789-10'
            },
            api_keys: {
              binance_api_key: '',
              binance_secret_key: '',
              binance_testnet: true,
              binance_connected: false,
              bybit_api_key: '',
              bybit_secret_key: '',
              bybit_testnet: true,
              bybit_connected: false
            },
            notifications: {
              email_notifications: true,
              sms_notifications: false,
              push_notifications: true,
              trade_alerts: true,
              report_frequency: 'daily',
              profit_threshold_percentage: 5
            }
          }
        };

      default:
        return { success: false, error: 'Mock data not available' };
    }
  }

  // User Profile Methods
  async getUserProfile(): Promise<{ success: boolean; user: UserProfile }> {
    return this.makeRequest('/auth/profile');
  }

  async updateUserProfile(profileData: Partial<UserProfile>): Promise<{ success: boolean; message: string }> {
    return this.makeRequest('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  // Settings Methods
  async getAllSettings(): Promise<{ success: boolean; settings: AllUserSettings }> {
    return this.makeRequest('/user-settings/all');
  }

  async updateAllSettings(settings: Partial<AllUserSettings>): Promise<{ success: boolean; message: string }> {
    return this.makeRequest('/user-settings/all', {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
  }

  // Trading Settings
  async getTradingSettings(): Promise<{ success: boolean; settings: TradingSettings }> {
    return this.makeRequest('/user-settings/trading');
  }

  async updateTradingSettings(settings: Partial<TradingSettings>): Promise<{ success: boolean; message: string }> {
    return this.makeRequest('/user-settings/trading', {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
  }

  // Personal Settings
  async getPersonalSettings(): Promise<{ success: boolean; settings: PersonalSettings }> {
    return this.makeRequest('/user-settings/personal');
  }

  async updatePersonalSettings(settings: Partial<PersonalSettings>): Promise<{ success: boolean; message: string }> {
    return this.makeRequest('/user-settings/personal', {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
  }

  // Banking Settings
  async getBankingSettings(): Promise<{ success: boolean; settings: BankingSettings }> {
    return this.makeRequest('/user-settings/banking');
  }

  async updateBankingSettings(settings: Partial<BankingSettings>): Promise<{ success: boolean; message: string }> {
    return this.makeRequest('/user-settings/banking', {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
  }

  // API Key Management
  async getApiKeys(): Promise<{ success: boolean; settings: ApiKeySettings }> {
    return this.makeRequest('/user-settings/api-keys');
  }

  async addApiKey(exchange: 'binance' | 'bybit', apiKey: string, secretKey: string, testnet: boolean = true): Promise<{ success: boolean; message: string }> {
    return this.makeRequest('/user-settings/api-keys', {
      method: 'POST',
      body: JSON.stringify({
        exchange,
        api_key: apiKey,
        secret_key: secretKey,
        testnet
      })
    });
  }

  async updateApiKey(exchange: 'binance' | 'bybit', apiKey: string, secretKey: string, testnet: boolean): Promise<{ success: boolean; message: string }> {
    return this.makeRequest(`/user-settings/api-keys/${exchange}`, {
      method: 'PUT',
      body: JSON.stringify({
        api_key: apiKey,
        secret_key: secretKey,
        testnet
      })
    });
  }

  async deleteApiKey(exchange: 'binance' | 'bybit'): Promise<{ success: boolean; message: string }> {
    return this.makeRequest(`/user-settings/api-keys/${exchange}`, {
      method: 'DELETE'
    });
  }

  // Notification Settings
  async getNotificationSettings(): Promise<{ success: boolean; settings: NotificationSettings }> {
    return this.makeRequest('/user-settings/notifications');
  }

  async updateNotificationSettings(settings: Partial<NotificationSettings>): Promise<{ success: boolean; message: string }> {
    return this.makeRequest('/user-settings/notifications', {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
  }

  // Utility Methods
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
