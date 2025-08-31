// Schema.org structured data utilities
export const generateOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "CoinBitClub",
  "url": "https://coinbitclub.com",
  "logo": "https://coinbitclub.com/logo-nova.jpg",
  "description": "Plataforma de trading automatizado de criptomoedas com IA",
  "sameAs": [
    "https://instagram.com/coinbitclub"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+55-21-99959-6652",
    "contactType": "customer service",
    "availableLanguage": ["Portuguese", "English"]
  }
});

export const generateSoftwareApplicationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "CoinBitClub MarketBot",
  "description": "Robô de trading automatizado que só lucra se você lucrar",
  "url": "https://coinbitclub.com",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "USD",
    "price": "30",
    "priceValidUntil": "2025-12-31",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "1247",
    "bestRating": "5",
    "worstRating": "1"
  },
  "publisher": {
    "@type": "Organization",
    "name": "CoinBitClub",
    "url": "https://coinbitclub.com"
  },
  "featureList": [
    "Trading automatizado 24/7",
    "Compatível com Binance e Bybit",
    "Inteligência Artificial",
    "Stop-loss automático",
    "Teste grátis 7 dias"
  ]
});

export const generateWebSiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "CoinBitClub MarketBot",
  "url": "https://coinbitclub.com",
  "description": "Plataforma de trading automatizado de criptomoedas com IA",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://coinbitclub.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  },
  "sameAs": [
    "https://instagram.com/coinbitclub"
  ]
});

export const generateBreadcrumbSchema = (items: Array<{name: string, url: string}>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

export const generateFAQSchema = (faqs: Array<{question: string, answer: string}>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});
