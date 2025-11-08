import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiGift, 
  FiPlus, 
  FiEdit3, 
  FiTrash2, 
  FiCopy, 
  FiCheck, 
  FiX, 
  FiCalendar, 
  FiDollarSign, 
  FiUsers, 
  FiFilter,
  FiDownload,
  FiSearch,
  FiRefreshCw,
  FiEye,
  FiBarChart,
  FiTrendingUp,
  FiPercent,
  FiActivity
} from 'react-icons/fi';
import { useLanguage } from '../../hooks/useLanguage';
import AdminLayout from '../../components/AdminLayout';

interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  description: string;
  maxUses: number;
  currentUses: number;
  expiryDate: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
  usedBy?: string[];
}

interface CouponStats {
  totalCoupons: number;
  activeCoupons: number;
  expiredCoupons: number;
  totalRedeemed: number;
  totalValue: number;
  recentActivity: Array<{
    id: string;
    action: 'created' | 'used' | 'expired';
    couponCode: string;
    user?: string;
    timestamp: string;
  }>;
}

const AdminCoupons: NextPage = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [stats, setStats] = useState<CouponStats | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'expired' | 'depleted'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  // Mock data - em produção viria da API
  const mockCoupons: Coupon[] = [
    {
      id: '1',
      code: 'WELCOME50',
      type: 'percentage',
      value: 50,
      description: 'Desconto de boas-vindas para novos usuários',
      maxUses: 100,
      currentUses: 23,
      expiryDate: '2025-12-31',
      isActive: true,
      createdAt: '2025-08-01',
      createdBy: 'admin@coinbitclub.com'
    },
    {
      id: '2',
      code: 'VIP2025',
      type: 'fixed',
      value: 100,
      description: 'Crédito especial para membros VIP',
      maxUses: 50,
      currentUses: 12,
      expiryDate: '2025-09-30',
      isActive: true,
      createdAt: '2025-08-10',
      createdBy: 'admin@coinbitclub.com'
    },
    {
      id: '3',
      code: 'EXPIRED20',
      type: 'percentage',
      value: 20,
      description: 'Cupom promocional expirado',
      maxUses: 200,
      currentUses: 156,
      expiryDate: '2025-07-31',
      isActive: false,
      createdAt: '2025-07-01',
      createdBy: 'admin@coinbitclub.com'
    }
  ];

  const mockStats: CouponStats = {
    totalCoupons: 45,
    activeCoupons: 12,
    expiredCoupons: 8,
    totalRedeemed: 234,
    totalValue: 15420.50,
    recentActivity: [
      {
        id: '1',
        action: 'used',
        couponCode: 'WELCOME50',
        user: 'user123@example.com',
        timestamp: '2025-08-16T10:30:00Z'
      },
      {
        id: '2',
        action: 'created',
        couponCode: 'NEWUSER25',
        timestamp: '2025-08-16T09:15:00Z'
      },
      {
        id: '3',
        action: 'used',
        couponCode: 'VIP2025',
        user: 'vip@example.com',
        timestamp: '2025-08-16T08:45:00Z'
      }
    ]
  };

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setCoupons(mockCoupons);
      setStats(mockStats);
      setLoading(false);
    }, 1000);

    // Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'admin_coupons_view', {
        event_category: 'admin_navigation',
        page_title: 'Admin Coupons Management'
      });
    }
  }, []);

  const handleCreateCoupon = (formData: any) => {
    const newCoupon: Coupon = {
      id: Date.now().toString(),
      code: formData.code,
      type: formData.type,
      value: parseFloat(formData.value),
      description: formData.description,
      maxUses: parseInt(formData.maxUses),
      currentUses: 0,
      expiryDate: formData.expiryDate,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: 'admin@coinbitclub.com'
    };

    setCoupons(prev => [newCoupon, ...prev]);
    setShowCreateModal(false);

    if (typeof gtag !== 'undefined') {
      gtag('event', 'coupon_created', {
        event_category: 'admin_action',
        coupon_type: formData.type,
        coupon_value: formData.value
      });
    }
  };

  const handleDeleteCoupon = (couponId: string) => {
    setCoupons(prev => prev.filter(c => c.id !== couponId));
    
    if (typeof gtag !== 'undefined') {
      gtag('event', 'coupon_deleted', {
        event_category: 'admin_action',
        coupon_id: couponId
      });
    }
  };

  const toggleCouponStatus = (couponId: string) => {
    setCoupons(prev => 
      prev.map(c => 
        c.id === couponId ? { ...c, isActive: !c.isActive } : c
      )
    );
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coupon.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && coupon.isActive && new Date(coupon.expiryDate) > new Date()) ||
                         (filterStatus === 'expired' && new Date(coupon.expiryDate) <= new Date()) ||
                         (filterStatus === 'depleted' && coupon.currentUses >= coupon.maxUses);
    
    return matchesSearch && matchesFilter;
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

  const getStatusColor = (coupon: Coupon) => {
    if (!coupon.isActive) return 'text-gray-400';
    if (new Date(coupon.expiryDate) <= new Date()) return 'text-red-400';
    if (coupon.currentUses >= coupon.maxUses) return 'text-orange-400';
    return 'text-green-400';
  };

  const getStatusText = (coupon: Coupon) => {
    if (!coupon.isActive) return 'Inativo';
    if (new Date(coupon.expiryDate) <= new Date()) return 'Expirado';
    if (coupon.currentUses >= coupon.maxUses) return 'Esgotado';
    return 'Ativo';
  };

  if (loading) {
    return (
      <AdminLayout title="Cupons de Crédito - CoinBitClub Admin">
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <p className="text-gray-300">
              {language === 'pt' ? 'Carregando cupons...' : 'Loading coupons...'}
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Cupons de Crédito - CoinBitClub Admin">
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900/30 via-blue-900/30 to-purple-900/30 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-3">
                  <FiGift className="text-purple-400" />
                  {language === 'pt' ? 'Gestão de Cupons' : 'Coupon Management'}
                </h1>
                <p className="text-gray-400 mt-1">
                  {language === 'pt' ? 'Criar, gerenciar e monitorar cupons de desconto' : 'Create, manage and monitor discount coupons'}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowBulkModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-400 rounded-lg transition-all"
                >
                  <FiDownload className="w-4 h-4" />
                  <span className="text-sm">{language === 'pt' ? 'Lote' : 'Bulk'}</span>
                </button>

                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 text-purple-400 rounded-lg transition-all"
                >
                  <FiPlus className="w-4 h-4" />
                  <span className="text-sm">{language === 'pt' ? 'Novo Cupom' : 'New Coupon'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-md rounded-xl p-6 border border-purple-500/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <FiGift className="text-purple-400 text-xl" />
                <h3 className="text-white font-semibold">Total</h3>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{stats?.totalCoupons}</div>
              <div className="text-sm text-gray-400">Cupons criados</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-md rounded-xl p-6 border border-purple-500/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <FiCheck className="text-green-400 text-xl" />
                <h3 className="text-white font-semibold">Ativos</h3>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{stats?.activeCoupons}</div>
              <div className="text-sm text-gray-400">Em uso</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-md rounded-xl p-6 border border-purple-500/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <FiUsers className="text-blue-400 text-xl" />
                <h3 className="text-white font-semibold">Utilizados</h3>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{stats?.totalRedeemed}</div>
              <div className="text-sm text-gray-400">Resgates</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-md rounded-xl p-6 border border-purple-500/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <FiDollarSign className="text-green-400 text-xl" />
                <h3 className="text-white font-semibold">Valor Total</h3>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{formatCurrency(stats?.totalValue || 0)}</div>
              <div className="text-sm text-gray-400">Em cupons</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-md rounded-xl p-6 border border-purple-500/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <FiTrendingUp className="text-yellow-400 text-xl" />
                <h3 className="text-white font-semibold">Taxa de Uso</h3>
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                {stats ? Math.round((stats.totalRedeemed / stats.totalCoupons) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-400">Efetividade</div>
            </motion.div>
          </div>

          {/* Filters and Search */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-md rounded-xl p-6 border border-purple-500/20"
          >
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder={language === 'pt' ? 'Buscar cupons...' : 'Search coupons...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <FiFilter className="text-gray-400 w-4 h-4" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="bg-gray-800/50 border border-gray-600/50 rounded-lg text-white px-3 py-2 focus:outline-none focus:border-purple-500/50"
                  >
                    <option value="all">Todos</option>
                    <option value="active">Ativos</option>
                    <option value="expired">Expirados</option>
                    <option value="depleted">Esgotados</option>
                  </select>
                </div>
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

          {/* Coupons List */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-md rounded-xl border border-purple-500/20 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-700/50">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <FiBarChart className="text-purple-400" />
                Lista de Cupons ({filteredCoupons.length})
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/50 border-b border-gray-700/50">
                  <tr>
                    <th className="text-left p-4 text-gray-300 font-medium">Código</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Tipo</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Valor</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Uso</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Validade</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Status</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Ações</th>
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
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div>
                              <div className="font-mono text-white font-semibold">{coupon.code}</div>
                              <div className="text-sm text-gray-400 truncate max-w-xs">{coupon.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            coupon.type === 'percentage' 
                              ? 'bg-blue-500/20 text-blue-400' 
                              : 'bg-green-500/20 text-green-400'
                          }`}>
                            {coupon.type === 'percentage' ? <FiPercent className="w-3 h-3" /> : <FiDollarSign className="w-3 h-3" />}
                            {coupon.type === 'percentage' ? 'Percentual' : 'Valor Fixo'}
                          </span>
                        </td>
                        <td className="p-4 text-white font-medium">
                          {coupon.type === 'percentage' ? `${coupon.value}%` : formatCurrency(coupon.value)}
                        </td>
                        <td className="p-4">
                          <div className="text-white">{coupon.currentUses} / {coupon.maxUses}</div>
                          <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                            <div 
                              className={`h-2 rounded-full transition-all ${
                                (coupon.currentUses / coupon.maxUses) >= 0.8 ? 'bg-red-400' :
                                (coupon.currentUses / coupon.maxUses) >= 0.6 ? 'bg-yellow-400' : 'bg-green-400'
                              }`}
                              style={{ width: `${(coupon.currentUses / coupon.maxUses) * 100}%` }}
                            ></div>
                          </div>
                        </td>
                        <td className="p-4 text-gray-300">{formatDate(coupon.expiryDate)}</td>
                        <td className="p-4">
                          <span className={`font-medium ${getStatusColor(coupon)}`}>
                            {getStatusText(coupon)}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => copyToClipboard(coupon.code)}
                              className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg text-gray-400 hover:text-white transition-all"
                              title="Copiar código"
                            >
                              {copiedCode === coupon.code ? <FiCheck className="w-4 h-4 text-green-400" /> : <FiCopy className="w-4 h-4" />}
                            </button>
                            
                            <button
                              onClick={() => setSelectedCoupon(coupon)}
                              className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-400 hover:text-blue-300 transition-all"
                              title="Ver detalhes"
                            >
                              <FiEye className="w-4 h-4" />
                            </button>
                            
                            <button
                              onClick={() => toggleCouponStatus(coupon.id)}
                              className={`p-2 rounded-lg transition-all ${
                                coupon.isActive 
                                  ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400' 
                                  : 'bg-green-500/20 hover:bg-green-500/30 text-green-400'
                              }`}
                              title={coupon.isActive ? 'Desativar' : 'Ativar'}
                            >
                              {coupon.isActive ? <FiX className="w-4 h-4" /> : <FiCheck className="w-4 h-4" />}
                            </button>
                            
                            <button
                              onClick={() => handleDeleteCoupon(coupon.id)}
                              className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 hover:text-red-300 transition-all"
                              title="Excluir"
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

          {/* Recent Activity */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-md rounded-xl p-6 border border-purple-500/20"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <FiActivity className="text-purple-400" />
              Atividade Recente
            </h3>

            <div className="space-y-3">
              {stats?.recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50"
                >
                  <div className={`w-2 h-2 rounded-full ${
                    activity.action === 'created' ? 'bg-green-400' :
                    activity.action === 'used' ? 'bg-blue-400' : 'bg-red-400'
                  }`}></div>
                  <div className="flex-1">
                    <div className="text-white font-medium">
                      {activity.action === 'created' && `Cupom ${activity.couponCode} criado`}
                      {activity.action === 'used' && `Cupom ${activity.couponCode} utilizado`}
                      {activity.action === 'expired' && `Cupom ${activity.couponCode} expirou`}
                    </div>
                    {activity.user && (
                      <div className="text-sm text-gray-400">por {activity.user}</div>
                    )}
                  </div>
                  <div className="text-sm text-gray-400">
                    {new Date(activity.timestamp).toLocaleTimeString('pt-BR')}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Create Coupon Modal */}
      <CreateCouponModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateCoupon}
        language={language}
      />

      {/* Bulk Creation Modal */}
      <BulkCouponModal 
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        language={language}
      />

      {/* Coupon Details Modal */}
      <CouponDetailsModal 
        coupon={selectedCoupon}
        onClose={() => setSelectedCoupon(null)}
        language={language}
      />
    </AdminLayout>
  );
};

// Modal Components
const CreateCouponModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  language: string;
}> = ({ isOpen, onClose, onSubmit, language }) => {
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: '',
    description: '',
    maxUses: '',
    expiryDate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      code: '',
      type: 'percentage',
      value: '',
      description: '',
      maxUses: '',
      expiryDate: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 w-full max-w-md border border-purple-500/20"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">
            {language === 'pt' ? 'Criar Novo Cupom' : 'Create New Coupon'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-all"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Código do Cupom
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
              placeholder="DESCONTO25"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tipo de Desconto
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="percentage">Percentual (%)</option>
              <option value="fixed">Valor Fixo ($)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Valor
            </label>
            <input
              type="number"
              value={formData.value}
              onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
              placeholder={formData.type === 'percentage' ? '25' : '100.00'}
              min="0"
              step={formData.type === 'percentage' ? '1' : '0.01'}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
              placeholder="Desconto promocional para novos usuários"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Máximo de Usos
            </label>
            <input
              type="number"
              value={formData.maxUses}
              onChange={(e) => setFormData(prev => ({ ...prev, maxUses: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
              placeholder="100"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Data de Expiração
            </label>
            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-all"
            >
              Criar Cupom
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const BulkCouponModal: React.FC<{
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
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 w-full max-w-lg border border-purple-500/20"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">
            {language === 'pt' ? 'Criação em Lote' : 'Bulk Creation'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-all"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center py-8">
          <FiDownload className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-white mb-2">
            Funcionalidade em Desenvolvimento
          </h4>
          <p className="text-gray-400 mb-6">
            A criação em lote de cupons será implementada em breve.
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-all"
          >
            Entendi
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const CouponDetailsModal: React.FC<{
  coupon: Coupon | null;
  onClose: () => void;
  language: string;
}> = ({ coupon, onClose, language }) => {
  if (!coupon) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 w-full max-w-lg border border-purple-500/20"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">
            Detalhes do Cupom
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-all"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Código</div>
            <div className="text-2xl font-mono font-bold text-white">{coupon.code}</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Tipo</div>
              <div className="text-white font-medium">
                {coupon.type === 'percentage' ? 'Percentual' : 'Valor Fixo'}
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Valor</div>
              <div className="text-white font-medium">
                {coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value}`}
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Descrição</div>
            <div className="text-white">{coupon.description}</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Uso Atual</div>
              <div className="text-white font-medium">
                {coupon.currentUses} / {coupon.maxUses}
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Expira em</div>
              <div className="text-white font-medium">
                {new Date(coupon.expiryDate).toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Criado por</div>
            <div className="text-white">{coupon.createdBy}</div>
            <div className="text-sm text-gray-400 mt-1">
              em {new Date(coupon.createdAt).toLocaleDateString('pt-BR')}
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

export default AdminCoupons;
