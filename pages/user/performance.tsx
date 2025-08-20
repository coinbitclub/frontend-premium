import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../hooks/useLanguage';
import UserLayout from '../../components/UserLayout';
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

const UserPerformance: React.FC = () => {
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <UserLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-400 mb-4 mx-auto"></div>
            <h2 className="text-2xl font-bold text-white mb-2">CoinBitClub</h2>
            <p className="text-gray-400">{language === 'pt' ? 'Carregando...' : 'Loading...'}</p>
          </div>
        </div>
      </UserLayout>
    );
  }

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
            <div className="text-3xl font-bold text-white mb-2">+$147.80</div>
            <div className="text-green-400 text-sm">+2.48% {language === 'pt' ? 'hoje' : 'today'}</div>
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
            <div className="text-3xl font-bold text-white mb-2">78.5%</div>
            <div className="text-blue-400 text-sm">{language === 'pt' ? '247 operações' : '247 operations'}</div>
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
            <div className="text-3xl font-bold text-white mb-2">+247.5%</div>
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
            <div className="text-3xl font-bold text-white mb-2">1.247</div>
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
            <div className="h-64 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <FiTrendingUp className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <p>{language === 'pt' ? 'Gráfico de evolução será implementado em breve' : 'Evolution chart will be implemented soon'}</p>
              </div>
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
              {[
                { pair: 'BTC/USDT', percentage: 35, profit: '+$1,247.50', color: 'orange' },
                { pair: 'ETH/USDT', percentage: 28, profit: '+$892.30', color: 'blue' },
                { pair: 'ADA/USDT', percentage: 22, profit: '+$634.20', color: 'green' },
                { pair: 'SOL/USDT', percentage: 15, profit: '+$425.80', color: 'purple' }
              ].map((item) => (
                <div key={item.pair} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full bg-${item.color}-400`}></div>
                    <span className="text-white font-medium">{item.pair}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-medium">{item.profit}</div>
                    <div className="text-gray-400 text-sm">{item.percentage}%</div>
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
            <div className="text-2xl font-bold text-white mb-2">Dezembro 2024</div>
            <div className="text-emerald-400">+$2.890,45</div>
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
            <div className="text-2xl font-bold text-white mb-2">BTC/USDT</div>
            <div className="text-amber-400">+$456.78 (+4.2%)</div>
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
            <div className="text-2xl font-bold text-white mb-2">24min</div>
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
            {[
              { pair: 'BTC/USDT', type: 'LONG', profit: 247.80, percentage: 2.48, date: '15/01', time: '14:32', status: 'completed' },
              { pair: 'ETH/USDT', type: 'SHORT', profit: -45.30, percentage: -1.2, date: '15/01', time: '13:45', status: 'completed' },
              { pair: 'ADA/USDT', type: 'LONG', profit: 78.90, percentage: 1.85, date: '15/01', time: '12:15', status: 'completed' },
              { pair: 'SOL/USDT', type: 'LONG', profit: 156.40, percentage: 3.2, date: '15/01', time: '11:30', status: 'completed' },
              { pair: 'BTC/USDT', type: 'SHORT', profit: -23.10, percentage: -0.8, date: '15/01', time: '10:45', status: 'completed' },
              { pair: 'ETH/USDT', type: 'LONG', profit: 89.50, percentage: 2.1, date: '14/01', time: '16:20', status: 'completed' },
              { pair: 'DOT/USDT', type: 'LONG', profit: 34.70, percentage: 1.4, date: '14/01', time: '15:10', status: 'completed' },
              { pair: 'BTC/USDT', type: 'LONG', profit: 312.80, percentage: 4.2, date: '14/01', time: '14:25', status: 'completed' }
            ].map((operation, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-gray-600/30 hover:border-blue-400/50 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${
                    operation.status === 'completed' ? 'bg-green-400' : 'bg-yellow-400'
                  }`}></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{operation.pair}</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        operation.type === 'LONG' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {operation.type}
                      </span>
                    </div>
                    <div className="text-gray-400 text-sm">
                      {operation.date} às {operation.time}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${operation.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {operation.profit >= 0 ? '+' : ''}${operation.profit.toFixed(2)}
                  </div>
                  <div className={`text-sm ${operation.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {operation.profit >= 0 ? '+' : ''}{operation.percentage.toFixed(2)}%
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
