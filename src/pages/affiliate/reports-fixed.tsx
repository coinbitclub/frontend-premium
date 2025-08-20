import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Card from '../../components/Card';
import { useTracking } from '../../hooks/useTracking';
import AffiliateLayout from '../../components/AffiliateLayout';
import {
  BarChart3,
  FileBarChart,
  Download,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
  Printer,
} from 'lucide-react';

// Mock data para relatórios
const monthlyData = [
  { month: 'Jan 2025', referrals: 8, commissions: 320.50, deposits: 6400.00, conversions: 62.5 },
  { month: 'Fev 2025', referrals: 12, commissions: 485.75, deposits: 9715.00, conversions: 66.7 },
  { month: 'Mar 2025', referrals: 15, commissions: 612.30, deposits: 12246.00, conversions: 73.3 },
  { month: 'Abr 2025', referrals: 18, commissions: 724.80, deposits: 14496.00, conversions: 77.8 },
  { month: 'Mai 2025', referrals: 22, commissions: 891.25, deposits: 17825.00, conversions: 81.8 },
  { month: 'Jun 2025', referrals: 25, commissions: 1024.60, deposits: 20492.00, conversions: 84.0 },
  { month: 'Jul 2025', referrals: 29, commissions: 1185.90, deposits: 23718.00, conversions: 86.2 },
  { month: 'Ago 2025', referrals: 32, commissions: 1298.45, deposits: 25969.00, conversions: 87.5 },
];

const topReferrers = [
  { name: 'João Silva', referrals: 8, commissions: 245.80, conversionRate: 87.5 },
  { name: 'Maria Santos', referrals: 6, commissions: 189.50, conversionRate: 83.3 },
  { name: 'Ana Oliveira', referrals: 5, commissions: 156.25, conversionRate: 80.0 },
  { name: 'Pedro Costa', referrals: 4, commissions: 125.90, conversionRate: 75.0 },
  { name: 'Carlos Mendes', referrals: 3, commissions: 98.75, conversionRate: 66.7 },
];

const performanceMetrics = {
  totalReferrals: 47,
  activeReferrals: 32,
  totalCommissions: 1438.19,
  averageCommission: 44.94,
  conversionRate: 68.1,
  growthRate: 15.3,
  topMonth: 'Agosto 2025',
  bestConversion: 87.5,
};

const trafficSources = [
  { source: 'WhatsApp', referrals: 18, percentage: 38.3, commissions: 542.45 },
  { source: 'Instagram', referrals: 12, percentage: 25.5, commissions: 398.20 },
  { source: 'Facebook', referrals: 8, percentage: 17.0, commissions: 245.80 },
  { source: 'Telegram', referrals: 5, percentage: 10.6, commissions: 156.25 },
  { source: 'YouTube', referrals: 2, percentage: 4.3, commissions: 62.50 },
  { source: 'Outros', referrals: 2, percentage: 4.3, commissions: 32.99 },
];

const ReportsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('last-6-months');
  const [reportType, setReportType] = useState('general');
  const { track } = useTracking();

  // Analytics tracking
  useEffect(() => {
    track('page_view', {
      page_name: 'affiliate_reports',
      user_role: 'affiliate',
      timestamp: new Date().toISOString()
    });
  }, [track]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const exportReport = (format: 'pdf' | 'csv') => {
    track('export_report', {
      format: format,
      report_type: reportType,
      period: selectedPeriod,
      source: 'reports_page'
    });

    if (format === 'csv') {
      // Export to CSV
      const csvData = [
        ['Mês', 'Indicados', 'Comissões', 'Depósitos', 'Taxa Conversão'],
        ...monthlyData.map(item => [
          item.month,
          item.referrals.toString(),
          item.commissions.toFixed(2),
          item.deposits.toFixed(2),
          `${item.conversions}%`
        ])
      ];

      const csvContent = csvData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `relatorio-afiliados-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Mock PDF export
      alert('Funcionalidade de exportação PDF será implementada em breve!');
    }
  };

  return (
    <AffiliateLayout>
      <Head>
        <title>Relatórios - Afiliados CoinBit Club</title>
        <meta name="description" content="Relatórios detalhados de performance e análise de afiliados" />
      </Head>

      <div className="min-h-screen bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-amber-400 glow-gold mb-2">
                📊 Relatórios & Analytics
              </h1>
              <p className="text-gray-400">
                Análise detalhada da sua performance como afiliado
              </p>
            </div>
            
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <button
                onClick={() => exportReport('csv')}
                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors duration-200"
              >
                <Download className="h-4 w-4 mr-2" />
                CSV
              </button>
              <button
                onClick={() => exportReport('pdf')}
                className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors duration-200"
              >
                <Printer className="h-4 w-4 mr-2" />
                PDF
              </button>
            </div>
          </div>

          {/* Filtros */}
          <Card className="bg-black border border-amber-500 rounded-lg p-6 mb-8 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div>
                  <label className="block text-sm font-medium text-amber-400 mb-1">
                    Período
                  </label>
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="bg-gray-900 border border-gray-600 text-white rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  >
                    <option value="last-month">Último Mês</option>
                    <option value="last-3-months">Últimos 3 Meses</option>
                    <option value="last-6-months">Últimos 6 Meses</option>
                    <option value="last-year">Último Ano</option>
                    <option value="all-time">Todo o Período</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-amber-400 mb-1">
                    Tipo de Relatório
                  </label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="bg-gray-900 border border-gray-600 text-white rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  >
                    <option value="general">Geral</option>
                    <option value="commissions">Comissões</option>
                    <option value="referrals">Indicados</option>
                    <option value="traffic">Tráfego</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>

          {/* Métricas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-black border border-amber-500 rounded-lg p-6 shadow-lg hover:shadow-amber-400/20 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-400">Total de Indicados</p>
                  <p className="text-2xl font-bold text-white">{performanceMetrics.totalReferrals}</p>
                  <p className="text-xs text-green-400">+{performanceMetrics.growthRate}% este mês</p>
                </div>
                <Users className="h-8 w-8 text-amber-400" />
              </div>
            </Card>

            <Card className="bg-black border border-green-500 rounded-lg p-6 shadow-lg hover:shadow-green-400/20 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-400">Total Comissões</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(performanceMetrics.totalCommissions)}</p>
                  <p className="text-xs text-green-400">Média: {formatCurrency(performanceMetrics.averageCommission)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-400" />
              </div>
            </Card>

            <Card className="bg-black border border-blue-500 rounded-lg p-6 shadow-lg hover:shadow-blue-400/20 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-400">Taxa de Conversão</p>
                  <p className="text-2xl font-bold text-white">{formatPercentage(performanceMetrics.conversionRate)}</p>
                  <p className="text-xs text-green-400">Máximo: {formatPercentage(performanceMetrics.bestConversion)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-400" />
              </div>
            </Card>

            <Card className="bg-black border border-purple-500 rounded-lg p-6 shadow-lg hover:shadow-purple-400/20 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-400">Indicados Ativos</p>
                  <p className="text-2xl font-bold text-white">{performanceMetrics.activeReferrals}</p>
                  <p className="text-xs text-blue-400">de {performanceMetrics.totalReferrals} total</p>
                </div>
                <Users className="h-8 w-8 text-purple-400" />
              </div>
            </Card>
          </div>

          {/* Gráfico de Performance Mensal */}
          <Card className="bg-black border border-amber-500 rounded-lg p-6 mb-8 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-amber-400">Performance Mensal</h2>
              <BarChart3 className="h-6 w-6 text-amber-400" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 text-sm font-medium text-gray-400">Mês</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-400">Indicados</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-400">Comissões</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-400">Depósitos</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-400">Conversão</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {monthlyData.map((month, index) => (
                    <tr key={index} className="hover:bg-gray-900/50 transition-colors">
                      <td className="py-3 text-sm text-white">{month.month}</td>
                      <td className="py-3 text-sm text-right text-blue-400">{month.referrals}</td>
                      <td className="py-3 text-sm text-right text-green-400">{formatCurrency(month.commissions)}</td>
                      <td className="py-3 text-sm text-right text-purple-400">{formatCurrency(month.deposits)}</td>
                      <td className="py-3 text-sm text-right text-amber-400">{formatPercentage(month.conversions)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Top Indicados */}
            <Card className="bg-black border border-amber-500 rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-amber-400">Top 5 Indicados</h2>
                <TrendingUp className="h-6 w-6 text-amber-400" />
              </div>

              <div className="space-y-4">
                {topReferrers.map((referrer, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-xs">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{referrer.name}</p>
                        <p className="text-xs text-gray-400">{referrer.referrals} indicados</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-400">{formatCurrency(referrer.commissions)}</p>
                      <p className="text-xs text-blue-400">{formatPercentage(referrer.conversionRate)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Fontes de Tráfego */}
            <Card className="bg-black border border-amber-500 rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-amber-400">Fontes de Tráfego</h2>
                <BarChart3 className="h-6 w-6 text-amber-400" />
              </div>

              <div className="space-y-4">
                {trafficSources.map((source, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white">{source.source}</span>
                      <div className="text-right">
                        <span className="text-sm text-amber-400">{source.referrals} indicados</span>
                        <span className="text-xs text-gray-400 ml-2">({formatPercentage(source.percentage)})</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-amber-400 to-yellow-500 h-2 rounded-full"
                        style={{ width: `${source.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-green-400">
                      {formatCurrency(source.commissions)} em comissões
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Insights e Recomendações */}
          <Card className="bg-black border border-amber-500 rounded-lg p-6 shadow-lg hover:shadow-amber-400/20 transition-all duration-300">
            <h3 className="text-lg font-semibold text-amber-400 glow-gold mb-6">🎯 Insights & Recomendações</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-medium text-amber-400 mb-3">🎯 Pontos Fortes</h4>
                <ul className="space-y-2 text-sm text-pink-400">
                  <li>• Taxa de conversão {performanceMetrics.conversionRate}% acima da média do setor</li>
                  <li>• Crescimento constante de {performanceMetrics.growthRate}% ao mês</li>
                  <li>• WhatsApp é sua fonte mais eficaz de tráfego</li>
                  <li>• Comissão média de {formatCurrency(performanceMetrics.averageCommission)} por indicado</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-amber-400 mb-3">💡 Oportunidades de Melhoria</h4>
                <ul className="space-y-2 text-sm text-pink-400">
                  <li>• Explorar mais o YouTube para aumentar alcance</li>
                  <li>• Focar em retenção dos indicados inativos</li>
                  <li>• Criar conteúdo para Instagram e Facebook</li>
                  <li>• Implementar follow-up para indicados pendentes</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AffiliateLayout>
  );
};

export default ReportsPage;
