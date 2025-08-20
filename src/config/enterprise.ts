/**
 * Enterprise Performance Configuration
 * Otimizado para 1000+ usuários simultâneos
 */

// Cache Configuration
export const CACHE_CONFIG = {
  // Redis Cache TTL
  REDIS_TTL: {
    USER_SESSION: 24 * 60 * 60, // 24 horas
    TRADING_SIGNALS: 5 * 60,    // 5 minutos
    MARKET_DATA: 30,            // 30 segundos
    USER_PREFERENCES: 60 * 60,  // 1 hora
    DASHBOARD_DATA: 2 * 60,     // 2 minutos
    PORTFOLIO_DATA: 1 * 60,     // 1 minuto
  },
  
  // Browser Cache Headers
  BROWSER_CACHE: {
    STATIC_ASSETS: 'public, max-age=31536000, immutable', // 1 year
    API_RESPONSES: 'public, max-age=300, s-maxage=300',   // 5 minutes
    USER_DATA: 'private, max-age=60',                     // 1 minute
    REAL_TIME_DATA: 'no-cache, no-store, must-revalidate', // No cache
  },
  
  // CDN Configuration
  CDN: {
    IMAGES: 'https://cdn.coinbitclub.com/images/',
    ASSETS: 'https://cdn.coinbitclub.com/assets/',
    API: 'https://api.coinbitclub.com/',
  }
};

// Performance Monitoring
export const PERFORMANCE_CONFIG = {
  // Core Web Vitals Targets
  VITALS: {
    LCP: 2500,  // Largest Contentful Paint (ms)
    FID: 100,   // First Input Delay (ms)
    CLS: 0.1,   // Cumulative Layout Shift
    FCP: 1800,  // First Contentful Paint (ms)
    TTI: 3800,  // Time to Interactive (ms)
  },
  
  // Bundle Size Limits
  BUNDLE_LIMITS: {
    MAIN_BUNDLE: 300 * 1024,     // 300KB
    VENDOR_BUNDLE: 500 * 1024,   // 500KB
    CHUNK_SIZE: 100 * 1024,      // 100KB per chunk
    TOTAL_JS: 1024 * 1024,       // 1MB total JS
  },
  
  // API Response Time Targets
  API_TARGETS: {
    CRITICAL: 200,      // ms - trading signals
    IMPORTANT: 500,     // ms - user data
    STANDARD: 1000,     // ms - dashboard data
    BACKGROUND: 3000,   // ms - analytics
  }
};

// Scalability Configuration
export const SCALABILITY_CONFIG = {
  // Connection Limits
  CONNECTIONS: {
    MAX_CONCURRENT_USERS: 2000,
    MAX_API_REQUESTS_PER_MINUTE: 60,
    MAX_WEBSOCKET_CONNECTIONS: 1500,
    CONNECTION_POOL_SIZE: 100,
  },
  
  // Rate Limiting
  RATE_LIMITS: {
    GLOBAL: 100, // requests per minute per IP
    AUTHENTICATED: 200, // requests per minute per user
    TRADING_SIGNALS: 20, // requests per minute
    FILE_UPLOAD: 5, // requests per minute
  },
  
  // Database Configuration
  DATABASE: {
    CONNECTION_POOL_MIN: 10,
    CONNECTION_POOL_MAX: 50,
    QUERY_TIMEOUT: 30000, // 30 seconds
    IDLE_TIMEOUT: 300000, // 5 minutes
    MAX_QUERY_EXECUTION_TIME: 10000, // 10 seconds
  },
  
  // Memory Limits
  MEMORY: {
    NODE_MAX_OLD_SPACE_SIZE: 4096, // MB
    CACHE_SIZE_LIMIT: 512, // MB
    SESSION_MEMORY_LIMIT: 100, // MB
  }
};

