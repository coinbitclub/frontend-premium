/**
 * 📈 TRADING ADAPTER - T6 Implementation
 * Adapter para operações de trading (sinais, posições, execução, análise)
 * Baseado nas especificações resolvidas em T5
 */

import httpClient from '../http';
import type { AxiosResponse } from 'axios';

// ===============================================
// 🔧 TYPES
// ===============================================

export interface TradingSignal {
  id?: string;
  symbol: string;
  action: 'BUY' | 'SELL';
  price: number;
  quantity: number;
  leverage?: number;
  stopLoss?: number;
  takeProfit?: number;
  timestamp: string;
  source?: string;
  confidence?: number;
}

export interface SignalResponse {
  success: boolean;
  signalId: string;
  message: string;
  executionResults?: ExecutionResult[];
}

export interface ExecutionResult {
  exchange: string;
  status: 'SUCCESS' | 'ERROR' | 'PENDING';
  orderId?: string;
  error?: string;
}

export interface ManualOrderRequest {
  symbol: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit';
  amount: number;
  price?: number;
  leverage?: number;
  stopLoss?: number;
  takeProfit?: number;
}

export interface Position {
  id: string;
  symbol: string;
  side: 'long' | 'short';
  size: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercentage: number;
  leverage: number;
  margin: number;
  liquidationPrice?: number;
  createdAt: string;
  updatedAt: string;
  exchange: string;
  status: 'open' | 'closed' | 'liquidated';
}

export interface PositionsResponse {
  success: boolean;
  positions: Position[];
  total: number;
  totalPnl: number;
  totalMargin: number;
}

export interface MarketAnalysis {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  marketCap?: number;
  dominance?: number;
  fearGreedIndex?: number;
  technicalIndicators?: {
    rsi?: number;
    macd?: number;
    bollinger?: {
      upper: number;
      middle: number;
      lower: number;
    };
  };
  timestamp: string;
}

export interface TradingConfig {
  userId: string;
  maxLeverage: number;
  riskPerTrade: number;
  stopLossPercentage: number;
  takeProfitPercentage: number;
  enableAutoTrading: boolean;
  enableStopLoss: boolean;
  enableTakeProfit: boolean;
  allowedSymbols: string[];
  maxPositions: number;
  maxDailyLoss: number;
}

export interface SystemStatus {
  trading: {
    enabled: boolean;
    mode: 'testnet' | 'mainnet';
    positionSafety: boolean;
    maxLeverage: number;
    activePositions: number;
    totalPnl: number;
  };
  exchanges: {
    [key: string]: {
      status: 'connected' | 'disconnected' | 'error';
      lastUpdate: string;
    };
  };
}

// ===============================================
// 📈 TRADING ADAPTER
// ===============================================

export class TradingAdapter {
  private readonly basePath = '/api/enterprise/trading';

  /**
   * 📡 Process Trading Signal
   * POST /api/enterprise/trading/signal
   */
  async processSignal(signal: TradingSignal): Promise<SignalResponse> {
    const response: AxiosResponse<SignalResponse> = await httpClient.post(
      `${this.basePath}/signal`,
      signal
    );
    return response.data;
  }

  /**
   * 🎯 Execute Manual Order
   * POST /api/enterprise/trading/execute
   */
  async executeManualOrder(order: ManualOrderRequest): Promise<SignalResponse> {
    const response: AxiosResponse<SignalResponse> = await httpClient.post(
      `${this.basePath}/execute`,
      order
    );
    return response.data;
  }

  /**
   * 📊 Get Active Positions
   * GET /api/enterprise/trading/positions
   */
  async getActivePositions(userId?: string): Promise<PositionsResponse> {
    const params = userId ? { userId } : {};
    const response: AxiosResponse<PositionsResponse> = await httpClient.get(
      `${this.basePath}/positions`,
      { params }
    );
    return response.data;
  }

  /**
   * ❌ Close Position
   * DELETE /api/enterprise/trading/positions/:id
   */
  async closePosition(positionId: string): Promise<{ success: boolean; message: string }> {
    const response: AxiosResponse<{ success: boolean; message: string }> = await httpClient.delete(
      `${this.basePath}/positions/${positionId}`
    );
    return response.data;
  }

  /**
   * 📈 Get Market Analysis
   * GET /api/enterprise/trading/analysis
   */
  async getMarketAnalysis(symbol?: string): Promise<MarketAnalysis[]> {
    const params = symbol ? { symbol } : {};
    const response: AxiosResponse<MarketAnalysis[]> = await httpClient.get(
      `${this.basePath}/analysis`,
      { params }
    );
    return response.data;
  }

