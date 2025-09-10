/**
 * 💰 FINANCIAL ADAPTER - T6 Implementation
 * Adapter para operações financeiras (saldos, transações, depósitos, saques)
 * Baseado nas especificações resolvidas em T5
 */

import httpClient from '../http';
import type { AxiosResponse } from 'axios';

// ===============================================
// 🔧 TYPES
// ===============================================

export interface UserBalance {
  userId: string;
  balances: {
    [currency: string]: {
      available: number;
      locked: number;
      total: number;
    };
  };
  totalUSD: number;
  totalBRL: number;
  lastUpdate: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'trade' | 'fee' | 'commission';
  currency: string;
  amount: number;
  fee?: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  description: string;
  reference?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: {
    [key: string]: any;
  };
}

export interface PaginatedTransactions {
  data: Transaction[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface DepositRequest {
  userId: string;
  currency: string;
  amount: number;
  method: 'pix' | 'ted' | 'stripe' | 'crypto';
  metadata?: {
    [key: string]: any;
  };
}

export interface DepositResponse {
  success: boolean;
  transactionId: string;
  paymentUrl?: string;
  pixCode?: string;
  bankDetails?: {
    bank: string;
    agency: string;
    account: string;
    holder: string;
  };
  message: string;
}

export interface WithdrawalRequest {
  userId: string;
  currency: string;
  amount: number;
  method: 'pix' | 'ted' | 'crypto';
  destination: {
    pixKey?: string;
    bankAccount?: {
      bank: string;
      agency: string;
      account: string;
      holder: string;
      document: string;
    };
    cryptoAddress?: string;
  };
}

export interface WithdrawalResponse {
  success: boolean;
  transactionId: string;
  fee: number;
  netAmount: number;
  estimatedTime: string;
  message: string;
}

export interface CurrencyConversion {
  from: string;
  to: string;
  amount: number;
  convertedAmount: number;
  rate: number;
  timestamp: string;
}

export interface FinancialSummary {
  totalBalance: {
    USD: number;
    BRL: number;
    EUR: number;
  };
  monthlyStats: {
    deposits: number;
    withdrawals: number;
    fees: number;
    pnl: number;
  };
  recentTransactions: Transaction[];
}

// ===============================================
// 💰 FINANCIAL ADAPTER
// ===============================================

export class FinancialAdapter {
  private readonly basePath = '/api/enterprise/financial';

  /**
   * 💳 Get User Balance
   * GET /api/enterprise/financial/balance
   */
  async getBalance(userId: string): Promise<UserBalance> {
    const response: AxiosResponse<UserBalance> = await httpClient.get(
      `${this.basePath}/balance`,
      { params: { userId } }
    );
    return response.data;
  }

  /**
   * 📋 Get Transactions
   * GET /api/enterprise/financial/transactions
   */
  async getTransactions(
    userId: string,
    options: {
      page?: number;
      limit?: number;
      type?: string;
      currency?: string;
      status?: string;
      startDate?: string;
      endDate?: string;
      search?: string;
      sort?: string;
    } = {}
  ): Promise<PaginatedTransactions> {
    const params = {
      userId,
      page: options.page || 1,
      limit: options.limit || 20,
      sort: options.sort || 'desc',
      ...options
    };

    const response: AxiosResponse<PaginatedTransactions> = await httpClient.get(
      `${this.basePath}/transactions`,
      { params }
    );
    return response.data;
  }

  /**
   * 💸 Process Deposit
   * POST /api/enterprise/financial/deposit
   */
  async processDeposit(request: DepositRequest): Promise<DepositResponse> {
    const response: AxiosResponse<DepositResponse> = await httpClient.post(
      `${this.basePath}/deposit`,
      request
    );
    return response.data;
  }

  /**
   * 💰 Process Withdrawal
   * POST /api/enterprise/financial/withdraw
   */
  async processWithdrawal(request: WithdrawalRequest): Promise<WithdrawalResponse> {
    const response: AxiosResponse<WithdrawalResponse> = await httpClient.post(
      `${this.basePath}/withdraw`,
      request
    );
    return response.data;
  }

  /**
   * 🔄 Convert Currency
   * GET /api/enterprise/financial/usd-to-brl/:amount
   */
  async convertUsdToBrl(amount: number): Promise<CurrencyConversion> {
    const response: AxiosResponse<CurrencyConversion> = await httpClient.get(
      `${this.basePath}/usd-to-brl/${amount}`
    );
    return response.data;
  }

  /**
   * 📊 Get Financial Summary
   * GET /api/financial/summary
   */
  async getFinancialSummary(userId: string): Promise<FinancialSummary> {
    const response: AxiosResponse<FinancialSummary> = await httpClient.get(
      '/api/financial/summary',
      { params: { userId } }
    );
    return response.data;
  }

  /**
   * ℹ️ Get Financial System Info
   * GET /api/financial/info
   */
  async getFinancialInfo(): Promise<any> {
    const response: AxiosResponse<any> = await httpClient.get('/api/financial/info');
    return response.data;
  }

  // ===============================================
// 🛠️ UTILITY METHODS
  // ===============================================

  /**
   * 🔍 Validate Deposit Request
   */
  validateDepositRequest(request: DepositRequest): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!request.userId) {
      errors.push('User ID é obrigatório');
    }

    if (!request.currency) {
      errors.push('Currency é obrigatória');
    }

    if (!request.amount || request.amount <= 0) {
      errors.push('Amount deve ser maior que zero');
    }

    if (!['pix', 'ted', 'stripe', 'crypto'].includes(request.method)) {
      errors.push('Método de depósito inválido');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * 🔍 Validate Withdrawal Request
   */
  validateWithdrawalRequest(request: WithdrawalRequest): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!request.userId) {
      errors.push('User ID é obrigatório');
    }

    if (!request.currency) {
      errors.push('Currency é obrigatória');
    }

    if (!request.amount || request.amount <= 0) {
      errors.push('Amount deve ser maior que zero');
    }

    if (!['pix', 'ted', 'crypto'].includes(request.method)) {
      errors.push('Método de saque inválido');
    }

    // Validar destino baseado no método
    if (request.method === 'pix' && !request.destination.pixKey) {
      errors.push('Chave PIX é obrigatória para saque via PIX');
    }

    if (request.method === 'ted' && !request.destination.bankAccount) {
      errors.push('Dados bancários são obrigatórios para saque via TED');
    }

    if (request.method === 'crypto' && !request.destination.cryptoAddress) {
      errors.push('Endereço crypto é obrigatório para saque em criptomoeda');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * 💱 Calculate Exchange Rate
   */
  calculateExchangeRate(fromAmount: number, toAmount: number): number {
    return toAmount / fromAmount;
  }

  /**
   * 💰 Format Currency
   */
  formatCurrency(amount: number, currency: string): string {
    const formatters = {
      BRL: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }),
      USD: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
      EUR: new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' })
    };

    const formatter = formatters[currency as keyof typeof formatters];
    return formatter ? formatter.format(amount) : `${amount} ${currency}`;
  }