// Feature Flags for Enterprise
export const FEATURE_FLAGS = {
  // Performance Features
  ENABLE_CDN: true,
  ENABLE_SERVICE_WORKER: true,
  ENABLE_HTTP2_PUSH: true,
  ENABLE_GZIP_COMPRESSION: true,
  ENABLE_BROTLI_COMPRESSION: true,
  
  // Caching Features
  ENABLE_REDIS_CACHE: true,
  ENABLE_BROWSER_CACHE: true,
  ENABLE_API_CACHE: true,
  ENABLE_STATIC_GENERATION: true,
  
  // Monitoring Features
  ENABLE_REAL_USER_MONITORING: true,
  ENABLE_ERROR_TRACKING: true,
  ENABLE_PERFORMANCE_MONITORING: true,
  ENABLE_ANALYTICS: true,
  
  // Security Features
  ENABLE_RATE_LIMITING: true,
  ENABLE_DDoS_PROTECTION: true,
  ENABLE_WAF: true,
  ENABLE_SSL_PINNING: true,
  
  // Experimental Features
  ENABLE_EDGE_COMPUTING: false,
  ENABLE_A_B_TESTING: true,
  ENABLE_PROGRESSIVE_ENHANCEMENT: true,
};

// Environment-specific configurations
export const ENV_CONFIG = {
  development: {
    LOG_LEVEL: 'debug',
    ENABLE_HMR: true,
    ENABLE_SOURCE_MAPS: true,
    BUNDLE_ANALYZER: true,
  },
  
  staging: {
    LOG_LEVEL: 'info',
    ENABLE_PERFORMANCE_MONITORING: true,
    ENABLE_ERROR_TRACKING: true,
    SIMULATE_LOAD: true,
  },
  
  production: {
    LOG_LEVEL: 'error',
    ENABLE_ALL_OPTIMIZATIONS: true,
    ENABLE_MONITORING: true,
    MINIFY_OUTPUT: true,
    TREE_SHAKE: true,
    CODE_SPLITTING: true,
  }
};

// Load Balancing Configuration
export const LOAD_BALANCER_CONFIG = {
  STRATEGY: 'least_connections', // round_robin, least_connections, ip_hash
  HEALTH_CHECK_INTERVAL: 30000, // 30 seconds
  HEALTH_CHECK_TIMEOUT: 5000,   // 5 seconds
  FAILOVER_THRESHOLD: 3,        // failures before marking unhealthy
  
  SERVERS: [
    { host: 'app1.coinbitclub.com', weight: 1, backup: false },
    { host: 'app2.coinbitclub.com', weight: 1, backup: false },
    { host: 'app3.coinbitclub.com', weight: 1, backup: false },
    { host: 'app4.coinbitclub.com', weight: 1, backup: true },
  ]
};

// Monitoring and Alerting
export const MONITORING_CONFIG = {
  // Metrics Collection
  METRICS: {
    COLLECT_INTERVAL: 10000, // 10 seconds
    RETENTION_PERIOD: 30 * 24 * 60 * 60, // 30 days
    AGGREGATION_INTERVALS: [60, 300, 3600, 86400], // 1m, 5m, 1h, 1d
  },
  
  // Alert Thresholds
  ALERTS: {
    CPU_USAGE: 80,           // %
    MEMORY_USAGE: 85,        // %
    DISK_USAGE: 90,          // %
    RESPONSE_TIME: 2000,     // ms
    ERROR_RATE: 5,           // %
    CONCURRENT_USERS: 1800,  // count
  },
  
  // Notification Channels
  NOTIFICATIONS: {
    EMAIL: ['admin@coinbitclub.com', 'devops@coinbitclub.com'],
    SLACK: '#alerts',
    SMS: ['+5521995966652'],
    WEBHOOK: 'https://hooks.coinbitclub.com/alerts',
  }
};

// Security Configuration
export const SECURITY_CONFIG = {
  // Authentication
  JWT: {
    SECRET_ROTATION_INTERVAL: 24 * 60 * 60, // 24 hours
    TOKEN_EXPIRY: 15 * 60, // 15 minutes
    REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60, // 7 days
    MAX_FAILED_ATTEMPTS: 5,
    LOCKOUT_DURATION: 15 * 60, // 15 minutes
  },
  
  // Encryption
  ENCRYPTION: {
    ALGORITHM: 'AES-256-GCM',
    KEY_ROTATION_INTERVAL: 7 * 24 * 60 * 60, // 7 days
    SALT_ROUNDS: 12,
  },
  
  // Headers
  SECURITY_HEADERS: {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.google-analytics.com https://connect.facebook.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.coinbitclub.com wss://ws.coinbitclub.com;",
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  }
};

export default {
  CACHE_CONFIG,
  PERFORMANCE_CONFIG,
  SCALABILITY_CONFIG,
  FEATURE_FLAGS,
  ENV_CONFIG,
  LOAD_BALANCER_CONFIG,
  MONITORING_CONFIG,
  SECURITY_CONFIG,
};
