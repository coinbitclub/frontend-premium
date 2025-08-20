/**
 * Product-specific tracking configuration
 * Tracking diferenciado por plano/produto para Facebook Pixel
 */

declare var gtag: any;
declare var fbq: any;

import { 
  detectUserRegion, 
  getRecommendedPlan,
  generateTrackingParams 
} from './plan-detector';

export interface ProductConfig {
  id: string;
  name: string;
  price: number;
  currency: string;
  category: string;
  contentType: string;
  brand: string;
}

export const PRODUCTS_CONFIG: Record<string, ProductConfig> = {
  // 🇧🇷 BRASIL - Planos em Reais
  // Todos os planos fornecem os mesmos acessos, diferença apenas no comissionamento
  // Planos de assinatura são mais vantajosos para investimentos > USD 3.000 nas corretoras
  brasil_pro: {
    id: 'brasil_pro',
    name: 'Brasil PRO',
    price: 297,
    currency: 'BRL',
    category: 'trading_bot_subscription_brazil',
    contentType: 'subscription_monthly_brazil',
    brand: 'MarketBOT'
  },
  
  brasil_flex: {
    id: 'brasil_flex',
    name: 'Brasil FLEX',
    price: 150, // Recarga mínima - valor flexível
    currency: 'BRL',
    category: 'trading_bot_prepaid_brazil',
    contentType: 'prepaid_recharge_brazil',
    brand: 'MarketBOT'
  },
  
  // 🌍 GLOBAL - Planos em Dólares
  // Todos os planos fornecem os mesmos acessos, diferença apenas no comissionamento
  // Planos de assinatura são mais vantajosos para investimentos > USD 3.000 nas corretoras
  global_pro: {
    id: 'global_pro',
    name: 'Global PRO',
    price: 50,
    currency: 'USD',
    category: 'trading_bot_subscription_global',
    contentType: 'subscription_monthly_global',
    brand: 'MarketBOT'
  },
  
  global_flex: {
    id: 'global_flex',
    name: 'Global FLEX',
    price: 30, // Recarga mínima - valor flexível
    currency: 'USD',
    category: 'trading_bot_prepaid_global',
    contentType: 'prepaid_recharge_global',
    brand: 'MarketBOT'
  }
};

/**
 * Enhanced tracking functions with product-specific data
 */
export class ProductTracking {
  
  /**
   * Track product view with specific product data
   */
  static trackProductView(productId: string, additionalData?: any): void {
    const product = PRODUCTS_CONFIG[productId];
    if (!product) {
      console.warn(`Product ${productId} not found in configuration`);
      return;
    }

    // Google Analytics Enhanced Ecommerce
    if (typeof gtag !== 'undefined' && (window as any).cookieConsent?.analytics) {
      gtag('event', 'view_item', {
        currency: product.currency,
        value: product.price,
        items: [{
          item_id: product.id,
          item_name: product.name,
          item_category: product.category,
          item_brand: product.brand,
          price: product.price,
          quantity: 1
        }],
        event_category: 'ecommerce',
        event_label: product.name,
        custom_parameters: {
          product_type: product.contentType,
          plan_tier: productId,
          ...additionalData
        }
      });
    }

    // Facebook Pixel ViewContent
    if (typeof fbq !== 'undefined' && (window as any).cookieConsent?.marketing) {
      fbq('track', 'ViewContent', {
        content_type: product.contentType,
        content_ids: [product.id],
        content_name: product.name,
        content_category: product.category,
        value: product.price,
        currency: product.currency,
        num_items: 1,
        // Custom parameters for better targeting
        product_catalog_id: product.id,
        custom_data: {
          plan_type: productId,
          service_category: 'trading_bot',
          pricing_tier: this.getPricingTier(product.price),
          ...additionalData
        }
      });
    }

    console.log(`✅ Product view tracked: ${product.name} (${product.id})`);
  }

  /**
   * Track add to cart with product specifics
   */
  static trackAddToCart(productId: string, quantity: number = 1): void {
    const product = PRODUCTS_CONFIG[productId];
    if (!product) return;

    // Google Analytics
    if (typeof gtag !== 'undefined' && (window as any).cookieConsent?.analytics) {
      gtag('event', 'add_to_cart', {
        currency: product.currency,
        value: product.price * quantity,
        items: [{
          item_id: product.id,
          item_name: product.name,
          item_category: product.category,
          item_brand: product.brand,
          price: product.price,
          quantity: quantity
        }]
      });
    }

    // Facebook Pixel
    if (typeof fbq !== 'undefined' && (window as any).cookieConsent?.marketing) {
      fbq('track', 'AddToCart', {
        content_type: product.contentType,
        content_ids: [product.id],
        content_name: product.name,
        value: product.price * quantity,
        currency: product.currency,
        num_items: quantity
      });
    }

    console.log(`✅ Add to cart tracked: ${product.name} x${quantity}`);
  }

