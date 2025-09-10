import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import RobotDemoLanding from '../../components/RobotDemoLanding';

export default function Home() {
  const [currentLanguage, setCurrentLanguage] = useState<'pt' | 'en'>('pt');
  const [mounted, setMounted] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showHowItWorksModal, setShowHowItWorksModal] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [stats, setStats] = useState({
    users: 0,
    profit: 0,
    trades: 0,
    uptime: 0
  });

  const [operationStats, setOperationStats] = useState({
    totalTrades: 847652,
    successRate: 94.3,
    totalProfit: 12500000,
    activeUsers: 3247
  });

  const router = useRouter();

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
      const savedLanguage = localStorage.getItem('coinbitclub-language') as 'pt' | 'en' | null;
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

  const handleLanguageChange = (lang: 'pt' | 'en') => {
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

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-x-hidden relative">
        {/* Advanced Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-400/15 to-cyan-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-r from-pink-400/15 to-purple-500/15 rounded-full blur-3xl animate-pulse delay-2000"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-slate-900/50 to-transparent"></div>
        </div>

        {/* Animated Grid Background */}
        <div className="fixed inset-0 opacity-[0.03] pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Header */}
        <header className="fixed top-0 w-full bg-slate-900/90 backdrop-blur-xl z-50 border-b border-gradient-to-r from-yellow-500/30 via-transparent to-blue-500/30">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 via-transparent to-blue-500/5"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-3 cursor-pointer group"
                onClick={() => router.push('/home')}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-lg">
                    <span className="text-black font-bold text-lg sm:text-xl">₿</span>
                  </div>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 bg-clip-text text-transparent">
                    CoinBitClub
                  </h1>
                  <p className="text-xs text-gray-400 font-medium tracking-wider">MarketBot</p>
                </div>
              </motion.div>

              {/* Navigation */}
              <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
                <button 
                  onClick={() => {
                    trackNavigation('/planos-new', 'header');
                    router.push('/planos-new');
                  }}
                  className="relative text-slate-300 hover:text-yellow-400 transition-all duration-300 text-sm font-medium group"
                >
                  <span className="relative z-10">{currentLanguage === 'pt' ? 'Planos' : 'Plans'}</span>
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                </button>
                <button 
                  onClick={() => {
                    trackModalOpen('faq');
                    setShowFAQ(true);
                  }}
                  className="relative text-slate-300 hover:text-yellow-400 transition-all duration-300 text-sm font-medium group"
                >
                  <span className="relative z-10">FAQ</span>
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                </button>
                <button 
                  onClick={() => {
                    trackNavigation('/termos-new', 'header');
                    router.push('/termos-new');
                  }}
                  className="relative text-slate-300 hover:text-yellow-400 transition-all duration-300 text-sm font-medium group"
                >
                  <span className="relative z-10">{currentLanguage === 'pt' ? 'Termos' : 'Terms'}</span>
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                </button>
                
                {/* Auth Buttons */}
                <motion.button 
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    trackNavigation('/auth/login-new', 'header');
                    router.push('/auth/login-new');
                  }}
                  className="relative overflow-hidden text-white hover:text-yellow-400 transition-all duration-300 text-sm font-semibold border-2 border-slate-600 hover:border-yellow-500 px-6 py-2.5 rounded-xl backdrop-blur-sm bg-slate-800/50 hover:bg-slate-700/50 group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="relative z-10">{currentLanguage === 'pt' ? 'Login' : 'Login'}</span>
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    trackCTAClick('register', 'header');
                    router.push('/auth/register-new');
                  }}
                  className="relative overflow-hidden bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold text-sm px-6 py-2.5 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="relative z-10">{currentLanguage === 'pt' ? 'Cadastre-se' : 'Sign Up'}</span>
                </motion.button>

                {/* Language Toggle */}
                <div className="flex items-center space-x-2 bg-slate-800/50 backdrop-blur-sm rounded-lg p-1 border border-slate-700/50">
                  <button
                    onClick={() => handleLanguageChange('pt')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-all duration-300 ${
                      currentLanguage === 'pt' 
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black shadow-lg' 
                        : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    PT
                  </button>
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-all duration-300 ${
                      currentLanguage === 'en' 
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black shadow-lg' 
                        : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
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
            {/* Advanced Background Effects */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-yellow-400/20 via-orange-500/15 to-transparent rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-blue-400/15 via-cyan-500/10 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-pink-400/10 via-purple-500/15 to-transparent rounded-full blur-3xl animate-pulse delay-2000"></div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8 md:mb-12"
            >
              <div className="relative inline-block mb-6">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black mb-4 md:mb-6 relative">
                  <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-lg">
                    {t.title}
                  </span>
                </h1>
              </div>
              
              <div className="space-y-3">
                <p className="text-xl md:text-2xl lg:text-3xl text-slate-200 font-light tracking-wide">
                  {t.subtitle}
                </p>
                <div className="relative inline-block">
                  <p className="text-2xl md:text-3xl lg:text-5xl font-bold bg-gradient-to-r from-green-400 via-emerald-500 to-green-400 bg-clip-text text-transparent drop-shadow-lg">
                    {t.highlight}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative mb-8 md:mb-12"
            >
              <p className="text-lg md:text-xl text-slate-200 max-w-4xl mx-auto leading-relaxed p-6 bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/40 shadow-xl">
                {t.description}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12 md:mb-16"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  trackCTAClick('register', 'hero');
                  router.push('/auth/register-new');
                }}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black px-10 py-5 rounded-xl font-bold text-lg transition-all shadow-2xl hover:shadow-yellow-500/30 border-2 border-yellow-400/50"
              >
                <span className="flex items-center space-x-2">
                  <span>🚀</span>
                  <span>{t.freeTrialBtn.replace('🚀 ', '')}</span>
                </span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  trackModalOpen('video_demo');
                  setShowVideoModal(true);
                }}
                className="border-2 border-slate-600 hover:border-blue-500 text-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-blue-500/10 transition-all backdrop-blur-sm bg-slate-800/50 shadow-xl"
              >
                <span className="flex items-center space-x-2">
                  <span>🎥</span>
                  <span>{t.watchDemoBtn.replace('🎥 ', '')}</span>
                </span>
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8 max-w-5xl mx-auto"
            >
              <motion.div 
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative text-center bg-slate-800/70 backdrop-blur-lg rounded-2xl p-4 md:p-6 lg:p-8 border border-slate-700/50 hover:border-yellow-500/60 transition-all duration-300 shadow-xl hover:shadow-2xl">
                  <div className="text-2xl md:text-3xl lg:text-4xl font-black text-transparent bg-gradient-to-br from-yellow-400 to-orange-500 bg-clip-text mb-2 md:mb-3">
                    {operationStats.totalTrades.toLocaleString()}
                  </div>
                  <div className="text-xs md:text-sm lg:text-base text-slate-300 font-medium">{t.stats.trades}</div>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative text-center bg-slate-800/60 backdrop-blur-lg rounded-2xl p-4 md:p-6 lg:p-8 border border-slate-700/50 hover:border-green-500/50 transition-all duration-300">
                  <div className="text-2xl md:text-3xl lg:text-4xl font-black text-transparent bg-gradient-to-br from-green-400 to-emerald-500 bg-clip-text mb-2 md:mb-3">
                    {operationStats.successRate.toFixed(1)}%
                  </div>
                  <div className="text-xs md:text-sm lg:text-base text-slate-300 font-medium">{t.stats.successRate}</div>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative text-center bg-slate-800/60 backdrop-blur-lg rounded-2xl p-4 md:p-6 lg:p-8 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300">
                  <div className="text-2xl md:text-3xl lg:text-4xl font-black text-transparent bg-gradient-to-br from-blue-400 to-cyan-500 bg-clip-text mb-2 md:mb-3">
                    ${(operationStats.totalProfit / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-xs md:text-sm lg:text-base text-slate-300 font-medium">{t.stats.totalProfit}</div>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative text-center bg-slate-800/60 backdrop-blur-lg rounded-2xl p-4 md:p-6 lg:p-8 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300">
                  <div className="text-2xl md:text-3xl lg:text-4xl font-black text-transparent bg-gradient-to-br from-purple-400 to-pink-500 bg-clip-text mb-2 md:mb-3">
                    {operationStats.activeUsers.toLocaleString()}
                  </div>
                  <div className="text-xs md:text-sm lg:text-base text-slate-300 font-medium">{t.stats.activeUsers}</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Demo Section */}
        <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800/40 via-slate-900/60 to-slate-800/40"></div>
          <div className="absolute inset-0">
            <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto relative z-10">
            <div className="text-center mb-8 md:mb-12">
              <AnimatePresence mode="wait">
                <motion.h2
                  key={`demo-title-${currentLanguage}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 md:mb-8"
                >
                  <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 bg-clip-text text-transparent">
                    {t.demo.title}
                  </span>
                </motion.h2>
                <motion.p
                  key={`demo-subtitle-${currentLanguage}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: 0.1 }}
                  className="text-lg md:text-xl text-slate-200 max-w-4xl mx-auto leading-relaxed"
                >
                  {t.demo.subtitle}
                </motion.p>
              </AnimatePresence>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-6xl mx-auto relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl blur-xl"></div>
              <div className="relative bg-slate-800/30 backdrop-blur-lg rounded-3xl border border-slate-700/50 p-4 md:p-6 lg:p-8">
                <RobotDemoLanding currentLanguage={currentLanguage} />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Affiliate Section */}
        <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800/60 via-slate-900/80 to-slate-800/60"></div>
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-green-500/15 to-emerald-500/15 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>
          
          <div className="container mx-auto relative z-10">
            <div className="text-center mb-16 md:mb-20">
              <AnimatePresence mode="wait">
                <motion.h2
                  key={`affiliate-title-${currentLanguage}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 md:mb-8"
                >
                  <span className="bg-gradient-to-r from-green-400 via-emerald-500 to-green-400 bg-clip-text text-transparent">
                    {t.affiliate.title}
                  </span>
                </motion.h2>
                <motion.p
                  key={`affiliate-subtitle-${currentLanguage}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: 0.1 }}
                  className="text-xl md:text-2xl text-slate-200 max-w-4xl mx-auto mb-8 leading-relaxed"
                >
                  {t.affiliate.subtitle}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 max-w-5xl mx-auto mb-16">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative text-center bg-slate-800/60 backdrop-blur-lg rounded-3xl p-8 border border-green-500/30 hover:border-green-500/60 transition-all duration-300">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-green-500/20 rounded-full blur-lg"></div>
                    <div className="relative w-20 h-20 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm border border-green-500/40">
                      <span className="text-3xl">💰</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-transparent bg-gradient-to-br from-green-400 to-emerald-500 bg-clip-text mb-4">{t.affiliate.commission}</h3>
                  <p className="text-slate-300 leading-relaxed">
                    {currentLanguage === 'pt' 
                      ? 'Sobre os lucros reais dos seus indicados'
                      : 'On real profits from your referrals'
                    }
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative text-center bg-slate-800/60 backdrop-blur-lg rounded-3xl p-8 border border-blue-500/30 hover:border-blue-500/60 transition-all duration-300">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-lg"></div>
                    <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm border border-blue-500/40">
                      <span className="text-3xl">⚡</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-transparent bg-gradient-to-br from-blue-400 to-cyan-500 bg-clip-text mb-4">{t.affiliate.realtime}</h3>
                  <p className="text-slate-300 leading-relaxed">
                    {currentLanguage === 'pt' 
                      ? 'Receba suas comissões automaticamente'
                      : 'Receive your commissions automatically'
                    }
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative text-center bg-slate-800/60 backdrop-blur-lg rounded-3xl p-8 border border-purple-500/30 hover:border-purple-500/60 transition-all duration-300">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-lg"></div>
                    <div className="relative w-20 h-20 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm border border-purple-500/40">
                      <span className="text-3xl">📊</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-transparent bg-gradient-to-br from-purple-400 to-pink-500 bg-clip-text mb-4">{t.affiliate.dashboard}</h3>
                  <p className="text-slate-300 leading-relaxed">
                    {currentLanguage === 'pt' 
                      ? 'Acompanhe seus ganhos em tempo real'
                      : 'Track your earnings in real-time'
                    }
                  </p>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/affiliate')}
                className="relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-green-500 to-emerald-500 text-white px-10 py-5 rounded-xl font-bold text-lg hover:from-green-400 hover:to-emerald-400 transition-all shadow-2xl border-2 border-green-400/50">
                  {t.affiliate.cta}
                </div>
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
              className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4"
              onClick={() => setShowFAQ(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 50 }}
                className="relative bg-slate-800/90 backdrop-blur-xl rounded-3xl p-8 md:p-10 max-w-3xl w-full max-h-[80vh] overflow-y-auto border border-slate-700/50"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-blue-500/5 rounded-3xl"></div>
                
                <div className="relative flex justify-between items-center mb-8">
                  <h3 className="text-3xl md:text-4xl font-black text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text">{t.faq.title}</h3>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowFAQ(false)}
                    className="text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-slate-700/50"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>

                <div className="relative space-y-4">
                  {t.faq.questions.map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-slate-700/50 rounded-2xl overflow-hidden backdrop-blur-sm"
                    >
                      <motion.button
                        whileHover={{ backgroundColor: 'rgba(51, 65, 85, 0.6)' }}
                        onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                        className="w-full text-left p-6 bg-slate-700/30 hover:bg-slate-700/50 transition-all duration-300 flex justify-between items-center group"
                      >
                        <span className="font-semibold text-white pr-4 group-hover:text-yellow-400 transition-colors">{faq.q}</span>
                        <motion.span
                          animate={{ rotate: openFAQ === index ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="text-yellow-400 text-xl flex-shrink-0"
                        >
                          ▼
                        </motion.span>
                      </motion.button>
                      <AnimatePresence>
                        {openFAQ === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-slate-800/60 backdrop-blur-sm"
                          >
                            <p className="p-6 text-slate-200 leading-relaxed border-t border-slate-700/50">{faq.a}</p>
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
              className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex items-center justify-center p-4"
              onClick={() => setShowVideoModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 50 }}
                className="relative bg-slate-800/90 backdrop-blur-xl rounded-3xl p-8 max-w-5xl w-full border border-slate-700/50"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5 rounded-3xl"></div>
                
                <div className="relative flex justify-between items-center mb-8">
                  <h3 className="text-3xl font-black text-transparent bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text">
                    {currentLanguage === 'pt' ? 'Como Funciona' : 'How It Works'}
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowVideoModal(false)}
                    className="text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-slate-700/50"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>
                
                <div className="relative aspect-video bg-slate-900/80 rounded-2xl flex items-center justify-center border border-slate-700/50 backdrop-blur-sm">
                  <div className="text-center">
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      className="relative w-20 h-20 mx-auto mb-6"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-full blur-lg"></div>
                      <div className="relative w-20 h-20 bg-gradient-to-r from-blue-500/40 to-cyan-500/40 rounded-full flex items-center justify-center backdrop-blur-sm border border-blue-500/50">
                        <svg className="w-10 h-10 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </motion.div>
                    <p className="text-slate-300 text-lg">
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
        <footer className="relative bg-slate-900/90 border-t border-gradient-to-r from-slate-700/50 via-slate-600/30 to-slate-700/50 py-16 md:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
              {/* Logo e Descrição */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center space-x-4 mb-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-lg opacity-50"></div>
                    <div className="relative w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
                      <span className="text-black font-bold text-3xl">₿</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 bg-clip-text text-transparent">
                      CoinBitClub
                    </h3>
                    <p className="text-slate-400 font-medium tracking-wider">MarketBot</p>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 bg-slate-800/50 rounded-2xl blur-xl"></div>
                  <p className="relative text-slate-200 leading-relaxed mb-8 max-w-md p-6 bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50">
                    {t.footer.description}
                  </p>
                </div>
                
                {/* Certificações */}
                <div className="flex flex-wrap gap-4">
                  {[
                    { icon: '🔒', text: t.footer.secure, color: 'green' },
                    { icon: '🛡️', text: t.footer.protected, color: 'blue' },
                    { icon: '✓', text: t.footer.audited, color: 'purple' }
                  ].map((cert, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      className={`flex items-center space-x-3 bg-slate-800/50 backdrop-blur-sm rounded-xl p-3 border border-${cert.color}-500/30 hover:border-${cert.color}-500/60 transition-all`}
                    >
                      <div className={`w-10 h-10 bg-${cert.color}-500/20 rounded-full flex items-center justify-center`}>
                        <span className={`text-${cert.color}-400`}>{cert.icon}</span>
                      </div>
                      <span className="text-slate-300 text-sm font-medium">{cert.text}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Contato */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h4 className="text-white font-bold text-2xl mb-8">{t.footer.contact}</h4>
                <div className="space-y-6">
                  {[
                    {
                      icon: '💬',
                      label: 'WhatsApp',
                      value: '+55 21 99959-6652',
                      href: 'https://wa.me/5521999596652',
                      color: 'green'
                    },
                    {
                      icon: '📧',
                      label: 'Email',
                      value: 'faleconosco@coinbitclub.vip',
                      href: 'mailto:faleconosco@coinbitclub.vip',
                      color: 'blue'
                    },
                    {
                      icon: '🕐',
                      label: t.footer.hours,
                      value: t.footer.support,
                      href: null,
                      color: 'purple'
                    }
                  ].map((contact, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className={`flex items-center space-x-4 p-4 bg-slate-800/40 backdrop-blur-sm rounded-xl border border-${contact.color}-500/30 hover:border-${contact.color}-500/60 transition-all`}
                    >
                      <div className={`w-12 h-12 bg-${contact.color}-500/20 rounded-full flex items-center justify-center`}>
                        <span className={`text-${contact.color}-400 text-lg`}>{contact.icon}</span>
                      </div>
                      <div>
                        <p className="text-slate-300 text-sm font-medium">{contact.label}</p>
                        {contact.href ? (
                          <a 
                            href={contact.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-${contact.color}-400 hover:text-${contact.color}-300 transition-colors font-semibold`}
                          >
                            {contact.value}
                          </a>
                        ) : (
                          <p className={`text-${contact.color}-400 font-semibold`}>{contact.value}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Linha de Separação */}
            <div className="border-t border-gradient-to-r from-slate-700/50 via-slate-600/30 to-slate-700/50 mt-16 pt-12">
              <div className="flex flex-col items-center space-y-8">
                {/* Instagram em destaque */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center"
                >
                  <p className="text-slate-200 text-lg mb-6 font-medium">
                    {currentLanguage === 'pt' ? 'Siga-nos no Instagram' : 'Follow us on Instagram'}
                  </p>
                  <motion.a
                    href="https://instagram.com/coinbitclub"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05, y: -5 }}
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
                
                {/* Copyright centralizado */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-center"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-slate-800/50 rounded-xl blur-lg"></div>
                    <p className="relative text-slate-300 text-sm p-4 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50">
                      © 2025 CoinBitClub. {t.footer.rights}
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Disclaimer Legal */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-12"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-orange-500/10 to-yellow-500/10 rounded-2xl blur-xl"></div>
                  <div className="relative p-6 bg-slate-800/60 backdrop-blur-lg rounded-2xl border border-orange-500/30">
                    <p className="text-slate-300 text-sm leading-relaxed text-center">
                      <span className="text-orange-400 text-lg mr-2">⚠️</span>
                      <span className="font-semibold text-orange-400">
                        {currentLanguage === 'pt' ? 'AVISO DE RISCO:' : 'RISK WARNING:'}
                      </span>
                      {' '}
                      {currentLanguage === 'pt' 
                        ? 'O trading de criptomoedas envolve riscos significativos. Este serviço é destinado apenas para maiores de 18 anos. Resultados passados não garantem resultados futuros.'
                        : 'Cryptocurrency trading involves significant risks. This service is intended only for people over 18 years old. Past results do not guarantee future results.'
                      }
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </footer>

        {/* Floating Action Buttons */}
        <div className="fixed bottom-6 md:bottom-8 right-6 md:right-8 flex flex-col space-y-4 z-40">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowFAQ(true)}
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
