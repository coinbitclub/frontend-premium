import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { FiBarChart, FiPieChart, FiTrendingUp, FiUsers, FiTarget, FiActivity, FiCalendar, FiDownload, FiDollarSign, FiCreditCard, FiClock, FiArrowDownLeft, FiRefreshCw, FiGift } from 'react-icons/fi';
import { useLanguage } from '../../hooks/useLanguage';
import AffiliateLayout from '../../src/components/AffiliateLayout';

// Interfaces para relatórios
interface MonthlyData {
  month: string;
  referrals: number;
  commissions: number;
  conversions: number;
  revenue: number;
}

interface PerformanceMetrics {
  totalClicks: number;
  uniqueVisitors: number;
  signupConversions: number;
  tradingConversions: number;
  averageOrderValue: number;
  customerLifetimeValue: number;
}

interface TopReferral {
  id: string;
  name: string;
  email: string;
  totalCommissions: number;
  totalTrades: number;
  joinDate: Date;
  successRate: number;
}

interface ReportData {
  performanceMetrics: PerformanceMetrics;
  monthlyData: MonthlyData[];
  topReferrals: TopReferral[];
  conversionFunnel: {
    clicks: number;
    visitors: number;
    signups: number;
    depositsFirstTime: number;
    activeTradersMonth: number;
  };
}

