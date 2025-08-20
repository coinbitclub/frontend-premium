// 🔔 NOTIFICATION SYSTEM PREMIUM
// Sistema de notificações em tempo real para trading

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  X, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Info,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Settings,
  Trash2
} from 'lucide-react';
import { formatCurrency, formatDate, formatEmptyField } from '../../types/backend';

// 🎯 TIPOS DE NOTIFICAÇÃO
export type NotificationType = 
  | 'success'     // ✅ Operação bem-sucedida
  | 'error'       // ❌ Erro/Falha
  | 'warning'     // ⚠️ Aviso importante
  | 'info'        // ℹ️ Informação geral
  | 'trade'       // 📈 Nova operação
  | 'profit'      // 💰 Lucro
  | 'loss'        // 📉 Prejuízo
  | 'balance'     // 💳 Saldo atualizado
  | 'system';     // ⚙️ Sistema

export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical';

export interface NotificationData {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  persistent?: boolean;     // Não remove automaticamente
  actionable?: boolean;     // Tem ação disponível
  actionLabel?: string;
  actionCallback?: () => void;
  metadata?: {
    amount?: number;
    currency?: 'USD' | 'BRL';
    trade_id?: string;
    symbol?: string;
    [key: string]: any;
  };
}

// 🎨 CONFIGURAÇÃO VISUAL POR TIPO
const notificationConfig = {
  success: {
    icon: CheckCircle,
    colors: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-700',
      text: 'text-green-800 dark:text-green-200',
      icon: 'text-green-600 dark:text-green-400'
    }
  },
  error: {
    icon: XCircle,
    colors: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-700',
      text: 'text-red-800 dark:text-red-200',
      icon: 'text-red-600 dark:text-red-400'
    }
  },
  warning: {
    icon: AlertCircle,
    colors: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-700',
      text: 'text-yellow-800 dark:text-yellow-200',
      icon: 'text-yellow-600 dark:text-yellow-400'
    }
  },
  info: {
    icon: Info,
    colors: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-700',
      text: 'text-blue-800 dark:text-blue-200',
      icon: 'text-blue-600 dark:text-blue-400'
    }
  },
  trade: {
    icon: TrendingUp,
    colors: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      border: 'border-purple-200 dark:border-purple-700',
      text: 'text-purple-800 dark:text-purple-200',
      icon: 'text-purple-600 dark:text-purple-400'
    }
  },
  profit: {
    icon: TrendingUp,
    colors: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-700',
      text: 'text-green-800 dark:text-green-200',
      icon: 'text-green-600 dark:text-green-400'
    }
  },
  loss: {
    icon: TrendingDown,
    colors: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-700',
      text: 'text-red-800 dark:text-red-200',
      icon: 'text-red-600 dark:text-red-400'
    }
  },
  balance: {
    icon: DollarSign,
    colors: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-700',
      text: 'text-blue-800 dark:text-blue-200',
      icon: 'text-blue-600 dark:text-blue-400'
    }
  },
  system: {
    icon: Settings,
    colors: {
      bg: 'bg-gray-50 dark:bg-gray-900/20',
      border: 'border-gray-200 dark:border-gray-700',
      text: 'text-gray-800 dark:text-gray-200',
      icon: 'text-gray-600 dark:text-gray-400'
    }
  }
};

