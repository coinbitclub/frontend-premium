/**
 * 📈 USE TRADING HOOK - T7 Implementation
 * Hook para operações de trading (sinais, posições, execução, análise)
 * Baseado no TradingAdapter implementado em T6
 */

import { useState, useEffect, useCallback } from 'react';
import { tradingAdapter } from '../lib/api/adapters';
import type {
  TradingSignal,
  SignalResponse,
  ManualOrderRequest,
  Position,
  PositionsResponse,
  MarketAnalysis,
  TradingConfig,
  SystemStatus
} from '../lib/api/adapters';

// ===============================================
// 🔧 TYPES
// ===============================================

export interface UseTradingReturn {
  // Positions
  positions: Position[];
  positionsLoading: boolean;
  positionsError: string | null;
  getPositions: (userId?: string) => Promise<void>;
  closePosition: (positionId: string) => Promise<boolean>;
  
  // Signals
  signalLoading: boolean;
  signalError: string | null;
  processSignal: (signal: TradingSignal) => Promise<SignalResponse | null>;
  
  // Manual Orders
  orderLoading: boolean;
  orderError: string | null;
  executeOrder: (order: ManualOrderRequest) => Promise<SignalResponse | null>;
  
  // Market Analysis
  analysis: MarketAnalysis[];
  analysisLoading: boolean;
  analysisError: string | null;
  getAnalysis: (symbol?: string) => Promise<void>;
  
  // Trading Config
  config: TradingConfig | null;
  configLoading: boolean;
  configError: string | null;
  getConfig: (userId: string) => Promise<void>;
  updateConfig: (config: Partial<TradingConfig>) => Promise<boolean>;
  
  // System Status
  systemStatus: SystemStatus | null;
  systemStatusLoading: boolean;
  systemStatusError: string | null;
  getSystemStatus: () => Promise<void>;
  
  // Utilities
  validateSignal: (signal: TradingSignal) => { valid: boolean; errors: string[] };
  calculatePnL: (position: Position) => { pnl: number; pnlPercentage: number };
  refetchAll: () => Promise<void>;
}

// ===============================================
// 📈 USE TRADING HOOK
// ===============================================

