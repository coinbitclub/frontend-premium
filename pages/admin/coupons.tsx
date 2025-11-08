import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '../../components/AdminLayout';
import { 
  FiPlus, 
  FiEdit3, 
  FiTrash2, 
  FiCopy, 
  FiDollarSign,
  FiTag,
  FiCalendar,
  FiUsers,
  FiBarChart,
  FiTrendingUp,
  FiShoppingCart,
  FiGift,
  FiPercent,
  FiRefreshCw,
  FiSearch,
  FiFilter,
  FiX
} from 'react-icons/fi';
import { useLanguage } from '../../hooks/useLanguage';

// Interfaces
interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  description: string;
  maxUses: number;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
  expiresAt: string | null;
  // Novos campos para vendas promocionais
  salePrice: number; // Preço de venda do cupom
  creditAmount: number; // Valor do crédito que será dado
  purchaseCount: number; // Quantas vezes foi comprado
  totalRevenue: number; // Receita total gerada
}

interface CouponStats {
  totalCoupons: number;
  activeCoupons: number;
  totalPurchases: number;
  totalRevenue: number;
  averageUseRate: number;
  topSellingCoupon: string;
  monthlyGrowth: number;
}

interface CouponFormData {
  code: string;
  type: 'percentage' | 'fixed';
  value: string;
  description: string;
  maxUses: string;
  expiresAt: string;
  salePrice: string;
  creditAmount: string;
  isActive: boolean;
}