  /**
   * Track purchase with complete product data
   */
  static trackPurchase(productId: string, transactionId: string, quantity: number = 1, additionalData?: any): void {
    const product = PRODUCTS_CONFIG[productId];
    if (!product) return;

    const totalValue = product.price * quantity;

    // Google Analytics Enhanced Ecommerce
    if (typeof gtag !== 'undefined' && (window as any).cookieConsent?.analytics) {
      gtag('event', 'purchase', {
        transaction_id: transactionId,
        value: totalValue,
        currency: product.currency,
        items: [{
          item_id: product.id,
          item_name: product.name,
          item_category: product.category,
          item_brand: product.brand,
          price: product.price,
          quantity: quantity
        }],
        // Enhanced data
        affiliation: 'MarketBOT Website',
        coupon: additionalData?.coupon || '',
        shipping: additionalData?.shipping || 0,
        tax: additionalData?.tax || 0
      });
    }

    // Facebook Pixel Purchase
    if (typeof fbq !== 'undefined' && (window as any).cookieConsent?.marketing) {
      fbq('track', 'Purchase', {
        content_type: product.contentType,
        content_ids: [product.id],
        content_name: product.name,
        value: totalValue,
        currency: product.currency,
        num_items: quantity,
        // Enhanced targeting data
        order_id: transactionId,
        predicted_ltv: this.calculateLTV(product),
        custom_data: {
          plan_type: productId,
          subscription_period: additionalData?.period || 'monthly',
          user_tier: additionalData?.userTier || 'new',
          acquisition_channel: additionalData?.channel || 'website'
        }
      });
    }

    console.log(`✅ Purchase tracked: ${product.name} - Transaction: ${transactionId} - Value: ${totalValue} ${product.currency}`);
  }

  /**
   * Track subscription start (trial or paid)
   */
  static trackSubscriptionStart(productId: string, subscriptionType: 'trial' | 'paid', period: 'monthly' | 'yearly' = 'monthly'): void {
    const product = PRODUCTS_CONFIG[productId];
    if (!product) return;

    const eventName = subscriptionType === 'trial' ? 'start_trial' : 'subscribe';
    const fbEventName = subscriptionType === 'trial' ? 'StartTrial' : 'Subscribe';

    // Google Analytics
    if (typeof gtag !== 'undefined' && (window as any).cookieConsent?.analytics) {
      gtag('event', eventName, {
        currency: product.currency,
        value: subscriptionType === 'trial' ? 0 : product.price,
        items: [{
          item_id: product.id,
          item_name: product.name,
          item_category: product.category,
          quantity: 1
        }],
        subscription_type: subscriptionType,
        subscription_period: period,
        plan_tier: productId
      });
    }

    // Facebook Pixel
    if (typeof fbq !== 'undefined' && (window as any).cookieConsent?.marketing) {
      fbq('track', fbEventName, {
        content_type: product.contentType,
        content_ids: [product.id],
        content_name: product.name,
        value: subscriptionType === 'trial' ? 0 : product.price,
        currency: product.currency,
        predicted_ltv: this.calculateLTV(product, period),
        custom_data: {
          subscription_type: subscriptionType,
          billing_period: period,
          plan_tier: productId,
          trial_period: subscriptionType === 'trial' ? '7_days' : null
        }
      });
    }

    console.log(`✅ ${subscriptionType} subscription tracked: ${product.name} (${period})`);
  }

  /**
   * Track lead generation with product context
   */
  static trackLead(productId: string, leadType: 'signup' | 'contact' | 'demo_request' | 'download', leadValue?: number): void {
    const product = PRODUCTS_CONFIG[productId];
    if (!product) return;

    // Google Analytics
    if (typeof gtag !== 'undefined' && (window as any).cookieConsent?.analytics) {
      gtag('event', 'generate_lead', {
        currency: product.currency,
        value: leadValue || product.price * 0.1, // 10% of product value as lead value
        lead_type: leadType,
        product_interest: product.name,
        event_category: 'lead_generation',
        event_label: `${leadType}_${productId}`
      });
    }

    // Facebook Pixel
    if (typeof fbq !== 'undefined' && (window as any).cookieConsent?.marketing) {
      fbq('track', 'Lead', {
        content_type: product.contentType,
        content_name: product.name,
        content_category: product.category,
        value: leadValue || product.price * 0.1,
        currency: product.currency,
        custom_data: {
          lead_type: leadType,
          product_interest: productId,
          lead_quality: this.getLeadQuality(leadType),
          funnel_stage: this.getFunnelStage(leadType)
        }
      });
    }

    console.log(`✅ Lead tracked: ${leadType} for ${product.name}`);
  }

  /**
   * Helper methods
   */
  private static getPricingTier(price: number): string {
    if (price < 50) return 'basic';
    if (price < 150) return 'premium';
    return 'enterprise';
  }

  private static calculateLTV(product: ProductConfig, period: 'monthly' | 'yearly' = 'monthly'): number {
    // Estimate Lifetime Value based on product and period
    const baseMultiplier = period === 'yearly' ? 1 : 12;
    const retentionMultiplier = product.price > 100 ? 2.5 : 1.8; // Higher retention for premium plans
    
    return Math.round(product.price * baseMultiplier * retentionMultiplier);
  }

  private static getLeadQuality(leadType: string): string {
    const qualityMap: Record<string, string> = {
      'demo_request': 'high',
      'contact': 'medium',
      'signup': 'medium',
      'download': 'low'
    };
    return qualityMap[leadType] || 'medium';
  }

  private static getFunnelStage(leadType: string): string {
    const stageMap: Record<string, string> = {
      'download': 'awareness',
      'signup': 'interest',
      'contact': 'consideration',
      'demo_request': 'intent'
    };
    return stageMap[leadType] || 'awareness';
  }
}

// Convenience functions for easy use
export const trackProductView = ProductTracking.trackProductView.bind(ProductTracking);
export const trackAddToCart = ProductTracking.trackAddToCart.bind(ProductTracking);
export const trackPurchase = ProductTracking.trackPurchase.bind(ProductTracking);
export const trackSubscriptionStart = ProductTracking.trackSubscriptionStart.bind(ProductTracking);
export const trackLead = ProductTracking.trackLead.bind(ProductTracking);

// Re-export plan detection functions for convenience
export { 
  detectUserRegion as detectRegion,
  getRecommendedPlan,
  generateTrackingParams
} from './plan-detector';

export default ProductTracking;
