import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../hooks/useLanguage';
import AdminLayout from '../../components/AdminLayout';
import { 
  FiBarChart, 
  FiFileText,
  FiCalendar,
  FiDownload,
  FiUsers,
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown
} from 'react-icons/fi';

interface ReportData {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  totalCommissions: number;
  totalTrades: number;
  successRate: number;
  monthlyGrowth: number;
}

const AdminReports: React.FC = () => {
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [reportData, setReportData] = useState<ReportData>({
    totalUsers: 1247,
    activeUsers: 892,
    totalRevenue: 2450000,
    totalCommissions: 125400,
    totalTrades: 15623,
    successRate: 73.2,
    monthlyGrowth: 12.5
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDownloadReport = (type: string) => {
    // Simular download de relatório
    console.log(`Downloading ${type} report for ${selectedPeriod}`);
    // Em produção, aqui seria feita a requisição para gerar e baixar o relatório
  };

  if (!mounted) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-400 mb-4 mx-auto"></div>
            <h2 className="text-2xl font-bold text-white mb-2">CoinBitClub Admin</h2>
            <p className="text-gray-400">{language === 'pt' ? 'Carregando...' : 'Loading...'}</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            {language === 'pt' ? 'Relatórios' : 'Reports'}
          </h1>
          <p className="text-gray-400">
            {language === 'pt' ? 'Visualize e exporte relatórios detalhados da plataforma' : 'View and export detailed platform reports'}
          </p>
        </motion.div>

        {/* Period Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-slate-900/40 to-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-500/30 p-6 mb-8"
        >
          <div className="flex items-center gap-4">
            <FiCalendar className="w-6 h-6 text-red-400" />
            <h2 className="text-lg font-bold text-white">
              {language === 'pt' ? 'Período do Relatório' : 'Report Period'}
            </h2>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-black/20 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-red-400 focus:outline-none"
            >
              <option value="7d">{language === 'pt' ? 'Últimos 7 dias' : 'Last 7 days'}</option>
              <option value="30d">{language === 'pt' ? 'Últimos 30 dias' : 'Last 30 days'}</option>
              <option value="90d">{language === 'pt' ? 'Últimos 90 dias' : 'Last 90 days'}</option>
              <option value="1y">{language === 'pt' ? 'Último ano' : 'Last year'}</option>
            </select>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-blue-900/40 to-blue-800/30 backdrop-blur-sm rounded-xl border border-blue-500/30 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <FiUsers className="w-8 h-8 text-blue-400" />
              <div>
                <h3 className="text-lg font-bold text-blue-400">
                  {language === 'pt' ? 'Usuários Totais' : 'Total Users'}
                </h3>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">{reportData.totalUsers.toLocaleString()}</div>
            <div className="flex items-center gap-2">
              <FiTrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm">+{reportData.monthlyGrowth}% {language === 'pt' ? 'este mês' : 'this month'}</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-green-900/40 to-green-800/30 backdrop-blur-sm rounded-xl border border-green-500/30 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <FiUsers className="w-8 h-8 text-green-400" />
              <div>
                <h3 className="text-lg font-bold text-green-400">
                  {language === 'pt' ? 'Usuários Ativos' : 'Active Users'}
                </h3>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">{reportData.activeUsers.toLocaleString()}</div>
            <div className="text-green-400 text-sm">
              {((reportData.activeUsers / reportData.totalUsers) * 100).toFixed(1)}% {language === 'pt' ? 'do total' : 'of total'}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-purple-900/40 to-purple-800/30 backdrop-blur-sm rounded-xl border border-purple-500/30 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <FiDollarSign className="w-8 h-8 text-purple-400" />
              <div>
                <h3 className="text-lg font-bold text-purple-400">
                  {language === 'pt' ? 'Receita Total' : 'Total Revenue'}
                </h3>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">${reportData.totalRevenue.toLocaleString()}</div>
            <div className="text-purple-400 text-sm">
              ${reportData.totalCommissions.toLocaleString()} {language === 'pt' ? 'em comissões' : 'in commissions'}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-orange-900/40 to-orange-800/30 backdrop-blur-sm rounded-xl border border-orange-500/30 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <FiTrendingUp className="w-8 h-8 text-orange-400" />
              <div>
                <h3 className="text-lg font-bold text-orange-400">
                  {language === 'pt' ? 'Taxa de Sucesso' : 'Success Rate'}
                </h3>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">{reportData.successRate}%</div>
            <div className="text-orange-400 text-sm">
              {reportData.totalTrades.toLocaleString()} {language === 'pt' ? 'operações totais' : 'total trades'}
            </div>
          </motion.div>
        </div>

        {/* Report Types */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Financial Reports */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-slate-900/40 to-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-500/30 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <FiDollarSign className="w-6 h-6 text-green-400" />
              <h2 className="text-xl font-bold text-white">
                {language === 'pt' ? 'Relatórios Financeiros' : 'Financial Reports'}
              </h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-gray-600/30">
                <div>
                  <h3 className="text-white font-medium">
                    {language === 'pt' ? 'Relatório de Receitas' : 'Revenue Report'}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {language === 'pt' ? 'Receitas, comissões e lucros' : 'Revenue, commissions and profits'}
                  </p>
                </div>
                <button
                  onClick={() => handleDownloadReport('revenue')}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                >
                  <FiDownload className="w-4 h-4" />
                  {language === 'pt' ? 'Baixar' : 'Download'}
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-gray-600/30">
                <div>
                  <h3 className="text-white font-medium">
                    {language === 'pt' ? 'Relatório de Transações' : 'Transaction Report'}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {language === 'pt' ? 'Depósitos, saques e transferências' : 'Deposits, withdrawals and transfers'}
                  </p>
                </div>
                <button
                  onClick={() => handleDownloadReport('transactions')}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                >
                  <FiDownload className="w-4 h-4" />
                  {language === 'pt' ? 'Baixar' : 'Download'}
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-gray-600/30">
                <div>
                  <h3 className="text-white font-medium">
                    {language === 'pt' ? 'Relatório de Comissões' : 'Commission Report'}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {language === 'pt' ? 'Comissões de afiliados e indicações' : 'Affiliate and referral commissions'}
                  </p>
                </div>
                <button
                  onClick={() => handleDownloadReport('commissions')}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                >
                  <FiDownload className="w-4 h-4" />
                  {language === 'pt' ? 'Baixar' : 'Download'}
                </button>
              </div>
            </div>
          </motion.div>

          {/* User Reports */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-br from-slate-900/40 to-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-500/30 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <FiUsers className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-bold text-white">
                {language === 'pt' ? 'Relatórios de Usuários' : 'User Reports'}
              </h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-gray-600/30">
                <div>
                  <h3 className="text-white font-medium">
                    {language === 'pt' ? 'Relatório de Atividade' : 'Activity Report'}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {language === 'pt' ? 'Atividade e engajamento dos usuários' : 'User activity and engagement'}
                  </p>
                </div>
                <button
                  onClick={() => handleDownloadReport('activity')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                >
                  <FiDownload className="w-4 h-4" />
                  {language === 'pt' ? 'Baixar' : 'Download'}
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-gray-600/30">
                <div>
                  <h3 className="text-white font-medium">
                    {language === 'pt' ? 'Relatório de Cadastros' : 'Registration Report'}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {language === 'pt' ? 'Novos cadastros e conversões' : 'New registrations and conversions'}
                  </p>
                </div>
                <button
                  onClick={() => handleDownloadReport('registrations')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                >
                  <FiDownload className="w-4 h-4" />
                  {language === 'pt' ? 'Baixar' : 'Download'}
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-gray-600/30">
                <div>
                  <h3 className="text-white font-medium">
                    {language === 'pt' ? 'Relatório de Performance' : 'Performance Report'}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {language === 'pt' ? 'Performance de trading dos usuários' : 'User trading performance'}
                  </p>
                </div>
                <button
                  onClick={() => handleDownloadReport('performance')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                >
                  <FiDownload className="w-4 h-4" />
                  {language === 'pt' ? 'Baixar' : 'Download'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-br from-slate-900/40 to-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-500/30 p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <FiBarChart className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-bold text-white">
              {language === 'pt' ? 'Visualizações' : 'Charts'}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-black/20 rounded-lg border border-gray-600/30 flex items-center justify-center">
              <div className="text-center">
                <FiFileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">
                  {language === 'pt' ? 'Gráfico de Receitas' : 'Revenue Chart'}
                </p>
                <p className="text-gray-500 text-sm">
                  {language === 'pt' ? 'Será implementado em breve' : 'Coming soon'}
                </p>
              </div>
            </div>
            
            <div className="h-64 bg-black/20 rounded-lg border border-gray-600/30 flex items-center justify-center">
              <div className="text-center">
                <FiBarChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">
                  {language === 'pt' ? 'Gráfico de Usuários' : 'Users Chart'}
                </p>
                <p className="text-gray-500 text-sm">
                  {language === 'pt' ? 'Será implementado em breve' : 'Coming soon'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
