// 🎯 TIPOS PARA DADOS REAIS DO BACKEND
// ⚠️ REGRA CRÍTICA: PROIBIDO dados mock, simulados ou estáticos
// Frontend deve refletir EXATAMENTE o que está no backend

export interface User {
  id: string;
  name: string;
  email: string;
  profile_type: 'basic' | 'premium' | 'enterprise';
  role: 'USUARIO' | 'AFILIADO' | 'ADMIN' | 'GESTOR' | 'OPERADOR';
  affiliate_level?: 'normal' | 'vip';
  created_at: string;
  updated_at: string;
  is_active: boolean;
  avatar_url?: string;
  phone?: string;
  country?: string;
  timezone?: string;
  preferred_language?: string;
}

// 💰 SISTEMA FINANCEIRO (4 tipos de saldo reais)
export interface UserBalances {
  user_id: string;
  real_balance: number;          // Saldo principal de trading
  admin_balance: number;         // Saldo administrativo (bônus)
  commission_balance: number;    // Comissões de afiliados
  prepaid_balance: number;       // Saldo pré-pago (depósitos)
  total_balance: number;         // Soma calculada
  last_updated: string;
  currency: 'USD' | 'BRL';
}

// 📊 TRADING (operações reais do sistema)
export interface Trade {
  id: string;
  user_id: string;
  symbol: string;                // Ex: BTCUSDT
  side: 'BUY' | 'SELL';
  type: 'MARKET' | 'LIMIT' | 'STOP';
  quantity: number;
  price: number;
  executed_price?: number;
  status: 'PENDING' | 'FILLED' | 'CANCELED' | 'REJECTED';
  profit_loss?: number;          // Lucro/prejuízo real
  opened_at: string;
  closed_at?: string;
  exchange: 'BINANCE' | 'BYBIT';
  strategy?: string;
  commission: number;
}

// 📈 MÉTRICAS REAIS (calculadas do banco)
export interface TradingMetrics {
  user_id: string;
  total_trades: number;
  winning_trades: number;
  losing_trades: number;
  win_rate: number;              // Porcentagem (0-100)
  total_profit: number;
  total_loss: number;
  net_profit: number;
  best_trade: number;
  worst_trade: number;
  avg_trade_duration: number;    // Em minutos
  sharpe_ratio?: number;
  max_drawdown?: number;
  roi_percentage: number;
  period_start: string;
  period_end: string;
}

// 🤝 SISTEMA DE AFILIADOS
export interface AffiliateMetrics {
  affiliate_id: string;
  total_referrals: number;
  active_referrals: number;
  total_commissions: number;
  monthly_commissions: number;
  pending_commissions: number;
  paid_commissions: number;
  conversion_rate: number;       // Porcentagem
  tier_level: 'normal' | 'vip';
  commission_rate: number;       // 1.5% ou 2.0%
  last_commission_date?: string;
}

// 👑 ADMIN DASHBOARD (métricas do sistema)
export interface SystemMetrics {
  total_users: number;
  active_users_7d: number;
  new_users_today: number;
  new_users_month: number;
  user_growth_rate: number;
  total_deposits: number;
  total_withdrawals: number;
  net_flow: number;
  monthly_revenue: number;
  commission_paid: number;
  total_operations: number;
  system_profit: number;
  user_profit: number;
  system_performance: number;
  active_strategies: number;
  system_uptime: number;
  api_response_time: number;
  error_rate: number;
  concurrent_users: number;
  last_updated: string;
}

// 🔑 API KEYS (configurações reais do usuário)
export interface ApiKey {
  id: string;
  user_id: string;
  exchange: 'BINANCE' | 'BYBIT';
  api_key: string;               // Encrypted
  api_secret: string;           // Encrypted
  name: string;                 // Nome dado pelo usuário
  is_active: boolean;
  is_testnet: boolean;
  permissions: string[];        // Ex: ['SPOT', 'FUTURES']
  created_at: string;
  last_used?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ERROR';
}

// 🎫 CUPONS (sistema administrativo)
export interface Coupon {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_TRIAL';
  value: number;
  currency?: 'USD' | 'BRL';
  max_uses: number;
  current_uses: number;
  max_uses_per_user: number;
  user_groups?: string[];
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_by: string;
  created_at: string;
}

// 💳 TRANSAÇÕES (histórico financeiro real)
export interface Transaction {
  id: string;
  user_id: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'COMMISSION' | 'BONUS' | 'TRANSFER';
  amount: number;
  currency: 'USD' | 'BRL';
  balance_type: 'real_balance' | 'admin_balance' | 'commission_balance' | 'prepaid_balance';
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELED';
  description: string;
  reference_id?: string;        // ID externo (Stripe, etc)
  created_at: string;
  processed_at?: string;
  fees?: number;
}

// 🔔 NOTIFICAÇÕES (sistema real)
export interface Notification {
  id: string;
  user_id: string;
  type: 'TRADE' | 'SYSTEM' | 'FINANCIAL' | 'AFFILIATE' | 'SECURITY';
  title: string;
  message: string;
  data?: Record<string, any>;   // Dados extras (trade_id, etc)
  is_read: boolean;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  created_at: string;
  read_at?: string;
  expires_at?: string;
}

// 📊 SINAIS DE TRADING
export interface TradingSignal {
  id: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  price: number;
  target_price?: number;
  stop_loss?: number;
  confidence: number;           // 0-100
  strategy: string;
  exchange: 'BINANCE' | 'BYBIT';
  status: 'ACTIVE' | 'FILLED' | 'EXPIRED' | 'CANCELED';
  created_at: string;
  expires_at?: string;
  filled_at?: string;
}

// 🎯 UTILITY TYPES para campos vazios
export type EmptyField = '-';

// Helper para campos vazios
export const formatEmptyField = (value: any): string => {
  if (value === null || value === undefined || value === '' || value === 0) {
    return '-';
  }
  return String(value);
};

// Helper para formatação de números
export const formatCurrency = (amount: number, currency: 'USD' | 'BRL' = 'USD'): string => {
  if (amount === null || amount === undefined) return '-';
  
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 8, // Para crypto
  });
  
  return formatter.format(amount);
};

// Helper para formatação de porcentagem
export const formatPercentage = (value: number): string => {
  if (value === null || value === undefined) return '-';
  return `${value.toFixed(2)}%`;
};

// Helper para formatação de data
export const formatDate = (dateString: string): string => {
  if (!dateString) return '-';
  
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  } catch (error) {
    return '-';
  }
};

// Helper para formatação de duração
export const formatDuration = (minutes: number): string => {
  if (minutes === null || minutes === undefined) return '-';
  
  if (minutes < 60) {
    return `${minutes}min`;
  } else if (minutes < 1440) { // 24 horas
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}min`;
  } else {
    const days = Math.floor(minutes / 1440);
    const hours = Math.floor((minutes % 1440) / 60);
    return `${days}d ${hours}h`;
  }
};

export default {
  formatEmptyField,
  formatCurrency,
  formatPercentage,
  formatDate,
  formatDuration,
};
