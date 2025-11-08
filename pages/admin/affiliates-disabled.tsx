import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import { 
  FiUserPlus, 
  FiPlus, 
  FiEdit3, 
  FiTrash2, 
  FiSearch, 
  FiFilter,
  FiDownload,
  FiMail,
  FiLock,
  FiUnlock,
  FiStar,
  FiDollarSign,
  FiActivity,
  FiCalendar,
  FiRefreshCw,
  FiEye,
  FiShield,
  FiUserCheck,
  FiUserX,
  FiKey,
  FiTrendingUp,
  FiAward,
  FiTarget,
  FiX,
  FiPercent,
  FiUsers,
  FiCreditCard,
  FiSettings
} from 'react-icons/fi';
import { useLanguage } from '../../hooks/useLanguage';
import AdminLayout from '../../components/AdminLayout';

interface Affiliate {
  id: string;
  email: string;
  name: string;
  status: 'active' | 'inactive' | 'suspended';
  plan: 'basic' | 'premium' | 'vip';
  isVipAffiliate: boolean;
  affiliateCode: string;
  totalCommissions: number;
  monthlyCommissions: number;
  referredUsers: number;
  activeReferrals: number;
  conversionRate: number;
  lastActivity: string;
  joinedDate: string;
  commissionRate: number;
  paymentMethod: string;
  country: string;
  phone?: string;
  bankInfo?: {
    bank: string;
    account: string;
    agency: string;
  };
  pixKey?: string;
}

interface AffiliateStats {
  totalAffiliates: number;
  activeAffiliates: number;
  vipAffiliates: number;
  totalCommissions: number;
  monthlyCommissions: number;
  totalReferrals: number;
  avgConversionRate: number;
  pendingPayments: number;
}

