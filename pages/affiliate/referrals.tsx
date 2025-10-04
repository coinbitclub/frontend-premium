import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { FiUsers, FiLink, FiCopy, FiSearch, FiFilter, FiUserPlus, FiActivity, FiDollarSign, FiCalendar, FiTrendingUp, FiX } from 'react-icons/fi';
import { useLanguage } from '../../hooks/useLanguage';
import AffiliateLayout from '../../src/components/AffiliateLayout';

// Interfaces para referrals
interface Referral {
  id: string;
  name: string;
  email: string;
  joinDate: Date;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'VERIFIED';
  totalInvested: number;
  commissionGenerated: number;
  lastActivity: Date;
  totalTrades: number;
  successRate: number;
  referralCode: string;
}

interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  pendingReferrals: number;
  totalCommissions: number;
  conversionRate: number;
  averageInvestment: number;
}

const AffiliateReferrals: React.FC = () => {
  const [mounted, setMounted] = useState<boolean>(false);
  const { language, t } = useLanguage();
  const [copySuccess, setCopySuccess] = useState(false);
  
  // Estados para dados de indicações
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [stats, setStats] = useState<ReferralStats>({
    totalReferrals: 47,
    activeReferrals: 32,
    pendingReferrals: 8,
    totalCommissions: 8947.50,
    conversionRate: 68.1,
    averageInvestment: 4250.30
  });

  // Estados para filtros e busca
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('joinDate');

  // Estados para modal de vincular usuário
  const [showAffiliateModal, setShowAffiliateModal] = useState(false);
  const [sponsorCode, setSponsorCode] = useState('');

  // Link de indicação do usuário (will be fetched from API)
  const [affiliateCode, setAffiliateCode] = useState('');
  const [referralLink, setReferralLink] = useState('');

  useEffect(() => {
    setMounted(true);
    fetchReferralData();

    // Analytics
    if (typeof window !== 'undefined' && typeof gtag !== 'undefined') {
      gtag('event', 'affiliate_referrals_view', {
        page_title: 'Affiliate Referrals',
        language: language,
        event_category: 'affiliate_engagement',
        page_type: 'referrals'
      });
    }
  }, [language]);

  const fetchReferralData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No auth token found');
        generateReferralData(); // Fallback to mock data
        return;
      }

      // Fetch referrals and stats in parallel
      const [referralsRes, statsRes] = await Promise.all([
        fetch('/api/affiliate/referrals?limit=100', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/affiliate/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (referralsRes.ok) {
        const referralsData = await referralsRes.json();
        if (referralsData.success && referralsData.referrals) {
          const formattedReferrals: Referral[] = referralsData.referrals.map((ref: any) => ({
            id: ref.id.toString(),
            name: ref.name || 'Unknown',
            email: ref.email || '',
            joinDate: new Date(ref.referredAt),
            status: ref.status === 'active' ? 'ACTIVE' : ref.status === 'pending' ? 'PENDING' : 'INACTIVE',
            totalInvested: ref.conversionValue || 0,
            commissionGenerated: (ref.conversionValue || 0) * 0.015,
            lastActivity: new Date(ref.convertedAt || ref.referredAt),
            totalTrades: 0,
            successRate: 0,
            referralCode: affiliateCode
          }));
          setReferrals(formattedReferrals);
        }
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.success) {
          const totalRefs = statsData.stats.totalReferrals || 0;
          const activeRefs = statsData.stats.activeReferrals || 0;
          const totalInvestment = referrals.reduce((sum, r) => sum + r.totalInvested, 0);

          setStats({
            totalReferrals: totalRefs,
            activeReferrals: activeRefs,
            pendingReferrals: totalRefs - activeRefs,
            totalCommissions: statsData.stats.totalCommissions || 0,
            conversionRate: totalRefs > 0 ? (activeRefs / totalRefs) * 100 : 0,
            averageInvestment: totalRefs > 0 ? totalInvestment / totalRefs : 0
          });

          // Set affiliate code and referral link from real data
          if (statsData.stats.affiliateCode) {
            const code = statsData.stats.affiliateCode;
            const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || window.location.origin;
            setAffiliateCode(code);
            setReferralLink(`${frontendUrl}/register?ref=${code}`);
          }
        }
      }

    } catch (error) {
      console.error('Error fetching referral data:', error);
      generateReferralData(); // Fallback to mock data on error
    }
  };

  const generateReferralData = () => {
    const sampleReferrals: Referral[] = [
      {
        id: '1',
        name: 'João Silva Santos',
        email: 'joao.silva@email.com',
        joinDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        status: 'ACTIVE',
        totalInvested: 5000,
        commissionGenerated: 250,
        lastActivity: new Date(Date.now() - 1 * 60 * 60 * 1000),
        totalTrades: 47,
        successRate: 89.4,
        referralCode: affiliateCode
      },
      {
        id: '2',
        name: 'Maria Oliveira Costa',
        email: 'maria.oliveira@email.com',
        joinDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        status: 'VERIFIED',
        totalInvested: 3500,
        commissionGenerated: 175,
        lastActivity: new Date(Date.now() - 30 * 60 * 1000),
        totalTrades: 23,
        successRate: 78.3,
        referralCode: affiliateCode
      },
      {
        id: '3',
        name: 'Carlos Eduardo',
        email: 'carlos.eduardo@email.com',
        joinDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        status: 'PENDING',
        totalInvested: 1000,
        commissionGenerated: 50,
        lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
        totalTrades: 5,
        successRate: 60.0,
        referralCode: affiliateCode
      },
      {
        id: '4',
        name: 'Ana Paula Ferreira',
        email: 'ana.paula@email.com',
        joinDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        status: 'ACTIVE',
        totalInvested: 7500,
        commissionGenerated: 375,
        lastActivity: new Date(Date.now() - 15 * 60 * 1000),
        totalTrades: 89,
        successRate: 92.1,
        referralCode: affiliateCode
      },
      {
        id: '5',
        name: 'Roberto Mendes',
        email: 'roberto.mendes@email.com',
        joinDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        status: 'INACTIVE',
        totalInvested: 2000,
        commissionGenerated: 100,
        lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000),
        totalTrades: 12,
        successRate: 66.7,
        referralCode: affiliateCode
      }
    ];

    setReferrals(sampleReferrals);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      
      if (typeof gtag !== 'undefined') {
        gtag('event', 'referral_link_copy', {
          event_category: 'affiliate_interaction',
          link_copied: text
        });
      }
    } catch (err) {
      console.error('Erro ao copiar link:', err);
    }
  };

  const handleAffiliateLink = () => {
    if (sponsorCode.trim()) {
      // Simular busca e vinculação de usuário
      setShowAffiliateModal(false);
      setSponsorCode('');
      
      alert(`Busca realizada! Usuário encontrado e vinculação solicitada para: ${sponsorCode.trim()}`);
      
      if (typeof gtag !== 'undefined') {
        gtag('event', 'user_link_request', {
          search_term: sponsorCode.trim(),
          event_category: 'affiliate_management'
        });
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-500/20 text-green-400 border border-green-500/30';
      case 'VERIFIED': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 'PENDING': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
      case 'INACTIVE': return 'bg-red-500/20 text-red-400 border border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Ativo';
      case 'VERIFIED': return 'Verificado';
      case 'PENDING': return 'Pendente';
      case 'INACTIVE': return 'Inativo';
      default: return status;
    }
  };

  const filteredReferrals = referrals.filter(referral => {
    const matchesSearch = referral.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         referral.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || referral.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
        <title>Indicações | CoinBitClub</title>
        <meta name="description" content="Gerencie suas indicações e acompanhe o programa de afiliados" />
      </Head>

      <AffiliateLayout title="Gestão de Indicações">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent mb-2">
              Suas Indicações
            </h1>
            <p className="text-gray-400">
              Gerencie suas indicações e compartilhe seu link de afiliado
            </p>
          </div>

          {/* Cards de estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/30 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-xl flex items-center justify-center">
                  <FiUsers className="text-2xl text-orange-400" />
                </div>
                <span className="text-green-400 text-sm font-bold">TOTAL</span>
              </div>
              <h3 className="text-gray-400 text-sm font-medium mb-1">Total de Indicações</h3>
              <p className="text-3xl font-bold text-white">{stats.totalReferrals}</p>
              <p className="text-gray-400 text-sm mt-2">{stats.activeReferrals} ativos</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/30 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center">
                  <FiDollarSign className="text-2xl text-green-400" />
                </div>
                <span className="text-green-400 text-sm font-bold">COMISSÕES</span>
              </div>
              <h3 className="text-gray-400 text-sm font-medium mb-1">Total em Comissões</h3>
              <p className="text-3xl font-bold text-white">${stats.totalCommissions.toFixed(2)}</p>
              <p className="text-gray-400 text-sm mt-2">Média: ${stats.averageInvestment.toFixed(2)}</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/30 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                  <FiTrendingUp className="text-2xl text-blue-400" />
                </div>
                <span className="text-blue-400 text-sm font-bold">CONVERSÃO</span>
              </div>
              <h3 className="text-gray-400 text-sm font-medium mb-1">Taxa de Conversão</h3>
              <p className="text-3xl font-bold text-white">{stats.conversionRate}%</p>
              <p className="text-gray-400 text-sm mt-2">{stats.pendingReferrals} pendentes</p>
            </motion.div>
          </div>

          {/* Link de Indicação */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/30 p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <FiLink className="text-orange-400" />
              Seu Link de Indicação
            </h3>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
                  <input
                    type="text"
                    value={referralLink}
                    readOnly
                    className="flex-1 bg-transparent text-white text-sm focus:outline-none"
                  />
                  <button
                    onClick={() => copyToClipboard(referralLink)}
                    className="p-2 bg-orange-500/20 hover:bg-orange-500/30 rounded-lg transition-colors group"
                  >
                    <FiCopy className="text-orange-400 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  Compartilhe este link para receber comissões por cada novo usuário
                </p>
              </div>
              <div className="flex items-center">
                <span className="text-green-400 text-sm font-medium px-3 py-2 bg-green-500/20 rounded-lg">
                  Código: {affiliateCode}
                </span>
              </div>
            </div>
            
            {copySuccess && (
              <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                <p className="text-green-400 text-sm">✓ Link copiado com sucesso!</p>
              </div>
            )}
            
            {/* Botão Vincular Usuário */}
            <div className="mt-6 pt-6 border-t border-gray-600/30">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-semibold mb-1">Vincular novo usuário</h4>
                  <p className="text-gray-400 text-sm">
                    Busque usuários para adicionar à sua rede de afiliados
                  </p>
                </div>
                <button
                  onClick={() => setShowAffiliateModal(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold px-6 py-3 rounded-xl transition-all flex items-center gap-2 group"
                >
                  <FiUserPlus className="group-hover:scale-110 transition-transform" />
                  Vincular Usuário
                </button>
              </div>
            </div>
          </motion.div>

          {/* Filtros e Busca */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/30 p-6"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por nome ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                >
                  <option value="ALL">Todos os Status</option>
                  <option value="ACTIVE">Ativos</option>
                  <option value="VERIFIED">Verificados</option>
                  <option value="PENDING">Pendentes</option>
                  <option value="INACTIVE">Inativos</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                >
                  <option value="joinDate">Data de Cadastro</option>
                  <option value="commissionGenerated">Comissão Gerada</option>
                  <option value="totalInvested">Total Investido</option>
                  <option value="name">Nome</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Lista de Indicações */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/30 p-6"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <FiUserPlus className="text-blue-400" />
              Lista de Indicações ({filteredReferrals.length})
            </h3>
            
            <div className="space-y-4">
              {filteredReferrals.map((referral, index) => (
                <motion.div
                  key={referral.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="p-6 bg-gray-700/30 rounded-lg border border-gray-600/30 hover:border-orange-400/30 transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full flex items-center justify-center font-bold text-black">
                        {referral.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{referral.name}</h4>
                        <p className="text-gray-400 text-sm">{referral.email}</p>
                        <p className="text-gray-500 text-xs">
                          Cadastro: {referral.joinDate.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 text-center">
                      <div>
                        <p className="text-gray-400 text-xs">Status</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(referral.status)}`}>
                          {getStatusText(referral.status)}
                        </span>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Investido</p>
                        <p className="text-white font-semibold">${referral.totalInvested.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Comissão</p>
                        <p className="text-green-400 font-semibold">${referral.commissionGenerated.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Trades</p>
                        <p className="text-white font-semibold">{referral.totalTrades}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Taxa Sucesso</p>
                        <p className="text-blue-400 font-semibold">{referral.successRate}%</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {filteredReferrals.length === 0 && (
                <div className="text-center py-12">
                  <FiUsers className="text-6xl text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">Nenhuma indicação encontrada</h3>
                  <p className="text-gray-500">Compartilhe seu link para começar a receber comissões</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Modal Vincular Usuário */}
        {showAffiliateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-8 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Vincular Usuário</h3>
                <button
                  onClick={() => setShowAffiliateModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-blue-500/20 rounded-lg border border-blue-500/30">
                  <h4 className="text-blue-400 font-semibold mb-2">Como funciona?</h4>
                  <p className="text-blue-300 text-sm">
                    Busque um usuário por telefone, email ou nome completo para vinculá-lo como sua indicação.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Buscar Usuário
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex space-x-2">
                      <FiSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={sponsorCode}
                      onChange={(e) => setSponsorCode(e.target.value)}
                      placeholder="Telefone, email ou nome completo"
                      className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <p className="text-sm text-gray-400 mt-2">
                    📱 <strong>Telefone:</strong> +55 21 99999-9999<br/>
                    📧 <strong>Email:</strong> usuario@email.com<br/>
                    👤 <strong>Nome:</strong> João da Silva
                  </p>
                </div>

                <div className="p-4 bg-orange-500/20 rounded-lg border border-orange-500/30">
                  <p className="text-orange-300 text-sm">
                    ⏰ <strong>Importante:</strong> A vinculação é permitida apenas até <strong>48 horas</strong> após o cadastro do usuário.
                  </p>
                </div>

                <div className="p-4 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                  <p className="text-yellow-300 text-sm">
                    ⚠️ A vinculação será analisada pela equipe e você receberá uma confirmação em até 24 horas.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowAffiliateModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAffiliateLink}
                    disabled={!sponsorCode.trim()}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Buscar e Vincular
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

export default AffiliateReferrals;
