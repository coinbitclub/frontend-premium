/**
 * 🔐 AUTHENTICATION SERVICE - FRONTEND
 * Serviço de autenticação para integração com backend
 */

interface User {
  id: string;
  uuid: string;
  email: string;
  username: string;
  full_name: string;
  user_type: 'ADMIN' | 'GESTOR' | 'OPERADOR' | 'AFFILIATE_VIP' | 'AFFILIATE' | 'USER';
  affiliate_type: 'none' | 'normal' | 'vip';
  affiliate_code?: string;
  is_admin: boolean;
  trading_enabled: boolean;
  two_factor_enabled: boolean;
  balances: {
    real_brl: number;
    real_usd: number;
    admin_brl: number;
    admin_usd: number;
    commission_brl: number;
    commission_usd: number;
  };
  trading_settings: {
    max_open_positions: number;
    max_position_size: number;
    default_leverage: number;
    default_stop_loss_multiplier: number;
    default_take_profit_multiplier: number;
    risk_level: string;
  };
  permissions: string[];
  created_at: string;
  last_login_at?: string;
}

interface LoginResponse {
  success: boolean;
  sessionId: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
  tokenType: string;
  user: User;
  requiresTwoFactor?: boolean;
  message?: string;
}

interface RegisterData {
  email: string;
  password: string;
  username: string;
  full_name: string;
  user_type?: string;
}

class AuthService {
  private baseUrl: string;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private user: User | null = null;

  constructor() {
    // Use environment variable or default to localhost
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
    
    // Load tokens from localStorage on initialization
    this.loadTokensFromStorage();
  }

  /**
   * 🔑 Login
   */
  async login(email: string, password: string, twoFactorCode?: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          twoFactorCode
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store tokens and user data
        this.accessToken = data.accessToken;
        this.refreshToken = data.refreshToken;
        this.user = data.user;

        // Save to localStorage
        this.saveTokensToStorage();
        this.saveUserToStorage();

        return data;
      } else {
        throw new Error(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  }

  /**
   * 👤 Register
   */
  async register(userData: RegisterData): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Registration failed');
      }

