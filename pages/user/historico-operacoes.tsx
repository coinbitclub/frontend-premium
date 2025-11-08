import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../hooks/useLanguage';
import UserLayout from '../../components/UserLayout';
import { 
  FiActivity, 
  FiDollarSign, 
  FiTrendingUp,
  FiTrendingDown,
  FiCalendar,
  FiClock,
  FiCreditCard
} from 'react-icons/fi';
import { useToast } from '../../components/Toast';

const IS_DEV = process.env.NODE_ENV === 'development';

// Interface para as operações do histórico
interface HistoryOperation {
  id: string;
  pair: string;
  exchange: string;
  commission: number;
  direction: 'LONG' | 'SHORT';
  openTime: string;
  closeTime?: string;
  status: 'OPEN' | 'CLOSED';
  profit?: number;
  profitPercentage?: number;
}

const UserHistoricoOperacoes: React.FC = () => {
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [operations, setOperations] = useState<HistoryOperation[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Estados para modal de recarga
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('');
  const { showToast } = useToast();

  // Dados removidos - integração com banco de dados pendente
  const mockOperations: HistoryOperation[] = [];

  // Handle recharge action
  const handleRecharge = async () => {
    if (!rechargeAmount || parseFloat(rechargeAmount) <= 0) {
      showToast(
        language === 'pt' ? 'Digite um valor válido para recarga' : 'Enter a valid recharge amount',
        'error'
      );
      return;
    }

    try {
      setProcessing(true);
      // Simular processo de recarga - aqui você conectaria com sua API real
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showToast(
        language === 'pt' ? 'Recarga processada com sucesso!' : 'Recharge processed successfully!',
        'success'
      );
      setShowRechargeModal(false);
      setRechargeAmount('');
    } catch (error) {
      showToast(
        language === 'pt' ? 'Erro ao processar recarga' : 'Error processing recharge',
        'error'
      );
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    // Simular carregamento - sem dados mock
    setTimeout(() => {
      // setOperations(mockOperations); // Removido - aguardando integração com BD
      setOperations([]); // Array vazio até integração com banco de dados
      setLoading(false);
    }, 1000);
  }, []);

  if (!mounted || loading) {
    return (
      <UserLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-400 mb-4 mx-auto"></div>
            <h2 className="text-2xl font-bold text-white mb-2">CoinBitClub</h2>
            <p className="text-gray-400">
              {language === 'pt' ? 'Carregando histórico...' : 'Loading history...'}
            </p>
          </div>
        </div>
      </UserLayout>
    );
  }

  // Paginação
  const totalPages = Math.ceil(operations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOperations = operations.slice(startIndex, endIndex);

  // Calcular totais
  const totalCommissions = operations.reduce((sum, op) => sum + op.commission, 0);
  const totalProfit = operations.reduce((sum, op) => sum + (op.profit || 0), 0);

  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

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
            {language === 'pt' ? 'Histórico de Operações' : 'Operations History'}
          </h1>
          <p className="text-gray-400">
            {language === 'pt' ? 'Histórico completo das suas operações e comissões pagas' : 'Complete history of your operations and paid commissions'}
          </p>
        </motion.div>

        {/* Card de Recarga */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/30 backdrop-blur-sm rounded-xl border border-green-500/30 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl">
                  <FiCreditCard className="text-green-400 text-2xl" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-green-400 mb-1">
                    {language === 'pt' ? 'Add Carga ao Robô' : 'Add Robot Charge'}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {language === 'pt' ? 'Adicione saldo para continuar operando' : 'Add balance to continue trading'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowRechargeModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-lg transition-all"
              >
                {language === 'pt' ? 'Recarregar' : 'Recharge'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-900/40 to-blue-800/30 backdrop-blur-sm rounded-xl border border-blue-500/30 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <FiActivity className="w-8 h-8 text-blue-400" />
              <div>
                <h3 className="text-lg font-bold text-blue-400">
                  {language === 'pt' ? 'Total Operações' : 'Total Operations'}
                </h3>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {operations.length > 0 ? operations.length : '-'}
            </div>
            <div className="text-blue-400 text-sm">
              {language === 'pt' ? 'Operações realizadas' : 'Operations completed'}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-orange-900/40 to-orange-800/30 backdrop-blur-sm rounded-xl border border-orange-500/30 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <FiDollarSign className="w-8 h-8 text-orange-400" />
              <div>
                <h3 className="text-lg font-bold text-orange-400">
                  {language === 'pt' ? 'Total Comissões' : 'Total Commissions'}
                </h3>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {totalCommissions > 0 ? `$${totalCommissions.toFixed(2)}` : '-'}
            </div>
            <div className="text-orange-400 text-sm">
              {language === 'pt' ? 'Comissões pagas' : 'Commissions paid'}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`bg-gradient-to-br ${totalProfit >= 0 ? 'from-green-900/40 to-green-800/30 border-green-500/30' : 'from-red-900/40 to-red-800/30 border-red-500/30'} backdrop-blur-sm rounded-xl border p-6`}
          >
            <div className="flex items-center gap-3 mb-4">
              {totalProfit >= 0 ? (
                <FiTrendingUp className="w-8 h-8 text-green-400" />
              ) : (
                <FiTrendingDown className="w-8 h-8 text-red-400" />
              )}
              <div>
                <h3 className={`text-lg font-bold ${totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {language === 'pt' ? 'Lucro Total' : 'Total Profit'}
                </h3>
              </div>
            </div>
            <div className={`text-3xl font-bold text-white mb-2`}>
              {operations.length > 0 ? `${totalProfit >= 0 ? '+' : ''}$${totalProfit.toFixed(2)}` : '-'}
            </div>
            <div className={`text-sm ${totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {language === 'pt' ? 'Resultado líquido' : 'Net result'}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-purple-900/40 to-purple-800/30 backdrop-blur-sm rounded-xl border border-purple-500/30 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <FiCalendar className="w-8 h-8 text-purple-400" />
              <div>
                <h3 className="text-lg font-bold text-purple-400">
                  {language === 'pt' ? 'Média Comissão' : 'Avg Commission'}
                </h3>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {operations.length > 0 ? `$${(totalCommissions / operations.length).toFixed(2)}` : '-'}
            </div>
            <div className="text-purple-400 text-sm">
              {language === 'pt' ? 'Por operação' : 'Per operation'}
            </div>
          </motion.div>
        </div>

        {/* Operations History Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-slate-900/40 to-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-500/30"
        >
          <div className="p-6 border-b border-gray-700/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FiActivity className="w-6 h-6 text-blue-400" />
                <h2 className="text-xl font-bold text-white">
                  {language === 'pt' ? 'Histórico de Operações' : 'Operations History'}
                </h2>
              </div>
              <div className="text-gray-400 text-sm">
                {language === 'pt' ? `Página ${currentPage} de ${totalPages}` : `Page ${currentPage} of ${totalPages}`}
              </div>
            </div>
          </div>

          {/* Table Header */}
          <div className="px-6 py-4 bg-gray-800/30 border-b border-gray-700/30">
            <div className="grid grid-cols-6 gap-4 text-sm font-medium text-gray-300">
              <div>{language === 'pt' ? 'Par' : 'Pair'}</div>
              <div>{language === 'pt' ? 'Exchange' : 'Exchange'}</div>
              <div>{language === 'pt' ? 'Tipo' : 'Type'}</div>
              <div>{language === 'pt' ? 'Data/Hora' : 'Date/Time'}</div>
              <div className="text-right">{language === 'pt' ? 'Comissão' : 'Commission'}</div>
              <div className="text-right">{language === 'pt' ? 'Resultado' : 'Result'}</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-700/30">
            {currentOperations.length > 0 ? (
              currentOperations.map((operation) => (
                <motion.div
                  key={operation.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="px-6 py-4 hover:bg-gray-800/20 transition-colors"
                >
                  <div className="grid grid-cols-6 gap-4 items-center">
                    {/* Par */}
                    <div>
                      <div className="text-white font-medium">{operation.pair}</div>
                      <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
                        operation.status === 'CLOSED' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {operation.status}
                      </div>
                    </div>

                    {/* Exchange */}
                    <div>
                      <div className="text-gray-300">{operation.exchange}</div>
                    </div>

                    {/* Tipo */}
                    <div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        operation.direction === 'LONG'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {operation.direction}
                      </span>
                    </div>

                    {/* Data/Hora */}
                    <div className="text-sm text-gray-300">
                      <div>{formatDateTime(operation.openTime).split(' ')[0]}</div>
                      <div className="text-xs text-gray-500">{formatDateTime(operation.openTime).split(' ')[1]}</div>
                    </div>

                    {/* Comissão */}
                    <div className="text-right">
                      <div className="text-orange-400 font-medium">
                        ${operation.commission.toFixed(2)}
                      </div>
                    </div>

                    {/* Resultado */}
                    <div className="text-right">
                      {operation.profit !== undefined ? (
                        <>
                          <div className={`font-bold ${operation.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {operation.profit >= 0 ? '+' : ''}${operation.profit.toFixed(2)}
                          </div>
                          <div className={`text-xs ${operation.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {operation.profit >= 0 ? '+' : ''}{operation.profitPercentage?.toFixed(2)}%
                          </div>
                        </>
                      ) : (
                        <div className="text-gray-500 text-sm">
                          {language === 'pt' ? 'Em andamento' : 'In progress'}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="px-6 py-12 text-center">
                <FiActivity className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-400 mb-2">
                  {language === 'pt' ? 'Nenhuma operação encontrada' : 'No operations found'}
                </h3>
                <p className="text-gray-500 text-sm">
                  {language === 'pt' 
                    ? 'Quando você realizar operações, elas aparecerão aqui.' 
                    : 'When you make operations, they will appear here.'
                  }
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {operations.length > 0 && totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-700/30">
              <div className="flex items-center justify-between">
                <div className="text-gray-400 text-sm">
                  {language === 'pt' 
                    ? `Mostrando ${startIndex + 1}-${Math.min(endIndex, operations.length)} de ${operations.length} operações`
                    : `Showing ${startIndex + 1}-${Math.min(endIndex, operations.length)} of ${operations.length} operations`
                  }
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
                  >
                    {language === 'pt' ? 'Anterior' : 'Previous'}
                  </button>
                  <span className="text-gray-400 text-sm px-3">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
                  >
                    {language === 'pt' ? 'Próxima' : 'Next'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Modal de Recarga */}
        {showRechargeModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gray-900 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-700"
            >
              <h3 className="text-xl font-bold text-white mb-4">
                {language === 'pt' ? 'Add Carga ao Robô' : 'Add Robot Charge'}
              </h3>
              <input
                type="number"
                value={rechargeAmount}
                onChange={(e) => setRechargeAmount(e.target.value)}
                placeholder={language === 'pt' ? 'Valor da recarga' : 'Recharge amount'}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white mb-4"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRechargeModal(false)}
                  className="flex-1 py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
                >
                  {language === 'pt' ? 'Cancelar' : 'Cancel'}
                </button>
                <button
                  onClick={handleRecharge}
                  disabled={processing}
                  className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all disabled:opacity-50"
                >
                  {processing ? (language === 'pt' ? 'Processando...' : 'Processing...') : (language === 'pt' ? 'Recarregar' : 'Recharge')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default UserHistoricoOperacoes;
