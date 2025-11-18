import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlay, 
  FiDownload, 
  FiFileText, 
  FiVideo, 
  FiSearch, 
  FiClock, 
  FiEye, 
  FiBookOpen,
  FiStar,
  FiTrendingUp,
  FiCheckCircle
} from 'react-icons/fi';
import { FaInfoCircle } from 'react-icons/fa';
import { useLanguage } from '../../hooks/useLanguage';
import UserLayout from '../../components/UserLayout';

const IS_DEV = process.env.NODE_ENV === 'development';

// Interfaces
interface TrainingMaterial {
  id: string;
  title: {
    pt: string;
    en: string;
  };
  description: {
    pt: string;
    en: string;
  };
  type: 'video' | 'pdf' | 'article';
  category: string;
  duration?: string;
  pages?: number;
  thumbnail: string;
  videoUrl?: string;
  pdfUrl?: string;
  downloadUrl?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  views: number;
  rating: number;
  isPremium: boolean;
  isCompleted?: boolean;
  releaseDate: string;
  instructor: string;
}

interface TrainingProgress {
  materialId: string;
  progress: number;
  completed: boolean;
  lastAccessDate: string;
  timeSpent: number;
}

// Mock data com vídeos reais organizados
const trainingMaterials: TrainingMaterial[] = [
  // Vídeo de Apresentação
  {
    id: 'apresentacao',
    title: {
      pt: 'Vídeo de Apresentação',
      en: 'Presentation Video'
    },
    description: {
      pt: 'Conheça a CoinBitClub e como nossa automação pode revolucionar seus investimentos.',
      en: 'Meet CoinBitClub and how our automation can revolutionize your investments.'
    },
    type: 'video',
    category: 'Apresentação',
    duration: '10 min',
    thumbnail: '/api/placeholder/400/225',
    videoUrl: 'https://www.youtube.com/embed/t39qPkOcUWU',
    level: 'beginner',
    tags: ['apresentação', 'introdução'],
    views: 0,
    rating: 5.0,
    isPremium: false,
    isCompleted: false,
    releaseDate: '2024-01-01',
    instructor: 'CoinBitClub'
  },
  
  // 1) Entendendo como o mercado trabalha
  {
    id: 'mercado-1',
    title: {
      pt: 'Entendendo como o mercado funciona',
      en: 'Understanding how the market works'
    },
    description: {
      pt: 'Aprenda os fundamentos de como o mercado financeiro opera e as oportunidades que oferece.',
      en: 'Learn the fundamentals of how the financial market operates and the opportunities it offers.'
    },
    type: 'video',
    category: 'Fundamentos',
    duration: '25 min',
    thumbnail: '/api/placeholder/400/225',
    videoUrl: 'https://www.youtube.com/embed/3OIsUi6QtGs',
    level: 'beginner',
    tags: ['mercado', 'fundamentos'],
    views: 0,
    rating: 4.9,
    isPremium: false,
    isCompleted: false,
    releaseDate: '2024-01-02',
    instructor: 'CoinBitClub'
  },
  {
    id: 'mercado-2',
    title: {
      pt: 'Do Zero ao trade automatizado',
      en: 'From Zero to automated trading'
    },
    description: {
      pt: 'Uma visão completa para quem começando do zero ou para quem quer otimizar os seus ganhos!',
      en: 'A complete overview for beginners or those who want to optimize their gains!'
    },
    type: 'video',
    category: 'Fundamentos',
    duration: '35 min',
    thumbnail: '/api/placeholder/400/225',
    videoUrl: 'https://www.youtube.com/embed/YDgEi1xnLf8',
    level: 'beginner',
    tags: ['trading', 'automação', 'iniciante'],
    views: 0,
    rating: 4.8,
    isPremium: false,
    isCompleted: false,
    releaseDate: '2024-01-03',
    instructor: 'CoinBitClub'
  },
  
  // 3) Colocando o robô para trabalhar
  {
    id: 'robo-1',
    title: {
      pt: 'Colocando o robô COINBITCLUB para trabalhar',
      en: 'Putting the COINBITCLUB robot to work'
    },
    description: {
      pt: 'Configure e ative nosso robô de trading automatizado para gerar lucros consistentes.',
      en: 'Configure and activate our automated trading robot to generate consistent profits.'
    },
    type: 'video',
    category: 'Automação',
    duration: '30 min',
    thumbnail: '/api/placeholder/400/225',
    videoUrl: '', // Link ainda será fornecido
    level: 'advanced',
    tags: ['robô', 'automação', 'lucro'],
    views: 0,
    rating: 5.0,
    isPremium: true,
    isCompleted: false,
    releaseDate: '2024-01-08',
    instructor: 'CoinBitClub'
  }
];

