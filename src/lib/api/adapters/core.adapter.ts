/**
 * 🏗️ CORE ADAPTER - T6 Implementation
 * Adapter para endpoints básicos do sistema (health, status, métricas)
 */

import httpClient from '../http';
import type { AxiosResponse } from 'axios';

// ===============================================
// 🔧 TYPES
// ===============================================

export interface HealthCheckResponse {
  ok: boolean;
  ts: string;
  version: string;
  uptime?: number;
  environment?: string;
}

export interface SystemStatusResponse {
  status: string;
  timestamp: string;
  system: string;
  mode?: string;
}

export interface ApiRoutesResponse {
  routes: string[];
  total: number;
  version: string;
}

export interface MetricsResponse {
  [key: string]: any;
}

// ===============================================
// 🏗️ CORE ADAPTER
// ===============================================

export class CoreAdapter {
  private readonly basePath = '';

  /**
   * 🏥 Health Check
   * GET /health
   */
  async getHealth(): Promise<HealthCheckResponse> {
    const response: AxiosResponse<HealthCheckResponse> = await httpClient.get(
      `${this.basePath}/health`
    );
    return response.data;
  }

  /**
   * 📊 System Status
   * GET /status
   */
  async getStatus(): Promise<SystemStatusResponse> {
    const response: AxiosResponse<SystemStatusResponse> = await httpClient.get(
      `${this.basePath}/status`
    );
    return response.data;
  }

  /**
   * 📊 API Status
   * GET /api/status
   */
  async getApiStatus(): Promise<SystemStatusResponse> {
    const response: AxiosResponse<SystemStatusResponse> = await httpClient.get(
      `${this.basePath}/api/status`
    );
    return response.data;
  }

  /**
   * 🗺️ List API Routes
   * GET /api/routes
   */
  async getRoutes(): Promise<ApiRoutesResponse> {
    const response: AxiosResponse<ApiRoutesResponse> = await httpClient.get(
      `${this.basePath}/api/routes`
    );
    return response.data;
  }

  /**
   * 📈 Prometheus Metrics
   * GET /metrics
   */
  async getMetrics(): Promise<MetricsResponse> {
    const response: AxiosResponse<MetricsResponse> = await httpClient.get(
      `${this.basePath}/metrics`
    );
    return response.data;
  }

  /**
   * 🏠 Root API Info
   * GET /
   */
  async getRootInfo(): Promise<any> {
    const response: AxiosResponse<any> = await httpClient.get(
      `${this.basePath}/`
    );
    return response.data;
  }
}

// ===============================================
// 🔄 SINGLETON EXPORT
// ===============================================

export const coreAdapter = new CoreAdapter();
export default coreAdapter;