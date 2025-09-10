import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import RobotDemoLanding from '../components/RobotDemoLanding';

export default function Home() {
  const [currentLanguage, setCurrentLanguage] = useState<'pt' | 'en'>('pt');
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
    
    // Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'landing_page_view', {
        event_category: 'Landing',
        event_label: 'Home Page View'
      });
    }
    
    // Animated counter
    const interval = setInterval(() => {
      setStats(prev => ({
        users: Math.min(prev.users + Math.floor(Math.random() * 5) + 1, 12847),
        profit: Math.min(prev.profit + Math.floor(Math.random() * 0.3) + 0.1, 342.7),
        trades: Math.min(prev.trades + Math.floor(Math.random() * 50) + 10, 2847562),
        uptime: Math.min(prev.uptime + 0.01, 99.9)
      }));
    }, 150);

    setTimeout(() => clearInterval(interval), 3000);
    
    return () => clearInterval(interval);
  }, []);

  const handleLanguageChange = (lang: 'pt' | 'en') => {
    setCurrentLanguage(lang);
    if (typeof gtag !== 'undefined') {
      gtag('event', 'language_change', {
        event_category: 'UI',
        event_label: lang
      });
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

  // Textos em múltiplos idiomas
  const texts = {
    pt: {
      hero: {
        title: 'MARKETBOT',
        subtitle: 'a IA que transforma sinais em LUCRO EM DÓLAR!',
        highlightPhrase: 'O robô de trade automatizado que SÓ LUCRA SE VOCÊ LUCRAR!',
        cta: 'Comece Agora',
        watchDemo: 'Como Funciona',
        features: ['✅ Leitura do mercado', '✅ Monitoramento TOP100+', '✅ Abertura e acompanhamento', '✅ Trading 24/7', '✅ Comissão apenas sobre operações lucrativas', '✅ Position Safety']
      },
      stats: {
        users: 'Usuários Ativos',
        profit: 'Lucro Médio Diário',
        trades: 'Operações Realizadas',
        uptime: 'Uptime do Sistema'
      },
      howItWorks: {
        title: 'Como Funciona',
        step1: { title: 'Cadastre-se', desc: 'Crie sua conta gratuita em menos de 2 minutos' },
        step2: { title: 'Configure', desc: 'Defina seu perfil de risco e valor de investimento' },
        step3: { title: 'Lucre', desc: 'Nossa IA trabalha 24/7 maximizando seus retornos' }
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
      },
      certifications: [
        { icon: '🔒', text: 'SSL Seguro', color: 'green' },
        { icon: '✅', text: 'Verificado', color: 'blue' },
        { icon: '🏆', text: 'Premiado', color: 'yellow' },
        { icon: '🔍', text: 'Auditado', color: 'purple' }
      ]
    },
    en: {
      hero: {
        title: 'MARKETBOT',
        subtitle: 'the AI that transforms signals into PROFIT IN DOLLARS!',
        highlightPhrase: 'The 24/7 automated trading robot that ONLY PROFITS IF YOU PROFIT!',
        cta: 'Start Now for Free',
        watchDemo: 'How It Works',
        features: ['✅ Market reading', '✅ TOP100+ monitoring', '✅ Opening and tracking', '✅ 24/7 trading', '✅ Commission only on profitable operations', '✅ Position Safety']
      },
      stats: {
        users: 'Active Users',
        profit: 'Average Daily Profit',
        trades: 'Trades Executed',
        uptime: 'System Uptime'
      },
      howItWorks: {
        title: 'How It Works',
        step1: { title: 'Sign Up', desc: 'Create your free account in less than 2 minutes' },
        step2: { title: 'Configure', desc: 'Set your risk profile and investment amount' },
        step3: { title: 'Profit', desc: 'Our AI works 24/7 maximizing your returns' }
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
      },
      certifications: [
        { icon: '🔒', text: 'SSL Secure', color: 'green' },
        { icon: '✅', text: 'Verified', color: 'blue' },
        { icon: '🏆', text: 'Awarded', color: 'yellow' },
        { icon: '🔍', text: 'Audited', color: 'purple' }
      ]
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
    <React.Fragment>
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

        {/* Grid Pattern Overlay */}
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
                    handleNavigation('/planos-new');
                    handleCTAClick('plans_nav');
                  }}
                  className="relative text-slate-300 hover:text-yellow-400 transition-all duration-300 text-sm font-medium group"
                >
                  <span className="relative z-10">{currentLanguage === 'pt' ? 'Planos' : 'Plans'}</span>
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                </button>
                <button
                  onClick={() => {
                    setOpenFAQ(openFAQ === null ? 0 : null);
                    handleModalOpen('faq');
                  }}
                  className="relative text-slate-300 hover:text-yellow-400 transition-all duration-300 text-sm font-medium group"
                >
                  <span className="relative z-10">FAQ</span>
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                </button>
                <button
                  onClick={() => {
                    handleNavigation('/termos-new');
                    handleCTAClick('terms_nav');
                  }}
                  className="relative text-slate-300 hover:text-yellow-400 transition-all duration-300 text-sm font-medium group"
                >
                  <span className="relative z-10">{currentLanguage === 'pt' ? 'Termos' : 'Terms'}</span>
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                </button>

                {/* Action Buttons */}
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowVideoModal(true);
                    handleModalOpen('video');
                    handleCTAClick('how_it_works_header');
                  }}
                  className="relative overflow-hidden text-white hover:text-yellow-400 transition-all duration-300 text-sm font-semibold border-2 border-slate-600 hover:border-yellow-500 px-6 py-2.5 rounded-xl backdrop-blur-sm bg-slate-800/50 hover:bg-slate-700/50 group flex items-center space-x-2"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="relative z-10">{currentLanguage === 'pt' ? 'Como Funciona' : 'How It Works'}</span>
                  <div className="relative z-10 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <svg className="w-2 h-2 text-black" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    router.push('/auth/login');
                    handleCTAClick('login_header');
                  }}
                  className="relative overflow-hidden text-white hover:text-yellow-400 transition-all duration-300 text-sm font-semibold border-2 border-slate-600 hover:border-yellow-500 px-6 py-2.5 rounded-xl backdrop-blur-sm bg-slate-800/50 hover:bg-slate-700/50 group flex items-center space-x-2"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="relative z-10">🔑</span>
                  <span className="relative z-10">{currentLanguage === 'pt' ? 'Login' : 'Login'}</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    router.push('/cadastro-new');
                    handleCTAClick('signup_header');
                  }}
                  className="relative overflow-hidden bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold text-sm px-6 py-2.5 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 group flex items-center space-x-2"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="text-black font-bold">🚀</span>
                  <span className="relative z-10">{currentLanguage === 'pt' ? 'Comece Agora' : 'Start Now'}</span>
                </motion.button>

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
                      className="block w-full text-left text-slate-300 hover:text-yellow-400 py-2 transition-colors"
                    >
                      {currentLanguage === 'pt' ? 'Planos' : 'Plans'}
                    </button>
                    <button
                      onClick={() => { setOpenFAQ(0); setShowMobileMenu(false); }}
                      className="block w-full text-left text-slate-300 hover:text-yellow-400 py-2 transition-colors"
                    >
                      FAQ
                    </button>
                    <button
                      onClick={() => { setShowVideoModal(true); setShowMobileMenu(false); handleModalOpen('video'); }}
                      className="block w-full text-left text-slate-300 hover:text-yellow-400 py-2 transition-colors flex items-center space-x-2"
                    >
                      <span>📹</span>
                      <span>{currentLanguage === 'pt' ? 'Como Funciona' : 'How It Works'}</span>
                    </button>
                    <button
                      onClick={() => { router.push('/auth/login'); setShowMobileMenu(false); }}
                      className="block w-full text-left text-slate-300 hover:text-yellow-400 py-2 transition-colors flex items-center space-x-2"
                    >
                      <span>🔑</span>
                      <span>{currentLanguage === 'pt' ? 'Login' : 'Login'}</span>
                    </button>
                    <button
                      onClick={() => { router.push('/cadastro-new'); setShowMobileMenu(false); }}
                      className="block w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold py-3 rounded-lg text-center transition-all flex items-center justify-center space-x-2"
                    >
                      <span>🚀</span>
                      <span>{currentLanguage === 'pt' ? 'Comece Agora' : 'Start Now'}</span>
                    </button>
                    <div className="flex justify-center space-x-2 pt-2">
                      <button
                        onClick={() => handleLanguageChange('pt')}
                        className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${
                          currentLanguage === 'pt' ? 'bg-yellow-500 text-black' : 'text-slate-400'
                        }`}
                      >
                        PT
                      </button>
                      <button
                        onClick={() => handleLanguageChange('en')}
                        className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${
                          currentLanguage === 'en' ? 'bg-yellow-500 text-black' : 'text-slate-400'
                        }`}
                      >
                        EN
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* SEÇÃO 1: Hero Principal - Layout Elegante */}
        <section className="relative pt-20 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              
              {/* Conteúdo Principal - Esquerda */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-10"
              >
                {/* Badge de Status */}
                <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-500/30 rounded-full px-6 py-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-bold text-base">
                    {currentLanguage === 'pt' ? 'Sistema Ativo - Online 24/7' : 'System Active - Online 24/7'}
                  </span>
                </div>

                {/* Título Principal */}
                <div className="space-y-6">
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight">
                    <span className="block bg-gradient-to-r from-white via-yellow-100 to-white bg-clip-text text-transparent">
                      {t.hero.title}
                    </span>
                  </h1>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-yellow-400 leading-relaxed">
                    {t.hero.subtitle}
                  </p>
                </div>

                {/* Proposta de Valor */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl blur-2xl"></div>
                  <div className="relative bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-lg border-2 border-green-500/30 rounded-3xl p-8">
                    <p className="text-xl sm:text-2xl font-bold text-green-400 text-center leading-relaxed">
                      {t.hero.highlightPhrase}
                    </p>
                  </div>
                </div>

                {/* CTA Principal */}
                <div className="space-y-6">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -10 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      router.push('/cadastro-new');
                      handleCTAClick('main_cta');
                    }}
                    className="relative group overflow-hidden w-full"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
                    <div className="relative bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-black text-2xl lg:text-3xl px-16 py-8 rounded-3xl transition-all duration-300 shadow-2xl">
                      <span className="flex items-center justify-center space-x-4">
                        <span className="text-3xl">🚀</span>
                        <span>{t.hero.cta}</span>
                        <span className="text-3xl">💰</span>
                      </span>
                    </div>
                  </motion.button>
                  
                  <p className="text-slate-400 text-center text-lg font-medium">
                    {currentLanguage === 'pt' 
                      ? '✨ Grátis • ⚡ Sem compromisso • 🎯 Resultados em 2 minutos'
                      : '✨ Free • ⚡ No commitment • 🎯 Results in 2 minutes'
                    }
                  </p>
                </div>

                {/* Benefícios Principais */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: '🤖', title: currentLanguage === 'pt' ? 'IA Avançada' : 'Advanced AI', desc: currentLanguage === 'pt' ? 'Análise 24/7' : '24/7 Analysis' },
                    { icon: '💎', title: currentLanguage === 'pt' ? 'Só Lucra se Você Lucrar' : 'Only Profits If You Profit', desc: currentLanguage === 'pt' ? 'Zero risco' : 'Zero risk' },
                    { icon: '🔒', title: currentLanguage === 'pt' ? '100% Seguro' : '100% Secure', desc: currentLanguage === 'pt' ? 'Criptografia bancária' : 'Bank-level encryption' },
                    { icon: '⚡', title: currentLanguage === 'pt' ? 'Resultados Rápidos' : 'Fast Results', desc: currentLanguage === 'pt' ? 'Setup em minutos' : 'Setup in minutes' }
                  ].map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 + index * 0.1 }}
                      className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 hover:border-yellow-500/30 transition-all duration-300 group"
                    >
                      <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{benefit.icon}</div>
                      <div className="text-white font-bold text-sm mb-1">{benefit.title}</div>
                      <div className="text-slate-400 text-xs">{benefit.desc}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Demo do Robot - Direita */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative"
              >
                <div className="relative max-w-xl mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-cyan-500/30 rounded-3xl blur-3xl animate-pulse"></div>
                  <div className="relative bg-slate-800/70 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-2xl">
                    <RobotDemoLanding currentLanguage={currentLanguage} />
                  </div>
                </div>
              </motion.div>
              
            </div>
          </div>
        </section>

        {/* Statistics Section - Horizontal Layout */}
        <section className="relative py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-slate-800/50 via-slate-900/30 to-slate-800/50 border-y border-slate-700/30">
          <div className="container mx-auto max-w-6xl">
            {/* Section Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-8 lg:mb-12"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
                {currentLanguage === 'pt' ? 'Nossos Resultados em Números' : 'Our Results in Numbers'}
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                {currentLanguage === 'pt' 
                  ? 'Dados reais que comprovam a eficiência e confiabilidade da nossa plataforma de trading'
                  : 'Real data proving the efficiency and reliability of our trading platform'
                }
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8"
            >
              {[
                { 
                  value: '8473', 
                  label: currentLanguage === 'pt' ? 'Operações' : 'Operations', 
                  color: 'from-yellow-400 to-orange-500',
                  icon: '⚡'
                },
                { 
                  value: '84.7%', 
                  label: currentLanguage === 'pt' ? 'Taxa de Sucesso' : 'Success Rate', 
                  color: 'from-green-400 to-emerald-500',
                  icon: '📈'
                },
                { 
                  value: '$1.8M', 
                  label: currentLanguage === 'pt' ? 'Lucro Total' : 'Total Profit', 
                  color: 'from-blue-400 to-cyan-500',
                  icon: '💰'
                },
                { 
                  value: '5247', 
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
            </motion.div>
          </div>
        </section>

        {/* Affiliate Program Section */}
        <section className="relative py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-purple-900/20">
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
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4">
                <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  {currentLanguage === 'pt' ? 'Ganhe Indicando Nosso Robô' : 'Earn by Referring Our Robot'}
                </span>
              </h2>
              
              <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mb-6">
                {currentLanguage === 'pt' 
                  ? 'Transforme sua rede em uma fonte de renda recorrente. Ganhe comissões de 1,5% a cada usuário que você indicar!'
                  : 'Transform your network into a recurring income source. Earn 1.5% commissions for every user you refer!'
                }
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                {
                  icon: '🎯',
                  title: currentLanguage === 'pt' ? 'Comissão de 1,5%' : '1.5% Commission',
                  description: currentLanguage === 'pt' ? 'Receba 1,5% de todas as comissões geradas pelos seus indicados' : 'Receive 1.5% of all commissions generated by your referrals',
                  color: 'from-green-400 to-emerald-500'
                },
                {
                  icon: '💰',
                  title: currentLanguage === 'pt' ? 'Saque ou Conversão +10%' : 'Withdrawal or Conversion +10%',
                  description: currentLanguage === 'pt' ? 'Saque suas comissões ou converta em carga para o robô com +10% bônus' : 'Withdraw your commissions or convert to robot balance with +10% bonus',
                  color: 'from-blue-400 to-cyan-500'
                },
                {
                  icon: '📊',
                  title: currentLanguage === 'pt' ? 'Dashboard Completo' : 'Complete Dashboard',
                  description: currentLanguage === 'pt' ? 'Acompanhe seus ganhos e indicações em tempo real' : 'Track your earnings and referrals in real time',
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
                
                <div className="relative aspect-video bg-slate-900/80 rounded-2xl overflow-hidden border border-slate-700/50">
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
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowHowItWorksModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-800/95 backdrop-blur-lg rounded-3xl p-8 max-w-2xl w-full border border-slate-700/50"
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
                
                {/* Steps content would go here */}
                <div className="mt-4 text-center">
                  <p className="text-slate-400 text-sm">
                    {currentLanguage === 'pt' 
                      ? 'Conteúdo detalhado em desenvolvimento...' 
                      : 'Detailed content in development...'
                    }
                  </p>
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
                  <div>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2">
                      <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">FAQ</span>
                    </h3>
                    <p className="text-slate-400 text-sm sm:text-base">
                      {currentLanguage === 'pt' ? 'Respostas para as perguntas mais frequentes' : 'Answers to the most frequently asked questions'}
                    </p>
                  </div>
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
                      <motion.button
                        whileHover={{ backgroundColor: 'rgba(51, 65, 85, 0.6)' }}
                        onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                        className="w-full text-left p-4 sm:p-5 bg-slate-700/30 hover:bg-slate-700/50 transition-all duration-300 flex justify-between items-center group"
                      >
                        <span className="font-semibold text-white pr-4 group-hover:text-yellow-400 transition-colors text-sm sm:text-base">{faq.q}</span>
                        <motion.span
                          animate={{ rotate: openFAQ === index ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="text-yellow-400 text-lg sm:text-xl flex-shrink-0"
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

        {/* Final CTA & Footer - Unified Section */}
        <section className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-t border-gradient-to-r from-slate-700/50 via-slate-600/30 to-slate-700/50 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-2/3 right-1/3 w-80 h-80 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
          </div>
          
          <div className="container mx-auto max-w-6xl relative z-10">
            {/* Top Section - Security & Community */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {/* Security Message */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl"></div>
                  <div className="relative bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-sm border-2 border-blue-500/30 rounded-2xl p-6 lg:p-8 shadow-2xl h-full">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-2xl">🔒</span>
                      </div>
                      <h3 className="text-blue-400 font-black text-xl md:text-2xl">
                        {currentLanguage === 'pt' ? 'SEGURANÇA TOTAL' : 'TOTAL SECURITY'}
                      </h3>
                    </div>
                    <p className="text-blue-300 font-bold text-lg md:text-xl leading-relaxed">
                      {currentLanguage === 'pt' 
                        ? 'Seu dinheiro sempre seguro na Binance/Bybit – nós apenas executamos as ordens.'
                        : 'Your money is always safe on Binance/Bybit – we only execute the orders.'
                      }
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Community Message */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 rounded-2xl blur-xl"></div>
                  <div className="relative bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 lg:p-8 shadow-xl h-full">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                      <span className="text-3xl">👥</span>
                      <h3 className="text-purple-400 font-black text-xl md:text-2xl">
                        {currentLanguage === 'pt' ? 'COMUNIDADE ATIVA' : 'ACTIVE COMMUNITY'}
                      </h3>
                    </div>
                    <p className="text-purple-300 font-bold text-lg md:text-xl leading-relaxed">
                      {currentLanguage === 'pt' 
                        ? 'Junte-se à comunidade de investidores que operam 24/7 sem perder oportunidades.'
                        : 'Join the community of investors who trade 24/7 without missing opportunities.'
                      }
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Central CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  router.push('/cadastro-new');
                  handleCTAClick('final_cta');
                }}
                className="relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition-all duration-300 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-black text-xl lg:text-2xl px-12 lg:px-16 py-6 lg:py-8 rounded-3xl transition-all duration-300 shadow-2xl border-4 border-yellow-400/60 group-hover:border-yellow-300">
                  <span className="flex items-center justify-center space-x-4">
                    <span className="text-3xl lg:text-4xl animate-bounce">🚀</span>
                    <span>{currentLanguage === 'pt' ? 'Comece Agora' : 'Start Now'}</span>
                    <span className="text-3xl lg:text-4xl animate-bounce delay-75">💰</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"></div>
                </div>
              </motion.button>
              
              <p className="text-slate-400 text-sm mt-4 font-medium">
                {currentLanguage === 'pt' 
                  ? 'Cadastro gratuito • Sem compromisso • Comece em 2 minutos'
                  : 'Free registration • No commitment • Start in 2 minutes'
                }
              </p>
            </motion.div>
          </div>
        </section>

        {/* Footer - Unified Section */}
        <footer className="relative bg-slate-900/90 border-t border-gradient-to-r from-slate-700/50 via-slate-600/30 to-slate-700/50 py-12 md:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto relative z-10">
            {/* Company Info & Footer */}
            <div className="text-center mx-auto max-w-4xl">
              {/* Company Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-10"
              >
                <div className="flex items-center justify-center space-x-4 mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-lg opacity-50"></div>
                    <div className="relative w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
                      <span className="text-black font-bold text-3xl">₿</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 bg-clip-text text-transparent">
                      {t.footer.company}
                    </h3>
                    <p className="text-slate-400 font-medium tracking-wider">MarketBot</p>
                  </div>
                </div>
                
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-slate-800/50 rounded-2xl blur-xl"></div>
                  <p className="relative text-slate-200 leading-relaxed max-w-md mx-auto p-6 bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50">
                    {t.footer.description}
                  </p>
                </div>
                
                {/* Certifications */}
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  {t.certifications.map((cert, index) => (
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

              {/* Copyright & Risk Warning - Combined */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-6"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-slate-800/50 rounded-xl blur-lg"></div>
                  <p className="relative text-slate-300 text-sm p-4 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50">
                    © 2024 {t.footer.company}. {t.footer.rights}
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-orange-500/10 to-yellow-500/10 rounded-2xl blur-xl"></div>
                  <div className="relative p-6 bg-slate-800/60 backdrop-blur-lg rounded-2xl border border-orange-500/30">
                    <p className="text-slate-300 text-sm leading-relaxed text-center">
                      <span className="text-orange-400 text-lg mr-2">⚠️</span>
                      <span className="font-semibold text-orange-400">
                        {t.footer.risk}:
                      </span>
                      {' '}
                      {t.footer.riskText}
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
    </React.Fragment>
  );
}
