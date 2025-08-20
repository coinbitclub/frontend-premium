'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useTracking } from '../hooks/useTracking';
import Script from 'next/script';

interface PageTrackerProps {
  pageTitle?: string;
  pageCategory?: string;
  customParams?: Record<string, any>;
}

export const PageTracker: React.FC<PageTrackerProps> = ({
  pageTitle,
  pageCategory,
  customParams = {}
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { trackPageView } = useTracking();

  useEffect(() => {
    const fullUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const title = pageTitle || document.title;
    
    // Track page view with additional context
    trackPageView(title, {
      page_path: pathname,
      page_location: window.location.href,
      page_category: pageCategory || getPageCategory(pathname),
      ...customParams,
      // UTM parameters if present
      utm_source: searchParams.get('utm_source'),
      utm_medium: searchParams.get('utm_medium'),
      utm_campaign: searchParams.get('utm_campaign'),
      utm_content: searchParams.get('utm_content'),
      utm_term: searchParams.get('utm_term'),
      // Referrer information
      referrer: document.referrer || 'direct',
      // User agent information
      user_agent: navigator.userAgent,
      // Screen information
      screen_resolution: `${screen.width}x${screen.height}`,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`,
    });

    // Special tracking for important pages
    if (pathname === '/pricing' || pathname === '/plans') {
      trackPricingPageView();
    } else if (pathname === '/register') {
      trackRegistrationPageView();
    } else if (pathname.startsWith('/checkout') || pathname.includes('payment')) {
      trackCheckoutPageView();
    }

  }, [pathname, searchParams, trackPageView, pageTitle, pageCategory, customParams]);

  const getPageCategory = (path: string): string => {
    if (path === '/') return 'home';
    if (path.startsWith('/dashboard')) return 'app_dashboard';
    if (path.startsWith('/trading')) return 'app_trading';
    if (path.startsWith('/analytics')) return 'app_analytics';
    if (path.startsWith('/pricing') || path.startsWith('/plans')) return 'conversion';
    if (path.startsWith('/auth') || path === '/login' || path === '/register') return 'authentication';
    if (path.startsWith('/blog')) return 'content';
    if (path === '/contact' || path === '/help') return 'support';
    if (path === '/about') return 'company';
    return 'other';
  };

  const trackPricingPageView = () => {
    // Enhanced tracking for pricing page
    if (typeof window.trackFBViewContent === 'function') {
      window.trackFBViewContent({
        content_type: 'product',
        content_name: 'Pricing Page',
        content_category: 'subscription_plans'
      });
    }
  };

  const trackRegistrationPageView = () => {
    // Track registration page view
    if (typeof window.trackFBViewContent === 'function') {
      window.trackFBViewContent({
        content_type: 'signup_form',
        content_name: 'Registration Page',
        content_category: 'user_acquisition'
      });
    }
  };

  const trackCheckoutPageView = () => {
    // Track checkout/payment page
    if (typeof window.trackFBViewContent === 'function') {
      window.trackFBViewContent({
        content_type: 'checkout',
        content_name: 'Checkout Page',
        content_category: 'ecommerce'
      });
    }
  };

  return null; // This component doesn't render anything
};

// Enhanced Facebook Pixel component for specific pages
export const FacebookPixelEnhanced: React.FC<{
  pageType: 'home' | 'pricing' | 'checkout' | 'registration' | 'dashboard' | 'other';
}> = ({ pageType }) => {
  
  const getPixelEvents = () => {
    switch (pageType) {
      case 'home':
        return `
          // Home page specific tracking
          if (typeof fbq !== 'undefined' && window.cookieConsent?.marketing) {
            fbq('track', 'ViewContent', {
              content_type: 'landing_page',
              content_name: 'Home Page',
              content_category: 'website'
            });
          }
        `;
      
      case 'pricing':
        return `
          // Pricing page specific tracking
          if (typeof fbq !== 'undefined' && window.cookieConsent?.marketing) {
            fbq('track', 'ViewContent', {
              content_type: 'product',
              content_name: 'Pricing Page',
              content_category: 'subscription_plans',
              value: 99,
              currency: 'USD'
            });
          }
        `;
      
      case 'checkout':
        return `
          // Checkout page tracking
          if (typeof fbq !== 'undefined' && window.cookieConsent?.marketing) {
            fbq('track', 'InitiateCheckout', {
              content_type: 'product',
              content_name: 'Premium Plan',
              value: 99,
              currency: 'USD',
              num_items: 1
            });
          }
        `;
      
      case 'registration':
        return `
          // Registration page tracking
          if (typeof fbq !== 'undefined' && window.cookieConsent?.marketing) {
            fbq('track', 'ViewContent', {
              content_type: 'signup_form',
              content_name: 'Registration Form',
              content_category: 'user_acquisition'
            });
          }
        `;
      
      case 'dashboard':
        return `
          // Dashboard page tracking (for logged in users)
          if (typeof fbq !== 'undefined' && window.cookieConsent?.marketing) {
            fbq('track', 'ViewContent', {
              content_type: 'dashboard',
              content_name: 'User Dashboard',
              content_category: 'app_usage'
            });
          }
        `;
      
      default:
        return '';
    }
  };

  return (
    <Script id={`facebook-pixel-${pageType}`} strategy="afterInteractive">
      {`
        // Wait for consent and pixel initialization
        document.addEventListener('DOMContentLoaded', function() {
          setTimeout(function() {
            ${getPixelEvents()}
          }, 1000);
        });
      `}
    </Script>
  );
};

// Performance tracking component
export const PerformanceTracker: React.FC = () => {
  useEffect(() => {
    // Track Core Web Vitals
    const trackWebVitals = () => {
      if ('PerformanceObserver' in window) {
        // Largest Contentful Paint
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (typeof gtag !== 'undefined') {
              gtag('event', 'web_vitals', {
                event_category: 'performance',
                event_label: 'LCP',
                value: Math.round(entry.startTime),
                non_interaction: true
              });
            }
          }
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (typeof gtag !== 'undefined') {
              gtag('event', 'web_vitals', {
                event_category: 'performance',
                event_label: 'FID',
                value: Math.round((entry.processingStart || 0) - entry.startTime),
                non_interaction: true
              });
            }
          }
        }).observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift
        new PerformanceObserver((list) => {
          let clsValue = 0;
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value || 0;
            }
          }
          if (clsValue > 0 && typeof gtag !== 'undefined') {
            gtag('event', 'web_vitals', {
              event_category: 'performance',
              event_label: 'CLS',
              value: Math.round(clsValue * 1000),
              non_interaction: true
            });
          }
        }).observe({ entryTypes: ['layout-shift'] });
      }

      // Track page load time
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          if (navigation && typeof gtag !== 'undefined') {
            gtag('event', 'page_load_time', {
              event_category: 'performance',
              value: Math.round(navigation.loadEventEnd - navigation.fetchStart),
              non_interaction: true
            });
          }
        }, 0);
      });
    };

    trackWebVitals();
  }, []);

  return null;
};

// Error tracking component
export const ErrorTracker: React.FC = () => {
  useEffect(() => {
    // Track JavaScript errors
    window.addEventListener('error', (event) => {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'exception', {
          description: event.error?.message || event.message,
          fatal: false,
          event_category: 'javascript_error'
        });
      }
    });

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'exception', {
          description: event.reason?.message || 'Unhandled Promise Rejection',
          fatal: false,
          event_category: 'promise_rejection'
        });
      }
    });

    // Track console errors (optional - for debugging)
    const originalError = console.error;
    console.error = (...args) => {
      if (typeof gtag !== 'undefined' && args.length > 0) {
        gtag('event', 'console_error', {
          event_category: 'debugging',
          event_label: String(args[0]),
          non_interaction: true
        });
      }
      originalError.apply(console, args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  return null;
};