export const useTrading = (): UseTradingReturn => {
  // Positions State
  const [positions, setPositions] = useState<Position[]>([]);
  const [positionsLoading, setPositionsLoading] = useState(false);
  const [positionsError, setPositionsError] = useState<string | null>(null);
  
  // Signals State
  const [signalLoading, setSignalLoading] = useState(false);
  const [signalError, setSignalError] = useState<string | null>(null);
  
  // Orders State
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  
  // Analysis State
  const [analysis, setAnalysis] = useState<MarketAnalysis[]>([]);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  
  // Config State
  const [config, setConfig] = useState<TradingConfig | null>(null);
  const [configLoading, setConfigLoading] = useState(false);
  const [configError, setConfigError] = useState<string | null>(null);
  
  // System Status State
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [systemStatusLoading, setSystemStatusLoading] = useState(false);
  const [systemStatusError, setSystemStatusError] = useState<string | null>(null);

  // ===============================================
  // 📊 POSITIONS
  // ===============================================

  const getPositions = useCallback(async (userId?: string): Promise<void> => {
    try {
      setPositionsLoading(true);
      setPositionsError(null);
      
      const positionsData = await tradingAdapter.getActivePositions(userId);
      setPositions(positionsData.positions || []);
    } catch (error: any) {
      setPositionsError(error.message || 'Erro ao obter posições');
      console.error('Positions error:', error);
    } finally {
      setPositionsLoading(false);
    }
  }, []);

  const closePosition = useCallback(async (positionId: string): Promise<boolean> => {
    try {
      const result = await tradingAdapter.closePosition(positionId);
      
      if (result.success) {
        // Remove position from local state
        setPositions(prev => prev.filter(p => p.id !== positionId));
        return true;
      } else {
        setPositionsError(result.message || 'Erro ao fechar posição');
        return false;
      }
    } catch (error: any) {
      setPositionsError(error.message || 'Erro ao fechar posição');
      console.error('Close position error:', error);
      return false;
    }
  }, []);

  // ===============================================
  // 📡 SIGNALS
  // ===============================================

  const processSignal = useCallback(async (signal: TradingSignal): Promise<SignalResponse | null> => {
    try {
      setSignalLoading(true);
      setSignalError(null);
      
      // Validate signal
      const validation = tradingAdapter.validateSignal(signal);
      if (!validation.valid) {
        setSignalError(validation.errors.join(', '));
        return null;
      }
      
      const result = await tradingAdapter.processSignal(signal);
      
      // Refresh positions after signal processing
      if (result.success) {
        getPositions();
      }
      
      return result;
    } catch (error: any) {
      setSignalError(error.message || 'Erro ao processar sinal');
      console.error('Signal processing error:', error);
      return null;
    } finally {
      setSignalLoading(false);
    }
  }, [getPositions]);

  // ===============================================
  // 🎯 MANUAL ORDERS
  // ===============================================

  const executeOrder = useCallback(async (order: ManualOrderRequest): Promise<SignalResponse | null> => {
    try {
      setOrderLoading(true);
      setOrderError(null);
      
      const result = await tradingAdapter.executeManualOrder(order);
      
      // Refresh positions after order execution
      if (result.success) {
        getPositions();
      }
      
      return result;
    } catch (error: any) {
      setOrderError(error.message || 'Erro ao executar ordem');
      console.error('Order execution error:', error);
      return null;
    } finally {
      setOrderLoading(false);
    }
  }, [getPositions]);

  // ===============================================
  // 📈 MARKET ANALYSIS
  // ===============================================

  const getAnalysis = useCallback(async (symbol?: string): Promise<void> => {
    try {
      setAnalysisLoading(true);
      setAnalysisError(null);
      
      const analysisData = await tradingAdapter.getMarketAnalysis(symbol);
      setAnalysis(analysisData);
    } catch (error: any) {
      setAnalysisError(error.message || 'Erro ao obter análise de mercado');
      console.error('Analysis error:', error);
    } finally {
      setAnalysisLoading(false);
    }
  }, []);

  // ===============================================
  // ⚙️ TRADING CONFIG
  // ===============================================

  const getConfig = useCallback(async (userId: string): Promise<void> => {
    try {
      setConfigLoading(true);
      setConfigError(null);
      
      const configData = await tradingAdapter.getTradingConfig(userId);
      setConfig(configData);
    } catch (error: any) {
      setConfigError(error.message || 'Erro ao obter configuração');
      console.error('Config error:', error);
    } finally {
      setConfigLoading(false);
    }
  }, []);

  const updateConfig = useCallback(async (configUpdate: Partial<TradingConfig>): Promise<boolean> => {
    try {
      setConfigLoading(true);
      setConfigError(null);
      
      const result = await tradingAdapter.updateTradingConfig(configUpdate);
      
      if (result.success) {
        setConfig(result.config);
        return true;
      } else {
        setConfigError('Erro ao atualizar configuração');
        return false;
      }
    } catch (error: any) {
      setConfigError(error.message || 'Erro ao atualizar configuração');
      console.error('Config update error:', error);
      return false;
    } finally {
      setConfigLoading(false);
    }
  }, []);

  // ===============================================
  // 🔧 SYSTEM STATUS
  // ===============================================

  const getSystemStatus = useCallback(async (): Promise<void> => {
    try {
      setSystemStatusLoading(true);
      setSystemStatusError(null);
      
      const statusData = await tradingAdapter.getSystemStatus();
      setSystemStatus(statusData);
    } catch (error: any) {
      setSystemStatusError(error.message || 'Erro ao obter status do sistema');
      console.error('System status error:', error);
    } finally {
      setSystemStatusLoading(false);
    }
  }, []);

  // ===============================================
  // 🛠️ UTILITIES
  // ===============================================

  const validateSignal = useCallback((signal: TradingSignal): { valid: boolean; errors: string[] } => {
    return tradingAdapter.validateSignal(signal);
  }, []);

  const calculatePnL = useCallback((position: Position): { pnl: number; pnlPercentage: number } => {
    return tradingAdapter.calculatePnL(position);
  }, []);

  const refetchAll = useCallback(async (): Promise<void> => {
    await Promise.allSettled([
      getPositions(),
      getAnalysis(),
      getSystemStatus()
    ]);
  }, [getPositions, getAnalysis, getSystemStatus]);

  // ===============================================
  // 🚀 AUTO FETCH ON MOUNT
  // ===============================================

  useEffect(() => {
    // Auto-fetch system status on mount
    getSystemStatus();
  }, [getSystemStatus]);

  // ===============================================
  // 📤 RETURN
  // ===============================================

  return {
    // Positions
    positions,
    positionsLoading,
    positionsError,
    getPositions,
    closePosition,
    
    // Signals
    signalLoading,
    signalError,
    processSignal,
    
    // Manual Orders
    orderLoading,
    orderError,
    executeOrder,
    
    // Market Analysis
    analysis,
    analysisLoading,
    analysisError,
    getAnalysis,
    
    // Trading Config
    config,
    configLoading,
    configError,
    getConfig,
    updateConfig,
    
    // System Status
    systemStatus,
    systemStatusLoading,
    systemStatusError,
    getSystemStatus,
    
    // Utilities
    validateSignal,
    calculatePnL,
    refetchAll
  };
};

export default useTrading;