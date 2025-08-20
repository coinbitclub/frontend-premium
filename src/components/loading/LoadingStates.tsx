// 🚀 LOADING STATES PREMIUM
// Estados de carregamento premium para trading em tempo real

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Loader2, 
  RefreshCw, 
  TrendingUp, 
  BarChart3, 
  DollarSign,
  Activity,
  Signal,
  Zap
} from 'lucide-react';

// 🎯 TIPOS DE LOADING
export type LoadingVariant = 
  | 'spinner'        // Spinner simples
  | 'pulse'          // Pulse animado
  | 'skeleton'       // Skeleton loading
  | 'dots'           // Dots animados
  | 'bars'           // Bars animados
  | 'trading'        // Trading específico
  | 'financial'      // Financial específico
  | 'chart'          // Chart loading
  | 'neon';          // Neon effect

export type LoadingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface LoadingProps {
  variant?: LoadingVariant;
  size?: LoadingSize;
  message?: string;
  fullScreen?: boolean;
  overlay?: boolean;
  className?: string;
  color?: 'blue' | 'green' | 'gold' | 'pink' | 'white';
}

// 🎨 CONFIGURAÇÕES DE TAMANHO
const sizeConfig = {
  xs: { icon: 16, padding: 'p-2', text: 'text-xs' },
  sm: { icon: 20, padding: 'p-3', text: 'text-sm' },
  md: { icon: 24, padding: 'p-4', text: 'text-base' },
  lg: { icon: 32, padding: 'p-6', text: 'text-lg' },
  xl: { icon: 40, padding: 'p-8', text: 'text-xl' }
};

// 🎨 CONFIGURAÇÕES DE COR
const colorConfig = {
  blue: {
    primary: 'text-blue-500',
    secondary: 'text-blue-400',
    bg: 'bg-blue-500',
    gradient: 'from-blue-400 to-blue-600'
  },
  green: {
    primary: 'text-green-500',
    secondary: 'text-green-400',
    bg: 'bg-green-500',
    gradient: 'from-green-400 to-green-600'
  },
  gold: {
    primary: 'text-yellow-500',
    secondary: 'text-yellow-400',
    bg: 'bg-yellow-500',
    gradient: 'from-yellow-400 to-yellow-600'
  },
  pink: {
    primary: 'text-pink-500',
    secondary: 'text-pink-400',
    bg: 'bg-pink-500',
    gradient: 'from-pink-400 to-pink-600'
  },
  white: {
    primary: 'text-white',
    secondary: 'text-gray-100',
    bg: 'bg-white',
    gradient: 'from-gray-100 to-white'
  }
};

// 🔄 SPINNER LOADING
export const SpinnerLoading: React.FC<LoadingProps> = ({
  size = 'md',
  message,
  className = '',
  color = 'blue'
}) => {
  const { icon, padding, text } = sizeConfig[size];
  const colors = colorConfig[color];

  return (
    <div className={`flex flex-col items-center justify-center ${padding} ${className}`}>
      <Loader2 
        size={icon} 
        className={`${colors.primary} animate-spin`} 
      />
      {message && (
        <p className={`mt-2 ${text} ${colors.secondary} text-center`}>
          {message}
        </p>
      )}
    </div>
  );
};

// 💓 PULSE LOADING
export const PulseLoading: React.FC<LoadingProps> = ({
  size = 'md',
  message,
  className = '',
  color = 'blue'
}) => {
  const { padding, text } = sizeConfig[size];
  const colors = colorConfig[color];

  return (
    <div className={`flex flex-col items-center justify-center ${padding} ${className}`}>
      <div className="relative">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className={`w-8 h-8 ${colors.bg} rounded-full opacity-75`}
        />
        <motion.div
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 0.2 
          }}
          className={`absolute inset-0 w-8 h-8 ${colors.bg} rounded-full opacity-50`}
        />
      </div>
      {message && (
        <p className={`mt-3 ${text} ${colors.primary} text-center`}>
          {message}
        </p>
      )}
    </div>
  );
};

// 💀 SKELETON LOADING
interface SkeletonProps {
  lines?: number;
  avatar?: boolean;
  chart?: boolean;
  table?: boolean;
  className?: string;
}

export const SkeletonLoading: React.FC<SkeletonProps> = ({
  lines = 3,
  avatar = false,
  chart = false,
  table = false,
  className = ''
}) => {
  if (chart) {
    return (
      <div className={`animate-pulse space-y-4 ${className}`}>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="flex space-x-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  if (table) {
    return (
      <div className={`animate-pulse space-y-3 ${className}`}>
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`animate-pulse space-y-3 ${className}`}>
      {avatar && (
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      )}
      
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i} 
          className="h-4 bg-gray-200 dark:bg-gray-700 rounded"
          style={{ width: `${Math.random() * 40 + 60}%` }}
        ></div>
      ))}
    </div>
  );
};

// ⚡ DOTS LOADING
export const DotsLoading: React.FC<LoadingProps> = ({
  size = 'md',
  message,
  className = '',
  color = 'blue'
}) => {
  const colors = colorConfig[color];
  const { padding, text } = sizeConfig[size];
  
  const dotSize = size === 'xs' ? 'w-1 h-1' : 
                  size === 'sm' ? 'w-1.5 h-1.5' :
                  size === 'md' ? 'w-2 h-2' :
                  size === 'lg' ? 'w-3 h-3' : 'w-4 h-4';

  return (
    <div className={`flex flex-col items-center justify-center ${padding} ${className}`}>
      <div className="flex space-x-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
            className={`${dotSize} ${colors.bg} rounded-full`}
          />
        ))}
      </div>
      {message && (
        <p className={`mt-3 ${text} ${colors.primary} text-center`}>
          {message}
        </p>
      )}
    </div>
  );
};

// 📊 BARS LOADING
export const BarsLoading: React.FC<LoadingProps> = ({
  size = 'md',
  message,
  className = '',
  color = 'blue'
}) => {
  const colors = colorConfig[color];
  const { padding, text } = sizeConfig[size];
  
  const barHeight = size === 'xs' ? 'h-6' : 
                    size === 'sm' ? 'h-8' :
                    size === 'md' ? 'h-10' :
                    size === 'lg' ? 'h-12' : 'h-16';

  return (
    <div className={`flex flex-col items-center justify-center ${padding} ${className}`}>
      <div className="flex items-end space-x-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            animate={{ scaleY: [0.3, 1, 0.3] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeInOut"
            }}
            className={`w-2 ${barHeight} ${colors.bg} rounded-sm origin-bottom`}
          />
        ))}
      </div>
      {message && (
        <p className={`mt-3 ${text} ${colors.primary} text-center`}>
          {message}
        </p>
      )}
    </div>
  );
};

// 📈 TRADING LOADING
export const TradingLoading: React.FC<LoadingProps> = ({
  size = 'md',
  message = 'Processando operação...',
  className = ''
}) => {
  const { icon, padding, text } = sizeConfig[size];

  return (
    <div className={`flex flex-col items-center justify-center ${padding} ${className}`}>
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="relative"
        >
          <TrendingUp size={icon} className="text-green-500" />
        </motion.div>
        
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute inset-0 border-2 border-green-500 rounded-full"
        />
      </div>
      
      {message && (
        <p className={`mt-3 ${text} text-green-600 text-center font-medium`}>
          {message}
        </p>
      )}
      
      <div className="flex items-center gap-1 mt-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-xs text-green-500 font-mono">LIVE</span>
      </div>
    </div>
  );
};