const AdminAffiliates: NextPage = () => {
  const [mounted, setMounted] = useState(false);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all');
  const [planFilter, setPlanFilter] = useState<'all' | 'basic' | 'premium' | 'vip'>('all');
  const [vipFilter, setVipFilter] = useState<'all' | 'vip' | 'normal'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState<string | null>(null);
  const [showVipModal, setShowVipModal] = useState<string | null>(null);
  const [showViewModal, setShowViewModal] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState<string | null>(null);
  const { language } = useLanguage();

  // Mock data - em produção viria da API
  const mockAffiliates: Affiliate[] = [
    {
      id: '1',
      email: 'joao.afiliado@example.com',
      name: 'João Silva',
      status: 'active',
      plan: 'vip',
      isVipAffiliate: true,
      affiliateCode: 'JOAO2024',
      totalCommissions: 8500.50,
      monthlyCommissions: 1200.00,
      referredUsers: 45,
      activeReferrals: 38,
      conversionRate: 84.4,
      lastActivity: '2024-03-15T10:30:00Z',
      joinedDate: '2024-01-15T00:00:00Z',
      commissionRate: 2.5,
      paymentMethod: 'pix',
      country: 'Brazil',
      phone: '+55 11 99999-9999',
      pixKey: 'joao@example.com'
    },
    {
      id: '2',
      email: 'maria.trader@example.com',
      name: 'Maria Santos',
      status: 'active',
      plan: 'premium',
      isVipAffiliate: false,
      affiliateCode: 'MARIA2024',
      totalCommissions: 3200.75,
      monthlyCommissions: 800.25,
      referredUsers: 28,
      activeReferrals: 24,
      conversionRate: 85.7,
      lastActivity: '2024-03-15T08:15:00Z',
      joinedDate: '2024-02-01T00:00:00Z',
      commissionRate: 2.0,
      paymentMethod: 'bank',
      country: 'Brazil',
      phone: '+55 21 88888-8888',
      bankInfo: {
        bank: 'Banco do Brasil',
        account: '12345-6',
        agency: '1234-5'
      }
    },
    {
      id: '3',
      email: 'carlos.invest@example.com',
      name: 'Carlos Oliveira',
      status: 'inactive',
      plan: 'basic',
      isVipAffiliate: false,
      affiliateCode: 'CARLOS2024',
      totalCommissions: 450.00,
      monthlyCommissions: 0.00,
      referredUsers: 5,
      activeReferrals: 2,
      conversionRate: 40.0,
      lastActivity: '2024-02-28T14:20:00Z',
      joinedDate: '2024-02-20T00:00:00Z',
      commissionRate: 1.5,
      paymentMethod: 'pix',
      country: 'Brazil',
      pixKey: 'carlos123@example.com'
    }
  ];

  const mockStats: AffiliateStats = {
    totalAffiliates: 234,
    activeAffiliates: 189,
    vipAffiliates: 12,
    totalCommissions: 125400.50,
    monthlyCommissions: 18500.00,
    totalReferrals: 1247,
    avgConversionRate: 78.5,
    pendingPayments: 45
  };

  useEffect(() => {
    setMounted(true);
    loadAffiliatesData();
  }, []);

  const loadAffiliatesData = async () => {
    try {
      // Simular chamada à API
      setTimeout(() => {
        setAffiliates(mockAffiliates);
        setStats(mockStats);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading affiliates:', error);
      setLoading(false);
    }
  };

  const filteredAffiliates = affiliates.filter(affiliate => {
    const matchesSearch = affiliate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         affiliate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         affiliate.affiliateCode.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || affiliate.status === statusFilter;
    const matchesPlan = planFilter === 'all' || affiliate.plan === planFilter;
    const matchesVip = vipFilter === 'all' || 
                      (vipFilter === 'vip' && affiliate.isVipAffiliate) ||
                      (vipFilter === 'normal' && !affiliate.isVipAffiliate);

    return matchesSearch && matchesStatus && matchesPlan && matchesVip;
  });

  const handleStatusChange = async (affiliateId: string, newStatus: 'active' | 'inactive' | 'suspended') => {
    try {
      // Simular API call
      setAffiliates(prev => prev.map(affiliate =>
        affiliate.id === affiliateId ? { ...affiliate, status: newStatus } : affiliate
      ));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleExportData = () => {
    try {
      // Criar dados para exportação
      const exportData = filteredAffiliates.map(affiliate => ({
        Nome: affiliate.name,
        Email: affiliate.email,
        Status: affiliate.status,
        Plano: affiliate.plan,
        'Tipo VIP': affiliate.isVipAffiliate ? 'VIP' : 'Normal',
        'Código Afiliado': affiliate.affiliateCode,
        'Comissões Total': affiliate.totalCommissions,
        'Comissões Mensais': affiliate.monthlyCommissions,
        'Usuários Indicados': affiliate.referredUsers,
        'Indicações Ativas': affiliate.activeReferrals,
        'Taxa Conversão': `${affiliate.conversionRate}%`,
        'Taxa Comissão': `${affiliate.commissionRate}%`,
        'Última Atividade': formatDate(affiliate.lastActivity),
        'Data Cadastro': formatDate(affiliate.joinedDate),
        País: affiliate.country,
        Telefone: affiliate.phone || '',
        'Método Pagamento': affiliate.paymentMethod === 'pix' ? 'PIX' : 'Banco'
      }));

      // Converter para CSV
      const headers = Object.keys(exportData[0]);
      const csvContent = [
        headers.join(','),
        ...exportData.map(row => headers.map(header => `"${row[header]}"`).join(','))
      ].join('\n');

      // Download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `afiliados_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('Dados exportados com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
    }
  };

  const handlePromoteToVip = async (affiliateId: string) => {
    try {
      // Simular API call
      setAffiliates(prev => prev.map(affiliate =>
        affiliate.id === affiliateId ? { 
          ...affiliate, 
          isVipAffiliate: true, 
          commissionRate: 2.5,
          plan: 'vip'
        } : affiliate
      ));
      
      // Atualizar estatísticas
      setStats(prev => prev ? {
        ...prev,
        vipAffiliates: prev.vipAffiliates + 1
      } : prev);
      
      // Feedback visual (você pode adicionar um toast aqui)
      console.log(`Afiliado ${affiliateId} promovido para VIP com sucesso!`);
      
    } catch (error) {
      console.error('Error promoting to VIP:', error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'inactive': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'suspended': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'vip': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'premium': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'basic': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (!mounted) return null;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center min-h-96">
          <div className="text-center">
            <FiRefreshCw className="w-8 h-8 text-red-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Carregando afiliados...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Gestão de Afiliados - Admin CoinBitClub</title>
        <meta name="description" content="Gerencie afiliados, comissões e permissões VIP" />
      </Head>

      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                {language === 'pt' ? '🤝 Gestão de Afiliados' : '🤝 Affiliate Management'}
              </h1>
              <p className="text-gray-400 mt-1">
                {language === 'pt' ? 'Gerenciar afiliados, comissões e permissões VIP' : 'Manage affiliates, commissions and VIP permissions'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-lg"
              >
                <FiPlus className="w-4 h-4" />
                {language === 'pt' ? 'Novo Afiliado' : 'New Affiliate'}
              </button>
              <button 
                onClick={handleExportData}
                className="flex items-center gap-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 px-4 py-2 rounded-lg transition-all"
              >
                <FiDownload className="w-4 h-4" />
                {language === 'pt' ? 'Exportar' : 'Export'}
              </button>
            </div>
          </motion.div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="col-span-1 md:col-span-1 lg:col-span-2 bg-gradient-to-br from-red-900/50 to-pink-900/50 backdrop-blur-md rounded-xl p-6 border border-red-500/20"
              >
                <div className="flex items-center gap-3 mb-4">
                  <FiUsers className="text-blue-400 text-xl" />
                  <h3 className="text-white font-semibold">Total</h3>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stats.totalAffiliates}</div>
                <div className="text-sm text-gray-400">Afiliados registrados</div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="col-span-1 md:col-span-1 lg:col-span-2 bg-gradient-to-br from-red-900/50 to-pink-900/50 backdrop-blur-md rounded-xl p-6 border border-red-500/20"
              >
                <div className="flex items-center gap-3 mb-4">
                  <FiActivity className="text-green-400 text-xl" />
                  <h3 className="text-white font-semibold">Ativos</h3>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stats.activeAffiliates}</div>
                <div className="text-sm text-gray-400">Gerando comissões</div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="col-span-1 md:col-span-1 lg:col-span-2 bg-gradient-to-br from-red-900/50 to-pink-900/50 backdrop-blur-md rounded-xl p-6 border border-red-500/20"
              >
                <div className="flex items-center gap-3 mb-4">
                  <FiAward className="text-yellow-400 text-xl" />
                  <h3 className="text-white font-semibold">VIP</h3>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stats.vipAffiliates}</div>
                <div className="text-sm text-gray-400">Afiliados VIP</div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="col-span-1 md:col-span-1 lg:col-span-2 bg-gradient-to-br from-red-900/50 to-pink-900/50 backdrop-blur-md rounded-xl p-6 border border-red-500/20"
              >
                <div className="flex items-center gap-3 mb-4">
                  <FiTrendingUp className="text-emerald-400 text-xl" />
                  <h3 className="text-white font-semibold">Indicações</h3>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stats.totalReferrals}</div>
                <div className="text-sm text-gray-400">Total de referências</div>
              </motion.div>
            </div>
          )}

          {/* Filters */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-red-900/50 to-pink-900/50 backdrop-blur-md rounded-xl p-6 border border-red-500/20"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder={language === 'pt' ? 'Buscar por nome, email ou código...' : 'Search by name, email or code...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="bg-gray-800/50 border border-gray-600/50 rounded-lg text-white px-3 py-2 focus:outline-none focus:border-red-500/50"
                >
                  <option value="all">Todos Status</option>
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                  <option value="suspended">Suspenso</option>
                </select>
                <select
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value as any)}
                  className="bg-gray-800/50 border border-gray-600/50 rounded-lg text-white px-3 py-2 focus:outline-none focus:border-red-500/50"
                >
                  <option value="all">Todos Planos</option>
                  <option value="basic">Básico</option>
                  <option value="premium">Premium</option>
                  <option value="vip">VIP</option>
                </select>
                <select
                  value={vipFilter}
                  onChange={(e) => setVipFilter(e.target.value as any)}
                  className="bg-gray-800/50 border border-gray-600/50 rounded-lg text-white px-3 py-2 focus:outline-none focus:border-red-500/50"
                >
                  <option value="all">Todos Tipos</option>
                  <option value="vip">Apenas VIP</option>
                  <option value="normal">Apenas Normal</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Affiliates Table */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-red-900/50 to-pink-900/50 backdrop-blur-md rounded-xl border border-red-500/20 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-red-900/30 border-b border-red-500/20">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Afiliado
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Comissões
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Indicações
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Performance
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-red-500/10">
                  {filteredAffiliates.map((affiliate, index) => (
                    <motion.tr
                      key={affiliate.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-red-900/20 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {affiliate.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-white font-medium">{affiliate.name}</span>
                              {affiliate.isVipAffiliate && (
                                <FiStar className="w-4 h-4 text-yellow-400" />
                              )}
                            </div>
                            <div className="text-sm text-gray-400">{affiliate.email}</div>
                            <div className="text-xs text-gray-500">#{affiliate.affiliateCode}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(affiliate.status)}`}>
                            {affiliate.status === 'active' ? 'Ativo' : affiliate.status === 'inactive' ? 'Inativo' : 'Suspenso'}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPlanColor(affiliate.plan)}`}>
                            {affiliate.plan.toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="text-white font-medium">{formatCurrency(affiliate.totalCommissions)}</div>
                          <div className="text-gray-400">Total</div>
                          <div className="text-green-400">{formatCurrency(affiliate.monthlyCommissions)}</div>
                          <div className="text-gray-400">Este mês</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="text-white font-medium">{affiliate.referredUsers}</div>
                          <div className="text-gray-400">Total</div>
                          <div className="text-blue-400">{affiliate.activeReferrals}</div>
                          <div className="text-gray-400">Ativos</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="text-white font-medium">{affiliate.conversionRate.toFixed(1)}%</div>
                          <div className="text-gray-400">Conversão</div>
                          <div className="text-purple-400">{affiliate.commissionRate}%</div>
                          <div className="text-gray-400">Taxa</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setShowViewModal(affiliate.id)}
                            className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all"
                            title="Visualizar Detalhes"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setShowEditModal(affiliate.id)}
                            className="p-2 text-green-400 hover:bg-green-500/20 rounded-lg transition-all"
                            title="Editar Afiliado"
                          >
                            <FiEdit3 className="w-4 h-4" />
                          </button>
                          {!affiliate.isVipAffiliate && (
                            <button 
                              onClick={() => setShowVipModal(affiliate.id)}
                              className="p-2 text-yellow-400 hover:bg-yellow-500/20 rounded-lg transition-all"
                              title="Promover para VIP"
                            >
                              <FiAward className="w-4 h-4" />
                            </button>
                          )}
                          <button 
                            onClick={() => setShowPaymentModal(affiliate.id)}
                            className="p-2 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-all"
                            title="Processar Pagamento"
                          >
                            <FiDollarSign className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* VIP Promotion Modal */}
          <AnimatePresence>
            {showVipModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => setShowVipModal(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-gradient-to-br from-red-900/90 to-pink-900/90 backdrop-blur-md rounded-xl p-6 border border-red-500/30 max-w-md w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <FiAward className="text-yellow-400 text-2xl" />
                    <h3 className="text-xl font-bold text-white">Promover para VIP</h3>
                  </div>
                  
                  {(() => {
                    const affiliate = affiliates.find(a => a.id === showVipModal);
                    if (!affiliate) return null;
                    
                    return (
                      <div className="space-y-4">
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <FiStar className="text-yellow-400" />
                            <span className="text-yellow-400 font-medium">Benefícios VIP</span>
                          </div>
                          <ul className="text-sm text-gray-300 space-y-1">
                            <li>• Taxa de comissão aumentada para 2.5%</li>
                            <li>• Acesso a ferramentas exclusivas</li>
                            <li>• Suporte prioritário</li>
                            <li>• Badge VIP no perfil</li>
                          </ul>
                        </div>
                        
                        <div className="bg-gray-800/50 rounded-lg p-4">
                          <h4 className="text-white font-medium mb-2">Afiliado Selecionado:</h4>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-sm">
                                {affiliate.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <div className="text-white font-medium">{affiliate.name}</div>
                              <div className="text-sm text-gray-400">{affiliate.email}</div>
                              <div className="text-xs text-gray-500">
                                Taxa atual: {affiliate.commissionRate}% → Nova taxa: 2.5%
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-3">
                          <button
                            onClick={() => setShowVipModal(null)}
                            className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={() => {
                              handlePromoteToVip(showVipModal);
                              setShowVipModal(null);
                            }}
                            className="flex-1 py-2 px-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-lg transition-all font-medium"
                          >
                            Promover para VIP
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Payment Modal */}
          <AnimatePresence>
            {showPaymentModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => setShowPaymentModal(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-gradient-to-br from-red-900/90 to-pink-900/90 backdrop-blur-md rounded-xl p-6 border border-red-500/30 max-w-md w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <FiDollarSign className="text-green-400 text-2xl" />
                    <h3 className="text-xl font-bold text-white">Processar Pagamento</h3>
                  </div>
                  
                  {(() => {
                    const affiliate = affiliates.find(a => a.id === showPaymentModal);
                    if (!affiliate) return null;
                    
                    return (
                      <div className="space-y-4">
                        <div className="bg-gray-800/50 rounded-lg p-4">
                          <h4 className="text-white font-medium mb-2">Afiliado:</h4>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-sm">
                                {affiliate.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <div className="text-white font-medium">{affiliate.name}</div>
                              <div className="text-sm text-gray-400">{affiliate.email}</div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-400">Comissões Pendentes:</span>
                              <div className="text-green-400 font-medium">{formatCurrency(affiliate.monthlyCommissions)}</div>
                            </div>
                            <div>
                              <span className="text-gray-400">Método de Pagamento:</span>
                              <div className="text-white">{affiliate.paymentMethod === 'pix' ? 'PIX' : 'Banco'}</div>
                            </div>
                          </div>
                          
                          {affiliate.paymentMethod === 'pix' && affiliate.pixKey && (
                            <div className="mt-3 text-sm">
                              <span className="text-gray-400">Chave PIX:</span>
                              <div className="text-white font-mono">{affiliate.pixKey}</div>
                            </div>
                          )}
                          
                          {affiliate.paymentMethod === 'bank' && affiliate.bankInfo && (
                            <div className="mt-3 text-sm space-y-1">
                              <div><span className="text-gray-400">Banco:</span> <span className="text-white">{affiliate.bankInfo.bank}</span></div>
                              <div><span className="text-gray-400">Agência:</span> <span className="text-white">{affiliate.bankInfo.agency}</span></div>
                              <div><span className="text-gray-400">Conta:</span> <span className="text-white">{affiliate.bankInfo.account}</span></div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-3">
                          <button
                            onClick={() => setShowPaymentModal(null)}
                            className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={() => {
                              // Aqui seria a lógica de processamento do pagamento
                              console.log('Processing payment for affiliate:', showPaymentModal);
                              setShowPaymentModal(null);
                            }}
                            className="flex-1 py-2 px-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg transition-all font-medium"
                          >
                            Processar Pagamento
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* View Affiliate Modal */}
          <AnimatePresence>
            {showViewModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => setShowViewModal(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-gradient-to-br from-red-900/90 to-pink-900/90 backdrop-blur-md rounded-xl p-6 border border-red-500/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  {(() => {
                    const affiliate = affiliates.find(a => a.id === showViewModal);
                    if (!affiliate) return null;
                    
                    return (
                      <div>
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <FiEye className="text-blue-400 text-2xl" />
                            <h3 className="text-xl font-bold text-white">Detalhes do Afiliado</h3>
                            {affiliate.isVipAffiliate && (
                              <FiStar className="w-5 h-5 text-yellow-400" />
                            )}
                          </div>
                          <button
                            onClick={() => setShowViewModal(null)}
                            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all"
                          >
                            <FiX className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="space-y-6">
                          {/* Informações Pessoais */}
                          <div className="bg-gray-800/30 rounded-lg p-4">
                            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                              <FiUserCheck className="text-blue-400" />
                              Informações Pessoais
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-400">Nome:</span>
                                <div className="text-white font-medium">{affiliate.name}</div>
                              </div>
                              <div>
                                <span className="text-gray-400">Email:</span>
                                <div className="text-white font-medium">{affiliate.email}</div>
                              </div>
                              <div>
                                <span className="text-gray-400">Telefone:</span>
                                <div className="text-white font-medium">{affiliate.phone || 'Não informado'}</div>
                              </div>
                              <div>
                                <span className="text-gray-400">País:</span>
                                <div className="text-white font-medium">{affiliate.country}</div>
                              </div>
                            </div>
                          </div>

                          {/* Status e Plano */}
                          <div className="bg-gray-800/30 rounded-lg p-4">
                            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                              <FiSettings className="text-green-400" />
                              Status e Configurações
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-400">Status:</span>
                                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border mt-1 ${getStatusColor(affiliate.status)}`}>
                                  {affiliate.status === 'active' ? 'Ativo' : affiliate.status === 'inactive' ? 'Inativo' : 'Suspenso'}
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-400">Plano:</span>
                                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border mt-1 ${getPlanColor(affiliate.plan)}`}>
                                  {affiliate.plan.toUpperCase()}
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-400">Código Afiliado:</span>
                                <div className="text-white font-medium font-mono">{affiliate.affiliateCode}</div>
                              </div>
                              <div>
                                <span className="text-gray-400">Taxa de Comissão:</span>
                                <div className="text-purple-400 font-medium">{affiliate.commissionRate}%</div>
                              </div>
                            </div>
                          </div>

                          {/* Performance */}
                          <div className="bg-gray-800/30 rounded-lg p-4">
                            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                              <FiTrendingUp className="text-emerald-400" />
                              Performance
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-400">Comissões Total:</span>
                                <div className="text-green-400 font-medium">{formatCurrency(affiliate.totalCommissions)}</div>
                              </div>
                              <div>
                                <span className="text-gray-400">Este Mês:</span>
                                <div className="text-green-400 font-medium">{formatCurrency(affiliate.monthlyCommissions)}</div>
                              </div>
                              <div>
                                <span className="text-gray-400">Indicações Total:</span>
                                <div className="text-blue-400 font-medium">{affiliate.referredUsers}</div>
                              </div>
                              <div>
                                <span className="text-gray-400">Indicações Ativas:</span>
                                <div className="text-blue-400 font-medium">{affiliate.activeReferrals}</div>
                              </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-700/50">
                              <span className="text-gray-400">Taxa de Conversão:</span>
                              <div className="text-purple-400 font-medium">{affiliate.conversionRate.toFixed(1)}%</div>
                            </div>
                          </div>

                          {/* Pagamento */}
                          <div className="bg-gray-800/30 rounded-lg p-4">
                            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                              <FiCreditCard className="text-yellow-400" />
                              Informações de Pagamento
                            </h4>
                            <div className="text-sm space-y-2">
                              <div>
                                <span className="text-gray-400">Método:</span>
                                <span className="text-white font-medium ml-2">
                                  {affiliate.paymentMethod === 'pix' ? 'PIX' : 'Transferência Bancária'}
                                </span>
                              </div>
                              {affiliate.paymentMethod === 'pix' && affiliate.pixKey && (
                                <div>
                                  <span className="text-gray-400">Chave PIX:</span>
                                  <div className="text-white font-mono bg-gray-900/50 p-2 rounded mt-1">{affiliate.pixKey}</div>
                                </div>
                              )}
                              {affiliate.paymentMethod === 'bank' && affiliate.bankInfo && (
                                <div className="space-y-1">
                                  <div><span className="text-gray-400">Banco:</span> <span className="text-white">{affiliate.bankInfo.bank}</span></div>
                                  <div><span className="text-gray-400">Agência:</span> <span className="text-white">{affiliate.bankInfo.agency}</span></div>
                                  <div><span className="text-gray-400">Conta:</span> <span className="text-white">{affiliate.bankInfo.account}</span></div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Datas */}
                          <div className="bg-gray-800/30 rounded-lg p-4">
                            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                              <FiCalendar className="text-blue-400" />
                              Histórico
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-400">Data de Cadastro:</span>
                                <div className="text-white font-medium">{formatDate(affiliate.joinedDate)}</div>
                              </div>
                              <div>
                                <span className="text-gray-400">Última Atividade:</span>
                                <div className="text-white font-medium">{formatDate(affiliate.lastActivity)}</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                          <button
                            onClick={() => {
                              setShowViewModal(null);
                              setShowEditModal(affiliate.id);
                            }}
                            className="flex-1 py-2 px-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg transition-all font-medium"
                          >
                            Editar Afiliado
                          </button>
                          <button
                            onClick={() => setShowViewModal(null)}
                            className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
                          >
                            Fechar
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Edit Affiliate Modal */}
          <AnimatePresence>
            {showEditModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => setShowEditModal(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-gradient-to-br from-red-900/90 to-pink-900/90 backdrop-blur-md rounded-xl p-6 border border-red-500/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  {(() => {
                    const affiliate = affiliates.find(a => a.id === showEditModal);
                    if (!affiliate) return null;
                    
                    return (
                      <div>
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <FiEdit3 className="text-green-400 text-2xl" />
                            <h3 className="text-xl font-bold text-white">Editar Afiliado</h3>
                          </div>
                          <button
                            onClick={() => setShowEditModal(null)}
                            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all"
                          >
                            <FiX className="w-5 h-5" />
                          </button>
                        </div>
                        
                        <form className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Nome Completo
                              </label>
                              <input
                                type="text"
                                defaultValue={affiliate.name}
                                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Email
                              </label>
                              <input
                                type="email"
                                defaultValue={affiliate.email}
                                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50"
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Status
                              </label>
                              <select 
                                defaultValue={affiliate.status}
                                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:border-red-500/50"
                              >
                                <option value="active">Ativo</option>
                                <option value="inactive">Inativo</option>
                                <option value="suspended">Suspenso</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Plano
                              </label>
                              <select 
                                defaultValue={affiliate.plan}
                                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:border-red-500/50"
                              >
                                <option value="basic">Básico</option>
                                <option value="premium">Premium</option>
                                <option value="vip">VIP</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Taxa Comissão (%)
                              </label>
                              <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="10"
                                defaultValue={affiliate.commissionRate}
                                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50"
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Telefone
                              </label>
                              <input
                                type="tel"
                                defaultValue={affiliate.phone}
                                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                País
                              </label>
                              <input
                                type="text"
                                defaultValue={affiliate.country}
                                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Código de Afiliado
                            </label>
                            <input
                              type="text"
                              defaultValue={affiliate.affiliateCode}
                              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50"
                            />
                          </div>
                          
                          <div className="flex items-center gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                            <FiSettings className="text-yellow-400 flex-shrink-0" />
                            <div className="text-sm text-yellow-300">
                              <strong>Atenção:</strong> Alterações em dados críticos como email e código de afiliado podem afetar integrações existentes.
                            </div>
                          </div>
                          
                          <div className="flex gap-3 pt-4">
                            <button
                              type="button"
                              onClick={() => setShowEditModal(null)}
                              className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
                            >
                              Cancelar
                            </button>
                            <button
                              type="submit"
                              onClick={(e) => {
                                e.preventDefault();
                                // Aqui seria a lógica de atualização do afiliado
                                console.log('Updating affiliate:', showEditModal);
                                setShowEditModal(null);
                              }}
                              className="flex-1 py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg transition-all font-medium"
                            >
                              Salvar Alterações
                            </button>
                          </div>
                        </form>
                      </div>
                    );
                  })()}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Create Affiliate Modal */}
          <AnimatePresence>
            {showCreateModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => setShowCreateModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-gradient-to-br from-red-900/90 to-pink-900/90 backdrop-blur-md rounded-xl p-6 border border-red-500/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <FiUserPlus className="text-red-400 text-2xl" />
                      <h3 className="text-xl font-bold text-white">Novo Afiliado</h3>
                    </div>
                    <button
                      onClick={() => setShowCreateModal(false)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Nome Completo
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50"
                          placeholder="Digite o nome completo"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50"
                          placeholder="email@exemplo.com"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Telefone
                        </label>
                        <input
                          type="tel"
                          className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50"
                          placeholder="+55 11 99999-9999"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          País
                        </label>
                        <select className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:border-red-500/50">
                          <option value="Brazil">Brasil</option>
                          <option value="US">Estados Unidos</option>
                          <option value="UK">Reino Unido</option>
                          <option value="Other">Outro</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Plano Inicial
                        </label>
                        <select className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:border-red-500/50">
                          <option value="basic">Básico (1.5%)</option>
                          <option value="premium">Premium (2.0%)</option>
                          <option value="vip">VIP (2.5%)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Método de Pagamento
                        </label>
                        <select className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:border-red-500/50">
                          <option value="pix">PIX</option>
                          <option value="bank">Transferência Bancária</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Código de Afiliado (Opcional)
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50"
                        placeholder="Deixe vazio para gerar automaticamente"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Chave PIX ou Informações Bancárias
                      </label>
                      <textarea
                        rows={3}
                        className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50"
                        placeholder="Para PIX: email, telefone ou CPF
Para banco: banco, agência, conta"
                      />
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <FiSettings className="text-blue-400 flex-shrink-0" />
                      <div className="text-sm text-blue-300">
                        <strong>Configurações Padrão:</strong> O afiliado receberá um email de boas-vindas com instruções de acesso e seu código de afiliado único.
                      </div>
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowCreateModal(false)}
                        className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        onClick={(e) => {
                          e.preventDefault();
                          // Aqui seria a lógica de criação do afiliado
                          console.log('Creating new affiliate...');
                          setShowCreateModal(false);
                        }}
                        className="flex-1 py-3 px-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-lg transition-all font-medium"
                      >
                        Criar Afiliado
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminAffiliates;