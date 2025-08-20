import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import RobotDemoLanding from '../../components/RobotDemoLanding';

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
      subtitle: 'a IA que transforma sinais em',
      highlight: 'lucro real em DÓLAR',
      description: 'O robô de trade automatizado que só lucra se você lucrar! Conecte sua conta Binance ou Bybit e comece a lucrar em poucos cliques.',
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
      affiliate: {
        title: 'Programa de Afiliados',
        subtitle: 'Ganhe 1,5% de comissão sobre os lucros dos seus indicados',
        description: 'Indique amigos e ganhe uma porcentagem dos lucros deles. Quanto mais pessoas você indicar, mais você ganha!',
        commission: '1,5% de comissão',
        realtime: 'Conversão em bônus com +10%',
        dashboard: 'Dashboard exclusivo',
        cta: 'Tornar-se Afiliado'
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
            q: "Como funciona o sistema de afiliados?",
            a: "Você ganha 1,5% de comissão sobre os lucros reais dos usuários que você indicar. Quanto mais indicações ativas, maior sua renda passiva."
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
      subtitle: 'the robot that transforms signals into',
      highlight: 'real profit in DOLLARS',
      description: 'The automated trading AI that only profits if you profit! Connect your Binance or Bybit account and start profiting in just a few clicks.',
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
      affiliate: {
        title: 'Affiliate Program',
        subtitle: 'Earn 1.5% commission on your referrals\' profits',
        description: 'Refer friends and earn a percentage of their profits. The more people you refer, the more you earn!',
        commission: '1.5% commission',
        realtime: 'Bonus conversion with +10%',
        dashboard: 'Exclusive dashboard',
        cta: 'Become an Affiliate'
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
            a: "The minimum amount varies by chosen plan, starting from $100 BRL or $30 USD, depending on the country"
          },
          {
            q: "How does the affiliate system work?",
            a: "You earn 1.5% commission on the real profits of users you refer. The more active referrals, the higher your passive income."
          },
          {
            q: "Is it safe to let the robot operate alone?",
            a: "Yes! Our system has multiple security layers, automatic stop-loss, and only operates with capital you define as limit."
          }
        ]
      },
      footer: {
        description: 'MARKETBOT: the automated trading robot that transforms crypto signals into real dollars. Cutting-edge technology to maximize your results in the cryptocurrency market.',
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
            ? 'CoinBitClub MarketBot - Trading Automatizado de Criptomoedas com IA' 
            : 'CoinBitClub MarketBot - AI-Powered Automated Cryptocurrency Trading'
          }
        </title>
        <meta 
          name="description" 
          content={currentLanguage === 'pt' 
            ? "Plataforma de trading automatizado de criptomoedas com IA. Ganhe dinheiro no piloto automático 24/7. Comissão apenas sobre lucros reais." 
            : "AI-powered automated cryptocurrency trading platform. Make money on autopilot 24/7. Commission only on real profits."
          } 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
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
                onClick={() => router.push('/landingpage/home')}
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center transform hover:scale-110 transition-transform">
                  <span className="text-black font-bold text-lg sm:text-xl">₿</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                    CoinBitClub
                  </h1>
                  <p className="text-xs text-gray-400">MarketBot</p>
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
        <section className="pt-20 pb-12 md:pt-24 md:pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="container mx-auto text-center relative z-10">
            {/* Background Effects */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl"></div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8 md:mb-12"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  {t.title}
                </span>
              </h1>
              <p className="text-xl md:text-2xl lg:text-3xl text-slate-300 mb-2">
                {t.subtitle}
              </p>
              <p className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                {t.highlight}
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-8 md:mb-12 leading-relaxed"
            >
              {t.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 md:mb-16"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  trackCTAClick('register', 'hero');
                  router.push('/auth/register-new');
                }}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-8 py-4 rounded-xl font-bold text-lg hover:from-yellow-400 hover:to-orange-400 transition-all shadow-2xl transform hover:shadow-yellow-500/25"
              >
                {t.freeTrialBtn}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  trackModalOpen('video_demo');
                  setShowVideoModal(true);
                }}
                className="border-2 border-slate-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:border-yellow-500 hover:bg-yellow-500/10 transition-all backdrop-blur-sm"
              >
                {t.watchDemoBtn}
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 lg:gap-8 max-w-4xl mx-auto"
            >
              <div className="text-center bg-slate-800/50 backdrop-blur-sm rounded-xl p-3 md:p-4 lg:p-6 border border-slate-700/30">
                <div className="text-xl md:text-2xl lg:text-3xl font-bold text-yellow-400 mb-1 md:mb-2">
                  {operationStats.totalTrades.toLocaleString()}
                </div>
                <div className="text-xs md:text-sm lg:text-base text-slate-400">{t.stats.trades}</div>
              </div>
              <div className="text-center bg-slate-800/50 backdrop-blur-sm rounded-xl p-3 md:p-4 lg:p-6 border border-slate-700/30">
                <div className="text-xl md:text-2xl lg:text-3xl font-bold text-green-400 mb-1 md:mb-2">
                  {operationStats.successRate.toFixed(1)}%
                </div>
                <div className="text-xs md:text-sm lg:text-base text-slate-400">{t.stats.successRate}</div>
              </div>
              <div className="text-center bg-slate-800/50 backdrop-blur-sm rounded-xl p-3 md:p-4 lg:p-6 border border-slate-700/30">
                <div className="text-xl md:text-2xl lg:text-3xl font-bold text-blue-400 mb-1 md:mb-2">
                  ${(operationStats.totalProfit / 1000000).toFixed(1)}M
                </div>
                <div className="text-xs md:text-sm lg:text-base text-slate-400">{t.stats.totalProfit}</div>
              </div>
              <div className="text-center bg-slate-800/50 backdrop-blur-sm rounded-xl p-3 md:p-4 lg:p-6 border border-slate-700/30">
                <div className="text-xl md:text-2xl lg:text-3xl font-bold text-purple-400 mb-1 md:mb-2">
                  {operationStats.activeUsers.toLocaleString()}
                </div>
                <div className="text-xs md:text-sm lg:text-base text-slate-400">{t.stats.activeUsers}</div>
              </div>
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

        {/* Affiliate Section */}
        <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50">
          <div className="container mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <AnimatePresence mode="wait">
                <motion.h2
                  key={`affiliate-title-${currentLanguage}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent"
                >
                  {t.affiliate.title}
                </motion.h2>
                <motion.p
                  key={`affiliate-subtitle-${currentLanguage}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: 0.1 }}
                  className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-8"
                >
                  {t.affiliate.subtitle}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto mb-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-green-500/20"
              >
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="text-xl font-bold text-green-400 mb-2">{t.affiliate.commission}</h3>
                <p className="text-slate-300 text-sm">
                  {currentLanguage === 'pt' 
                    ? 'Sobre os lucros reais dos seus indicados'
                    : 'On real profits from your referrals'
                  }
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20"
              >
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-xl font-bold text-blue-400 mb-2">{t.affiliate.realtime}</h3>
                <p className="text-slate-300 text-sm">
                  {currentLanguage === 'pt' 
                    ? 'Receba suas comissões automaticamente'
                    : 'Receive your commissions automatically'
                  }
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20"
              >
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-xl font-bold text-purple-400 mb-2">{t.affiliate.dashboard}</h3>
                <p className="text-slate-300 text-sm">
                  {currentLanguage === 'pt' 
                    ? 'Acompanhe seus ganhos em tempo real'
                    : 'Track your earnings in real-time'
                  }
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/affiliate')}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-green-400 hover:to-emerald-400 transition-all shadow-2xl"
              >
                {t.affiliate.cta}
              </motion.button>
            </motion.div>
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
                
                <div className="aspect-video bg-slate-900 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                    <p className="text-slate-400">
                      {currentLanguage === 'pt' ? 'Vídeo demonstrativo em breve' : 'Demo video coming soon'}
                    </p>
                  </div>
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
                    <span className="text-xl">�</span>
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
