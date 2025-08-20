'use client';

import { useCallback } from 'react';

// Facebook Pixel Events Interface
interface FacebookEventParams {
  currency?: string;
  value?: number;
  content_type?: string;
  content_name?: string;
  content_ids?: string[];
  num_items?: number;
  predicted_ltv?: number;
  registration_method?: string;
  plan?: string;
  country?: string;
  coupon?: string;
  affiliate_id?: string;
  content_category?: string;
}

// Google Analytics Events Interface
interface GAEventParams {
  event_category?: string;
  event_label?: string;
  value?: number;
  currency?: string;
  transaction_id?: string;
  items?: Array<{
    item_id: string;
    item_name: string;
    category: string;
    quantity?: number;
    price?: number;
  }>;
  [key: string]: any;
}

export const useTracking = () => {
  // Google Analytics tracking
  const trackGA = useCallback((eventName: string, parameters: GAEventParams = {}) => {
    if (typeof gtag !== 'undefined' && window.cookieConsent?.analytics) {
      gtag('event', eventName, {
        event_category: parameters.event_category || 'engagement',
        event_label: parameters.event_label,
        value: parameters.value,
        currency: parameters.currency || 'USD',
        ...parameters
      });
      
      console.log('GA Event tracked:', eventName, parameters);
    }
  }, []);

  // Facebook Pixel tracking
  const trackFB = useCallback((eventName: string, parameters: FacebookEventParams = {}) => {
    if (typeof window.trackFBEvent === 'function') {
      window.trackFBEvent(eventName, parameters);
    }
  }, []);

  // Combined tracking for important events
  const track = useCallback((eventName: string, gaParams: GAEventParams = {}, fbParams: FacebookEventParams = {}) => {
    trackGA(eventName, gaParams);
    trackFB(eventName, fbParams);
  }, [trackGA, trackFB]);

  // Specific event tracking functions
  const trackPageView = useCallback((pageName: string, additionalParams: any = {}) => {
    trackGA('page_view', {
      page_title: pageName,
      page_location: window.location.href,
      ...additionalParams
    });
    
    trackFB('PageView', {
      content_name: pageName,
      ...additionalParams
    });
  }, [trackGA, trackFB]);

  const trackSignUp = useCallback((method: string = 'email', plan?: string) => {
    const commonParams = {
      method,
      plan: plan || 'free',
      timestamp: new Date().toISOString()
    };

    trackGA('sign_up', {
      method,
      event_category: 'conversion',
      event_label: plan || 'free_tier'
    });

    trackFB('CompleteRegistration', {
      registration_method: method,
      content_name: plan || 'Free Registration',
      value: plan === 'premium' ? 99 : 0,
      currency: 'USD'
    });
  }, [trackGA, trackFB]);

  const trackLogin = useCallback((method: string = 'email') => {
    trackGA('login', {
      method,
      event_category: 'engagement'
    });
    
    // Don't track login in FB Pixel for privacy
  }, [trackGA]);

  const trackStartTrial = useCallback((plan: string, value: number = 0) => {
    trackGA('begin_trial', {
      event_category: 'conversion',
      event_label: plan,
      value,
      currency: 'USD'
    });

    trackFB('StartTrial', {
      content_name: `${plan} Trial`,
      value,
      currency: 'USD',
      predicted_ltv: value * 12 // Annual value
    });
  }, [trackGA, trackFB]);

  const trackSubscription = useCallback((plan: string, value: number, currency: string = 'USD') => {
    const transactionId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    trackGA('subscribe', {
      event_category: 'conversion',
      transaction_id: transactionId,
      value,
      currency,
      items: [{
        item_id: plan.toLowerCase().replace(' ', '_'),
        item_name: plan,
        category: 'subscription',
        quantity: 1,
        price: value
      }]
    });

    trackFB('Subscribe', {
      content_name: plan,
      value,
      currency,
      predicted_ltv: value * 12
    });
  }, [trackGA, trackFB]);

  const trackPurchase = useCallback((
    plan: string, 
    value: number, 
    currency: string = 'USD',
    transactionId?: string,
    coupon?: string,
    affiliateId?: string
  ) => {
    const txId = transactionId || `purchase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    trackGA('purchase', {
      event_category: 'ecommerce',
      transaction_id: txId,
      value,
      currency,
      coupon,
      items: [{
        item_id: plan.toLowerCase().replace(' ', '_'),
        item_name: plan,
        category: 'subscription',
        quantity: 1,
        price: value
      }]
    });

    trackFB('Purchase', {
      content_name: plan,
      value,
      currency,
      num_items: 1,
      content_type: 'product',
      coupon,
      affiliate_id: affiliateId
    });
  }, [trackGA, trackFB]);

  const trackAddPaymentInfo = useCallback((value: number = 0, currency: string = 'USD') => {
    trackGA('add_payment_info', {
      event_category: 'conversion',
      value,
      currency
    });

    trackFB('AddPaymentInfo', {
      value,
      currency,
      content_category: 'subscription'
    });
  }, [trackGA, trackFB]);

  const trackContact = useCallback((method: string = 'form') => {
    trackGA('contact', {
      event_category: 'engagement',
      event_label: method
    });

    trackFB('Contact', {
      content_name: 'Contact Form',
      content_category: 'support'
    });
  }, [trackGA, trackFB]);

  const trackViewContent = useCallback((contentName: string, contentType: string = 'page') => {
    trackGA('view_item', {
      event_category: 'engagement',
      event_label: contentName,
      content_type: contentType
    });

    trackFB('ViewContent', {
      content_name: contentName,
      content_type: contentType,
      content_category: 'trading_platform'
    });
  }, [trackGA, trackFB]);

  const trackInitiateCheckout = useCallback((
    plan: string, 
    value: number, 
    currency: string = 'USD'
  ) => {
    trackGA('begin_checkout', {
      event_category: 'ecommerce',
      value,
      currency,
      items: [{
        item_id: plan.toLowerCase().replace(' ', '_'),
        item_name: plan,
        category: 'subscription',
        quantity: 1,
        price: value
      }]
    });

    trackFB('InitiateCheckout', {
      content_name: plan,
      value,
      currency,
      num_items: 1
    });
  }, [trackGA, trackFB]);

  const trackSearch = useCallback((searchTerm: string, resultCount?: number) => {
    trackGA('search', {
      search_term: searchTerm,
      event_category: 'engagement',
      value: resultCount
    });
    
    // Don't track searches in FB Pixel for privacy
  }, [trackGA]);

  const trackShare = useCallback((contentName: string, method: string) => {
    trackGA('share', {
      content_type: 'page',
      item_id: contentName,
      method,
      event_category: 'engagement'
    });
    
    // Don't track shares in FB Pixel for privacy
  }, [trackGA]);

  const trackFileDownload = useCallback((fileName: string, fileType: string) => {
    trackGA('file_download', {
      file_name: fileName,
      file_extension: fileType,
      event_category: 'engagement'
    });
  }, [trackGA]);

  const trackVideoPlay = useCallback((videoName: string, videoDuration?: number) => {
    trackGA('video_start', {
      video_title: videoName,
      video_duration: videoDuration,
      event_category: 'engagement'
    });
  }, [trackGA]);

  const trackExternalLink = useCallback((url: string, linkText: string) => {
    trackGA('click', {
      link_url: url,
      link_text: linkText,
      event_category: 'outbound_link'
    });
  }, [trackGA]);

  return {
    // Core tracking
    track,
    trackGA,
    trackFB,
    
    // Page tracking
    trackPageView,
    
    // User actions
    trackSignUp,
    trackLogin,
    trackContact,
    trackSearch,
    trackShare,
    
    // E-commerce
    trackStartTrial,
    trackSubscription,
    trackPurchase,
    trackAddPaymentInfo,
    trackInitiateCheckout,
    
    // Content
    trackViewContent,
    trackFileDownload,
    trackVideoPlay,
    trackExternalLink,
  };
};

// Utility function to track page views automatically
export const usePageTracking = () => {
  const { trackPageView } = useTracking();
  
  const trackPage = useCallback((pageName?: string) => {
    const name = pageName || document.title;
    trackPageView(name);
  }, [trackPageView]);
  
  return { trackPage };
};
