import { generatePageMetadata, SEOConfig } from './seo-config';
import type { Metadata } from 'next';

// Home page metadata
export const homeMetadata: Metadata = generatePageMetadata({
  title: 'MARKETBOT: Robô de Trade Automático que só Lucra se Você Lucrar',
  description: 'Maximize seus lucros em DÓLAR com trading 100% automático. Comissão apenas sobre resultados positivos. Margem de acerto superior a 90%. Teste grátis!',
  keywords: ['trading automatizado', 'lucros em dólar', 'robot trading', 'crypto bot', 'bybit', 'binance', 'ia trading', 'marketbot', 'coinbitclub'],
  canonical: '/',
  ogImage: '/images/og-home.jpg',
  schemaType: 'WebPage'
});

// Dashboard metadata
export const dashboardMetadata: Metadata = generatePageMetadata({
  title: 'Dashboard',
  description: 'Dashboard completo de trading com métricas em tempo real, análise de performance e controle total do seu portfólio de criptomoedas.',
  keywords: ['dashboard trading', 'métricas crypto', 'portfolio management', 'trading analytics'],
  canonical: '/dashboard',
  ogImage: '/images/og-dashboard.jpg'
});

// Trading page metadata
export const tradingMetadata: Metadata = generatePageMetadata({
  title: 'Trading & Sinais',
  description: 'Interface avançada de trading com sinais em tempo real, análise técnica automatizada e execução de ordens inteligente.',
  keywords: ['sinais trading', 'trading signals', 'análise técnica', 'crypto trading', 'automated orders'],
  canonical: '/trading',
  ogImage: '/images/og-trading.jpg'
});

// Analytics metadata
export const analyticsMetadata: Metadata = generatePageMetadata({
  title: 'Analytics & Relatórios',
  description: 'Análises detalhadas de performance, relatórios customizáveis e insights avançados para otimizar suas estratégias de trading.',
  keywords: ['analytics trading', 'relatórios crypto', 'performance analysis', 'trading insights'],
  canonical: '/analytics',
  ogImage: '/images/og-analytics.jpg'
});

// Pricing metadata
export const pricingMetadata: Metadata = generatePageMetadata({
  title: 'Planos e Preços',
  description: 'Escolha o plano perfeito para seu nível de trading. Desde iniciante até profissional, temos a solução ideal para você.',
  keywords: ['preços trading bot', 'planos coinbitclub', 'assinatura crypto', 'preço premium trading'],
  canonical: '/pricing',
  ogImage: '/images/og-pricing.jpg',
  schemaType: 'Product'
});

// Plans metadata (for checkout/payment pages)
export const plansMetadata: Metadata = generatePageMetadata({
  title: 'Escolha seu Plano',
  description: 'Compare nossos planos e escolha a melhor opção para suas necessidades de trading. Trial gratuito disponível.',
  keywords: ['planos trading', 'comparar preços', 'escolher plano', 'trial gratuito'],
  canonical: '/plans',
  ogImage: '/images/og-plans.jpg',
  schemaType: 'Service'
});

// About metadata
export const aboutMetadata: Metadata = generatePageMetadata({
  title: 'Sobre a CoinBitClub',
  description: 'Conheça nossa história, missão e a equipe por trás da plataforma de trading mais avançada do mercado de criptomoedas.',
  keywords: ['sobre coinbitclub', 'equipe trading', 'história empresa', 'missão'],
  canonical: '/about',
  ogImage: '/images/og-about.jpg'
});

// Contact metadata
export const contactMetadata: Metadata = generatePageMetadata({
  title: 'Contato',
  description: 'Entre em contato conosco. Suporte técnico 24/7, vendas e parcerias. Estamos aqui para ajudar você.',
  keywords: ['contato coinbitclub', 'suporte trading', 'ajuda', 'vendas'],
  canonical: '/contact',
  ogImage: '/images/og-contact.jpg'
});

// Help/FAQ metadata
export const helpMetadata: Metadata = generatePageMetadata({
  title: 'Central de Ajuda',
  description: 'Encontre respostas para suas dúvidas sobre trading automatizado, configuração de bots e uso da plataforma.',
  keywords: ['ajuda trading', 'faq coinbitclub', 'tutorial bot', 'suporte'],
  canonical: '/help',
  ogImage: '/images/og-help.jpg'
});

