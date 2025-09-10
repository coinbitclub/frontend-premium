// TODO: Adicionar clearInterval no cleanup do useEffect
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';

type Language = 'pt' | 'en';

export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('pt');
  const [showFAQ, setShowFAQ] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const [operationStats, setOperationStats] = useState({
    totalTrades: 8473,
    successRate: 94.7,
    totalProfit: 2847950.50,
    activeUsers: 15247
  });

  useEffect(() => {
    setMounted(true);
    
    // Carregar idioma do localStorage
    try {
      const savedLanguage = typeof window !== "undefined" && localStorage.getItem('coinbitclub-language') as Language;
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
      typeof window !== "undefined" && localStorage.setItem('coinbitclub-language', lang);
      console.log('✅ Idioma salvo:', lang);
    } catch (error) {
      console.error('❌ Erro ao salvar idioma:', error);
    }
  };

  // Textos por idioma
  const texts = {
    pt: {
      title: 'MARKETBOT',
      subtitle: 'o robô de trade automático que',
      highlight: 'só lucra se você lucrar',
      description: 'Monitoramento de mercado com IA para entrada e saída dos sinais certos. Trading 24/7 no piloto automático.',
      freeTrialBtn: '🚀 Teste Grátis 7 Dias',
      watchDemoBtn: '🎥 Ver Demonstração',
      stats: {
        trades: 'Operações',
        successRate: 'Taxa de Sucesso',
        totalProfit: 'Lucro Total',
        activeUsers: 'Usuários Ativos'
      },
      demo: {
        title: 'Veja o Robô em Ação',
        subtitle: 'Timeline em tempo real de como nossa IA opera no mercado 24/7'
      },
      contact: {
        title: 'Contato e Suporte',
        subtitle: 'Estamos aqui para ajudar você 24/7',
        whatsapp: 'Resposta imediata',
        email: 'Resposta em até 1h'
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
            a: "Sim! Cobramos apenas 1,5% de comissão sobre os lucros reais. Se não há lucro, não há cobrança."
          },
          {
            q: "Qual o valor mínimo para começar?",
            a: "O valor mínimo varia conforme o plano escolhido, começando a partir de $100 USD para o plano básico."
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
      subtitle: 'the automated trading robot that',
      highlight: 'only profits if you profit',
      description: 'AI market monitoring for right signal entry and exit. 24/7 autopilot trading.',
      freeTrialBtn: '🚀 Free 7-Day Trial',
      watchDemoBtn: '🎥 Watch Demo',
      stats: {
        trades: 'Trades',
        successRate: 'Success Rate',
        totalProfit: 'Total Profit',
        activeUsers: 'Active Users'
      },
      demo: {
        title: 'See the Robot in Action',
        subtitle: 'Real-time timeline of how our AI operates in the market 24/7'
      },
      contact: {
        title: 'Contact & Support',
        subtitle: 'We are here to help you 24/7',
        whatsapp: 'Immediate response',
        email: 'Response within 1h'
      },
      faq: {
        title: 'Frequently Asked Questions',
        questions: [
          {
            q: "How does the free trial work?",
            a: "You have 7 days to test all robot features in TESTNET mode, with no risk to your capital."
          },
          {
            q: "Does the robot really only profit if I profit?",
            a: "Yes! We only charge 1.5% commission on real profits. If there's no profit, there's no charge."
          },
          {
            q: "What's the minimum amount to start?",
            a: "The minimum amount varies according to the chosen plan, starting from $100 USD for the basic plan."
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

  // Componente de demonstração do robô
  const RobotDemo = () => {
    const [currentStep, setCurrentStep] = useState(0);
    
    const steps = [
      { icon: "📊", title: currentLanguage === 'pt' ? "Análise de Mercado" : "Market Analysis", desc: currentLanguage === 'pt' ? "IA monitora 50+ indicadores" : "AI monitors 50+ indicators" },
      { icon: "🎯", title: currentLanguage === 'pt' ? "Sinal Detectado" : "Signal Detected", desc: currentLanguage === 'pt' ? "Oportunidade identificada" : "Opportunity identified" },
      { icon: "💰", title: currentLanguage === 'pt' ? "Posição Aberta" : "Position Opened", desc: "BTC/USDT - LONG" },
      { icon: "👁️", title: currentLanguage === 'pt' ? "Monitoramento" : "Monitoring", desc: currentLanguage === 'pt' ? "Acompanhamento em tempo real" : "Real-time tracking" },
      { icon: "✅", title: currentLanguage === 'pt' ? "Posição Fechada" : "Position Closed", desc: currentLanguage === 'pt' ? "Lucro: +2.47%" : "Profit: +2.47%" },
      { icon: "🎉", title: currentLanguage === 'pt' ? "Comissão Gerada" : "Commission Generated", desc: currentLanguage === 'pt' ? "1.5% do lucro para você" : "1.5% of profit for you" }
    ];

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % steps.length);
      }, 3000);
      return () => clearInterval(interval);
    }, [steps.length]);

    return (
      <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-slate-700/50">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className={`text-center p-3 md:p-4 rounded-xl transition-all ${
                index === currentStep
                  ? 'bg-yellow-500/20 border-2 border-yellow-500'
                  : index < currentStep
                  ? 'bg-green-500/20 border border-green-500/50'
                  : 'bg-slate-700/50 border border-slate-600'
              }`}
              animate={{ scale: index === currentStep ? 1.05 : 1 }}
            >
              <div className="text-xl md:text-2xl mb-2">{step.icon}</div>
              <h4 className="text-xs md:text-sm font-semibold text-white mb-1">{step.title}</h4>
              <p className="text-xs text-slate-300">{step.desc}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 bg-green-500/20 px-3 md:px-4 py-2 rounded-lg border border-green-500/50">
            <span className="text-green-400 text-lg md:text-xl animate-pulse">●</span>
            <span className="text-green-400 font-semibold text-sm md:text-base">
              {currentLanguage === 'pt' ? 'ROBÔ ATIVO 24/7' : 'ROBOT ACTIVE 24/7'}
            </span>
          </div>
        </div>
      </div>
    );
  };

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
                onClick={() => router.push('/')}
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
              <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
                <a href="#demo" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm lg:text-base">
                  Demo
                </a>
                <a href="#contact" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm lg:text-base">
                  {currentLanguage === 'pt' ? 'Contato' : 'Contact'}
                </a>
                <button
                  onClick={() => setShowFAQ(true)}
                  className="text-gray-300 hover:text-yellow-400 transition-colors text-sm lg:text-base"
                >
                  FAQ
                </button>
              </nav>

              {/* Language Selector & Auth */}
              <div className="flex items-center space-x-3 md:space-x-4">
                {/* Language Toggle */}
                <div className="flex bg-slate-800 rounded-lg p-1">
                  <button
                    onClick={() => handleLanguageChange('pt')}
                    className={`px-2 md:px-3 py-1 rounded text-xs md:text-sm transition-all font-medium ${
                      currentLanguage === 'pt' 
                        ? 'bg-yellow-500 text-black shadow-lg transform scale-105' 
                        : 'text-gray-400 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    PT 🇧🇷
                  </button>
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={`px-2 md:px-3 py-1 rounded text-xs md:text-sm transition-all font-medium ${
                      currentLanguage === 'en' 
                        ? 'bg-yellow-500 text-black shadow-lg transform scale-105' 
                        : 'text-gray-400 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    EN 🇺🇸
                  </button>
                </div>

                {/* Login Button */}
                <button 
                  onClick={() => router.push('/auth/login')}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-3 md:px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  Login
                </button>
              </div>
            </div>
          </div>

          {/* Language Change Indicator */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 z-10">
            <motion.div
              key={currentLanguage}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-yellow-500 text-black px-3 py-1 rounded-b-lg text-xs font-medium"
            >
              {currentLanguage === 'pt' ? '🇧🇷 Português' : '🇺🇸 English'}
            </motion.div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="pt-20 md:pt-24 pb-12 md:pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-orange-500/10"></div>
          <div className="absolute left-1/4 top-1/4 w-64 h-64 md:w-96 md:h-96 bg-yellow-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute right-1/4 bottom-1/4 w-64 h-64 md:w-96 md:h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

          <div className="container mx-auto text-center relative z-10">
            <div className="max-w-5xl mx-auto">
              <motion.h1
                key={currentLanguage}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight"
              >
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  {t.title}
                </span>
                <br />
                <span className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                  {t.subtitle}
                </span>
                <br />
                <span className="bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                  {t.highlight}
                </span>
              </motion.h1>
              
              <motion.p
                key={currentLanguage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg md:text-xl lg:text-2xl text-slate-300 mb-6 md:mb-8 leading-relaxed px-4"
              >
                {t.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center mb-8 md:mb-12"
              >
                <button 
                  onClick={() => router.push('/cadastro-new')}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold px-6 md:px-8 py-3 md:py-4 rounded-xl text-base md:text-lg transition-all transform hover:scale-105 shadow-2xl w-full sm:w-auto"
                >
                  {t.freeTrialBtn}
                </button>
                <button 
                  onClick={() => setShowVideoModal(true)}
                  className="border-2 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white font-bold px-6 md:px-8 py-3 md:py-4 rounded-xl text-base md:text-lg transition-all flex items-center justify-center space-x-2 w-full sm:w-auto"
                >
                  <span>{t.watchDemoBtn}</span>
                </button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-12 md:mb-16"
              >
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-yellow-400 mb-2">
                    {operationStats.totalTrades.toLocaleString()}
                  </div>
                  <div className="text-gray-400 text-sm md:text-base">{t.stats.trades}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-green-400 mb-2">{operationStats.successRate}%</div>
                  <div className="text-gray-400 text-sm md:text-base">{t.stats.successRate}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-blue-400 mb-2">
                    ${operationStats.totalProfit.toLocaleString()}
                  </div>
                  <div className="text-gray-400 text-sm md:text-base">{t.stats.totalProfit}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-purple-400 mb-2">
                    {operationStats.activeUsers.toLocaleString()}
                  </div>
                  <div className="text-gray-400 text-sm md:text-base">{t.stats.activeUsers}</div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section id="demo" className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
          <div className="container mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <motion.h2
                key={currentLanguage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-yellow-400 mb-4"
              >
                {t.demo.title}
              </motion.h2>
              <motion.p
                key={currentLanguage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto"
              >
                {t.demo.subtitle}
              </motion.p>
            </div>

            <div className="max-w-6xl mx-auto">
              <RobotDemo />
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <motion.h2
                key={currentLanguage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-orange-400 mb-4"
              >
                {t.contact.title}
              </motion.h2>
              <motion.p
                key={currentLanguage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-slate-300"
              >
                {t.contact.subtitle}
              </motion.p>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <a
                  href="https://wa.me/5521999596652"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 hover:bg-green-700 transition-colors rounded-2xl p-6 text-center group transform hover:scale-105"
                >
                  <div className="text-4xl mb-3">💬</div>
                  <h3 className="text-xl font-bold text-white mb-2">WhatsApp</h3>
                  <p className="text-green-100">+55 21 99596-6652</p>
                  <div className="mt-3 text-sm text-green-200">
                    {t.contact.whatsapp}
                  </div>
                </a>

                <a
                  href="mailto:faleconosco@coinbitclub.vip"
                  className="bg-blue-600 hover:bg-blue-700 transition-colors rounded-2xl p-6 text-center group transform hover:scale-105"
                >
                  <div className="text-4xl mb-3">📧</div>
                  <h3 className="text-xl font-bold text-white mb-2">Email</h3>
                  <p className="text-blue-100">faleconosco@coinbitclub.vip</p>
                  <div className="mt-3 text-sm text-blue-200">
                    {t.contact.email}
                  </div>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {/* Logo e Descrição */}
              <div className="md:col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-black font-bold text-lg">₿</span>
                  </div>
                  <div>
                    <div className="text-yellow-400 font-bold text-xl">CoinBitClub</div>
                    <div className="text-yellow-400 text-sm">MARKETBOT</div>
                  </div>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  {t.footer.description}
                </p>
              </div>

              {/* Contato */}
              <div>
                <h4 className="text-white font-semibold mb-4">
                  {t.footer.contact}
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="text-slate-400">
                    <strong className="text-green-400">WhatsApp</strong><br />
                    +55 21 99596-6652
                  </div>
                  <div className="text-slate-400">
                    <strong className="text-blue-400">Email</strong><br />
                    faleconosco@coinbitclub.vip
                  </div>
                  <div className="text-slate-400">
                    <strong className="text-purple-400">
                      {t.footer.hours}
                    </strong><br />
                    {t.footer.support}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-800 mt-6 md:mt-8 pt-6 md:pt-8 text-center">
              <p className="text-slate-500 text-sm">
                © 2025 CoinBitClub. {t.footer.rights}
              </p>
              <div className="mt-2 flex justify-center items-center space-x-4 md:space-x-6 text-xs text-slate-600">
                <span>🔒 {t.footer.secure}</span>
                <span>🛡️ {t.footer.protected}</span>
                <span>✅ {t.footer.audited}</span>
              </div>
            </div>
          </div>
        </footer>

        {/* FAQ Modal */}
        <AnimatePresence>
          {showFAQ && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowFAQ(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-800 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">
                    {t.faq.title}
                  </h3>
                  <button
                    onClick={() => setShowFAQ(false)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  {t.faq.questions.map((faq, index) => (
                    <div key={index} className="border border-slate-700 rounded-lg">
                      <button
                        onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                        className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-slate-700/50 transition-colors"
                      >
                        <span className="text-white font-medium">{faq.q}</span>
                        <span className={`text-slate-400 transition-transform ${
                          openFAQ === index ? 'rotate-180' : ''
                        }`}>
                          ▼
                        </span>
                      </button>
                      <AnimatePresence>
                        {openFAQ === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-3 text-slate-300">
                              {faq.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
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
              className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowVideoModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-800 rounded-2xl p-6 max-w-4xl w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">
                    {currentLanguage === 'pt' ? 'Demonstração do Sistema' : 'System Demonstration'}
                  </h3>
                  <button
                    onClick={() => setShowVideoModal(false)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="aspect-video bg-slate-900 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎥</div>
                    <h4 className="text-xl text-white mb-2">
                      {currentLanguage === 'pt' ? 'Vídeo de Demonstração' : 'Demo Video'}
                    </h4>
                    <p className="text-slate-400 mb-4">
                      {currentLanguage === 'pt' 
                        ? 'Veja como o robô funciona na prática'
                        : 'See how the robot works in practice'
                      }
                    </p>
                    <button
                      onClick={() => typeof window !== "undefined" && window.open('https://www.youtube.com/watch?v=PLACEHOLDER', '_blank')}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                      ▶️ {currentLanguage === 'pt' ? 'Assistir no YouTube' : 'Watch on YouTube'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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

        {/* Teste do idioma - Indicador visual */}
        <div className="fixed top-20 left-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 z-40 border border-yellow-500/30">
          <div className="text-xs text-yellow-400 font-mono">
            <div>🌐 Idioma: <span className="text-white font-bold">{currentLanguage.toUpperCase()}</span></div>
            <div>🔄 Funcionando: <span className="text-green-400">✅</span></div>
          </div>
        </div>
      </div>
    </>
  );
}
