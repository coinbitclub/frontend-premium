import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { motion, AnimatePresence } from 'framer-motion';

import { 
  FiSettings, 
  FiSave,
  FiRefreshCw,
  FiToggleLeft,
  FiToggleRight,
  FiEdit3,
  FiLock,
  FiUnlock,
  FiServer,
  FiDatabase,
  FiShield,
  FiMail,
  FiDollarSign,
  FiTrendingUp,
  FiUsers,
  FiAlertTriangle,
  FiCheckCircle,
  FiXCircle,
  FiActivity,
  FiGlobe,
  FiClock,
  FiPercent,
  FiTarget,
  FiZap
} from 'react-icons/fi';
import { useLanguage } from '../../hooks/useLanguage';
import AdminLayout from '../../components/AdminLayout';

interface SystemConfig {
  id: string;
  category: 'trading' | 'system' | 'security' | 'notifications' | 'financial' | 'affiliate' | 'external_apis';
  name: string;
  description: string;
  value: string | number | boolean;
  type: 'string' | 'number' | 'boolean' | 'select' | 'password';
  options?: string[];
  required: boolean;
  sensitive: boolean;
  lastModified: string;
  modifiedBy: string;
}

interface SystemStatus {
  apiConnections: {
    bybit: 'connected' | 'disconnected' | 'error';
    telegram: 'connected' | 'disconnected' | 'error';
    database: 'connected' | 'disconnected' | 'error';
    redis: 'connected' | 'disconnected' | 'error';
  };
  performance: {
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    uptime: string;
  };
  tradingStats: {
    activeSignals: number;
    successRate: number;
    totalVolume: number;
    activeUsers: number;
  };
}