      return data;
    } catch (error) {
      console.error('❌ Registration error:', error);
      throw error;
    }
  }

  /**
   * 🔄 Refresh Token
   */
  async refreshAccessToken(): Promise<boolean> {
    try {
      if (!this.refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${this.baseUrl}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: this.refreshToken
        }),
      });

      const data = await response.json();

      if (data.success) {
        this.accessToken = data.accessToken;
        this.saveTokensToStorage();
        return true;
      } else {
        // Refresh failed, logout user
        this.logout();
        throw new Error('Token refresh failed');
      }
    } catch (error) {
      console.error('❌ Token refresh error:', error);
      this.logout();
      return false;
    }
  }

  /**
   * 🚪 Logout
   */
  async logout(): Promise<void> {
    try {
      if (this.accessToken) {
        // Try to logout on server
        await fetch(`${this.baseUrl}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.accessToken}`
          },
          body: JSON.stringify({
            sessionId: this.getSessionId()
          }),
        });
      }
    } catch (error) {
      console.error('❌ Logout error:', error);
    } finally {
      // Clear local storage
      this.clearStorage();
      this.accessToken = null;
      this.refreshToken = null;
      this.user = null;
    }
  }

  /**
   * 👤 Get Profile
   */
  async getProfile(): Promise<User> {
    try {
      const response = await this.authenticatedFetch(`${this.baseUrl}/api/auth/profile`);
      const data = await response.json();

      if (data.success) {
        this.user = data.user;
        this.saveUserToStorage();
        return data.user;
      } else {
        throw new Error(data.error || 'Failed to get profile');
      }
    } catch (error) {
      console.error('❌ Get profile error:', error);
      throw error;
    }
  }

  /**
   * 🔐 Setup 2FA
   */
  async setupTwoFactor(): Promise<any> {
    try {
      const response = await this.authenticatedFetch(`${this.baseUrl}/api/auth/2fa/setup`, {
        method: 'POST'
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || '2FA setup failed');
      }

      return data;
    } catch (error) {
      console.error('❌ 2FA setup error:', error);
      throw error;
    }
  }

  /**
   * ✅ Verify 2FA
   */
  async verifyTwoFactor(token: string, secret: string): Promise<any> {
    try {
      const response = await this.authenticatedFetch(`${this.baseUrl}/api/auth/2fa/verify`, {
        method: 'POST',
        body: JSON.stringify({ token, secret })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || '2FA verification failed');
      }

      return data;
    } catch (error) {
      console.error('❌ 2FA verification error:', error);
      throw error;
    }
  }

  /**
   * 🔄 Request Password Reset
   */
  async requestPasswordReset(email: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/password-reset/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Password reset request failed');
      }

      return data;
    } catch (error) {
      console.error('❌ Password reset request error:', error);
      throw error;
    }
  }

  /**
   * 🔐 Reset Password
   */
  async resetPassword(token: string, newPassword: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/password-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Password reset failed');
      }

      return data;
    } catch (error) {
      console.error('❌ Password reset error:', error);
      throw error;
    }
  }

  /**
   * 📊 Get Active Sessions
   */
  async getActiveSessions(): Promise<any> {
    try {
      const response = await this.authenticatedFetch(`${this.baseUrl}/api/auth/sessions`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to get sessions');
      }

      return data;
    } catch (error) {
      console.error('❌ Get sessions error:', error);
      throw error;
    }
  }

  /**
   * 🚪 Logout All Sessions
   */
  async logoutAllSessions(): Promise<any> {
    try {
      const response = await this.authenticatedFetch(`${this.baseUrl}/api/auth/logout-all`, {
        method: 'POST'
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to logout all sessions');
      }

      return data;
    } catch (error) {
      console.error('❌ Logout all sessions error:', error);
      throw error;
    }
  }

  /**
   * 🔍 Validate Token
   */
  async validateToken(): Promise<boolean> {
    try {
      if (!this.accessToken) {
        console.log('🔍 AuthService: No access token available');
        return false;
      }

      console.log('🔍 AuthService: Validating token with backend...');
      const response = await fetch(`${this.baseUrl}/api/auth/validate`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        },
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(5000)
      });

      if (!response.ok) {
        console.log('🔍 AuthService: Token validation failed with status:', response.status);
        return false;
      }

      const data = await response.json();
      const isValid = data.success && data.valid;
      console.log('🔍 AuthService: Token validation result:', isValid);
      return isValid;
    } catch (error) {
      // Don't log network errors as errors - they're expected when backend is down
      if (error.name === 'AbortError' || error.message?.includes('fetch')) {
        console.log('🔍 AuthService: Backend unavailable for token validation, assuming valid for offline mode');
        // Return true for offline mode to prevent redirect loops
        return true;
      }
      console.error('❌ Token validation error:', error);
      return false;
    }
  }

  /**
   * 🔧 Authenticated Fetch (with automatic token refresh)
   */
  private async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.accessToken}`,
      ...options.headers
    };

    let response = await fetch(url, {
      ...options,
      headers
    });

    // If token expired, try to refresh
    if (response.status === 401) {
      const refreshSuccess = await this.refreshAccessToken();
      
      if (refreshSuccess && this.accessToken) {
        // Retry with new token
        headers['Authorization'] = `Bearer ${this.accessToken}`;
        response = await fetch(url, {
          ...options,
          headers
        });
      }
    }

    return response;
  }

  /**
   * 💾 Save tokens to localStorage
   */
  private saveTokensToStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_access_token', this.accessToken || '');
      localStorage.setItem('auth_refresh_token', this.refreshToken || '');
    }
  }

  /**
   * 💾 Save user to localStorage
   */
  private saveUserToStorage(): void {
    if (typeof window !== 'undefined' && this.user) {
      localStorage.setItem('auth_user', JSON.stringify(this.user));
    }
  }

  /**
   * 📥 Load tokens from localStorage
   */
  private loadTokensFromStorage(): void {
    if (typeof window !== 'undefined') {
      console.log('🔍 DEBUG: Loading tokens from localStorage...');
      
      this.accessToken = localStorage.getItem('auth_access_token');
      this.refreshToken = localStorage.getItem('auth_refresh_token');
      
      console.log('🔍 DEBUG: Token loading results:', {
        accessToken: this.accessToken ? 'EXISTS' : 'NULL',
        refreshToken: this.refreshToken ? 'EXISTS' : 'NULL'
      });
      
      const userStr = localStorage.getItem('auth_user');
      if (userStr) {
        try {
          this.user = JSON.parse(userStr);
          console.log('🔍 DEBUG: User loaded from storage:', !!this.user);
        } catch (error) {
          console.error('❌ Error parsing user from storage:', error);
          localStorage.removeItem('auth_user');
        }
      } else {
        console.log('🔍 DEBUG: No user data found in localStorage');
      }
      
      console.log('🔍 DEBUG: Final auth state after loading:', {
        hasAccessToken: !!this.accessToken,
        hasRefreshToken: !!this.refreshToken,
        hasUser: !!this.user,
        isAuthenticated: this.isAuthenticated()
      });
    }
  }

  /**
   * 🗑️ Clear storage
   */
  private clearStorage(): void {
    if (typeof window !== 'undefined') {
      console.log('🗑️ AuthService: Clearing all auth data from localStorage');
      localStorage.removeItem('auth_access_token');
      localStorage.removeItem('auth_refresh_token');
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_session_id');
      // Also clear any legacy keys
      localStorage.removeItem('auth-token');
      localStorage.removeItem('refresh-token');
      localStorage.removeItem('user');
      console.log('✅ AuthService: All auth data cleared from localStorage');
    }
  }

  /**
   * 🔑 Get session ID from localStorage
   */
  private getSessionId(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_session_id');
    }
    return null;
  }

  /**
   * 👤 Get current user
   */
  getCurrentUser(): User | null {
    return this.user;
  }

  /**
   * 🔑 Get access token
   */
  getAccessToken(): string | null {
    return this.accessToken;
  }

  /**
   * ✅ Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const hasToken = !!this.accessToken;
    const hasUser = !!this.user;
    const result = hasToken && hasUser;
    
    console.log('🔍 DEBUG: authService.isAuthenticated() check:', {
      hasToken,
      hasUser,
      result,
      accessToken: this.accessToken ? 'EXISTS' : 'NULL',
      user: this.user ? 'EXISTS' : 'NULL'
    });
    
    return result;
  }

  /**
   * 👑 Check if user has permission
   */
  hasPermission(permission: string): boolean {
    if (!this.user) return false;
    return this.user.permissions.includes(permission) || this.user.permissions.includes('ADMIN');
  }

  /**
   * 👨‍💼 Check if user is admin
   */
  isAdmin(): boolean {
    return this.user?.is_admin || this.user?.user_type === 'ADMIN' || false;
  }

  /**
   * 🎯 Check user type
   */
  isUserType(userType: string): boolean {
    return this.user?.user_type === userType;
  }

  /**
   * 💰 Check if trading is enabled
   */
  isTradingEnabled(): boolean {
    return this.user?.trading_enabled || false;
  }

  /**
   * 🔐 Check if 2FA is enabled
   */
  isTwoFactorEnabled(): boolean {
    return this.user?.two_factor_enabled || false;
  }
}

// Create singleton instance
const authService = new AuthService();

export default authService;
export type { User, LoginResponse, RegisterData };
