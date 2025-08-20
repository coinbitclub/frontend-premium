import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import AdminLayout from '../../components/AdminLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiActivity, 
  FiFilter,
  FiDownload,
  FiSearch,
  FiRefreshCw,
  FiEye,
  FiAlertTriangle,
  FiCheckCircle,
  FiXCircle,
  FiInfo,
  FiClock,
  FiUser,
  FiServer,
  FiShield,
  FiDollarSign,
  FiTrendingUp,
  FiMail,
  FiDatabase,
  FiGlobe,
  FiCalendar
} from 'react-icons/fi';
import { useLanguage } from '../../hooks/useLanguage';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  category: 'authentication' | 'trading' | 'system' | 'financial' | 'security' | 'api' | 'database';
  message: string;
  details?: any;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  endpoint?: string;
  duration?: number;
}

interface LogStats {
  totalLogs: number;
  errorRate: number;
  warningCount: number;
  successRate: number;
  topCategories: Array<{ name: string; count: number }>;
  recentErrors: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
}

const AdminLogs: NextPage = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [stats, setStats] = useState<LogStats | null>(null);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [filterLevel, setFilterLevel] = useState<'all' | 'info' | 'warning' | 'error' | 'success'>('all');
  const [filterCategory, setFilterCategory] = useState<'all' | 'authentication' | 'trading' | 'system' | 'financial' | 'security' | 'api' | 'database'>('all');
  const [filterPeriod, setFilterPeriod] = useState<'1h' | '6h' | '24h' | '7d'>('24h');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const { language } = useLanguage();

  // Mock data - em produção viria da API
  const mockLogs: LogEntry[] = [
    {
      id: '1',
      timestamp: '2025-08-16T14:30:25Z',
      level: 'success',
      category: 'authentication',
      message: 'Login realizado com sucesso',
      userId: 'user123@example.com',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      details: { loginMethod: '2FA', sessionId: 'sess_abc123' }
    },
    {
      id: '2',
      timestamp: '2025-08-16T14:25:15Z',
      level: 'info',
      category: 'trading',
      message: 'Sinal de compra executado automaticamente',
      userId: 'trader@example.com',
      details: { 
        symbol: 'BTCUSDT', 
        quantity: 0.5, 
        price: 45000, 
        orderId: 'order_xyz789' 
      }
    },
    {
      id: '3',
      timestamp: '2025-08-16T14:20:10Z',
      level: 'warning',
      category: 'system',
      message: 'Uso de CPU acima de 80%',
      details: { 
        cpuUsage: 85.4, 
        threshold: 80, 
        duration: '5 minutes' 
      }
    },
    {
      id: '4',
      timestamp: '2025-08-16T14:15:05Z',
      level: 'error',
      category: 'api',
      message: 'Falha na conexão com Bybit API',
      endpoint: '/api/v5/market/tickers',
      duration: 5000,
      details: { 
        error: 'Connection timeout', 
        retryCount: 3, 
        statusCode: 408 
      }
    },
    {
      id: '5',
      timestamp: '2025-08-16T14:10:00Z',
      level: 'info',
      category: 'financial',
      message: 'Comissão de afiliado processada',
      userId: 'affiliate@example.com',
      details: { 
        amount: 25.50, 
        referralUser: 'newuser@example.com', 
        transactionId: 'comm_def456' 
      }
    },
    {
      id: '6',
      timestamp: '2025-08-16T14:05:30Z',
      level: 'warning',
      category: 'security',
      message: 'Tentativa de login suspeita detectada',
      ipAddress: '45.123.87.21',
      userAgent: 'curl/7.68.0',
      details: { 
        reason: 'Multiple failed attempts', 
        attempts: 15, 
        blocked: true 
      }
    },
    {
      id: '7',
      timestamp: '2025-08-16T14:00:45Z',
      level: 'success',
      category: 'trading',
      message: 'Take profit atingido',
      userId: 'vip@example.com',
      details: { 
        symbol: 'ETHUSDT', 
        profitAmount: 125.80, 
        percentage: 8.5 
      }
    },
    {
      id: '8',
      timestamp: '2025-08-16T13:55:20Z',
      level: 'error',
      category: 'database',
      message: 'Timeout na consulta ao banco de dados',
      endpoint: '/api/users/transactions',
      duration: 10000,
      details: { 
        query: 'SELECT * FROM transactions WHERE user_id = ?', 
        timeout: 10000 
      }
    }
  ];

  const mockStats: LogStats = {
    totalLogs: 15420,
    errorRate: 3.2,
    warningCount: 45,
    successRate: 94.5,
    topCategories: [
      { name: 'Trading', count: 5240 },
      { name: 'Authentication', count: 3120 },
      { name: 'System', count: 2890 },
      { name: 'API', count: 2340 },
      { name: 'Financial', count: 1830 }
    ],
    recentErrors: 12,
    systemHealth: 'healthy'
  };

  const levels = [
    { id: 'all', name: 'Todos', color: 'text-gray-400', bg: 'bg-gray-500/20' },
    { id: 'info', name: 'Info', color: 'text-blue-400', bg: 'bg-blue-500/20' },
    { id: 'success', name: 'Sucesso', color: 'text-green-400', bg: 'bg-green-500/20' },
    { id: 'warning', name: 'Aviso', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
    { id: 'error', name: 'Erro', color: 'text-red-400', bg: 'bg-red-500/20' }
  ];

  const categories = [
    { id: 'all', name: 'Todas', icon: FiActivity },
    { id: 'authentication', name: 'Autenticação', icon: FiShield },
    { id: 'trading', name: 'Trading', icon: FiTrendingUp },
    { id: 'system', name: 'Sistema', icon: FiServer },
    { id: 'financial', name: 'Financeiro', icon: FiDollarSign },
    { id: 'security', name: 'Segurança', icon: FiShield },
    { id: 'api', name: 'API', icon: FiGlobe }
  ];

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setLogs(mockLogs);
      setStats(mockStats);
      setLoading(false);
    }, 1000);

    // Auto refresh
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(() => {
        // Simular novos logs
        const newLog: LogEntry = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          level: ['info', 'success', 'warning', 'error'][Math.floor(Math.random() * 4)] as any,
          category: ['authentication', 'trading', 'system', 'api'][Math.floor(Math.random() * 4)] as any,
          message: 'Novo evento do sistema',
          details: { autoGenerated: true }
        };
        
        setLogs(prev => [newLog, ...prev.slice(0, 49)]); // Manter apenas 50 logs mais recentes
      }, 5000);
    }

    // Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'admin_logs_view', {
        event_category: 'admin_navigation',
        page_title: 'Admin Logs Monitoring'
      });
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const filteredLogs = logs.filter(log => {
    const matchesLevel = filterLevel === 'all' || log.level === filterLevel;
    const matchesCategory = filterCategory === 'all' || log.category === filterCategory;
    const matchesSearch = searchTerm === '' || 
                         log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (log.userId && log.userId.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (log.ipAddress && log.ipAddress.includes(searchTerm));
    
    // Filtro de período
    const logTime = new Date(log.timestamp);
    const now = new Date();
    const periodMs = {
      '1h': 60 * 60 * 1000,
      '6h': 6 * 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000
    }[filterPeriod];
    
    const matchesPeriod = (now.getTime() - logTime.getTime()) <= periodMs;
    
    return matchesLevel && matchesCategory && matchesSearch && matchesPeriod;
  });

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'info': return <FiInfo className="w-4 h-4" />;
      case 'success': return <FiCheckCircle className="w-4 h-4" />;
      case 'warning': return <FiAlertTriangle className="w-4 h-4" />;
      case 'error': return <FiXCircle className="w-4 h-4" />;
      default: return <FiActivity className="w-4 h-4" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'info': return 'text-blue-400 bg-blue-500/20';
      case 'success': return 'text-green-400 bg-green-500/20';
      case 'warning': return 'text-yellow-400 bg-yellow-500/20';
      case 'error': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(c => c.id === category);
    const Icon = categoryData?.icon || FiActivity;
    return <Icon className="w-4 h-4" />;
  };

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString('pt-BR');
  };

  const formatDuration = (duration?: number) => {
    if (!duration) return '';
    return duration > 1000 ? `${(duration / 1000).toFixed(1)}s` : `${duration}ms`;
  };

  if (loading) {
    return (
      <AdminLayout title="Logs do Sistema - CoinBitClub Admin">
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <p className="text-gray-300">
              {language === 'pt' ? 'Carregando logs...' : 'Loading logs...'}
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Logs do Sistema - CoinBitClub Admin">
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900/30 via-blue-900/30 to-purple-900/30 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-3">
                  <FiActivity className="text-purple-400" />
                  {language === 'pt' ? 'Logs do Sistema' : 'System Logs'}
                </h1>
                <p className="text-gray-400 mt-1">
                  {language === 'pt' ? 'Monitoramento em tempo real' : 'Real-time monitoring'}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-all ${
                    autoRefresh 
                      ? 'bg-green-500/20 border-green-500/50 text-green-400' 
                      : 'bg-gray-500/20 border-gray-500/50 text-gray-400'
                  }`}
                >
                  <FiRefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
                  <span className="text-sm">{autoRefresh ? 'Auto' : 'Manual'}</span>
                </button>

                <button
                  onClick={() => {/* Export logs */}}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-400 rounded-lg transition-all"
                >
                  <FiDownload className="w-4 h-4" />
                  <span className="text-sm">{language === 'pt' ? 'Exportar' : 'Export'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* System Health Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-md rounded-xl p-6 border border-purple-500/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <FiActivity className="text-purple-400 text-xl" />
                <h3 className="text-white font-semibold">Total Logs</h3>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{stats?.totalLogs.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Registros</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-md rounded-xl p-6 border border-purple-500/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <FiXCircle className="text-red-400 text-xl" />
                <h3 className="text-white font-semibold">Taxa de Erro</h3>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{stats?.errorRate}%</div>
              <div className="text-sm text-red-400">{stats?.recentErrors} erros recentes</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-md rounded-xl p-6 border border-purple-500/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <FiAlertTriangle className="text-yellow-400 text-xl" />
                <h3 className="text-white font-semibold">Avisos</h3>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{stats?.warningCount}</div>
              <div className="text-sm text-yellow-400">Últimas 24h</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-md rounded-xl p-6 border border-purple-500/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <FiCheckCircle className="text-green-400 text-xl" />
                <h3 className="text-white font-semibold">Sucesso</h3>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{stats?.successRate}%</div>
              <div className="text-sm text-green-400">Taxa de sucesso</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-md rounded-xl p-6 border border-purple-500/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <FiServer className={`text-xl ${
                  stats?.systemHealth === 'healthy' ? 'text-green-400' :
                  stats?.systemHealth === 'warning' ? 'text-yellow-400' : 'text-red-400'
                }`} />
                <h3 className="text-white font-semibold">Saúde</h3>
              </div>
              <div className={`text-2xl font-bold mb-2 ${
                stats?.systemHealth === 'healthy' ? 'text-green-400' :
                stats?.systemHealth === 'warning' ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {stats?.systemHealth === 'healthy' ? 'Saudável' :
                 stats?.systemHealth === 'warning' ? 'Atenção' : 'Crítico'}
              </div>
              <div className="text-sm text-gray-400">Status geral</div>
            </motion.div>
          </div>

          {/* Filters */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-md rounded-xl p-6 border border-purple-500/20"
          >
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder={language === 'pt' ? 'Buscar logs...' : 'Search logs...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <FiFilter className="text-gray-400 w-4 h-4" />
                  <select
                    value={filterLevel}
                    onChange={(e) => setFilterLevel(e.target.value as any)}
                    className="bg-gray-800/50 border border-gray-600/50 rounded-lg text-white px-3 py-2 focus:outline-none focus:border-purple-500/50"
                  >
                    {levels.map(level => (
                      <option key={level.id} value={level.id}>{level.name}</option>
                    ))}
                  </select>
                </div>

                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value as any)}
                  className="bg-gray-800/50 border border-gray-600/50 rounded-lg text-white px-3 py-2 focus:outline-none focus:border-purple-500/50"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>

                <div className="flex items-center gap-2">
                  <FiClock className="text-gray-400 w-4 h-4" />
                  <select
                    value={filterPeriod}
                    onChange={(e) => setFilterPeriod(e.target.value as any)}
                    className="bg-gray-800/50 border border-gray-600/50 rounded-lg text-white px-3 py-2 focus:outline-none focus:border-purple-500/50"
                  >
                    <option value="1h">Última hora</option>
                    <option value="6h">Últimas 6h</option>
                    <option value="24h">Últimas 24h</option>
                    <option value="7d">Últimos 7 dias</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Logs List */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-md rounded-xl border border-purple-500/20 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-700/50">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <FiDatabase className="text-purple-400" />
                Registros de Log ({filteredLogs.length})
              </h3>
            </div>

            <div className="max-h-[600px] overflow-y-auto">
              <AnimatePresence>
                {filteredLogs.map((log, index) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 border-b border-gray-700/30 hover:bg-gray-800/30 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(log.level)}`}>
                          {getLevelIcon(log.level)}
                          {log.level}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-700/50 text-gray-300 rounded text-xs">
                            {getCategoryIcon(log.category)}
                            {categories.find(c => c.id === log.category)?.name}
                          </span>
                          
                          <span className="text-gray-400 text-xs">
                            {formatDateTime(log.timestamp)}
                          </span>

                          {log.duration && (
                            <span className="text-orange-400 text-xs">
                              {formatDuration(log.duration)}
                            </span>
                          )}
                        </div>

                        <div className="text-white font-medium mb-1">
                          {log.message}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          {log.userId && (
                            <span className="flex items-center gap-1">
                              <FiUser className="w-3 h-3" />
                              {log.userId}
                            </span>
                          )}
                          
                          {log.ipAddress && (
                            <span className="flex items-center gap-1">
                              <FiGlobe className="w-3 h-3" />
                              {log.ipAddress}
                            </span>
                          )}
                          
                          {log.endpoint && (
                            <span className="flex items-center gap-1">
                              <FiServer className="w-3 h-3" />
                              {log.endpoint}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-400 hover:text-blue-300 transition-all"
                          title="Ver detalhes"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Log Details Modal */}
      <LogDetailsModal 
        log={selectedLog}
        onClose={() => setSelectedLog(null)}
        language={language}
      />
    </AdminLayout>
  );
};

// Modal Component
const LogDetailsModal: React.FC<{
  log: LogEntry | null;
  onClose: () => void;
  language: string;
}> = ({ log, onClose, language }) => {
  if (!log) return null;

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString('pt-BR');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 w-full max-w-2xl border border-purple-500/20 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">
            Detalhes do Log
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-all"
          >
            <FiXCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Nível</div>
              <div className="text-white font-medium capitalize">{log.level}</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Categoria</div>
              <div className="text-white font-medium capitalize">{log.category}</div>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Timestamp</div>
            <div className="text-white font-medium">{formatDateTime(log.timestamp)}</div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Mensagem</div>
            <div className="text-white">{log.message}</div>
          </div>

          {log.userId && (
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Usuário</div>
              <div className="text-white font-mono">{log.userId}</div>
            </div>
          )}

          {log.ipAddress && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">IP Address</div>
                <div className="text-white font-mono">{log.ipAddress}</div>
              </div>
              {log.duration && (
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Duração</div>
                  <div className="text-white font-medium">
                    {log.duration > 1000 ? `${(log.duration / 1000).toFixed(1)}s` : `${log.duration}ms`}
                  </div>
                </div>
              )}
            </div>
          )}

          {log.endpoint && (
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Endpoint</div>
              <div className="text-white font-mono">{log.endpoint}</div>
            </div>
          )}

          {log.userAgent && (
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">User Agent</div>
              <div className="text-white text-sm break-all">{log.userAgent}</div>
            </div>
          )}

          {log.details && (
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">Detalhes</div>
              <pre className="text-white text-sm bg-gray-900/50 p-3 rounded border overflow-x-auto">
                {JSON.stringify(log.details, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-all"
          >
            Fechar
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogs;
