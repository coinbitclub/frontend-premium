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
    // Navegar para a página de cadastro
    router.push('/cadastro-new');
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
        subtitle: 'Você não precisa de mais sinais. Precisa de um sistema que pense por você!',
        highlightPhrase: 'Um trader profissional trabalhando para você 24/7.',
        cta: 'Comece Agora',
        watchDemo: 'Como Funciona'
      },
      stats: {
        users: 'Usuários Ativos',
        profit: 'Lucro Médio Diário',
        trades: 'Operações Realizadas',
        uptime: 'Uptime do Sistema'
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
          a: 'As comissões da CoinbitClub são simples, automáticas e 100% transparentes. Cobramos uma taxa fixa de 0,07% por operação, aplicada sobre o valor total da posição alavancada — o mesmo modelo usado pelas principais exchanges do mundo. Exemplo prático: Valor disponível na conta: US$ 100, Alavancagem padrão do MarketBot: 5×, Valor total operado: US$ 500, Taxa CoinbitClub: 0,07% × 500 = US$ 0,35 por operação.'
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
        description: 'O MarketBot nasceu para quem busca lucros reais, consistentes e comprovados.',
        contact: 'Contato',
        rights: 'Todos os direitos reservados.',
        risk: 'Aviso de Risco',
        riskText: 'Trading de criptomoedas envolve riscos. Investimentos passados não garantem retornos futuros.'
      }
    },
    en: {
      hero: {
        title: 'MARKETBOT',
        subtitle: 'You don\'t need more signals. You need a system that thinks for you!',
        highlightPhrase: 'A professional trader working for you automatically 24/7.',
        cta: 'Start Now for Free',
        watchDemo: 'How It Works'
      },
      stats: {
        users: 'Active Users',
        profit: 'Average Daily Profit',
        trades: 'Trades Executed',
        uptime: 'System Uptime'
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
          a: 'CoinbitClub commissions are simple, automatic and 100% transparent. We charge a fixed fee of 0.07% per operation, applied to the total value of the leveraged position — the same model used by major exchanges worldwide. Practical example: Available account value: US$ 100, MarketBot standard leverage: 5×, Total operated value: US$ 500, CoinbitClub fee: 0.07% × 500 = US$ 0.35 per operation.'
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
        description: 'MarketBot was born for those who seek real, consistent and proven profits.',
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
              
              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="text-white hover:text-yellow-400 focus:outline-none focus:text-yellow-400 transition-colors"
                  aria-label="Toggle menu"
                >
                  <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                    {showMobileMenu ? (
                      <path d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"/>
                    ) : (
                      <path d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"/>
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* Mobile Navigation Menu */}
          {showMobileMenu && (
            <div className="md:hidden absolute top-16 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/30 z-40">
              <div className="px-4 py-6 space-y-4">
                <button
                  onClick={() => { setShowFAQModal(true); setShowMobileMenu(false); }}
                  className="block w-full text-left text-slate-300 hover:text-yellow-400 transition-all duration-300 text-base font-medium py-2"
                >
                  FAQ
                </button>
                <button
                  onClick={() => { handleNavigation('/auth/login'); setShowMobileMenu(false); }}
                  className="block w-full text-left bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-semibold text-base px-4 py-3 rounded-lg transition-all duration-300 shadow-lg"
                >
                  Login
                </button>
                <button
                  onClick={() => { handleNavigation('/termos'); setShowMobileMenu(false); }}
                  className="block w-full text-left text-slate-300 hover:text-yellow-400 transition-all duration-300 text-base font-medium py-2"
                >
                  {currentLanguage === 'pt' ? 'Termos' : 'Terms'}
                </button>
                <button
                  onClick={() => { setShowVideoModal(true); setShowMobileMenu(false); }}
                  className="block w-full text-left text-slate-300 hover:text-yellow-400 transition-all duration-300 text-base font-medium py-2"
                >
                  {t.hero.watchDemo}
                </button>
                
                {/* Language Selector Mobile */}
                <div className="pt-4 border-t border-slate-700/50">
                  <div className="flex items-center justify-center space-x-2 bg-slate-800/50 backdrop-blur-sm rounded-lg p-2 border border-slate-700/50">
                    <button
                      onClick={() => handleLanguageChange('pt')}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                        currentLanguage === 'pt'
                          ? 'bg-yellow-500 text-black'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      PT
                    </button>
                    <button
                      onClick={() => handleLanguageChange('en')}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                        currentLanguage === 'en'
                          ? 'bg-yellow-500 text-black'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      EN
                    </button>
                  </div>
                </div>
                
                {/* CTA Button Mobile */}
                <div className="pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { handleCTAClick('mobile_header_cta'); setShowMobileMenu(false); }}
                    className="w-full relative group overflow-hidden bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-black text-lg px-8 py-4 rounded-xl transition-all duration-300 shadow-2xl"
                  >
                    {t.hero.cta}
                  </motion.button>
                </div>
              </div>
            </div>
          )}
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
                      {/* Leitura de volume e volatilidade */}
                      <motion.div 
                        className="flex items-center space-x-3 p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl hover:bg-blue-500/10 transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="text-blue-400 font-medium text-sm">
                          {currentLanguage === 'pt' ? 'Leitura de volume e volatilidade' : 'Volume and volatility reading'}
                        </span>
                      </motion.div>
                      {/* Retorno médio de ~10,8% ao mês */}
                      <motion.div 
                        className="flex items-center space-x-3 p-3 bg-purple-500/5 border border-purple-500/10 rounded-xl hover:bg-purple-500/10 transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="text-purple-400 font-medium text-sm">
                          {currentLanguage === 'pt' ? 'Retorno médio de ~10,8% ao mês' : 'Average return of ~10.8% per month'}
                        </span>
                      </motion.div>
                      {/* 86% de acerto comprovado */}
                      <motion.div 
                        className="flex items-center space-x-3 p-3 bg-green-500/5 border border-green-500/10 rounded-xl hover:bg-green-500/10 transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="text-green-400 font-medium text-sm">
                          {currentLanguage === 'pt' ? '86% de acerto comprovado' : '86% proven accuracy'}
                        </span>
                      </motion.div>
                      {/* Confirmações técnicas multitempo */}
                      <motion.div 
                        className="flex items-center space-x-3 p-3 bg-yellow-500/5 border border-yellow-500/10 rounded-xl hover:bg-yellow-500/10 transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="text-yellow-400 font-medium text-sm">
                          {currentLanguage === 'pt' ? 'Confirmações técnicas multitempo' : 'Multi-timeframe technical confirmations'}
                        </span>
                      </motion.div>
                      {/* Taxa fixa de 0,07% por operação */}
                      <motion.div 
                        className="flex items-center space-x-3 p-3 bg-cyan-500/5 border border-cyan-500/10 rounded-xl hover:bg-cyan-500/10 transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="text-cyan-400 font-medium text-sm">
                          {currentLanguage === 'pt' ? 'Taxa fixa de 0,07% por operação' : 'Fixed 0.07% fee per trade'}
                        </span>
                      </motion.div>
                      {/* Análise inteligente de tendência */}
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
                            ? 'Análise inteligente de tendência' 
                            : 'Intelligent trend analysis'
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
                          ? 'Seu Dinheiro Sempre Seguro e 100% Sob Seu Controle' 
                          : 'Your Money Always Safe and 100% Under Your Control'
                        }
                      </h4>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex items-start space-x-3">
                          <span className="text-blue-400 text-sm mt-1">🔹</span>
                          <p className="text-slate-300 text-sm leading-relaxed">
                            {currentLanguage === 'pt' 
                              ? 'Nossa conexão é feita apenas via API oficial das corretoras, utilizada exclusivamente para executar operações automáticas em sua conta.' 
                              : 'Our connection is made only via official exchange APIs, used exclusively to execute automatic operations in your account.'
                            }
                          </p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <span className="text-blue-400 text-sm mt-1">🔹</span>
                          <p className="text-slate-300 text-sm leading-relaxed">
                            {currentLanguage === 'pt' 
                              ? 'Seus fundos permanecem na corretora — o MarketBot nunca movimenta valores diretamente.' 
                              : 'Your funds remain at the exchange — MarketBot never moves funds directly.'
                            }
                          </p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <span className="text-blue-400 text-sm mt-1">🔹</span>
                          <p className="text-slate-300 text-sm leading-relaxed">
                            {currentLanguage === 'pt' 
                              ? 'Você mantém o controle total: pode pausar, encerrar ou desconectar a qualquer momento.' 
                              : 'You maintain full control: can pause, stop or disconnect at any time.'
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
                          <span>{currentLanguage === 'pt' ? 'Controle total e imediato' : 'Total and immediate control'}</span>
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
                {currentLanguage === 'pt' ? 'Resultados Reais, Atualizados em Tempo Real' : 'Real Results, Updated in Real Time'}
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                {currentLanguage === 'pt' 
                  ? 'Transparência total: números que comprovam a eficiência do MarketBot.'
                  : 'Total transparency: numbers that prove MarketBot\'s efficiency.'
                }
              </p>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { 
                  value: '3.123+', 
                  label: currentLanguage === 'pt' ? 'Operações Executadas' : 'Operations Executed', 
                  color: 'from-yellow-400 to-orange-500',
                  icon: '⚡'
                },
                { 
                  value: '86,2%', 
                  label: currentLanguage === 'pt' ? 'Taxa de Acerto Real' : 'Real Success Rate', 
                  color: 'from-green-400 to-emerald-500',
                  icon: '📈'
                },
                { 
                  value: 'US$ 1,8 M', 
                  label: currentLanguage === 'pt' ? 'Lucro Gerado aos Usuários' : 'Profit Generated for Users', 
                  color: 'from-blue-400 to-cyan-500',
                  icon: '💰'
                },
                { 
                  value: '5.182', 
                  label: currentLanguage === 'pt' ? 'Usuários Ativos' : 'Active Users', 
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
                      ? 'Pronto para ver seu dinheiro trabalhar por você?' 
                      : 'Ready to see your money work for you?'
                    }
                  </span>
                </h2>
                <p className="text-xl sm:text-2xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
                  {currentLanguage === 'pt' 
                    ? 'Junte-se aos milhares de usuários que já estão lucrando com o MarketBot — Mais resultado. Menos taxa. 100% no seu controle.'
                    : 'Join thousands of users who are already profiting with MarketBot — Better results. Lower fees. 100% under your control.'
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
                  { icon: '🔒', text: currentLanguage === 'pt' ? '100% Seguro — fundos sempre na sua corretora' : '100% Secure — funds always at your exchange' },
                  { icon: '⚙️', text: currentLanguage === 'pt' ? 'Setup em menos de 2 minutos' : 'Setup in less than 2 minutes' },
                  { icon: '�', text: currentLanguage === 'pt' ? 'Taxa fixa de apenas 0,07% por operação' : 'Fixed fee of only 0.07% per operation' }
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
              <p className="text-yellow-400 max-w-2xl mx-auto leading-relaxed font-semibold">
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
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative inline-flex items-center space-x-3 group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-all duration-300 animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 hover:from-pink-400 hover:via-purple-400 hover:to-pink-400 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl border border-pink-300/30 group-hover:shadow-pink-500/25">
                    <span className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                          <span className="text-2xl filter drop-shadow-lg">📷</span>
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-ping"></div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                      </div>
                      <div className="text-left">
                        <div className="font-black text-xl">@coinbitclub</div>
                        <div className="text-pink-100 text-sm font-medium opacity-90">
                          {currentLanguage === 'pt' ? 'Seguir no Instagram' : 'Follow on Instagram'}
                        </div>
                      </div>
                      <div className="text-2xl group-hover:rotate-12 transition-transform duration-300">
                        ➤
                      </div>
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

                {/* Informações Detalhadas Complementares */}
                <div className="mt-8 space-y-8">
                  {/* Título da Seção Detalhada */}
                  <div className="text-center border-t border-slate-700/50 pt-8">
                    <h3 className="text-2xl font-bold text-white mb-4">
                      {currentLanguage === 'pt' 
                        ? 'Entenda Como o MarketBot Opera na Prática' 
                        : 'Understand How MarketBot Works in Practice'
                      }
                    </h3>
                    <p className="text-slate-400 max-w-3xl mx-auto">
                      {currentLanguage === 'pt' 
                        ? 'O MarketBot CoinbitClub é um sistema de trading automatizado com inteligência artificial, projetado para operar 24 horas por dia, executando estratégias inteligentes que unem rentabilidade, segurança e gestão de risco real. Tudo acontece diretamente na sua conta Binance ou Bybit, com transparência total e controle absoluto.'
                        : 'MarketBot CoinbitClub is an automated trading system with artificial intelligence, designed to operate 24 hours a day, executing intelligent strategies that combine profitability, security and real risk management. Everything happens directly in your Binance or Bybit account, with total transparency and absolute control.'
                      }
                    </p>
                  </div>

                  {/* 1. Inteligência que Opera com Precisão */}
                  <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl p-6 border border-blue-500/20">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="text-3xl">🧠</span>
                      <h4 className="text-xl font-bold text-white">
                        {currentLanguage === 'pt' 
                          ? '1. Inteligência que Opera com Precisão de Trader Profissional'
                          : '1. Intelligence that Operates with Professional Trader Precision'
                        }
                      </h4>
                    </div>
                    <p className="text-slate-300 mb-4">
                      {currentLanguage === 'pt' 
                        ? 'O MarketBot monitora continuamente o mercado, detectando oportunidades e executando ordens automaticamente, sem intervenção manual. Ele combina análises técnicas e de comportamento do mercado para tomar decisões rápidas e eficientes, baseadas em:'
                        : 'MarketBot continuously monitors the market, detecting opportunities and executing orders automatically, without manual intervention. It combines technical and market behavior analysis to make quick and efficient decisions, based on:'
                      }
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-400">✓</span>
                        <span className="text-slate-300 text-sm">
                          {currentLanguage === 'pt' 
                            ? 'Leitura de volume, volatilidade e direção de tendência'
                            : 'Volume, volatility and trend direction reading'
                          }
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-400">✓</span>
                        <span className="text-slate-300 text-sm">
                          {currentLanguage === 'pt' 
                            ? 'Confirmações técnicas multitempo (curto e médio prazo)'
                            : 'Multi-timeframe technical confirmations (short and medium term)'
                          }
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-400">✓</span>
                        <span className="text-slate-300 text-sm">
                          {currentLanguage === 'pt' 
                            ? 'Gestão automática de stop loss e take profit'
                            : 'Automatic stop loss and take profit management'
                          }
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-400">✓</span>
                        <span className="text-slate-300 text-sm">
                          {currentLanguage === 'pt' 
                            ? 'Filtragem de sinais para evitar ruído e operações impulsivas'
                            : 'Signal filtering to avoid noise and impulsive operations'
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 2. Operações Seguras */}
                  <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-500/20">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="text-3xl">💼</span>
                      <h4 className="text-xl font-bold text-white">
                        {currentLanguage === 'pt' 
                          ? '2. Operações Seguras e Transparentes'
                          : '2. Safe and Transparent Operations'
                        }
                      </h4>
                    </div>
                    <p className="text-slate-300 mb-4">
                      {currentLanguage === 'pt' 
                        ? 'As operações são executadas diretamente na sua conta da Binance ou Bybit, por meio da API oficial das corretoras. A CoinbitClub não tem acesso aos seus fundos — apenas permissão para abrir e fechar ordens de trading.'
                        : 'Operations are executed directly in your Binance or Bybit account, through the official exchange API. CoinbitClub has no access to your funds — only permission to open and close trading orders.'
                      }
                    </p>
                    <div className="bg-green-500/20 rounded-lg p-4 border border-green-500/30">
                      <div className="flex items-center space-x-2">
                        <span className="text-green-400 text-xl">💡</span>
                        <span className="text-green-200 font-semibold">
                          {currentLanguage === 'pt' 
                            ? 'Você acompanha todas as posições ao vivo, diretamente na conta da exchange, sem precisar abrir o painel da CoinbitClub.'
                            : 'You track all positions live, directly in the exchange account, without needing to open the CoinbitClub panel.'
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 3. Demonstração Visual das Operações */}
                  <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-500/20">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="text-3xl">📊</span>
                      <h4 className="text-xl font-bold text-white">
                        {currentLanguage === 'pt' 
                          ? '3. Estratégia e Gestão de Risco'
                          : '3. Strategy and Risk Management'
                        }
                      </h4>
                    </div>
                    <p className="text-slate-300 mb-6">
                      {currentLanguage === 'pt' 
                        ? 'O MarketBot trabalha com uma estratégia de proteção de capital desenhada para maximizar retorno e limitar exposição.'
                        : 'MarketBot works with a capital protection strategy designed to maximize return and limit exposure.'
                      }
                    </p>
                    
                    {/* Tabela de Parâmetros */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-purple-500/30">
                            <th className="text-left py-2 px-3 text-purple-300 font-semibold">
                              {currentLanguage === 'pt' ? 'Parâmetro' : 'Parameter'}
                            </th>
                            <th className="text-left py-2 px-3 text-purple-300 font-semibold">
                              {currentLanguage === 'pt' ? 'Valor padrão' : 'Default value'}
                            </th>
                            <th className="text-left py-2 px-3 text-purple-300 font-semibold">
                              {currentLanguage === 'pt' ? 'Máx. personalização' : 'Max. customization'}
                            </th>
                            <th className="text-left py-2 px-3 text-purple-300 font-semibold">
                              {currentLanguage === 'pt' ? 'Descrição' : 'Description'}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="text-slate-300">
                          <tr className="border-b border-slate-700/30">
                            <td className="py-2 px-3 font-medium">
                              {currentLanguage === 'pt' ? 'Alavancagem' : 'Leverage'}
                            </td>
                            <td className="py-2 px-3">5×</td>
                            <td className="py-2 px-3">
                              {currentLanguage === 'pt' ? 'até 10×' : 'up to 10×'}
                            </td>
                            <td className="py-2 px-3 text-xs">
                              {currentLanguage === 'pt' 
                                ? 'Potencializa o lucro com controle de risco'
                                : 'Amplifies profit with risk control'
                              }
                            </td>
                          </tr>
                          <tr className="border-b border-slate-700/30">
                            <td className="py-2 px-3 font-medium">
                              {currentLanguage === 'pt' ? 'Valor por operação' : 'Value per operation'}
                            </td>
                            <td className="py-2 px-3">
                              {currentLanguage === 'pt' ? '10% do saldo' : '10% of balance'}
                            </td>
                            <td className="py-2 px-3">
                              {currentLanguage === 'pt' ? 'até 20%' : 'up to 20%'}
                            </td>
                            <td className="py-2 px-3 text-xs">
                              {currentLanguage === 'pt' 
                                ? 'Percentual do saldo usado por trade'
                                : 'Percentage of balance used per trade'
                              }
                            </td>
                          </tr>
                          <tr className="border-b border-slate-700/30">
                            <td className="py-2 px-3 font-medium">
                              {currentLanguage === 'pt' ? 'Operações simultâneas' : 'Simultaneous operations'}
                            </td>
                            <td className="py-2 px-3">
                              {currentLanguage === 'pt' ? '3 (fixo)' : '3 (fixed)'}
                            </td>
                            <td className="py-2 px-3">—</td>
                            <td className="py-2 px-3 text-xs">
                              {currentLanguage === 'pt' 
                                ? 'Trabalha com até 3 ativos diferentes simultaneamente'
                                : 'Works with up to 3 different assets simultaneously'
                              }
                            </td>
                          </tr>
                          <tr className="border-b border-slate-700/30">
                            <td className="py-2 px-3 font-medium">
                              {currentLanguage === 'pt' ? 'Exposição total máxima' : 'Maximum total exposure'}
                            </td>
                            <td className="py-2 px-3">
                              {currentLanguage === 'pt' ? '30% do saldo' : '30% of balance'}
                            </td>
                            <td className="py-2 px-3">
                              {currentLanguage === 'pt' ? 'até 60%' : 'up to 60%'}
                            </td>
                            <td className="py-2 px-3 text-xs">
                              {currentLanguage === 'pt' 
                                ? 'Protege o capital em caso de volatilidade extrema'
                                : 'Protects capital in case of extreme volatility'
                              }
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2 px-3 font-medium text-yellow-400">
                              {currentLanguage === 'pt' ? 'Taxa CoinbitClub' : 'CoinbitClub Fee'}
                            </td>
                            <td className="py-2 px-3 text-yellow-400 font-semibold">0,07%</td>
                            <td className="py-2 px-3">—</td>
                            <td className="py-2 px-3 text-xs">
                              {currentLanguage === 'pt' 
                                ? 'Aplicada sobre o valor total da posição alavancada'
                                : 'Applied on the total value of the leveraged position'
                              }
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 4. Saldo CoinbitClub */}
                  <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-2xl p-6 border border-yellow-500/20">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="text-3xl">💰</span>
                      <h4 className="text-xl font-bold text-white">
                        {currentLanguage === 'pt' 
                          ? '4. Saldo CoinbitClub e Pagamento da Comissão'
                          : '4. CoinbitClub Balance and Commission Payment'
                        }
                      </h4>
                    </div>
                    <p className="text-slate-300 mb-4">
                      {currentLanguage === 'pt' 
                        ? 'Para garantir que o sistema opere corretamente, cada usuário mantém um saldo operacional na CoinbitClub. Esse saldo é utilizado exclusivamente para o pagamento automático da taxa de 0,07% por operação.'
                        : 'To ensure the system operates correctly, each user maintains an operational balance at CoinbitClub. This balance is used exclusively for automatic payment of the 0.07% fee per operation.'
                      }
                    </p>

                    {/* Como o pagamento da taxa funciona */}
                    <div className="bg-yellow-500/20 rounded-lg p-4 border border-yellow-500/30 mb-4">
                      <h5 className="text-yellow-300 font-semibold mb-3">
                        {currentLanguage === 'pt' ? 'Como o pagamento da taxa funciona:' : 'How fee payment works:'}
                      </h5>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <span className="text-yellow-400 mt-1">🔒</span>
                          <span className="text-slate-300 text-sm">
                            {currentLanguage === 'pt' 
                              ? 'A CoinbitClub não tem acesso aos seus fundos.'
                              : 'CoinbitClub has no access to your funds.'
                            }
                          </span>
                        </div>
                        <div className="flex items-start space-x-3">
                          <span className="text-yellow-400 mt-1">💰</span>
                          <span className="text-slate-300 text-sm">
                            {currentLanguage === 'pt' 
                              ? 'Para que as operações possam ser abertas, o usuário mantém um saldo operacional interno na CoinbitClub, usado exclusivamente para cobrir a taxa de 0,07% por operação.'
                              : 'For operations to be opened, the user maintains an internal operational balance at CoinbitClub, used exclusively to cover the 0.07% fee per operation.'
                            }
                          </span>
                        </div>
                        <div className="flex items-start space-x-3">
                          <span className="text-yellow-400 mt-1">⚡</span>
                          <span className="text-slate-300 text-sm">
                            {currentLanguage === 'pt' 
                              ? 'O desconto ocorre somente quando uma nova posição é aberta, e o valor é calculado com base no tamanho total da posição alavancada.'
                              : 'The deduction occurs only when a new position is opened, and the amount is calculated based on the total size of the leveraged position.'
                            }
                          </span>
                        </div>
                        <div className="flex items-start space-x-3">
                          <span className="text-yellow-400 mt-1">⛔</span>
                          <span className="text-slate-300 text-sm">
                            {currentLanguage === 'pt' 
                              ? 'Se o saldo operacional estiver zerado, novas operações não são iniciadas até que o saldo seja recarregado.'
                              : 'If the operational balance is zero, new operations are not started until the balance is recharged.'
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Exemplo Prático */}
                    <div className="bg-yellow-500/20 rounded-lg p-4 border border-yellow-500/30">
                      <h5 className="text-yellow-300 font-semibold mb-2">
                        {currentLanguage === 'pt' ? '🪙 Exemplo prático:' : '🪙 Practical example:'}
                      </h5>
                      <div className="text-slate-300 text-sm space-y-1">
                        <p>
                          {currentLanguage === 'pt' 
                            ? 'Saldo na corretora: 100 USDT → Alavancagem padrão: 5× → Posição total: 500 USDT'
                            : 'Exchange balance: 100 USDT → Default leverage: 5× → Total position: 500 USDT'
                          }
                        </p>
                        <p className="text-yellow-300 font-semibold">
                          {currentLanguage === 'pt' 
                            ? 'Taxa CoinbitClub (0,07%) = US$ 0,35 por operação'
                            : 'CoinbitClub fee (0.07%) = US$ 0.35 per operation'
                          }
                        </p>
                        <p className="text-xs text-slate-400">
                          {currentLanguage === 'pt' 
                            ? 'O sistema deduz automaticamente esse valor do saldo CoinbitClub toda vez que uma nova posição é aberta.'
                            : 'The system automatically deducts this amount from the CoinbitClub balance every time a new position is opened.'
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 5. Resultados Reais */}
                  <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-2xl p-6 border border-green-500/20">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="text-3xl">📈</span>
                      <h4 className="text-xl font-bold text-white">
                        {currentLanguage === 'pt' 
                          ? '5. Resultados Reais (dados auditados)'
                          : '5. Real Results (audited data)'
                        }
                      </h4>
                    </div>
                    <p className="text-slate-300 mb-4">
                      {currentLanguage === 'pt' 
                        ? 'Com base em 1 ano de operação real, o MarketBot apresentou o seguinte desempenho:'
                        : 'Based on 1 year of real operation, MarketBot presented the following performance:'
                      }
                    </p>
                    
                    {/* Observação Importante */}
                    <div className="bg-blue-500/20 rounded-lg p-4 border border-blue-500/30 mb-6">
                      <div className="flex items-start space-x-3">
                        <span className="text-blue-400 text-xl mt-1">💡</span>
                        <div>
                          <h5 className="text-blue-300 font-semibold mb-2">
                            {currentLanguage === 'pt' ? 'Observação importante:' : 'Important note:'}
                          </h5>
                          <div className="text-slate-300 text-sm space-y-2">
                            <p>
                              {currentLanguage === 'pt' 
                                ? 'Os valores referem-se ao período de 12 meses simulados com reinvestimento automático.'
                                : 'Values refer to a 12-month period simulated with automatic reinvestment.'
                              }
                            </p>
                            <p>
                              {currentLanguage === 'pt' 
                                ? 'O capital inicial de US$ 100 representava 10% do saldo total. À medida que os lucros foram sendo obtidos, o sistema realizou reinvestimento automático, mantendo sempre as proporções de operação fixas (10% por trade, 3 operações simultâneas, alavancagem 5×, conforme default).'
                                : 'The initial capital of US$ 100 represented 10% of the total balance. As profits were obtained, the system performed automatic reinvestment, always maintaining fixed operation proportions (10% per trade, 3 simultaneous operations, 5× leverage, as default).'
                              }
                            </p>
                            <p className="text-blue-300 font-medium">
                              {currentLanguage === 'pt' 
                                ? 'Assim, o crescimento ocorreu de forma composta, respeitando os limites de exposição definidos na gestão de risco.'
                                : 'Thus, growth occurred in a compound manner, respecting the exposure limits defined in risk management.'
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-slate-700/30">
                          <span className="text-slate-400 text-sm">
                            {currentLanguage === 'pt' ? 'Capital inicial do usuário' : 'User initial capital'}
                          </span>
                          <span className="text-white font-semibold">
                            {currentLanguage === 'pt' ? 'US$ 100 (10% do saldo total inicial)' : 'US$ 100 (10% of initial total balance)'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-700/30">
                          <span className="text-slate-400 text-sm">
                            {currentLanguage === 'pt' ? 'Alavancagem utilizada' : 'Leverage used'}
                          </span>
                          <span className="text-white font-semibold">
                            {currentLanguage === 'pt' ? '5× (posição total US$ 500)' : '5× (total position US$ 500)'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-700/30">
                          <span className="text-slate-400 text-sm">
                            {currentLanguage === 'pt' ? 'Taxa de acerto' : 'Success rate'}
                          </span>
                          <span className="text-green-400 font-semibold">86,42%</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-700/30">
                          <span className="text-slate-400 text-sm">
                            {currentLanguage === 'pt' ? 'Total de operações' : 'Total operations'}
                          </span>
                          <span className="text-white font-semibold">
                            {currentLanguage === 'pt' ? '530 trades auditados' : '530 audited trades'}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-slate-700/30">
                          <span className="text-slate-400 text-sm">
                            {currentLanguage === 'pt' ? 'Lucro bruto anual' : 'Annual gross profit'}
                          </span>
                          <span className="text-green-400 font-semibold">+587,32 USDT</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-700/30">
                          <span className="text-slate-400 text-sm">
                            {currentLanguage === 'pt' ? 'Taxa total (CoinbitClub + exchange)' : 'Total fee (CoinbitClub + exchange)'}
                          </span>
                          <span className="text-white font-semibold">
                            {currentLanguage === 'pt' ? '0,10% por operação' : '0.10% per operation'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-700/30">
                          <span className="text-slate-400 text-sm">
                            {currentLanguage === 'pt' ? 'Lucro líquido final' : 'Final net profit'}
                          </span>
                          <span className="text-green-400 font-semibold">+314,37 USDT</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-700/30">
                          <span className="text-slate-400 text-sm">
                            {currentLanguage === 'pt' ? 'ROI líquido anual (sobre US$ 100)' : 'Annual net ROI (on US$ 100)'}
                          </span>
                          <span className="text-green-400 font-bold text-lg">+314%</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-700/30">
                          <span className="text-slate-400 text-sm">
                            {currentLanguage === 'pt' ? 'Rentabilidade média mensal' : 'Average monthly return'}
                          </span>
                          <span className="text-green-400 font-bold">≈ 10,8%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 6. Modelo de Cobrança */}
                  <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl p-6 border border-indigo-500/20">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="text-3xl">💵</span>
                      <h4 className="text-xl font-bold text-white">
                        {currentLanguage === 'pt' 
                          ? '6. Modelo de Cobrança Justo e Simples'
                          : '6. Fair and Simple Pricing Model'
                        }
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-indigo-400">✓</span>
                          <span className="text-slate-300">
                            <strong>
                              {currentLanguage === 'pt' ? 'Taxa única:' : 'Single fee:'}
                            </strong>{' '}
                            {currentLanguage === 'pt' 
                              ? '0,07% sobre o valor da operação (por trade)'
                              : '0.07% on the operation value (per trade)'
                            }
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-indigo-400">✓</span>
                          <span className="text-slate-300">
                            <strong>
                              {currentLanguage === 'pt' ? 'Cobrança automática:' : 'Automatic billing:'}
                            </strong>{' '}
                            {currentLanguage === 'pt' 
                              ? 'apenas quando o sistema executa uma nova posição'
                              : 'only when the system executes a new position'
                            }
                          </span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-indigo-400">✓</span>
                          <span className="text-slate-300">
                            <strong>
                              {currentLanguage === 'pt' ? 'Sem mensalidades,' : 'No monthly fees,'}
                            </strong>{' '}
                            {currentLanguage === 'pt' 
                              ? 'comissões ou custos fixos'
                              : 'commissions or fixed costs'
                            }
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-indigo-400">✓</span>
                          <span className="text-slate-300">
                            <strong>
                              {currentLanguage === 'pt' ? 'Transparência total:' : 'Total transparency:'}
                            </strong>{' '}
                            {currentLanguage === 'pt' 
                              ? 'tudo é visível nas suas operações e relatórios'
                              : 'everything is visible in your operations and reports'
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 bg-indigo-500/20 rounded-lg p-4 border border-indigo-500/30">
                      <div className="flex items-center space-x-2">
                        <span className="text-indigo-400 text-xl">⚙️</span>
                        <span className="text-indigo-200">
                          {currentLanguage === 'pt' 
                            ? 'Você só precisa manter saldo suficiente na sua conta CoinbitClub para cobrir a taxa de operação. O restante do seu capital permanece sempre na corretora, sob sua custódia.'
                            : 'You only need to maintain sufficient balance in your CoinbitClub account to cover the operation fee. The rest of your capital always remains at the exchange, under your custody.'
                          }
                        </span>
                      </div>
                    </div>
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
            href="https://wa.me/5521995966652"
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