const AdminCoupons: React.FC = () => {
  const { language } = useLanguage();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [stats, setStats] = useState<CouponStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'active' | 'expired'>('all');
  const [couponForm, setCouponForm] = useState<CouponFormData>({
    code: '',
    type: 'fixed',
    value: '',
    description: '',
    maxUses: '',
    expiresAt: '',
    salePrice: '',
    creditAmount: '',
    isActive: true
  });

  // Dados mock para desenvolvimento
  const mockCoupons: Coupon[] = [
    {
      id: '1',
      code: 'PROMO50',
      type: 'fixed',
      value: 50,
      description: 'Crédito promocional de $50',
      maxUses: 1000,
      usedCount: 245,
      isActive: true,
      createdAt: '2024-01-15T10:00:00Z',
      expiresAt: '2024-06-15T23:59:59Z',
      salePrice: 45,
      creditAmount: 50,
      purchaseCount: 890,
      totalRevenue: 40050
    },
    {
      id: '2',
      code: 'MEGA100',
      type: 'fixed',
      value: 100,
      description: 'Crédito promocional de $100',
      maxUses: 500,
      usedCount: 156,
      isActive: true,
      createdAt: '2024-01-20T10:00:00Z',
      expiresAt: '2024-07-20T23:59:59Z',
      salePrice: 85,
      creditAmount: 100,
      purchaseCount: 423,
      totalRevenue: 35955
    },
    {
      id: '3',
      code: 'STARTER25',
      type: 'fixed',
      value: 25,
      description: 'Crédito inicial de $25',
      maxUses: 2000,
      usedCount: 1245,
      isActive: true,
      createdAt: '2024-01-10T10:00:00Z',
      expiresAt: null,
      salePrice: 22,
      creditAmount: 25,
      purchaseCount: 1567,
      totalRevenue: 34474
    }
  ];

  const mockStats: CouponStats = {
    totalCoupons: 3,
    activeCoupons: 3,
    totalPurchases: 2880,
    totalRevenue: 110479,
    averageUseRate: 68.5,
    topSellingCoupon: 'STARTER25',
    monthlyGrowth: 15.2
  };

  useEffect(() => {
    loadCouponsData();
  }, []);

  const loadCouponsData = async () => {
    try {
      setLoading(true);
      // Simulação de carregamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCoupons(mockCoupons);
      setStats(mockStats);
    } catch (error) {
      console.error('Erro ao carregar cupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = () => {
    setEditingCoupon(null);
    setCouponForm({
      code: '',
      type: 'fixed',
      value: '',
      description: '',
      maxUses: '',
      expiresAt: '',
      salePrice: '',
      creditAmount: '',
      isActive: true
    });
    setShowCreateModal(true);
  };

  const handleEditCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setCouponForm({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value.toString(),
      description: coupon.description,
      maxUses: coupon.maxUses.toString(),
      expiresAt: coupon.expiresAt ? coupon.expiresAt.split('T')[0] : '',
      salePrice: coupon.salePrice.toString(),
      creditAmount: coupon.creditAmount.toString(),
      isActive: coupon.isActive
    });
    setShowCreateModal(true);
  };

  const handleSaveCoupon = () => {
    // Validação básica
    if (!couponForm.code || !couponForm.description || !couponForm.value || !couponForm.salePrice || !couponForm.creditAmount) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const newCoupon: Coupon = {
      id: editingCoupon ? editingCoupon.id : Date.now().toString(),
      code: couponForm.code.toUpperCase(),
      type: couponForm.type,
      value: parseFloat(couponForm.value),
      description: couponForm.description,
      maxUses: parseInt(couponForm.maxUses) || 1000,
      usedCount: editingCoupon ? editingCoupon.usedCount : 0,
      isActive: couponForm.isActive,
      createdAt: editingCoupon ? editingCoupon.createdAt : new Date().toISOString(),
      expiresAt: couponForm.expiresAt ? new Date(couponForm.expiresAt).toISOString() : null,
      salePrice: parseFloat(couponForm.salePrice),
      creditAmount: parseFloat(couponForm.creditAmount),
      purchaseCount: editingCoupon ? editingCoupon.purchaseCount : 0,
      totalRevenue: editingCoupon ? editingCoupon.totalRevenue : 0
    };

    if (editingCoupon) {
      // Editar cupom existente
      setCoupons(prev => prev.map(c => c.id === editingCoupon.id ? newCoupon : c));
    } else {
      // Criar novo cupom
      setCoupons(prev => [...prev, newCoupon]);
    }

    setShowCreateModal(false);
    setEditingCoupon(null);
  };

  const generateRandomCode = () => {
    const prefix = 'PROMO';
    const suffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    setCouponForm(prev => ({ ...prev, code: `${prefix}${suffix}` }));
  };

  const handleDeleteCoupon = async (couponId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este cupom?')) {
      setCoupons(prev => prev.filter(c => c.id !== couponId));
    }
  };

  const handleToggleStatus = async (couponId: string) => {
    setCoupons(prev => prev.map(c => 
      c.id === couponId ? { ...c, isActive: !c.isActive } : c
    ));
  };

  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coupon.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'active' && coupon.isActive) ||
                         (filterType === 'expired' && !coupon.isActive);
    
    return matchesSearch && matchesFilter;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getUsagePercentage = (used: number, max: number) => {
    return Math.round((used / max) * 100);
  };

  if (loading) {
    return (
      <AdminLayout title="Cupons Promocionais - CoinBitClub Admin">
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <p className="text-gray-300">
              {language === 'pt' ? 'Carregando cupons promocionais...' : 'Loading promotional coupons...'}
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Cupons Promocionais - CoinBitClub Admin">
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900/30 via-blue-900/30 to-purple-900/30 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-3">
                  <FiGift className="text-purple-400" />
                  {language === 'pt' ? 'Cupons Promocionais' : 'Promotional Coupons'}
                </h1>
                <p className="text-gray-400 mt-1">
                  {language === 'pt' ? 'Gerencie cupons de crédito promocional para venda' : 'Manage promotional credit coupons for sale'}
                </p>
              </div>

              <button
                onClick={handleCreateCoupon}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 text-purple-400 rounded-lg transition-all"
              >
                <FiPlus className="w-4 h-4" />
                <span className="text-sm">{language === 'pt' ? 'Novo Cupom' : 'New Coupon'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6 space-y-6">

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 backdrop-blur-md rounded-xl p-6 border border-blue-500/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <FiTag className="text-blue-400 text-xl" />
                <h3 className="text-white font-semibold">Total de Cupons</h3>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{stats.totalCoupons}</div>
              <div className="text-sm text-gray-400">Cupons ativos</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 backdrop-blur-md rounded-xl p-6 border border-green-500/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <FiShoppingCart className="text-green-400 text-xl" />
                <h3 className="text-white font-semibold">Vendas Totais</h3>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{stats.totalPurchases.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Cupons vendidos</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-md rounded-xl p-6 border border-purple-500/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <FiDollarSign className="text-purple-400 text-xl" />
                <h3 className="text-white font-semibold">Receita Total</h3>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{formatCurrency(stats.totalRevenue)}</div>
              <div className="text-sm text-gray-400">Valor arrecadado</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-orange-900/50 to-yellow-900/50 backdrop-blur-md rounded-xl p-6 border border-orange-500/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <FiPercent className="text-orange-400 text-xl" />
                <h3 className="text-white font-semibold">Taxa de Uso</h3>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{stats.averageUseRate}%</div>
              <div className="text-sm text-gray-400">Média de utilização</div>
            </motion.div>
          </div>
        )}

        {/* Filtros e Busca */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-md rounded-xl p-6 border border-purple-500/20"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar por código ou descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50"
                />
              </div>
              <div className="flex items-center gap-2">
                <FiFilter className="text-gray-400 w-4 h-4" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="bg-gray-800/50 border border-gray-600/50 rounded-lg text-white px-3 py-2 focus:outline-none focus:border-purple-500/50"
                >
                  <option value="all">Todos</option>
                  <option value="active">Ativos</option>
                  <option value="expired">Expirados</option>
                </select>
              </div>
            </div>
            <button
              onClick={loadCouponsData}
              className="flex items-center gap-2 p-2 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50 rounded-lg text-gray-400 hover:text-white transition-all"
            >
              <FiRefreshCw className="w-4 h-4" />
              <span>Atualizar</span>
            </button>
          </div>
        </motion.div>

        {/* Lista de Cupons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-md rounded-xl border border-purple-500/20 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-700/50">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <FiGift className="text-purple-400" />
              Cupons Promocionais ({filteredCoupons.length})
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50 border-b border-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Cupom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Preço / Crédito
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Vendas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Uso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Receita
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredCoupons.map((coupon, index) => (
                    <motion.tr
                      key={coupon.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b border-gray-700/30 hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-white font-mono bg-purple-500/20 px-2 py-1 rounded border border-purple-500/30">
                              {coupon.code}
                            </span>
                            <FiGift className="text-purple-400" size={16} />
                          </div>
                          <div className="text-sm text-gray-400 mt-1">
                            {coupon.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="font-medium text-white">
                            Venda: {formatCurrency(coupon.salePrice)}
                          </div>
                          <div className="text-green-400">
                            Crédito: {formatCurrency(coupon.creditAmount)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="font-medium text-white">
                            {coupon.purchaseCount.toLocaleString()}
                          </div>
                          <div className="text-gray-400">
                            de {coupon.maxUses.toLocaleString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="font-medium text-white">
                            {coupon.usedCount.toLocaleString()}
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                              style={{ width: `${getUsagePercentage(coupon.usedCount, coupon.purchaseCount)}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {getUsagePercentage(coupon.usedCount, coupon.purchaseCount)}% usado
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          {formatCurrency(coupon.totalRevenue)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          coupon.isActive 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {coupon.isActive ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditCoupon(coupon)}
                            className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-400 hover:text-blue-300 transition-all"
                            title="Editar"
                          >
                            <FiEdit3 size={16} />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(coupon.id)}
                            className={`p-2 rounded-lg transition-all ${
                              coupon.isActive 
                                ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300' 
                                : 'bg-green-500/20 hover:bg-green-500/30 text-green-400 hover:text-green-300'
                            }`}
                            title={coupon.isActive ? 'Desativar' : 'Ativar'}
                          >
                            {coupon.isActive ? <FiTrash2 size={16} /> : <FiRefreshCw size={16} />}
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

        {/* Modal de Criação/Edição de Cupom */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-purple-500/20"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  {editingCoupon ? 'Editar Cupom' : 'Novo Cupom Promocional'}
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-all"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Código do Cupom */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Código do Cupom *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponForm.code}
                      onChange={(e) => setCouponForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="PROMO50"
                      maxLength={20}
                    />
                    <button
                      type="button"
                      onClick={generateRandomCode}
                      className="px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 text-purple-400 rounded-lg transition-all"
                      title="Gerar código aleatório"
                    >
                      <FiRefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Tipo de Desconto */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Tipo de Cupom
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="type"
                          value="fixed"
                          checked={couponForm.type === 'fixed'}
                          onChange={(e) => setCouponForm(prev => ({ ...prev, type: e.target.value as 'fixed' }))}
                          className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-white">Valor Fixo (R$)</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="type"
                          value="percentage"
                          checked={couponForm.type === 'percentage'}
                          onChange={(e) => setCouponForm(prev => ({ ...prev, type: e.target.value as 'percentage' }))}
                          className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-white">Percentual (%)</span>
                      </label>
                    </div>
                  </div>

                  {/* Valor do Desconto */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Valor do Desconto *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        value={couponForm.value}
                        onChange={(e) => setCouponForm(prev => ({ ...prev, value: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder={couponForm.type === 'percentage' ? '10' : '50.00'}
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        {couponForm.type === 'percentage' ? '%' : '$'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Descrição */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Descrição *
                  </label>
                  <textarea
                    value={couponForm.description}
                    onChange={(e) => setCouponForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    rows={3}
                    placeholder="Crédito promocional de $50 para novos usuários"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Preço de Venda */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Preço de Venda *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        value={couponForm.salePrice}
                        onChange={(e) => setCouponForm(prev => ({ ...prev, salePrice: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="45.00"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Valor que o cliente pagará pelo cupom</p>
                  </div>

                  {/* Valor do Crédito */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Valor do Crédito *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        value={couponForm.creditAmount}
                        onChange={(e) => setCouponForm(prev => ({ ...prev, creditAmount: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="50.00"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Crédito que será dado ao usuário</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Limite de Usos */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Limite de Usos
                    </label>
                    <input
                      type="number"
                      value={couponForm.maxUses}
                      onChange={(e) => setCouponForm(prev => ({ ...prev, maxUses: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="1000"
                      min="1"
                    />
                    <p className="text-xs text-gray-400 mt-1">Quantidade máxima de vendas</p>
                  </div>

                  {/* Data de Expiração */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Data de Expiração
                    </label>
                    <input
                      type="date"
                      value={couponForm.expiresAt}
                      onChange={(e) => setCouponForm(prev => ({ ...prev, expiresAt: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      min={new Date().toISOString().split('T')[0]}
                    />
                    <p className="text-xs text-gray-400 mt-1">Deixe vazio para sem expiração</p>
                  </div>
                </div>

                {/* Status Ativo */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={couponForm.isActive}
                    onChange={(e) => setCouponForm(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="isActive" className="ml-2 text-white">
                    Cupom ativo (disponível para venda)
                  </label>
                </div>

                {/* Preview do Cupom */}
                {couponForm.code && couponForm.description && (
                  <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Preview do Cupom:</h4>
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-500/20 px-3 py-2 rounded border border-purple-500/30">
                        <span className="font-mono text-white">{couponForm.code}</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-white text-sm">{couponForm.description}</div>
                        <div className="text-gray-400 text-xs">
                          Venda: ${couponForm.salePrice} → Crédito: ${couponForm.creditAmount}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-6 mt-6 border-t border-gray-700">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveCoupon}
                  className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-all"
                >
                  {editingCoupon ? 'Atualizar Cupom' : 'Criar Cupom'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
    </AdminLayout>
  );
};

export default AdminCoupons;
