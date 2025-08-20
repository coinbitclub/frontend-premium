import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Card from '../../components/Card';
import { useTracking } from '../../hooks/useTracking';
import AffiliateLayout from '../../components/AffiliateLayout';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react';

// Mock data - seguindo o padrão do projeto
const referralsData = [
  {
    id: 1,
    username: 'João Silva',
    email: 'joao.silva@email.com',
    avatar: 'JS',
    joinDate: '2025-08-15',
    status: 'ACTIVE',
    totalDeposits: 2500.00,
    totalTrades: 45,
    commissionGenerated: 125.00,
    lastActivity: '2025-08-16',
    plan: 'Premium',
    country: 'Brasil',
    referralSource: 'WhatsApp'
  },
  {
    id: 2,
    username: 'Maria Santos',
    email: 'maria.santos@email.com',
    avatar: 'MS',
    joinDate: '2025-08-14',
    status: 'ACTIVE',
    totalDeposits: 1800.00,
    totalTrades: 32,
    commissionGenerated: 90.00,
    lastActivity: '2025-08-16',
    plan: 'Premium',
    country: 'Brasil',
    referralSource: 'Instagram'
  },
  {
    id: 3,
    username: 'Pedro Costa',
    email: 'pedro.costa@email.com',
    avatar: 'PC',
    joinDate: '2025-08-13',
    status: 'INACTIVE',
    totalDeposits: 500.00,
    totalTrades: 8,
    commissionGenerated: 25.00,
    lastActivity: '2025-08-14',
    plan: 'Basic',
    country: 'Brasil',
    referralSource: 'Facebook'
  },
  {
    id: 4,
    username: 'Ana Oliveira',
    email: 'ana.oliveira@email.com',
    avatar: 'AO',
    joinDate: '2025-08-12',
    status: 'PENDING',
    totalDeposits: 0.00,
    totalTrades: 0,
    commissionGenerated: 0.00,
    lastActivity: '2025-08-12',
    plan: 'Basic',
    country: 'Brasil',
    referralSource: 'WhatsApp'
  },
  {
    id: 5,
    username: 'Carlos Mendes',
    email: 'carlos.mendes@email.com',
    avatar: 'CM',
    joinDate: '2025-08-11',
    status: 'ACTIVE',
    totalDeposits: 3200.00,
    totalTrades: 67,
    commissionGenerated: 160.00,
    lastActivity: '2025-08-16',
    plan: 'Premium',
    country: 'Brasil',
    referralSource: 'Telegram'
  }
];