const UserTrainings: React.FC = () => {
  const { language, t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [materials, setMaterials] = useState<TrainingMaterial[]>([]);
  const [progress, setProgress] = useState<TrainingProgress[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Estados de filtros e busca
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [showCompleted, setShowCompleted] = useState(false);

  // Estados de modal
  const [selectedMaterial, setSelectedMaterial] = useState<TrainingMaterial | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);

  const mockProgress: TrainingProgress[] = useMemo(() => [
    {
      materialId: '1',
      progress: 100,
      completed: true,
      lastAccessDate: '2024-02-20',
      timeSpent: 45
    },
    {
      materialId: '3',
      progress: 65,
      completed: false,
      lastAccessDate: '2024-02-18',
      timeSpent: 52
    }
  ], []);

  // Load data
  const loadUserData = useCallback(async () => {
    if (!mounted) {
      setMounted(true);
      setLoading(true);
      setError(null);
      
      try {
        console.log('Loading training materials:', trainingMaterials);
        
        // Set mock data
        setMaterials(trainingMaterials);
        setProgress(mockProgress);
        
        console.log('Materials loaded successfully:', trainingMaterials.length, 'items');
        
      } catch (error) {
        console.error('Error loading training data:', error);
        setError('Erro ao carregar dados de treinamento');
      } finally {
        setLoading(false);
      }
    }
  }, [mounted, trainingMaterials, mockProgress]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // Filtered materials
  const filteredMaterials = useMemo(() => {
    const filtered = materials.filter(material => {
      const matchesSearch = material.title[language].toLowerCase().includes(searchTerm.toLowerCase()) ||
                          material.description[language].toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || material.category === selectedCategory;
      const matchesType = selectedType === 'all' || material.type === selectedType;
      const matchesLevel = selectedLevel === 'all' || material.level === selectedLevel;
      const matchesCompleted = !showCompleted || progress.some(p => p.materialId === material.id && p.completed);

      return matchesSearch && matchesCategory && matchesType && matchesLevel && matchesCompleted;
    });
    
    console.log('Original materials:', materials.length);
    console.log('Filtered materials:', filtered.length);
    console.log('Filter conditions:', { selectedCategory, selectedType, selectedLevel, showCompleted, searchTerm });
    
    return filtered;
  }, [materials, searchTerm, selectedCategory, selectedType, selectedLevel, showCompleted, progress]);

  // Handlers
  const handleMaterialClick = useCallback((material: TrainingMaterial) => {
    setSelectedMaterial(material);
    if (material.type === 'video') {
      setShowVideoModal(true);
    } else if (material.type === 'pdf' && material.pdfUrl) {
      setShowPdfModal(true);
    }
  }, []);

  const handleDownload = useCallback((material: TrainingMaterial) => {
    if (material.downloadUrl) {
      window.open(material.downloadUrl, '_blank');
    }
  }, []);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'text-green-400 bg-green-900/30 border border-green-500/30';
      case 'intermediate': return 'text-yellow-400 bg-yellow-900/30 border border-yellow-500/30';
      case 'advanced': return 'text-red-400 bg-red-900/30 border border-red-500/30';
      default: return 'text-gray-400 bg-gray-800/30 border border-gray-600/30';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'beginner': return 'Iniciante';
      case 'intermediate': return 'Intermediário';
      case 'advanced': return 'Avançado';
      default: return 'Não definido';
    }
  };

  if (!mounted || loading) {
    return (
      <UserLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-400 mb-4 mx-auto"></div>
            <h2 className="text-2xl font-bold text-white mb-2">CoinBitClub</h2>
            <p className="text-gray-400">{language === 'pt' ? 'Carregando treinamentos...' : 'Loading trainings...'}</p>
          </div>
        </div>
      </UserLayout>
    );
  }

  if (error) {
    return (
      <UserLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center p-8 bg-gradient-to-br from-red-900/30 to-red-800/30 backdrop-blur-sm rounded-xl border border-red-500/30">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-red-400 mb-2">Erro</h2>
            <p className="text-red-300 mb-4">{error}</p>
            <button
              onClick={loadUserData}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-6 py-2 rounded-lg transition-all"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent mb-2">
            {language === 'pt' ? 'Do Zero ao lucro automatizado em dólar!' : 'From Zero to Automated Dollar Profits!'}
          </h1>
          <p className="text-gray-400 text-lg">
            {language === 'pt' ? 'Acesse vídeos exclusivos para dominar entender como o mercado e a nossa automação funciona' : 'Access exclusive videos to understand how the market and our automation works'}
          </p>
        </motion.div>

        {/* Filtros e Busca */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-600/30 p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* Busca */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={language === 'pt' ? 'Buscar treinamentos...' : 'Search trainings...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black/20 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-white placeholder-gray-400"
              />
            </div>

            {/* Categoria */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 bg-black/20 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-white"
            >
              <option value="all">{language === 'pt' ? 'Todas as Categorias' : 'All Categories'}</option>
              <option value="Básico">{language === 'pt' ? 'Básico' : 'Basic'}</option>
              <option value="Intermediário">{language === 'pt' ? 'Intermediário' : 'Intermediate'}</option>
              <option value="Avançado">{language === 'pt' ? 'Avançado' : 'Advanced'}</option>
            </select>

            {/* Tipo */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-2 bg-black/20 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-white"
            >
              <option value="all">{language === 'pt' ? 'Todos os Tipos' : 'All Types'}</option>
              <option value="video">{language === 'pt' ? 'Vídeos' : 'Videos'}</option>
              <option value="pdf">PDFs</option>
            </select>

            {/* Nível */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-4 py-2 bg-black/20 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-white"
            >
              <option value="all">{language === 'pt' ? 'Todos os Níveis' : 'All Levels'}</option>
              <option value="beginner">{language === 'pt' ? 'Iniciante' : 'Beginner'}</option>
              <option value="intermediate">{language === 'pt' ? 'Intermediário' : 'Intermediate'}</option>
              <option value="advanced">{language === 'pt' ? 'Avançado' : 'Advanced'}</option>
            </select>

            {/* Filtro Concluídos */}
            <div className="flex items-center">
              <label className="flex items-center gap-2 text-gray-300">
                <input
                  type="checkbox"
                  checked={showCompleted}
                  onChange={(e) => setShowCompleted(e.target.checked)}
                  className="rounded border-gray-500 text-orange-500 focus:ring-orange-400 bg-gray-700"
                />
                <span>{language === 'pt' ? 'Apenas Concluídos' : 'Only Completed'}</span>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Informações importantes da Bybit */}
        {selectedCategory === 'Configuração Bybit' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-500/30 rounded-xl backdrop-blur-sm"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FaInfoCircle className="text-blue-400" />
              Informações Importantes - Configuração Bybit
            </h3>
            
            <div className="space-y-4 text-gray-300">
              <div className="bg-black/30 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-400 mb-2">🔗 Links de Cadastro:</h4>
                <p className="mb-2">
                  <strong>Link principal:</strong>{' '}
                  <a 
                    href="https://www.bybit.com/invite?ref=PPAWWOL" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    https://www.bybit.com/invite?ref=PPAWWOL
                  </a>
                </p>
                <p className="mb-2">
                  <strong>Link alternativo:</strong>{' '}
                  <a 
                    href="https://www.bybit.com/pt-PT/register?redirect_url=https%3A%2F%2Fwww.bybit.com%2Fpt-PT%2F" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    https://www.bybit.com/pt-PT/register
                  </a>
                </p>
                <p className="text-yellow-300">
                  <strong>Código de indicação:</strong> <span className="bg-yellow-900/50 px-2 py-1 rounded">PPAWWOL</span>
                </p>
                <p className="text-sm text-green-400 mt-2">
                  ✅ Use o código PPAWWOL para fazer parte da comunidade COINBITCLUB, garantir desconto VITALÍCIO nas taxas e receber bônus de USD$5!
                </p>
              </div>

              <div className="bg-black/30 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-400 mb-2">📋 Checklist de Configuração:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    Verificação em 2 etapas (comprovante de residência + documento com foto)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    Alterar idioma para PORTUGUÊS DE PORTUGAL
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    Habilitar autenticação 2FA (Google Authenticator)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    Configurar preferências de trading: FUTUROS → TRADE → Preferências → MODO UNILATERAL
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    Criar subconta: PERFIL → SUBCONTA → CRIAR → SUBCONTA
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    Depósito: DEPOSITAR → FIAT → BRL → PIX
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    Converter: BRL → USDT
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    Transferir: CONTA DE FUNDOS → CONTA DE TRADING UNIFICADO
                  </li>
                </ul>
              </div>

              <div className="bg-black/30 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-400 mb-2">🔑 Criação de API:</h4>
                <ol className="space-y-2 text-sm">
                  <li><strong>1.</strong> API GERENCIAMENTO → Indicar a subconta</li>
                  <li><strong>2.</strong> CRIAR NOVA CHAVE → Chaves API geradas por sistema</li>
                  <li><strong>3.</strong> Marcar: "Conectar-se a apps de terceiros"</li>
                  <li><strong>4.</strong> Nome do app: <span className="bg-orange-900/50 px-2 py-1 rounded">Marketbot</span></li>
                  <li><strong>5.</strong> Permissões: Marcar "Leitura e gravação"</li>
                  <li><strong>6.</strong> TRADE UNIFICADO: Marcar "ORDENS" e "POSIÇÕES"</li>
                  <li><strong>7.</strong> ENVIAR</li>
                </ol>
                <p className="text-red-400 mt-3 text-sm">
                  ⚠️ <strong>Importante:</strong> Salve a chave API e o segredo API em "Configurações" na área de usuários do MARKETBOT.
                </p>
              </div>

              <div className="bg-black/30 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-400 mb-2">🔗 Link Útil - 2FA:</h4>
                <a 
                  href="https://www.bybit.com/pt-BR/help-center/article/How-to-Bind-Your-Account-2FA-via-Google-Authenticator" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline text-sm"
                >
                  Como habilitar 2FA no Google Authenticator
                </a>
              </div>
            </div>
          </motion.div>
        )}

        {/* Lista de Materiais */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredMaterials.map((material) => {
            const materialProgress = progress.find(p => p.materialId === material.id);
            
            return (
              <motion.div
                key={material.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-600/30 overflow-hidden hover:border-orange-500/50 transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gradient-to-br from-orange-600/20 to-yellow-600/20 flex items-center justify-center">
                  
                  {/* Background Icon */}
                  <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center">
                    {material.type === 'video' ? (
                      <FiVideo className="w-10 h-10 text-orange-400/50" />
                    ) : (
                      <FiFileText className="w-10 h-10 text-blue-400/50" />
                    )}
                  </div>
                  
                  {/* Premium Badge */}
                  {material.isPremium && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <FiStar className="w-3 h-3" />
                        <span>Premium</span>
                      </span>
                    </div>
                  )}

                  {/* Progresso */}
                  {materialProgress && materialProgress.progress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 h-2">
                      <div 
                        className="h-full bg-green-500"
                        style={{ width: `${materialProgress.progress}%` }}
                      />
                    </div>
                  )}

                  {/* Play Button */}
                  <button
                    onClick={() => handleMaterialClick(material)}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30"
                  >
                    <div className="w-16 h-16 bg-orange-500/90 rounded-full flex items-center justify-center shadow-xl">
                      {material.type === 'video' ? (
                        <FiPlay className="w-8 h-8 text-white ml-1" />
                      ) : (
                        <FiEye className="w-8 h-8 text-white" />
                      )}
                    </div>
                  </button>
                </div>

                {/* Conteúdo */}
                <div className="p-6">
                  
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(material.level)}`}>
                        {getLevelText(material.level)}
                      </span>
                      {materialProgress?.completed && (
                        <FiCheckCircle className="w-5 h-5 text-green-400" />
                      )}
                    </div>
                  </div>

                  {/* Título */}
                  <h3 className="text-lg font-bold text-white mb-2">
                    {material.title[language]}
                  </h3>

                  {/* Descrição */}
                  <p className="text-gray-400 text-sm mb-6 line-clamp-3">
                    {material.description[language]}
                  </p>

                  {/* Botões */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleMaterialClick(material)}
                      className={`flex-1 py-2 px-4 rounded-lg transition-all font-medium flex items-center justify-center gap-2 ${
                        material.type === 'video' && !material.videoUrl 
                          ? 'bg-gray-600/50 text-gray-300 hover:bg-gray-600/70' 
                          : 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black'
                      }`}
                    >
                      {material.type === 'video' ? <FiPlay className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                      <span>
                        {material.type === 'video' 
                          ? (material.videoUrl ? 'Assistir' : 'Em breve')
                          : 'Visualizar'
                        }
                      </span>
                    </button>
                    
                    {material.downloadUrl && (
                      <button
                        onClick={() => handleDownload(material)}
                        className="bg-gray-700 hover:bg-gray-600 text-gray-300 py-2 px-3 rounded-lg transition-colors flex items-center justify-center"
                      >
                        <FiDownload className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Box de Configurações e Cadastros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8 p-6 bg-gradient-to-r from-blue-900/50 to-indigo-900/50 border border-blue-500/30 rounded-xl backdrop-blur-sm"
        >
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <FaInfoCircle className="text-blue-400" />
            {language === 'pt' ? '📋 Guia Completo: Configurações e Cadastros' : '📋 Complete Guide: Settings and Registration'}
          </h3>
          
          <div className="space-y-6">
            {/* Cadastro na Bybit */}
            <div className="bg-black/30 p-5 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-bold text-blue-300 mb-3 text-lg">
                {language === 'pt' ? '🔗 Cadastro na Bybit' : '🔗 Bybit Registration'}
              </h4>
              
              <div className="space-y-3 text-gray-300">
                <div className="bg-blue-900/30 p-4 rounded-lg">
                  <p className="mb-2">
                    <strong className="text-blue-200">
                      {language === 'pt' ? 'Link principal:' : 'Main link:'}
                    </strong>{' '}
                    <a 
                      href="https://www.bybit.com/invite?ref=PPAWWOL" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline transition-colors"
                    >
                      https://www.bybit.com/invite?ref=PPAWWOL
                    </a>
                  </p>
                  <p className="mb-2">
                    <strong className="text-blue-200">
                      {language === 'pt' ? 'Link alternativo:' : 'Alternative link:'}
                    </strong>{' '}
                    <a 
                      href="https://www.bybit.com/pt-PT/register?redirect_url=https%3A%2F%2Fwww.bybit.com%2Fpt-PT%2F" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline transition-colors"
                    >
                      https://www.bybit.com/pt-PT/register
                    </a>
                  </p>
                  <div className="mt-3 p-3 bg-yellow-900/50 rounded border border-yellow-500/30">
                    <p className="text-yellow-200">
                      <strong>🎯 {language === 'pt' ? 'Código de indicação:' : 'Referral code:'}</strong> <span className="bg-yellow-600/50 px-3 py-1 rounded font-mono text-yellow-100">PPAWWOL</span>
                    </p>
                    <p className="text-sm text-yellow-300 mt-2">
                      ✨ {language === 'pt' 
                        ? 'Use o código PPAWWOL para fazer parte da comunidade COINBITCLUB, garantir desconto VITALÍCIO nas taxas de operação e receber um bônus de USD$5 pela operadora!'
                        : 'Use the code PPAWWOL to join the COINBITCLUB community, get LIFETIME discount on trading fees and receive a USD$5 bonus from the exchange!'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Etapas de Verificação */}
            <div className="bg-black/30 p-5 rounded-lg border-l-4 border-green-500">
              <h4 className="font-bold text-green-300 mb-3 text-lg">
                {language === 'pt' ? '✅ Etapas de Verificação' : '✅ Verification Steps'}
              </h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span>
                    {language === 'pt' 
                      ? 'Realizar as etapas de verificação em 2 etapas'
                      : 'Complete the 2-factor verification steps'
                    }
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span>
                    {language === 'pt'
                      ? 'Fornecer comprovante de residência com menos de 3 meses emitido no nome do titular da conta'
                      : 'Provide proof of residence less than 3 months old issued in the account holder\'s name'
                    }
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span>
                    {language === 'pt'
                      ? 'Enviar documento de identificação com foto'
                      : 'Submit photo identification document'
                    }
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span>
                    {language === 'pt'
                      ? 'Alterar o idioma para PORTUGUÊS DE PORTUGAL'
                      : 'Change language to PORTUGUESE OF PORTUGAL'
                    }
                  </span>
                </li>
              </ul>
            </div>

            {/* Autenticação 2FA */}
            <div className="bg-black/30 p-5 rounded-lg border-l-4 border-purple-500">
              <h4 className="font-bold text-purple-300 mb-3 text-lg">
                {language === 'pt' ? '🔐 Autenticação de Dois Fatores (2FA)' : '🔐 Two-Factor Authentication (2FA)'}
              </h4>
              <p className="text-gray-300 mb-3">
                {language === 'pt' 
                  ? 'Passo a passo para habilitar o Google Authenticator:'
                  : 'Step by step to enable Google Authenticator:'
                }
              </p>
              <a 
                href="https://www.bybit.com/pt-BR/help-center/article/How-to-Bind-Your-Account-2FA-via-Google-Authenticator" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                📖 {language === 'pt' ? 'Ver Tutorial Oficial da Bybit' : 'View Official Bybit Tutorial'}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            {/* Configurações de Trading */}
            <div className="bg-black/30 p-5 rounded-lg border-l-4 border-orange-500">
              <h4 className="font-bold text-orange-300 mb-3 text-lg">
                {language === 'pt' ? '⚙️ Configurações Essenciais' : '⚙️ Essential Settings'}
              </h4>
              
              <div className="space-y-4">
                {/* Vídeos de Configuração */}
                <div className="bg-orange-900/20 p-4 rounded border border-orange-500/20 mb-4">
                  <h5 className="font-semibold text-orange-200 mb-3 flex items-center gap-2">
                    📹 {language === 'pt' ? 'Vídeos Tutoriais:' : 'Tutorial Videos:'}
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <a 
                      href="https://youtu.be/Cj0owHC56Q8" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-orange-800/30 hover:bg-orange-800/50 rounded border border-orange-600/30 hover:border-orange-500/50 transition-all group"
                    >
                      <div className="w-10 h-10 bg-orange-600/30 rounded-full flex items-center justify-center">
                        <FiPlay className="w-5 h-5 text-orange-300" />
                      </div>
                      <div className="flex-1">
                        <h6 className="font-medium text-orange-100 group-hover:text-white text-sm">
                          {language === 'pt' ? 'Criando a conta na operadora' : 'Creating exchange account'}
                        </h6>
                        <p className="text-orange-300/80 text-xs">
                          {language === 'pt' ? 'Cadastro completo na Bybit' : 'Complete Bybit registration'}
                        </p>
                      </div>
                    </a>
                    
                    <a 
                      href="https://youtu.be/_xoywYegY4o" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-orange-800/30 hover:bg-orange-800/50 rounded border border-orange-600/30 hover:border-orange-500/50 transition-all group"
                    >
                      <div className="w-10 h-10 bg-orange-600/30 rounded-full flex items-center justify-center">
                        <FiPlay className="w-5 h-5 text-orange-300" />
                      </div>
                      <div className="flex-1">
                        <h6 className="font-medium text-orange-100 group-hover:text-white text-sm">
                          {language === 'pt' ? 'Configurações essenciais' : 'Essential settings'}
                        </h6>
                        <p className="text-orange-300/80 text-xs">
                          {language === 'pt' ? 'Setup completo da conta' : 'Complete account setup'}
                        </p>
                      </div>
                    </a>
                    
                    <a 
                      href="https://youtu.be/OVp8sQR8REA" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-orange-800/30 hover:bg-orange-800/50 rounded border border-orange-600/30 hover:border-orange-500/50 transition-all group"
                    >
                      <div className="w-10 h-10 bg-orange-600/30 rounded-full flex items-center justify-center">
                        <FiPlay className="w-5 h-5 text-orange-300" />
                      </div>
                      <div className="flex-1">
                        <h6 className="font-medium text-orange-100 group-hover:text-white text-sm">
                          {language === 'pt' ? 'Como fazer depósito' : 'How to make deposit'}
                        </h6>
                        <p className="text-orange-300/80 text-xs">
                          {language === 'pt' ? 'Depósito via PIX em BRL' : 'PIX deposit in BRL'}
                        </p>
                      </div>
                    </a>
                    
                    <a 
                      href="https://youtu.be/gKHcamfmf2c" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-orange-800/30 hover:bg-orange-800/50 rounded border border-orange-600/30 hover:border-orange-500/50 transition-all group"
                    >
                      <div className="w-10 h-10 bg-orange-600/30 rounded-full flex items-center justify-center">
                        <FiPlay className="w-5 h-5 text-orange-300" />
                      </div>
                      <div className="flex-1">
                        <h6 className="font-medium text-orange-100 group-hover:text-white text-sm">
                          {language === 'pt' ? 'Criação de subcontas' : 'Creating subaccounts'}
                        </h6>
                        <p className="text-orange-300/80 text-xs">
                          {language === 'pt' ? 'Organização e gestão' : 'Organization and management'}
                        </p>
                      </div>
                    </a>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold text-orange-200 mb-2">
                    🔧 {language === 'pt' ? 'Preferências de Trading:' : 'Trading Preferences:'}
                  </h5>
                  <div className="bg-orange-900/30 p-3 rounded border border-orange-500/30">
                    <code className="text-sm text-orange-100">
                      {language === 'pt' 
                        ? 'Página inicial → FUTUROS → Clicar em qualquer moeda → TRADE → ... → Preferências de TRADE → MODO DA POSIÇÃO → MODO UNILATERAL'
                        : 'Home page → FUTURES → Click any coin → TRADE → ... → TRADE Preferences → POSITION MODE → UNILATERAL MODE'
                      }
                    </code>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold text-orange-200 mb-2">
                    👥 {language === 'pt' ? 'Criação de Subcontas:' : 'Creating Subaccounts:'}
                  </h5>
                  <div className="bg-orange-900/30 p-3 rounded border border-orange-500/30">
                    <code className="text-sm text-orange-100">
                      {language === 'pt' 
                        ? 'PERFIL → SUBCONTA → CRIAR → SUBCONTA'
                        : 'PROFILE → SUBACCOUNT → CREATE → SUBACCOUNT'
                      }
                    </code>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold text-orange-200 mb-2">
                    💰 {language === 'pt' ? 'Depósito do valor:' : 'Amount deposit:'}
                  </h5>
                  <div className="bg-orange-900/30 p-3 rounded border border-orange-500/30">
                    <code className="text-sm text-orange-100">
                      {language === 'pt' 
                        ? 'DEPOSITAR → FIAT → BRL → Incluir o valor → PIX'
                        : 'DEPOSIT → FIAT → BRL → Include amount → PIX'
                      }
                    </code>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold text-orange-200 mb-2">
                    🔄 {language === 'pt' ? 'Converter valor depositado:' : 'Convert deposited amount:'}
                  </h5>
                  <div className="bg-orange-900/30 p-3 rounded border border-orange-500/30">
                    <code className="text-sm text-orange-100">
                      {language === 'pt' 
                        ? 'CONVERTER → DE: BRL | PARA: USDT → Incluir valor depositado → COTAR → CONVERTER'
                        : 'CONVERT → FROM: BRL | TO: USDT → Include deposited amount → QUOTE → CONVERT'
                      }
                    </code>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold text-orange-200 mb-2">
                    ↔️ {language === 'pt' ? 'Transferir:' : 'Transfer:'}
                  </h5>
                  <div className="bg-orange-900/30 p-3 rounded border border-orange-500/30">
                    <code className="text-sm text-orange-100">
                      {language === 'pt' 
                        ? 'DE: CONTA DE FUNDOS | PARA: CONTA DE TRADING UNIFICADO'
                        : 'FROM: FUNDING ACCOUNT | TO: UNIFIED TRADING ACCOUNT'
                      }
                    </code>
                  </div>
                </div>
              </div>
            </div>

            {/* Criação de Chaves API */}
            <div className="bg-black/30 p-5 rounded-lg border-l-4 border-red-500">
              <h4 className="font-bold text-red-300 mb-3 text-lg">
                {language === 'pt' ? '🔑 CRIAÇÃO DE CHAVE API e CHAVE SECRETA' : '🔑 API KEY AND SECRET KEY CREATION'}
              </h4>
              
              <div className="space-y-3">
                <div className="bg-red-900/30 p-4 rounded border border-red-500/30">
                  <h5 className="font-semibold text-red-200 mb-3">
                    📋 {language === 'pt' ? 'Passo a passo:' : 'Step by step:'}
                  </h5>
                  <ol className="space-y-2 text-sm text-gray-300">
                    <li>
                      <strong>1.</strong> {language === 'pt' ? 'Clicar em' : 'Click on'} <code className="bg-red-800/50 px-2 py-1 rounded">
                        {language === 'pt' ? 'API GERENCIAMENTO' : 'API MANAGEMENT'}
                      </code>
                    </li>
                    <li>
                      <strong>2.</strong> {language === 'pt' ? 'Indicar a subconta' : 'Select the subaccount'}
                    </li>
                    <li>
                      <strong>3.</strong> <code className="bg-red-800/50 px-2 py-1 rounded">
                        {language === 'pt' ? 'CRIAR NOVA CHAVE' : 'CREATE NEW KEY'}
                      </code>
                    </li>
                    <li>
                      <strong>4.</strong> {language === 'pt' ? 'Selecionar:' : 'Select:'} <code className="bg-red-800/50 px-2 py-1 rounded">
                        {language === 'pt' ? 'Chaves API geradas por sistema' : 'System-generated API keys'}
                      </code>
                    </li>
                    <li>
                      <strong>5.</strong> {language === 'pt' ? 'Marcar:' : 'Check:'} <code className="bg-red-800/50 px-2 py-1 rounded">
                        {language === 'pt' ? 'Conectar-se a apps de terceiros' : 'Connect to third-party apps'}
                      </code>
                    </li>
                    <li>
                      <strong>6.</strong> {language === 'pt' ? 'Nome do app:' : 'App name:'} <code className="bg-red-800/50 px-2 py-1 rounded">Marketbot</code>
                    </li>
                    <li>
                      <strong>7.</strong> {language === 'pt' ? 'Permissões de chaves API: Marcar' : 'API key permissions: Check'} <code className="bg-red-800/50 px-2 py-1 rounded">
                        {language === 'pt' ? 'Leitura e gravação' : 'Read and write'}
                      </code>
                    </li>
                    <li>
                      <strong>8.</strong> {language === 'pt' ? 'TRADE UNIFICADO: Marcar' : 'UNIFIED TRADING: Check'} <code className="bg-red-800/50 px-2 py-1 rounded">
                        {language === 'pt' ? 'ORDENS' : 'ORDERS'}
                      </code> {language === 'pt' ? 'e' : 'and'} <code className="bg-red-800/50 px-2 py-1 rounded">
                        {language === 'pt' ? 'POSIÇÕES' : 'POSITIONS'}
                      </code>
                    </li>
                    <li>
                      <strong>9.</strong> <code className="bg-red-800/50 px-2 py-1 rounded">
                        {language === 'pt' ? 'ENVIAR' : 'SEND'}
                      </code>
                    </li>
                  </ol>
                </div>

                <div className="bg-yellow-900/50 p-4 rounded border border-yellow-500/50">
                  <p className="text-yellow-200 font-semibold flex items-center gap-2">
                    ⚠️ {language === 'pt' ? 'IMPORTANTE:' : 'IMPORTANT:'}
                  </p>
                  <p className="text-yellow-300 mt-2">
                    {language === 'pt'
                      ? 'Salvar a chave API e o segredo API em "Configurações" na área de usuários do MARKETBOT.'
                      : 'Save the API key and API secret in "Settings" in the MARKETBOT user area.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Empty State */}
        {filteredMaterials.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <FiBookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400 mb-2">
              {language === 'pt' ? 'Nenhum material encontrado' : 'No materials found'}
            </h3>
            <p className="text-gray-500">
              {language === 'pt' 
                ? 'Tente ajustar seus filtros ou termo de busca'
                : 'Try adjusting your filters or search term'
              }
            </p>
          </motion.div>
        )}

        {/* Modal de Vídeo */}
        <AnimatePresence>
          {showVideoModal && selectedMaterial && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
              onClick={() => setShowVideoModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-sm rounded-xl border border-gray-600/30 max-w-4xl w-full max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-gray-600/30">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-white">
                      {selectedMaterial.title[language]}
                    </h3>
                    <button
                      onClick={() => setShowVideoModal(false)}
                      className="text-gray-400 hover:text-gray-200 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="aspect-video bg-black">
                  {selectedMaterial.videoUrl ? (
                    <iframe
                      src={`${selectedMaterial.videoUrl}?autoplay=0&controls=1&modestbranding=1&rel=0`}
                      title={selectedMaterial.title[language]}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white">
                      <FiVideo className="w-16 h-16 text-gray-400" />
                      <p className="ml-4 text-gray-400">
                        {language === 'pt' ? 'Vídeo não disponível' : 'Video not available'}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <p className="text-gray-400">
                    {selectedMaterial.description[language]}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal de PDF */}
        <AnimatePresence>
          {showPdfModal && selectedMaterial && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
              onClick={() => setShowPdfModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-sm rounded-xl border border-gray-600/30 max-w-4xl w-full max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-gray-600/30">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-white">
                      {selectedMaterial.title[language]}
                    </h3>
                    <div className="flex items-center gap-4">
                      {selectedMaterial.downloadUrl && (
                        <button
                          onClick={() => handleDownload(selectedMaterial)}
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2"
                        >
                          <FiDownload className="w-4 h-4" />
                          <span>{language === 'pt' ? 'Download' : 'Download'}</span>
                        </button>
                      )}
                      <button
                        onClick={() => setShowPdfModal(false)}
                        className="text-gray-400 hover:text-gray-200 transition-colors"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="h-96 bg-gray-900 overflow-hidden">
                  {selectedMaterial.pdfUrl ? (
                    <iframe
                      src={selectedMaterial.pdfUrl}
                      title={selectedMaterial.title[language]}
                      className="w-full h-full"
                      frameBorder="0"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiFileText className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <p className="text-gray-400">
                    {selectedMaterial.description[language]}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </UserLayout>
  );
};

export default UserTrainings;
