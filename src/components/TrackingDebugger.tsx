'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TrackingDebugInfo {
  googleAnalytics: {
    loaded: boolean;
    trackingId: string;
    dataLayer: any[];
    lastEvent: any;
  };
  facebookPixel: {
    loaded: boolean;
    pixelId: string;
    events: any[];
    lastEvent: any;
  };
  cookieConsent: {
    hasConsent: boolean;
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
    timestamp: string;
  };
  page: {
    url: string;
    title: string;
    referrer: string;
    userAgent: string;
    timestamp: string;
  };
  performance: {
    loadTime: number;
    domContentLoaded: number;
    navigationTiming: any;
  };
}

export const TrackingDebugger: React.FC<{ isVisible?: boolean }> = ({ 
  isVisible = false 
}) => {
  const [debugInfo, setDebugInfo] = useState<TrackingDebugInfo | null>(null);
  const [isOpen, setIsOpen] = useState(isVisible);
  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    if (isOpen) {
      collectDebugInfo();
      
      if (autoRefresh) {
        const interval = setInterval(collectDebugInfo, 5000);
        return () => clearInterval(interval);
      }
    }
  }, [isOpen, autoRefresh]);

  const collectDebugInfo = () => {
    const info: TrackingDebugInfo = {
      googleAnalytics: {
        loaded: typeof window.gtag !== 'undefined',
        trackingId: 'G-F2M0MG8B5H',
        dataLayer: (window as any).dataLayer || [],
        lastEvent: (window as any).dataLayer?.slice(-1)[0] || null
      },
      facebookPixel: {
        loaded: typeof window.fbq !== 'undefined',
        pixelId: '1460337361657286',
        events: (window as any)._fbq?.instances || [],
        lastEvent: null
      },
      cookieConsent: {
        hasConsent: !!(window as any).cookieConsent,
        necessary: (window as any).cookieConsent?.necessary || false,
        analytics: (window as any).cookieConsent?.analytics || false,
        marketing: (window as any).cookieConsent?.marketing || false,
        timestamp: (window as any).cookieConsentTimestamp || 'N/A'
      },
      page: {
        url: window.location.href,
        title: document.title,
        referrer: document.referrer || 'Direct',
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      },
      performance: {
        loadTime: 0,
        domContentLoaded: 0,
        navigationTiming: null
      }
    };

    // Get performance data
    if ('performance' in window && performance.getEntriesByType) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        info.performance = {
          loadTime: Math.round(navigation.loadEventEnd - navigation.fetchStart),
          domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart),
          navigationTiming: {
            fetchStart: navigation.fetchStart,
            domainLookupStart: navigation.domainLookupStart,
            domainLookupEnd: navigation.domainLookupEnd,
            connectStart: navigation.connectStart,
            connectEnd: navigation.connectEnd,
            requestStart: navigation.requestStart,
            responseStart: navigation.responseStart,
            responseEnd: navigation.responseEnd,
            domContentLoadedEventStart: navigation.domContentLoadedEventStart,
            domContentLoadedEventEnd: navigation.domContentLoadedEventEnd,
            loadEventStart: navigation.loadEventStart,
            loadEventEnd: navigation.loadEventEnd
          }
        };
      }
    }

    setDebugInfo(info);
  };

  const testGoogleAnalytics = () => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'debug_test', {
        event_category: 'debug',
        event_label: 'Manual Test',
        value: Math.floor(Math.random() * 100)
      });
      alert('Google Analytics test event sent! Check the dataLayer in the debugger.');
      setTimeout(collectDebugInfo, 1000);
    } else {
      alert('Google Analytics not loaded!');
    }
  };

  const testFacebookPixel = () => {
    if (typeof window.fbq !== 'undefined') {
      window.fbq('track', 'ViewContent', {
        content_type: 'debug_test',
        content_name: 'Manual Test Event',
        value: Math.floor(Math.random() * 100),
        currency: 'USD'
      });
      alert('Facebook Pixel test event sent!');
      setTimeout(collectDebugInfo, 1000);
    } else {
      alert('Facebook Pixel not loaded!');
    }
  };

  const clearCookieConsent = () => {
    localStorage.removeItem('cookieConsent');
    localStorage.removeItem('cookieConsentTimestamp');
    (window as any).cookieConsent = null;
    (window as any).cookieConsentTimestamp = null;
    alert('Cookie consent cleared! Refresh the page to see the consent banner again.');
  };

  const exportDebugData = () => {
    if (debugInfo) {
      const blob = new Blob([JSON.stringify(debugInfo, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tracking-debug-${new Date().toISOString().slice(0, 19)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // Only show in development or when explicitly enabled
  const isDevelopment = process.env.NODE_ENV === 'development';
  const shouldShow = isDevelopment || isVisible || (window as any).trackingDebugEnabled;

  if (!shouldShow) return null;

  return (
    <>
      {/* Debug Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Toggle Tracking Debugger"
      >
        🔍
      </motion.button>

      {/* Debug Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            className="fixed top-0 right-0 w-96 h-full bg-white dark:bg-gray-900 shadow-2xl z-40 overflow-y-auto border-l border-gray-200 dark:border-gray-700"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Tracking Debug
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
              
              <div className="flex gap-2 mt-2">
                <button
                  onClick={collectDebugInfo}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  Refresh
                </button>
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`px-3 py-1 rounded text-sm ${
                    autoRefresh 
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  Auto {autoRefresh ? 'ON' : 'OFF'}
                </button>
                <button
                  onClick={exportDebugData}
                  className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
                >
                  Export
                </button>
              </div>
            </div>

            {/* Debug Content */}
            <div className="p-4 space-y-4">
              {debugInfo && (
                <>
                  {/* Google Analytics */}
                  <div className="border border-gray-200 dark:border-gray-700 rounded p-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                      Google Analytics
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${
                        debugInfo.googleAnalytics.loaded 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {debugInfo.googleAnalytics.loaded ? 'Loaded' : 'Not Loaded'}
                      </span>
                    </h3>
                    <div className="text-sm space-y-1">
                      <p><strong>ID:</strong> {debugInfo.googleAnalytics.trackingId}</p>
                      <p><strong>DataLayer Events:</strong> {debugInfo.googleAnalytics.dataLayer.length}</p>
                      {debugInfo.googleAnalytics.lastEvent && (
                        <details className="mt-2">
                          <summary className="cursor-pointer text-blue-600 dark:text-blue-400">Last Event</summary>
                          <pre className="mt-1 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-x-auto">
                            {JSON.stringify(debugInfo.googleAnalytics.lastEvent, null, 2)}
                          </pre>
                        </details>
                      )}
                      <button
                        onClick={testGoogleAnalytics}
                        className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                      >
                        Test Event
                      </button>
                    </div>
                  </div>

                  {/* Facebook Pixel */}
                  <div className="border border-gray-200 dark:border-gray-700 rounded p-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                      Facebook Pixel
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${
                        debugInfo.facebookPixel.loaded 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {debugInfo.facebookPixel.loaded ? 'Loaded' : 'Not Loaded'}
                      </span>
                    </h3>
                    <div className="text-sm space-y-1">
                      <p><strong>ID:</strong> {debugInfo.facebookPixel.pixelId}</p>
                      <p><strong>Instances:</strong> {debugInfo.facebookPixel.events.length}</p>
                      <button
                        onClick={testFacebookPixel}
                        className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                      >
                        Test Event
                      </button>
                    </div>
                  </div>

                  {/* Cookie Consent */}
                  <div className="border border-gray-200 dark:border-gray-700 rounded p-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Cookie Consent</h3>
                    <div className="text-sm space-y-1">
                      <p><strong>Has Consent:</strong> {debugInfo.cookieConsent.hasConsent ? 'Yes' : 'No'}</p>
                      <p><strong>Necessary:</strong> {debugInfo.cookieConsent.necessary ? 'Yes' : 'No'}</p>
                      <p><strong>Analytics:</strong> {debugInfo.cookieConsent.analytics ? 'Yes' : 'No'}</p>
                      <p><strong>Marketing:</strong> {debugInfo.cookieConsent.marketing ? 'Yes' : 'No'}</p>
                      <p><strong>Timestamp:</strong> {debugInfo.cookieConsent.timestamp}</p>
                      <button
                        onClick={clearCookieConsent}
                        className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                      >
                        Clear Consent
                      </button>
                    </div>
                  </div>

                  {/* Page Info */}
                  <div className="border border-gray-200 dark:border-gray-700 rounded p-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Page Info</h3>
                    <div className="text-sm space-y-1">
                      <p><strong>URL:</strong> <span className="break-all">{debugInfo.page.url}</span></p>
                      <p><strong>Title:</strong> {debugInfo.page.title}</p>
                      <p><strong>Referrer:</strong> {debugInfo.page.referrer}</p>
                      <p><strong>Timestamp:</strong> {debugInfo.page.timestamp}</p>
                    </div>
                  </div>

                  {/* Performance */}
                  <div className="border border-gray-200 dark:border-gray-700 rounded p-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Performance</h3>
                    <div className="text-sm space-y-1">
                      <p><strong>Load Time:</strong> {debugInfo.performance.loadTime}ms</p>
                      <p><strong>DOM Ready:</strong> {debugInfo.performance.domContentLoaded}ms</p>
                      {debugInfo.performance.navigationTiming && (
                        <details className="mt-2">
                          <summary className="cursor-pointer text-blue-600 dark:text-blue-400">Navigation Timing</summary>
                          <pre className="mt-1 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-x-auto">
                            {JSON.stringify(debugInfo.performance.navigationTiming, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
