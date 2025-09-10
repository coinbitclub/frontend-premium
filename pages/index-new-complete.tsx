import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../hooks/useLanguage';
// import RobotOperationTimeline from '../src/components/trading/RobotOperationTimeline';

export default function HomePage() {
  const router = useRouter();
  const { language, changeLanguage, isLoaded } = useLanguage();
  const [mounted, setMounted] = useState(false);
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
    if (changeLanguage && typeof changeLanguage === 'function') {
      changeLanguage(lang);
    }
  };

  const faqData = [
    {
      question: language === 'pt' ? "Como funciona o período de teste grátis?" : "How does the free trial work?",
      answer: language === 'pt' 
        ? "Você tem 7 dias para testar todas as funcionalidades do robô em modo TESTNET, sem risco ao seu capital. Durante este período, você pode avaliar a performance e decidir se deseja continuar."
        : "You have 7 days to test all robot features in TESTNET mode, with no risk to your capital. During this period, you can evaluate performance and decide if you want to continue."
    },
    {
      question: language === 'pt' ? "O robô realmente só lucra se eu lucrar?" : "Does the robot really only profit if I profit?",
      answer: language === 'pt'
        ? "Sim! Cobramos apenas 1,5% de comissão sobre os lucros reais. Se não há lucro, não há cobrança. Nosso interesse é que você tenha sucesso."
        : "Yes! We only charge 1.5% commission on real profits. If there's no profit, there's no charge. Our interest is in your success."
    },
    {
      question: language === 'pt' ? "Qual o valor mínimo para começar?" : "What's the minimum amount to start?",
      answer: language === 'pt'
        ? "O valor mínimo varia conforme o plano escolhido, começando a partir de $100 USD para o plano básico."
        : "The minimum amount varies according to the chosen plan, starting from $100 USD for the basic plan."
    },
    {
      question: language === 'pt' ? "Como funciona o programa de afiliados?" : "How does the affiliate program work?",
      answer: language === 'pt'
        ? "Ganhe 1,5% de comissão sobre os lucros dos seus indicados. É um sistema direto, sem pirâmide, onde você lucra quando seus indicados lucram."
        : "Earn 1.5% commission on your referrals' profits. It's a direct system, without pyramid structure, where you profit when your referrals profit."
    },
    {
      question: language === 'pt' ? "Posso cancelar a qualquer momento?" : "Can I cancel anytime?",
      answer: language === 'pt'
        ? "Sim, você pode cancelar sua assinatura a qualquer momento através do painel de controle. Não há fidelidade ou multas."
        : "Yes, you can cancel your subscription anytime through the control panel. There's no loyalty period or penalties."
    },
    {
      question: language === 'pt' ? "A plataforma é segura?" : "Is the platform secure?",
      answer: language === 'pt'
        ? "Utilizamos as melhores práticas de segurança, incluindo criptografia de dados, autenticação de dois fatores e conexões seguras com as exchanges."
        : "We use security best practices, including data encryption, two-factor authentication, and secure connections with exchanges."
    }
  ];

  const features = [
    {
      icon: "🔍",
      title: language === 'pt' ? "Análise de Mercado 24/7" : "24/7 Market Analysis",
      description: language === 'pt' 
        ? "IA monitora milhares de sinais em tempo real em todas as principais exchanges"
        : "AI monitors thousands of signals in real-time across all major exchanges"
    },
    {
      icon: "📊",
      title: language === 'pt' ? "Detecção de Oportunidades" : "Opportunity Detection",
      description: language === 'pt'
        ? "Algoritmos avançados identificam os melhores pontos de entrada e saída"
        : "Advanced algorithms identify the best entry and exit points"
    },
    {
      icon: "⚡",
      title: language === 'pt' ? "Execução Instantânea" : "Instant Execution",
      description: language === 'pt'
        ? "Robô executa operações em milissegundos para aproveitar cada oportunidade"
        : "Robot executes operations in milliseconds to seize every opportunity"
    },
    {
      icon: "👁️",
      title: language === 'pt' ? "Monitoramento Contínuo" : "Continuous Monitoring",
      description: language === 'pt'
        ? "Acompanhamento em tempo real de todas as posições e gerenciamento de risco"
        : "Real-time monitoring of all positions and risk management"
    },
    {
      icon: "💰",
      title: language === 'pt' ? "Gestão Inteligente" : "Smart Management",
      description: language === 'pt'
        ? "Stop loss e take profit automatizados para proteger seus investimentos"
        : "Automated stop loss and take profit to protect your investments"
    },
    {
      icon: "📈",
      title: language === 'pt' ? "Relatórios Avançados" : "Advanced Reports",
      description: language === 'pt'
        ? "Dashboard completo com analytics e métricas de performance detalhadas"
        : "Complete dashboard with analytics and detailed performance metrics"
    }
  ];

  const pricingPlans = [
    {
      name: language === 'pt' ? "Iniciante" : "Starter",
      price: "97",
      period: language === 'pt' ? "/mês" : "/month",
      description: language === 'pt' ? "Perfeito para começar" : "Perfect to start",
      features: [
        language === 'pt' ? "Robô de trading automatizado" : "Automated trading robot",
        language === 'pt' ? "Até 2 exchanges conectadas" : "Up to 2 connected exchanges",
        language === 'pt' ? "Suporte por email" : "Email support",
        language === 'pt' ? "Dashboard básico" : "Basic dashboard",
        language === 'pt' ? "1,5% comissão sobre lucros" : "1.5% commission on profits"
      ],
      highlighted: false
    },
    {
      name: language === 'pt' ? "Profissional" : "Professional",
      price: "197",
      period: language === 'pt' ? "/mês" : "/month",
      description: language === 'pt' ? "Para traders experientes" : "For experienced traders",
      features: [
        language === 'pt' ? "Todas as funcionalidades do Iniciante" : "All Starter features",
        language === 'pt' ? "Exchanges ilimitadas" : "Unlimited exchanges",
        language === 'pt' ? "Suporte prioritário 24/7" : "Priority 24/7 support",
        language === 'pt' ? "Dashboard avançado" : "Advanced dashboard",
        language === 'pt' ? "Análises personalizadas" : "Custom analysis",
        language === 'pt' ? "1,2% comissão sobre lucros" : "1.2% commission on profits"
      ],
      highlighted: true
    },
    {
      name: language === 'pt' ? "Enterprise" : "Enterprise",
      price: language === 'pt' ? "Personalizado" : "Custom",
      period: "",
      description: language === 'pt' ? "Para grandes investidores" : "For large investors",
      features: [
        language === 'pt' ? "Todas as funcionalidades do Profissional" : "All Professional features",
        language === 'pt' ? "Gerente de conta dedicado" : "Dedicated account manager",
        language === 'pt' ? "Configurações personalizadas" : "Custom configurations",
        language === 'pt' ? "API exclusiva" : "Exclusive API",
        language === 'pt' ? "Relatórios personalizados" : "Custom reports",
        language === 'pt' ? "Comissão negociável" : "Negotiable commission"
      ],
      highlighted: false
    }
  ];

  const testimonials = [
    {
      name: "Carlos Silva",
      role: language === 'pt' ? "Investidor" : "Investor",
      image: "👨‍💼",
      content: language === 'pt'
        ? "Em 3 meses usando o CoinBitClub, consegui um retorno de 127%. O robô funciona 24/7 e eu não preciso me preocupar."
        : "In 3 months using CoinBitClub, I achieved a 127% return. The robot works 24/7 and I don't need to worry."
    },
    {
      name: "Ana Rodrigues",
      role: language === 'pt' ? "Empresária" : "Entrepreneur",
      image: "👩‍💼",
      content: language === 'pt'
        ? "Nunca pensei que trading poderia ser tão simples. O sistema faz tudo automaticamente e os resultados são excelentes."
        : "I never thought trading could be so simple. The system does everything automatically and the results are excellent."
    },
    {
      name: "Roberto Costa",
      role: language === 'pt' ? "Desenvolvedor" : "Developer",
      image: "👨‍💻",
      content: language === 'pt'
        ? "A tecnologia por trás é impressionante. Como desenvolvedor, posso afirmar que é uma solução muito bem estruturada."
        : "The technology behind it is impressive. As a developer, I can say it's a very well-structured solution."
    }
  ];

  if (!mounted || !isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
            <span className="text-black font-bold text-xl">₿</span>
          </div>
          <p className="text-gray-400">{language === 'pt' ? 'Carregando...' : 'Loading...'}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>
          {language === 'pt' 
            ? 'CoinBitClub MarketBot - Trading Automatizado de Criptomoedas com IA' 
            : 'CoinBitClub MarketBot - AI-Powered Automated Cryptocurrency Trading'
          }
        </title>
        <meta 
          name="description" 
          content={language === 'pt' 
            ? "Plataforma de trading automatizado de criptomoedas com IA. Ganhe dinheiro no piloto automático 24/7. Comissão apenas sobre lucros reais. Teste grátis por 7 dias!" 
            : "AI-powered automated cryptocurrency trading platform. Make money on autopilot 24/7. Commission only on real profits. Free 7-day trial!"
          } 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={language === 'pt' ? 'CoinBitClub MarketBot - Trading Automatizado' : 'CoinBitClub MarketBot - Automated Trading'} />
        <meta property="og:description" content={language === 'pt' ? 'Trading automatizado 24/7 com IA' : '24/7 automated trading with AI'} />
        <meta property="og:type" content="website" />
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
              <nav className="hidden md:flex items-center space-x-8">
                <a href="#features" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  {language === 'pt' ? 'Recursos' : 'Features'}
                </a>
                <a href="#demo" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  {language === 'pt' ? 'Demo' : 'Demo'}
                </a>
                <a href="#pricing" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  {language === 'pt' ? 'Planos' : 'Pricing'}
                </a>
                <a href="#testimonials" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  {language === 'pt' ? 'Depoimentos' : 'Testimonials'}
                </a>
                <button
                  onClick={() => setShowFAQ(true)}
                  className="text-gray-300 hover:text-yellow-400 transition-colors"
                >
                  FAQ
                </button>
              </nav>

              {/* Language Selector & Auth */}
              <div className="flex items-center space-x-4">
                <div className="flex bg-slate-800 rounded-lg p-1">
                  <button
                    onClick={() => handleLanguageChange('pt')}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      language === 'pt' 
                        ? 'bg-yellow-500 text-black font-medium' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    PT
                  </button>
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      language === 'en' 
                        ? 'bg-yellow-500 text-black font-medium' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    EN
                  </button>
                </div>

                <button 
                  onClick={() => router.push('/auth/login')}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  {language === 'pt' ? 'Login' : 'Login'}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-orange-500/10"></div>
          <div className="absolute left-1/4 top-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute right-1/4 bottom-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

          <div className="container mx-auto text-center relative z-10">
            <div className="max-w-5xl mx-auto">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight"
              >
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  MARKETBOT
                </span>
                <br />
                <span className="text-white">
                  {language === 'pt' 
                    ? 'o robô de trade automático que' 
                    : 'the automated trading robot that'
                  }
                </span>
                <br />
                <span className="bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
                  {language === 'pt' ? 'só lucra se você lucrar' : 'only profits if you profit'}
                </span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed"
              >
                {language === 'pt' 
                  ? 'Monitoramento de mercado com IA para entrada e saída dos sinais certos. Trading 24/7 no piloto automático.'
                  : 'AI market monitoring for right signal entry and exit. 24/7 autopilot trading.'
                }
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
              >
                <button 
                  onClick={() => router.push('/cadastro-new')}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold px-8 py-4 rounded-xl text-lg transition-all transform hover:scale-105 shadow-2xl"
                >
                  🚀 {language === 'pt' ? 'Teste Grátis 7 Dias' : 'Free 7-Day Trial'}
                </button>
                <button 
                  onClick={() => setShowVideoModal(true)}
                  className="border-2 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white font-bold px-8 py-4 rounded-xl text-lg transition-all flex items-center space-x-2"
                >
                  <span>🎥</span>
                  <span>{language === 'pt' ? 'Ver Demonstração' : 'Watch Demo'}</span>
                </button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">
                    {operationStats.totalTrades.toLocaleString()}
                  </div>
                  <div className="text-gray-400">{language === 'pt' ? 'Operações' : 'Trades'}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">{operationStats.successRate}%</div>
                  <div className="text-gray-400">{language === 'pt' ? 'Taxa de Sucesso' : 'Success Rate'}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    ${operationStats.totalProfit.toLocaleString()}
                  </div>
                  <div className="text-gray-400">{language === 'pt' ? 'Lucro Total' : 'Total Profit'}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    {operationStats.activeUsers.toLocaleString()}
                  </div>
                  <div className="text-gray-400">{language === 'pt' ? 'Usuários Ativos' : 'Active Users'}</div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Demo Section - Robot Animation */}
        <section id="demo" className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-4">
                {language === 'pt' ? 'Veja o Robô em Ação' : 'See the Robot in Action'}
              </h2>
              <p className="text-xl text-slate-300">
                {language === 'pt' 
                  ? 'Timeline em tempo real de como nossa IA opera no mercado 24/7'
                  : 'Real-time timeline of how our AI operates in the market 24/7'
                }
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              {/* <RobotOperationTimeline 
                isActive={true} 
                speed="normal" 
                compact={false}
              /> */}
              <div className="text-center py-8">
                <p className="text-gray-500">Robot Operation Timeline (Temporarily Disabled)</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-blue-400 mb-4">
                {language === 'pt' ? 'Como Funciona' : 'How It Works'}
              </h2>
              <p className="text-xl text-slate-300">
                {language === 'pt' 
                  ? '6 etapas simples para multiplicar seus resultados'
                  : '6 simple steps to multiply your results'
                }
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 hover:border-blue-500/50 transition-all group"
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-green-400 mb-4">
                {language === 'pt' ? 'Planos e Preços' : 'Plans & Pricing'}
              </h2>
              <p className="text-xl text-slate-300">
                {language === 'pt' 
                  ? 'Escolha o plano ideal para o seu perfil de investimento'
                  : 'Choose the ideal plan for your investment profile'
                }
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative bg-slate-800/50 backdrop-blur-md rounded-2xl p-8 border transition-all hover:scale-105 ${
                    plan.highlighted 
                      ? 'border-yellow-500/50 ring-2 ring-yellow-500/20' 
                      : 'border-slate-700/50 hover:border-green-500/50'
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-1 rounded-full text-sm font-bold">
                        {language === 'pt' ? 'MAIS POPULAR' : 'MOST POPULAR'}
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-gray-400 mb-4">{plan.description}</p>
                    <div className="text-4xl font-bold text-green-400 mb-2">
                      {plan.price === 'Personalizado' || plan.price === 'Custom' ? plan.price : `$${plan.price}`}
                      <span className="text-lg text-gray-400">{plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <span className="text-green-400">✓</span>
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button 
                    onClick={() => router.push('/cadastro-new')}
                    className={`w-full py-3 rounded-xl font-semibold transition-all ${
                      plan.highlighted
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:opacity-90'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {language === 'pt' ? 'Começar Agora' : 'Start Now'}
                  </button>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-slate-400 mb-4">
                {language === 'pt' 
                  ? '✨ Garantia de 30 dias ou seu dinheiro de volta'
                  : '✨ 30-day money-back guarantee'
                }
              </p>
              <div className="flex justify-center items-center space-x-8 text-sm text-slate-500">
                <span>🔒 {language === 'pt' ? 'Pagamento Seguro' : 'Secure Payment'}</span>
                <span>🚫 {language === 'pt' ? 'Sem Fidelidade' : 'No Lock-in'}</span>
                <span>📞 {language === 'pt' ? 'Suporte 24/7' : '24/7 Support'}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Affiliate Program Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-purple-400 mb-4">
                {language === 'pt' ? 'Programa de Indicação' : 'Referral Program'}
              </h2>
              <p className="text-xl text-slate-300">
                {language === 'pt' 
                  ? 'Ganhe 1,5% sobre o lucro real de cada pessoa que você indicar'
                  : 'Earn 1.5% on real profits from each person you refer'
                }
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 backdrop-blur-md rounded-3xl p-8 border border-purple-500/30">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-2xl">👥</span>
                      </div>
                      <h3 className="text-2xl font-bold text-white">
                        {language === 'pt' ? 'Como Funciona' : 'How It Works'}
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                          <span className="text-black text-sm font-bold">💰</span>
                        </div>
                        <span className="text-slate-300">
                          {language === 'pt' 
                            ? '1,5% de comissão sobre lucro real'
                            : '1.5% commission on real profits'
                          }
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">🚫</span>
                        </div>
                        <span className="text-slate-300">
                          {language === 'pt' 
                            ? 'Sem esquema de pirâmide'
                            : 'No pyramid scheme'
                          }
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">💳</span>
                        </div>
                        <span className="text-slate-300">
                          {language === 'pt' 
                            ? 'Saque ou crédito na plataforma'
                            : 'Withdraw or platform credit'
                          }
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">📊</span>
                        </div>
                        <span className="text-slate-300">
                          {language === 'pt' 
                            ? 'Dashboard de acompanhamento'
                            : 'Tracking dashboard'
                          }
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">🎯</span>
                        </div>
                        <span className="text-slate-300">
                          {language === 'pt' 
                            ? 'Sem limite de indicações'
                            : 'No referral limits'
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-8 mb-6">
                      <div className="text-6xl font-bold text-white mb-2">1,5%</div>
                      <div className="text-white text-lg">
                        {language === 'pt' ? 'sobre lucro real' : 'on real profits'}
                      </div>
                    </div>
                    <button
                      onClick={() => router.push('/cadastro-new')}
                      className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl text-lg hover:opacity-90 transition-opacity"
                    >
                      → {language === 'pt' ? 'Começar Agora' : 'Start Now'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-4">
                {language === 'pt' ? 'Depoimentos' : 'Testimonials'}
              </h2>
              <p className="text-xl text-slate-300">
                {language === 'pt' 
                  ? 'Veja o que nossos usuários estão dizendo'
                  : 'See what our users are saying'
                }
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 hover:border-cyan-500/50 transition-all"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="text-4xl">{testimonial.image}</span>
                    <div>
                      <h4 className="text-lg font-semibold text-white">{testimonial.name}</h4>
                      <p className="text-cyan-400 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-slate-300 italic leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div className="flex text-yellow-400 mt-4">
                    {'⭐'.repeat(5)}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-orange-400 mb-4">
                {language === 'pt' ? 'Contato e Suporte' : 'Contact & Support'}
              </h2>
              <p className="text-xl text-slate-300">
                {language === 'pt' 
                  ? 'Estamos aqui para ajudar você 24/7'
                  : 'We are here to help you 24/7'
                }
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <a
                  href="https://wa.me/5521999596652"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 hover:bg-green-700 transition-colors rounded-2xl p-6 text-center group"
                >
                  <div className="text-4xl mb-3">💬</div>
                  <h3 className="text-xl font-bold text-white mb-2">WhatsApp</h3>
                  <p className="text-green-100">+55 21 99596-6652</p>
                  <div className="mt-3 text-sm text-green-200">
                    {language === 'pt' ? 'Resposta imediata' : 'Immediate response'}
                  </div>
                </a>

                <a
                  href="mailto:faleconosco@coinbitclub.vip"
                  className="bg-blue-600 hover:bg-blue-700 transition-colors rounded-2xl p-6 text-center group"
                >
                  <div className="text-4xl mb-3">📧</div>
                  <h3 className="text-xl font-bold text-white mb-2">Email</h3>
                  <p className="text-blue-100">faleconosco@coinbitclub.vip</p>
                  <div className="mt-3 text-sm text-blue-200">
                    {language === 'pt' ? 'Resposta em até 1h' : 'Response within 1h'}
                  </div>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
                  {language === 'pt' 
                    ? 'MARKETBOT: o robô de trade automático que só lucra se você lucrar. Tecnologia de ponta para maximizar seus resultados no mercado de criptomoedas.'
                    : 'MARKETBOT: the automated trading robot that only profits if you profit. Cutting-edge technology to maximize your results in the cryptocurrency market.'
                  }
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-slate-400 hover:text-yellow-400 transition-colors">
                    <span className="text-2xl">📘</span>
                  </a>
                  <a href="#" className="text-slate-400 hover:text-yellow-400 transition-colors">
                    <span className="text-2xl">📸</span>
                  </a>
                  <a href="#" className="text-slate-400 hover:text-yellow-400 transition-colors">
                    <span className="text-2xl">🐦</span>
                  </a>
                  <a href="#" className="text-slate-400 hover:text-yellow-400 transition-colors">
                    <span className="text-2xl">💼</span>
                  </a>
                </div>
              </div>

              {/* Links Úteis */}
              <div>
                <h4 className="text-white font-semibold mb-4">
                  {language === 'pt' ? 'Links Úteis' : 'Useful Links'}
                </h4>
                <div className="space-y-2">
                  <a href="/terms" className="block text-slate-400 hover:text-yellow-400 transition-colors text-sm">
                    {language === 'pt' ? 'Termos de Uso' : 'Terms of Use'}
                  </a>
                  <a href="/privacy" className="block text-slate-400 hover:text-yellow-400 transition-colors text-sm">
                    {language === 'pt' ? 'Política de Privacidade' : 'Privacy Policy'}
                  </a>
                  <button 
                    onClick={() => setShowFAQ(true)}
                    className="block text-slate-400 hover:text-yellow-400 transition-colors text-left text-sm"
                  >
                    {language === 'pt' ? 'Perguntas Frequentes' : 'FAQ'}
                  </button>
                  <a href="/security" className="block text-slate-400 hover:text-yellow-400 transition-colors text-sm">
                    {language === 'pt' ? 'Segurança' : 'Security'}
                  </a>
                </div>
              </div>

              {/* Contato */}
              <div>
                <h4 className="text-white font-semibold mb-4">
                  {language === 'pt' ? 'Contato' : 'Contact'}
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
                      {language === 'pt' ? 'Horário' : 'Hours'}
                    </strong><br />
                    {language === 'pt' ? 'Suporte 24/7' : '24/7 Support'}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-800 mt-8 pt-8 text-center">
              <p className="text-slate-500 text-sm">
                © 2025 CoinBitClub. {language === 'pt' ? 'Todos os direitos reservados.' : 'All rights reserved.'}
              </p>
              <div className="mt-2 flex justify-center items-center space-x-6 text-xs text-slate-600">
                <span>🔒 SSL {language === 'pt' ? 'Seguro' : 'Secure'}</span>
                <span>🛡️ {language === 'pt' ? 'Dados Protegidos' : 'Data Protected'}</span>
                <span>✅ {language === 'pt' ? 'Auditado' : 'Audited'}</span>
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
                    {language === 'pt' ? 'Perguntas Frequentes' : 'Frequently Asked Questions'}
                  </h3>
                  <button
                    onClick={() => setShowFAQ(false)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  {faqData.map((faq, index) => (
                    <div key={index} className="border border-slate-700 rounded-lg">
                      <button
                        onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                        className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-slate-700/50 transition-colors"
                      >
                        <span className="text-white font-medium">{faq.question}</span>
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
                              {faq.answer}
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
                    {language === 'pt' ? 'Demonstração do Sistema' : 'System Demonstration'}
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
                      {language === 'pt' ? 'Vídeo de Demonstração' : 'Demo Video'}
                    </h4>
                    <p className="text-slate-400 mb-4">
                      {language === 'pt' 
                        ? 'Veja como o robô funciona na prática'
                        : 'See how the robot works in practice'
                      }
                    </p>
                    <button
                      onClick={() => window.open('https://www.youtube.com/watch?v=PLACEHOLDER', '_blank')}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                      ▶️ {language === 'pt' ? 'Assistir no YouTube' : 'Watch on YouTube'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Action Buttons */}
        <div className="fixed bottom-6 right-6 flex flex-col space-y-3 z-40">
          <button
            onClick={() => setShowFAQ(true)}
            className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110"
          >
            <span className="text-white text-xl">❓</span>
          </button>
          <a
            href="https://wa.me/5521999596652"
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110"
          >
            <span className="text-white text-xl">💬</span>
          </a>
        </div>
      </div>
    </>
  );
}
