/**
 * Enterprise Performance Monitor
 * Monitoramento em tempo real para 1000+ usuários
 */

'use client';

import { useState, useEffect } from 'react';
import { PERFORMANCE_CONFIG } from '../config/enterprise';

interface PerformanceMetrics {
  // Core Web Vitals
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  fcp: number | null; // First Contentful Paint
  tti: number | null; // Time to Interactive

  // Custom Metrics
  apiResponseTime: number[];
  renderTime: number;
  memoryUsage: number;
  bundleSize: number;
  loadTime: number;
  
  // User Experience
  errorRate: number;
  crashRate: number;
  bounceRate: number;
  
  // Resource Loading
  resourceTimings: PerformanceResourceTiming[];
  
  // Network
  connectionType: string;
  downlink: number;
  rtt: number;
}

interface PerformanceAlert {
  id: string;
  type: 'warning' | 'critical';
  metric: string;
  value: number;
  threshold: number;
  timestamp: number;
  message: string;
}

class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};
  private alerts: PerformanceAlert[] = [];
  private observers: Map<string, PerformanceObserver> = new Map();
  private intervals: NodeJS.Timeout[] = [];
  private listeners: Set<(metrics: Partial<PerformanceMetrics>) => void> = new Set();
  private alertListeners: Set<(alert: PerformanceAlert) => void> = new Set();

  constructor() {
    this.init();
  }

  /**
   * Initialize performance monitoring
   */
  private init(): void {
    // Core Web Vitals
    this.observeLCP();
    this.observeFID();
    this.observeCLS();
    this.observeFCP();
    
    // Resource timing
    this.observeResourceTiming();
    
    // Navigation timing
    this.observeNavigationTiming();
    
    // Memory monitoring
    this.startMemoryMonitoring();
    
    // Network monitoring
    this.monitorNetworkCondition();
    
    // API response time monitoring
    this.interceptFetch();
    
    // Error monitoring
    this.monitorErrors();
    
    // Start periodic reporting
    this.startPeriodicReporting();
  }

  /**
   * Observe Largest Contentful Paint
   */
  private observeLCP(): void {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as any;
      
      if (lastEntry) {
        this.metrics.lcp = lastEntry.startTime;
        this.checkThreshold('lcp', lastEntry.startTime, PERFORMANCE_CONFIG.VITALS.LCP);
        this.notifyListeners();
      }
    });

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.set('lcp', observer);
    } catch (error) {
      console.warn('LCP observation not supported');
    }
  }

  /**
   * Observe First Input Delay
   */
  private observeFID(): void {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry: any) => {
        if (entry.name === 'first-input') {
          const fid = entry.processingStart - entry.startTime;
          this.metrics.fid = fid;
          this.checkThreshold('fid', fid, PERFORMANCE_CONFIG.VITALS.FID);
          this.notifyListeners();
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['first-input'] });
      this.observers.set('fid', observer);
    } catch (error) {
      console.warn('FID observation not supported');
    }
  }

  /**
   * Observe Cumulative Layout Shift
   */
  private observeCLS(): void {
    if (!('PerformanceObserver' in window)) return;

    let clsValue = 0;
    let sessionValue = 0;
    let sessionEntries: any[] = [];

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          const firstSessionEntry = sessionEntries[0];
          const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

          if (sessionValue && 
              entry.startTime - lastSessionEntry.startTime < 1000 &&
              entry.startTime - firstSessionEntry.startTime < 5000) {
            sessionValue += entry.value;
            sessionEntries.push(entry);
          } else {
            sessionValue = entry.value;
            sessionEntries = [entry];
          }

          if (sessionValue > clsValue) {
            clsValue = sessionValue;
            this.metrics.cls = clsValue;
            this.checkThreshold('cls', clsValue, PERFORMANCE_CONFIG.VITALS.CLS);
            this.notifyListeners();
          }
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.set('cls', observer);
    } catch (error) {
      console.warn('CLS observation not supported');
    }
  }

  /**
   * Observe First Contentful Paint
   */
  private observeFCP(): void {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry: any) => {
        if (entry.name === 'first-contentful-paint') {
          this.metrics.fcp = entry.startTime;
          this.checkThreshold('fcp', entry.startTime, PERFORMANCE_CONFIG.VITALS.FCP);
          this.notifyListeners();
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['paint'] });
      this.observers.set('fcp', observer);
    } catch (error) {
      console.warn('FCP observation not supported');
    }
  }

  /**
   * Observe resource timing
   */
  private observeResourceTiming(): void {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries() as PerformanceResourceTiming[];
      
      this.metrics.resourceTimings = [
        ...(this.metrics.resourceTimings || []),
        ...entries
      ];

      // Calculate bundle size
      const jsResources = entries.filter(entry => 
        entry.name.includes('.js') && entry.transferSize
      );
      
      const totalBundleSize = jsResources.reduce((total, resource) => 
        total + (resource.transferSize || 0), 0
      );

      if (totalBundleSize > 0) {
        this.metrics.bundleSize = totalBundleSize;
        this.checkThreshold('bundleSize', totalBundleSize, PERFORMANCE_CONFIG.BUNDLE_LIMITS.TOTAL_JS);
      }

      this.notifyListeners();
    });

    try {
      observer.observe({ entryTypes: ['resource'] });
      this.observers.set('resource', observer);
    } catch (error) {
      console.warn('Resource timing observation not supported');
    }
  }

  /**
   * Observe navigation timing
   */
  private observeNavigationTiming(): void {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        this.metrics.loadTime = navigation.loadEventEnd - navigation.fetchStart;
        this.checkThreshold('loadTime', this.metrics.loadTime, 3000);
        this.notifyListeners();
      }
    });
  }

  /**
   * Monitor memory usage
   */
  private startMemoryMonitoring(): void {
    const interval = setInterval(() => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        this.metrics.memoryUsage = memory.usedJSHeapSize;
        
        // Alert if memory usage is high
        const memoryMB = memory.usedJSHeapSize / 1024 / 1024;
        if (memoryMB > 100) {
          this.createAlert('warning', 'memoryUsage', memoryMB, 100, 
            `High memory usage: ${memoryMB.toFixed(1)}MB`);
        }
        
        this.notifyListeners();
      }
    }, 30000); // Every 30 seconds

    this.intervals.push(interval);
  }

  /**
   * Monitor network conditions
   */
  private monitorNetworkCondition(): void {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      
      this.metrics.connectionType = connection.effectiveType || 'unknown';
      this.metrics.downlink = connection.downlink || 0;
      this.metrics.rtt = connection.rtt || 0;

      connection.addEventListener('change', () => {
        this.metrics.connectionType = connection.effectiveType;
        this.metrics.downlink = connection.downlink;
        this.metrics.rtt = connection.rtt;
        this.notifyListeners();
      });
    }
  }

  /**
   * Intercept fetch for API monitoring
   */
  private interceptFetch(): void {
    const originalFetch = window.fetch;
    const apiTimes: number[] = [];

    window.fetch = async (...args) => {
      const startTime = performance.now();
      
      try {
        const response = await originalFetch(...args);
        const duration = performance.now() - startTime;
        
        // Only track API calls
        const url = args[0] as string;
        if (url.includes('/api/') || url.includes('api.')) {
          apiTimes.push(duration);
          
          // Keep only last 100 measurements
          if (apiTimes.length > 100) {
            apiTimes.shift();
          }
          
          this.metrics.apiResponseTime = [...apiTimes];
          
          // Check if API is slow
          if (duration > PERFORMANCE_CONFIG.API_TARGETS.CRITICAL) {
            this.createAlert('warning', 'apiResponseTime', duration, 
              PERFORMANCE_CONFIG.API_TARGETS.CRITICAL, 
              `Slow API response: ${duration.toFixed(0)}ms`);
          }
          
          this.notifyListeners();
        }
        
        return response;
      } catch (error) {
        const duration = performance.now() - startTime;
        this.createAlert('critical', 'apiError', duration, 0, 
          `API request failed: ${error}`);
        throw error;
      }
    };
  }

  /**
   * Monitor JavaScript errors
   */
  private monitorErrors(): void {
    let errorCount = 0;
    let totalPageViews = 1;

    window.addEventListener('error', (event) => {
      errorCount++;
      this.metrics.errorRate = (errorCount / totalPageViews) * 100;
      
      this.createAlert('warning', 'jsError', 1, 0, 
        `JavaScript error: ${event.message}`);
      
      this.notifyListeners();
    });

    window.addEventListener('unhandledrejection', (event) => {
      errorCount++;
      this.metrics.errorRate = (errorCount / totalPageViews) * 100;
      
      this.createAlert('warning', 'promiseRejection', 1, 0, 
        `Unhandled promise rejection: ${event.reason}`);
      
      this.notifyListeners();
    });
  }

  /**
   * Start periodic reporting
   */
  private startPeriodicReporting(): void {
    const interval = setInterval(() => {
      this.reportMetrics();
    }, 60000); // Every minute

    this.intervals.push(interval);
  }

  /**
   * Check performance thresholds
   */
  private checkThreshold(metric: string, value: number, threshold: number): void {
    if (value > threshold) {
      const severity = value > threshold * 1.5 ? 'critical' : 'warning';
      this.createAlert(severity, metric, value, threshold, 
        `${metric.toUpperCase()} threshold exceeded: ${value.toFixed(0)} > ${threshold}`);
    }
  }

  /**
   * Create performance alert
   */
  private createAlert(
    type: 'warning' | 'critical',
    metric: string,
    value: number,
    threshold: number,
    message: string
  ): void {
    const alert: PerformanceAlert = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      metric,
      value,
      threshold,
      timestamp: Date.now(),
      message
    };

    this.alerts.push(alert);
    
    // Keep only last 50 alerts
    if (this.alerts.length > 50) {
      this.alerts.shift();
    }

    // Notify alert listeners
    this.alertListeners.forEach(listener => {
      try {
        listener(alert);
      } catch (error) {
        console.error('Error in alert listener:', error);
      }
    });

    console.warn(`Performance Alert [${type.toUpperCase()}]:`, message);
  }

  /**
   * Report metrics to analytics
   */
  private reportMetrics(): void {
    // Send to Google Analytics
    if (typeof gtag !== 'undefined' && this.metrics.lcp) {
      gtag('event', 'performance_metrics', {
        event_category: 'performance',
        lcp: Math.round(this.metrics.lcp),
        fid: Math.round(this.metrics.fid || 0),
        cls: Math.round((this.metrics.cls || 0) * 1000),
        load_time: Math.round(this.metrics.loadTime || 0),
        memory_usage: Math.round((this.metrics.memoryUsage || 0) / 1024 / 1024),
        non_interaction: true
      });
    }

    // Send to monitoring service (implement as needed)
    this.sendToMonitoringService(this.metrics);
  }

  /**
   * Send metrics to external monitoring service
   */
  private async sendToMonitoringService(metrics: Partial<PerformanceMetrics>): Promise<void> {
    try {
      // Example implementation - replace with your monitoring service
      await fetch('/api/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp: Date.now(),
          metrics,
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      });
    } catch (error) {
      console.error('Failed to send metrics:', error);
    }
  }

  /**
   * Subscribe to metrics updates
   */
  onMetricsUpdate(listener: (metrics: Partial<PerformanceMetrics>) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Subscribe to alerts
   */
  onAlert(listener: (alert: PerformanceAlert) => void): () => void {
    this.alertListeners.add(listener);
    return () => this.alertListeners.delete(listener);
  }

  /**
   * Get current metrics
   */
  getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  /**
   * Get recent alerts
   */
  getAlerts(): PerformanceAlert[] {
    return [...this.alerts];
  }

  /**
   * Notify all listeners
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.metrics);
      } catch (error) {
        console.error('Error in metrics listener:', error);
      }
    });
  }

  /**
   * Cleanup and destroy monitor
   */
  destroy(): void {
    // Disconnect all observers
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    
    // Clear intervals
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals = [];
    
    // Clear listeners
    this.listeners.clear();
    this.alertListeners.clear();
  }
}

// Global instance
let performanceMonitor: PerformanceMonitor | null = null;

export function getPerformanceMonitor(): PerformanceMonitor {
  if (!performanceMonitor) {
    performanceMonitor = new PerformanceMonitor();
  }
  return performanceMonitor;
}

// React Hook for performance monitoring
export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState<Partial<PerformanceMetrics>>({});
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);

  useEffect(() => {
    const monitor = getPerformanceMonitor();
    
    const unsubscribeMetrics = monitor.onMetricsUpdate(setMetrics);
    const unsubscribeAlerts = monitor.onAlert((alert) => {
      setAlerts(prev => [...prev, alert].slice(-10)); // Keep last 10 alerts
    });

    // Initial data
    setMetrics(monitor.getMetrics());
    setAlerts(monitor.getAlerts().slice(-10));

    return () => {
      unsubscribeMetrics();
      unsubscribeAlerts();
    };
  }, []);

  return {
    metrics,
    alerts,
    monitor: performanceMonitor
  };
}

export default PerformanceMonitor;
