'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  CogIcon,
  ChartBarIcon,
  BellIcon,
  DocumentArrowDownIcon,
  ArrowPathIcon,
  UserPlusIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface QuickActionsProps {
  language: 'pt' | 'en';
  userRole: 'admin' | 'premium' | 'basic';
  onAction: (action: string, data?: any) => void;
}

interface ActionButton {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  description: string;
  roles: Array<'admin' | 'premium' | 'basic'>;
  category: 'trading' | 'management' | 'settings' | 'reports';
  requiresConfirmation?: boolean;
}

const QuickActions: React.FC<QuickActionsProps> = ({ language, userRole, onAction }) => {
  const [showConfirmation, setShowConfirmation] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const translations = {
    pt: {
      quickActions: 'Ações Rápidas',
      trading: 'Trading',
      management: 'Gerenciamento',
      settings: 'Configurações',
      reports: 'Relatórios',
      confirmAction: 'Confirmar Ação',
      areYouSure: 'Tem certeza que deseja executar esta ação?',
      confirm: 'Confirmar',
      cancel: 'Cancelar',
      // Actions
      createSignal: 'Criar Sinal',
      createSignalDesc: 'Criar novo sinal de trading',
      startTrading: 'Iniciar Trading',
      startTradingDesc: 'Ativar sistema de trading automático',
      pauseTrading: 'Pausar Trading',
      pauseTradingDesc: 'Pausar sistema de trading',
      stopTrading: 'Parar Trading',
      stopTradingDesc: 'Parar completamente o trading',
      viewAnalytics: 'Ver Analytics',
      viewAnalyticsDesc: 'Acessar relatórios detalhados',
      manageBots: 'Gerenciar Bots',
      manageBotsDesc: 'Configurar bots de trading',
      notifications: 'Notificações',
      notificationsDesc: 'Gerenciar configurações de notificação',
      downloadReport: 'Download Relatório',
      downloadReportDesc: 'Baixar relatório de performance',
      refreshData: 'Atualizar Dados',
      refreshDataDesc: 'Sincronizar dados mais recentes',
      addUser: 'Adicionar Usuário',
      addUserDesc: 'Criar nova conta de usuário',
      systemSettings: 'Configurações Sistema',
      systemSettingsDesc: 'Acessar configurações administrativas',
      emergencyStop: 'Parada Emergencial',
      emergencyStopDesc: 'Parar todos os trades imediatamente',
      // Success messages
      actionCompleted: 'Ação executada com sucesso',
      actionFailed: 'Falha ao executar ação'
    },
    en: {
      quickActions: 'Quick Actions',
      trading: 'Trading',
      management: 'Management',
      settings: 'Settings',
      reports: 'Reports',
      confirmAction: 'Confirm Action',
      areYouSure: 'Are you sure you want to execute this action?',
      confirm: 'Confirm',
      cancel: 'Cancel',
      // Actions
      createSignal: 'Create Signal',
      createSignalDesc: 'Create new trading signal',
      startTrading: 'Start Trading',
      startTradingDesc: 'Activate automatic trading system',
      pauseTrading: 'Pause Trading',
      pauseTradingDesc: 'Pause trading system',
      stopTrading: 'Stop Trading',
      stopTradingDesc: 'Completely stop trading',
      viewAnalytics: 'View Analytics',
      viewAnalyticsDesc: 'Access detailed reports',
      manageBots: 'Manage Bots',
      manageBotsDesc: 'Configure trading bots',
      notifications: 'Notifications',
      notificationsDesc: 'Manage notification settings',
      downloadReport: 'Download Report',
      downloadReportDesc: 'Download performance report',
      refreshData: 'Refresh Data',
      refreshDataDesc: 'Sync latest data',
      addUser: 'Add User',
      addUserDesc: 'Create new user account',
      systemSettings: 'System Settings',
      systemSettingsDesc: 'Access administrative settings',
      emergencyStop: 'Emergency Stop',
      emergencyStopDesc: 'Stop all trades immediately',
      // Success messages
      actionCompleted: 'Action completed successfully',
      actionFailed: 'Failed to execute action'
    }
  };

  const t = translations[language];

  const actions: ActionButton[] = [
    {
      id: 'create-signal',
      label: t.createSignal,
      icon: PlusIcon,
      color: 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
      description: t.createSignalDesc,
      roles: ['admin', 'premium'],
      category: 'trading'
    },
    {
      id: 'start-trading',
      label: t.startTrading,
      icon: PlayIcon,
      color: 'bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
      description: t.startTradingDesc,
      roles: ['admin', 'premium'],
      category: 'trading'
    },
    {
      id: 'pause-trading',
      label: t.pauseTrading,
      icon: PauseIcon,
      color: 'bg-gradient-to-br from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700',
      description: t.pauseTradingDesc,
      roles: ['admin', 'premium'],
      category: 'trading',
      requiresConfirmation: true
    },
    {
      id: 'view-analytics',
      label: t.viewAnalytics,
      icon: ChartBarIcon,
      color: 'bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
      description: t.viewAnalyticsDesc,
      roles: ['admin', 'premium', 'basic'],
      category: 'reports'
    },
    {
      id: 'manage-bots',
      label: t.manageBots,
      icon: CogIcon,
      color: 'bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700',
      description: t.manageBotsDesc,
      roles: ['admin', 'premium'],
      category: 'management'
    },
    {
      id: 'notifications',
      label: t.notifications,
      icon: BellIcon,
      color: 'bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
      description: t.notificationsDesc,
      roles: ['admin', 'premium', 'basic'],
      category: 'settings'
    },
    {
      id: 'download-report',
      label: t.downloadReport,
      icon: DocumentArrowDownIcon,
      color: 'bg-gradient-to-br from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700',
      description: t.downloadReportDesc,
      roles: ['admin', 'premium', 'basic'],
      category: 'reports'
    },
    {
      id: 'refresh-data',
      label: t.refreshData,
      icon: ArrowPathIcon,
      color: 'bg-gradient-to-br from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700',
      description: t.refreshDataDesc,
      roles: ['admin', 'premium', 'basic'],
      category: 'management'
    },
    // Admin only actions
    {
      id: 'add-user',
      label: t.addUser,
      icon: UserPlusIcon,
      color: 'bg-gradient-to-br from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700',
      description: t.addUserDesc,
      roles: ['admin'],
      category: 'management'
    },
    {
      id: 'system-settings',
      label: t.systemSettings,
      icon: ShieldCheckIcon,
      color: 'bg-gradient-to-br from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700',
      description: t.systemSettingsDesc,
      roles: ['admin'],
      category: 'settings'
    },
    {
      id: 'stop-trading',
      label: t.stopTrading,
      icon: StopIcon,
      color: 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
      description: t.stopTradingDesc,
      roles: ['admin'],
      category: 'trading',
      requiresConfirmation: true
    },
    {
      id: 'emergency-stop',
      label: t.emergencyStop,
      icon: ExclamationTriangleIcon,
      color: 'bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800',
      description: t.emergencyStopDesc,
      roles: ['admin'],
      category: 'trading',
      requiresConfirmation: true
    }
  ];

  const filteredActions = actions.filter(action => 
    action.roles.includes(userRole)
  );

  const groupedActions = filteredActions.reduce((groups, action) => {
    const category = action.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(action);
    return groups;
  }, {} as Record<string, ActionButton[]>);

  const handleAction = async (action: ActionButton) => {
    if (action.requiresConfirmation && showConfirmation !== action.id) {
      setShowConfirmation(action.id);
      return;
    }

    setLoading(action.id);
    setShowConfirmation(null);

    try {
      // Analytics
      if (typeof gtag !== 'undefined') {
        gtag('event', 'quick_action', {
          action_id: action.id,
          action_category: action.category,
          user_role: userRole,
          event_category: 'engagement'
        });
      }

      // Simulate action execution
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onAction(action.id, { 
        label: action.label, 
        category: action.category 
      });

      // Show success message (in a real app, this would be handled by a toast/notification system)
      console.log(`${t.actionCompleted}: ${action.label}`);
      
    } catch (error) {
      console.error(`${t.actionFailed}: ${action.label}`, error);
    } finally {
      setLoading(null);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'trading':
        return CurrencyDollarIcon;
      case 'management':
        return CogIcon;
      case 'settings':
        return ShieldCheckIcon;
      case 'reports':
        return ChartBarIcon;
      default:
        return CogIcon;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {t.quickActions}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {filteredActions.length} {language === 'pt' ? 'ações disponíveis' : 'actions available'}
        </p>
      </div>

      {/* Actions by Category */}
      {Object.entries(groupedActions).map(([category, categoryActions], categoryIndex) => {
        const CategoryIcon = getCategoryIcon(category);
        
        return (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
            className="space-y-3"
          >
            {/* Category Header */}
            <div className="flex items-center space-x-2">
              <CategoryIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t[category as keyof typeof t]}
              </h3>
            </div>

            {/* Action Buttons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryActions.map((action, index) => {
                const Icon = action.icon;
                const isLoading = loading === action.id;
                const showingConfirmation = showConfirmation === action.id;
                
                return (
                  <motion.div
                    key={action.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (categoryIndex * 0.1) + (index * 0.05) }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <button
                      onClick={() => handleAction(action)}
                      disabled={isLoading}
                      className={`
                        w-full p-4 rounded-xl text-white shadow-sm transition-all duration-200
                        ${action.color}
                        ${isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-md'}
                        ${showingConfirmation ? 'ring-2 ring-white ring-opacity-50' : ''}
                      `}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {isLoading ? (
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Icon className="h-6 w-6" />
                          )}
                        </div>
                        <div className="flex-1 text-left">
                          <h4 className="font-semibold text-white">
                            {action.label}
                          </h4>
                          <p className="text-sm text-white text-opacity-90 mt-1">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </button>

                    {/* Confirmation Modal */}
                    {showingConfirmation && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                        onClick={() => setShowConfirmation(null)}
                      >
                        <motion.div
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md mx-4 shadow-xl"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                              <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {t.confirmAction}
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {action.label}
                              </p>
                            </div>
                          </div>
                          
                          <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {t.areYouSure}
                          </p>
                          
                          <div className="flex space-x-3">
                            <button
                              onClick={() => setShowConfirmation(null)}
                              className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                              {t.cancel}
                            </button>
                            <button
                              onClick={() => handleAction(action)}
                              className="flex-1 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                            >
                              {t.confirm}
                            </button>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default QuickActions;
