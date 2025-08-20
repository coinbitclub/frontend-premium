import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Card from '../../components/Card';
import { useTracking } from '../../hooks/useTracking';
import AffiliateLayout from '../../components/AffiliateLayout';
import {
  DollarSign,
  BarChart3,
  Calendar,
  TrendingUp,
  Download,
  Eye,
  Banknote,
  Clock,
  CheckCircle,
} from 'lucide-react';

// Mock data - seguindo o padrão do projeto
const commissionsData = [
  {
    id: 1,
    referralName: 'João Silva',
    referralEmail: 'joao.silva@email.com',
    amount: 45.50,
    type: 'DEPOSIT',
    status: 'PAID',
    date: '2025-08-16',
    paymentDate: '2025-08-16',
    referralDeposit: 910.00,
    commissionRate: 5.0,
    description: 'Comissão por depósito'
  },
  {
    id: 2,
    referralName: 'Maria Santos',
    referralEmail: 'maria.santos@email.com',
    amount: 32.25,
    type: 'TRADING',
    status: 'PAID',
    date: '2025-08-15',
    paymentDate: '2025-08-15',
    referralDeposit: 645.00,
    commissionRate: 5.0,
    description: 'Comissão por trading'
  },
  {
    id: 3,
    referralName: 'Ana Oliveira',
    referralEmail: 'ana.oliveira@email.com',
    amount: 80.00,
    type: 'SUBSCRIPTION',
    status: 'PENDING',
    date: '2025-08-14',
    paymentDate: null,
    referralDeposit: 800.00,
    commissionRate: 10.0,
    description: 'Comissão por assinatura premium'
  },
  {
    id: 4,
    referralName: 'Pedro Costa',
    referralEmail: 'pedro.costa@email.com',
    amount: 28.75,
    type: 'TRADING',
    status: 'PAID',
    date: '2025-08-13',
    paymentDate: '2025-08-13',
    referralDeposit: 575.00,
    commissionRate: 5.0,
    description: 'Comissão por trading'
  },
  {
    id: 5,
    referralName: 'Carlos Mendes',
    referralEmail: 'carlos.mendes@email.com',
    amount: 95.00,
    type: 'DEPOSIT',
    status: 'PROCESSING',
    date: '2025-08-12',
    paymentDate: null,
    referralDeposit: 1900.00,
    commissionRate: 5.0,
    description: 'Comissão por depósito'
  }
];