  /**
   * 📊 Calculate Transaction Fees
   */
  calculateTransactionFee(amount: number, currency: string, method: string): number {
    // Taxas baseadas nas especificações resolvidas
    const feeRules = {
      withdrawal: {
        BRL: 10.00, // R$ 10,00 fixo
        USD: 2.00   // $ 2,00 fixo
      },
      deposit: {
        pix: 0,     // PIX gratuito
        ted: 0,     // TED gratuito
        stripe: (amount: number) => amount * 0.029 + 0.30 // 2.9% + $0.30
      }
    };

    if (method === 'withdrawal') {
      return feeRules.withdrawal[currency as keyof typeof feeRules.withdrawal] || 0;
    }

    if (method === 'stripe') {
      return feeRules.deposit.stripe(amount);
    }

    return 0;
  }

  /**
   * 🔍 Validate PIX Key
   */
  validatePixKey(pixKey: string): { valid: boolean; type: string } {
    // CPF/CNPJ
    if (/^\d{11}$|^\d{14}$/.test(pixKey.replace(/\D/g, ''))) {
      return { valid: true, type: 'document' };
    }

    // Email
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pixKey)) {
      return { valid: true, type: 'email' };
    }

    // Telefone
    if (/^\+?55\d{10,11}$/.test(pixKey.replace(/\D/g, ''))) {
      return { valid: true, type: 'phone' };
    }

    // Chave aleatória (UUID)
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(pixKey)) {
      return { valid: true, type: 'random' };
    }

    return { valid: false, type: 'unknown' };
  }

  /**
   * 📈 Get Balance Trend
   */
  getBalanceTrend(transactions: Transaction[]): 'up' | 'down' | 'stable' {
    if (transactions.length < 2) return 'stable';

    const recent = transactions.slice(0, 5);
    const deposits = recent.filter(t => t.type === 'deposit').reduce((sum, t) => sum + t.amount, 0);
    const withdrawals = recent.filter(t => t.type === 'withdrawal').reduce((sum, t) => sum + t.amount, 0);
    const net = deposits - withdrawals;

    if (net > 0) return 'up';
    if (net < 0) return 'down';
    return 'stable';
  }
}

// ===============================================
// 🔄 SINGLETON EXPORT
// ===============================================

export const financialAdapter = new FinancialAdapter();
export default financialAdapter;