// Blog metadata
export const blogMetadata: Metadata = generatePageMetadata({
  title: 'Blog - Insights de Trading',
  description: 'Artigos, análises de mercado e dicas de especialistas para melhorar suas estratégias de trading de criptomoedas.',
  keywords: ['blog trading', 'análises crypto', 'dicas bitcoin', 'mercado criptomoedas'],
  canonical: '/blog',
  ogImage: '/images/og-blog.jpg'
});

// Auth pages metadata
export const loginMetadata: Metadata = generatePageMetadata({
  title: 'Login',
  description: 'Faça login na sua conta CoinBitClub e acesse sua plataforma de trading premium.',
  canonical: '/login',
  noindex: true
});

export const registerMetadata: Metadata = generatePageMetadata({
  title: 'Cadastro',
  description: 'Crie sua conta na CoinBitClub e comece seu trial gratuito da plataforma de trading mais avançada.',
  canonical: '/register',
  ogImage: '/images/og-register.jpg'
});

// Legal pages metadata
export const privacyMetadata: Metadata = generatePageMetadata({
  title: 'Política de Privacidade',
  description: 'Política de privacidade da CoinBitClub. Saiba como protegemos seus dados e respeitamos sua privacidade.',
  canonical: '/privacy',
  noindex: true
});

export const termsMetadata: Metadata = generatePageMetadata({
  title: 'Termos de Uso',
  description: 'Termos de uso e condições de serviço da plataforma CoinBitClub MarketBot.',
  canonical: '/terms',
  noindex: true
});

// Function to get structured data for specific pages
export const getPageStructuredData = (pageType: string, data?: any) => {
  switch (pageType) {
    case 'home':
      return {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'CoinBitClub MarketBot',
        description: 'Plataforma premium de trading automatizado de criptomoedas',
        url: 'https://coinbitclub.com',
        mainEntity: {
          '@type': 'SoftwareApplication',
          name: 'CoinBitClub MarketBot',
          applicationCategory: 'FinanceApplication',
          operatingSystem: 'Web Browser',
          offers: {
            '@type': 'Offer',
            price: '50.00',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock'
          }
        }
      };

    case 'pricing':
      return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: 'CoinBitClub Premium Plan',
        description: 'Plano premium de trading automatizado',
        brand: {
          '@type': 'Brand',
          name: 'CoinBitClub'
        },
        offers: data?.plans?.map((plan: any) => ({
          '@type': 'Offer',
          name: plan.name,
          price: plan.price,
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: `https://coinbitclub.com/plans/${plan.id}`
        })) || []
      };

    case 'article':
      return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: data?.title,
        description: data?.description,
        author: {
          '@type': 'Organization',
          name: 'CoinBitClub'
        },
        publisher: {
          '@type': 'Organization',
          name: 'CoinBitClub',
          logo: {
            '@type': 'ImageObject',
            url: 'https://coinbitclub.com/images/logo.png'
          }
        },
        datePublished: data?.publishedAt,
        dateModified: data?.updatedAt,
        mainEntityOfPage: data?.url
      };

    default:
      return SEOConfig.getWebsiteSchema();
  }
};

// Function to generate breadcrumb structured data
export const getBreadcrumbData = (items: Array<{name: string, url: string}>) => {
  return SEOConfig.getBreadcrumbSchema(items);
};

// Organized page metadata structure
export const PageMetadata = {
  home: {
    metadata: homeMetadata
  },
  dashboard: {
    metadata: dashboardMetadata
  },
  trading: {
    metadata: tradingMetadata
  },
  analytics: {
    metadata: analyticsMetadata
  },
  pricing: {
    metadata: pricingMetadata
  },
  plans: {
    metadata: plansMetadata
  },
  about: {
    metadata: aboutMetadata
  },
  contact: {
    metadata: contactMetadata
  },
  help: {
    metadata: helpMetadata
  },
  blog: {
    metadata: blogMetadata
  },
  login: {
    metadata: loginMetadata
  },
  register: {
    metadata: registerMetadata
  },
  privacy: {
    metadata: privacyMetadata
  },
  terms: {
    metadata: termsMetadata
  }
};
