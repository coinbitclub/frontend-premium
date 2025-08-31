import React from 'react';
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        {/* DNS Prefetch para recursos externos */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="dns-prefetch" href="//pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        
        {/* Preconnect para recursos críticos */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Meta tags básicas de SEO */}
        <meta charSet="utf-8" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#1e293b" />
        <meta name="msapplication-TileColor" content="#1e293b" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="CoinBitClub MarketBot" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@coinbitclub" />
        <meta name="twitter:creator" content="@coinbitclub" />
        
        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "CoinBitClub MarketBot - IA de trading automatizado que só ganha se você ganhar",
              "description": "Ganhe em dólar no piloto automático 24/7. Comissão apenas sobre lucros reais. Teste grátis 7 dias!",
              "url": "https://coinbitclub-market-bot.vercel.app/home",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "priceCurrency": "USD",
                "price": "30"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "1247"
              },
              "publisher": {
                "@type": "Organization",
                "name": "CoinBitClub",
                "url": "https://coinbitclub-market-bot.vercel.app/home",
                "logo": "https://coinbitclub-market-bot.vercel.app/logo-nova.jpg",
                "sameAs": [
                  "https://instagram.com/coinbitclub"
                ]
              }
            })
          }}
        />
        
        {/* Fonts with display=swap for performance */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        
        {/* Favicon and App Icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo-nova.jpg" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Google AdSense */}
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5650896642732822"
          crossOrigin="anonymous"
        ></script>
        
        {/* Google tag (gtag.js) */}
        <script 
          async 
          src="https://www.googletagmanager.com/gtag/js?id=G-F2M0MG8B5H"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-F2M0MG8B5H');
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