const AffiliateReports: React.FC = () => {
  const [mounted, setMounted] = useState<boolean>(false);
  const { language, t } = useLanguage();
  const [selectedPeriod, setSelectedPeriod] = useState<string>('month');
  const [activeReport, setActiveReport] = useState<'overview' | 'top-referrals' | 'financial'>('overview');
  
  // Estados para dados de relatórios
  const [reportData, setReportData] = useState<ReportData>({
    performanceMetrics: {
      totalClicks: 8947,
      uniqueVisitors: 3245,
      signupConversions: 156,
      tradingConversions: 89,
      averageOrderValue: 2850.75,
      customerLifetimeValue: 8945.30
    },
    monthlyData: [],
    topReferrals: [],
    conversionFunnel: {
      clicks: 8947,
      visitors: 3245,
      signups: 156,
      depositsFirstTime: 89,
      activeTradersMonth: 47
    }
  });

  useEffect(() => {
    setMounted(true);
    generateReportData();
    
    // Analytics
    if (typeof window !== 'undefined' && typeof gtag !== 'undefined') {
      gtag('event', 'affiliate_reports_view', {
        page_title: 'Affiliate Reports',
        language: language,
        event_category: 'affiliate_engagement',
        report_type: activeReport
      });
    }
  }, [language, activeReport]);

  const generateReportData = () => {
    // Dados mensais dos últimos 6 meses
    const monthlyData: MonthlyData[] = [
      { month: 'Jun', referrals: 8, commissions: 420.50, conversions: 12, revenue: 8410.00 },
      { month: 'Jul', referrals: 12, commissions: 630.75, conversions: 18, revenue: 12615.00 },
      { month: 'Ago', referrals: 15, commissions: 852.30, conversions: 22, revenue: 17046.00 },
      { month: 'Set', referrals: 11, commissions: 671.25, conversions: 16, revenue: 13425.00 },
      { month: 'Out', referrals: 18, commissions: 1085.40, conversions: 28, revenue: 21708.00 },
      { month: 'Nov', referrals: 23, commissions: 1387.60, conversions: 35, revenue: 27752.00 }
    ];

    // Top referrals
    const topReferrals: TopReferral[] = [
      {
        id: '1',
        name: 'Ana Paula Ferreira',
        email: 'ana.paula@email.com',
        totalCommissions: 2847.50,
        totalTrades: 156,
        joinDate: new Date(2024, 8, 15),
        successRate: 94.2
      },
      {
        id: '2',
        name: 'Carlos Eduardo Santos',
        email: 'carlos.eduardo@email.com',
        totalCommissions: 2156.75,
        totalTrades: 98,
        joinDate: new Date(2024, 9, 2),
        successRate: 87.8
      },
      {
        id: '3',
        name: 'Maria Oliveira Costa',
        email: 'maria.oliveira@email.com',
        totalCommissions: 1923.40,
        totalTrades: 87,
        joinDate: new Date(2024, 7, 28),
        successRate: 89.7
      },
      {
        id: '4',
        name: 'João Silva Santos',
        email: 'joao.silva@email.com',
        totalCommissions: 1654.30,
        totalTrades: 76,
        joinDate: new Date(2024, 10, 10),
        successRate: 91.2
      },
      {
        id: '5',
        name: 'Roberto Mendes Lima',
        email: 'roberto.mendes@email.com',
        totalCommissions: 1387.25,
        totalTrades: 62,
        joinDate: new Date(2024, 6, 18),
        successRate: 83.5
      }
    ];

    setReportData(prev => ({
      ...prev,
      monthlyData,
      topReferrals
    }));
  };

  const getFunnelPercentage = (current: number, total: number): number => {
    return total > 0 ? (current / total) * 100 : 0;
  };

  const downloadReport = () => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'report_download', {
        report_type: activeReport,
        period: selectedPeriod,
        event_category: 'affiliate_interaction'
      });
    }
    // Implementar download de relatório
    alert('Funcionalidade de download será implementada em breve!');
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
        <title>Relatórios e Analytics | CoinBitClub</title>
        <meta name="description" content="Relatórios detalhados e analytics do programa de afiliados" />
      </Head>

      <AffiliateLayout title="Relatórios e Analytics">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent mb-2">
                Relatórios e Analytics
              </h1>
              <p className="text-gray-400">
                Análise detalhada da performance do seu programa de afiliados
              </p>
            </div>
            
            <div className="flex gap-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-400/50"
              >
                <option value="week">Última semana</option>
                <option value="month">Último mês</option>
                <option value="quarter">Últimos 3 meses</option>
                <option value="year">Último ano</option>
              </select>
              
              <button
                onClick={downloadReport}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-medium rounded-lg transition-all flex items-center gap-2"
              >
                <FiDownload className="w-4 h-4" />
                Exportar
              </button>
            </div>
          </div>

          {/* Navegação de relatórios */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/30"
          >
            <div className="flex overflow-x-auto border-b border-gray-700/50">
              {[
                { id: 'overview', label: 'Visão Geral', icon: FiBarChart },
                { id: 'top-referrals', label: 'Top Indicações', icon: FiUsers },
                { id: 'financial', label: 'Controle Financeiro', icon: FiDollarSign }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveReport(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                    activeReport === tab.id
                      ? 'text-orange-400 border-b-2 border-orange-400 bg-orange-500/5'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {/* Visão Geral */}
              {activeReport === 'overview' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-600/30">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                          <FiActivity className="text-2xl text-blue-400" />
                        </div>
                        <span className="text-blue-400 text-sm font-bold">TRÁFEGO</span>
                      </div>
                      <h3 className="text-gray-400 text-sm font-medium mb-1">Total de Cliques</h3>
                      <p className="text-2xl font-bold text-white">{reportData.performanceMetrics.totalClicks.toLocaleString()}</p>
                      <p className="text-gray-400 text-sm mt-2">
                        {reportData.performanceMetrics.uniqueVisitors.toLocaleString()} visitantes únicos
                      </p>
                    </div>

                    <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-600/30">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center">
                          <FiUsers className="text-2xl text-green-400" />
                        </div>
                        <span className="text-green-400 text-sm font-bold">CONVERSÕES</span>
                      </div>
                      <h3 className="text-gray-400 text-sm font-medium mb-1">Cadastros</h3>
                      <p className="text-2xl font-bold text-white">{reportData.performanceMetrics.signupConversions}</p>
                      <p className="text-gray-400 text-sm mt-2">
                        {((reportData.performanceMetrics.signupConversions / reportData.performanceMetrics.uniqueVisitors) * 100).toFixed(1)}% taxa de conversão
                      </p>
                    </div>

                    <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-600/30">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-xl flex items-center justify-center">
                          <FiTrendingUp className="text-2xl text-orange-400" />
                        </div>
                        <span className="text-orange-400 text-sm font-bold">TRADING</span>
                      </div>
                      <h3 className="text-gray-400 text-sm font-medium mb-1">Traders Ativos</h3>
                      <p className="text-2xl font-bold text-white">{reportData.performanceMetrics.tradingConversions}</p>
                      <p className="text-gray-400 text-sm mt-2">
                        {((reportData.performanceMetrics.tradingConversions / reportData.performanceMetrics.signupConversions) * 100).toFixed(1)}% dos cadastros
                      </p>
                    </div>
                  </div>

                  {/* Gráfico mensal simulado */}
                  <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-600/30">
                    <h3 className="text-xl font-bold text-white mb-6">Performance Mensal</h3>
                    <div className="space-y-4">
                      {reportData.monthlyData.map((data, index) => (
                        <div key={data.month} className="flex items-center justify-between p-4 bg-gray-600/30 rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-lg flex items-center justify-center font-bold text-black">
                              {data.month}
                            </div>
                            <div>
                              <h4 className="text-white font-semibold">{data.referrals} Indicações</h4>
                              <p className="text-gray-400 text-sm">{data.conversions} conversões</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-bold">${data.commissions.toFixed(2)}</p>
                            <p className="text-gray-400 text-sm">Comissões</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Top Indicações */}
              {activeReport === 'top-referrals' && (
                <div className="space-y-6">
                  <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-600/30">
                    <h3 className="text-lg font-bold text-white mb-6">Top 5 Indicações por Comissão</h3>
                    <div className="space-y-4">
                      {reportData.topReferrals.map((referral, index) => (
                        <div key={referral.id} className="flex items-center justify-between p-4 bg-gray-600/30 rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full flex items-center justify-center font-bold text-black text-lg">
                              #{index + 1}
                            </div>
                            <div>
                              <h4 className="text-white font-semibold">{referral.name}</h4>
                              <p className="text-gray-400 text-sm">{referral.email}</p>
                              <p className="text-gray-500 text-xs">
                                Membro desde: {referral.joinDate.toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex gap-6 text-center">
                            <div>
                              <p className="text-green-400 font-bold">${referral.totalCommissions.toFixed(2)}</p>
                              <p className="text-gray-400 text-xs">Comissões</p>
                            </div>
                            <div>
                              <p className="text-blue-400 font-bold">{referral.totalTrades}</p>
                              <p className="text-gray-400 text-xs">Trades</p>
                            </div>
                            <div>
                              <p className="text-orange-400 font-bold">{referral.successRate}%</p>
                              <p className="text-gray-400 text-xs">Sucesso</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Controle Financeiro */}
              {activeReport === 'financial' && (
                <div className="space-y-8">
                  {/* Cards Resumo Financeiro */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg p-6 border border-green-500/20">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                          <FiDollarSign className="text-2xl text-green-400" />
                        </div>
                        <span className="text-green-400 text-sm font-bold">TOTAL</span>
                      </div>
                      <h3 className="text-gray-400 text-sm font-medium mb-1">Comissões Ganhas</h3>
                      <p className="text-2xl font-bold text-white">R$ 15.240,00</p>
                      <p className="text-green-400 text-sm mt-2">+18% este mês</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg p-6 border border-blue-500/20">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                          <FiCreditCard className="text-2xl text-blue-400" />
                        </div>
                        <span className="text-blue-400 text-sm font-bold">DISPONÍVEL</span>
                      </div>
                      <h3 className="text-gray-400 text-sm font-medium mb-1">Saldo Disponível</h3>
                      <p className="text-2xl font-bold text-white">R$ 8.450,00</p>
                      <p className="text-blue-400 text-sm mt-2">Para saque</p>
                    </div>

                    <div className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 rounded-lg p-6 border border-orange-500/20">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                          <FiClock className="text-2xl text-orange-400" />
                        </div>
                        <span className="text-orange-400 text-sm font-bold">PENDENTE</span>
                      </div>
                      <h3 className="text-gray-400 text-sm font-medium mb-1">Em Processamento</h3>
                      <p className="text-2xl font-bold text-white">R$ 2.340,00</p>
                      <p className="text-orange-400 text-sm mt-2">3-5 dias úteis</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg p-6 border border-purple-500/20">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                          <FiTrendingUp className="text-2xl text-purple-400" />
                        </div>
                        <span className="text-purple-400 text-sm font-bold">CRÉDITOS</span>
                      </div>
                      <h3 className="text-gray-400 text-sm font-medium mb-1">Créditos na Conta</h3>
                      <p className="text-2xl font-bold text-white">R$ 4.450,00</p>
                      <p className="text-purple-400 text-sm mt-2">Bonus incluído</p>
                    </div>
                  </div>

                  {/* Histórico de Transações */}
                  <div className="bg-gray-700/30 rounded-lg border border-gray-600/30">
                    <div className="p-6 border-b border-gray-600/30">
                      <h3 className="text-xl font-bold text-white mb-2">Histórico de Transações</h3>
                      <p className="text-gray-400">Registro completo de todas as movimentações financeiras</p>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {[
                          {
                            id: 1,
                            type: 'comissao',
                            description: 'Comissão - Referral João Silva',
                            amount: 'R$ 450,00',
                            status: 'concluido',
                            date: '15/12/2024',
                            icon: FiDollarSign,
                            color: 'text-green-400'
                          },
                          {
                            id: 2,
                            type: 'saque',
                            description: 'Saque PIX - Conta Bradesco',
                            amount: 'R$ 1.200,00',
                            status: 'processando',
                            date: '14/12/2024',
                            icon: FiArrowDownLeft,
                            color: 'text-orange-400'
                          },
                          {
                            id: 3,
                            type: 'conversao',
                            description: 'Conversão para crédito + 10% bonus',
                            amount: 'R$ 550,00',
                            status: 'concluido',
                            date: '13/12/2024',
                            icon: FiRefreshCw,
                            color: 'text-blue-400'
                          },
                          {
                            id: 4,
                            type: 'comissao',
                            description: 'Comissão - Referral Maria Santos',
                            amount: 'R$ 380,00',
                            status: 'concluido',
                            date: '12/12/2024',
                            icon: FiDollarSign,
                            color: 'text-green-400'
                          },
                          {
                            id: 5,
                            type: 'bonus',
                            description: 'Bonus de conversão (10%)',
                            amount: 'R$ 50,00',
                            status: 'concluido',
                            date: '13/12/2024',
                            icon: FiGift,
                            color: 'text-purple-400'
                          }
                        ].map((transaction) => (
                          <div 
                            key={transaction.id}
                            className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-600/30"
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 bg-gray-700/50 rounded-lg flex items-center justify-center ${transaction.color}`}>
                                <transaction.icon className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="text-white font-medium">{transaction.description}</p>
                                <p className="text-gray-400 text-sm">{transaction.date}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`font-bold ${transaction.color}`}>{transaction.amount}</p>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                transaction.status === 'concluido' 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : 'bg-orange-500/20 text-orange-400'
                              }`}>
                                {transaction.status === 'concluido' ? 'Concluído' : 'Processando'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 flex justify-center">
                        <button className="px-6 py-2 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50 rounded-lg text-gray-300 transition-all">
                          Carregar mais transações
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Gráfico de Evolução Financeira */}
                  <div className="bg-gray-700/30 rounded-lg border border-gray-600/30">
                    <div className="p-6 border-b border-gray-600/30">
                      <h3 className="text-xl font-bold text-white mb-2">Evolução Financeira</h3>
                      <p className="text-gray-400">Acompanhamento mensal das comissões e saques</p>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Gráfico de Comissões */}
                        <div className="bg-gray-800/50 rounded-lg p-4">
                          <h4 className="text-white font-medium mb-4">Comissões Mensais</h4>
                          <div className="space-y-3">
                            {[
                              { month: 'Dezembro', amount: 4580, percentage: 100 },
                              { month: 'Novembro', amount: 3920, percentage: 85 },
                              { month: 'Outubro', amount: 3440, percentage: 75 },
                              { month: 'Setembro', amount: 2890, percentage: 63 },
                              { month: 'Agosto', amount: 2340, percentage: 51 }
                            ].map((item) => (
                              <div key={item.month} className="flex items-center justify-between">
                                <span className="text-gray-300 text-sm">{item.month}</span>
                                <div className="flex items-center gap-3 flex-1 ml-4">
                                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                                    <div 
                                      className="bg-gradient-to-r from-green-400 to-emerald-400 h-2 rounded-full transition-all duration-1000"
                                      style={{ width: `${item.percentage}%` }}
                                    />
                                  </div>
                                  <span className="text-green-400 font-medium text-sm min-w-20">R$ {item.amount}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Estatísticas Detalhadas */}
                        <div className="bg-gray-800/50 rounded-lg p-4">
                          <h4 className="text-white font-medium mb-4">Estatísticas Detalhadas</h4>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400">Taxa de conversão média</span>
                              <span className="text-blue-400 font-bold">3.8%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400">Valor médio por comissão</span>
                              <span className="text-green-400 font-bold">R$ 385</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400">Total de saques realizados</span>
                              <span className="text-orange-400 font-bold">12</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400">Tempo médio de processamento</span>
                              <span className="text-purple-400 font-bold">2.5 dias</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400">Conversões para crédito</span>
                              <span className="text-cyan-400 font-bold">8</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400">Bonus total recebido</span>
                              <span className="text-pink-400 font-bold">R$ 245</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </AffiliateLayout>
    </>
  );
};

export default AffiliateReports;