  /**
   * ⚙️ Get Trading Config
   * GET /api/enterprise/trading/config
   */
  async getTradingConfig(userId: string): Promise<TradingConfig> {
    const response: AxiosResponse<TradingConfig> = await httpClient.get(
      `${this.basePath}/config`,
      { params: { userId } }
    );
    return response.data;
  }

  /**
   * 🔧 Update Trading Config
   * PUT /api/enterprise/trading/config
   */
  async updateTradingConfig(config: Partial<TradingConfig>): Promise<{ success: boolean; config: TradingConfig }> {
    const response: AxiosResponse<{ success: boolean; config: TradingConfig }> = await httpClient.put(
      `${this.basePath}/config`,
      config
    );
    return response.data;
  }

  /**
   * 🔄 Process Complete Trading Flow
   * POST /api/enterprise/trading/process-complete
   */
  async processCompleteFlow(data: any): Promise<any> {
    const response: AxiosResponse<any> = await httpClient.post(
      `${this.basePath}/process-complete`,
      data
    );
    return response.data;
  }

  /**
   * 📊 Get Trading System Status
   * GET /api/enterprise/trading/system-status
   */
  async getSystemStatus(): Promise<SystemStatus> {
    const response: AxiosResponse<SystemStatus> = await httpClient.get(
      `${this.basePath}/system-status`
    );
    return response.data;
  }

  /**
   * 📈 Get Trading Status
   * GET /api/enterprise/trading/status
   */
  async getTradingStatus(): Promise<any> {
    const response: AxiosResponse<any> = await httpClient.get(
      `${this.basePath}/status`
    );
    return response.data;
  }

  /**
   * ⏱️ Validate Trading Cooldown
   * POST /api/enterprise/trading/validate-cooldown
   */
  async validateCooldown(userData: any): Promise<{ canTrade: boolean; cooldownRemaining?: number }> {
    const response: AxiosResponse<{ canTrade: boolean; cooldownRemaining?: number }> = await httpClient.post(
      `${this.basePath}/validate-cooldown`,
      userData
    );
    return response.data;
  }

  /**
   * ✅ Validate Positions
   * POST /api/enterprise/trading/validate-positions
   */
  async validatePositions(positionData: any): Promise<{ valid: boolean; errors?: string[] }> {
    const response: AxiosResponse<{ valid: boolean; errors?: string[] }> = await httpClient.post(
      `${this.basePath}/validate-positions`,
      positionData
    );
    return response.data;
  }

  // ===============================================
  // 🛠️ UTILITY METHODS
  // ===============================================

  /**
   * 🔍 Validate Trading Signal
   */
  validateSignal(signal: TradingSignal): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!signal.symbol) {
      errors.push('Symbol é obrigatório');
    }

    if (!['BUY', 'SELL'].includes(signal.action)) {
      errors.push('Action deve ser BUY ou SELL');
    }

    if (!signal.price || signal.price <= 0) {
      errors.push('Price deve ser maior que zero');
    }

    if (!signal.quantity || signal.quantity <= 0) {
      errors.push('Quantity deve ser maior que zero');
    }

    if (signal.leverage && (signal.leverage < 1 || signal.leverage > 100)) {
      errors.push('Leverage deve estar entre 1 e 100');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * 💰 Calculate PnL
   */
  calculatePnL(position: Position): { pnl: number; pnlPercentage: number } {
    const priceDiff = position.currentPrice - position.entryPrice;
    const multiplier = position.side === 'long' ? 1 : -1;
    const pnl = priceDiff * multiplier * position.size;
    const pnlPercentage = (priceDiff / position.entryPrice) * multiplier * 100;

    return { pnl, pnlPercentage };
  }

  /**
   * 🎯 Calculate Position Size
   */
  calculatePositionSize(
    accountBalance: number,
    riskPercentage: number,
    entryPrice: number,
    stopLossPrice: number
  ): number {
    const riskAmount = accountBalance * (riskPercentage / 100);
    const priceRisk = Math.abs(entryPrice - stopLossPrice);
    return riskAmount / priceRisk;
  }

  /**
   * 🔴 Calculate Stop Loss Price
   */
  calculateStopLoss(entryPrice: number, percentage: number, side: 'long' | 'short'): number {
    const multiplier = side === 'long' ? (1 - percentage / 100) : (1 + percentage / 100);
    return entryPrice * multiplier;
  }

  /**
   * 🟢 Calculate Take Profit Price
   */
  calculateTakeProfit(entryPrice: number, percentage: number, side: 'long' | 'short'): number {
    const multiplier = side === 'long' ? (1 + percentage / 100) : (1 - percentage / 100);
    return entryPrice * multiplier;
  }
}

// ===============================================
// 🔄 SINGLETON EXPORT
// ===============================================

export const tradingAdapter = new TradingAdapter();
export default tradingAdapter;