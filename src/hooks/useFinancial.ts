/**
 * 💰 USE FINANCIAL HOOK - T7 Implementation
 * Hook para operações financeiras (saldos, transações, depósitos, saques)
 * Baseado no FinancialAdapter implementado em T6
 */

import { useState, useEffect, useCallback } from 'react';
import { financialAdapter } from '../lib/api/adapters';
import type {
  UserBalance,
  Transaction,
  PaginatedTransactions,
  DepositRequest,
  DepositResponse,
  WithdrawalRequest,
  WithdrawalResponse,
  CurrencyConversion,
  FinancialSummary
} from '../lib/api/adapters';

// ===============================================
// 🔧 TYPES
// ===============================================

export interface UseFinancialReturn {
  // Balance
  balance: UserBalance | null;
  balanceLoading: boolean;
  balanceError: string | null;
  getBalance: (userId: string) => Promise<void>;
  
  // Transactions
  transactions: Transaction[];
  transactionsLoading: boolean;
  transactionsError: string | null;
  transactionsPagination: {
    total: number;
    page: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  getTransactions: (userId: string, options?: {
    page?: number;
    limit?: number;
    type?: string;
    currency?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
    sort?: string;
  }) => Promise<void>;
  
  // Deposits
  depositLoading: boolean;
  depositError: string | null;
  processDeposit: (request: DepositRequest) => Promise<DepositResponse | null>;
  
  // Withdrawals
  withdrawalLoading: boolean;
  withdrawalError: string | null;
  processWithdrawal: (request: WithdrawalRequest) => Promise<WithdrawalResponse | null>;
  
  // Currency Conversion
  conversionLoading: boolean;
  conversionError: string | null;
  convertUsdToBrl: (amount: number) => Promise<CurrencyConversion | null>;
  
  // Financial Summary
  summary: FinancialSummary | null;
  summaryLoading: boolean;
  summaryError: string | null;
  getSummary: (userId: string) => Promise<void>;
  
  // Utilities
  validateDeposit: (request: DepositRequest) => { valid: boolean; errors: string[] };
  validateWithdrawal: (request: WithdrawalRequest) => { valid: boolean; errors: string[] };
  formatCurrency: (amount: number, currency: string) => string;
  calculateFee: (amount: number, currency: string, method: string) => number;
  refetchAll: (userId: string) => Promise<void>;
}

// ===============================================
// 💰 USE FINANCIAL HOOK
// ===============================================

export const useFinancial = (): UseFinancialReturn => {
  // Balance State
  const [balance, setBalance] = useState<UserBalance | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [balanceError, setBalanceError] = useState<string | null>(null);
  
  // Transactions State
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [transactionsError, setTransactionsError] = useState<string | null>(null);
  const [transactionsPagination, setTransactionsPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    hasNext: false,
    hasPrev: false
  });
  
  // Deposits State
  const [depositLoading, setDepositLoading] = useState(false);
  const [depositError, setDepositError] = useState<string | null>(null);
  
  // Withdrawals State
  const [withdrawalLoading, setWithdrawalLoading] = useState(false);
  const [withdrawalError, setWithdrawalError] = useState<string | null>(null);
  
  // Conversion State
  const [conversionLoading, setConversionLoading] = useState(false);
  const [conversionError, setConversionError] = useState<string | null>(null);
  
  // Summary State
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  // ===============================================
  // 💳 BALANCE
  // ===============================================

  const getBalance = useCallback(async (userId: string): Promise<void> => {
    try {
      setBalanceLoading(true);
      setBalanceError(null);
      
      const balanceData = await financialAdapter.getBalance(userId);
      setBalance(balanceData);
    } catch (error: any) {
      setBalanceError(error.message || 'Erro ao obter saldo');
      console.error('Balance error:', error);
    } finally {
      setBalanceLoading(false);
    }
  }, []);

  // ===============================================
  // 📋 TRANSACTIONS
  // ===============================================

  const getTransactions = useCallback(async (
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
  ): Promise<void> => {
    try {
      setTransactionsLoading(true);
      setTransactionsError(null);
      
      const transactionsData = await financialAdapter.getTransactions(userId, options);
      
      setTransactions(transactionsData.data);
      setTransactionsPagination({
        total: transactionsData.total,
        page: transactionsData.page,
        limit: transactionsData.limit,
        hasNext: transactionsData.hasNext,
        hasPrev: transactionsData.hasPrev
      });
    } catch (error: any) {
      setTransactionsError(error.message || 'Erro ao obter transações');
      console.error('Transactions error:', error);
    } finally {
      setTransactionsLoading(false);
    }
  }, []);

  // ===============================================
  // 💸 DEPOSITS
  // ===============================================

