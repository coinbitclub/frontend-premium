import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { FiDollarSign, FiCreditCard, FiDownload, FiCalendar, FiTrendingUp, FiBarChart, FiFilter, FiPlus, FiX, FiRefreshCw, FiLink } from 'react-icons/fi';
import { useLanguage } from '../../hooks/useLanguage';
import AffiliateLayout from '../../src/components/AffiliateLayout';

// Interfaces para comissões
interface Commission {
  id: string;
  referralName: string;
  referralEmail: string;
  amount: number;
  type: 'SIGNUP' | 'TRADING' | 'MONTHLY' | 'BONUS';
  date: Date;
  status: 'PAID' | 'PENDING' | 'PROCESSING' | 'REJECTED';
  transactionId?: string;
  paymentMethod?: string;
  description: string;
}

interface CommissionStats {
  totalEarned: number;
  monthlyEarnings: number;
  pendingPayments: number;
  totalWithdrawn: number;
  availableBalance: number;
  nextPaymentDate: Date;
}

interface WithdrawalRequest {
  id: string;
  amount: number;
  method: 'PIX' | 'BANK_TRANSFER';
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  requestDate: Date;
  completionDate?: Date;
  fees: number;
  netAmount: number;
}

const AffiliateCommissions: React.FC = () => {
  const [mounted, setMounted] = useState<boolean>(false);
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'commissions' | 'withdrawals'>('commissions');
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [showConversionModal, setShowConversionModal] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [conversionAmount, setConversionAmount] = useState('');
  const [withdrawalMethod, setWithdrawalMethod] = useState<'PIX' | 'BANK_TRANSFER'>('PIX');
  
  // Estados para dados de comissões
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [stats, setStats] = useState<CommissionStats>({
    totalEarned: 23456.70,
    monthlyEarnings: 1247.80,
    pendingPayments: 350.25,
    totalWithdrawn: 18750.00,
    availableBalance: 4356.45,
    nextPaymentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });

  // Estados para filtros
  const [filterPeriod, setFilterPeriod] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    setMounted(true);
    fetchCommissionData();
    generateWithdrawalData();

    // Analytics
    if (typeof window !== 'undefined' && typeof gtag !== 'undefined') {
      gtag('event', 'affiliate_commissions_view', {
        page_title: 'Affiliate Commissions',
        language: language,
        event_category: 'affiliate_engagement'
      });
    }
  }, [language]);

  const fetchCommissionData = async () => {
    try {
      const token = localStorage.getItem('auth_access_token');
      if (!token) {
        console.error('No auth token found');
        generateCommissionData(); // Fallback to mock data
        return;
      }

      // Fetch commissions and stats in parallel
      const [commissionsRes, statsRes] = await Promise.all([
        fetch('/api/affiliate/commissions?limit=100', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/affiliate/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (commissionsRes.ok) {
        const commissionsData = await commissionsRes.json();
        if (commissionsData.success && commissionsData.commissions) {
          const formattedCommissions: Commission[] = commissionsData.commissions.map((comm: any) => ({
            id: comm.id.toString(),
            referralName: comm.description || 'Commission',
            referralEmail: '',
            amount: comm.amount || 0,
            type: comm.type === 'signup' ? 'SIGNUP' :
                  comm.type === 'trading' ? 'TRADING' :
                  comm.type === 'bonus' ? 'BONUS' : 'MONTHLY',
            date: new Date(comm.createdAt),
            status: comm.status === 'pending' ? 'PENDING' :
                    comm.paidAt ? 'PAID' : 'PROCESSING',
            transactionId: comm.paidAt ? `TXN${comm.id}` : undefined,
            description: comm.description || ''
          }));
          setCommissions(formattedCommissions);
        }
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.success) {
          const currentBalance = statsData.stats.currentBalance || 0;
          const totalEarnings = statsData.stats.totalCommissions || 0;
          const monthlyEarnings = statsData.stats.monthlyCommissions || 0;

          setStats({
            totalEarned: totalEarnings,
            monthlyEarnings: monthlyEarnings,
            pendingPayments: currentBalance,
            totalWithdrawn: totalEarnings - currentBalance,
            availableBalance: currentBalance,
            nextPaymentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          });
        }
      }

    } catch (error) {
      console.error('Error fetching commission data:', error);
      generateCommissionData(); // Fallback to mock data on error
    }
  };

  const generateCommissionData = () => {
    const sampleCommissions: Commission[] = [
      {
        id: '1',
        referralName: 'João Silva',
        referralEmail: 'joao@email.com',
        amount: 125.50,
        type: 'TRADING',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        status: 'PAID',
        transactionId: 'TXN001234',
        paymentMethod: 'PIX',
        description: 'Comissão por trading - Volume: $2,510'
      },
      {
        id: '2',
        referralName: 'Maria Oliveira',
        referralEmail: 'maria@email.com',
        amount: 50.00,
        type: 'SIGNUP',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        status: 'PENDING',
        description: 'Comissão por cadastro e primeiro depósito'
      },
      {
        id: '3',
        referralName: 'Carlos Santos',
        referralEmail: 'carlos@email.com',
        amount: 200.75,
        type: 'MONTHLY',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        status: 'PROCESSING',
        description: 'Comissão mensal - Dezembro 2024'
      },
      {
        id: '4',
        referralName: 'Ana Paula',
        referralEmail: 'ana@email.com',
        amount: 300.00,
        type: 'BONUS',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        status: 'PAID',
        transactionId: 'TXN001235',
        paymentMethod: 'BANK_TRANSFER',
        description: 'Bônus por meta de indicações'
      }
    ];

    setCommissions(sampleCommissions);
  };

  const generateWithdrawalData = () => {
    const sampleWithdrawals: WithdrawalRequest[] = [
      {
        id: '1',
        amount: 1000.00,
        method: 'PIX',
        status: 'COMPLETED',
        requestDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        completionDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        fees: 5.00,
        netAmount: 995.00
      },
      {
        id: '2',
        amount: 500.00,
        method: 'BANK_TRANSFER',
        status: 'PENDING',
        requestDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        fees: 10.00,
        netAmount: 490.00
      }
    ];

    setWithdrawals(sampleWithdrawals);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
      case 'COMPLETED': return 'bg-green-500/20 text-green-400 border border-green-500/30';
      case 'PENDING': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
      case 'PROCESSING': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 'REJECTED': return 'bg-red-500/20 text-red-400 border border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'TRADING': return 'bg-orange-500/20 text-orange-400';
      case 'SIGNUP': return 'bg-green-500/20 text-green-400';
      case 'MONTHLY': return 'bg-blue-500/20 text-blue-400';
      case 'BONUS': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'TRADING': return 'Trading';
      case 'SIGNUP': return 'Cadastro';
      case 'MONTHLY': return 'Mensal';
      case 'BONUS': return 'Bônus';
      default: return type;
    }
  };

  const handleWithdrawal = async () => {
    const amount = parseFloat(withdrawalAmount);
    if (amount > 0 && amount <= stats.availableBalance) {
      const token = localStorage.getItem('auth_access_token');

      try {
        const response = await fetch('/api/affiliate/withdraw', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            amount,
            method: withdrawalMethod
          })
        });

        if (response.ok) {
          const data = await response.json();

          // Refresh data from API
          await fetchCommissionData();

          setShowWithdrawalModal(false);
          setWithdrawalAmount('');

          if (typeof gtag !== 'undefined') {
            gtag('event', 'withdrawal_request', {
              amount: amount,
              method: withdrawalMethod,
              event_category: 'affiliate_financial'
            });
          }

          alert(`Saque solicitado com sucesso! Valor líquido: $${data.withdrawal.netAmount.toFixed(2)}`);
        } else {
          const error = await response.json();
          alert(`Erro ao solicitar saque: ${error.error}`);
        }
      } catch (error) {
        console.error('Withdrawal error:', error);
        alert('Erro ao processar saque. Tente novamente.');
      }
    }
  };

  const handleConversion = async () => {
    const amount = parseFloat(conversionAmount);
    if (amount > 0 && amount <= stats.availableBalance) {
      const token = localStorage.getItem('auth_access_token');

      try {
        const response = await fetch('/api/affiliate/convert-to-credit', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ amount })
        });

        if (response.ok) {
          const data = await response.json();

          // Refresh data from API
          await fetchCommissionData();

          setShowConversionModal(false);
          setConversionAmount('');

          alert(
            `Conversão realizada com sucesso!\n\n` +
            `Valor convertido: $${data.conversion.amount.toFixed(2)}\n` +
            `Bônus (10%): $${data.conversion.bonus.toFixed(2)}\n` +
            `Total em créditos: $${data.conversion.total.toFixed(2)}`
          );

          if (typeof gtag !== 'undefined') {
            gtag('event', 'commission_conversion', {
              amount: amount,
              bonus: data.conversion.bonus,
              total_credit: data.conversion.total,
              event_category: 'affiliate_financial'
            });
          }
        } else {
          const error = await response.json();
          alert(`Erro ao converter: ${error.error}`);
        }
      } catch (error) {
        console.error('Conversion error:', error);
        alert('Erro ao processar conversão. Tente novamente.');
      }
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-400 mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">CoinBitClub</h2>
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Comissões e Saques | CoinBitClub</title>
        <meta name="description" content="Acompanhe suas comissões e gerencie saques do programa de afiliados" />
      </Head>

      <AffiliateLayout title="Comissões e Saques">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent mb-2">
              Comissões e Saques
            </h1>
            <p className="text-gray-400 mb-4">
              Acompanhe seus ganhos e gerencie suas retiradas
            </p>
            
            {/* Informações sobre Dados Bancários */}
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <FiCreditCard className="text-blue-400 text-lg" />
                </div>
                <div>
                  <h3 className="text-blue-400 font-semibold mb-2">Dados para Saque</h3>
                  <div className="text-gray-300 text-sm space-y-2">
                    <p>• <strong>PIX:</strong> Utiliza a chave PIX cadastrada na sua área do usuário</p>
                    <p>• <strong>Transferência Bancária:</strong> Utiliza os dados bancários da sua área do usuário</p>
                    <p className="text-yellow-400">
                      <strong>Importante:</strong> Certifique-se de que seus dados bancários estão atualizados na área do usuário antes de solicitar um saque.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cards financeiros */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/30 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center">
                  <FiDollarSign className="text-2xl text-green-400" />
                </div>
                <span className="text-green-400 text-sm font-bold">DISPONÍVEL</span>
              </div>
              <h3 className="text-gray-400 text-sm font-medium mb-1">Saldo Disponível</h3>
              <p className="text-3xl font-bold text-white">${stats.availableBalance.toFixed(2)}</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/30 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-xl flex items-center justify-center">
                  <FiTrendingUp className="text-2xl text-orange-400" />
                </div>
                <span className="text-orange-400 text-sm font-bold">MENSAL</span>
              </div>
              <h3 className="text-gray-400 text-sm font-medium mb-1">Ganhos do Mês</h3>
              <p className="text-3xl font-bold text-white">${stats.monthlyEarnings.toFixed(2)}</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/30 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-xl flex items-center justify-center">
                  <FiBarChart className="text-2xl text-yellow-400" />
                </div>
                <span className="text-yellow-400 text-sm font-bold">TOTAL</span>
              </div>
              <h3 className="text-gray-400 text-sm font-medium mb-1">Total Ganho</h3>
              <p className="text-3xl font-bold text-white">${stats.totalEarned.toFixed(2)}</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/30 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                  <FiDownload className="text-2xl text-blue-400" />
                </div>
                <span className="text-blue-400 text-sm font-bold">SACADO</span>
              </div>
              <h3 className="text-gray-400 text-sm font-medium mb-1">Total Sacado</h3>
              <p className="text-3xl font-bold text-white">${stats.totalWithdrawn.toFixed(2)}</p>
            </motion.div>
          </div>

          {/* Botões de Ação */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <button
              onClick={() => setShowWithdrawalModal(true)}
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-bold px-8 py-4 rounded-xl transition-all flex items-center gap-3 group"
            >
              <FiPlus className="group-hover:rotate-90 transition-transform" />
              Solicitar Saque
            </button>
            
            <button
              onClick={() => setShowConversionModal(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-black font-bold px-8 py-4 rounded-xl transition-all flex items-center gap-3 group"
            >
              <FiRefreshCw className="group-hover:rotate-180 transition-transform" />
              Converter em Crédito (+10%)
            </button>
          </motion.div>

          {/* Tabs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/30"
          >
            <div className="flex border-b border-gray-700/50">
              <button
                onClick={() => setActiveTab('commissions')}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === 'commissions'
                    ? 'text-orange-400 border-b-2 border-orange-400 bg-orange-500/5'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Histórico de Comissões
              </button>
              <button
                onClick={() => setActiveTab('withdrawals')}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === 'withdrawals'
                    ? 'text-orange-400 border-b-2 border-orange-400 bg-orange-500/5'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Saques
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'commissions' && (
                <div className="space-y-6">
                  {/* Filtros */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <select
                      value={filterPeriod}
                      onChange={(e) => setFilterPeriod(e.target.value)}
                      className="px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                    >
                      <option value="all">Todos os períodos</option>
                      <option value="today">Hoje</option>
                      <option value="week">Esta semana</option>
                      <option value="month">Este mês</option>
                      <option value="quarter">Últimos 3 meses</option>
                    </select>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                    >
                      <option value="all">Todos os tipos</option>
                      <option value="TRADING">Trading</option>
                      <option value="SIGNUP">Cadastro</option>
                      <option value="MONTHLY">Mensal</option>
                      <option value="BONUS">Bônus</option>
                    </select>
                  </div>

                  {/* Lista de Comissões */}
                  <div className="space-y-4">
                    {commissions.map((commission, index) => (
                      <motion.div
                        key={commission.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="p-6 bg-gray-700/30 rounded-lg border border-gray-600/30"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-white font-semibold">{commission.referralName}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(commission.type)}`}>
                                {getTypeText(commission.type)}
                              </span>
                            </div>
                            <p className="text-gray-400 text-sm mb-1">{commission.description}</p>
                            <p className="text-gray-500 text-xs">{commission.date.toLocaleDateString()}</p>
                          </div>
                          
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <p className="text-white font-bold text-lg">${commission.amount.toFixed(2)}</p>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(commission.status)}`}>
                                {commission.status === 'PAID' ? 'Pago' :
                                 commission.status === 'PENDING' ? 'Pendente' :
                                 commission.status === 'PROCESSING' ? 'Processando' : 'Rejeitado'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'withdrawals' && (
                <div className="space-y-4">
                  {withdrawals.map((withdrawal, index) => (
                    <motion.div
                      key={withdrawal.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="p-6 bg-gray-700/30 rounded-lg border border-gray-600/30"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div>
                          <h4 className="text-white font-semibold mb-2">
                            Saque via {withdrawal.method === 'PIX' ? 'PIX' : 'Transferência Bancária'}
                          </h4>
                          <p className="text-gray-400 text-sm">
                            Solicitado em: {withdrawal.requestDate.toLocaleDateString()}
                          </p>
                          {withdrawal.completionDate && (
                            <p className="text-gray-400 text-sm">
                              Concluído em: {withdrawal.completionDate.toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        
                        <div className="text-right">
                          <p className="text-white font-bold">Bruto: ${withdrawal.amount.toFixed(2)}</p>
                          <p className="text-gray-400 text-sm">Taxa: ${withdrawal.fees.toFixed(2)}</p>
                          <p className="text-green-400 font-semibold">Líquido: ${withdrawal.netAmount.toFixed(2)}</p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${getStatusColor(withdrawal.status)}`}>
                            {withdrawal.status === 'COMPLETED' ? 'Concluído' :
                             withdrawal.status === 'PENDING' ? 'Pendente' :
                             withdrawal.status === 'APPROVED' ? 'Aprovado' : 'Rejeitado'}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {withdrawals.length === 0 && (
                    <div className="text-center py-12">
                      <FiDownload className="text-6xl text-gray-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-400 mb-2">Nenhum saque realizado</h3>
                      <p className="text-gray-500">Solicite seu primeiro saque quando atingir o valor mínimo</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Modal de Saque */}
        {showWithdrawalModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-8 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Solicitar Saque</h3>
                <button
                  onClick={() => setShowWithdrawalModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-blue-500/20 rounded-lg border border-blue-500/30">
                  <h4 className="text-blue-400 font-semibold mb-2 flex items-center gap-2">
                    <FiLink className="text-lg" />
                    Dados Bancários Vinculados
                  </h4>
                  <p className="text-blue-300 text-sm">
                    O saque será realizado utilizando os dados bancários cadastrados na sua área do usuário. 
                    Verifique se suas informações estão corretas antes de prosseguir.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Valor do Saque
                  </label>
                  <input
                    type="number"
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <p className="text-sm text-gray-400 mt-1">
                    Disponível: ${stats.availableBalance.toFixed(2)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Método de Pagamento
                  </label>
                  <select
                    value={withdrawalMethod}
                    onChange={(e) => setWithdrawalMethod(e.target.value as any)}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    <option value="PIX">PIX (Taxa: 0.5%)</option>
                    <option value="BANK_TRANSFER">Transferência Bancária (Taxa: 1%)</option>
                  </select>
                  <p className="text-sm text-gray-400 mt-2">
                    {withdrawalMethod === 'PIX' 
                      ? 'Será utilizada a chave PIX cadastrada na sua conta'
                      : 'Serão utilizados os dados bancários cadastrados na sua conta'
                    }
                  </p>
                </div>

                {withdrawalAmount && (
                  <div className="p-4 bg-gray-700/30 rounded-lg">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Valor solicitado:</span>
                      <span className="text-white">${parseFloat(withdrawalAmount || '0').toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Taxa ({withdrawalMethod === 'PIX' ? '0.5%' : '1%'}):</span>
                      <span className="text-red-400">-${(parseFloat(withdrawalAmount || '0') * (withdrawalMethod === 'PIX' ? 0.005 : 0.01)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span className="text-gray-300">Valor líquido:</span>
                      <span className="text-green-400">${(parseFloat(withdrawalAmount || '0') - (parseFloat(withdrawalAmount || '0') * (withdrawalMethod === 'PIX' ? 0.005 : 0.01))).toFixed(2)}</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowWithdrawalModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleWithdrawal}
                    disabled={!withdrawalAmount || parseFloat(withdrawalAmount) <= 0 || parseFloat(withdrawalAmount) > stats.availableBalance}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirmar Saque
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Modal de Conversão em Crédito */}
        {showConversionModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-8 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Converter em Crédito</h3>
                <button
                  onClick={() => setShowConversionModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-green-500/20 rounded-lg border border-green-500/30">
                  <h4 className="text-green-400 font-semibold mb-2">Promoção Especial!</h4>
                  <p className="text-green-300 text-sm">
                    Converta suas comissões em crédito para usar no sistema e ganhe <span className="font-bold">10% de bônus</span>!
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Valor para Conversão
                  </label>
                  <input
                    type="number"
                    value={conversionAmount}
                    onChange={(e) => setConversionAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                  <p className="text-sm text-gray-400 mt-1">
                    Disponível: ${stats.availableBalance.toFixed(2)}
                  </p>
                </div>

                {conversionAmount && (
                  <div className="p-4 bg-gray-700/30 rounded-lg">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Valor para conversão:</span>
                      <span className="text-white">${parseFloat(conversionAmount || '0').toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Bônus (10%):</span>
                      <span className="text-green-400">+${(parseFloat(conversionAmount || '0') * 0.1).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span className="text-gray-300">Total em crédito:</span>
                      <span className="text-green-400">${(parseFloat(conversionAmount || '0') * 1.1).toFixed(2)}</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConversionModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConversion}
                    disabled={!conversionAmount || parseFloat(conversionAmount) <= 0 || parseFloat(conversionAmount) > stats.availableBalance}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-black font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Converter
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AffiliateLayout>
    </>
  );
};

export default AffiliateCommissions;
