import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../hooks/useLanguage';
import AffiliateLayout from '../../src/components/AffiliateLayout';
import { 
  FiLink, 
  FiCopy,
  FiEdit,
  FiTrash2,
  FiPlus,
  FiExternalLink,
  FiBarChart,
  FiEye,
  FiMousePointer,
  FiUserPlus,
  FiShare2
} from 'react-icons/fi';

interface AffiliateLink {
  id: string;
  name: string;
  url: string;
  shortCode: string;
  clicks: number;
  conversions: number;
  conversionRate: number;
  commissions: number;
  createdAt: Date;
  isActive: boolean;
  description?: string;
  customParams?: string;
}

const AffiliateLinks: React.FC = () => {
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [links, setLinks] = useState<AffiliateLink[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingLink, setEditingLink] = useState<AffiliateLink | null>(null);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [newLink, setNewLink] = useState({
    name: '',
    description: '',
    customParams: ''
  });

  const baseAffiliateCode = 'CBB-AFC-2024-USER';

  useEffect(() => {
    setMounted(true);
    
    // Mock data for affiliate links
    const mockLinks: AffiliateLink[] = [
      {
        id: '1',
        name: 'Link Principal',
        url: `https://coinbitclub.com/register?ref=${baseAffiliateCode}`,
        shortCode: baseAffiliateCode,
        clicks: 234,
        conversions: 47,
        conversionRate: 20.1,
        commissions: 2847.50,
        createdAt: new Date('2024-01-15'),
        isActive: true,
        description: 'Link principal de indicação para novos usuários'
      },
      {
        id: '2',
        name: 'Promoção Black Friday',
        url: `https://coinbitclub.com/register?ref=${baseAffiliateCode}&promo=blackfriday`,
        shortCode: `${baseAffiliateCode}-BF`,
        clicks: 89,
        conversions: 23,
        conversionRate: 25.8,
        commissions: 1345.20,
        createdAt: new Date('2024-11-01'),
        isActive: true,
        description: 'Link especial para promoção de Black Friday',
        customParams: 'promo=blackfriday'
      },
      {
        id: '3',
        name: 'YouTube - Vídeo Tutorial',
        url: `https://coinbitclub.com/register?ref=${baseAffiliateCode}&source=youtube`,
        shortCode: `${baseAffiliateCode}-YT`,
        clicks: 156,
        conversions: 18,
        conversionRate: 11.5,
        commissions: 976.40,
        createdAt: new Date('2024-10-20'),
        isActive: true,
        description: 'Link específico para campanhas no YouTube',
        customParams: 'source=youtube'
      },
      {
        id: '4',
        name: 'Instagram Stories',
        url: `https://coinbitclub.com/register?ref=${baseAffiliateCode}&source=instagram`,
        shortCode: `${baseAffiliateCode}-IG`,
        clicks: 67,
        conversions: 8,
        conversionRate: 11.9,
        commissions: 432.10,
        createdAt: new Date('2024-11-10'),
        isActive: false,
        description: 'Link para stories do Instagram (pausado)',
        customParams: 'source=instagram'
      }
    ];

    setLinks(mockLinks);
  }, []);

  const copyToClipboard = async (text: string, linkId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(linkId);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleCreateLink = () => {
    if (!newLink.name.trim()) return;

    const customParams = newLink.customParams ? `&${newLink.customParams}` : '';
    const shortCode = `${baseAffiliateCode}-${Date.now().toString().slice(-4)}`;
    
    const link: AffiliateLink = {
      id: Date.now().toString(),
      name: newLink.name,
      url: `https://coinbitclub.com/register?ref=${baseAffiliateCode}${customParams}`,
      shortCode,
      clicks: 0,
      conversions: 0,
      conversionRate: 0,
      commissions: 0,
      createdAt: new Date(),
      isActive: true,
      description: newLink.description || undefined,
      customParams: newLink.customParams || undefined
    };

    setLinks(prev => [...prev, link]);
    setNewLink({ name: '', description: '', customParams: '' });
    setShowCreateModal(false);
  };

  const handleToggleLink = (id: string) => {
    setLinks(prev => 
      prev.map(link => 
        link.id === id ? { ...link, isActive: !link.isActive } : link
      )
    );
  };

  const handleDeleteLink = (id: string) => {
    setLinks(prev => prev.filter(link => link.id !== id));
  };

  const totalStats = links.reduce((acc, link) => ({
    clicks: acc.clicks + link.clicks,
    conversions: acc.conversions + link.conversions,
    commissions: acc.commissions + link.commissions
  }), { clicks: 0, conversions: 0, commissions: 0 });

  const overallConversionRate = totalStats.clicks > 0 ? (totalStats.conversions / totalStats.clicks) * 100 : 0;

  if (!mounted) {
    return (
      <AffiliateLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-400 mb-4 mx-auto"></div>
            <h2 className="text-2xl font-bold text-white mb-2">CoinBitClub Affiliate</h2>
            <p className="text-gray-400">{language === 'pt' ? 'Carregando...' : 'Loading...'}</p>
          </div>
        </div>
      </AffiliateLayout>
    );
  }

  return (
    <AffiliateLayout>
      <div className="p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {language === 'pt' ? 'Meus Links' : 'My Links'}
            </h1>
            <p className="text-gray-400">
              {language === 'pt' ? 'Gerencie seus links de afiliado e acompanhe o desempenho' : 'Manage your affiliate links and track performance'}
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-lg hover:from-emerald-600 hover:to-green-700 transition-all"
          >
            <FiPlus className="w-5 h-5" />
            {language === 'pt' ? 'Novo Link' : 'New Link'}
          </button>
        </motion.div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-900/40 to-blue-800/30 backdrop-blur-sm rounded-xl border border-blue-500/30 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <FiLink className="w-8 h-8 text-blue-400" />
              <div>
                <h3 className="text-lg font-bold text-blue-400">
                  {language === 'pt' ? 'Links Ativos' : 'Active Links'}
                </h3>
              </div>
            </div>
            <div className="text-3xl font-bold text-white">{links.filter(l => l.isActive).length}</div>
            <div className="text-blue-400 text-sm">
              {links.length} {language === 'pt' ? 'total' : 'total'}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-900/40 to-purple-800/30 backdrop-blur-sm rounded-xl border border-purple-500/30 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <FiMousePointer className="w-8 h-8 text-purple-400" />
              <div>
                <h3 className="text-lg font-bold text-purple-400">
                  {language === 'pt' ? 'Total Cliques' : 'Total Clicks'}
                </h3>
              </div>
            </div>
            <div className="text-3xl font-bold text-white">{totalStats.clicks.toLocaleString()}</div>
            <div className="text-purple-400 text-sm">
              {language === 'pt' ? 'Todos os links' : 'All links'}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-green-900/40 to-green-800/30 backdrop-blur-sm rounded-xl border border-green-500/30 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <FiUserPlus className="w-8 h-8 text-green-400" />
              <div>
                <h3 className="text-lg font-bold text-green-400">
                  {language === 'pt' ? 'Conversões' : 'Conversions'}
                </h3>
              </div>
            </div>
            <div className="text-3xl font-bold text-white">{totalStats.conversions}</div>
            <div className="text-green-400 text-sm">
              {overallConversionRate.toFixed(1)}% {language === 'pt' ? 'taxa' : 'rate'}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-emerald-900/40 to-emerald-800/30 backdrop-blur-sm rounded-xl border border-emerald-500/30 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <FiBarChart className="w-8 h-8 text-emerald-400" />
              <div>
                <h3 className="text-lg font-bold text-emerald-400">
                  {language === 'pt' ? 'Comissões' : 'Commissions'}
                </h3>
              </div>
            </div>
            <div className="text-3xl font-bold text-white">${totalStats.commissions.toFixed(2)}</div>
            <div className="text-emerald-400 text-sm">
              {language === 'pt' ? 'Ganhos totais' : 'Total earnings'}
            </div>
          </motion.div>
        </div>

        {/* Links List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-slate-900/40 to-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-500/30 p-6"
        >
          <h2 className="text-xl font-bold text-white mb-6">
            {language === 'pt' ? 'Seus Links de Afiliado' : 'Your Affiliate Links'}
          </h2>
          
          <div className="space-y-4">
            {links.map((link, index) => (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 bg-black/20 rounded-lg border transition-all ${
                  link.isActive 
                    ? 'border-gray-600/30 hover:border-emerald-400/30' 
                    : 'border-red-500/30 opacity-60'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-white">{link.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        link.isActive 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {link.isActive ? (language === 'pt' ? 'Ativo' : 'Active') : (language === 'pt' ? 'Pausado' : 'Paused')}
                      </span>
                    </div>
                    
                    {link.description && (
                      <p className="text-gray-400 text-sm mb-3">{link.description}</p>
                    )}
                    
                    <div className="flex items-center gap-2 mb-3">
                      <code className="bg-gray-700/50 px-3 py-1 rounded text-emerald-400 text-sm flex-1 truncate">
                        {link.url}
                      </code>
                      <button
                        onClick={() => copyToClipboard(link.url, link.id)}
                        className={`px-3 py-1 rounded transition-all ${
                          copySuccess === link.id
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-gray-600/50 text-gray-400 hover:text-white'
                        }`}
                      >
                        <FiCopy className="w-4 h-4" />
                      </button>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-all"
                      >
                        <FiExternalLink className="w-4 h-4" />
                      </a>
                    </div>

                    <div className="text-xs text-gray-500">
                      {language === 'pt' ? 'Criado em:' : 'Created:'} {link.createdAt.toLocaleDateString()}
                      {link.customParams && (
                        <span className="ml-4">
                          {language === 'pt' ? 'Parâmetros:' : 'Params:'} {link.customParams}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 lg:w-96">
                    <div className="flex flex-1 justify-between sm:justify-around text-center">
                      <div>
                        <div className="text-lg font-bold text-white">{link.clicks}</div>
                        <div className="text-xs text-gray-400">{language === 'pt' ? 'Cliques' : 'Clicks'}</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-emerald-400">{link.conversions}</div>
                        <div className="text-xs text-gray-400">{language === 'pt' ? 'Conversões' : 'Conversions'}</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-blue-400">{link.conversionRate.toFixed(1)}%</div>
                        <div className="text-xs text-gray-400">{language === 'pt' ? 'Taxa' : 'Rate'}</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-purple-400">${link.commissions.toFixed(2)}</div>
                        <div className="text-xs text-gray-400">{language === 'pt' ? 'Comissões' : 'Commissions'}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleLink(link.id)}
                        className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                          link.isActive
                            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                            : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                        }`}
                      >
                        {link.isActive ? (language === 'pt' ? 'Pausar' : 'Pause') : (language === 'pt' ? 'Ativar' : 'Activate')}
                      </button>
                      <button
                        onClick={() => setEditingLink(link)}
                        className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-all"
                      >
                        <FiEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteLink(link.id)}
                        className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-all"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Create Link Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-500/30 p-6 w-full max-w-md"
            >
              <h3 className="text-xl font-bold text-white mb-6">
                {language === 'pt' ? 'Criar Novo Link' : 'Create New Link'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {language === 'pt' ? 'Nome do Link' : 'Link Name'}
                  </label>
                  <input
                    type="text"
                    value={newLink.name}
                    onChange={(e) => setNewLink(prev => ({ ...prev, name: e.target.value }))}
                    placeholder={language === 'pt' ? 'Ex: Instagram Stories' : 'Ex: Instagram Stories'}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {language === 'pt' ? 'Descrição (Opcional)' : 'Description (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={newLink.description}
                    onChange={(e) => setNewLink(prev => ({ ...prev, description: e.target.value }))}
                    placeholder={language === 'pt' ? 'Descreva o uso deste link' : 'Describe the use of this link'}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {language === 'pt' ? 'Parâmetros Customizados (Opcional)' : 'Custom Parameters (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={newLink.customParams}
                    onChange={(e) => setNewLink(prev => ({ ...prev, customParams: e.target.value }))}
                    placeholder="source=instagram&campaign=stories"
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {language === 'pt' 
                      ? 'Ex: source=youtube, campaign=promo2024' 
                      : 'Ex: source=youtube, campaign=promo2024'
                    }
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                >
                  {language === 'pt' ? 'Cancelar' : 'Cancel'}
                </button>
                <button
                  onClick={handleCreateLink}
                  disabled={!newLink.name.trim()}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {language === 'pt' ? 'Criar Link' : 'Create Link'}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Share Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-gradient-to-br from-blue-900/40 to-blue-800/30 backdrop-blur-sm rounded-xl border border-blue-500/30 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <FiShare2 className="w-6 h-6 text-blue-400" />
            <h3 className="text-lg font-bold text-blue-400">
              {language === 'pt' ? 'Dicas para Compartilhar' : 'Sharing Tips'}
            </h3>
          </div>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              {language === 'pt' 
                ? 'Use parâmetros customizados para rastrear diferentes canais (YouTube, Instagram, etc.)'
                : 'Use custom parameters to track different channels (YouTube, Instagram, etc.)'
              }
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              {language === 'pt' 
                ? 'Crie links específicos para campanhas promocionais'
                : 'Create specific links for promotional campaigns'
              }
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              {language === 'pt' 
                ? 'Monitore regularmente o desempenho e pause links com baixa conversão'
                : 'Monitor performance regularly and pause links with low conversion'
              }
            </li>
          </ul>
        </motion.div>
      </div>
    </AffiliateLayout>
  );
};

export default AffiliateLinks;
