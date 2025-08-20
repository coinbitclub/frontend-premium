// 📈 CHART COMPONENTS PREMIUM
// Componentes de gráficos para analytics e trading em tempo real

import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import formatters from '../../types/backend';

const { formatCurrency, formatPercentage, formatDate, formatEmptyField } = formatters;

// 🎯 INTERFACE BASE PARA CHARTS
interface ChartProps {
  data: any[];
  loading?: boolean;
  height?: number;
  className?: string;
  variant?: 'default' | 'neon' | 'minimal' | 'premium';
  realTime?: boolean;
  currency?: 'USD' | 'BRL';
}

interface TradingChartProps extends ChartProps {
  profitLossData?: boolean;
  showGrid?: boolean;
  showTooltip?: boolean;
}

// 📊 TRADING LINE CHART (Profit/Loss)
export const TradingLineChart: React.FC<TradingChartProps> = ({
  data,
  loading = false,
  height = 300,
  className = '',
  variant = 'premium',
  realTime = false,
  currency = 'USD',
  profitLossData = true,
  showGrid = true,
  showTooltip = true
}) => {
  if (loading) {
    return (
      <div className={`h-[${height}px] bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse ${className}`}>
        <div className="h-full w-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={`h-[${height}px] flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg ${className}`}>
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">Nenhum dado disponível</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">-</p>
        </div>
      </div>
    );
  }

  const getLineColor = (variant: string): string => {
    switch (variant) {
      case 'neon':
        return '#FFD700';
      case 'premium':
        return '#00BFFF';
      default:
        return '#3B82F6';
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const isProfit = value >= 0;
      
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {formatDate(label)}
          </p>
          <p className={`font-mono font-semibold ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
            {profitLossData ? formatCurrency(value, currency) : formatEmptyField(value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`relative ${className}`}
    >
      {realTime && (
        <div className="absolute top-2 right-2 z-10">
          <div className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            LIVE
          </div>
        </div>
      )}
      
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          {showGrid && (
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgba(156, 163, 175, 0.2)" 
            />
          )}
          <XAxis 
            dataKey="date" 
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
            stroke="rgba(156, 163, 175, 0.6)"
            fontSize={12}
          />
          <YAxis 
            tickFormatter={(value) => profitLossData ? formatCurrency(value, currency) : value}
            stroke="rgba(156, 163, 175, 0.6)"
            fontSize={12}
          />
          {showTooltip && <Tooltip content={<CustomTooltip />} />}
          <Line
            type="monotone"
            dataKey="value"
            stroke={getLineColor(variant)}
            strokeWidth={2}
            dot={false}
            activeDot={{ 
              r: 4, 
              fill: getLineColor(variant),
              stroke: '#fff',
              strokeWidth: 2
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

// 📈 BALANCE AREA CHART (4 tipos de saldo)
interface BalanceAreaChartProps extends ChartProps {
  showLegend?: boolean;
  stackedView?: boolean;
}

export const BalanceAreaChart: React.FC<BalanceAreaChartProps> = ({
  data,
  loading = false,
  height = 350,
  className = '',
  currency = 'USD',
  showLegend = true,
  stackedView = false
}) => {
  if (loading) {
    return <ChartSkeleton height={height} className={className} />;
  }

  if (!data || data.length === 0) {
    return <EmptyChart height={height} className={className} />;
  }

  const colors = {
    real_balance: '#FFD700',      // Dourado
    admin_balance: '#00BFFF',     // Azul
    commission_balance: '#00FF7F', // Verde
    prepaid_balance: '#FF69B4'    // Rosa
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {formatDate(label)}
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {entry.name.replace('_', ' ')}: 
              </span>
              <span className="font-mono font-semibold">
                {formatCurrency(entry.value, currency)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={className}
    >
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.2)" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
            stroke="rgba(156, 163, 175, 0.6)"
            fontSize={12}
          />
          <YAxis 
            tickFormatter={(value) => formatCurrency(value, currency)}
            stroke="rgba(156, 163, 175, 0.6)"
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          {showLegend && (
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => (
                <span style={{ color: 'var(--text-primary)' }}>
                  {value.replace('_', ' ')}
                </span>
              )}
            />
          )}
          <Area
            type="monotone"
            dataKey="real_balance"
            stackId={stackedView ? "1" : undefined}
            stroke={colors.real_balance}
            fill={`${colors.real_balance}40`}
            name="Real Balance"
          />
          <Area
            type="monotone"
            dataKey="admin_balance"
            stackId={stackedView ? "1" : undefined}
            stroke={colors.admin_balance}
            fill={`${colors.admin_balance}40`}
            name="Admin Balance"
          />
          <Area
            type="monotone"
            dataKey="commission_balance"
            stackId={stackedView ? "1" : undefined}
            stroke={colors.commission_balance}
            fill={`${colors.commission_balance}40`}
            name="Commission Balance"
          />
          <Area
            type="monotone"
            dataKey="prepaid_balance"
            stackId={stackedView ? "1" : undefined}
            stroke={colors.prepaid_balance}
            fill={`${colors.prepaid_balance}40`}
            name="Prepaid Balance"
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

// 📊 PERFORMANCE BAR CHART
interface PerformanceBarChartProps extends ChartProps {
  metric: 'profit_loss' | 'win_rate' | 'trades_count';
}

export const PerformanceBarChart: React.FC<PerformanceBarChartProps> = ({
  data,
  loading = false,
  height = 300,
  className = '',
  metric = 'profit_loss',
  currency = 'USD'
}) => {
  if (loading) {
    return <ChartSkeleton height={height} className={className} />;
  }

  if (!data || data.length === 0) {
    return <EmptyChart height={height} className={className} />;
  }

  const getBarColor = (value: number): string => {
    if (metric === 'profit_loss') {
      return value >= 0 ? '#00FF7F' : '#FF4500';
    }
    return '#00BFFF';
  };

  const formatValue = (value: number): string => {
    switch (metric) {
      case 'profit_loss':
        return formatCurrency(value, currency);
      case 'win_rate':
        return formatPercentage(value);
      case 'trades_count':
        return value.toString();
      default:
        return formatEmptyField(value);
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
          <p className="font-mono font-semibold" style={{ color: getBarColor(value) }}>
            {formatValue(value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.2)" />
          <XAxis 
            dataKey="period" 
            stroke="rgba(156, 163, 175, 0.6)"
            fontSize={12}
          />
          <YAxis 
            tickFormatter={formatValue}
            stroke="rgba(156, 163, 175, 0.6)"
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="value" 
            fill="#00BFFF"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

// 🥧 PIE CHART (Distribuição de Portfolio)
interface PieChartProps extends ChartProps {
  centerLabel?: string;
  centerValue?: string;
}

export const PortfolioPieChart: React.FC<PieChartProps> = ({
  data,
  loading = false,
  height = 300,
  className = '',
  centerLabel = 'Total',
  centerValue
}) => {
  if (loading) {
    return <ChartSkeleton height={height} className={className} />;
  }

  if (!data || data.length === 0) {
    return <EmptyChart height={height} className={className} />;
  }

  const COLORS = ['#FFD700', '#00BFFF', '#FF69B4', '#00FF7F', '#FF4500'];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium">{data.name}</p>
          <p className="font-mono font-semibold text-blue-600">
            {formatCurrency(data.value)}
          </p>
          <p className="text-xs text-gray-500">
            {formatPercentage(data.percentage)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={`relative ${className}`}
    >
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Center Label */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">{centerLabel}</p>
          {centerValue && (
            <p className="font-mono font-bold text-lg text-gray-900 dark:text-white">
              {centerValue}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// 🎯 UTILITY COMPONENTS

const ChartSkeleton: React.FC<{ height: number; className?: string }> = ({ 
  height, 
  className = '' 
}) => (
  <div className={`h-[${height}px] bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse ${className}`}>
    <div className="h-full w-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg"></div>
  </div>
);

const EmptyChart: React.FC<{ height: number; className?: string }> = ({ 
  height, 
  className = '' 
}) => (
  <div className={`h-[${height}px] flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 ${className}`}>
    <div className="text-center">
      <p className="text-gray-500 dark:text-gray-400 font-medium">Nenhum dado disponível</p>
      <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
        Os dados aparecerão aqui quando estiverem disponíveis no backend
      </p>
    </div>
  </div>
);

// 📱 RESPONSIVE CHART WRAPPER
export const ResponsiveChartWrapper: React.FC<{
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}> = ({ 
  children, 
  title, 
  subtitle, 
  actions, 
  className = '' 
}) => (
  <div className={`bg-white dark:bg-gray-800 rounded-xl p-4 lg:p-6 shadow-lg ${className}`}>
    {(title || actions) && (
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div className="mt-2 sm:mt-0">
            {actions}
          </div>
        )}
      </div>
    )}
    {children}
  </div>
);

export default {
  TradingLineChart,
  BalanceAreaChart,
  PerformanceBarChart,
  PortfolioPieChart,
  ResponsiveChartWrapper
};