const ReferralsPage: React.FC = () => {
  const [referrals, setReferrals] = useState(referralsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [planFilter, setPlanFilter] = useState('ALL');
  const { track } = useTracking();

  // Analytics tracking
  useEffect(() => {
    track('page_view', {
      page_name: 'affiliate_referrals',
      user_role: 'affiliate',
      timestamp: new Date().toISOString()
    });
  }, [track]);

  // Filtros
  const filteredReferrals = referrals.filter(referral => {
    const matchesSearch = referral.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         referral.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || referral.status === statusFilter;
    const matchesPlan = planFilter === 'ALL' || referral.plan === planFilter;
    
    return matchesSearch && matchesStatus && matchesPlan;
  });

  // Estatísticas
  const totalReferrals = referrals.length;
  const activeReferrals = referrals.filter(r => r.status === 'ACTIVE').length;
  const totalCommissions = referrals.reduce((sum, r) => sum + r.commissionGenerated, 0);
  const totalDeposits = referrals.reduce((sum, r) => sum + r.totalDeposits, 0);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'INACTIVE':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'PENDING':
        return <Clock className="h-4 w-4 text-blue-400" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      ACTIVE: 'bg-green-900/50 text-green-400 border-green-400',
      INACTIVE: 'bg-yellow-900/50 text-yellow-400 border-yellow-400',
      PENDING: 'bg-blue-900/50 text-blue-400 border-blue-400',
    };

    const labels = {
      ACTIVE: 'Ativo',
      INACTIVE: 'Inativo',
      PENDING: 'Pendente',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles] || 'bg-gray-900/50 text-gray-400 border-gray-400'}`}>
        {getStatusIcon(status)}
        <span className="ml-1">{labels[status as keyof typeof labels] || status}</span>
      </span>
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleInviteMore = () => {
    track('invite_more_click', {
      source: 'referrals_page',
      user_role: 'affiliate'
    });
  };

  return (
    <AffiliateLayout>
      <Head>
        <title>Meus Indicados - Afiliados CoinBit Club</title>
        <meta name="description" content="Gerencie seus indicados e acompanhe o desempenho de sua rede de afiliados" />
      </Head>

      <div className="min-h-screen bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-amber-400 glow-gold mb-2">
                👥 Meus Indicados
              </h1>
              <p className="text-gray-400">
                Acompanhe o desempenho da sua rede de afiliados
              </p>
            </div>
            <button
              onClick={handleInviteMore}
              className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-amber-600 hover:bg-amber-700 text-black font-medium rounded-md transition-colors duration-200"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Convidar Mais
            </button>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-black border border-amber-500 rounded-lg p-6 shadow-lg hover:shadow-amber-400/20 transition-all duration-300">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-amber-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-amber-400">Total</p>
                  <p className="text-2xl font-bold text-white">{totalReferrals}</p>
                </div>
              </div>
            </Card>

            <Card className="bg-black border border-green-500 rounded-lg p-6 shadow-lg hover:shadow-green-400/20 transition-all duration-300">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-green-400">Ativos</p>
                  <p className="text-2xl font-bold text-white">{activeReferrals}</p>
                </div>
              </div>
            </Card>

            <Card className="bg-black border border-blue-500 rounded-lg p-6 shadow-lg hover:shadow-blue-400/20 transition-all duration-300">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BarChart3 className="h-8 w-8 text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-blue-400">Depósitos</p>
                  <p className="text-2xl font-bold text-white">
                    {formatCurrency(totalDeposits)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-black border border-purple-500 rounded-lg p-6 shadow-lg hover:shadow-purple-400/20 transition-all duration-300">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BarChart3 className="h-8 w-8 text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-purple-400">Comissões</p>
                  <p className="text-2xl font-bold text-white">
                    {formatCurrency(totalCommissions)}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Filtros */}
          <Card className="bg-black border border-amber-500 rounded-lg p-6 mb-8 shadow-lg">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por nome ou email..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  />
                </div>

                {/* Status Filter */}
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-amber-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-gray-900 border border-gray-600 text-white rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  >
                    <option value="ALL">Todos os Status</option>
                    <option value="ACTIVE">Ativos</option>
                    <option value="INACTIVE">Inativos</option>
                    <option value="PENDING">Pendentes</option>
                  </select>
                </div>

                {/* Plan Filter */}
                <div>
                  <select
                    value={planFilter}
                    onChange={(e) => setPlanFilter(e.target.value)}
                    className="bg-gray-900 border border-gray-600 text-white rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  >
                    <option value="ALL">Todos os Planos</option>
                    <option value="Premium">Premium</option>
                    <option value="Basic">Basic</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>

          {/* Lista de Indicados */}
          <Card className="bg-black border border-amber-500 rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-amber-400">
                  Lista de Indicados ({filteredReferrals.length})
                </h2>
              </div>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-full">
                <table className="w-full">
                  <thead className="bg-gray-900">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Usuário
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Plano
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Depósitos
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Trades
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Comissões
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Cadastro
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Origem
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredReferrals.map((referral) => (
                      <tr key={referral.id} className="hover:bg-gray-900/50 transition-colors">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 flex items-center justify-center text-black font-semibold text-sm">
                                {referral.avatar}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white">
                                {referral.username}
                              </div>
                              <div className="text-sm text-gray-400">
                                {referral.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {getStatusBadge(referral.status)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            referral.plan === 'Premium' 
                              ? 'bg-purple-900/50 text-purple-400 border border-purple-400' 
                              : 'bg-blue-900/50 text-blue-400 border border-blue-400'
                          }`}>
                            {referral.plan}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-400">
                          {formatCurrency(referral.totalDeposits)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-pink-400">
                          {referral.totalTrades}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-amber-400 glow-gold-sm">
                          {formatCurrency(referral.commissionGenerated)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-400">
                          {formatDate(referral.joinDate)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-pink-400">
                          {referral.referralSource}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredReferrals.length === 0 && (
                <div className="text-center py-12">
                  <AlertTriangle className="mx-auto h-12 w-12 text-amber-400 glow-gold" />
                  <h3 className="mt-2 text-sm font-medium text-amber-400">Nenhum indicado encontrado</h3>
                  <p className="mt-1 text-sm text-blue-400">
                    {searchTerm || statusFilter !== 'ALL' 
                      ? 'Tente ajustar os filtros de busca.' 
                      : 'Comece convidando seus primeiros indicados!'}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </AffiliateLayout>
  );
};

export default ReferralsPage;
