import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../hooks/useLanguage';
import UserLayout from '../../components/UserLayout';
import performanceService from '../../src/services/performanceService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  FiTrendingUp, 
  FiCalendar, 
  FiDollarSign, 
  FiPercent,
  FiBarChart,
  FiPieChart,
  FiTarget,
  FiActivity,
  FiAward,
  FiClock,
  FiUsers,
  FiTrendingDown
} from 'react-icons/fi';
// Authentication removed - ProtectedRoute disabled

const IS_DEV = process.env.NODE_ENV === 'development';

const UserPerformance: React.FC = () => {
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [metricsData, setMetricsData] = useState<any>(null);
  const [recentOperations, setRecentOperations] = useState<any[]>([]);
  const [distributionData, setDistributionData] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);

  const fetchPerformanceData = useCallback(async () => {
      if (!mounted) return;

      try {
        setLoading(true);
        IS_DEV && console.log('📈 Performance: Loading data...');

        // Fetch all performance data in parallel
        const [overview, metrics, operations, distribution, chart] = await Promise.all([
          performanceService.getPerformanceOverview(),
          performanceService.getPerformanceMetrics(),
          performanceService.getRecentOperations(8),
          performanceService.getDistributionData(),
          performanceService.getChartData('30d')
        ]);

        setPerformanceData(overview);
        setMetricsData(metrics);
        setRecentOperations(operations);
        setDistributionData(distribution);
        setChartData(chart);
        
        IS_DEV && console.log('✅ Performance: Data loaded');
      } catch (error) {
        console.error('Error fetching performance data:', error);
        // Check if it's an auth error
        if (error.response?.status === 401) {
          setAuthError(true);
        }
      } finally {
        setLoading(false);
      }
    }, [mounted]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetchPerformanceData();
  }, [fetchPerformanceData]);

  if (!mounted || loading) {
    return (
      <>
      <UserLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-400 mb-4 mx-auto"></div>
            <h2 className="text-2xl font-bold text-white mb-2">CoinBitClub</h2>
            <p className="text-gray-400">{language === 'pt' ? 'Carregando dados de performance...' : 'Loading performance data...'}</p>
          </div>
        </div>
      </UserLayout>
      </>
    );
  }

  // Show mock data if there are auth issues but don't redirect
  if (authError) {
    IS_DEV && console.log('Authentication error detected, showing demo data instead of redirecting');
  }

  // Memoize distribution display data
  const distributionDisplay = useMemo(() => 
    distributionData.length > 0 ? distributionData : [
      { label: 'BTC', percentage: 35, value: 1247.50, color: 'orange' },
      { label: 'ETH', percentage: 28, value: 892.30, color: 'blue' },
      { label: 'ADA', percentage: 22, value: 634.20, color: 'green' },
      { label: 'SOL', percentage: 15, value: 425.80, color: 'purple' }
    ],
    [distributionData]
  );

  // Memoize recent operations display data
  const operationsDisplay = useMemo(() => 
    recentOperations.length > 0 ? recentOperations : [
      { symbol: 'BTC/USDT', direction: 'LONG', profit: 247.80, profitPercentage: 2.48, openTime: '2024-01-15T14:32:00', status: 'CLOSED' },
      { symbol: 'ETH/USDT', direction: 'SHORT', profit: -45.30, profitPercentage: -1.2, openTime: '2024-01-15T13:45:00', status: 'CLOSED' },
      { symbol: 'ADA/USDT', direction: 'LONG', profit: 78.90, profitPercentage: 1.85, openTime: '2024-01-15T12:15:00', status: 'CLOSED' },
      { symbol: 'SOL/USDT', direction: 'LONG', profit: 156.40, profitPercentage: 3.2, openTime: '2024-01-15T11:30:00', status: 'CLOSED' },
      { symbol: 'BTC/USDT', direction: 'SHORT', profit: -23.10, profitPercentage: -0.8, openTime: '2024-01-15T10:45:00', status: 'CLOSED' },
      { symbol: 'ETH/USDT', direction: 'LONG', profit: 89.50, profitPercentage: 2.1, openTime: '2024-01-14T16:20:00', status: 'CLOSED' },
      { symbol: 'DOT/USDT', direction: 'LONG', profit: 34.70, profitPercentage: 1.4, openTime: '2024-01-14T15:10:00', status: 'CLOSED' },
      { symbol: 'BTC/USDT', direction: 'LONG', profit: 312.80, profitPercentage: 4.2, openTime: '2024-01-14T14:25:00', status: 'CLOSED' }
    ],
    [recentOperations]
  );

  return (
    <UserLayout>
      <div className="p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            {language === 'pt' ? 'Performance' : 'Performance'}
          </h1>
          <p className="text-gray-400">
            {language === 'pt' ? 'Acompanhe seu desempenho de investimentos' : 'Track your investment performance'}
          </p>
        </motion.div>

        {/* Performance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-green-900/40 to-green-800/30 backdrop-blur-sm rounded-xl border border-green-500/30 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <FiTrendingUp className="w-8 h-8 text-green-400" />
              <div>
                <h3 className="text-lg font-bold text-green-400">
                  {language === 'pt' ? 'Ganho Hoje' : 'Today\'s Gain'}
                </h3>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {performanceData?.todayGain?.amount >= 0 ? '+' : ''}${performanceData?.todayGain?.amount?.toFixed(2) || '0.00'}
            </div>
            <div className={`text-sm ${performanceData?.todayGain?.change === 'positive' ? 'text-green-400' : 'text-red-400'}`}>
              {performanceData?.todayGain?.percentage >= 0 ? '+' : ''}{performanceData?.todayGain?.percentage?.toFixed(2) || '0.00'}% {language === 'pt' ? 'hoje' : 'today'}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-blue-900/40 to-blue-800/30 backdrop-blur-sm rounded-xl border border-blue-500/30 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <FiPercent className="w-8 h-8 text-blue-400" />
              <div>
                <h3 className="text-lg font-bold text-blue-400">
                  {language === 'pt' ? 'Taxa de Sucesso' : 'Win Rate'}
                </h3>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">{performanceData?.winRate?.percentage?.toFixed(1) || '0.0'}%</div>
            <div className="text-blue-400 text-sm">{performanceData?.winRate?.operations?.total || 0} {language === 'pt' ? 'operações' : 'operations'}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-purple-900/40 to-purple-800/30 backdrop-blur-sm rounded-xl border border-purple-500/30 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <FiCalendar className="w-8 h-8 text-purple-400" />
              <div>
                <h3 className="text-lg font-bold text-purple-400">
                  {language === 'pt' ? 'Retorno Total' : 'Total Return'}
                </h3>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">+{performanceData?.totalReturn?.percentage?.toFixed(1) || '0.0'}%</div>
            <div className="text-purple-400 text-sm">{language === 'pt' ? 'Desde o início' : 'Since start'}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-orange-900/40 to-orange-800/30 backdrop-blur-sm rounded-xl border border-orange-500/30 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <FiDollarSign className="w-8 h-8 text-orange-400" />
              <div>
                <h3 className="text-lg font-bold text-orange-400">
                  {language === 'pt' ? 'Total Operações' : 'Total Operations'}
                </h3>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">{performanceData?.totalOperations?.count?.toLocaleString() || '0'}</div>
            <div className="text-orange-400 text-sm">{language === 'pt' ? 'Executadas' : 'Executed'}</div>
          </motion.div>
        </div>

        {/* Performance Chart Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-slate-900/40 to-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-500/30 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <FiBarChart className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-bold text-white">
                {language === 'pt' ? 'Evolução Mensal' : 'Monthly Evolution'}
              </h2>
            </div>
            <div className="h-64">
              {chartData && chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="date"
                      stroke="#9CA3AF"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                    />
                    <YAxis
                      stroke="#9CA3AF"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `$${value.toFixed(0)}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F3F4F6'
                      }}
                      labelFormatter={(value) => new Date(value).toLocaleDateString('pt-BR')}
                      formatter={(value: number, name: string) => [`$${value.toFixed(2)}`, name === 'profit' ? 'Profit' : name]}
                    />
                    <Line
                      type="monotone"
                      dataKey="profit"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <FiTrendingUp className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <p>{language === 'pt' ? 'Dados de gráfico não disponíveis' : 'Chart data not available'}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-slate-900/40 to-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-500/30 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <FiPieChart className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-bold text-white">
                {language === 'pt' ? 'Distribuição por Par' : 'Distribution by Pair'}
              </h2>
            </div>
            <div className="space-y-4">
              {distributionDisplay.map((item) => (
                <div key={item.label || item.pair} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full bg-${item.color}-400`}></div>
                    <span className="text-white font-medium">{item.label || item.pair}/USDT</span>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-medium">+${(item.value || parseFloat(item.profit?.replace(/[$,+]/g, '') || '0')).toFixed(2)}</div>
                    <div className="text-gray-400 text-sm">{item.percentage?.toFixed(1) || '0.0'}%</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-br from-emerald-900/40 to-emerald-800/30 backdrop-blur-sm rounded-xl border border-emerald-500/30 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <FiTarget className="w-6 h-6 text-emerald-400" />
              <h3 className="text-lg font-bold text-emerald-400">
                {language === 'pt' ? 'Melhor Mês' : 'Best Month'}
              </h3>
            </div>
            <div className="text-2xl font-bold text-white mb-2">{metricsData?.bestMonth?.month || 'N/A'}</div>
            <div className="text-emerald-400">+${metricsData?.bestMonth?.profit?.toFixed(2) || '0.00'}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-br from-amber-900/40 to-amber-800/30 backdrop-blur-sm rounded-xl border border-amber-500/30 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <FiAward className="w-6 h-6 text-amber-400" />
              <h3 className="text-lg font-bold text-amber-400">
                {language === 'pt' ? 'Maior Lucro' : 'Biggest Profit'}
              </h3>
            </div>
            <div className="text-2xl font-bold text-white mb-2">{metricsData?.biggestProfit?.pair || 'N/A'}</div>
            <div className="text-amber-400">+${metricsData?.biggestProfit?.profit?.toFixed(2) || '0.00'} (+{metricsData?.biggestProfit?.percentage?.toFixed(1) || '0.0'}%)</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-gradient-to-br from-cyan-900/40 to-cyan-800/30 backdrop-blur-sm rounded-xl border border-cyan-500/30 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <FiClock className="w-6 h-6 text-cyan-400" />
              <h3 className="text-lg font-bold text-cyan-400">
                {language === 'pt' ? 'Tempo Médio' : 'Average Time'}
              </h3>
            </div>
            <div className="text-2xl font-bold text-white mb-2">{metricsData?.averageTime?.time || '24min'}</div>
            <div className="text-cyan-400">{language === 'pt' ? 'Por operação' : 'Per operation'}</div>
          </motion.div>
        </div>

        {/* Recent Operations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-gradient-to-br from-slate-900/40 to-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-500/30 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FiActivity className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-bold text-white">
                {language === 'pt' ? 'Últimas Operações' : 'Recent Operations'}
              </h2>
            </div>
            <span className="text-gray-400 text-sm">
              {language === 'pt' ? 'Últimas 10' : 'Last 10'}
            </span>
          </div>
          <div className="space-y-3">
            {operationsDisplay.map((operation, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-gray-600/30 hover:border-blue-400/50 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${
                    (operation.status === 'completed' || operation.status === 'CLOSED') ? 'bg-green-400' : 'bg-yellow-400'
                  }`}></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{operation.symbol || operation.pair}</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        (operation.direction || operation.type) === 'LONG'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {operation.direction || operation.type}
                      </span>
                    </div>
                    <div className="text-gray-400 text-sm">
                      {new Date(operation.openTime || operation.date).toLocaleDateString('pt-BR')} às {new Date(operation.openTime || operation.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${operation.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {operation.profit >= 0 ? '+' : ''}${operation.profit.toFixed(2)}
                  </div>
                  <div className={`text-sm ${operation.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {operation.profit >= 0 ? '+' : ''}{(operation.profitPercentage || operation.percentage).toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </UserLayout>
  );
};

export default UserPerformance;
