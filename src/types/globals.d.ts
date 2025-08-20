// Definições globais para TypeScript
declare global {
  var gtag: (...args: any[]) => void;
  var fbq: (...args: any[]) => void;
  
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    trackFBViewContent?: (params: any) => void;
    trackFBStartTrial?: (params: any) => void;
    trackFBInitiateCheckout?: (params: any) => void;
    trackGAEvent?: (event: string, category: string, label: string, value?: number) => void;
    trackFBEvent?: (event: string, params: any) => void;
    initFacebookPixel?: () => void;
    cookieConsent?: {
      marketing?: boolean;
      analytics?: boolean;
      necessary?: boolean;
    };
  }
  
  // Performance API extensions
  interface PerformanceEntry {
    processingStart?: number;
    hadRecentInput?: boolean;
    value?: number;
  }
}

export {};