  const processDeposit = useCallback(async (request: DepositRequest): Promise<DepositResponse | null> => {
    try {
      setDepositLoading(true);
      setDepositError(null);
      
      // Validate deposit request
      const validation = financialAdapter.validateDepositRequest(request);
      if (!validation.valid) {
        setDepositError(validation.errors.join(', '));
        return null;
      }
      
      const result = await financialAdapter.processDeposit(request);
      
      // Refresh balance and transactions after successful deposit
      if (result.success) {
        getBalance(request.userId);
        getTransactions(request.userId);
      }
      
      return result;
    } catch (error: any) {
      setDepositError(error.message || 'Erro ao processar depósito');
      console.error('Deposit error:', error);
      return null;
    } finally {
      setDepositLoading(false);
    }
  }, [getBalance, getTransactions]);

  // ===============================================
  // 💰 WITHDRAWALS
  // ===============================================

  const processWithdrawal = useCallback(async (request: WithdrawalRequest): Promise<WithdrawalResponse | null> => {
    try {
      setWithdrawalLoading(true);
      setWithdrawalError(null);
      
      // Validate withdrawal request
      const validation = financialAdapter.validateWithdrawalRequest(request);
      if (!validation.valid) {
        setWithdrawalError(validation.errors.join(', '));
        return null;
      }
      
      const result = await financialAdapter.processWithdrawal(request);
      
      // Refresh balance and transactions after successful withdrawal
      if (result.success) {
        getBalance(request.userId);
        getTransactions(request.userId);
      }
      
      return result;
    } catch (error: any) {
      setWithdrawalError(error.message || 'Erro ao processar saque');
      console.error('Withdrawal error:', error);
      return null;
    } finally {
      setWithdrawalLoading(false);
    }
  }, [getBalance, getTransactions]);

  // ===============================================
  // 🔄 CURRENCY CONVERSION
  // ===============================================

  const convertUsdToBrl = useCallback(async (amount: number): Promise<CurrencyConversion | null> => {
    try {
      setConversionLoading(true);
      setConversionError(null);
      
      const conversionData = await financialAdapter.convertUsdToBrl(amount);
      return conversionData;
    } catch (error: any) {
      setConversionError(error.message || 'Erro ao converter moeda');
      console.error('Conversion error:', error);
      return null;
    } finally {
      setConversionLoading(false);
    }
  }, []);

  // ===============================================
  // 📊 FINANCIAL SUMMARY
  // ===============================================

  const getSummary = useCallback(async (userId: string): Promise<void> => {
    try {
      setSummaryLoading(true);
      setSummaryError(null);
      
      const summaryData = await financialAdapter.getFinancialSummary(userId);
      setSummary(summaryData);
    } catch (error: any) {
      setSummaryError(error.message || 'Erro ao obter resumo financeiro');
      console.error('Summary error:', error);
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  // ===============================================
  // 🛠️ UTILITIES
  // ===============================================

  const validateDeposit = useCallback((request: DepositRequest): { valid: boolean; errors: string[] } => {
    return financialAdapter.validateDepositRequest(request);
  }, []);

  const validateWithdrawal = useCallback((request: WithdrawalRequest): { valid: boolean; errors: string[] } => {
    return financialAdapter.validateWithdrawalRequest(request);
  }, []);

  const formatCurrency = useCallback((amount: number, currency: string): string => {
    return financialAdapter.formatCurrency(amount, currency);
  }, []);

  const calculateFee = useCallback((amount: number, currency: string, method: string): number => {
    return financialAdapter.calculateTransactionFee(amount, currency, method);
  }, []);

  const refetchAll = useCallback(async (userId: string): Promise<void> => {
    await Promise.allSettled([
      getBalance(userId),
      getTransactions(userId),
      getSummary(userId)
    ]);
  }, [getBalance, getTransactions, getSummary]);

  // ===============================================
  // 📤 RETURN
  // ===============================================

  return {
    // Balance
    balance,
    balanceLoading,
    balanceError,
    getBalance,
    
    // Transactions
    transactions,
    transactionsLoading,
    transactionsError,
    transactionsPagination,
    getTransactions,
    
    // Deposits
    depositLoading,
    depositError,
    processDeposit,
    
    // Withdrawals
    withdrawalLoading,
    withdrawalError,
    processWithdrawal,
    
    // Currency Conversion
    conversionLoading,
    conversionError,
    convertUsdToBrl,
    
    // Financial Summary
    summary,
    summaryLoading,
    summaryError,
    getSummary,
    
    // Utilities
    validateDeposit,
    validateWithdrawal,
    formatCurrency,
    calculateFee,
    refetchAll
  };
};

export default useFinancial;