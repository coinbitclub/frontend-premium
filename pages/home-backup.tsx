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
  const [showHowItWorksModal, setShowHowItWorksModal] = useState(false);
  const [showFAQModal, setShowFAQModal] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [stats, setStats] = useState({
    users: 0,
    profit: 0,
    trades: 0,
    uptime: 0
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
    
    // Animated counter for legacy stats
    const legacyInterval = setInterval(() => {
      setStats(prev => ({
        users: Math.min(prev.users + Math.floor(Math.random() * 5) + 1, 12847),
        profit: Math.min(prev.profit + Math.floor(Math.random() * 0.3) + 0.1, 342.7),
        trades: Math.min(prev.trades + Math.floor(Math.random() * 50) + 10, 2847562),
        uptime: Math.min(prev.uptime + 0.01, 99.9)
      }));
    }, 150);

    setTimeout(() => clearInterval(legacyInterval), 3000);
    
    return () => clearInterval(legacyInterval);
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setCurrentLanguage(lang);
    try {
      localStorage.setItem('coinbitclub-language', lang);
      
      // Analytics
      if (typeof gtag !== 'undefined') {
        gtag('event', 'language_change', {
          event_category: 'UI',
          event_label: lang
        });
      }
    } catch (error) {
      console.warn('Error saving language:', error);
    }
  };

  const handleNavigation = (path: string) => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'navigation_click', {
        event_category: 'Navigation',
        event_label: path
      });
    }
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

  const [operationStats, setOperationStats] = useState({
    totalTrades: 8473,
    successRate: 84.7,
    totalProfit: 1847950.50,
    activeUsers: 5247
  });

  useEffect(() => {
    setMounted(true);
    
    // Analytics - track landing page view
    if (typeof gtag !== 'undefined') {
      gtag('event', 'landing_page_view', {
        page_title: 'Landing Page',
        language: currentLanguage,
        event_category: 'engagement'
      });
    }
    
    // Carregar idioma do localStorage
    try {
      const savedLanguage = localStorage.getItem('coinbitclub-language') as Language;
      if (savedLanguage && (savedLanguage === 'pt' || savedLanguage === 'en')) {
        setCurrentLanguage(savedLanguage);
      }
    } catch (error) {
      console.warn('Error loading language:', error);
    }
    
    // Animated counter for legacy stats
    const legacyInterval = setInterval(() => {
      setStats(prev => ({
        users: Math.min(prev.users + Math.floor(Math.random() * 5) + 1, 12847),
        profit: Math.min(prev.profit + Math.floor(Math.random() * 0.3) + 0.1, 342.7),
        trades: Math.min(prev.trades + Math.floor(Math.random() * 50) + 10, 2847562),
        uptime: Math.min(prev.uptime + 0.01, 99.9)
      }));
    }, 150);

    setTimeout(() => clearInterval(legacyInterval), 3000);
    
    return () => clearInterval(legacyInterval);
  }, []);

  // Textos por idioma
  const texts = {
    pt: {
      title: 'MARKETBOT',
      subtitle: 'a IA DE TRADE AUTOMATIZADO que transforma sinais em',
      highlight: 'LUCR0 EM DÓLAR',
      description: 'O robô que só lucra se você lucrar! Conecte sua conta Binance ou Bybit e comece a lucrar em poucos cliques.',
      freeTrialBtn: '🚀 Teste Grátis 7 Dias',
      watchDemoBtn: '🎥 Como Funciona',
      stats: {
        trades: 'Operações',
        successRate: 'Taxa de Sucesso',
        totalProfit: 'Lucro Total',
        activeUsers: 'Usuários Ativos'
      },
      demo: {
        title: '',
        subtitle: ''
      },
      howItWorks: {
        title: 'Como Funciona o MARKETBOT',
        subtitle: 'Entenda em 2 minutos como transformamos sinais em lucros reais'
      },

      faq: {
        title: 'Perguntas Frequentes',
        questions: [
          {
            q: "Como funciona o período de teste grátis?",
            a: "Você tem 7 dias para testar todas as funcionalidades do robô em modo TESTNET, sem risco ao seu capital."
          },
          {
            q: "O robô realmente só lucra se eu lucrar?",
            a: "Sim! Cobramos apenas comissão sobre os lucros reais. Se não há lucro, não há cobrança(avalie os planos disponíveis)."
          },
          {
            q: "Qual o valor mínimo para começar?",
            a: "O valor mínimo varia conforme o plano escolhido, começando a partir de R$150 ou R$30USD, conforme país"
          },
          {
            q: "É seguro deixar o robô operando sozinho?",
            a: "Sim! Nosso sistema possui múltiplas camadas de segurança, stop-loss automático e opera apenas com capital que você define como limite."
          }
        ]
      },
      footer: {
        description: 'MARKETBOT: o robô de trade automático que só lucra se você lucrar. Tecnologia de ponta para maximizar seus resultados no mercado de criptomoedas.',
        contact: 'Contato',
        hours: 'Horário',
        support: 'Suporte 24/7',
        rights: 'Todos os direitos reservados.',
        secure: 'SSL Seguro',
        protected: 'Dados Protegidos',
        audited: 'Auditado'
      }
    },
    en: {
      title: 'MARKETBOT',
      subtitle: 'the AUTOMATED TRADING AI that transforms signals into',
      highlight: 'DOLLAR PROFIT',
      description: 'The robot that works 24/7 and only profits if you profit! Connect your Binance or Bybit account and start earning in just a few clicks.',
      freeTrialBtn: '🚀 Free 7-Day Trial',
      watchDemoBtn: '🎥 How It Works',
      stats: {
        trades: 'Trades',
        successRate: 'Success Rate',
        totalProfit: 'Total Profit',
        activeUsers: 'Active Users'
      },
      demo: {
        title: '',
        subtitle: ''
      },
      howItWorks: {
        title: 'How MARKETBOT Works',
        subtitle: 'Understand in 2 minutes how we transform signals into real profits'
      },

      faq: {
        title: 'Frequently Asked Questions',
        questions: [
          {
            q: "How does the free trial period work?",
            a: "You have 7 days to test all robot features in TESTNET mode, with no risk to your capital."
          },
          {
            q: "Does the robot really only profit if I profit?",
            a: "Yes! We only charge commission on real profits. If there's no profit, there's no charge (check available plans)."
          },
          {
            q: "What's the minimum amount to start?",
            a: "The minimum amount varies by chosen plan, starting from $150 BRL or $30 USD, depending on the country."
          },
          {
            q: "Is it safe to let the robot operate alone?",
            a: "Yes! Our system has multiple security layers, automatic stop-loss, and only operates with capital you define as limit."
          }
        ]
      },
      footer: {
        description: 'MARKETBOT: the automated trading robot that only profits if you profit. Cutting-edge technology to maximize your results in the cryptocurrency market.',
        contact: 'Contact',
        hours: 'Hours',
        support: '24/7 Support',
        rights: 'All rights reserved.',
        secure: 'SSL Secure',
        protected: 'Data Protected',
        audited: 'Audited'
      }
    }
  };

  const t = texts[currentLanguage];

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
            <span className="text-black font-bold text-xl">₿</span>
          </div>
          <p className="text-gray-400">
            {currentLanguage === 'pt' ? 'Carregando...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>
          {currentLanguage === 'pt' 
            ? 'CoinBitClub MarketBot - IA de trading automatizado que só ganha se você ganhar' 
            : 'CoinBitClub MarketBot - AI Trading Bot That Only Wins If You Win'
          }
        </title>
        <meta 
          name="description" 
          content={currentLanguage === 'pt' 
            ? "Ganhe em dólar no piloto automático 24/7. Comissão apenas sobre lucros reais. Teste grátis 7 dias!" 
            : "Earn dollars on autopilot 24/7. Commission only on real profits. Free 7-day trial!"
          } 
        />
        <meta 
          name="keywords" 
          content={currentLanguage === 'pt' 
            ? "trading automatizado, criptomoedas, bitcoin, bot trading, IA trading, robô trading, binance, bybit, lucro automático, trading bot" 
            : "automated trading, cryptocurrency, bitcoin, trading bot, AI trading, robot trading, binance, bybit, automatic profit, crypto bot"
          } 
        />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={
          currentLanguage === 'pt' 
            ? 'CoinBitClub MarketBot - IA de trading automatizado que só ganha se você ganhar' 
            : 'CoinBitClub MarketBot - AI Trading Bot That Only Wins If You Win'
        } />
        <meta property="og:description" content={
          currentLanguage === 'pt' 
            ? "Ganhe em dólar no piloto automático 24/7. Comissão apenas sobre lucros reais. Teste grátis 7 dias!" 
            : "Earn dollars on autopilot 24/7. Commission only on real profits. Free 7-day trial!"
        } />
        <meta property="og:image" content="https://coinbitclub.com/logo-nova.jpg" />
        <meta property="og:url" content="https://coinbitclub.com/home" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:title" content={
          currentLanguage === 'pt' 
            ? 'CoinBitClub MarketBot - IA de trading automatizado que só ganha se você ganhar' 
            : 'CoinBitClub MarketBot - AI Trading Bot That Only Wins If You Win'
        } />
        <meta name="twitter:description" content={
          currentLanguage === 'pt' 
            ? "Ganhe em dólar no piloto automático 24/7. Teste grátis 7 dias." 
            : "Earn dollars on autopilot 24/7. Free 7-day trial."
        } />
        <meta name="twitter:image" content="https://coinbitclub.com/logo-nova.jpg" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="author" content="CoinBitClub" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://coinbitclub.com/home" />
        
        {/* Alternate languages */}
        <link rel="alternate" hrefLang="pt-BR" href="https://coinbitclub.com/home" />
        <link rel="alternate" hrefLang="en" href="https://coinbitclub.com/home" />
        <link rel="alternate" hrefLang="x-default" href="https://coinbitclub.com/home" />
        
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-x-hidden">
        {/* Header */}
        <header className="fixed top-0 w-full bg-slate-900/95 backdrop-blur-md z-50 border-b border-slate-700/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-3 cursor-pointer"
                onClick={() => router.push('/home')}
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center transform hover:scale-110 transition-transform">
                  <span className="text-black font-bold text-lg sm:text-xl">₿</span>
                </div>
                <div className="flex flex-col">
                  <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                    CoinBitClub
                  </h1>
                  <p className="text-sm text-yellow-400 font-medium">MarketBot</p>
                </div>
              </motion.div>

              {/* Navigation */}
              <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
                <button 
                  onClick={() => {
                    handleNavigation('/planos-new');
                    handleCTAClick('plans_nav');
                  }}
                  className="text-slate-300 hover:text-yellow-400 transition-colors text-sm font-medium"
                >
                  {currentLanguage === 'pt' ? 'Planos' : 'Plans'}
                </button>
                <button 
                  onClick={() => {
                    setOpenFAQ(openFAQ === null ? 0 : null);
                    handleModalOpen('faq');
                  }}
                  className="text-slate-300 hover:text-yellow-400 transition-colors text-sm font-medium"
                >
                  FAQ
                </button>
                <button 
                  onClick={() => {
                    handleNavigation('/termos-new');
                    handleCTAClick('terms_nav');
                  }}
                  className="text-slate-300 hover:text-yellow-400 transition-colors text-sm font-medium"
                >
                  {currentLanguage === 'pt' ? 'Termos' : 'Terms'}
                </button>
                
                {/* Auth Buttons */}
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    router.push('/auth/login');
                    handleCTAClick('login_header');
                  }}
                  className="text-white hover:text-yellow-400 transition-colors text-sm font-semibold border-2 border-slate-600 hover:border-yellow-500 px-6 py-2.5 rounded-xl backdrop-blur-sm bg-slate-800/50 hover:bg-slate-700/50"
                >
                  {currentLanguage === 'pt' ? 'Login' : 'Login'}
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    router.push('/cadastro-new');
                    handleCTAClick('signup_header');
                  }}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold text-sm px-6 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  {currentLanguage === 'pt' ? 'Cadastre-se' : 'Sign Up'}
                </motion.button>

                {/* Language Toggle */}
                <div className="flex items-center space-x-2 bg-slate-800/50 rounded-lg p-1">
                  <button
                    onClick={() => handleLanguageChange('pt')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                      currentLanguage === 'pt' 
                        ? 'bg-yellow-500 text-black' 
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    PT
                  </button>
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                      currentLanguage === 'en' 
                        ? 'bg-yellow-500 text-black' 
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    EN
                  </button>
                </div>
              </nav>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="text-white p-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {showMobileMenu && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden bg-slate-800/95 backdrop-blur-md border-t border-slate-700/30"
              >
                <div className="px-4 py-4 space-y-3">
                  <button 
                    onClick={() => { router.push('/planos-new'); setShowMobileMenu(false); }}
                    className="block w-full text-left text-slate-300 hover:text-yellow-400 transition-colors py-2"
                  >
                    {currentLanguage === 'pt' ? 'Planos' : 'Plans'}
                  </button>
                  <button 
                    onClick={() => { setShowFAQModal(true); setShowMobileMenu(false); }}
                    className="block w-full text-left text-slate-300 hover:text-yellow-400 transition-colors py-2"
                  >
                    FAQ
                  </button>
                  <button 
                    onClick={() => { router.push('/termos-new'); setShowMobileMenu(false); }}
                    className="block w-full text-left text-slate-300 hover:text-yellow-400 transition-colors py-2"
                  >
                    {currentLanguage === 'pt' ? 'Termos' : 'Terms'}
                  </button>
                  
                  {/* Auth Buttons Mobile - Destacados */}
                  <div className="pt-4 space-y-3 border-t border-slate-700/50">
                    <button 
                      onClick={() => { router.push('/auth/login-new'); setShowMobileMenu(false); }}
                      className="w-full text-center text-white font-semibold border-2 border-slate-600 hover:border-yellow-500 px-4 py-3 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-all"
                    >
                      {currentLanguage === 'pt' ? 'Login' : 'Login'}
                    </button>
                    <button 
                      onClick={() => { router.push('/auth/register-new'); setShowMobileMenu(false); }}
                      className="w-full text-center bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold px-4 py-3 rounded-xl transition-all"
                    >
                      {currentLanguage === 'pt' ? 'Cadastre-se' : 'Sign Up'}
                    </button>
                  </div>
                  
                  <div className="flex justify-center pt-4">
                    <div className="flex items-center space-x-2 bg-slate-700/50 rounded-lg p-1">
                      <button
                        onClick={() => handleLanguageChange('pt')}
                        className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                          currentLanguage === 'pt' 
                            ? 'bg-yellow-500 text-black' 
                            : 'text-slate-300'
                        }`}
                      >
                        PT
                      </button>
                      <button
                        onClick={() => handleLanguageChange('en')}
                        className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                          currentLanguage === 'en' 
                            ? 'bg-yellow-500 text-black' 
                            : 'text-slate-300'
                        }`}
                      >
                        EN
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* Hero Section - Design Refinado */}
        <section className="pt-20 pb-16 md:pt-24 md:pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="container mx-auto text-center relative z-10 min-h-[75vh] flex flex-col justify-center">
            {/* Background Effects Mais Sutis */}
            <div className="absolute inset-0 -z-10">
              {/* Gradientes principais mais suaves */}
              <motion.div 
                className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-yellow-400/8 to-orange-500/8 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.6, 0.8, 0.6],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
              <motion.div 
                className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-400/6 to-cyan-500/6 rounded-full blur-3xl"
                animate={{
                  scale: [1.1, 1, 1.1],
                  opacity: [0.4, 0.6, 0.4],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
              
              {/* Grid pattern mais elegante */}
              <div 
                className="absolute inset-0 opacity-[0.02]"
                style={{
                  backgroundImage: `
                    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px),
                    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)
                  `,
                  backgroundSize: '80px 80px'
                }}
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-12 md:mb-16"
            >
              {/* Título MARKETBOT com design premium */}
              <motion.h1 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-8 md:mb-10 relative tracking-tight"
              >
                <span 
                  className="bg-gradient-to-r from-white via-yellow-100 to-white bg-clip-text text-transparent relative inline-block"
                  style={{
                    filter: 'drop-shadow(0 4px 12px rgba(255, 255, 255, 0.1))',
                  }}
                >
                  MARKETBOT
                  {/* Efeito de brilho sutil */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    animate={{
                      x: ['-200%', '200%'],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "linear",
                    }}
                    style={{
                      clipPath: 'polygon(0 0, 100% 0, 90% 100%, 0% 100%)',
                    }}
                  />
                </span>
              </motion.h1>
              
              {/* Subtítulo refinado */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl md:text-2xl lg:text-3xl text-slate-200 mb-3 leading-relaxed max-w-4xl mx-auto"
              >
                {currentLanguage === 'pt' ? (
                  <>
                    a{' '}
                    <span className="font-semibold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                      IA de trade automatizado
                    </span>
                    {' '}que transforma sinais em{' '}
                    <span 
                      className="font-black bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent"
                      style={{
                        filter: 'drop-shadow(0 2px 8px rgba(34, 197, 94, 0.3))',
                      }}
                    >
                      LUCRO EM DÓLAR
                    </span>
                  </>
                ) : (
                  <>
                    the{' '}
                    <span className="font-semibold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                      automated trading AI
                    </span>
                    {' '}that transforms signals into{' '}
                    <span 
                      className="font-black bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent"
                      style={{
                        filter: 'drop-shadow(0 2px 8px rgba(34, 197, 94, 0.3))',
                      }}
                    >
                      DOLLAR PROFIT
                    </span>
                  </>
                )}
              </motion.div>
            </motion.div>

            {/* Chamada principal refinada */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mb-10 md:mb-12"
            >
              <div className="relative max-w-5xl mx-auto">
                {/* Container com background elegante */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-800/40 via-slate-700/30 to-slate-800/40 rounded-2xl backdrop-blur-sm border border-slate-600/20"></div>
                <div className="relative p-6 md:p-8">
                  <p className="text-lg md:text-xl lg:text-2xl text-slate-100 leading-relaxed mb-4">
                    {currentLanguage === 'pt' ? (
                      <>
                        <span className="font-medium">O robô de trade automatizado que </span>
                        <span className="font-bold bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">
                          SÓ LUCRA SE VOCÊ LUCRAR
                        </span>
                        <span className="font-medium">!</span>
                      </>
                    ) : (
                      <>
                        <span className="font-medium">The automated trading robot that </span>
                        <span className="font-bold bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">
                          ONLY PROFITS IF YOU PROFIT
                        </span>
                        <span className="font-medium">!</span>
                      </>
                    )}
                  </p>
                  <p className="text-base md:text-lg text-slate-300 max-w-3xl mx-auto">
                    {currentLanguage === 'pt' 
                      ? 'Conecte sua conta Binance ou Bybit e comece a lucrar em poucos cliques.'
                      : 'Connect your Binance or Bybit account and start earning in just a few clicks.'
                    }
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Botões CTA Refinados */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 md:mb-16"
            >
              {/* Botão principal - Design premium */}
              <motion.button
                whileHover={{ 
                  scale: 1.02,
                  y: -2,
                  boxShadow: "0 20px 40px rgba(234, 179, 8, 0.25)"
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  router.push('/cadastro-new');
                  handleCTAClick('signup_hero');
                }}
                className="group relative bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-black px-10 py-4 md:px-12 md:py-5 rounded-2xl font-bold text-lg lg:text-xl transition-all duration-300 shadow-2xl overflow-hidden"
              >
                {/* Background pattern */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100"
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 0.8,
                    delay: 0.2,
                  }}
                />
                
                <span className="relative z-10 flex items-center gap-3">
                  <span className="text-2xl">🚀</span>
                  {currentLanguage === 'pt' ? 'Teste Grátis 7 Dias' : 'Free 7-Day Trial'}
                </span>
              </motion.button>
              
              {/* Botão secundário - Design elegante */}
              <motion.button
                whileHover={{ 
                  scale: 1.02,
                  y: -2,
                  borderColor: "rgb(148 163 184)",
                  backgroundColor: "rgba(51, 65, 85, 0.8)"
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setShowVideoModal(true);
                  handleModalOpen('video');
                }}
                className="group relative border-2 border-slate-600 text-white px-10 py-4 md:px-12 md:py-5 rounded-2xl font-semibold text-lg lg:text-xl transition-all duration-300 backdrop-blur-sm bg-slate-800/60 hover:bg-slate-700/80 shadow-xl"
              >
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-600/20 to-slate-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                
                <span className="relative z-10 flex items-center gap-3">
                  <span className="text-2xl">🎥</span>
                  {currentLanguage === 'pt' ? 'Como Funciona' : 'How It Works'}
                </span>
              </motion.button>
            </motion.div>

            {/* Stats com design aprimorado */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-6 max-w-4xl mx-auto"
            >
              {/* Operações */}
              <motion.div 
                whileHover={{ scale: 1.03, y: -3 }}
                className="text-center bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-xl p-3 md:p-4 lg:p-5 border border-slate-700/30 hover:border-yellow-500/50 transition-all duration-300 group relative overflow-hidden"
              >
                {/* Efeito de fundo no hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                <motion.div 
                  className="text-xl md:text-2xl lg:text-3xl font-black text-yellow-400 mb-1 md:mb-2 relative z-10"
                  animate={{ 
                    textShadow: ["0 0 0px rgba(234, 179, 8, 0)", "0 0 15px rgba(234, 179, 8, 0.4)", "0 0 0px rgba(234, 179, 8, 0)"]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {operationStats.totalTrades.toLocaleString()}
                </motion.div>
                <div className="text-xs md:text-sm text-slate-400 font-medium relative z-10">{t.stats.trades}</div>
              </motion.div>

              {/* Taxa de Sucesso */}
              <motion.div 
                whileHover={{ scale: 1.03, y: -3 }}
                className="text-center bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-xl p-3 md:p-4 lg:p-5 border border-slate-700/30 hover:border-green-500/50 transition-all duration-300 group relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                <motion.div 
                  className="text-xl md:text-2xl lg:text-3xl font-black text-green-400 mb-1 md:mb-2 relative z-10"
                  animate={{ 
                    textShadow: ["0 0 0px rgba(34, 197, 94, 0)", "0 0 15px rgba(34, 197, 94, 0.4)", "0 0 0px rgba(34, 197, 94, 0)"]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  {operationStats.successRate.toFixed(1)}%
                </motion.div>
                <div className="text-xs md:text-sm text-slate-400 font-medium relative z-10">{t.stats.successRate}</div>
              </motion.div>

              {/* Lucro Total */}
              <motion.div 
                whileHover={{ scale: 1.03, y: -3 }}
                className="text-center bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-xl p-3 md:p-4 lg:p-5 border border-slate-700/30 hover:border-blue-500/50 transition-all duration-300 group relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                <motion.div 
                  className="text-xl md:text-2xl lg:text-3xl font-black text-blue-400 mb-1 md:mb-2 relative z-10"
                  animate={{ 
                    textShadow: ["0 0 0px rgba(59, 130, 246, 0)", "0 0 15px rgba(59, 130, 246, 0.4)", "0 0 0px rgba(59, 130, 246, 0)"]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                >
                  ${(operationStats.totalProfit / 1000000).toFixed(1)}M
                </motion.div>
                <div className="text-xs md:text-sm text-slate-400 font-medium relative z-10">{t.stats.totalProfit}</div>
              </motion.div>

              {/* Usuários Ativos */}
              <motion.div 
                whileHover={{ scale: 1.03, y: -3 }}
                className="text-center bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-xl p-3 md:p-4 lg:p-5 border border-slate-700/30 hover:border-purple-500/50 transition-all duration-300 group relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                <motion.div 
                  className="text-xl md:text-2xl lg:text-3xl font-black text-purple-400 mb-1 md:mb-2 relative z-10"
                  animate={{ 
                    textShadow: ["0 0 0px rgba(168, 85, 247, 0)", "0 0 15px rgba(168, 85, 247, 0.4)", "0 0 0px rgba(168, 85, 247, 0)"]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                >
                  {operationStats.activeUsers.toLocaleString()}
                </motion.div>
                <div className="text-xs md:text-sm text-slate-400 font-medium relative z-10">{t.stats.activeUsers}</div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Demo Section */}
        <section className="py-6 md:py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-800/30 to-slate-900/30">
          <div className="container mx-auto">
            <div className="text-center mb-6 md:mb-8">
              <AnimatePresence mode="wait">
                <motion.h2
                  key={`demo-title-${currentLanguage}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"
                >
                  {t.demo.title}
                </motion.h2>
                <motion.p
                  key={`demo-subtitle-${currentLanguage}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: 0.1 }}
                  className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto"
                >
                  {t.demo.subtitle}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="max-w-6xl mx-auto">
              <RobotDemoLanding currentLanguage={currentLanguage} />
            </div>
          </div>
        </section>

        {/* Seção de Estatísticas Horizontais - Design Premium */}
        <section className="relative py-16 md:py-20 bg-gradient-to-b from-slate-900 to-slate-800">
          {/* Background decorativo */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-yellow-500/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Título da seção */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12 md:mb-16"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Resultados Comprovados
                </span>
              </h2>
              <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto">
                Números reais de uma comunidade ativa de traders que já transformaram suas vidas
              </p>
            </motion.div>

            {/* Cards de Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {/* Card 1 - Usuários Ativos */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -5, 
                  boxShadow: "0 25px 50px rgba(234, 179, 8, 0.1)" 
                }}
                className="group relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 md:p-8 text-center overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  <div className="text-4xl md:text-5xl mb-4">👥</div>
                  <div className="text-3xl md:text-4xl font-black text-white mb-2">
                    15.420+
                  </div>
                  <div className="text-yellow-400 font-semibold text-lg mb-2">
                    Usuários Ativos
                  </div>
                  <div className="text-slate-400 text-sm">
                    Comunidade global ativa
                  </div>
                </div>
              </motion.div>

              {/* Card 2 - Lucro Total */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -5, 
                  boxShadow: "0 25px 50px rgba(34, 197, 94, 0.1)" 
                }}
                className="group relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 md:p-8 text-center overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  <div className="text-4xl md:text-5xl mb-4">💰</div>
                  <div className="text-3xl md:text-4xl font-black text-white mb-2">
                    $2.84M+
                  </div>
                  <div className="text-green-400 font-semibold text-lg mb-2">
                    Lucro Gerado
                  </div>
                  <div className="text-slate-400 text-sm">
                    Total da comunidade
                  </div>
                </div>
              </motion.div>

              {/* Card 3 - Taxa de Sucesso */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -5, 
                  boxShadow: "0 25px 50px rgba(168, 85, 247, 0.1)" 
                }}
                className="group relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 md:p-8 text-center overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  <div className="text-4xl md:text-5xl mb-4">📈</div>
                  <div className="text-3xl md:text-4xl font-black text-white mb-2">
                    87%
                  </div>
                  <div className="text-purple-400 font-semibold text-lg mb-2">
                    Taxa de Sucesso
                  </div>
                  <div className="text-slate-400 text-sm">
                    Operações positivas
                  </div>
                </div>
              </motion.div>

              {/* Card 4 - Países Ativos */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -5, 
                  boxShadow: "0 25px 50px rgba(59, 130, 246, 0.1)" 
                }}
                className="group relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 md:p-8 text-center overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  <div className="text-4xl md:text-5xl mb-4">🌍</div>
                  <div className="text-3xl md:text-4xl font-black text-white mb-2">
                    42+
                  </div>
                  <div className="text-blue-400 font-semibold text-lg mb-2">
                    Países Ativos
                  </div>
                  <div className="text-slate-400 text-sm">
                    Presença global
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="text-center mt-12 md:mt-16"
            >
              <motion.button
                whileHover={{ 
                  scale: 1.02,
                  y: -2,
                  boxShadow: "0 20px 40px rgba(234, 179, 8, 0.25)"
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  router.push('/cadastro-new');
                  handleCTAClick('signup_statistics');
                }}
                className="group relative bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-black px-10 py-4 md:px-12 md:py-5 rounded-2xl font-bold text-lg lg:text-xl transition-all duration-300 shadow-2xl overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100"
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 0.8,
                    delay: 0.2,
                  }}
                />
                
                <span className="relative z-10 flex items-center gap-3">
                  <span className="text-2xl">🚀</span>
                  Junte-se aos Vencedores Agora
                </span>
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* FAQ Modal */}
        <AnimatePresence>
          {showFAQModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowFAQModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-800 rounded-2xl p-6 md:p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl md:text-3xl font-bold text-yellow-400">{t.faq.title}</h3>
                  <button
                    onClick={() => setShowFAQModal(false)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  {t.faq.questions.map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-slate-700 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                        className="w-full text-left p-4 bg-slate-700/30 hover:bg-slate-700/50 transition-colors flex justify-between items-center"
                      >
                        <span className="font-semibold text-white">{faq.q}</span>
                        <motion.span
                          animate={{ rotate: openFAQ === index ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-yellow-400"
                        >
                          ▼
                        </motion.span>
                      </button>
                      <AnimatePresence>
                        {openFAQ === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="bg-slate-800/50"
                          >
                            <p className="p-4 text-slate-300 leading-relaxed">{faq.a}</p>
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
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-800 rounded-2xl p-6 max-w-4xl w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-yellow-400">
                    {currentLanguage === 'pt' ? 'Como Funciona' : 'How It Works'}
                  </h3>
                  <button
                    onClick={() => setShowVideoModal(false)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/u8Ylcs4LXg0"
                    title={currentLanguage === 'pt' ? 'Como Funciona o MARKETBOT' : 'How MARKETBOT Works'}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* How It Works Modal */}
        <AnimatePresence>
          {showHowItWorksModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowHowItWorksModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-800 rounded-2xl p-6 md:p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl md:text-3xl font-bold text-yellow-400">{t.howItWorks.title}</h3>
                  <button
                    onClick={() => setShowHowItWorksModal(false)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-slate-400 text-sm">
                    {t.howItWorks.subtitle}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="bg-slate-900/80 border-t border-slate-700/30 py-12 md:py-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {/* Logo e Descrição */}
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-black font-bold text-2xl">₿</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                      CoinBitClub
                    </h3>
                    <p className="text-slate-400">MarketBot</p>
                  </div>
                </div>
                <p className="text-slate-300 leading-relaxed mb-6 max-w-md">
                  {t.footer.description}
                </p>
                
                {/* Certificações */}
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                      <span className="text-green-400 text-sm">🔒</span>
                    </div>
                    <span className="text-slate-400 text-sm">{t.footer.secure}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <span className="text-blue-400 text-sm">🛡️</span>
                    </div>
                    <span className="text-slate-400 text-sm">{t.footer.protected}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <span className="text-purple-400 text-sm">✓</span>
                    </div>
                    <span className="text-slate-400 text-sm">{t.footer.audited}</span>
                  </div>
                </div>
              </div>

              {/* Contato */}
              <div>
                <h4 className="text-white font-bold text-lg mb-6">{t.footer.contact}</h4>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                      <span className="text-green-400 text-sm">💬</span>
                    </div>
                    <div>
                      <p className="text-slate-300 text-sm">WhatsApp</p>
                      <a 
                        href="https://wa.me/5521999596652"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-400 hover:text-green-300 transition-colors text-sm"
                      >
                        +55 21 99959-6652
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <span className="text-blue-400 text-sm">📧</span>
                    </div>
                    <div>
                      <p className="text-slate-300 text-sm">Email</p>
                      <a 
                        href="mailto:faleconosco@coinbitclub.vip"
                        className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
                      >
                        faleconosco@coinbitclub.vip
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <span className="text-purple-400 text-sm">🕐</span>
                    </div>
                    <div>
                      <p className="text-slate-300 text-sm">{t.footer.hours}</p>
                      <p className="text-purple-400 text-sm">{t.footer.support}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Linha de Separação */}
            <div className="border-t border-slate-700/30 mt-12 pt-8">
              <div className="flex flex-col items-center space-y-6">
                {/* Instagram em destaque */}
                <div className="text-center">
                  <p className="text-slate-300 text-sm mb-3">
                    {currentLanguage === 'pt' ? 'Siga-nos no Instagram' : 'Follow us on Instagram'}
                  </p>
                  <a
                    href="https://instagram.com/coinbitclub"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white px-6 py-3 rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <span className="text-xl">📸</span>
                    <span>@coinbitclub</span>
                  </a>
                </div>
                
                {/* Copyright centralizado */}
                <div className="text-center">
                  <p className="text-slate-400 text-sm">
                    © 2025 CoinBitClub. {t.footer.rights}
                  </p>
                </div>
              </div>

              {/* Disclaimer Legal */}
              <div className="mt-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700/30">
                <p className="text-slate-400 text-xs leading-relaxed text-center">
                  {currentLanguage === 'pt' 
                    ? '⚠️ AVISO DE RISCO: O trading de criptomoedas envolve riscos significativos. Este serviço é destinado apenas para maiores de 18 anos. Resultados passados não garantem resultados futuros.'
                    : '⚠️ RISK WARNING: Cryptocurrency trading involves significant risks. This service is intended only for people over 18 years old. Past results do not guarantee future results.'
                  }
                </p>
              </div>
            </div>
          </div>
        </footer>

        {/* Floating Action Buttons */}
        <div className="fixed bottom-4 md:bottom-6 right-4 md:right-6 flex flex-col space-y-3 z-40">
          <button
            onClick={() => setShowFAQModal(true)}
            className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110"
          >
            <span className="text-white text-lg md:text-xl">❓</span>
          </button>
          <a
            href="https://wa.me/5521999596652"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 md:w-14 md:h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110"
          >
            <span className="text-white text-lg md:text-xl">💬</span>
          </a>
        </div>
      </div>
    </>
  );
}