const CommissionsPage: React.FC = () => {
  const [commissions, setCommissions] = useState(commissionsData);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const { track } = useTracking();

  // Analytics tracking
  useEffect(() => {
    track('page_view', {
      page_name: 'affiliate_commissions',
      user_role: 'affiliate',
      timestamp: new Date().toISOString()
    });
  }, [track]);

  // Filtros e ordenação
  const filteredCommissions = commissions
    .filter(commission => {
      if (filter === 'all') return true;
      return commission.status.toLowerCase() === filter.toLowerCase();
    })
    .filter(commission => {
      if (selectedMonth === 'all') return true;
      const commissionMonth = new Date(commission.date).toISOString().substring(0, 7);
      return commissionMonth === selectedMonth;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'amount':
          return b.amount - a.amount;
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  // Estatísticas
  const totalEarned = commissions
    .filter(c => c.status === 'PAID')
    .reduce((sum, c) => sum + c.amount, 0);

  const pendingAmount = commissions
    .filter(c => c.status === 'PENDING' || c.status === 'PROCESSING')
    .reduce((sum, c) => sum + c.amount, 0);

  const thisMonthEarnings = commissions
    .filter(c => {
      const commissionMonth = new Date(c.date).toISOString().substring(0, 7);
      const currentMonth = new Date().toISOString().substring(0, 7);
      return commissionMonth === currentMonth && c.status === 'PAID';
    })
    .reduce((sum, c) => sum + c.amount, 0);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'PENDING':
        return <Clock className="h-5 w-5 text-yellow-400" />;
      case 'PROCESSING':
        return <Clock className="h-5 w-5 text-blue-400" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      PAID: 'bg-green-900/50 text-green-400 border-green-400',
      PENDING: 'bg-yellow-900/50 text-yellow-400 border-yellow-400',
      PROCESSING: 'bg-blue-900/50 text-blue-400 border-blue-400',
    };

    const labels = {
      PAID: 'Pago',
      PENDING: 'Pendente',
      PROCESSING: 'Processando',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles] || 'bg-gray-900/50 text-gray-400 border-gray-400'}`}>
        {getStatusIcon(status)}
        <span className="ml-1">{labels[status as keyof typeof labels] || status}</span>
      </span>
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
        return <Banknote className="h-4 w-4 text-green-400" />;
      case 'TRADING':
        return <BarChart3 className="h-4 w-4 text-blue-400" />;
      case 'SUBSCRIPTION':
        return <DollarSign className="h-4 w-4 text-purple-400" />;
      default:
        return <DollarSign className="h-4 w-4 text-gray-400" />;
    }
  };

  const exportToCSV = () => {
    track('export_commissions_csv', {
      total_records: filteredCommissions.length,
      filter_applied: filter,
      month_selected: selectedMonth
    });

    const csvContent = [
      ['Data', 'Indicado', 'Email', 'Tipo', 'Valor', 'Status', 'Data Pagamento', 'Taxa'],
      ...filteredCommissions.map(c => [
        c.date,
        c.referralName,
        c.referralEmail,
        c.type,
        c.amount.toFixed(2),
        c.status,
        c.paymentDate || 'N/A',
        `${c.commissionRate}%`
      ])
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `comissoes-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AffiliateLayout>
      <Head>
        <title>Minhas Comissões - Afiliados CoinBit Club</title>
        <meta name="description" content="Acompanhe suas comissões de afiliado do CoinBit Club" />
      </Head>

      <div className="min-h-screen bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-amber-400 glow-gold mb-2">
              💰 Minhas Comissões
            </h1>
            <p className="text-gray-400">
              Acompanhe todas as suas comissões de afiliado
            </p>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-black border border-green-500 rounded-lg p-6 shadow-lg hover:shadow-green-400/20 transition-all duration-300">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-green-400">Total Recebido</p>
                  <p className="text-2xl font-bold text-white">
                    ${totalEarned.toFixed(2)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-black border border-yellow-500 rounded-lg p-6 shadow-lg hover:shadow-yellow-400/20 transition-all duration-300">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-8 w-8 text-yellow-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-yellow-400">Pendente</p>
                  <p className="text-2xl font-bold text-white">
                    ${pendingAmount.toFixed(2)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-black border border-blue-500 rounded-lg p-6 shadow-lg hover:shadow-blue-400/20 transition-all duration-300">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-8 w-8 text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-blue-400">Este Mês</p>
                  <p className="text-2xl font-bold text-white">
                    ${thisMonthEarnings.toFixed(2)}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Filtros */}
          <Card className="bg-black border border-amber-500 rounded-lg p-6 mb-8 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div>
                  <label className="block text-sm font-medium text-amber-400 mb-1">
                    Status
                  </label>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="bg-gray-900 border border-gray-600 text-white rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  >
                    <option value="all">Todos</option>
                    <option value="paid">Pagos</option>
                    <option value="pending">Pendentes</option>
                    <option value="processing">Processando</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-amber-400 mb-1">
                    Ordenar por
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-gray-900 border border-gray-600 text-white rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  >
                    <option value="date">Data</option>
                    <option value="amount">Valor</option>
                    <option value="status">Status</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-amber-400 mb-1">
                    Mês
                  </label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="bg-gray-900 border border-gray-600 text-white rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  >
                    <option value="all">Todos os meses</option>
                    <option value="2025-08">Agosto 2025</option>
                    <option value="2025-07">Julho 2025</option>
                    <option value="2025-06">Junho 2025</option>
                  </select>
                </div>
              </div>

              <button
                onClick={exportToCSV}
                className="flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-black font-medium rounded-md transition-colors duration-200"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </button>
            </div>
          </Card>

          {/* Lista de Comissões */}
          <Card className="bg-black border border-amber-500 rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-amber-400">
                Histórico de Comissões ({filteredCommissions.length})
              </h2>
            </div>

            {filteredCommissions.length === 0 ? (
              <div className="p-8 text-center">
                <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 mb-2">Nenhuma comissão encontrada</p>
                <p className="text-sm text-gray-500">
                  Tente ajustar os filtros ou aguarde suas primeiras comissões
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Data
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Indicado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Valor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Taxa
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredCommissions.map((commission) => (
                      <tr key={commission.id} className="hover:bg-gray-900/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                            {new Date(commission.date).toLocaleDateString('pt-BR')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-white">
                              {commission.referralName}
                            </div>
                            <div className="text-sm text-gray-400">
                              {commission.referralEmail}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center">
                            {getTypeIcon(commission.type)}
                            <span className="ml-2 text-gray-300">
                              {commission.type === 'DEPOSIT' ? 'Depósito' :
                               commission.type === 'TRADING' ? 'Trading' :
                               commission.type === 'SUBSCRIPTION' ? 'Assinatura' :
                               commission.type}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-400">
                          ${commission.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(commission.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {commission.commissionRate}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* Informações sobre Pagamentos */}
          <div className="mt-8">
            <Card className="bg-black border border-amber-500 rounded-lg p-6 shadow-lg hover:shadow-amber-400/20 transition-all duration-300">
              <h3 className="text-lg font-semibold text-amber-400 glow-gold mb-4">ℹ️ Informações sobre Pagamentos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-medium text-blue-400 mb-2">Quando recebo?</h4>
                  <p className="text-pink-400 mb-4">As comissões são pagas semanalmente, toda segunda-feira, para valores acima de $10.</p>
                  
                  <h4 className="font-medium text-blue-400 mb-2">Taxas de Comissão:</h4>
                  <ul className="text-pink-400 space-y-1">
                    <li>• Depósitos: 5% do valor</li>
                    <li>• Trading: 3% das taxas</li>
                    <li>• Assinaturas: 10% do valor</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-blue-400 mb-2">Como funciona?</h4>
                  <p className="text-pink-400 mb-4">Você ganha comissões sempre que seus indicados fazem depósitos, trades ou assinam planos premium.</p>
                  
                  <h4 className="font-medium text-blue-400 mb-2">Formas de Pagamento:</h4>
                  <ul className="text-pink-400 space-y-1">
                    <li>• PIX (instantâneo)</li>
                    <li>• Transferência bancária</li>
                    <li>• Carteira digital</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AffiliateLayout>
  );
};

export default CommissionsPage;
