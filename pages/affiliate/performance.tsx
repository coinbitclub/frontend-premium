import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../hooks/useLanguage';
import AffiliateLayout from '../../src/components/AffiliateLayout';
import { 
  FiTrendingUp, 
  FiDollarSign,
  FiUsers,
  FiCalendar,
  FiBarChart,
  FiPercent,
  FiTarget,
  FiAward
} from 'react-icons/fi';

interface PerformanceData {
  totalCommissions: number;
  monthlyCommissions: number;
  totalReferrals: number;
  activeReferrals: number;
  conversionRate: number;
  averageCommission: number;
  bestMonth: {
    month: string;
    amount: number;
  };
  growth: number;
}

interface MonthlyData {
  month: string;
  commissions: number;
  referrals: number;
  conversions: number;
}

const AffiliatePerformance: React.FC = () => {
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('6m');
  const [performanceData, setPerformanceData] = useState<PerformanceData>({
    totalCommissions: 0,
    monthlyCommissions: 0,
    totalReferrals: 0,
    activeReferrals: 0,
    conversionRate: 0,
    averageCommission: 0,
    bestMonth: {
      month: 'N/A',
      amount: 0
    },
    growth: 0
  });

  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([
    { month: 'Jan', commissions: 567.30, referrals: 3, conversions: 2 },
    { month: 'Feb', commissions: 834.50, referrals: 5, conversions: 4 },
    { month: 'Mar', commissions: 1123.80, referrals: 6, conversions: 5 },
    { month: 'Apr', commissions: 945.20, referrals: 4, conversions: 3 },
    { month: 'May', commissions: 1567.40, referrals: 8, conversions: 6 },
    { month: 'Jun', commissions: 1879.60, referrals: 9, conversions: 7 },
    { month: 'Jul', commissions: 2156.90, referrals: 12, conversions: 9 },
    { month: 'Aug', commissions: 1245.80, referrals: 7, conversions: 5 }
  ]);

  useEffect(() => {
    setMounted(true);
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No auth token found');
        return;
      }

      const [statsRes, performanceRes] = await Promise.all([
        fetch('/api/affiliate/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/affiliate/performance', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.success) {
          const stats = statsData.stats;
          const avgCommission = stats.totalReferrals > 0
            ? stats.totalCommissions / stats.totalReferrals
            : 0;

          setPerformanceData({
            totalCommissions: stats.totalCommissions || 0,
            monthlyCommissions: stats.monthlyCommissions || 0,
            totalReferrals: stats.totalReferrals || 0,
            activeReferrals: stats.activeReferrals || 0,
            conversionRate: stats.totalReferrals > 0
              ? (stats.activeReferrals / stats.totalReferrals) * 100
              : 0,
            averageCommission: avgCommission,
            bestMonth: {
              month: 'Current Month',
              amount: stats.monthlyCommissions || 0
            },
            growth: 0 // Would need historical data to calculate
          });
        }
      }

      if (performanceRes.ok) {
        const perfData = await performanceRes.json();
        if (perfData.success && perfData.performance) {
          setPerformanceData(prev => ({
            ...prev,
            conversionRate: perfData.performance.conversionRate || prev.conversionRate,
            averageCommission: perfData.performance.averageCommission || prev.averageCommission
          }));
        }
      }

    } catch (error) {
      console.error('Error fetching performance data:', error);
    }
  };

  const getRankBadge = (commissions: number) => {
    if (commissions >= 5000) return { rank: 'Diamond', color: 'text-blue-400', bg: 'bg-blue-500/20' };
    if (commissions >= 2000) return { rank: 'Gold', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    if (commissions >= 1000) return { rank: 'Silver', color: 'text-gray-400', bg: 'bg-gray-500/20' };
    return { rank: 'Bronze', color: 'text-orange-400', bg: 'bg-orange-500/20' };
  };

  const currentRank = getRankBadge(performanceData.totalCommissions);

  if (!mounted) {
    return (
      <AffiliateLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-400 mb-4 mx-auto"></div>
            <h2 className="text-2xl font-bold text-white mb-2">CoinBitClub Affiliate</h2>
            <p className="text-gray-400">{language === 'pt' ? 'Carregando...' : 'Loading...'}</p>
          </div>
        </div>
      </AffiliateLayout>
    );
  }

  return (
    <AffiliateLayout>
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
            {language === 'pt' ? 'Acompanhe seu desempenho como afiliado' : 'Track your affiliate performance'}
          </p>
        </motion.div>

        {/* Rank Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-xl border ${currentRank.bg} ${currentRank.color} border-current/30`}>
            <FiAward className="w-6 h-6" />
            <div>
              <div className="font-bold">
                {language === 'pt' ? 'Ranking Atual:' : 'Current Rank:'} {currentRank.rank}
              </div>
              <div className="text-sm opacity-80">
                {language === 'pt' ? 'Baseado no total de comissões' : 'Based on total commissions'}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Period Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-slate-900/40 to-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-500/30 p-6 mb-8"
        >
          <div className="flex items-center gap-4">
            <FiCalendar className="w-6 h-6 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">
              {language === 'pt' ? 'Período de Análise' : 'Analysis Period'}
            </h2>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-black/20 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-emerald-400 focus:outline-none"
            >
              <option value="1m">{language === 'pt' ? 'Último mês' : 'Last month'}</option>
              <option value="3m">{language === 'pt' ? 'Últimos 3 meses' : 'Last 3 months'}</option>
              <option value="6m">{language === 'pt' ? 'Últimos 6 meses' : 'Last 6 months'}</option>
              <option value="1y">{language === 'pt' ? 'Último ano' : 'Last year'}</option>
            </select>
          </div>
        </motion.div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-emerald-900/40 to-emerald-800/30 backdrop-blur-sm rounded-xl border border-emerald-500/30 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <FiDollarSign className="w-8 h-8 text-emerald-400" />
              <div>
                <h3 className="text-lg font-bold text-emerald-400">
                  {language === 'pt' ? 'Total Ganho' : 'Total Earned'}
                </h3>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">${performanceData.totalCommissions.toFixed(2)}</div>
            <div className="text-emerald-400 text-sm">
              {language === 'pt' ? 'Comissões totais' : 'Total commissions'}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-blue-900/40 to-blue-800/30 backdrop-blur-sm rounded-xl border border-blue-500/30 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <FiTrendingUp className="w-8 h-8 text-blue-400" />
              <div>
                <h3 className="text-lg font-bold text-blue-400">
                  {language === 'pt' ? 'Este Mês' : 'This Month'}
                </h3>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">${performanceData.monthlyCommissions.toFixed(2)}</div>
            <div className="text-blue-400 text-sm">
              +{performanceData.growth}% {language === 'pt' ? 'vs mês anterior' : 'vs last month'}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-purple-900/40 to-purple-800/30 backdrop-blur-sm rounded-xl border border-purple-500/30 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <FiUsers className="w-8 h-8 text-purple-400" />
              <div>
                <h3 className="text-lg font-bold text-purple-400">
                  {language === 'pt' ? 'Indicações' : 'Referrals'}
                </h3>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">{performanceData.totalReferrals}</div>
            <div className="text-purple-400 text-sm">
              {performanceData.activeReferrals} {language === 'pt' ? 'ativos' : 'active'}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-orange-900/40 to-orange-800/30 backdrop-blur-sm rounded-xl border border-orange-500/30 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <FiPercent className="w-8 h-8 text-orange-400" />
              <div>
                <h3 className="text-lg font-bold text-orange-400">
                  {language === 'pt' ? 'Conversão' : 'Conversion'}
                </h3>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">{performanceData.conversionRate}%</div>
            <div className="text-orange-400 text-sm">
              {language === 'pt' ? 'Taxa média' : 'Average rate'}
            </div>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Performance Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-br from-slate-900/40 to-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-500/30 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <FiBarChart className="w-6 h-6 text-emerald-400" />
              <h2 className="text-xl font-bold text-white">
                {language === 'pt' ? 'Comissões Mensais' : 'Monthly Commissions'}
              </h2>
            </div>
            
            <div className="space-y-3">
              {monthlyData.slice(-6).map((month, index) => (
                <div key={month.month} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                    <span className="text-white font-medium">{month.month}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-emerald-400 font-bold">${month.commissions.toFixed(2)}</div>
                    <div className="text-gray-400 text-sm">{month.referrals} refs</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Performance Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-br from-slate-900/40 to-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-500/30 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <FiTarget className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-bold text-white">
                {language === 'pt' ? 'Insights de Performance' : 'Performance Insights'}
              </h2>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-green-500/20 rounded-lg border border-green-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <FiTrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 font-semibold">
                    {language === 'pt' ? 'Melhor Mês' : 'Best Month'}
                  </span>
                </div>
                <div className="text-white">
                  {performanceData.bestMonth.month}: <span className="font-bold">${performanceData.bestMonth.amount.toFixed(2)}</span>
                </div>
              </div>

              <div className="p-4 bg-blue-500/20 rounded-lg border border-blue-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <FiDollarSign className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-400 font-semibold">
                    {language === 'pt' ? 'Comissão Média' : 'Average Commission'}
                  </span>
                </div>
                <div className="text-white">
                  ${performanceData.averageCommission.toFixed(2)} {language === 'pt' ? 'por indicação' : 'per referral'}
                </div>
              </div>

              <div className="p-4 bg-purple-500/20 rounded-lg border border-purple-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <FiPercent className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-400 font-semibold">
                    {language === 'pt' ? 'Taxa de Conversão' : 'Conversion Rate'}
                  </span>
                </div>
                <div className="text-white">
                  {performanceData.conversionRate}% {language === 'pt' ? 'dos visitantes se cadastram' : 'of visitors sign up'}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Goals Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-gradient-to-br from-yellow-900/40 to-yellow-800/30 backdrop-blur-sm rounded-xl border border-yellow-500/30 p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <FiTarget className="w-6 h-6 text-yellow-400" />
            <h2 className="text-xl font-bold text-white">
              {language === 'pt' ? 'Metas e Objetivos' : 'Goals and Targets'}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-2">$10,000</div>
              <div className="text-white font-medium mb-1">
                {language === 'pt' ? 'Meta Anual' : 'Annual Goal'}
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-yellow-400 h-2 rounded-full" 
                  style={{ width: `${(performanceData.totalCommissions / 10000) * 100}%` }}
                ></div>
              </div>
              <div className="text-gray-400 text-sm mt-2">
                {Math.round((performanceData.totalCommissions / 10000) * 100)}% {language === 'pt' ? 'concluído' : 'completed'}
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-2">100</div>
              <div className="text-white font-medium mb-1">
                {language === 'pt' ? 'Meta de Indicações' : 'Referral Goal'}
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-yellow-400 h-2 rounded-full" 
                  style={{ width: `${(performanceData.totalReferrals / 100) * 100}%` }}
                ></div>
              </div>
              <div className="text-gray-400 text-sm mt-2">
                {performanceData.totalReferrals}/100 {language === 'pt' ? 'indicações' : 'referrals'}
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-2">75%</div>
              <div className="text-white font-medium mb-1">
                {language === 'pt' ? 'Meta de Conversão' : 'Conversion Goal'}
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-yellow-400 h-2 rounded-full" 
                  style={{ width: `${(performanceData.conversionRate / 75) * 100}%` }}
                ></div>
              </div>
              <div className="text-gray-400 text-sm mt-2">
                {performanceData.conversionRate}% {language === 'pt' ? 'atual' : 'current'}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AffiliateLayout>
  );
};

export default AffiliatePerformance;
