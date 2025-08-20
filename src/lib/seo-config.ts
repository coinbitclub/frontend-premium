import type { Metadata } from 'next';

export interface SEOPageConfig {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  noindex?: boolean;
  ogImage?: string;
  schemaType?: 'WebPage' | 'Product' | 'Service' | 'Organization';
}

export class SEOConfig {
  private static baseUrl = 'https://coinbitclub.com';
  private static siteName = 'MarketBOT - a IA de trade automático que só lucra se você lucrar!';
  private static defaultImage = '/images/og-default.jpg';

  static getMetadata(config?: SEOPageConfig): Metadata {
    const title = config?.title 
      ? `${config.title} | ${this.siteName}`
      : 'MarketBOT - a IA de trade automático que só lucra se você lucrar!';
    
    const description = config?.description || 
      'MarketBOT é a única IA de trading que só ganha se você ganhar! Sistema automatizado premium com análise em tempo real para criptomoedas.';

    const keywords = [
      'marketbot',
      'ia trading',
      'trading automático',
      'bot criptomoedas',
      'bitcoin',
      'cryptocurrency',
      'binance',
      'bybit',
      'automated trading',
      'coinbitclub',
      'crypto signals',
      'trading bot',
      'portfolio management',
      'lucro garantido',
      'ia artificial',
      ...(config?.keywords || [])
    ];

    const canonical = config?.canonical || this.baseUrl;
    const ogImage = config?.ogImage || this.defaultImage;

    return {
      title,
      description,
      keywords,
      authors: [{ name: 'CoinBitClub' }],
      creator: 'CoinBitClub',
      publisher: 'CoinBitClub',
      generator: 'Next.js',
      applicationName: this.siteName,
      referrer: 'origin-when-cross-origin',
      formatDetection: {
        email: false,
        address: false,
        telephone: false,
      },
      category: 'technology',
      classification: 'Trading Platform',
      icons: {
        icon: [
          { url: '/favicon.ico', sizes: 'any' },
          { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
          { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        ],
        shortcut: '/favicon.ico',
        apple: [
          { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
        ],
        other: [
          { rel: 'android-chrome-192x192', url: '/icons/android-chrome-192x192.png' },
          { rel: 'android-chrome-512x512', url: '/icons/android-chrome-512x512.png' },
        ],
      },
      manifest: '/manifest.json',
      openGraph: {
        type: 'website',
        locale: 'pt_BR',
        alternateLocale: ['en_US'],
        url: canonical,
        title,
        description,
        siteName: this.siteName,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: title,
            type: 'image/jpeg',
          },
          {
            url: '/images/og-square.jpg',
            width: 800,
            height: 800,
            alt: title,
            type: 'image/jpeg',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        site: '@coinbitclub',
        creator: '@coinbitclub',
        title,
        description,
        images: [ogImage],
      },
      facebook: {
        appId: 'your-facebook-app-id',
      },
      robots: {
        index: !config?.noindex,
        follow: true,
        nocache: false,
        googleBot: {
          index: !config?.noindex,
          follow: true,
          noimageindex: false,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      alternates: {
        canonical,
        languages: {
          'pt-BR': `${canonical}`,
          'en-US': `${canonical}/en`,
        },
      },
      verification: {
        google: 'your-google-verification-code',
        yandex: 'your-yandex-verification-code',
        yahoo: 'your-yahoo-verification-code',
        other: {
          'msvalidate.01': 'your-bing-verification-code',
          'facebook-domain-verification': 'your-facebook-verification-code',
        },
      },
    };
  }

  static getOrganizationSchema() {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'CoinBitClub',
      legalName: 'CoinBitClub Trading Platform',
      url: this.baseUrl,
      logo: `${this.baseUrl}/images/logo.png`,
      foundingDate: '2020',
      founders: [
        {
          '@type': 'Person',
          name: 'CoinBitClub Team',
        },
      ],
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: '+55-21-99596-6652',
          contactType: 'customer service',
          email: 'faleconosco@coinbitclub.vip',
          availableLanguage: ['Portuguese', 'English'],
        },
      ],
      sameAs: [
        'https://www.facebook.com/coinbitclub',
        'https://www.twitter.com/coinbitclub',
        'https://www.linkedin.com/company/coinbitclub',
        'https://www.instagram.com/coinbitclub',
      ],
      description: 'MarketBOT - a única IA de trading que só ganha se você ganhar! Plataforma premium de trading automatizado de criptomoedas.',
    };
  }

  static getWebsiteSchema() {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: this.siteName,
      url: this.baseUrl,
      description: 'MarketBOT - a única IA de trading que só ganha se você ganhar! Sistema automatizado premium com análise em tempo real.',
      publisher: {
        '@type': 'Organization',
        name: 'CoinBitClub',
        logo: {
          '@type': 'ImageObject',
          url: `${this.baseUrl}/images/logo.png`,
        },
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${this.baseUrl}/search?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    };
  }

  static getSoftwareApplicationSchema(config?: any) {
    return {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'MarketBOT - IA de Trading Automático',
      operatingSystem: 'Web Browser',
      applicationCategory: 'FinanceApplication',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        ratingCount: '2847',
      },
      offers: {
        '@type': 'Offer',
        price: config?.price || '50.00',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        validFrom: '2024-01-01',
      },
      description: 'MarketBOT - a única IA de trading que só ganha se você ganhar! Plataforma premium com sinais em tempo real e análise automatizada.',
      featureList: [
        'IA de trading automático',
        'Só lucra se você lucrar',
        'Sinais em tempo real',
        'Análise técnica avançada',
        'Gestão de risco inteligente',
        'Suporte multi-exchange',
        'Dashboard analytics premium',
        'WhatsApp integrado',
      ],
      screenshot: `${this.baseUrl}/images/app-screenshot.jpg`,
      softwareVersion: '3.0',
      datePublished: '2024-01-01',
      dateModified: new Date().toISOString().split('T')[0],
    };
  }

  static getProductSchema(config: any) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: config.name,
      description: config.description,
      brand: {
        '@type': 'Brand',
        name: 'CoinBitClub',
      },
      offers: {
        '@type': 'Offer',
        url: `${this.baseUrl}${config.url}`,
        priceCurrency: config.currency || 'USD',
        price: config.price,
        availability: 'https://schema.org/InStock',
        validFrom: config.validFrom || '2024-01-01',
        priceValidUntil: config.priceValidUntil || '2024-12-31',
        seller: {
          '@type': 'Organization',
          name: 'CoinBitClub',
        },
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: config.rating || '4.8',
        ratingCount: config.ratingCount || '1247',
      },
    };
  }

  static getBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: `${this.baseUrl}${item.url}`,
      })),
    };
  }
}

// Utility function to generate page-specific metadata
export function generatePageMetadata(config: SEOPageConfig): Metadata {
  return SEOConfig.getMetadata(config);
}

// Utility function to inject structured data
export function injectStructuredData(schema: object): string {
  return JSON.stringify(schema);
}
