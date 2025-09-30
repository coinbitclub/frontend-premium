/**
 * 📋 PLAN SERVICE - COINBITCLUB ENTERPRISE v6.0.0
 * Frontend service for plan management with Stripe integration
 */

// Types and Interfaces
export interface Plan {
  id: string;
  code: string;
  name: string;
  description: string;
  type: 'MONTHLY' | 'PREPAID' | 'TRIAL';
  price: number;
  currency: 'USD';
  billingPeriod: string;
  commissionRate: number;
  minimumBalance: number;
  features: string[];
  isPopular: boolean;
  isRecommended: boolean;
  stripeProductId?: string;
  isCurrentPlan?: boolean;
  isActive?: boolean;
  canPurchase?: boolean;
}

export interface PlansResponse {
  currentPlan: any;
  success: boolean;
  plans: Plan[];
  source: string;
  timestamp: string;
}

export interface PlanSubscriptionResponse {
  success: boolean;
  message: string;
  planCode: string;
  planName: string;
  checkoutUrl?: string;
  sessionId?: string;
}

export interface PlanStatus {
  success: boolean;
  user: {
    id: number;
    planType: string;
    planName: string;
    subscriptionStatus: string;
    subscriptionStartDate?: string;
    subscriptionEndDate?: string;
    tradingEnabled: boolean;
  };
  balances: {
    real: { brl: number; usd: number };
    admin: { brl: number; usd: number };
    commission: { brl: number; usd: number };
  };
  currentPlan?: Plan;
  availablePlans: Plan[];
  timestamp: string;
}

class PlanService {
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
      console.error(`API request failed for ${endpoint}:`, error.message);
      throw error;
    }
  }

  /**
   * Get all static plans
   */
  async getPlans(): Promise<PlansResponse> {
    return this.makeRequest('/plans/available');
  }

  /**
   * Subscribe to a static plan
   */
  async subscribeToPlan(
    planCode: string,
    successUrl?: string,
    cancelUrl?: string
  ): Promise<PlanSubscriptionResponse> {
    const currentUrl = window.location.origin;
    const defaultSuccessUrl = `${currentUrl}/user/plans?success=true&plan=${planCode}`;
    const defaultCancelUrl = `${currentUrl}/user/plans?canceled=true`;

    return this.makeRequest('/plans/subscribe', {
      method: 'POST',
      body: JSON.stringify({
        planCode,
        successUrl: successUrl || defaultSuccessUrl,
        cancelUrl: cancelUrl || defaultCancelUrl,
      }),
    });
  }

  /**
   * Get user's plan status
   */
  async getPlanStatus(): Promise<PlanStatus> {
    return this.makeRequest('/plans/status');
  }

  /**
   * Cancel current subscription
   */
  async cancelSubscription(): Promise<{ success: boolean; message: string }> {
    return this.makeRequest('/plans/cancel', {
      method: 'POST',
    });
  }

  /**
   * Format plan price for display
   */
  formatPlanPrice(plan: Plan): string {
    if (plan.price === 0) {
      return 'FREE';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: plan.currency,
    }).format(plan.price);
  }

  /**
   * Get plan by code
   */
  async getPlanByCode(planCode: string): Promise<Plan | null> {
    try {
      const response = await this.getPlans();
      return response.plans.find(plan => plan.code === planCode) || null;
    } catch (error) {
      console.error('Error getting plan by code:', error);
      return null;
    }
  }

  /**
   * Handle Stripe checkout success
   */
  async handleCheckoutSuccess(sessionId: string): Promise<{ success: boolean; message: string }> {
    // This would typically verify the session with Stripe
    // For now, we'll just return success
    return {
      success: true,
      message: 'Payment processed successfully!'
    };
  }

  /**
   * Check if user can afford plan
   */
  canAffordPlan(plan: Plan, userBalance: number): boolean {
    return plan.price === 0 || userBalance >= plan.minimumBalance;
  }

  /**
   * Get recommended plan based on user criteria
   */
  getRecommendedPlan(plans: Plan[], userBalance: number, monthlyVolume: number): Plan {
    // Logic to recommend best plan
    if (monthlyVolume > 50000 && userBalance >= 20) {
      return plans.find(p => p.code === 'PRO') || plans[0];
    } else if (userBalance >= 30) {
      return plans.find(p => p.code === 'FLEX') || plans[0];
    } else {
      return plans.find(p => p.code === 'TRIAL') || plans[0];
    }
  }
}

// Export singleton instance
const planService = new PlanService();
export default planService;