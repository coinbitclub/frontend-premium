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
  
  // Configuração de imagens
  images: {
    formats: ['image/webp', 'image/avif'],
    domains: [],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Otimizações de build
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Headers de segurança
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
          }
        ]
      }
    ]
  },

  // Configuração de CORS para APIs
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*'
      }
    ]
  },

  // Otimizações de bundle
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Otimizações customizadas se necessário
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    
    return config;
  },

  // Variáveis de ambiente públicas
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version,
  },

  // Configuração de output para produção
  output: 'standalone',
};

export default nextConfig;