const AdminSystem: NextPage = () => {
  const [configs, setConfigs] = useState<SystemConfig[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('trading');
  const [editingConfig, setEditingConfig] = useState<string | null>(null);
  const [pendingChanges, setPendingChanges] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { language } = useLanguage();

  // Mock data - em produção viria da API
  const mockConfigs: SystemConfig[] = [
    // Trading Parameters
    {
      id: 'max_operations_per_user',
      category: 'trading',
      name: 'Operações Simultâneas por Usuário',
      description: 'Número máximo de operações simultâneas permitidas por usuário',
      value: 3,
      type: 'number',
      required: true,
      sensitive: false,
      lastModified: '2025-08-16T10:30:00Z',
      modifiedBy: 'admin@coinbitclub.com'
    },
    {
      id: 'default_entry_percentage',
      category: 'trading',
      name: '% Padrão de Valor de Entrada',
      description: 'Percentual padrão do saldo para entrada em operações',
      value: 5,
      type: 'number',
      required: true,
      sensitive: false,
      lastModified: '2025-08-16T10:30:00Z',
      modifiedBy: 'admin@coinbitclub.com'
    },
    {
      id: 'max_leverage',
      category: 'trading',
      name: 'Alavancagem Máxima (x)',
      description: 'Multiplicador máximo de alavancagem permitido',
      value: 20,
      type: 'number',
      required: true,
      sensitive: false,
      lastModified: '2025-08-16T10:30:00Z',
      modifiedBy: 'admin@coinbitclub.com'
    },
    {
      id: 'stop_loss_multiplier',
      category: 'trading',
      name: 'Stop Loss Padrão (x)',
      description: 'Multiplicador padrão para stop loss automático',
      value: 0.95,
      type: 'number',
      required: true,
      sensitive: false,
      lastModified: '2025-08-15T14:20:00Z',
      modifiedBy: 'admin@coinbitclub.com'
    },
    {
      id: 'take_profit_multiplier',
      category: 'trading',
      name: 'Take Profit Padrão (x)',
      description: 'Multiplicador padrão para take profit automático',
      value: 1.1,
      type: 'number',
      required: true,
      sensitive: false,
      lastModified: '2025-08-15T14:20:00Z',
      modifiedBy: 'admin@coinbitclub.com'
    },
    
    // System Parameters
    {
      id: 'maintenance_mode',
      category: 'system',
      name: 'Modo Manutenção',
      description: 'Ativar modo de manutenção do sistema',
      value: false,
      type: 'boolean',
      required: true,
      sensitive: false,
      lastModified: '2025-08-10T12:00:00Z',
      modifiedBy: 'admin@coinbitclub.com'
    },
    {
      id: 'max_api_requests',
      category: 'system',
      name: 'Máximo de Requests/min',
      description: 'Limite de requests por minuto por usuário',
      value: 100,
      type: 'number',
      required: true,
      sensitive: false,
      lastModified: '2025-08-12T16:45:00Z',
      modifiedBy: 'admin@coinbitclub.com'
    },
    {
      id: 'session_timeout',
      category: 'system',
      name: 'Timeout de Sessão (min)',
      description: 'Tempo limite para sessões inativas',
      value: 30,
      type: 'number',
      required: true,
      sensitive: false,
      lastModified: '2025-08-14T09:30:00Z',
      modifiedBy: 'admin@coinbitclub.com'
    },

    // Security Parameters
    {
      id: '2fa_required',
      category: 'security',
      name: '2FA Obrigatório',
      description: 'Exigir autenticação de dois fatores',
      value: true,
      type: 'boolean',
      required: true,
      sensitive: false,
      lastModified: '2025-08-16T11:00:00Z',
      modifiedBy: 'admin@coinbitclub.com'
    },
    {
      id: 'password_min_length',
      category: 'security',
      name: 'Tamanho Mínimo da Senha',
      description: 'Número mínimo de caracteres para senhas',
      value: 8,
      type: 'number',
      required: true,
      sensitive: false,
      lastModified: '2025-08-15T10:15:00Z',
      modifiedBy: 'admin@coinbitclub.com'
    },
    {
      id: 'jwt_secret',
      category: 'security',
      name: 'JWT Secret',
      description: 'Chave secreta para tokens JWT',
      value: '***HIDDEN***',
      type: 'password',
      required: true,
      sensitive: true,
      lastModified: '2025-08-01T00:00:00Z',
      modifiedBy: 'admin@coinbitclub.com'
    },

    // Financial Parameters
    {
      id: 'commission_rate',
      category: 'financial',
      name: 'Taxa de Comissão (%)',
      description: 'Taxa padrão de comissão para operações',
      value: 2.5,
      type: 'number',
      required: true,
      sensitive: false,
      lastModified: '2025-08-16T13:20:00Z',
      modifiedBy: 'admin@coinbitclub.com'
    },
    {
      id: 'min_deposit',
      category: 'financial',
      name: 'Depósito Mínimo ($)',
      description: 'Valor mínimo para depósitos',
      value: 100,
      type: 'number',
      required: true,
      sensitive: false,
      lastModified: '2025-08-15T11:30:00Z',
      modifiedBy: 'admin@coinbitclub.com'
    },

    // Affiliate Parameters
    {
      id: 'affiliate_commission_rate',
      category: 'affiliate',
      name: 'Comissão de Afiliado (%)',
      description: 'Percentual de comissão para afiliados',
      value: 15,
      type: 'number',
      required: true,
      sensitive: false,
      lastModified: '2025-08-16T14:00:00Z',
      modifiedBy: 'admin@coinbitclub.com'
    },
    {
      id: 'affiliate_min_payout',
      category: 'affiliate',
      name: 'Saque Mínimo Afiliado ($)',
      description: 'Valor mínimo para saque de comissões',
      value: 50,
      type: 'number',
      required: true,
      sensitive: false,
      lastModified: '2025-08-15T15:45:00Z',
      modifiedBy: 'admin@coinbitclub.com'
    },

    // External API Keys
    {
      id: 'twilio_account_sid',
      category: 'external_apis',
      name: 'Twilio Account SID',
      description: 'Account SID para integração Twilio SMS/WhatsApp',
      value: 'AC****************************',
      type: 'password',
      required: true,
      sensitive: true,
      lastModified: '2025-08-16T16:00:00Z',
      modifiedBy: 'admin@coinbitclub.com'
    },
    {
      id: 'twilio_auth_token',
      category: 'external_apis',
      name: 'Twilio Auth Token',
      description: 'Token de autenticação Twilio',
      value: '********************************',
      type: 'password',
      required: true,
      sensitive: true,
      lastModified: '2025-08-16T16:00:00Z',
      modifiedBy: 'admin@coinbitclub.com'
    },
    {
      id: 'stripe_secret_key',
      category: 'external_apis',
      name: 'Stripe Secret Key',
      description: 'Chave secreta para processamento de pagamentos Stripe',
      value: 'sk_live_****************************',
      type: 'password',
      required: true,
      sensitive: true,
      lastModified: '2025-08-16T16:00:00Z',
      modifiedBy: 'admin@coinbitclub.com'
    },
    {
      id: 'stripe_publishable_key',
      category: 'external_apis',
      name: 'Stripe Publishable Key',
      description: 'Chave pública Stripe para frontend',
      value: 'pk_live_****************************',
      type: 'password',
      required: true,
      sensitive: true,
      lastModified: '2025-08-16T16:00:00Z',
      modifiedBy: 'admin@coinbitclub.com'
    },
    {
      id: 'openai_api_key',
      category: 'external_apis',
      name: 'OpenAI API Key',
      description: 'Chave API para integração com ChatGPT/GPT-4',
      value: 'sk-************************************',
      type: 'password',
      required: true,
      sensitive: true,
      lastModified: '2025-08-16T16:00:00Z',
      modifiedBy: 'admin@coinbitclub.com'
    },
    {
      id: 'bybit_api_key',
      category: 'external_apis',
      name: 'Bybit API Key',
      description: 'Chave API para integração com exchange Bybit',
      value: '****************************',
      type: 'password',
      required: true,
      sensitive: true,
      lastModified: '2025-08-16T16:00:00Z',
      modifiedBy: 'admin@coinbitclub.com'
    },
    {
      id: 'bybit_api_secret',
      category: 'external_apis',
      name: 'Bybit API Secret',
      description: 'Secret para autenticação Bybit',
      value: '****************************',
      type: 'password',
      required: true,
      sensitive: true,
      lastModified: '2025-08-16T16:00:00Z',
      modifiedBy: 'admin@coinbitclub.com'
    }
  ];

  const mockSystemStatus: SystemStatus = {
    apiConnections: {
      bybit: 'connected',
      telegram: 'connected',
      database: 'connected',
      redis: 'connected'
    },
    performance: {
      cpuUsage: 45,
      memoryUsage: 68,
      diskUsage: 23,
      uptime: '15 dias, 8 horas'
    },
    tradingStats: {
      activeSignals: 12,
      successRate: 78.5,
      totalVolume: 245000,
      activeUsers: 456
    }
  };

  const categories = [
    { id: 'trading', name: 'Trading', icon: FiTrendingUp, color: 'text-green-400' },
    { id: 'system', name: 'Sistema', icon: FiServer, color: 'text-blue-400' },
    { id: 'security', name: 'Segurança', icon: FiShield, color: 'text-red-400' },
    { id: 'financial', name: 'Financeiro', icon: FiDollarSign, color: 'text-yellow-400' },
    { id: 'affiliate', name: 'Afiliados', icon: FiTarget, color: 'text-purple-400' },
    { id: 'notifications', name: 'Notificações', icon: FiMail, color: 'text-indigo-400' },
    { id: 'external_apis', name: 'APIs Externas', icon: FiGlobe, color: 'text-cyan-400' }
  ];

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setConfigs(mockConfigs);
      setSystemStatus(mockSystemStatus);
      setLoading(false);
    }, 1000);

    // Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'admin_system_view', {
        event_category: 'admin_navigation',
        page_title: 'Admin System Configuration'
      });
    }
  }, []);

  const handleConfigEdit = (configId: string, value: any) => {
    setPendingChanges(prev => ({
      ...prev,
      [configId]: value
    }));
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    
    // Simular salvamento
    setTimeout(() => {
      setConfigs(prev => 
        prev.map(config => 
          pendingChanges[config.id] !== undefined 
            ? { 
                ...config, 
                value: pendingChanges[config.id],
                lastModified: new Date().toISOString(),
                modifiedBy: 'admin@coinbitclub.com'
              }
            : config
        )
      );
      
      setPendingChanges({});
      setEditingConfig(null);
      setSaving(false);

      if (typeof gtag !== 'undefined') {
        gtag('event', 'system_config_saved', {
          event_category: 'admin_action',
          changes_count: Object.keys(pendingChanges).length
        });
      }
    }, 1500);
  };

  const filteredConfigs = configs.filter(config => config.category === selectedCategory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-400 bg-green-500/20';
      case 'disconnected': return 'text-gray-400 bg-gray-500/20';
      case 'error': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <FiCheckCircle className="w-4 h-4" />;
      case 'disconnected': return <FiXCircle className="w-4 h-4" />;
      case 'error': return <FiAlertTriangle className="w-4 h-4" />;
      default: return <FiActivity className="w-4 h-4" />;
    }
  };

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString('pt-BR');
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <p className="text-gray-300">
              {language === 'pt' ? 'Carregando configurações...' : 'Loading configuration...'}
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Sistema/Parâmetros - CoinBitClub Admin">
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900/30 via-blue-900/30 to-purple-900/30 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-3">
                  <FiSettings className="text-purple-400" />
                  {language === 'pt' ? 'Sistema & Parâmetros' : 'System & Parameters'}
                </h1>
                <p className="text-gray-400 mt-1">
                  {language === 'pt' ? 'Configurações avançadas do sistema' : 'Advanced system configuration'}
                </p>
              </div>

              <div className="flex items-center gap-4">
                {Object.keys(pendingChanges).length > 0 && (
                  <button
                    onClick={handleSaveChanges}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-400 rounded-lg transition-all disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-400"></div>
                        <span className="text-sm">Salvando...</span>
                      </>
                    ) : (
                      <>
                        <FiSave className="w-4 h-4" />
                        <span className="text-sm">Salvar ({Object.keys(pendingChanges).length})</span>
                      </>
                    )}
                  </button>
                )}

                <button
                  onClick={() => {/* Refresh system status */}}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-400 rounded-lg transition-all"
                >
                  <FiRefreshCw className="w-4 h-4" />
                  <span className="text-sm">{language === 'pt' ? 'Atualizar' : 'Refresh'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* System Status */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-md rounded-xl p-6 border border-purple-500/20"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <FiActivity className="text-purple-400" />
              Status do Sistema
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {/* Internal Systems Status */}
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-3">Status dos Sistemas Internos</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white flex items-center gap-2">
                      <FiZap className="w-3 h-3" />
                      Sistema de IA
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
                      <FiCheckCircle className="w-3 h-3" />
                      Operacional
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white flex items-center gap-2">
                      <FiActivity className="w-3 h-3" />
                      Leitura do Mercado
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
                      <FiCheckCircle className="w-3 h-3" />
                      Ativo
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white flex items-center gap-2">
                      <FiServer className="w-3 h-3" />
                      Processamento
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
                      <FiCheckCircle className="w-3 h-3" />
                      Normal
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white flex items-center gap-2">
                      <FiTrendingUp className="w-3 h-3" />
                      Sistema de Trading
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
                      <FiCheckCircle className="w-3 h-3" />
                      Executando
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white flex items-center gap-2">
                      <FiShield className="w-3 h-3" />
                      Sistema de Segurança
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
                      <FiCheckCircle className="w-3 h-3" />
                      Protegido
                    </span>
                  </div>
                </div>
              </div>

              {/* Performance */}
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-3">Performance</div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">CPU</span>
                      <span className="text-white">{systemStatus?.performance.cpuUsage}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-400 h-2 rounded-full transition-all"
                        style={{ width: `${systemStatus?.performance.cpuUsage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">RAM</span>
                      <span className="text-white">{systemStatus?.performance.memoryUsage}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full transition-all"
                        style={{ width: `${systemStatus?.performance.memoryUsage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">Disco</span>
                      <span className="text-white">{systemStatus?.performance.diskUsage}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-400 h-2 rounded-full transition-all"
                        style={{ width: `${systemStatus?.performance.diskUsage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trading Stats */}
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-3">Trading</div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Sinais Ativos</span>
                    <span className="text-white font-bold">{systemStatus?.tradingStats.activeSignals}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Taxa de Sucesso</span>
                    <span className="text-green-400 font-bold">{systemStatus?.tradingStats.successRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Volume Total</span>
                    <span className="text-white font-bold">${(systemStatus?.tradingStats.totalVolume || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Usuários Ativos</span>
                    <span className="text-blue-400 font-bold">{systemStatus?.tradingStats.activeUsers}</span>
                  </div>
                </div>
              </div>

              {/* System Info */}
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-3">Sistema</div>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-300">Uptime</span>
                    <div className="text-white font-bold">{systemStatus?.performance.uptime}</div>
                  </div>
                  <div>
                    <span className="text-gray-300">Última Atualização</span>
                    <div className="text-white text-sm">{formatDateTime(new Date().toISOString())}</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Category Navigation */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-md rounded-xl p-6 border border-purple-500/20"
          >
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                const isSelected = selectedCategory === category.id;
                
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                      isSelected 
                        ? 'bg-purple-500/30 border-purple-500/50 text-white' 
                        : 'bg-gray-800/50 border-gray-600/50 text-gray-400 hover:bg-gray-700/50 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-purple-400' : category.color}`} />
                    <span className="text-sm font-medium">{category.name}</span>
                    <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">
                      {configs.filter(c => c.category === category.id).length}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Configuration Settings */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-md rounded-xl border border-purple-500/20 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-700/50">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <FiZap className="text-purple-400" />
                Configurações - {categories.find(c => c.id === selectedCategory)?.name}
              </h3>
            </div>

            <div className="p-6 space-y-4">
              <AnimatePresence>
                {filteredConfigs.map((config, index) => (
                  <motion.div
                    key={config.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-white">{config.name}</h4>
                          {config.sensitive && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs">
                              <FiLock className="w-3 h-3" />
                              Sensível
                            </span>
                          )}
                          {config.required && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs">
                              <FiAlertTriangle className="w-3 h-3" />
                              Obrigatório
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm mb-3">{config.description}</p>
                        <div className="text-xs text-gray-500">
                          Modificado em {formatDateTime(config.lastModified)} por {config.modifiedBy}
                        </div>
                      </div>

                      <button
                        onClick={() => setEditingConfig(editingConfig === config.id ? null : config.id)}
                        className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-400 hover:text-blue-300 transition-all"
                        title="Editar"
                      >
                        <FiEdit3 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      {editingConfig === config.id ? (
                        <div className="flex-1">
                          {config.type === 'boolean' ? (
                            <button
                              onClick={() => handleConfigEdit(config.id, !config.value)}
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                                (pendingChanges[config.id] !== undefined ? pendingChanges[config.id] : config.value)
                                  ? 'bg-green-500/20 border-green-500/50 text-green-400'
                                  : 'bg-gray-600/20 border-gray-600/50 text-gray-400'
                              }`}
                            >
                              {(pendingChanges[config.id] !== undefined ? pendingChanges[config.id] : config.value) ? (
                                <FiToggleRight className="w-5 h-5" />
                              ) : (
                                <FiToggleLeft className="w-5 h-5" />
                              )}
                              <span>
                                {(pendingChanges[config.id] !== undefined ? pendingChanges[config.id] : config.value) 
                                  ? 'Habilitado' : 'Desabilitado'
                                }
                              </span>
                            </button>
                          ) : config.type === 'select' && config.options ? (
                            <select
                              value={pendingChanges[config.id] !== undefined ? pendingChanges[config.id] : config.value}
                              onChange={(e) => handleConfigEdit(config.id, e.target.value)}
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            >
                              {config.options.map(option => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={config.type === 'password' ? 'password' : config.type === 'number' ? 'number' : 'text'}
                              value={pendingChanges[config.id] !== undefined ? pendingChanges[config.id] : config.value}
                              onChange={(e) => handleConfigEdit(config.id, config.type === 'number' ? parseFloat(e.target.value) : e.target.value)}
                              placeholder={config.name}
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            />
                          )}
                        </div>
                      ) : (
                        <div className="flex-1">
                          <div className="text-lg font-semibold text-white">
                            {config.type === 'boolean' ? (
                              <span className={`inline-flex items-center gap-2 ${config.value ? 'text-green-400' : 'text-gray-400'}`}>
                                {config.value ? <FiToggleRight className="w-5 h-5" /> : <FiToggleLeft className="w-5 h-5" />}
                                {config.value ? 'Habilitado' : 'Desabilitado'}
                              </span>
                            ) : config.type === 'password' ? (
                              <span className="text-gray-400 font-mono">***HIDDEN***</span>
                            ) : config.type === 'number' ? (
                              <span>{config.value}{config.name.includes('%') ? '%' : config.name.includes('$') ? '' : ''}</span>
                            ) : (
                              config.value
                            )}
                          </div>
                        </div>
                      )}

                      {pendingChanges[config.id] !== undefined && (
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-400 text-sm">Modificado</span>
                          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSystem;
