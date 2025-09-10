/**
 * 🏗️ USE CORE HOOK - T7 Implementation
 * Hook para operações básicas do sistema (health, status, métricas)
 * Baseado no CoreAdapter implementado em T6
 */

import { useState, useEffect, useCallback } from 'react';
import { coreAdapter } from '../lib/api/adapters';
import type {
  HealthCheckResponse,
  SystemStatusResponse,
  ApiRoutesResponse,
  MetricsResponse
} from '../lib/api/adapters';

// ===============================================
// 🔧 TYPES
// ===============================================

export interface UseCoreReturn {
  // Health Check
  health: HealthCheckResponse | null;
  healthLoading: boolean;
  healthError: string | null;
  checkHealth: () => Promise<void>;
  
  // System Status
  status: SystemStatusResponse | null;
  statusLoading: boolean;
  statusError: string | null;
  getStatus: () => Promise<void>;
  
  // API Routes
  routes: ApiRoutesResponse | null;
  routesLoading: boolean;
  routesError: string | null;
  getRoutes: () => Promise<void>;
  
  // Metrics
  metrics: MetricsResponse | null;
  metricsLoading: boolean;
  metricsError: string | null;
  getMetrics: () => Promise<void>;
  
  // General
  isSystemHealthy: boolean;
  refetchAll: () => Promise<void>;
}

// ===============================================
// 🏗️ USE CORE HOOK
// ===============================================

export const useCore = (): UseCoreReturn => {
  // Health Check State
  const [health, setHealth] = useState<HealthCheckResponse | null>(null);
  const [healthLoading, setHealthLoading] = useState(false);
  const [healthError, setHealthError] = useState<string | null>(null);
  
  // System Status State
  const [status, setStatus] = useState<SystemStatusResponse | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  
  // API Routes State
  const [routes, setRoutes] = useState<ApiRoutesResponse | null>(null);
  const [routesLoading, setRoutesLoading] = useState(false);
  const [routesError, setRoutesError] = useState<string | null>(null);
  
  // Metrics State
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [metricsError, setMetricsError] = useState<string | null>(null);

  // ===============================================
  // 🔧 HEALTH CHECK
  // ===============================================

  const checkHealth = useCallback(async (): Promise<void> => {
    try {
      setHealthLoading(true);
      setHealthError(null);
      
      const healthData = await coreAdapter.getHealth();
      setHealth(healthData);
    } catch (error: any) {
      setHealthError(error.message || 'Erro ao verificar saúde do sistema');
      console.error('Health check error:', error);
    } finally {
      setHealthLoading(false);
    }
  }, []);

  // ===============================================
  // 📊 SYSTEM STATUS
  // ===============================================

  const getStatus = useCallback(async (): Promise<void> => {
    try {
      setStatusLoading(true);
      setStatusError(null);
      
      const statusData = await coreAdapter.getStatus();
      setStatus(statusData);
    } catch (error: any) {
      setStatusError(error.message || 'Erro ao obter status do sistema');
      console.error('Status error:', error);
    } finally {
      setStatusLoading(false);
    }
  }, []);

  // ===============================================
  // 🗺️ API ROUTES
  // ===============================================

  const getRoutes = useCallback(async (): Promise<void> => {
    try {
      setRoutesLoading(true);
      setRoutesError(null);
      
      const routesData = await coreAdapter.getRoutes();
      setRoutes(routesData);
    } catch (error: any) {
      setRoutesError(error.message || 'Erro ao obter rotas da API');
      console.error('Routes error:', error);
    } finally {
      setRoutesLoading(false);
    }
  }, []);

  // ===============================================
  // 📈 METRICS
  // ===============================================

  const getMetrics = useCallback(async (): Promise<void> => {
    try {
      setMetricsLoading(true);
      setMetricsError(null);
      
      const metricsData = await coreAdapter.getMetrics();
      setMetrics(metricsData);
    } catch (error: any) {
      setMetricsError(error.message || 'Erro ao obter métricas');
      console.error('Metrics error:', error);
    } finally {
      setMetricsLoading(false);
    }
  }, []);

  // ===============================================
  // 🔄 REFETCH ALL
  // ===============================================

  const refetchAll = useCallback(async (): Promise<void> => {
    await Promise.allSettled([
      checkHealth(),
      getStatus(),
      getRoutes(),
      getMetrics()
    ]);
  }, [checkHealth, getStatus, getRoutes, getMetrics]);

  // ===============================================
  // 🏥 COMPUTED VALUES
  // ===============================================

  const isSystemHealthy = health?.ok === true && status?.status === 'healthy';

  // ===============================================
  // 🚀 AUTO FETCH ON MOUNT
  // ===============================================

  useEffect(() => {
    checkHealth(); // Auto-check health on mount
  }, [checkHealth]);

  // ===============================================
  // 📤 RETURN
  // ===============================================

  return {
    // Health Check
    health,
    healthLoading,
    healthError,
    checkHealth,
    
    // System Status
    status,
    statusLoading,
    statusError,
    getStatus,
    
    // API Routes
    routes,
    routesLoading,
    routesError,
    getRoutes,
    
    // Metrics
    metrics,
    metricsLoading,
    metricsError,
    getMetrics,
    
    // General
    isSystemHealthy,
    refetchAll
  };
};

export default useCore;