'use client';

import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { motion, AnimatePresence } from 'framer-motion';

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
import { useLanguage } from '../../../../hooks/useLanguage';
import AdminLayout from '../../../components/AdminLayout';

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
  totalOperations: number;
  totalProfit: number;
  joinDate: string;
  lastActivity: string;
  commissionRate: number;
  country: string;
  verified: boolean;
  bankingInfo: {
    hasPixKey: boolean;
    hasBankAccount: boolean;
  };
}

interface AffiliateStats {
  totalAffiliates: number;
  activeAffiliates: number;
  vipAffiliates: number;
  totalCommissionsPaid: number;
  monthlyCommissionsPaid: number;
  totalReferrals: number;
  avgCommissionRate: number;
  totalProfit: number;
}

const AdminAffiliates: NextPage = () => {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all');
  const [filterPlan, setFilterPlan] = useState<'all' | 'basic' | 'premium' | 'vip'>('all');
  const [filterType, setFilterType] = useState<'all' | 'vip' | 'regular'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState<string | null>(null);
  const [showVipModal, setShowVipModal] = useState<string | null>(null);
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
      referredUsers: 47,
      activeReferrals: 32,
      totalOperations: 156,
      totalProfit: 25000.00,
      joinDate: '2024-01-15',
      lastActivity: '2025-08-16T08:30:00Z',
      commissionRate: 2.5,
      country: 'BR',
      verified: true,
      bankingInfo: {
        hasPixKey: true,
        hasBankAccount: true
      }
    },
    {
      id: '2',
      email: 'maria.parceira@example.com',
      name: 'Maria Santos',
      status: 'active',
      plan: 'premium',
      isVipAffiliate: false,
      affiliateCode: 'MARIA2024',
      totalCommissions: 3200.25,
      monthlyCommissions: 450.00,
      referredUsers: 23,
      activeReferrals: 18,
      totalOperations: 89,
      totalProfit: 12500.00,
      joinDate: '2024-03-20',
      lastActivity: '2025-08-15T14:20:00Z',
      commissionRate: 1.5,
      country: 'BR',
      verified: true,
      bankingInfo: {
        hasPixKey: true,
        hasBankAccount: false
      }
    },
    {
      id: '3',
      email: 'carlos.referral@example.com',
      name: 'Carlos Lima',
      status: 'suspended',
      plan: 'basic',
      isVipAffiliate: false,
      affiliateCode: 'CARLOS2024',
      totalCommissions: 450.00,
      monthlyCommissions: 0,
      referredUsers: 8,
      activeReferrals: 3,
      totalOperations: 12,
      totalProfit: 2500.00,
      joinDate: '2024-07-01',
      lastActivity: '2025-08-10T10:15:00Z',
      commissionRate: 1.0,
      country: 'BR',
      verified: false,
      bankingInfo: {
        hasPixKey: false,
        hasBankAccount: false
      }
    },
    {
      id: '4',
      email: 'ana.indicadora@example.com',
      name: 'Ana Costa',
      status: 'inactive',
      plan: 'basic',
      isVipAffiliate: false,
      affiliateCode: 'ANA2024',
      totalCommissions: 120.50,
      monthlyCommissions: 0,
      referredUsers: 5,
      activeReferrals: 1,
      totalOperations: 8,
      totalProfit: 800.00,
      joinDate: '2024-06-10',
      lastActivity: '2025-07-20T16:45:00Z',
      commissionRate: 1.0,
      country: 'BR',
      verified: false,
      bankingInfo: {
        hasPixKey: false,
        hasBankAccount: true
      }
    }
  ];

  const mockStats: AffiliateStats = {
    totalAffiliates: 234,
    activeAffiliates: 189,
    vipAffiliates: 12,
    totalCommissionsPaid: 125400.50,
    monthlyCommissionsPaid: 18500.00,
    totalReferrals: 1247,
    avgCommissionRate: 1.8,
    totalProfit: 580000.00
  };

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setAffiliates(mockAffiliates);
      setStats(mockStats);
      setLoading(false);
    }, 1000);

    // Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'admin_affiliates_view', {
        event_category: 'admin_navigation',
        page_title: 'Admin Affiliates Management'
      });
    }
  }, []);

  const handleAffiliateStatusChange = (affiliateId: string, newStatus: 'active' | 'inactive' | 'suspended') => {
    setAffiliates(prev => 
      prev.map(affiliate => 
        affiliate.id === affiliateId ? { ...affiliate, status: newStatus } : affiliate
      )
    );

    if (typeof gtag !== 'undefined') {
      gtag('event', 'affiliate_status_changed', {
        event_category: 'admin_action',
        affiliate_id: affiliateId,
        new_status: newStatus
      });
    }
  };

  const handleVipToggle = (affiliateId: string) => {
    setAffiliates(prev => 
      prev.map(affiliate => 
        affiliate.id === affiliateId ? { 
          ...affiliate, 
          isVipAffiliate: !affiliate.isVipAffiliate,
          commissionRate: !affiliate.isVipAffiliate ? 2.5 : 1.5
        } : affiliate
      )
    );
  };

  const handleCommissionRateChange = (affiliateId: string, newRate: number) => {
    setAffiliates(prev => 
      prev.map(affiliate => 
        affiliate.id === affiliateId ? { ...affiliate, commissionRate: newRate } : affiliate
      )
    );
  };

  const handleDeleteAffiliate = (affiliateId: string) => {
    if (confirm('Tem certeza que deseja excluir este afiliado?')) {
      setAffiliates(prev => prev.filter(affiliate => affiliate.id !== affiliateId));
    }
  };

  const filteredAffiliates = affiliates.filter(affiliate => {
    const matchesSearch = affiliate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         affiliate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         affiliate.affiliateCode.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || affiliate.status === filterStatus;
    const matchesPlan = filterPlan === 'all' || affiliate.plan === filterPlan;
    const matchesType = filterType === 'all' || 
                       (filterType === 'vip' && affiliate.isVipAffiliate) ||
                       (filterType === 'regular' && !affiliate.isVipAffiliate);
    
    return matchesSearch && matchesStatus && matchesPlan && matchesType;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString('pt-BR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'inactive': return 'text-gray-400';
      case 'suspended': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 border-green-500/50';
      case 'inactive': return 'bg-gray-500/20 border-gray-500/50';
      case 'suspended': return 'bg-red-500/20 border-red-500/50';
      default: return 'bg-gray-500/20 border-gray-500/50';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'basic': return 'text-blue-400';
      case 'premium': return 'text-pink-400';
      case 'vip': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getPlanBg = (plan: string) => {
    switch (plan) {
      case 'basic': return 'bg-blue-500/20 border-blue-500/50';
      case 'premium': return 'bg-pink-500/20 border-pink-500/50';
      case 'vip': return 'bg-yellow-500/20 border-yellow-500/50';
      default: return 'bg-gray-500/20 border-gray-500/50';
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Gestão de Afiliados - CoinBitClub Admin">
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900/20 to-emerald-900/20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-400 mx-auto mb-4"></div>
            <p className="text-gray-300">
              {language === 'pt' ? 'Carregando afiliados...' : 'Loading affiliates...'}
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Gestão de Afiliados - CoinBitClub Admin">
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900/20 to-emerald-900/20">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-900/30 via-emerald-900/30 to-green-900/30 backdrop-blur-md border-b border-green-500/20 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent flex items-center gap-3">
                  <FiUserPlus className="text-green-400" />
                  {language === 'pt' ? 'Gestão de Afiliados' : 'Affiliate Management'}
                </h1>
                <p className="text-gray-400 mt-1">
                  {language === 'pt' ? 'Gerenciar afiliados, comissões e permissões VIP' : 'Manage affiliates, commissions and VIP permissions'}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => {/* Export affiliates */}}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-400 rounded-lg transition-all"
                >
                  <FiDownload className="w-4 h-4" />
                  <span className="text-sm">{language === 'pt' ? 'Exportar' : 'Export'}</span>
                </button>

                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-400 rounded-lg transition-all"
                >
                  <FiPlus className="w-4 h-4" />
                  <span className="text-sm">{language === 'pt' ? 'Novo Afiliado' : 'New Affiliate'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-2 bg-gradient-to-br from-green-900/50 to-emerald-900/50 backdrop-blur-md rounded-xl p-6 border border-green-500/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <FiUserPlus className="text-green-400 text-xl" />
                <h3 className="text-white font-semibold">Total</h3>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{stats?.totalAffiliates.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Afiliados registrados</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-2 bg-gradient-to-br from-green-900/50 to-emerald-900/50 backdrop-blur-md rounded-xl p-6 border border-green-500/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <FiUserCheck className="text-green-400 text-xl" />
                <h3 className="text-white font-semibold">Ativos</h3>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{stats?.activeAffiliates.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Gerando comissões</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-2 bg-gradient-to-br from-green-900/50 to-emerald-900/50 backdrop-blur-md rounded-xl p-6 border border-green-500/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <FiAward className="text-yellow-400 text-xl" />
                <h3 className="text-white font-semibold">VIP</h3>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{stats?.vipAffiliates}</div>
              <div className="text-sm text-gray-400">Afiliados VIP</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-2 bg-gradient-to-br from-green-900/50 to-emerald-900/50 backdrop-blur-md rounded-xl p-6 border border-green-500/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <FiUsers className="text-blue-400 text-xl" />
                <h3 className="text-white font-semibold">Indicações</h3>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{stats?.totalReferrals}</div>
              <div className="text-sm text-gray-400">Total de referências</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2 bg-gradient-to-br from-green-900/50 to-emerald-900/50 backdrop-blur-md rounded-xl p-6 border border-green-500/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <FiDollarSign className="text-green-400 text-xl" />
                <h3 className="text-white font-semibold">Comissões Pagas</h3>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{formatCurrency(stats?.totalCommissionsPaid || 0)}</div>
              <div className="text-sm text-gray-400">Total histórico</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2 bg-gradient-to-br from-green-900/50 to-emerald-900/50 backdrop-blur-md rounded-xl p-6 border border-green-500/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <FiTrendingUp className="text-emerald-400 text-xl" />
                <h3 className="text-white font-semibold">Este Mês</h3>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{formatCurrency(stats?.monthlyCommissionsPaid || 0)}</div>
              <div className="text-sm text-gray-400">Comissões mensais</div>
            </motion.div>
          </div>

          {/* Filters and Search */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 backdrop-blur-md rounded-xl p-6 border border-green-500/20"
          >
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder={language === 'pt' ? 'Buscar afiliados...' : 'Search affiliates...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500/50"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <FiFilter className="text-gray-400 w-4 h-4" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="bg-gray-800/50 border border-gray-600/50 rounded-lg text-white px-3 py-2 focus:outline-none focus:border-green-500/50"
                  >
                    <option value="all">Todos os Status</option>
                    <option value="active">Ativos</option>
                    <option value="inactive">Inativos</option>
                    <option value="suspended">Suspensos</option>
                  </select>
                </div>

                <select
                  value={filterPlan}
                  onChange={(e) => setFilterPlan(e.target.value as any)}
                  className="bg-gray-800/50 border border-gray-600/50 rounded-lg text-white px-3 py-2 focus:outline-none focus:border-green-500/50"
                >
                  <option value="all">Todos os Planos</option>
                  <option value="basic">Basic</option>
                  <option value="premium">Premium</option>
                  <option value="vip">VIP</option>
                </select>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="bg-gray-800/50 border border-gray-600/50 rounded-lg text-white px-3 py-2 focus:outline-none focus:border-green-500/50"
                >
                  <option value="all">Todos os Tipos</option>
                  <option value="vip">VIP</option>
                  <option value="regular">Regulares</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {/* Refresh data */}}
                  className="p-2 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50 rounded-lg text-gray-400 hover:text-white transition-all"
                >
                  <FiRefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Affiliates List */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 backdrop-blur-md rounded-xl border border-green-500/20 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-700/50">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <FiActivity className="text-green-400" />
                Lista de Afiliados ({filteredAffiliates.length})
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/50 border-b border-gray-700/50">
                  <tr>
                    <th className="text-left p-4 text-gray-300 font-medium">Afiliado</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Status</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Tipo</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Código</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Indicações</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Comissões</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Taxa</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Bancário</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredAffiliates.map((affiliate, index) => (
                      <motion.tr
                        key={affiliate.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-b border-gray-700/30 hover:bg-gray-800/30 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold">
                              {affiliate.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-white font-semibold flex items-center gap-2">
                                {affiliate.name}
                                {affiliate.verified && <FiShield className="w-4 h-4 text-green-400" title="Verificado" />}
                              </div>
                              <div className="text-sm text-gray-400">{affiliate.email}</div>
                              <div className="text-xs text-gray-500">
                                Desde: {formatDate(affiliate.joinDate)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusBg(affiliate.status)}`}>
                            <div className={`w-2 h-2 rounded-full ${affiliate.status === 'active' ? 'bg-green-400' : affiliate.status === 'suspended' ? 'bg-red-400' : 'bg-gray-400'}`}></div>
                            <span className={getStatusColor(affiliate.status)}>
                              {affiliate.status === 'active' ? 'Ativo' : affiliate.status === 'suspended' ? 'Suspenso' : 'Inativo'}
                            </span>
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col gap-1">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getPlanBg(affiliate.plan)}`}>
                              {affiliate.plan === 'vip' && <FiAward className="w-3 h-3" />}
                              {affiliate.plan === 'premium' && <FiStar className="w-3 h-3" />}
                              <span className={getPlanColor(affiliate.plan)}>
                                {affiliate.plan.toUpperCase()}
                              </span>
                            </span>
                            {affiliate.isVipAffiliate && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
                                <FiAward className="w-3 h-3" />
                                VIP
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100/10 text-gray-300 border border-gray-600">
                            {affiliate.affiliateCode}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="text-white font-medium">{affiliate.referredUsers}</div>
                          <div className="text-sm text-green-400">{affiliate.activeReferrals} ativos</div>
                          <div className="text-xs text-gray-400">{affiliate.totalOperations} operações</div>
                        </td>
                        <td className="p-4">
                          <div className="text-white font-medium">{formatCurrency(affiliate.totalCommissions)}</div>
                          <div className="text-sm text-green-400">
                            {formatCurrency(affiliate.monthlyCommissions)} este mês
                          </div>
                          <div className="text-xs text-gray-400">
                            Total: {formatCurrency(affiliate.totalProfit)}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-white font-medium">{affiliate.commissionRate}%</div>
                          <div className="text-xs text-gray-400">
                            {affiliate.isVipAffiliate ? 'VIP Rate' : 'Standard'}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col gap-1">
                            {affiliate.bankingInfo.hasPixKey && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                                <FiCreditCard className="w-3 h-3" />
                                PIX
                              </span>
                            )}
                            {affiliate.bankingInfo.hasBankAccount && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                                <FiCreditCard className="w-3 h-3" />
                                Banco
                              </span>
                            )}
                            {!affiliate.bankingInfo.hasPixKey && !affiliate.bankingInfo.hasBankAccount && (
                              <span className="text-xs text-red-400">Sem dados</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedAffiliate(affiliate)}
                              className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-400 hover:text-blue-300 transition-all"
                              title="Ver detalhes"
                            >
                              <FiEye className="w-4 h-4" />
                            </button>
                            
                            <button
                              onClick={() => setShowPaymentModal(affiliate.id)}
                              className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg text-green-400 hover:text-green-300 transition-all"
                              title="Processar pagamento"
                            >
                              <FiDollarSign className="w-4 h-4" />
                            </button>
                            
                            <button
                              onClick={() => setShowVipModal(affiliate.id)}
                              className={`p-2 rounded-lg transition-all ${
                                affiliate.isVipAffiliate 
                                  ? 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400' 
                                  : 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-400'
                              }`}
                              title={affiliate.isVipAffiliate ? 'Remover VIP' : 'Promover a VIP'}
                            >
                              <FiAward className="w-4 h-4" />
                            </button>
                            
                            <button
                              onClick={() => handleAffiliateStatusChange(affiliate.id, affiliate.status === 'active' ? 'suspended' : 'active')}
                              className={`p-2 rounded-lg transition-all ${
                                affiliate.status === 'active' 
                                  ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400' 
                                  : 'bg-green-500/20 hover:bg-green-500/30 text-green-400'
                              }`}
                              title={affiliate.status === 'active' ? 'Suspender' : 'Ativar'}
                            >
                              {affiliate.status === 'active' ? <FiUserX className="w-4 h-4" /> : <FiUserCheck className="w-4 h-4" />}
                            </button>

                            <button
                              onClick={() => handleDeleteAffiliate(affiliate.id)}
                              className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 hover:text-red-300 transition-all"
                              title="Excluir afiliado"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Affiliate Details Modal */}
      <AffiliateDetailsModal 
        affiliate={selectedAffiliate}
        onClose={() => setSelectedAffiliate(null)}
        onVipToggle={handleVipToggle}
        onCommissionRateChange={handleCommissionRateChange}
        language={language}
      />

      {/* Payment Modal */}
      <PaymentModal 
        isOpen={showPaymentModal !== null}
        affiliateId={showPaymentModal}
        onClose={() => setShowPaymentModal(null)}
        language={language}
      />

      {/* Create Affiliate Modal */}
      <CreateAffiliateModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        language={language}
      />

      {/* VIP Promotion Modal */}
      <VipPromotionModal 
        isOpen={showVipModal !== null}
        affiliateId={showVipModal}
        onClose={() => setShowVipModal(null)}
        language={language}
        affiliates={affiliates}
      />
    </AdminLayout>
  );
};

// Modal Components
const AffiliateDetailsModal: React.FC<{
  affiliate: Affiliate | null;
  onClose: () => void;
  onVipToggle: (affiliateId: string) => void;
  onCommissionRateChange: (affiliateId: string, rate: number) => void;
  language: string;
}> = ({ affiliate, onClose, onVipToggle, onCommissionRateChange, language }) => {
  const [commissionRate, setCommissionRate] = useState(affiliate?.commissionRate || 1.5);

  if (!affiliate) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const handleRateChange = () => {
    onCommissionRateChange(affiliate.id, commissionRate);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 w-full max-w-3xl border border-green-500/20 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">
            Detalhes do Afiliado
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-all"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Affiliate Info */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white text-2xl font-bold">
                {affiliate.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-xl font-bold text-white flex items-center gap-2">
                  {affiliate.name}
                  {affiliate.verified && <FiShield className="w-5 h-5 text-green-400" />}
                  {affiliate.isVipAffiliate && <FiAward className="w-5 h-5 text-yellow-400" />}
                </div>
                <div className="text-gray-400">{affiliate.email}</div>
                <div className="text-sm text-gray-500">
                  Código: {affiliate.affiliateCode} | Membro desde {new Date(affiliate.joinDate).toLocaleDateString('pt-BR')}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">Status VIP</div>
              <button
                onClick={() => onVipToggle(affiliate.id)}
                className={`w-full px-4 py-2 rounded-lg font-medium transition-all ${
                  affiliate.isVipAffiliate 
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' 
                    : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                }`}
              >
                {affiliate.isVipAffiliate ? 'Remover VIP' : 'Tornar VIP'}
              </button>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">Taxa de Comissão (%)</div>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(parseFloat(e.target.value))}
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg text-white px-3 py-2 focus:outline-none focus:border-green-500"
                />
                <button
                  onClick={handleRateChange}
                  className="px-3 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-all"
                >
                  <FiSettings className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">Status Bancário</div>
              <div className="flex flex-col gap-1">
                {affiliate.bankingInfo.hasPixKey && (
                  <span className="text-green-400 text-sm">✓ PIX Configurado</span>
                )}
                {affiliate.bankingInfo.hasBankAccount && (
                  <span className="text-green-400 text-sm">✓ Conta Bancária</span>
                )}
                {!affiliate.bankingInfo.hasPixKey && !affiliate.bankingInfo.hasBankAccount && (
                  <span className="text-red-400 text-sm">⚠ Dados incompletos</span>
                )}
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Indicações</div>
              <div className="text-lg font-bold text-white">{affiliate.referredUsers}</div>
              <div className="text-xs text-green-400">{affiliate.activeReferrals} ativos</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Operações</div>
              <div className="text-lg font-bold text-white">{affiliate.totalOperations}</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Comissões Total</div>
              <div className="text-lg font-bold text-white">{formatCurrency(affiliate.totalCommissions)}</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Este Mês</div>
              <div className="text-lg font-bold text-white">{formatCurrency(affiliate.monthlyCommissions)}</div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Última Atividade</div>
              <div className="text-white">{new Date(affiliate.lastActivity).toLocaleString('pt-BR')}</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">País</div>
              <div className="text-white">{affiliate.country}</div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-all"
          >
            Fechar
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const PaymentModal: React.FC<{
  isOpen: boolean;
  affiliateId: string | null;
  onClose: () => void;
  language: string;
}> = ({ isOpen, affiliateId, onClose, language }) => {
  const [amount, setAmount] = useState(0);
  const [currency, setCurrency] = useState('USD');
  const [referencePeriod, setReferencePeriod] = useState('');

  if (!isOpen || !affiliateId) return null;

  const handlePayment = () => {
    // Implementar processamento de pagamento
    alert('Pagamento processado com sucesso!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 w-full max-w-md border border-green-500/20"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">
            Processar Pagamento
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-all"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Valor
            </label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg text-white px-3 py-2 focus:outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Moeda
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg text-white px-3 py-2 focus:outline-none focus:border-green-500"
            >
              <option value="USD">USD - Dólar</option>
              <option value="BRL">BRL - Real</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Período de Referência
            </label>
            <input
              type="text"
              placeholder="Ex: 2024-08"
              value={referencePeriod}
              onChange={(e) => setReferencePeriod(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg text-white px-3 py-2 focus:outline-none focus:border-green-500"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handlePayment}
            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-all"
          >
            Processar
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const CreateAffiliateModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  language: string;
}> = ({ isOpen, onClose, language }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 w-full max-w-md border border-green-500/20"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">
            Criar Novo Afiliado
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-all"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center py-8">
          <FiUserPlus className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-white mb-2">
            Funcionalidade em Desenvolvimento
          </h4>
          <p className="text-gray-400 mb-6">
            A criação manual de afiliados será implementada em breve.
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-all"
          >
            Entendi
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const VipPromotionModal: React.FC<{
  isOpen: boolean;
  affiliateId: string | null;
  onClose: () => void;
  language: string;
  affiliates: Affiliate[];
}> = ({ isOpen, onClose, affiliateId, language, affiliates }) => {
  const [isPromoting, setIsPromoting] = useState(false);
  const [promotionData, setPromotionData] = useState({
    newCommissionRate: '2.5',
    vipBenefits: [] as string[],
    customMessage: '',
    effectiveDate: new Date().toISOString().split('T')[0]
  });

  // Find the affiliate data
  const affiliate = affiliates.find(a => a.id === affiliateId);
  const isCurrentlyVip = affiliate?.isVipAffiliate || false;

  const handlePromoteToVip = async () => {
    if (!affiliateId) return;

    setIsPromoting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real implementation, make API call here
      // await api.promoteAffiliateToVip(affiliateId, promotionData);
      
      console.log('Promoting affiliate to VIP:', {
        affiliateId,
        ...promotionData
      });
      
      onClose();
    } catch (error) {
      console.error('Error promoting affiliate:', error);
    } finally {
      setIsPromoting(false);
    }
  };

  const handleRemoveVip = async () => {
    if (!affiliateId) return;

    setIsPromoting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In real implementation, make API call here
      // await api.removeVipStatus(affiliateId);
      
      console.log('Removing VIP status from affiliate:', affiliateId);
      
      onClose();
    } catch (error) {
      console.error('Error removing VIP status:', error);
    } finally {
      setIsPromoting(false);
    }
  };

  const toggleBenefit = (benefit: string) => {
    setPromotionData(prev => ({
      ...prev,
      vipBenefits: prev.vipBenefits.includes(benefit)
        ? prev.vipBenefits.filter(b => b !== benefit)
        : [...prev.vipBenefits, benefit]
    }));
  };

  const availableBenefits = [
    'Comissão Premium (2.5%)',
    'Suporte Prioritário',
    'Dashboard Avançado',
    'Relatórios Exclusivos',
    'Eventos VIP',
    'Pagamentos Acelerados'
  ];

  if (!isOpen || !affiliate) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 w-full max-w-2xl border border-yellow-500/20 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FiAward className="text-yellow-400 text-2xl" />
            <h3 className="text-xl font-bold text-white">
              {isCurrentlyVip ? 'Gerenciar Status VIP' : 'Promover a Afiliado VIP'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-all"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Affiliate Info */}
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg p-4 mb-6 border border-yellow-500/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <FiUsers className="text-white text-xl" />
            </div>
            <div>
              <h4 className="text-white font-semibold">{affiliate.name}</h4>
              <p className="text-gray-400">{affiliate.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-400">Status atual:</span>
                {isCurrentlyVip ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
                    <FiAward className="w-3 h-3" />
                    VIP
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs font-medium">
                    <FiUsers className="w-3 h-3" />
                    Regular
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {!isCurrentlyVip ? (
          // Promotion Form
          <div className="space-y-6">
            {/* Commission Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nova Taxa de Comissão (%)
              </label>
              <input
                type="number"
                value={promotionData.newCommissionRate}
                onChange={(e) => setPromotionData(prev => ({...prev, newCommissionRate: e.target.value}))}
                className="w-full bg-gray-800/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-500/50"
                min="0"
                max="10"
                step="0.1"
              />
              <p className="text-xs text-gray-400 mt-1">Taxa atual: {affiliate.commissionRate}%</p>
            </div>

            {/* VIP Benefits */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Benefícios VIP
              </label>
              <div className="grid grid-cols-2 gap-2">
                {availableBenefits.map((benefit) => (
                  <button
                    key={benefit}
                    onClick={() => toggleBenefit(benefit)}
                    className={`p-3 rounded-lg border text-sm transition-all ${
                      promotionData.vipBenefits.includes(benefit)
                        ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
                        : 'bg-gray-800/50 border-gray-600/50 text-gray-400 hover:border-yellow-500/30'
                    }`}
                  >
                    {benefit}
                  </button>
                ))}
              </div>
            </div>

            {/* Effective Date */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Data de Vigência
              </label>
              <input
                type="date"
                value={promotionData.effectiveDate}
                onChange={(e) => setPromotionData(prev => ({...prev, effectiveDate: e.target.value}))}
                className="w-full bg-gray-800/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-500/50"
              />
            </div>

            {/* Custom Message */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Mensagem Personalizada (Opcional)
              </label>
              <textarea
                value={promotionData.customMessage}
                onChange={(e) => setPromotionData(prev => ({...prev, customMessage: e.target.value}))}
                placeholder="Mensagem de congratulações ou instruções especiais..."
                className="w-full bg-gray-800/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-500/50"
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-all"
                disabled={isPromoting}
              >
                Cancelar
              </button>
              <button
                onClick={handlePromoteToVip}
                disabled={isPromoting}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPromoting ? (
                  <div className="flex items-center justify-center gap-2">
                    <FiRefreshCw className="w-4 h-4 animate-spin" />
                    Promovendo...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <FiAward className="w-4 h-4" />
                    Promover a VIP
                  </div>
                )}
              </button>
            </div>
          </div>
        ) : (
          // VIP Management
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg p-4 border border-yellow-500/20">
              <h4 className="text-yellow-400 font-semibold mb-2">Status VIP Ativo</h4>
              <p className="text-gray-300 text-sm mb-4">
                Este afiliado possui status VIP com benefícios exclusivos e taxa de comissão preferencial.
              </p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Taxa Atual:</span>
                  <span className="text-yellow-400 font-medium ml-2">{affiliate.commissionRate}%</span>
                </div>
                <div>
                  <span className="text-gray-400">Comissões VIP:</span>
                  <span className="text-green-400 font-medium ml-2">{formatCurrency(affiliate.monthlyCommissions)}</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <FiUserX className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">
                Remover Status VIP?
              </h4>
              <p className="text-gray-400 mb-6">
                Esta ação irá remover todos os benefícios VIP e reduzir a taxa de comissão para o padrão (1.5%).
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-all"
                disabled={isPromoting}
              >
                Cancelar
              </button>
              <button
                onClick={handleRemoveVip}
                disabled={isPromoting}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPromoting ? (
                  <div className="flex items-center justify-center gap-2">
                    <FiRefreshCw className="w-4 h-4 animate-spin" />
                    Removendo...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <FiUserX className="w-4 h-4" />
                    Remover VIP
                  </div>
                )}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminAffiliates;



