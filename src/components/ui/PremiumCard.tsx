// 💳 CARD PREMIUM COMPONENT
// Componente base para métricas e dados do backend (ZERO dados mock)

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { formatEmptyField, formatCurrency, formatPercentage } from '../../types/backend';

interface PremiumCardProps {
  title: string;
  value: string | number | null | undefined;
  subtitle?: string;
  icon?: LucideIcon;
  variant?: 'default' | 'neon' | 'gradient' | 'glass';
  color?: 'gold' | 'blue' | 'pink' | 'success' | 'error' | 'warning';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  currency?: 'USD' | 'BRL';
  format?: 'currency' | 'percentage' | 'number' | 'text';
  onClick?: () => void;
  className?: string;
}

export const PremiumCard: React.FC<PremiumCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default',
  color = 'gold',
  size = 'md',
  loading = false,
  currency = 'USD',
  format = 'text',
  onClick,
  className = '',
}) => {
  // Formatação baseada no tipo - SEMPRE do backend
  const formatValue = (val: any): string => {
    if (loading) return '...';
    
    switch (format) {
      case 'currency':
        return typeof val === 'number' ? formatCurrency(val, currency) : formatEmptyField(val);
      case 'percentage':
        return typeof val === 'number' ? formatPercentage(val) : formatEmptyField(val);
      case 'number':
        return typeof val === 'number' ? val.toLocaleString() : formatEmptyField(val);
      default:
        return formatEmptyField(val);
    }
  };

  // Classes baseadas no variant
  const getVariantClasses = (): string => {
    const base = 'rounded-xl p-6 transition-all duration-300';
    
    switch (variant) {
      case 'neon':
        return `${base} bg-gradient-to-br from-gray-900 to-black border border-${color}-500 shadow-lg shadow-${color}-500/20 hover:shadow-${color}-500/30`;
      case 'gradient':
        return `${base} bg-gradient-to-br from-${color}-500 to-${color}-600 text-white shadow-lg`;
      case 'glass':
        return `${base} bg-white/10 backdrop-blur-md border border-white/20 shadow-lg`;
      default:
        return `${base} bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg`;
    }
  };

  // Classes baseadas no tamanho
  const getSizeClasses = (): string => {
    switch (size) {
      case 'sm':
        return 'p-4';
      case 'lg':
        return 'p-8';
      case 'xl':
        return 'p-10';
      default:
        return 'p-6';
    }
  };

  // Animações premium
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    },
    hover: { 
      y: -4,
      transition: { duration: 0.2 }
    }
  };

  const displayValue = formatValue(value);
  const isInteractive = !!onClick;

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={isInteractive ? "hover" : undefined}
      className={`
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${isInteractive ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {/* Header com título e ícone */}
      <div className="flex items-center justify-between mb-4">
        <h3 className={`
          font-medium text-gray-600 dark:text-gray-300
          ${size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'}
        `}>
          {title}
        </h3>
        {Icon && (
          <Icon className={`
            text-${color}-500
            ${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'}
          `} />
        )}
      </div>

      {/* Valor principal */}
      <div className="mb-2">
        {loading ? (
          <div className={`
            animate-pulse bg-gray-300 dark:bg-gray-600 rounded
            ${size === 'sm' ? 'h-6' : size === 'lg' ? 'h-10' : 'h-8'}
            w-3/4
          `} />
        ) : (
          <motion.p
            key={displayValue} // Re-anima quando valor muda
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`
              font-bold text-gray-900 dark:text-white font-mono
              ${size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-3xl' : 'text-2xl'}
              ${format === 'currency' && typeof value === 'number' && value > 0 ? 'text-green-500' : ''}
              ${format === 'currency' && typeof value === 'number' && value < 0 ? 'text-red-500' : ''}
            `}
          >
            {displayValue}
          </motion.p>
        )}
      </div>

      {/* Subtitle opcional */}
      {subtitle && (
        <p className={`
          text-gray-500 dark:text-gray-400
          ${size === 'sm' ? 'text-xs' : 'text-sm'}
        `}>
          {subtitle}
        </p>
      )}

      {/* Efeito neon para variant neon */}
      {variant === 'neon' && (
        <div 
          className={`
            absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300
            bg-gradient-to-r from-${color}-500/10 to-transparent
            pointer-events-none
          `}
        />
      )}
    </motion.div>
  );
};

// 📊 CARD ESPECÍFICO PARA MÉTRICAS DE TRADING
interface TradingCardProps {
  title: string;
  value: number | null | undefined;
  previousValue?: number | null;
  currency?: 'USD' | 'BRL';
  showChange?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

export const TradingCard: React.FC<TradingCardProps> = ({
  title,
  value,
  previousValue,
  currency = 'USD',
  showChange = false,
  loading = false,
  onClick,
}) => {
  // Calcula mudança percentual se disponível
  const getChangePercentage = (): number | null => {
    if (!showChange || !value || !previousValue || previousValue === 0) {
      return null;
    }
    return ((value - previousValue) / previousValue) * 100;
  };

  const change = getChangePercentage();
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <PremiumCard
      title={title}
      value={value}
      format="currency"
      currency={currency}
      variant="neon"
      color={isPositive ? 'success' : isNegative ? 'error' : 'gold'}
      loading={loading}
      onClick={onClick}
      subtitle={
        change ? `${isPositive ? '+' : ''}${change.toFixed(2)}% vs anterior` : undefined
      }
    />
  );
};

// 💰 CARD ESPECÍFICO PARA SALDOS
interface BalanceCardProps {
  title: string;
  balance: number | null | undefined;
  balanceType: 'real_balance' | 'admin_balance' | 'commission_balance' | 'prepaid_balance';
  currency?: 'USD' | 'BRL';
  loading?: boolean;
  onClick?: () => void;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  title,
  balance,
  balanceType,
  currency = 'USD',
  loading = false,
  onClick,
}) => {
  // Cores específicas por tipo de saldo
  const getColorByType = (): 'gold' | 'blue' | 'pink' | 'success' => {
    switch (balanceType) {
      case 'real_balance':
        return 'gold';
      case 'admin_balance':
        return 'blue';
      case 'commission_balance':
        return 'success';
      case 'prepaid_balance':
        return 'pink';
      default:
        return 'gold';
    }
  };

  return (
    <PremiumCard
      title={title}
      value={balance}
      format="currency"
      currency={currency}
      variant="gradient"
      color={getColorByType()}
      loading={loading}
      onClick={onClick}
      subtitle={`Saldo ${balanceType.replace('_', ' ')}`}
    />
  );
};

export default PremiumCard;