// 🔔 COMPONENTE DE NOTIFICAÇÃO INDIVIDUAL
interface NotificationItemProps {
  notification: NotificationData;
  onDismiss: (id: string) => void;
  onAction?: (id: string) => void;
  compact?: boolean;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onDismiss,
  onAction,
  compact = false
}) => {
  const config = notificationConfig[notification.type];
  const Icon = config.icon;

  const handleAction = () => {
    if (notification.actionCallback) {
      notification.actionCallback();
    }
    if (onAction) {
      onAction(notification.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      }}
      layout
      className={`
        relative flex items-start gap-3 p-4 rounded-lg border-l-4 shadow-lg
        ${config.colors.bg} ${config.colors.border}
        ${compact ? 'max-w-sm' : 'max-w-md'}
        backdrop-blur-sm
        ${notification.priority === 'critical' ? 'ring-2 ring-red-500 ring-opacity-50' : ''}
      `}
    >
      {/* Ícone */}
      <div className={`flex-shrink-0 ${config.colors.icon}`}>
        <Icon size={compact ? 16 : 20} />
      </div>

      {/* Conteúdo */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h4 className={`font-semibold ${compact ? 'text-sm' : 'text-base'} ${config.colors.text}`}>
              {notification.title}
            </h4>
            <p className={`${compact ? 'text-xs' : 'text-sm'} ${config.colors.text} mt-1 opacity-90`}>
              {notification.message}
            </p>
            
            {/* Metadata (valores, símbolos, etc.) */}
            {notification.metadata && (
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                {notification.metadata.amount && (
                  <span className="font-mono font-semibold">
                    {formatCurrency(notification.metadata.amount, notification.metadata.currency)}
                  </span>
                )}
                {notification.metadata.symbol && (
                  <span className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                    {notification.metadata.symbol}
                  </span>
                )}
              </div>
            )}
            
            <p className={`text-xs ${config.colors.text} opacity-60 mt-2`}>
              {formatDate(notification.timestamp.toISOString())}
            </p>
          </div>

          {/* Botão de fechar */}
          <button
            onClick={() => onDismiss(notification.id)}
            className={`
              flex-shrink-0 p-1 rounded-full transition-colors
              ${config.colors.text} opacity-60 hover:opacity-100
              hover:bg-black/10 dark:hover:bg-white/10
            `}
          >
            <X size={14} />
          </button>
        </div>

        {/* Ação (se disponível) */}
        {notification.actionable && notification.actionLabel && (
          <button
            onClick={handleAction}
            className={`
              mt-3 px-3 py-1 text-xs font-medium rounded-md transition-colors
              ${config.colors.text} bg-white/20 hover:bg-white/30
              dark:bg-black/20 dark:hover:bg-black/30
            `}
          >
            {notification.actionLabel}
          </button>
        )}
      </div>
    </motion.div>
  );
};

// 📱 TOAST CONTAINER (Mobile/Desktop)
interface ToastContainerProps {
  notifications: NotificationData[];
  onDismiss: (id: string) => void;
  onAction?: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center';
  maxNotifications?: number;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  notifications,
  onDismiss,
  onAction,
  position = 'top-right',
  maxNotifications = 5
}) => {
  const visibleNotifications = notifications.slice(0, maxNotifications);

  const positionClasses = {
    'top-right': 'fixed top-4 right-4 z-50',
    'top-left': 'fixed top-4 left-4 z-50',
    'bottom-right': 'fixed bottom-4 right-4 z-50',
    'bottom-left': 'fixed bottom-4 left-4 z-50',
    'top-center': 'fixed top-4 left-1/2 transform -translate-x-1/2 z-50'
  };

  return (
    <div className={positionClasses[position]}>
      <AnimatePresence>
        <div className="space-y-3">
          {visibleNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onDismiss={onDismiss}
              onAction={onAction}
              compact={position.includes('left') || position.includes('right')}
            />
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
};

// 🔔 NOTIFICATION BELL ICON (Header)
interface NotificationBellProps {
  notifications: NotificationData[];
  onClick: () => void;
  className?: string;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  notifications,
  onClick,
  className = ''
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;
  const hasUrgent = notifications.some(n => n.priority === 'critical' && !n.read);

  return (
    <button
      onClick={onClick}
      className={`
        relative p-2 rounded-lg transition-colors
        hover:bg-gray-100 dark:hover:bg-gray-800
        ${hasUrgent ? 'animate-pulse' : ''}
        ${className}
      `}
    >
      <Bell 
        size={20} 
        className={`
          ${hasUrgent 
            ? 'text-red-500' 
            : unreadCount > 0 
              ? 'text-blue-500' 
              : 'text-gray-400'
          }
        `} 
      />
      
      {unreadCount > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`
            absolute -top-1 -right-1 min-w-[18px] h-[18px] 
            flex items-center justify-center
            text-xs font-bold text-white rounded-full
            ${hasUrgent ? 'bg-red-500' : 'bg-blue-500'}
          `}
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </motion.div>
      )}
    </button>
  );
};

// 📋 NOTIFICATION CENTER (Modal/Sidebar)
interface NotificationCenterProps {
  notifications: NotificationData[];
  isOpen: boolean;
  onClose: () => void;
  onDismiss: (id: string) => void;
  onDismissAll: () => void;
  onMarkAllRead: () => void;
  className?: string;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  isOpen,
  onClose,
  onDismiss,
  onDismissAll,
  onMarkAllRead,
  className = ''
}) => {
  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`
          absolute right-0 top-0 h-full w-full max-w-md
          bg-white dark:bg-gray-900 shadow-xl
          flex flex-col
          ${className}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Notificações
            {unreadNotifications.length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-blue-500 text-white rounded-full">
                {unreadNotifications.length}
              </span>
            )}
          </h2>
          
          <div className="flex items-center gap-2">
            {/* Ações */}
            {notifications.length > 0 && (
              <>
                <button
                  onClick={onMarkAllRead}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  Marcar lidas
                </button>
                <button
                  onClick={onDismissAll}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}
            
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <Bell size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Nenhuma notificação
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Você está em dia!
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {/* Não lidas */}
              {unreadNotifications.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Novas ({unreadNotifications.length})
                  </h3>
                  <div className="space-y-3">
                    {unreadNotifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onDismiss={onDismiss}
                        compact
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Lidas */}
              {readNotifications.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Anteriores ({readNotifications.length})
                  </h3>
                  <div className="space-y-3 opacity-60">
                    {readNotifications.slice(0, 10).map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onDismiss={onDismiss}
                        compact
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// 🎯 HOOKS PARA GERENCIAMENTO

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  const addNotification = useCallback((notification: Omit<NotificationData, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: NotificationData = {
      ...notification,
      id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Auto-remove após delay (exceto persistentes)
    if (!notification.persistent) {
      const delay = notification.priority === 'critical' ? 10000 : 5000;
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
      }, delay);
    }

    return newNotification.id;
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const dismissAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const createTradingNotification = useCallback((
    type: 'profit' | 'loss' | 'trade',
    amount: number,
    symbol: string,
    currency: 'USD' | 'BRL' = 'USD'
  ) => {
    const isProfit = type === 'profit' || (type === 'trade' && amount > 0);
    
    return addNotification({
      type: isProfit ? 'profit' : 'loss',
      priority: amount > 1000 ? 'high' : 'medium',
      title: isProfit ? 'Trade Lucrativo!' : 'Trade com Prejuízo',
      message: `${symbol}: ${isProfit ? 'Lucro' : 'Prejuízo'} de ${formatCurrency(Math.abs(amount), currency)}`,
      metadata: { amount, symbol, currency },
      actionable: true,
      actionLabel: 'Ver detalhes'
    });
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    dismissNotification,
    markAsRead,
    markAllAsRead,
    dismissAll,
    createTradingNotification
  };
};

export default {
  NotificationItem,
  ToastContainer,
  NotificationBell,
  NotificationCenter,
  useNotifications
};
