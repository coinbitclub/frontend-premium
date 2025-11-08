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
  FiFilter
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

const AdminCoupons: React.FC = () => {
  const { language } = useLanguage();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [stats, setStats] = useState<CouponStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'active' | 'expired'>('all');

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
    setShowCreateModal(true);
  };

  const handleEditCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setShowCreateModal(true);
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
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center space-x-2">
            <FiRefreshCw className="animate-spin text-blue-500" size={24} />
            <span className="text-gray-600">Carregando cupons...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Cupons Promocionais
            </h1>
            <p className="text-gray-600 mt-1">
              Gerencie cupons de crédito promocional para venda
            </p>
          </div>
          <button
            onClick={handleCreateCoupon}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <FiPlus size={20} />
            <span>Novo Cupom</span>
          </button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Cupons</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalCoupons}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FiTag className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Vendas Totais</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalPurchases.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FiShoppingCart className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Receita Total</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FiDollarSign className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taxa de Uso</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.averageUseRate}%</p>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FiPercent className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Filtros e Busca */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar por código ou descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos</option>
                <option value="active">Ativos</option>
                <option value="expired">Expirados</option>
              </select>
            </div>
            <button
              onClick={loadCouponsData}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <FiRefreshCw size={18} />
              <span>Atualizar</span>
            </button>
          </div>
        </div>

        {/* Lista de Cupons */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Cupons Promocionais ({filteredCoupons.length})
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cupom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preço / Crédito
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Receita
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCoupons.map((coupon) => (
                  <motion.tr
                    key={coupon.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
                            {coupon.code}
                          </span>
                          <FiGift className="text-purple-500" size={16} />
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {coupon.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          Venda: {formatCurrency(coupon.salePrice)}
                        </div>
                        <div className="text-green-600">
                          Crédito: {formatCurrency(coupon.creditAmount)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {coupon.purchaseCount.toLocaleString()}
                        </div>
                        <div className="text-gray-500">
                          de {coupon.maxUses.toLocaleString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {coupon.usedCount.toLocaleString()}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${getUsagePercentage(coupon.usedCount, coupon.purchaseCount)}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {getUsagePercentage(coupon.usedCount, coupon.purchaseCount)}% usado
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(coupon.totalRevenue)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        coupon.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {coupon.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditCoupon(coupon)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="Editar"
                        >
                          <FiEdit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(coupon.id)}
                          className={`transition-colors ${
                            coupon.isActive 
                              ? 'text-red-600 hover:text-red-900' 
                              : 'text-green-600 hover:text-green-900'
                          }`}
                          title={coupon.isActive ? 'Desativar' : 'Ativar'}
                        >
                          {coupon.isActive ? <FiTrash2 size={16} /> : <FiRefreshCw size={16} />}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal seria implementado aqui */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">
                {editingCoupon ? 'Editar Cupom' : 'Novo Cupom'}
              </h3>
              <p className="text-gray-600 mb-4">
                Modal de criação/edição seria implementado aqui
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCoupons;
