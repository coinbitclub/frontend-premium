// Placeholder para Stripe - removido dependência não instalada

// Planos disponíveis - MarketBOT (Mock)
export const PLANS = {
  brasil_pro: {
    name: 'Brasil PRO',
    price: 29700, // R$ 297.00 em centavos
    currency: 'brl',
    interval: 'month',
    features: [
      'Trading 24/7',
      'Suporte Prioritário',
      'Relatórios IA',
      'Gestão de Risco',
      'Comissionamento Reduzido',
      'Ideal para investimentos > USD 3.000'
    ]
  },
  brasil_flex: {
    name: 'Brasil FLEX',
    price: 15000, // R$ 150.00 em centavos (recarga mínima)
    currency: 'brl',
    interval: 'one_time', // Prepago
    features: [
      'Trading 24/7',
      'Sem Mensalidade',
      'Comissão Apenas no Lucro',
      'Recarga Flexível',
      'Todos os acessos',
      'Valor de recarga flexível'
    ]
  },
  global_pro: {
    name: 'Global PRO',
    price: 5000, // $50.00 em centavos
    currency: 'usd',
    interval: 'month',
    features: [
      '24/7 Trading',
      'Priority Support',
      'AI Reports',
      'Risk Management',
      'Reduced Commission',
      'Best for investments > USD 3,000'
    ]
  },
  global_flex: {
    name: 'Global FLEX',
    price: 3000, // $30.00 em centavos (recarga mínima)
    currency: 'usd',
    interval: 'one_time', // Prepago
    features: [
      '24/7 Trading',
      'No Monthly Fee',
      'Commission on Profit Only',
      'Flexible Recharge',
      'Full Access',
      'Flexible recharge amount'
    ]
  }
};

// Mock implementations - TODO: Instalar stripe package se necessário
export const getOrCreateStripeCustomer = async (userId: string, email: string, name: string) => {
  console.log('Mock Stripe: getOrCreateStripeCustomer', { userId, email, name });
  return { id: 'mock_customer_id', email, name };
};

export const createCheckoutSession = async (
  userId: string,
  email: string,
  name: string,
  planType: keyof typeof PLANS,
  successUrl: string,
  cancelUrl: string
) => {
  console.log('Mock Stripe: createCheckoutSession', { userId, email, name, planType, successUrl, cancelUrl });
  return { url: 'mock_checkout_url', id: 'mock_session_id' };
};

export const createCustomerPortal = async (customerId: string, returnUrl: string) => {
  console.log('Mock Stripe: createCustomerPortal', { customerId, returnUrl });
  return { url: 'mock_portal_url' };
};

export const cancelSubscription = async (subscriptionId: string) => {
  console.log('Mock Stripe: cancelSubscription', subscriptionId);
  return { id: subscriptionId, cancel_at_period_end: true };
};

export const reactivateSubscription = async (subscriptionId: string) => {
  console.log('Mock Stripe: reactivateSubscription', subscriptionId);
  return { id: subscriptionId, cancel_at_period_end: false };
};

export const getSubscriptionDetails = async (subscriptionId: string) => {
  console.log('Mock Stripe: getSubscriptionDetails', subscriptionId);
  return { id: subscriptionId, status: 'active' };
};

export const createCoupon = async (
  name: string,
  percentOff: number,
  duration: 'once' | 'repeating' | 'forever',
  durationInMonths?: number
) => {
  console.log('Mock Stripe: createCoupon', { name, percentOff, duration, durationInMonths });
  return { id: 'mock_coupon_id', name, percent_off: percentOff };
};

export const verifyPaymentStatus = async (sessionId: string) => {
  console.log('Mock Stripe: verifyPaymentStatus', sessionId);
  return {
    status: 'paid',
    subscription: null,
    customer: 'mock_customer_id',
    metadata: {}
  };
};

// Mock default export
const stripe = {
  customers: {
    list: async () => ({ data: [] }),
    create: async (data: any) => ({ id: 'mock_customer_id', ...data }),
    retrieve: async (id: string) => ({ id, email: 'mock@email.com' })
  },
  checkout: {
    sessions: {
      create: async (data: any) => ({ id: 'mock_session_id', url: 'mock_checkout_url' }),
      retrieve: async (id: string) => ({ id, payment_status: 'paid' })
    }
  },
  subscriptions: {
    update: async (id: string, data: any) => ({ id, ...data }),
    retrieve: async (id: string) => ({ id, status: 'active' })
  }
};

export default stripe;
