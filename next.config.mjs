/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignorar ESLint durante o build (manter apenas TypeScript)
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Desabilitar Fast Refresh temporariamente para resolver problemas de reload
  reactStrictMode: false,
  
  // Otimizações de performance
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js'
        }
      }
    }
  },
  
  // Configuração de imagens para SEO
  images: {
    formats: ['image/webp', 'image/avif'],
    domains: ['coinbitclub.com', 'www.coinbitclub.com'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // Otimizações de build
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Headers de segurança e SEO
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          }
        ]
      },
      // Cache para recursos estáticos
      {
        source: '/favicon.ico',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      // Cache para sitemap
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=1200, stale-while-revalidate=600'
          }
        ]
      }
    ]
  },

  // Redirects e Rewrites para SEO
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/home',
        permanent: true,
      },
      {
        source: '/index',
        destination: '/home',
        permanent: true,
      }
    ]
  },

  async rewrites() {
    return [
      {
        source: '/robots.txt',
        destination: '/api/robots'
      },
      {
        source: '/sitemap.xml',
        destination: '/sitemap.xml'
      }
    ]
  },

  // Otimizações de bundle
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Otimizações customizadas
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    
    // Otimização para SEO - reduzir tamanho do bundle
    if (!dev && !isServer) {
      config.optimization.splitChunks.chunks = 'all';
      config.optimization.splitChunks.cacheGroups = {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      };
    }
    
    return config;
  },

  // Variáveis de ambiente públicas
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version,
    NEXT_PUBLIC_SITE_URL: 'https://coinbitclub.com',
  },

  // Configuração de output para produção
  output: 'standalone',
  
  // Configuração de compressão
  compress: true,
  
  // Gerar sitemap automaticamente
  generateEtags: true,
  
  // Configurações de i18n para SEO multilíngue
  i18n: {
    locales: ['pt-BR', 'en'],
    defaultLocale: 'pt-BR',
    localeDetection: false,
  },
};

export default nextConfig;
