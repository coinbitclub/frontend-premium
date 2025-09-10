import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import RobotDemoLanding from '../components/RobotDemoLanding';
type Language = 'pt' | 'en';
export default function Home() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('pt');
  const [mounted, setMounted] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showFAQModal, setShowFAQModal] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [stats, setStats] = useState({
    users: 2501,
    profit: 0.3,
    trades: 757,
    uptime: 84.7
  });
  const router = useRouter();
  useEffect(() => {
    setMounted(true);
    // Carregar idioma do localStorage
    try {
      const savedLanguage = localStorage.getItem('coinbitclub-language') as Language;
      if (savedLanguage && (savedLanguage === 'pt' || savedLanguage === 'en')) {
        setCurrentLanguage(savedLanguage);
      }
    } catch (error) {
      console.warn('Error loading language:', error);
    }
    // Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'landing_page_view', {
        event_category: 'Landing',
        event_label: 'Home Page View'
      });
    }
    // Animated counter for stats
    const interval = setInterval(() => {
      setStats(prev => ({
        users: Math.min(prev.users + Math.floor(Math.random() * 12) + 8, 5182),
        profit: Math.min(prev.profit + Math.floor(Math.random() * 0.05) + 0.02, 1.8),
        trades: Math.min(prev.trades + Math.floor(Math.random() * 25) + 15, 3123),
        uptime: Math.min(prev.uptime + Math.floor(Math.random() * 0.3) + 0.1, 92.3)
      }));
    }, 150);
    const timeout = setTimeout(() => clearInterval(interval), 4500);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);
  const handleLanguageChange = (lang: Language) => {
    setCurrentLanguage(lang);
    try {
      localStorage.setItem('coinbitclub-language', lang);
    } catch (error) {
      console.warn('Error saving language:', error);
    }
  };
  const handleNavigation = (path: string) => {
    router.push(path);
  };
  const handleCTAClick = (action: string) => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'cta_click', {
        event_category: 'CTA',
        event_label: action
      });
    }
  };
  const handleModalOpen = (modal: string) => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'modal_open', {
        event_category: 'Modal',
        event_label: modal
      });
    }
  };
  // Textos em múltiplos idiomas
  const texts = {
    pt: {
      hero: {
        title: 'MARKETBOT',
        subtitle: 'a IA que transforma sinais em LUCRO EM DÓLAR!',
        highlightPhrase: 'O robô de trade automatizado que SÓ LUCRA SE VOCÊ LUCRAR!',
        cta: 'Comece Agora',
        watchDemo: 'Como Funciona'
      },
      stats: {
        users: 'Usuários Ativos',
        profit: 'Lucro Médio Diário',
        trades: 'Operações Realizadas',
        uptime: 'Uptime do Sistema'
      },
      affiliate: {
        title: 'Programa de Afiliados',
        subtitle: 'Ganhe Indicando Nosso Robô',
        description: 'Transforme sua rede em uma fonte de renda recorrente. Ganhe comissões de 1,5% a cada usuário que você indicar!',
        commission: 'Comissão de 1,5%',
        commissionDesc: 'Receba 1,5% de todas as comissões geradas pelos seus indicados',
        withdrawal: 'Saque ou Conversão +10%',
        withdrawalDesc: 'Saque suas comissões ou converta em carga para o robô com +10% bônus',
        dashboard: 'Dashboard Completo',
        dashboardDesc: 'Acompanhe seus ganhos e indicações em tempo real'
      },
      faq: [
        {
          q: 'Como funciona o sistema de trading automatizado?',
          a: 'Nossa IA analisa milhares de dados de mercado em tempo real, identifica oportunidades de compra e venda, e executa operações automaticamente para maximizar seus lucros.'
        },
        {
          q: 'Qual é o valor mínimo para começar?',
          a: 'Você pode começar com qualquer valor a partir de R$ 100. Recomendamos começar com um valor que você se sinta confortável e ir aumentando conforme ganha confiança.'
        },
        {
          q: 'Como são calculadas as comissões?',
          a: 'Cobramos comissão apenas sobre os lucros reais obtidos. Se não há lucro, não há cobrança. É assim que garantimos que estamos alinhados com seu sucesso.'
        },
        {
          q: 'Posso sacar meu dinheiro a qualquer momento?',
          a: 'Sim! Você tem controle total sobre seus fundos e pode solicitar saques a qualquer momento. O processamento varia de instantâneo a 24h dependendo do seu plano.'
        },
        {
          q: 'O sistema é seguro?',
          a: 'Utilizamos as mais avançadas tecnologias de segurança, incluindo criptografia de nível bancário e autenticação de dois fatores. Seus fundos ficam em carteiras segregadas.'
        }
      ],
      footer: {
        company: 'CoinBitClub',
        description: 'Revolucionando o trading de criptomoedas com tecnologia de ponta e inteligência artificial.',
        contact: 'Contato',
        rights: 'Todos os direitos reservados.',
        risk: 'Aviso de Risco',
        riskText: 'Trading de criptomoedas envolve riscos. Investimentos passados não garantem retornos futuros.'
      }
    },
    en: {
      hero: {
        title: 'MARKETBOT',
        subtitle: 'the AI that transforms signals into PROFIT IN DOLLARS!',
        highlightPhrase: 'The automated trading robot that ONLY PROFITS IF YOU PROFIT!',
        cta: 'Start Now for Free',
        watchDemo: 'How It Works'
      },
      stats: {
        users: 'Active Users',
        profit: 'Average Daily Profit',
        trades: 'Trades Executed',
        uptime: 'System Uptime'
      },
      affiliate: {
        title: 'Affiliate Program',
        subtitle: 'Earn by Referring Our Robot',
        description: 'Transform your network into a recurring income source. Earn 1.5% commissions for every user you refer!',
        commission: '1.5% Commission',
        commissionDesc: 'Receive 1.5% of all commissions generated by your referrals',
        withdrawal: 'Withdrawal or Conversion +10%',
        withdrawalDesc: 'Withdraw your commissions or convert to robot balance with +10% bonus',
        dashboard: 'Complete Dashboard',
        dashboardDesc: 'Track your earnings and referrals in real time'
      },
      faq: [
        {
          q: 'How does the automated trading system work?',
          a: 'Our AI analyzes thousands of market data points in real-time, identifies buy and sell opportunities, and executes trades automatically to maximize your profits.'
        },
        {
          q: 'What is the minimum amount to start?',
          a: 'You can start with any amount from $20. We recommend starting with an amount you feel comfortable with and increasing as you gain confidence.'
        },
        {
          q: 'How are commissions calculated?',
          a: 'We charge commission only on actual profits obtained. If there is no profit, there is no charge. This is how we ensure we are aligned with your success.'
        },
        {
          q: 'Can I withdraw my money at any time?',
          a: 'Yes! You have full control over your funds and can request withdrawals at any time. Processing varies from instant to 24h depending on your plan.'
        },
        {
          q: 'Is the system secure?',
          a: 'We use the most advanced security technologies, including bank-level encryption and two-factor authentication. Your funds are kept in segregated wallets.'
        }
      ],
      footer: {
        company: 'CoinBitClub',
        description: 'Revolutionizing cryptocurrency trading with cutting-edge technology and artificial intelligence.',
        contact: 'Contact',
        rights: 'All rights reserved.',
        risk: 'Risk Warning',
        riskText: 'Cryptocurrency trading involves risks. Past investments do not guarantee future returns.'
      }
    }
  };
  const t = texts[currentLanguage];
  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400"></div>
      </div>
    );
  }
  return (
    <>
      <Head>
        <title>CoinBitClub MarketBot - Trading Automatizado de Criptomoedas com IA</title>
        <meta 
          name="description" 
          content="Plataforma de trading automatizado de criptomoedas com IA. Ganhe dinheiro no piloto automático 24/7. Comissão apenas sobre lucros reais." 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="icon" href="/favicon.ico" />
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-F2M0MG8B5H"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-F2M0MG8B5H');
            `,
          }}
        />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-x-hidden relative">
        {/* Header */}
        <header className="fixed top-0 w-full bg-slate-900/90 backdrop-blur-xl z-50 border-b border-slate-700/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-black font-black text-lg">₿</span>
                </div>
                <div>
                  <h1 className="text-xl font-black text-white">{t.footer.company}</h1>
                  <p className="text-xs text-gray-400 font-medium tracking-wider">MarketBot</p>
                </div>
              </div>
              {/* Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                <button
                  onClick={() => handleNavigation('/planos-new')}
                  className="text-slate-300 hover:text-yellow-400 transition-all duration-300 text-sm font-medium"
                >
                  {currentLanguage === 'pt' ? 'Planos' : 'Plans'}
                </button>
                <button
                  onClick={() => setShowFAQModal(true)}
                  className="text-slate-300 hover:text-yellow-400 transition-all duration-300 text-sm font-medium"
                >
                  FAQ
                </button>
                <button
                  onClick={() => handleNavigation('/auth/login')}
                  className="relative group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/25 to-orange-500/25 rounded-lg blur-sm opacity-60 group-hover:opacity-80 transition-all duration-300"></div>
                  <div className="relative bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-all duration-300 shadow-lg">
                    {currentLanguage === 'pt' ? 'Login' : 'Login'}
                  </div>
                </button>
                <button
                  onClick={() => handleNavigation('/termos')}
                  className="text-slate-300 hover:text-yellow-400 transition-all duration-300 text-sm font-medium"
                >
                  {currentLanguage === 'pt' ? 'Termos' : 'Terms'}
                </button>
                <button
                  onClick={() => setShowVideoModal(true)}
                  className="text-slate-300 hover:text-yellow-400 transition-all duration-300 text-sm font-medium"
                >
                  {t.hero.watchDemo}
                </button>
                {/* Language Selector */}
                <div className="flex items-center space-x-2 bg-slate-800/50 backdrop-blur-sm rounded-lg p-1 border border-slate-700/50">
                  <button
                    onClick={() => handleLanguageChange('pt')}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                      currentLanguage === 'pt' 
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black shadow-lg' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    PT
                  </button>
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                      currentLanguage === 'en' 
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black shadow-lg' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    EN
                  </button>
                </div>
                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    router.push('/cadastro-new');
                    handleCTAClick('header_cta');
                  }}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold text-sm px-6 py-2.5 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  {t.hero.cta}
                </motion.button>
              </nav>
            </div>
          </div>
        </header>
        {/* SEÇÃO 1: Hero Principal */}
        <section className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-6xl">
            {/* Conteúdo Principal - Centralizado */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-12 max-w-7xl mx-auto px-4"
            >
              {/* Badge de Status */}
              <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-500/30 rounded-full px-6 py-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-bold text-base">
                  {currentLanguage === 'pt' ? 'Sistema Ativo - Online 24/7' : 'System Active - Online 24/7'}
                </span>
              </div>
              {/* Título Principal */}
              <div className="space-y-8 text-center">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight mx-auto max-w-6xl">
                  <span className="block bg-gradient-to-r from-white via-yellow-100 to-white bg-clip-text text-transparent">
                    {t.hero.title}
                  </span>
                </h1>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-yellow-400 leading-relaxed mx-auto max-w-4xl">
                  {t.hero.subtitle}
                </p>
              </div>
              {/* Proposta de Valor */}
              <div className="relative max-w-4xl mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl blur-2xl"></div>
                <div className="relative bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-lg border-2 border-green-500/30 rounded-3xl p-8">
                  <p className="text-xl sm:text-2xl font-bold text-green-400 text-center leading-relaxed">
                    {t.hero.highlightPhrase}
                  </p>
                </div>
              </div>
              {/* Seção de Benefícios */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="max-w-4xl mx-auto"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-800/30 via-slate-700/20 to-slate-800/30 rounded-2xl blur-lg"></div>
                  <div className="relative bg-slate-900/40 backdrop-blur-md border border-slate-700/30 rounded-2xl p-6">
                    {/* Título da Seção */}
                    <p className="text-sm font-medium text-slate-300 text-center mb-6 leading-relaxed">
                      {currentLanguage === 'pt' 
                        ? 'Conecte sua conta Binance ou Bybit e comece a lucrar em poucos cliques.'
                        : 'Connect your Binance or Bybit account and start profiting in just a few clicks.'
                      }
                    </p>
                    {/* Grid de Benefícios */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {/* Leitura do mercado */}
                      <motion.div 
                        className="flex items-center space-x-3 p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl hover:bg-blue-500/10 transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="text-blue-400 font-medium text-sm">
                          {currentLanguage === 'pt' ? 'Leitura do mercado' : 'Market reading'}
                        </span>
                      </motion.div>
                      {/* Monitoramento TOP100+ */}
                      <motion.div 
                        className="flex items-center space-x-3 p-3 bg-purple-500/5 border border-purple-500/10 rounded-xl hover:bg-purple-500/10 transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="text-purple-400 font-medium text-sm">
                          {currentLanguage === 'pt' ? 'Monitoramento TOP100+' : 'TOP100+ Monitoring'}
                        </span>
                      </motion.div>
                      {/* Abertura e acompanhamento */}
                      <motion.div 
                        className="flex items-center space-x-3 p-3 bg-green-500/5 border border-green-500/10 rounded-xl hover:bg-green-500/10 transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="text-green-400 font-medium text-sm">
                          {currentLanguage === 'pt' ? 'Abertura e acompanhamento' : 'Opening and tracking'}
                        </span>
                      </motion.div>
                      {/* Trading 24/7 */}
                      <motion.div 
                        className="flex items-center space-x-3 p-3 bg-yellow-500/5 border border-yellow-500/10 rounded-xl hover:bg-yellow-500/10 transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="text-yellow-400 font-medium text-sm">
                          {currentLanguage === 'pt' ? 'Trading 24/7' : 'Trading 24/7'}
                        </span>
                      </motion.div>
                      {/* Position Safety */}
                      <motion.div 
                        className="flex items-center space-x-3 p-3 bg-cyan-500/5 border border-cyan-500/10 rounded-xl hover:bg-cyan-500/10 transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="text-cyan-400 font-medium text-sm">
                          {currentLanguage === 'pt' ? 'Position Safety' : 'Position Safety'}
                        </span>
                      </motion.div>
                      {/* Comissão apenas sobre operações lucrativas */}
                      <motion.div 
                        className="flex items-center space-x-3 p-3 bg-orange-500/5 border border-orange-500/10 rounded-xl hover:bg-orange-500/10 transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="text-orange-400 font-medium text-sm">
                          {currentLanguage === 'pt' 
                            ? 'Comissão só no lucro' 
                            : 'Commission on profit only'
                          }
                        </span>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
              {/* CTA Principal */}
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
                  {/* Botão Principal */}
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      router.push('/cadastro-new');
                      handleCTAClick('main_cta');
                    }}
                    className="relative group overflow-hidden w-72"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/25 to-orange-500/25 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 transition-all duration-300"></div>
                    <div className="relative bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-semibold text-lg px-10 py-4 rounded-2xl transition-all duration-300 shadow-xl">
                      <span className="flex items-center justify-center space-x-3">
                        <span className="text-xl">🚀</span>
                        <span>{t.hero.cta}</span>
                        <span className="text-xl">💰</span>
                      </span>
                    </div>
                  </motion.button>
                  {/* Botão Como Funciona */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowVideoModal(true)}
                    className="relative group overflow-hidden w-64"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-md opacity-50 group-hover:opacity-70 transition-all duration-300"></div>
                    <div className="relative bg-slate-700/70 hover:bg-slate-600/80 text-white font-medium text-base px-8 py-4 rounded-2xl transition-all duration-300 shadow-lg border border-slate-600/50 hover:border-cyan-400/50">
                      <span className="flex items-center justify-center space-x-3">
                        <span className="text-lg">▶️</span>
                        <span>{currentLanguage === 'pt' ? 'Como Funciona' : 'How It Works'}</span>
                      </span>
                    </div>
                  </motion.button>
                </div>
              </div>
            </motion.div>
            {/* Aviso de Segurança - Melhorado */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative mt-8 mb-12"
            >
              <div className="max-w-4xl mx-auto">
                <div className="relative bg-slate-800/40 backdrop-blur-sm border border-slate-600/30 rounded-xl p-6 shadow-lg">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-blue-400 text-2xl">🔒</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-white mb-4">
                        {currentLanguage === 'pt' 
                          ? 'Seu Dinheiro, Sempre Seguro e Sob Seu Controle' 
                          : 'Your Money, Always Safe and Under Your Control'
                        }
                      </h4>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex items-start space-x-3">
                          <span className="text-blue-400 text-sm mt-1">➡️</span>
                          <p className="text-slate-300 text-sm leading-relaxed">
                            {currentLanguage === 'pt' 
                              ? 'Nossa conexão é feita apenas via API oficial, usada exclusivamente para abrir e fechar operações em seu nome.' 
                              : 'Our connection is made only via official API, used exclusively to open and close trades on your behalf.'
                            }
                          </p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <span className="text-blue-400 text-sm mt-1">➡️</span>
                          <p className="text-slate-300 text-sm leading-relaxed">
                            {currentLanguage === 'pt' 
                              ? 'Você mantém o controle total: seu saldo não sai da corretora e você pode pausar ou encerrar quando quiser.' 
                              : 'You maintain full control: your balance never leaves the exchange and you can pause or stop anytime you want.'
                            }
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-xs text-green-400">
                        <span className="flex items-center space-x-2">
                          <span>✅</span>
                          <span>{currentLanguage === 'pt' ? 'Fundos protegidos na corretora' : 'Funds protected at exchange'}</span>
                        </span>
                        <span className="flex items-center space-x-2">
                          <span>✅</span>
                          <span>{currentLanguage === 'pt' ? 'Conexão oficial e segura via API' : 'Official and secure API connection'}</span>
                        </span>
                        <span className="flex items-center space-x-2">
                          <span>✅</span>
                          <span>{currentLanguage === 'pt' ? 'Controle total a qualquer momento' : 'Full control at any time'}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            {/* Demo do Robot - Abaixo do Hero */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="relative mt-16"
            >
              {/* Título da Seção */}
              <div className="text-center mb-8">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="text-3xl md:text-4xl font-black text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text mb-4"
                >
                  {currentLanguage === 'pt' 
                    ? 'Veja o Robô em Ação' 
                    : 'See the Robot in Action'
                  }
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="text-slate-400 text-lg max-w-2xl mx-auto"
                >
                  {currentLanguage === 'pt' 
                    ? 'Acompanhe em tempo real como nossa IA analisa o mercado e executa trades automaticamente para maximizar seus lucros.'
                    : 'Watch in real-time how our AI analyzes the market and executes trades automatically to maximize your profits.'
                  }
                </motion.p>
              </div>
              <div className="relative max-w-4xl mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-cyan-500/30 rounded-3xl blur-3xl animate-pulse"></div>
                <div className="relative bg-slate-800/70 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-2xl">
                  <RobotDemoLanding currentLanguage={currentLanguage} />
                </div>
              </div>
            </motion.div>
          </div>
        </section>
        {/* SEÇÃO 2: Statistics */}
        <section className="relative py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-slate-800/50 via-slate-900/30 to-slate-800/50 border-y border-slate-700/30">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                {currentLanguage === 'pt' ? 'Resultados em Tempo Real' : 'Real-Time Results'}
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                {currentLanguage === 'pt' 
                  ? 'Dados reais que comprovam a eficiência da nossa plataforma'
                  : 'Real data proving the efficiency of our platform'
                }
              </p>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { 
                  value: stats.trades.toLocaleString(), 
                  label: t.stats.trades, 
                  color: 'from-yellow-400 to-orange-500',
                  icon: '⚡'
                },
                { 
                  value: `${stats.uptime.toFixed(1)}%`, 
                  label: currentLanguage === 'pt' ? 'Taxa de Sucesso' : 'Success Rate', 
                  color: 'from-green-400 to-emerald-500',
                  icon: '📈'
                },
                { 
                  value: `$${stats.profit.toFixed(1)}M`, 
                  label: currentLanguage === 'pt' ? 'Lucro Total' : 'Total Profit', 
                  color: 'from-blue-400 to-cyan-500',
                  icon: '💰'
                },
                { 
                  value: stats.users.toLocaleString(), 
                  label: t.stats.users, 
                  color: 'from-purple-400 to-pink-500',
                  icon: '👥'
                }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative group"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-all duration-300`}></div>
                  <div className="relative bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 text-center hover:border-slate-600/70 transition-all duration-300">
                    <div className="text-3xl mb-3">{stat.icon}</div>
                    <div className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                      {stat.value}
                    </div>
                    <div className="text-gray-400 text-sm font-medium">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        {/* SEÇÃO 3: Programa de Afiliados */}
        <section className="relative py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-purple-900/20">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full px-4 py-2 mb-4">
                <span className="w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full animate-pulse"></span>
                <span className="text-purple-400 text-sm font-semibold">
                  {currentLanguage === 'pt' ? '💰 Programa de Afiliados' : '💰 Affiliate Program'}
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  {t.affiliate.subtitle}
                </span>
              </h2>
              <p className="text-slate-300 text-base max-w-2xl mx-auto mb-6">
                {t.affiliate.description}
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: '🎯',
                  title: t.affiliate.commission,
                  description: t.affiliate.commissionDesc,
                  color: 'from-green-400 to-emerald-500'
                },
                {
                  icon: '💰',
                  title: t.affiliate.withdrawal,
                  description: t.affiliate.withdrawalDesc,
                  color: 'from-blue-400 to-cyan-500'
                },
                {
                  icon: '📊',
                  title: t.affiliate.dashboard,
                  description: t.affiliate.dashboardDesc,
                  color: 'from-purple-400 to-pink-500'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="relative group"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-all duration-300`}></div>
                  <div className="relative bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center hover:border-slate-600/70 transition-all duration-300">
                    <div className="text-3xl mb-4">{feature.icon}</div>
                    <h3 className={`text-lg font-bold mb-3 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                      {feature.title}
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        {/* SEÇÃO 4: Final CTA */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              {/* Mensagem Final */}
              <div className="space-y-6">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">
                  <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 bg-clip-text text-transparent">
                    {currentLanguage === 'pt' 
                      ? 'Pronto para Transformar sua Vida Financeira?' 
                      : 'Ready to Transform Your Financial Life?'
                    }
                  </span>
                </h2>
                <p className="text-xl sm:text-2xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
                  {currentLanguage === 'pt' 
                    ? 'Junte-se a milhares de pessoas que já estão lucrando com nosso robô de IA.'
                    : 'Join thousands of people who are already profiting with our AI robot.'
                  }
                </p>
              </div>
              {/* CTA Final */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                onClick={() => {
                  router.push('/cadastro-new');
                  handleCTAClick('final_cta');
                }}
                className="relative group overflow-hidden w-72 mx-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-orange-500/30 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 transition-all duration-300"></div>
                <div className="relative bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-bold text-lg px-8 py-4 rounded-2xl transition-all duration-300 shadow-xl">
                  <span className="flex items-center justify-center space-x-3">
                    <span className="text-xl">🚀</span>
                    <span>{currentLanguage === 'pt' ? 'Comece Agora' : 'Start Now'}</span>
                    <span className="text-xl">💎</span>
                  </span>
                </div>
              </motion.button>
              {/* Garantias */}
              <div className="flex flex-wrap justify-center gap-6 text-slate-400">
                {[
                  { icon: '🔒', text: currentLanguage === 'pt' ? '100% Seguro' : '100% Secure' },
                  { icon: '⚡', text: currentLanguage === 'pt' ? 'Setup em 2 min' : '2-min setup' },
                  { icon: '💰', text: currentLanguage === 'pt' ? 'Só paga se lucrar' : 'Only pay if you profit' }
                ].map((guarantee, index) => (
                  <div key={index} className="flex items-center space-x-2 text-lg font-medium">
                    <span>{guarantee.icon}</span>
                    <span>{guarantee.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
        {/* Footer */}
        <footer className="relative bg-slate-900 border-t border-slate-700/50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto text-center">
            <div className="space-y-8">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-black font-black text-xl">₿</span>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">{t.footer.company}</h3>
                  <p className="text-slate-400 text-sm">MarketBot</p>
                </div>
              </div>
              <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed">
                {t.footer.description}
              </p>
              {/* Instagram & Social */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <p className="text-slate-200 text-lg mb-6 font-medium">
                  {currentLanguage === 'pt' ? 'Siga-nos no Instagram para dicas e atualizações!' : 'Follow us on Instagram for tips and updates!'}
                </p>
                <motion.a
                  href="https://instagram.com/coinbitclub"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative inline-flex items-center space-x-3 group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-2xl border-2 border-pink-400/50">
                    <span className="flex items-center space-x-3">
                      <span className="text-2xl">📷</span>
                      <span>@coinbitclub</span>
                    </span>
                  </div>
                </motion.a>
              </motion.div>
              <div className="space-y-4">
                <p className="text-slate-400 text-sm">
                  © 2024 {t.footer.company}. {t.footer.rights}
                </p>
                <div className="relative max-w-3xl mx-auto">
                  <p className="text-slate-400 text-sm p-4 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-orange-500/20">
                    <span className="text-orange-400 mr-2">⚠️</span>
                    <span className="font-semibold text-orange-400">{t.footer.risk}:</span>
                    {' '}{t.footer.riskText}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </footer>
        {/* Video Modal */}
        <AnimatePresence>
          {showVideoModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowVideoModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 50 }}
                className="bg-slate-800/95 backdrop-blur-lg rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-700/50"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-3xl font-black text-transparent bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text mb-2">
                      {currentLanguage === 'pt' ? 'Como Funciona o MARKETBOT' : 'How MARKETBOT Works'}
                    </h3>
                    <p className="text-slate-400 text-lg">
                      {currentLanguage === 'pt' 
                        ? 'Veja como nosso robô de IA executa trades automaticamente e gera lucros para você 24/7'
                        : 'See how our AI robot executes trades automatically and generates profits for you 24/7'
                      }
                    </p>
                  </div>
                  <button
                    onClick={() => setShowVideoModal(false)}
                    className="text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-slate-700/50 ml-4"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="relative aspect-video bg-slate-900/80 rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 z-10"></div>
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/u8Ylcs4LXg0?autoplay=1&rel=0&modestbranding=1"
                    title={currentLanguage === 'pt' ? 'Como Funciona o MARKETBOT - Trading Automatizado' : 'How MARKETBOT Works - Automated Trading'}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full relative z-20"
                  ></iframe>
                </div>
                {/* Destaques do Vídeo */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">🤖</span>
                      <h4 className="font-bold text-white">
                        {currentLanguage === 'pt' ? 'IA Avançada' : 'Advanced AI'}
                      </h4>
                    </div>
                    <p className="text-slate-300 text-sm">
                      {currentLanguage === 'pt' 
                        ? 'Veja como nossa IA analisa mercados em tempo real'
                        : 'See how our AI analyzes markets in real-time'
                      }
                    </p>
                  </div>
                  <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">⚡</span>
                      <h4 className="font-bold text-white">
                        {currentLanguage === 'pt' ? 'Execução Rápida' : 'Fast Execution'}
                      </h4>
                    </div>
                    <p className="text-slate-300 text-sm">
                      {currentLanguage === 'pt' 
                        ? 'Trades executados em milissegundos'
                        : 'Trades executed in milliseconds'
                      }
                    </p>
                  </div>
                  <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">💰</span>
                      <h4 className="font-bold text-white">
                        {currentLanguage === 'pt' ? 'Lucros Reais' : 'Real Profits'}
                      </h4>
                    </div>
                    <p className="text-slate-300 text-sm">
                      {currentLanguage === 'pt' 
                        ? 'Resultados comprovados de usuários reais'
                        : 'Proven results from real users'
                      }
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* FAQ Modal */}
        <AnimatePresence>
          {showFAQModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowFAQModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 50 }}
                className="bg-slate-800/95 backdrop-blur-lg rounded-3xl p-6 sm:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-700/50"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2">
                    <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">FAQ</span>
                  </h3>
                  <button
                    onClick={() => setShowFAQModal(false)}
                    className="text-slate-400 hover:text-white transition-colors p-2"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  {t.faq.map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-slate-700/50 rounded-xl overflow-hidden backdrop-blur-sm"
                    >
                      <button
                        onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                        className="w-full text-left p-4 sm:p-5 bg-slate-700/30 hover:bg-slate-700/50 transition-all duration-300 flex justify-between items-center group"
                      >
                        <span className="font-semibold text-white pr-4 group-hover:text-yellow-400 transition-colors text-sm sm:text-base">{faq.q}</span>
                        <span className={`text-yellow-400 text-lg sm:text-xl flex-shrink-0 transition-transform ${openFAQ === index ? 'rotate-180' : ''}`}>
                          ▼
                        </span>
                      </button>
                      <AnimatePresence>
                        {openFAQ === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-slate-800/60 backdrop-blur-sm"
                          >
                            <p className="p-4 sm:p-5 text-slate-200 leading-relaxed border-t border-slate-700/50 text-sm sm:text-base">{faq.a}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Floating Action Buttons */}
        <div className="fixed bottom-6 md:bottom-8 right-6 md:right-8 flex flex-col space-y-4 z-40">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowFAQModal(true)}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl hover:shadow-3xl transition-all border-2 border-blue-400/50">
              <span className="text-white text-xl md:text-2xl">❓</span>
            </div>
          </motion.button>
          <motion.a
            href="https://wa.me/5521999596652"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-green-500 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative w-14 h-14 md:w-16 md:h-16 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-2xl hover:shadow-3xl transition-all border-2 border-green-400/50">
              <span className="text-white text-xl md:text-2xl">💬</span>
            </div>
          </motion.a>
        </div>
      </div>
    </>
  );
}
