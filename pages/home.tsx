import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import RobotDemoLanding from '../components/RobotDemoLanding';

type Language = 'pt' | 'en';

export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('pt');
  const [showFAQ, setShowFAQ] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showHowItWorksModal, setShowHowItWorksModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

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

    // Atualizar estatísticas a cada 30 segundos
    const interval = setInterval(() => {
      setOperationStats(prev => ({
        totalTrades: prev.totalTrades + Math.floor(Math.random() * 3) + 1,
        successRate: parseFloat((Math.random() * 2 + 93).toFixed(1)),
        totalProfit: prev.totalProfit + Math.random() * 5000 + 1000,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10) - 5
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleLanguageChange = (lang: Language) => {
    console.log('🔄 Mudando idioma para:', lang);
    setCurrentLanguage(lang);
    try {
      localStorage.setItem('coinbitclub-language', lang);
      console.log('✅ Idioma salvo:', lang);
      
      // Analytics - track language change
      if (typeof gtag !== 'undefined') {
        gtag('event', 'language_change', {
          previous_language: currentLanguage,
          new_language: lang,
          event_category: 'engagement'
        });
      }
    } catch (error) {
      console.error('❌ Erro ao salvar idioma:', error);
    }
  };

  // Analytics tracking functions
  const trackNavigation = (destination: string, source: 'header' | 'mobile' | 'hero' | 'cta') => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'navigation_click', {
        destination: destination,
        source: source,
        language: currentLanguage,
        event_category: 'navigation'
      });
    }
  };

  const trackCTAClick = (action: string, position: string) => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'cta_click', {
        action: action,
        position: position,
        language: currentLanguage,
        event_category: 'conversion'
      });
    }
  };

  const trackModalOpen = (modal_type: string) => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'modal_open', {
        modal_type: modal_type,
        language: currentLanguage,
        event_category: 'engagement'
      });
    }
  };

  // Textos por idioma
  const texts = {
    pt: {
      title: 'MARKETBOT',
      subtitle: 'a IA DE TRADE AUTOMATIZADO que transforma sinais em',
      highlight: 'LUCR0 EM DÓLAR',
      description: 'O robô que trabalha 24/7 e só lucra se você lucrar! Conecte sua conta Binance ou Bybit e comece a lucrar em poucos cliques.',
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
                    trackNavigation('/planos-new', 'header');
                    router.push('/planos-new');
                  }}
                  className="text-slate-300 hover:text-yellow-400 transition-colors text-sm font-medium"
                >
                  {currentLanguage === 'pt' ? 'Planos' : 'Plans'}
                </button>
                <button 
                  onClick={() => {
                    trackModalOpen('faq');
                    setShowFAQ(true);
                  }}
                  className="text-slate-300 hover:text-yellow-400 transition-colors text-sm font-medium"
                >
                  FAQ
                </button>
                <button 
                  onClick={() => {
                    trackNavigation('/termos-new', 'header');
                    router.push('/termos-new');
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
                    trackNavigation('/auth/login-new', 'header');
                    router.push('/auth/login-new');
                  }}
                  className="text-white hover:text-yellow-400 transition-colors text-sm font-semibold border-2 border-slate-600 hover:border-yellow-500 px-6 py-2.5 rounded-xl backdrop-blur-sm bg-slate-800/50 hover:bg-slate-700/50"
                >
                  {currentLanguage === 'pt' ? 'Login' : 'Login'}
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    trackCTAClick('register', 'header');
                    router.push('/auth/register-new');
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
                    onClick={() => { setShowFAQ(true); setShowMobileMenu(false); }}
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

        {/* Hero Section */}
        <section className="pt-16 pb-12 md:pt-20 md:pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="container mx-auto text-center relative z-10 min-h-[70vh] flex flex-col justify-center">
            {/* Background Effects Aprimorados */}
            <div className="absolute inset-0 -z-10">
              {/* Gradientes principais */}
              <motion.div 
                className="absolute top-1/4 left-1/4 w-72 h-72 bg-yellow-500/15 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
              <motion.div 
                className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-orange-500/15 rounded-full blur-3xl"
                animate={{
                  scale: [1.1, 1, 1.1],
                  opacity: [0.15, 0.1, 0.15],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
              <motion.div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500/10 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
              
              {/* Partículas de brilho reduzidas */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-yellow-400/40 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    opacity: [0, 0.8, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
              
              {/* Grid pattern sutil */}
              <div 
                className="absolute inset-0 opacity-3"
                style={{
                  backgroundImage: `
                    linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px),
                    linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)
                  `,
                  backgroundSize: '60px 60px'
                }}
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8 md:mb-12"
            >
              {/* Título MARKETBOT com design aprimorado */}
              <motion.h1 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 md:mb-8 relative"
                style={{ letterSpacing: '0.05em' }}
              >
                <span 
                  className="bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 bg-clip-text text-transparent relative inline-block"
                  style={{
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundImage: 'linear-gradient(to right, #fde047, #fb923c, #ef4444)',
                  }}
                >
                  MARKETBOT
                  {/* Efeito de brilho animado */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "linear",
                    }}
                    style={{
                      clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0% 100%)',
                    }}
                  />
                </span>
              </motion.h1>
              
              {/* Subtítulo com hierarquia visual melhorada - Versão dinâmica por idioma */}
              {currentLanguage === 'pt' ? (
                <div className="text-lg md:text-xl lg:text-2xl xl:text-3xl text-slate-300 mb-2 leading-relaxed">
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mb-1"
                  >
                    a{' '}
                    <span className="font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      IA DE TRADE AUTOMATIZADO
                    </span>
                    {' '}que transforma sinais em
                  </motion.p>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="font-black text-xl md:text-2xl lg:text-3xl xl:text-4xl"
                  >
                    <span 
                      className="bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text text-transparent animate-pulse"
                      style={{
                        filter: 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.4))',
                        textShadow: '0 0 20px rgba(34, 197, 94, 0.3)'
                      }}
                    >
                      LUCRO EM DÓLAR
                    </span>
                  </motion.p>
                </div>
              ) : (
                <div className="text-lg md:text-xl lg:text-2xl xl:text-3xl text-slate-300 mb-2 leading-relaxed">
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mb-1"
                  >
                    the{' '}
                    <span className="font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      AUTOMATED TRADING AI
                    </span>
                    {' '}that transforms signals into
                  </motion.p>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="font-black text-xl md:text-2xl lg:text-3xl xl:text-4xl"
                  >
                    <span 
                      className="bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text text-transparent animate-pulse"
                      style={{
                        filter: 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.4))',
                        textShadow: '0 0 20px rgba(34, 197, 94, 0.3)'
                      }}
                    >
                      DOLLAR PROFIT
                    </span>
                  </motion.p>
                </div>
              )}
            </motion.div>

            {/* Chamada complementar aprimorada - Versão dinâmica por idioma */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mb-8 md:mb-10"
            >
              {currentLanguage === 'pt' ? (
                <>
                  <p className="text-lg md:text-xl lg:text-2xl text-slate-200 max-w-4xl mx-auto leading-relaxed relative">
                    <span className="font-semibold">O robô que opera </span>
                    <span className="font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      24/7
                    </span>
                    <span className="font-semibold"> e só ganha quando </span>
                    <span className="font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent relative">
                      você ganha
                      {/* Efeito de destaque animado */}
                      <motion.div
                        className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-400 rounded"
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 1, delay: 1.5 }}
                      />
                    </span>
                    <span className="font-semibold">!</span>
                  </p>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                    className="text-base md:text-lg text-slate-400 max-w-3xl mx-auto mt-3 leading-relaxed"
                  >
                    Conecte sua conta Binance ou Bybit e comece a lucrar em poucos cliques.
                  </motion.p>
                </>
              ) : (
                <>
                  <p className="text-lg md:text-xl lg:text-2xl text-slate-200 max-w-4xl mx-auto leading-relaxed relative">
                    <span className="font-semibold">The robot that works </span>
                    <span className="font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      24/7
                    </span>
                    <span className="font-semibold"> and only profits when </span>
                    <span className="font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent relative">
                      you profit
                      {/* Efeito de destaque animado */}
                      <motion.div
                        className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-400 rounded"
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 1, delay: 1.5 }}
                      />
                    </span>
                    <span className="font-semibold">!</span>
                  </p>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                    className="text-base md:text-lg text-slate-400 max-w-3xl mx-auto mt-3 leading-relaxed"
                  >
                    Connect your Binance or Bybit account and start earning in just a few clicks.
                  </motion.p>
                </>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10 md:mb-12"
            >
              {/* Botão principal - Teste Grátis */}
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 15px 30px rgba(234, 179, 8, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  trackCTAClick('register', 'hero');
                  router.push('/auth/register-new');
                }}
                className="relative bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-black px-8 py-4 rounded-xl font-black text-base lg:text-lg hover:from-yellow-300 hover:via-orange-400 hover:to-red-400 transition-all shadow-xl transform group overflow-hidden"
              >
                {/* Efeito de brilho no hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  <span className="text-xl">🚀</span>
                  {t.freeTrialBtn}
                </span>
                {/* Pulso de destaque */}
                <motion.div
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500"
                  animate={{
                    scale: [1, 1.03, 1],
                    opacity: [0, 0.2, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop",
                  }}
                />
              </motion.button>
              
              {/* Botão secundário - Como Funciona */}
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  borderColor: "rgb(234 179 8)",
                  backgroundColor: "rgba(234, 179, 8, 0.1)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  trackModalOpen('video_demo');
                  setShowVideoModal(true);
                }}
                className="relative border-2 border-slate-500 text-white px-8 py-4 rounded-xl font-bold text-base lg:text-lg hover:border-yellow-400 transition-all backdrop-blur-sm bg-slate-800/30 hover:bg-slate-700/50 group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span className="text-xl">🎥</span>
                  {t.watchDemoBtn}
                </span>
                {/* Efeito de background no hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
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

        {/* FAQ Modal */}
        <AnimatePresence>
          {showFAQ && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowFAQ(false)}
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
                    onClick={() => setShowFAQ(false)}
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
            onClick={() => setShowFAQ(true)}
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
