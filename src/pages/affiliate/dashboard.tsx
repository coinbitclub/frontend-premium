import React from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/Card';
import { PageTracker } from '../../components/PageTracker';
import { useTracking } from '../../hooks/useTracking';
import { useEffect, useState } from 'react';
import AffiliateLayout from '../../components/AffiliateLayout';
import {
  UserGroupIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  SparklesIcon,
  ShareIcon,
  QrCodeIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  UserPlusIcon,
  MagnifyingGlassIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  ArrowDownTrayIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';
import { FiLoader, FiRefreshCw } from 'react-icons/fi';
import QRCode from 'qrcode.react';
import Link from 'next/link';

// Mock data - seguindo o padrão do projeto (sem integração com banco)
const affiliateStats = {
  totalReferrals: 47,
  activeReferrals: 32,
  totalCommissions: 1438.19,
  monthlyCommissions: 425.67,
  conversionRate: 65.4,
  tier: 'Diamante',
  totalEarnings: 23456.70,
};

const recentReferrals = [
  { id: 1, username: 'João S.', email: 'joao@email.com', joinDate: '15/08/2025', status: 'ACTIVE', deposits: 850.00, commission: 42.50 },
  { id: 2, username: 'Maria L.', email: 'maria@email.com', joinDate: '14/08/2025', status: 'ACTIVE', deposits: 1200.00, commission: 60.00 },
  { id: 3, username: 'Pedro K.', email: 'pedro@email.com', joinDate: '13/08/2025', status: 'PENDING', deposits: 0.00, commission: 0.00 },
];

// Mock data para busca de usuários
const mockUsers = [
  { 
    id: 1, 
    phone: '+55 21 99999-9999', 
    email: 'joao@email.com',
    name: 'João Silva', 
    status: 'AVAILABLE',
    plan: 'Premium',
    joinDate: '2025-08-10' 
  },
  { 
    id: 2, 
    phone: '+55 11 88888-8888', 
    email: 'maria@email.com',
    name: 'Maria Santos', 
    status: 'ALREADY_LINKED',
    plan: 'VIP',
    joinDate: '2025-08-12' 
  },
];

export default function AffiliateDashboard() {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { trackPageView } = useTracking();
  const referralLink = 'https://coinbitclub.com/ref/YOUR_CODE';

  useEffect(() => {
    trackPageView('Affiliate Dashboard', {
      page_category: 'affiliate_dashboard',
      user_type: 'affiliate'
    });
  }, [trackPageView]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const searchUser = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    // Simular busca por telefone ou email
    setTimeout(() => {
      const results = mockUsers.filter(user => 
        user.phone.includes(searchQuery) || 
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
      setIsSearching(false);
    }, 1000);
  };

  const linkUser = (userId: number) => {
    alert('Usuário vinculado com sucesso!');
    setSearchResults([]);
    setSearchQuery('');
  };

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <AffiliateLayout
      title="Dashboard Afiliado - CoinBitClub"
    >
      <PageTracker 
        pageTitle="Dashboard Afiliado"
        pageCategory="affiliate_dashboard"
        customParams={{ user_type: 'affiliate' }}
      />

      <div className="p-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400"></div>
          </div>
        ) : (
          <>
            {/* Header Actions */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent mb-2">
                  Dashboard Afiliado
                </h1>
                <p className="text-gray-400">
                  Performance mensal: +{affiliateStats.conversionRate}% de conversão
                </p>
              </div>
              
              <button 
                onClick={refreshData}
                className="p-3 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl border border-gray-600/50 hover:border-orange-400/50 transition-all group"
                disabled={loading}
              >
                <FiRefreshCw className={`text-orange-400 group-hover:scale-110 transition-transform ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

          {/* Cards de Métricas - Seguindo padrão da área de usuários */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total de Indicações */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/30 p-6 hover:border-orange-500/30 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <UserGroupIcon className="text-2xl text-orange-400" />
                </div>
                <span className="text-green-400 text-sm font-bold bg-green-500/20 px-2 py-1 rounded-full">
                  +{affiliateStats.activeReferrals} ativas
                </span>
              </div>
              <h3 className="text-gray-400 text-sm font-medium mb-1">
                Total de Indicações
              </h3>
              <p className="text-3xl font-bold text-white">{affiliateStats.totalReferrals}</p>
            </motion.div>

            {/* Comissões Mensais */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/30 p-6 hover:border-yellow-500/30 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CurrencyDollarIcon className="text-2xl text-yellow-400" />
                </div>
                <span className="text-yellow-400 text-xs font-semibold">MENSAL</span>
              </div>
              <h3 className="text-gray-400 text-sm font-medium mb-1">
                Comissões do Mês
              </h3>
              <p className="text-3xl font-bold text-white">${affiliateStats.monthlyCommissions.toFixed(2)}</p>
            </motion.div>

            {/* Taxa de Conversão */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/30 p-6 hover:border-blue-500/30 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ChartBarIcon className="text-2xl text-blue-400" />
                </div>
                <span className="text-blue-400 text-xs font-semibold">CONVERSÃO</span>
              </div>
              <h3 className="text-gray-400 text-sm font-medium mb-1">
                Taxa de Conversão
              </h3>
              <p className="text-3xl font-bold text-white">{affiliateStats.conversionRate}%</p>
            </motion.div>

            {/* Ganhos Totais */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/30 p-6 hover:border-green-500/30 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <SparklesIcon className="text-2xl text-green-400" />
                </div>
                <span className="text-green-400 text-xs font-semibold">
                  TOTAL
                </span>
              </div>
              <h3 className="text-gray-400 text-sm font-medium mb-1">
                Ganhos Totais
              </h3>
              <p className="text-3xl font-bold text-white">${affiliateStats.totalEarnings.toFixed(2)}</p>
            </motion.div>
          </div>

          {/* Vincular Usuário */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/30 p-6 mb-8"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <UserPlusIcon className="text-orange-400" />
              Vincular Usuário
            </h3>
            
            <div className="flex space-x-4 mb-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Telefone ou Email do Usuário
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex space-x-2">
                    <DevicePhoneMobileIcon className="h-5 w-5 text-gray-400" />
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="+55 21 99999-9999 ou email@exemplo.com"
                    className="w-full pl-16 pr-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-400/50 transition-all"
                  />
                </div>
              </div>
              <div className="flex items-end">
                <button
                  onClick={searchUser}
                  disabled={isSearching || !searchQuery.trim()}
                  className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 disabled:from-gray-600 disabled:to-gray-700 text-black font-bold px-6 py-3 rounded-xl transition-all flex items-center space-x-2 group"
                >
                  <MagnifyingGlassIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span>{isSearching ? 'Buscando...' : 'Buscar'}</span>
                </button>
              </div>
            </div>

            {/* Resultados da Busca */}
            {searchResults.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-orange-400">Resultados encontrados:</h4>
                {searchResults.map((user) => (
                  <motion.div 
                    key={user.id} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-gradient-to-r from-gray-800/30 to-gray-700/30 border border-gray-600/30 rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center">
                            <span className="text-white font-bold">{user.name.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="text-white font-semibold">{user.name}</p>
                            <p className="text-gray-400 text-sm">{user.email}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Telefone:</span>
                            <p className="text-orange-400">{user.phone}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Plano:</span>
                            <p className="text-yellow-400">{user.plan}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Cadastro:</span>
                            <p className="text-green-400">{new Date(user.joinDate).toLocaleDateString('pt-BR')}</p>
                          </div>
                        </div>
                      </div>
                      <div className="ml-6">
                        {user.status === 'AVAILABLE' ? (
                          <button
                            onClick={() => linkUser(user.id)}
                            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-xl font-semibold transition-all flex items-center space-x-2 group"
                          >
                            <CheckIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                            <span>Vincular</span>
                          </button>
                        ) : (
                          <div className="flex items-center space-x-2 text-gray-400 bg-gray-700/50 px-4 py-2 rounded-xl">
                            <UserGroupIcon className="h-5 w-5" />
                            <span>Já vinculado</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Performance e Indicados Recentes */}
          <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/30 p-6"
            >
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <ChartBarIcon className="text-orange-400" />
                Desempenho do Mês
              </h3>
              
              <div className="space-y-6">
                {/* Taxa de Sucesso */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300">Taxa de Conversão</span>
                    <span className="text-orange-400 font-bold">{affiliateStats.conversionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-orange-400 to-yellow-500 h-2 rounded-full transition-all"
                      style={{ width: `${affiliateStats.conversionRate}%` }}
                    ></div>
                  </div>
                </div>

                {/* Comissões */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Comissões Hoje</p>
                    <p className="text-2xl font-bold text-green-400">+12.5%</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Total do Mês</p>
                    <p className="text-2xl font-bold text-orange-400">${affiliateStats.monthlyCommissions.toFixed(2)}</p>
                  </div>
                </div>

                {/* Nível Atual */}
                <div>
                  <p className="text-gray-400 text-sm">Nível Atual</p>
                  <p className="text-3xl font-bold text-white flex items-center gap-2">
                    💎 {affiliateStats.tier}
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/30 p-6"
            >
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <UserGroupIcon className="text-orange-400" />
                Indicados Recentes
              </h3>
              
              <div className="space-y-3">
                {recentReferrals.map((referral) => (
                  <div key={referral.id} className="bg-gradient-to-r from-gray-800/30 to-gray-700/30 border border-gray-600/30 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{referral.username.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">{referral.username}</p>
                          <p className="text-xs text-gray-400">{referral.joinDate}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        referral.status === 'ACTIVE' 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                          : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      }`}>
                        {referral.status === 'ACTIVE' ? 'Ativo' : 'Pendente'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Depósitos: ${referral.deposits.toFixed(2)}</span>
                      <span className="font-semibold text-orange-400">Comissão: ${referral.commission.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <Link 
                href="/affiliate/referrals"
                className="w-full mt-4 bg-gradient-to-r from-gray-800/50 to-gray-700/50 hover:from-orange-500/20 hover:to-yellow-500/20 border border-gray-600/50 hover:border-orange-400/50 text-gray-300 hover:text-white transition-all rounded-xl px-4 py-2 text-sm text-center block"
              >
                Ver Todos os Indicados
              </Link>
            </motion.div>
          </div>

          {/* Links Rápidos */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
          >
            <Link 
              href="/affiliate/referrals" 
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 hover:border-orange-400/50 transition-all group"
            >
              <div className="flex flex-col items-center text-center">
                <UserGroupIcon className="text-3xl text-orange-400 mb-3 group-hover:scale-110 transition-transform" />
                <span className="text-white font-medium">Indicações</span>
                <span className="text-xs text-gray-400 mt-1">Gerenciar</span>
              </div>
            </Link>

            <Link 
              href="/affiliate/commissions" 
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 hover:border-green-400/50 transition-all group"
            >
              <div className="flex flex-col items-center text-center">
                <CurrencyDollarIcon className="text-3xl text-green-400 mb-3 group-hover:scale-110 transition-transform" />
                <span className="text-white font-medium">Comissões</span>
                <span className="text-xs text-gray-400 mt-1">Histórico</span>
              </div>
            </Link>

            <button
              onClick={() => {
                setSearchQuery('');
                setSearchResults([]);
                document.querySelector('input[placeholder*="Telefone"]')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 hover:border-blue-400/50 transition-all group"
            >
              <div className="flex flex-col items-center text-center">
                <UserPlusIcon className="text-3xl text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
                <span className="text-white font-medium">Vincular</span>
                <span className="text-xs text-gray-400 mt-1">Novo usuário</span>
              </div>
            </button>
          </motion.div>
          </>
        )}
      </div>
    </AffiliateLayout>
  );
}
