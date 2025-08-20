import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { motion, AnimatePresence } from 'framer-motion';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import {
  FiBarChart2,
  FiTrendingUp,
  FiUsers,
  FiDollarSign,
  FiTarget,
  FiArrowUpRight,
  FiArrowDownRight,
  FiRefreshCw,
  FiDownload,
  FiFilter,
  FiCalendar,
  FiGlobe,
  FiSmartphone,
  FiMonitor,
  FiTablet
} from 'react-icons/fi';
import { useLanguage } from '../../hooks/useLanguage';
import AdminLayout from '../../components/AdminLayout';

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

// Interfaces
interface KPIData {
  totalUsers: number;
  userGrowthRate: number;
  activeUsers: number;
  totalRevenue: number;
  revenueGrowthRate: number;
  totalAffiliates: number;
  affiliateGrowthRate: number;
  conversionRate: number;
  avgSessionTime: string;
  bounceRate: number;
}

interface ChartData {
  labels: string[];
  datasets: any[];
}

interface DeviceData {
  desktop: number;
  mobile: number;
  tablet: number;
}

interface GeographicData {
  country: string;
  users: number;
  percentage: number;
}

type TimePeriod = '7d' | '30d' | '90d' | '1y';

const AdminAnalytics: NextPage = () => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('30d');
  const [activeChart, setActiveChart] = useState<string>('growth');

  // Mock data para demonstração
  const mockKPIs: KPIData = {
    totalUsers: 4968,
    userGrowthRate: 12.8,
    activeUsers: 3847,
    totalRevenue: 112000,
    revenueGrowthRate: 18.5,
    totalAffiliates: 1184,
    affiliateGrowthRate: 14.2,
    conversionRate: 23.7,
    avgSessionTime: '4m 32s',
    bounceRate: 31.2
  };

  const mockUserGrowthData: ChartData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Usuários Totais',
        data: [3200, 3450, 3780, 4100, 4350, 4650, 4968],
        borderColor: '#FFD700',
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Usuários Ativos',
        data: [2400, 2650, 2890, 3120, 3320, 3580, 3847],
        borderColor: '#FF69B4',
        backgroundColor: 'rgba(255, 105, 180, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const mockRevenueData: ChartData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Receita Mensal (R$)',
        data: [85000, 92000, 98000, 105000, 108000, 110000, 112000],
        backgroundColor: [
          'rgba(255, 215, 0, 0.8)',
          'rgba(255, 105, 180, 0.8)',
          'rgba(0, 191, 255, 0.8)',
          'rgba(255, 215, 0, 0.6)',
          'rgba(255, 105, 180, 0.6)',
          'rgba(0, 191, 255, 0.6)',
          'rgba(255, 215, 0, 0.9)'
        ],
        borderColor: '#FFD700',
        borderWidth: 2
      }
    ]
  };

  const mockAffiliateData: ChartData = {
    labels: ['Iniciante', 'Intermediário', 'Avançado', 'Expert', 'Master'],
    datasets: [
      {
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          'rgba(255, 215, 0, 0.8)',
          'rgba(255, 105, 180, 0.8)',
          'rgba(0, 191, 255, 0.8)',
          'rgba(255, 165, 0, 0.8)',
          'rgba(255, 20, 147, 0.8)'
        ],
        borderColor: [
          '#FFD700',
          '#FF69B4',
          '#00BFFF',
          '#FFA500',
          '#FF1493'
        ],
        borderWidth: 2
      }
    ]
  };

  const mockSatisfactionData: ChartData = {
    labels: ['Muito Satisfeito', 'Satisfeito', 'Neutro', 'Insatisfeito', 'Muito Insatisfeito'],
    datasets: [
      {
        data: [45, 35, 12, 6, 2],
        backgroundColor: [
          'rgba(255, 215, 0, 0.8)',
          'rgba(255, 105, 180, 0.8)',
          'rgba(0, 191, 255, 0.8)',
          'rgba(255, 165, 0, 0.8)',
          'rgba(220, 20, 60, 0.8)'
        ],
        borderColor: [
          '#FFD700',
          '#FF69B4',
          '#00BFFF',
          '#FFA500',
          '#DC143C'
        ],
        borderWidth: 2
      }
    ]
  };

  const mockDeviceData: DeviceData = {
    desktop: 45,
    mobile: 42,
    tablet: 13
  };

  const mockGeographicData: GeographicData[] = [
    { country: 'Brasil', users: 2847, percentage: 57.3 },
    { country: 'Estados Unidos', users: 892, percentage: 18.0 },
    { country: 'Argentina', users: 456, percentage: 9.2 },
    { country: 'México', users: 324, percentage: 6.5 },
    { country: 'Outros', users: 449, percentage: 9.0 }
  ];

  useEffect(() => {
    // Registrar Chart.js no lado do cliente
    const registerCharts = async () => {
      ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        BarElement,
        Title,
        Tooltip,
        Legend,
        ArcElement,
        Filler
      );
      setLoading(false);
    };

    registerCharts();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simular carregamento
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#ffffff',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#FFD700',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#9ca3af'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      y: {
        ticks: {
          color: '#9ca3af'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Analytics - CoinBitClub Admin">
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-yellow-900/20 to-pink-900/20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
            <p className="text-gray-300">Carregando analytics...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Analytics - CoinBitClub Admin">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-pink-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-3 mb-2">
              <FiBarChart2 className="text-yellow-400" />
              {language === 'pt' ? 'Analytics & Insights' : 'Analytics & Insights'}
            </h1>
            <p className="text-gray-400">
              {language === 'pt' ? 'Análise de crescimento, experiência do usuário e performance' : 'Growth analysis, user experience and performance'}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as any)}
              className="bg-gray-800/50 border border-yellow-400/30 rounded-lg text-white px-3 py-2 focus:outline-none focus:border-yellow-400/50 shadow-lg shadow-yellow-500/10"
            >
              <option value="7d">7 dias</option>
              <option value="30d">30 dias</option>
              <option value="90d">90 dias</option>
              <option value="1y">1 ano</option>
            </select>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-pink-500/20 hover:bg-pink-500/30 border border-pink-400/50 text-pink-400 rounded-lg transition-all disabled:opacity-50 shadow-lg shadow-pink-500/10"
            >
              <FiRefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="text-sm">{refreshing ? 'Atualizando...' : 'Atualizar'}</span>
            </button>

            <button
              onClick={() => {/* Export analytics */}}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/50 text-blue-400 rounded-lg transition-all shadow-lg shadow-blue-500/10"
            >
              <FiDownload className="w-4 h-4" />
              <span className="text-sm">Exportar</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Users Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-yellow-500/20 to-orange-600/20 rounded-xl p-6 border border-yellow-400/30 shadow-lg shadow-yellow-500/10"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <FiUsers className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-yellow-400 text-sm font-medium">
                <FiArrowUpRight className="w-4 h-4" />
                +{mockKPIs.userGrowthRate}%
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-white">{formatNumber(mockKPIs.totalUsers)}</div>
            <div className="text-sm text-gray-400">Total de Usuários</div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Ativos:</span>
              <span className="text-yellow-400">{formatNumber(mockKPIs.activeUsers)}</span>
            </div>
          </div>
        </motion.div>

        {/* Revenue Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-pink-500/20 to-rose-600/20 rounded-xl p-6 border border-pink-400/30 shadow-lg shadow-pink-500/10"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-pink-500/20 rounded-lg">
              <FiDollarSign className="w-6 h-6 text-pink-400" />
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-pink-400 text-sm font-medium">
                <FiArrowUpRight className="w-4 h-4" />
                +{mockKPIs.revenueGrowthRate}%
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-white">{formatCurrency(mockKPIs.totalRevenue)}</div>
            <div className="text-sm text-gray-400">Receita Total</div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Este mês:</span>
              <span className="text-pink-400">R$ 28.5K</span>
            </div>
          </div>
        </motion.div>

        {/* Affiliates Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 rounded-xl p-6 border border-blue-400/30 shadow-lg shadow-blue-500/10"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <FiTarget className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-blue-400 text-sm font-medium">
                <FiArrowUpRight className="w-4 h-4" />
                +{mockKPIs.affiliateGrowthRate}%
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-white">{formatNumber(mockKPIs.totalAffiliates)}</div>
            <div className="text-sm text-gray-400">Afiliados Ativos</div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Taxa:</span>
              <span className="text-blue-400">{mockKPIs.conversionRate}%</span>
            </div>
          </div>
        </motion.div>

        {/* Performance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-xl p-6 border border-green-400/30 shadow-lg shadow-green-500/10"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <FiTrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-green-400 text-sm font-medium">
                <FiArrowDownRight className="w-4 h-4" />
                -{mockKPIs.bounceRate}%
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-white">{mockKPIs.avgSessionTime}</div>
            <div className="text-sm text-gray-400">Tempo Médio</div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Bounce:</span>
              <span className="text-green-400">{mockKPIs.bounceRate}%</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* User Growth Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
            <FiTrendingUp className="text-yellow-400" />
            Crescimento de Usuários
          </h3>
          <div className="h-80">
            <Line data={mockUserGrowthData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
            <FiDollarSign className="text-pink-400" />
            Evolução da Receita
          </h3>
          <div className="h-80">
            <Bar data={mockRevenueData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Affiliate Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
            <FiTarget className="text-blue-400" />
            Performance de Afiliados
          </h3>
          <div className="h-80">
            <Doughnut data={mockAffiliateData} options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                legend: {
                  position: 'bottom' as const,
                  labels: {
                    color: '#ffffff',
                    font: { size: 10 }
                  }
                }
              }
            }} />
          </div>
        </motion.div>

        {/* User Satisfaction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
            <FiUsers className="text-green-400" />
            Satisfação do Usuário
          </h3>
          <div className="h-80">
            <Doughnut data={mockSatisfactionData} options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                legend: {
                  position: 'bottom' as const,
                  labels: {
                    color: '#ffffff',
                    font: { size: 10 }
                  }
                }
              }
            }} />
          </div>
        </motion.div>
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
        >
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
            <FiMonitor className="text-yellow-400" />
            Dispositivos
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FiMonitor className="text-yellow-400" />
                <span className="text-gray-300">Desktop</span>
              </div>
              <span className="text-white font-medium">{mockDeviceData.desktop}%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FiSmartphone className="text-pink-400" />
                <span className="text-gray-300">Mobile</span>
              </div>
              <span className="text-white font-medium">{mockDeviceData.mobile}%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FiTablet className="text-blue-400" />
                <span className="text-gray-300">Tablet</span>
              </div>
              <span className="text-white font-medium">{mockDeviceData.tablet}%</span>
            </div>
          </div>
        </motion.div>

        {/* Geographic Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="lg:col-span-2 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
        >
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
            <FiGlobe className="text-blue-400" />
            Distribuição Geográfica
          </h3>
          <div className="space-y-3">
            {mockGeographicData.map((item, index) => (
              <div key={item.country} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    index === 0 ? 'bg-yellow-400' :
                    index === 1 ? 'bg-pink-400' :
                    index === 2 ? 'bg-blue-400' :
                    index === 3 ? 'bg-green-400' :
                    'bg-gray-400'
                  }`} />
                  <span className="text-gray-300">{item.country}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-white font-medium">{formatNumber(item.users)}</span>
                  <span className="text-gray-400 text-sm">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
