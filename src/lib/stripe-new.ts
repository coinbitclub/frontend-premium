// Placeholder para Stripe - removido dependência não instalada

export interface StripeCustomer {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  metadata?: Record<string, string>;
}

export interface StripeSubscription {
  id: string;
  customerId: string;
  priceId: string;
  status: string;
  currentPeriodStart: number;
  currentPeriodEnd: number;
  cancelAtPeriodEnd: boolean;
}

export interface CheckoutSessionData {
  customerId?: string;
  priceId: string;
  userEmail: string;
  userName?: string;
  successUrl?: string;
  cancelUrl?: string;
  metadata?: Record<string, string>;
}

// IDs mockados para desenvolvimento
export const STRIPE_PRICE_IDS = {
  monthly_brazil: 'price_monthly_brl_mock',
  prepaid_brazil: 'price_prepaid_brl_mock',
  monthly_international: 'price_monthly_usd_mock',
  prepaid_international: 'price_prepaid_usd_mock',
};

export class StripeService {
  // Mock implementation - TODO: Instalar stripe package se necessário
  async createOrRetrieveCustomer(
    email: string,
    name?: string,
    userId?: string
  ): Promise<StripeCustomer> {
    console.log('Mock Stripe: createOrRetrieveCustomer', { email, name, userId });
    return {
      id: 'mock_customer_id',
      email,
      name,
      metadata: { userId: userId || 'mock_user' }
    };
  }

  async createCheckoutSession(data: CheckoutSessionData): Promise<string> {
    console.log('Mock Stripe: createCheckoutSession', data);
    return 'mock_checkout_session_url';
  }

  async createCustomerPortalSession(customerId: string, returnUrl?: string): Promise<string> {
    console.log('Mock Stripe: createCustomerPortalSession', { customerId, returnUrl });
    return 'mock_portal_url';
  }

  async getSubscription(id: string): Promise<StripeSubscription | null> {
    console.log('Mock Stripe: getSubscription', id);
    return null;
  }

  async getCustomerSubscriptions(customerId: string): Promise<StripeSubscription[]> {
    console.log('Mock Stripe: getCustomerSubscriptions', customerId);
    return [];
  }

  async cancelSubscription(id: string, immediately = false): Promise<boolean> {
    console.log('Mock Stripe: cancelSubscription', { id, immediately });
    return true;
  }

  async reactivateSubscription(id: string): Promise<boolean> {
    console.log('Mock Stripe: reactivateSubscription', id);
    return true;
  }

  async refundPayment(paymentIntentId: string, amountInCents?: number): Promise<any> {
    console.log('Mock Stripe: refundPayment', { paymentIntentId, amountInCents });
    return { id: 'mock_refund_id' };
  }

  verifyWebhook(payload: string, sig: string) {
    console.log('Mock Stripe: verifyWebhook');
    return { type: 'mock_event', data: {} };
  }

  async getCustomerPaymentMethods(customerId: string) {
    console.log('Mock Stripe: getCustomerPaymentMethods', customerId);
    return [];
  }

  async getRevenueReport(start: Date, end: Date) {
    console.log('Mock Stripe: getRevenueReport', { start, end });
    return {
      totalRevenue: 0,
      subscriptionRevenue: 0,
      oneTimeRevenue: 0,
      refunds: 0
    };
  }
}

export const stripeService = new StripeService();

// Utilitários
export function formatStripeAmount(amountInCents: number, currency: 'brl' | 'usd'): string {
  const amount = amountInCents / 100;
  return new Intl.NumberFormat(currency === 'brl' ? 'pt-BR' : 'en-US', {
    style: 'currency',
    currency: currency === 'brl' ? 'BRL' : 'USD'
  }).format(amount);
}

export function getStripeAmountInCents(amount: number): number {
  return Math.round(amount * 100);
}

export function getSubscriptionStatusText(status: string): string {
  const map: Record<string, string> = {
    active: 'Ativa',
    canceled: 'Cancelada',
    incomplete: 'Incompleta',
    incomplete_expired: 'Expirada',
    past_due: 'Em atraso',
    trialing: 'Período de teste',
    unpaid: 'Não paga'
  };
  return map[status] || status;
}