// 💰 FINANCIAL LOADING
export const FinancialLoading: React.FC<LoadingProps> = ({
  size = 'md',
  message = 'Calculando saldos...',
  className = ''
}) => {
  const { icon, padding, text } = sizeConfig[size];

  return (
    <div className={`flex flex-col items-center justify-center ${padding} ${className}`}>
      <div className="relative">
        <motion.div
          animate={{ 
            rotateY: [0, 180, 360]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <DollarSign size={icon} className="text-yellow-500" />
        </motion.div>
        
        <motion.div
          animate={{ 
            scale: [0.8, 1.2, 0.8],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 0.3
          }}
          className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full blur-sm"
        />
      </div>
      
      {message && (
        <p className={`mt-3 ${text} text-yellow-600 text-center font-medium`}>
          {message}
        </p>
      )}
    </div>
  );
};

// 📊 CHART LOADING
export const ChartLoading: React.FC<LoadingProps> = ({
  size = 'md',
  message = 'Carregando gráfico...',
  className = ''
}) => {
  const { padding, text } = sizeConfig[size];

  return (
    <div className={`flex flex-col items-center justify-center ${padding} ${className}`}>
      <div className="relative">
        <BarChart3 size={32} className="text-blue-500" />
        
        <motion.div
          animate={{ 
            x: [-20, 20, -20],
            opacity: [0.3, 1, 0.3]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400 to-transparent w-1 opacity-70"
        />
      </div>
      
      {message && (
        <p className={`mt-3 ${text} text-blue-600 text-center font-medium`}>
          {message}
        </p>
      )}
      
      <div className="mt-2 flex space-x-1">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            animate={{ scaleY: [0.3, 1, 0.3] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeInOut"
            }}
            className="w-1 h-4 bg-blue-500 rounded-full origin-bottom opacity-50"
          />
        ))}
      </div>
    </div>
  );
};

// ⚡ NEON LOADING
export const NeonLoading: React.FC<LoadingProps> = ({
  size = 'md',
  message = 'Carregando...',
  className = ''
}) => {
  const { padding, text } = sizeConfig[size];

  return (
    <div className={`flex flex-col items-center justify-center ${padding} ${className}`}>
      <div className="relative">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 3, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
          }}
          className="w-16 h-16 border-4 border-transparent rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, #FFD700, #00BFFF, #FF69B4, #FFD700)',
            borderImage: 'conic-gradient(from 0deg, #FFD700, #00BFFF, #FF69B4, #FFD700) 1'
          }}
        />
        
        <motion.div
          animate={{ 
            scale: [0.8, 1.2, 0.8],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute inset-2 bg-gradient-to-r from-yellow-400 via-blue-400 to-pink-400 rounded-full blur-sm opacity-70"
        />
        
        <Zap size={24} className="absolute inset-0 m-auto text-white drop-shadow-lg" />
      </div>
      
      {message && (
        <motion.p 
          animate={{ 
            opacity: [0.7, 1, 0.7] 
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className={`mt-4 ${text} text-transparent bg-gradient-to-r from-yellow-400 via-blue-400 to-pink-400 bg-clip-text text-center font-medium`}
        >
          {message}
        </motion.p>
      )}
    </div>
  );
};

// 🎯 FULL SCREEN LOADING
export const FullScreenLoading: React.FC<LoadingProps> = ({
  variant = 'neon',
  message = 'Carregando aplicação...',
  overlay = true
}) => {
  const LoadingComponent = {
    spinner: SpinnerLoading,
    pulse: PulseLoading,
    dots: DotsLoading,
    bars: BarsLoading,
    trading: TradingLoading,
    financial: FinancialLoading,
    chart: ChartLoading,
    neon: NeonLoading,
    skeleton: SkeletonLoading
  }[variant];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`
        fixed inset-0 z-50 flex items-center justify-center
        ${overlay 
          ? 'bg-black/50 backdrop-blur-sm' 
          : 'bg-white dark:bg-gray-900'
        }
      `}
    >
      <div className="text-center">
        <LoadingComponent 
          size="xl" 
          message={message}
          color={overlay ? 'white' : 'blue'}
        />
      </div>
    </motion.div>
  );
};

// 🎯 MAIN LOADING COMPONENT
export const Loading: React.FC<LoadingProps> = ({
  variant = 'spinner',
  size = 'md',
  message,
  fullScreen = false,
  overlay = false,
  className = '',
  color = 'blue'
}) => {
  if (fullScreen) {
    return (
      <FullScreenLoading 
        variant={variant} 
        message={message} 
        overlay={overlay} 
      />
    );
  }

  const LoadingComponent = {
    spinner: SpinnerLoading,
    pulse: PulseLoading,
    skeleton: SkeletonLoading,
    dots: DotsLoading,
    bars: BarsLoading,
    trading: TradingLoading,
    financial: FinancialLoading,
    chart: ChartLoading,
    neon: NeonLoading
  }[variant];

  return (
    <LoadingComponent 
      size={size}
      message={message}
      className={className}
      color={color}
    />
  );
};

export default {
  Loading,
  SpinnerLoading,
  PulseLoading,
  SkeletonLoading,
  DotsLoading,
  BarsLoading,
  TradingLoading,
  FinancialLoading,
  ChartLoading,
  NeonLoading,
  FullScreenLoading
};
