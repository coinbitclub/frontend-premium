/**
 * 🌐 API SERVICE - FRONTEND
 * Centralized API communication service
 */

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
  }

  /**
   * Generic API request method
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = this.getAuthToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  /**
   * Get authentication token from localStorage
   */
  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_access_token');
    }
    return null;
  }

  /**
   * Authentication API calls
   */
  async login(email: string, password: string, twoFactorCode?: string) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, twoFactorCode }),
    });
  }

  async register(userData: any) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    return this.request('/api/auth/logout', {
      method: 'POST',
    });
  }

  /**
   * User API calls
   */
  async getUserProfile() {
    return this.request('/api/user/profile');
  }

  async updateUserProfile(data: any) {
    return this.request('/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getUserBalances() {
    return this.request('/api/user/balances');
  }

  async getUserSettings() {
    return this.request('/api/user/settings');
  }

  async updateUserSettings(data: any) {
    return this.request('/api/user/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Enhanced User Settings API calls
   */
  async getAllUserSettings() {
    return this.request('/api/user-settings/all');
  }

  async updateAllUserSettings(data: any) {
    return this.request('/api/user-settings/all', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Trading Settings
  async getTradingSettings() {
    return this.request('/api/user-settings/trading');
  }

  async updateTradingSettings(data: any) {
    return this.request('/api/user-settings/trading', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Notification Settings
  async getNotificationSettings() {
    return this.request('/api/user-settings/notifications');
  }

  async updateNotificationSettings(data: any) {
    return this.request('/api/user-settings/notifications', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Personal Settings
  async getPersonalSettings() {
    return this.request('/api/user-settings/personal');
  }

  async updatePersonalSettings(data: any) {
    return this.request('/api/user-settings/personal', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Banking Settings
  async getBankingSettings() {
    return this.request('/api/user-settings/banking');
  }

  async updateBankingSettings(data: any) {
    return this.request('/api/user-settings/banking', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Security Settings
  async getSecuritySettings() {
    return this.request('/api/user-settings/security');
  }

  async updateSecuritySettings(data: any) {
    return this.request('/api/user-settings/security', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // API Keys Management (Legacy - redirected to new encrypted endpoints)
  async getApiKeys() {
    return this.request('/api/user-api-keys/all/status');
  }

  async addApiKey(data: any) {
    // Map to new endpoint format: /api/user-api-keys/:exchange
    const exchange = data.exchange || 'bybit';
    return this.request(`/api/user-api-keys/${exchange}`, {
      method: 'POST',
      body: JSON.stringify({
        apiKey: data.apiKey,
        apiSecret: data.apiSecret,
        useForTrading: data.useForTrading !== false
      }),
    });
  }

  async updateApiKey(id: string, data: any) {
    // Map to new endpoint format
    const exchange = data.exchange || id;
    return this.request(`/api/user-api-keys/${exchange}`, {
      method: 'POST',
      body: JSON.stringify({
        apiKey: data.apiKey,
        apiSecret: data.apiSecret,
        useForTrading: data.useForTrading !== false
      }),
    });
  }

  async deleteApiKey(id: string) {
    // Map to new endpoint format
    return this.request(`/api/user-api-keys/${id}`, {
      method: 'DELETE',
    });
  }

  // New encrypted API Keys endpoints
  async getAPIKeysStatus() {
    return this.request('/api/user-api-keys/all/status');
  }

  async verifyAPIKey(exchange: string) {
    return this.request(`/api/user-api-keys/${exchange}/verify`, {
      method: 'POST',
    });
  }

  // User Preferences
  async getUserPreferences() {
    return this.request('/api/user-settings/preferences');
  }

  async updateUserPreferences(data: any) {
    return this.request('/api/user-settings/preferences', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Trading API calls
   */
  async getTradingStatus() {
    return this.request('/api/trading/status');
  }

  async getPositions() {
    return this.request('/api/trading/positions');
  }

  async openPosition(data: any) {
    return this.request('/api/trading/positions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async closePosition(positionId: string) {
    return this.request(`/api/trading/positions/${positionId}`, {
      method: 'DELETE',
    });
  }

  async getMarketAnalysis() {
    return this.request('/api/trading/analysis');
  }

  /**
   * Financial API calls
   */
  async getBalances() {
    return this.request('/api/financial/balances');
  }

  async createDeposit(data: any) {
    return this.request('/api/financial/deposit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createWithdraw(data: any) {
    return this.request('/api/financial/withdraw', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getFinancialTransactions() {
    return this.request('/api/financial/transactions');
  }

  async getExchangeRates() {
    return this.request('/api/financial/exchange-rates');
  }

  /**
   * Affiliate API calls
   */
  async getAffiliateStats() {
    return this.request('/api/affiliate/stats');
  }

  async getCommissions() {
    return this.request('/api/affiliate/commissions');
  }

  async getReferrals() {
    return this.request('/api/affiliate/referrals');
  }

  async registerAffiliate(data: any) {
    return this.request('/api/affiliate/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAffiliateLinks() {
    return this.request('/api/affiliate/links');
  }

  async getPerformance() {
    return this.request('/api/affiliate/performance');
  }

  /**
   * Admin API calls
   */
  async getAdminDashboard() {
    return this.request('/api/admin/dashboard');
  }

  async getUsers() {
    return this.request('/api/admin/users');
  }

  async getSystemStats() {
    return this.request('/api/admin/system-stats');
  }

  async getAdminTransactions() {
    return this.request('/api/admin/transactions');
  }

  async updateUserBalance(userId: string, data: any) {
    return this.request(`/api/admin/users/${userId}/balance`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAffiliates() {
    return this.request('/api/admin/affiliates');
  }

  async getReports() {
    return this.request('/api/admin/reports');
  }
}

export const apiService = new ApiService();
