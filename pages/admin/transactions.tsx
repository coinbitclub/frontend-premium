import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../hooks/useLanguage';
import AdminLayout from '../../components/AdminLayout';
import { 
  CreditCardIcon, 
  ArrowUpIcon,
  ArrowDownIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface Transaction {
  id: string;
  userId: string;
  userName: string;
  type: 'deposit' | 'withdrawal' | 'commission' | 'trade';
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'processing';
  timestamp: Date;
  description: string;
  method?: string;
}

const AdminTransactions: React.FC = () => {
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Mock transactions data
    const mockTransactions: Transaction[] = [
      {
        id: '1',
        userId: 'user1',
        userName: 'João Silva',
        type: 'deposit',
        amount: 5000,
        status: 'completed',
        timestamp: new Date(),
        description: 'Depósito via PIX',
        method: 'PIX'
      },
      {
        id: '2',
        userId: 'user2',
        userName: 'Maria Santos',
        type: 'withdrawal',
        amount: 1500,
        status: 'pending',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        description: 'Saque solicitado',
        method: 'Bank Transfer'
      },
      {
        id: '3',
        userId: 'user3',
        userName: 'Carlos Costa',
        type: 'commission',
        amount: 150,
        status: 'completed',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        description: 'Comissão de afiliado'
      },
      {
        id: '4',
        userId: 'user4',
        userName: 'Ana Oliveira',
        type: 'trade',
        amount: 250,
        status: 'completed',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        description: 'Lucro de operação BTC/USDT'
      },
      {
        id: '5',
        userId: 'user5',
        userName: 'Pedro Ferreira',
        type: 'deposit',
        amount: 10000,
        status: 'processing',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        description: 'Depósito via TED',
        method: 'TED'
      }
    ];

    setTransactions(mockTransactions);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-500/20';
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'processing':
        return 'text-blue-400 bg-blue-500/20';
      case 'failed':
        return 'text-red-400 bg-red-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return language === 'pt' ? 'Concluído' : 'Completed';
      case 'pending':
        return language === 'pt' ? 'Pendente' : 'Pending';
      case 'processing':
        return language === 'pt' ? 'Processando' : 'Processing';
      case 'failed':
        return language === 'pt' ? 'Falhou' : 'Failed';
      default:
        return status;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'text-green-400';
      case 'withdrawal':
        return 'text-red-400';
      case 'commission':
        return 'text-purple-400';
      case 'trade':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'deposit':
        return language === 'pt' ? 'Depósito' : 'Deposit';
      case 'withdrawal':
        return language === 'pt' ? 'Saque' : 'Withdrawal';
      case 'commission':
        return language === 'pt' ? 'Comissão' : 'Commission';
      case 'trade':
        return language === 'pt' ? 'Trading' : 'Trade';
      default:
        return type;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownIcon className="w-5 h-5 text-green-400" />;
      case 'withdrawal':
        return <ArrowUpIcon className="w-5 h-5 text-red-400" />;
      case 'commission':
        return <CreditCardIcon className="w-5 h-5 text-purple-400" />;
      case 'trade':
        return <CreditCardIcon className="w-5 h-5 text-blue-400" />;
      default:
        return <CreditCardIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionModal(true);
  };

  const handleStatusUpdate = async (transactionId: string, newStatus: 'pending' | 'completed' | 'failed' | 'processing') => {
    try {
      setTransactions(prev => prev.map(transaction =>
        transaction.id === transactionId ? { ...transaction, status: newStatus } : transaction
      ));
      console.log(`Transaction ${transactionId} status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating transaction status:', error);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalVolume = transactions.reduce((sum, t) => sum + t.amount, 0);
  const completedTransactions = transactions.filter(t => t.status === 'completed').length;
  const pendingTransactions = transactions.filter(t => t.status === 'pending').length;

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
            {language === 'pt' ? 'Transações' : 'Transactions'}
          </h1>
          <p className="text-gray-400">
            {language === 'pt' ? 'Monitore todas as transações da plataforma' : 'Monitor all platform transactions'}
          </p>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-900/40 to-blue-800/30 backdrop-blur-sm rounded-xl border border-blue-500/30 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <CreditCardIcon className="w-8 h-8 text-blue-400" />
              <div>
                <h3 className="text-lg font-bold text-blue-400">
                  {language === 'pt' ? 'Total' : 'Total'}
                </h3>
              </div>
            </div>
            <div className="text-3xl font-bold text-white">{transactions.length}</div>
            <div className="text-blue-400 text-sm">
              {language === 'pt' ? 'Transações' : 'Transactions'}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-green-900/40 to-green-800/30 backdrop-blur-sm rounded-xl border border-green-500/30 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <CheckCircleIcon className="w-8 h-8 text-green-400" />
              <div>
                <h3 className="text-lg font-bold text-green-400">
                  {language === 'pt' ? 'Concluídas' : 'Completed'}
                </h3>
              </div>
            </div>
            <div className="text-3xl font-bold text-white">{completedTransactions}</div>
            <div className="text-green-400 text-sm">
              {language === 'pt' ? 'Processadas' : 'Processed'}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-yellow-900/40 to-yellow-800/30 backdrop-blur-sm rounded-xl border border-yellow-500/30 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <ClockIcon className="w-8 h-8 text-yellow-400" />
              <div>
                <h3 className="text-lg font-bold text-yellow-400">
                  {language === 'pt' ? 'Pendentes' : 'Pending'}
                </h3>
              </div>
            </div>
            <div className="text-3xl font-bold text-white">{pendingTransactions}</div>
            <div className="text-yellow-400 text-sm">
              {language === 'pt' ? 'Aguardando' : 'Waiting'}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-purple-900/40 to-purple-800/30 backdrop-blur-sm rounded-xl border border-purple-500/30 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <CreditCardIcon className="w-8 h-8 text-purple-400" />
              <div>
                <h3 className="text-lg font-bold text-purple-400">
                  {language === 'pt' ? 'Volume' : 'Volume'}
                </h3>
              </div>
            </div>
            <div className="text-3xl font-bold text-white">${totalVolume.toLocaleString()}</div>
            <div className="text-purple-400 text-sm">
              {language === 'pt' ? 'Total movimentado' : 'Total volume'}
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-slate-900/40 to-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-500/30 p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder={language === 'pt' ? 'Buscar transações...' : 'Search transactions...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/20 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white focus:border-red-400 focus:outline-none"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-black/20 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-red-400 focus:outline-none"
            >
              <option value="all">{language === 'pt' ? 'Todos os Status' : 'All Status'}</option>
              <option value="completed">{language === 'pt' ? 'Concluído' : 'Completed'}</option>
              <option value="pending">{language === 'pt' ? 'Pendente' : 'Pending'}</option>
              <option value="processing">{language === 'pt' ? 'Processando' : 'Processing'}</option>
              <option value="failed">{language === 'pt' ? 'Falhou' : 'Failed'}</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-black/20 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-red-400 focus:outline-none"
            >
              <option value="all">{language === 'pt' ? 'Todos os Tipos' : 'All Types'}</option>
              <option value="deposit">{language === 'pt' ? 'Depósito' : 'Deposit'}</option>
              <option value="withdrawal">{language === 'pt' ? 'Saque' : 'Withdrawal'}</option>
              <option value="commission">{language === 'pt' ? 'Comissão' : 'Commission'}</option>
              <option value="trade">{language === 'pt' ? 'Trading' : 'Trade'}</option>
            </select>
          </div>
        </motion.div>

        {/* Transactions Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-slate-900/40 to-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-500/30 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">
              {language === 'pt' ? 'Lista de Transações' : 'Transaction List'}
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/20 border-b border-gray-700">
                <tr>
                  <th className="text-left p-4 text-gray-400 font-medium">ID</th>
                  <th className="text-left p-4 text-gray-400 font-medium">
                    {language === 'pt' ? 'Usuário' : 'User'}
                  </th>
                  <th className="text-left p-4 text-gray-400 font-medium">
                    {language === 'pt' ? 'Tipo' : 'Type'}
                  </th>
                  <th className="text-left p-4 text-gray-400 font-medium">
                    {language === 'pt' ? 'Valor' : 'Amount'}
                  </th>
                  <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left p-4 text-gray-400 font-medium">
                    {language === 'pt' ? 'Data' : 'Date'}
                  </th>
                  <th className="text-left p-4 text-gray-400 font-medium">
                    {language === 'pt' ? 'Ações' : 'Actions'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredTransactions.map((transaction, index) => (
                  <motion.tr
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-black/10 transition-colors"
                  >
                    <td className="p-4">
                      <code className="text-gray-400 text-sm">#{transaction.id}</code>
                    </td>
                    <td className="p-4">
                      <div className="text-white font-medium">{transaction.userName}</div>
                      <div className="text-gray-400 text-sm">{transaction.description}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(transaction.type)}
                        <span className={`font-medium ${getTypeColor(transaction.type)}`}>
                          {getTypeText(transaction.type)}
                        </span>
                      </div>
                      {transaction.method && (
                        <div className="text-gray-400 text-sm">{transaction.method}</div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className={`text-lg font-bold ${
                        transaction.type === 'withdrawal' ? 'text-red-400' : 'text-green-400'
                      }`}>
                        {transaction.type === 'withdrawal' ? '-' : '+'}${transaction.amount.toLocaleString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(transaction.status)}`}>
                        {getStatusText(transaction.status)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-gray-400">
                        {transaction.timestamp.toLocaleString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleViewTransaction(transaction)}
                          className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                          title="Ver detalhes"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        
                        {transaction.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleStatusUpdate(transaction.id, 'completed')}
                              className="p-2 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors"
                              title="Aprovar"
                            >
                              <CheckCircleIcon className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(transaction.id, 'failed')}
                              className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                              title="Rejeitar"
                            >
                              <XCircleIcon className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        
                        {transaction.status === 'processing' && (
                          <button 
                            onClick={() => handleStatusUpdate(transaction.id, 'completed')}
                            className="p-2 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors"
                            title="Finalizar"
                          >
                            <CheckCircleIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Transaction Details Modal */}
        {showTransactionModal && selectedTransaction && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 w-full max-w-2xl border border-slate-500/30 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                  {getTypeIcon(selectedTransaction.type)}
                  Detalhes da Transação
                </h3>
                <button
                  onClick={() => setShowTransactionModal(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Transaction Header */}
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">ID da Transação</div>
                      <div className="text-white font-mono">#{selectedTransaction.id}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Status</div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedTransaction.status)}`}>
                        {getStatusText(selectedTransaction.status)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* User Info */}
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-3">Informações do Usuário</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Nome</div>
                      <div className="text-white font-medium">{selectedTransaction.userName}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">ID do Usuário</div>
                      <div className="text-white font-mono">{selectedTransaction.userId}</div>
                    </div>
                  </div>
                </div>

                {/* Transaction Details */}
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-3">Detalhes da Transação</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Tipo</div>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(selectedTransaction.type)}
                        <span className={`font-medium ${getTypeColor(selectedTransaction.type)}`}>
                          {getTypeText(selectedTransaction.type)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Valor</div>
                      <div className={`text-xl font-bold ${
                        selectedTransaction.type === 'withdrawal' ? 'text-red-400' : 'text-green-400'
                      }`}>
                        {selectedTransaction.type === 'withdrawal' ? '-' : '+'}${selectedTransaction.amount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-sm text-gray-400 mb-1">Descrição</div>
                    <div className="text-white">{selectedTransaction.description}</div>
                  </div>
                  {selectedTransaction.method && (
                    <div className="mt-4">
                      <div className="text-sm text-gray-400 mb-1">Método</div>
                      <div className="text-white">{selectedTransaction.method}</div>
                    </div>
                  )}
                </div>

                {/* Timestamp */}
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-3">Informações de Tempo</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Data/Hora</div>
                      <div className="text-white">{selectedTransaction.timestamp.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Há</div>
                      <div className="text-white">
                        {Math.floor((Date.now() - selectedTransaction.timestamp.getTime()) / (1000 * 60 * 60))}h atrás
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {selectedTransaction.status === 'pending' && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                    <h4 className="text-yellow-400 font-semibold mb-3">Ações Disponíveis</h4>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          handleStatusUpdate(selectedTransaction.id, 'completed');
                          setShowTransactionModal(false);
                        }}
                        className="flex-1 py-2 px-4 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-all font-medium"
                      >
                        Aprovar Transação
                      </button>
                      <button
                        onClick={() => {
                          handleStatusUpdate(selectedTransaction.id, 'failed');
                          setShowTransactionModal(false);
                        }}
                        className="flex-1 py-2 px-4 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all font-medium"
                      >
                        Rejeitar Transação
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowTransactionModal(false)}
                  className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminTransactions;
