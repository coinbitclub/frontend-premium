import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FaBars, 
  FaTimes, 
  FaShieldAlt, 
  FaFileContract, 
  FaHome, 
  FaGlobe,
  FaArrowLeft 
} from 'react-icons/fa';

const TermsNewPage: NextPage = () => {
  // Language state - simplified direct management
  const [language, setLanguage] = useState<'pt' | 'en'>('pt');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeTab, setActiveTab] = useState('terms');

  // Analytics tracking on page load
  useEffect(() => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'terms_page_view', {
        page_title: 'Terms and Privacy',
        language: language,
        event_category: 'engagement'
      });
    }
  }, []);

  // Analytics tracking functions
  const trackTabChange = (tab: string) => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'terms_tab_change', {
        tab: tab,
        language: language,
        event_category: 'engagement'
      });
    }
  };

  // Handle language change
  const handleLanguageChange = (lang: 'pt' | 'en') => {
    setLanguage(lang);
  };

  // Translations
  const t = {
    pt: {
      title: 'Termos e Políticas',
      subtitle: 'Transparência total sobre como operamos e protegemos você',
      home: 'Início',
      plans: 'Planos',
      terms: 'Termos e Políticas',
      login: 'Entrar',
      register: 'Cadastrar',
      backToHome: 'Voltar para Home',
      termsOfUse: 'Termos de Uso',
      privacyPolicy: 'Política de Privacidade',
      lastUpdated: 'Última atualização: agosto/2025'
    },
    en: {
      title: 'Terms & Policies',
      subtitle: 'Total transparency about how we operate and protect you',
      home: 'Home',
      plans: 'Plans',
      terms: 'Terms & Policies',
      login: 'Login',
      register: 'Register',
      backToHome: 'Back to Home',
      termsOfUse: 'Terms of Use',
      privacyPolicy: 'Privacy Policy',
      lastUpdated: 'Last updated: August/2025'
    }
  };

  const currentT = t[language];

  return (
    <>
      <Head>
        <title>{currentT.title} - CoinBitClub</title>
        <meta name="description" content={currentT.subtitle} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-yellow-500/10"></div>
        <div className="absolute left-1/4 top-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute right-1/4 bottom-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

        {/* Header Navigation */}
        <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-700/30 sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/landingpage/home" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center">
                  <span className="text-black font-bold text-lg">C</span>
                </div>
                <span className="text-xl font-bold text-white">CoinBitClub</span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-8">
                <Link href="/landingpage/home" className="text-gray-300 hover:text-white transition-colors">
                  {currentT.home}
                </Link>
                <Link href="/planos-new" className="text-gray-300 hover:text-white transition-colors">
                  {currentT.plans}
                </Link>
                <Link href="/termos-new" className="text-orange-400 font-semibold">
                  {currentT.terms}
                </Link>
              </nav>

              {/* Language Selector */}
              <div className="hidden md:flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <FaGlobe className="text-gray-400" />
                  <div className="flex bg-gray-700/50 rounded-lg p-1">
                    <button
                      onClick={() => handleLanguageChange('pt')}
                      className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                        language === 'pt'
                          ? 'bg-orange-500 text-black'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      PT
                    </button>
                    <button
                      onClick={() => handleLanguageChange('en')}
                      className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                        language === 'en'
                          ? 'bg-orange-500 text-black'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      EN
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4">
                  <Link 
                    href="/auth/login-new"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {currentT.login}
                  </Link>
                  <Link 
                    href="/auth/register-new"
                    className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-bold px-6 py-2 rounded-xl transition-all"
                  >
                    {currentT.register}
                  </Link>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden text-white p-2"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                {showMobileMenu ? <FaTimes /> : <FaBars />}
              </button>
            </div>

            {/* Mobile Menu */}
            {showMobileMenu && (
              <div className="md:hidden bg-gray-800/90 backdrop-blur-sm border-t border-gray-700/30">
                <div className="py-4 space-y-2">
                  <Link href="/landingpage/home" className="block px-4 py-2 text-gray-300 hover:text-white transition-colors">
                    {currentT.home}
                  </Link>
                  <Link href="/planos-new" className="block px-4 py-2 text-gray-300 hover:text-white transition-colors">
                    {currentT.plans}
                  </Link>
                  <Link href="/termos-new" className="block px-4 py-2 text-orange-400 font-semibold">
                    {currentT.terms}
                  </Link>
                  
                  {/* Language Selector Mobile */}
                  <div className="border-t border-gray-700/30 pt-2 mt-2">
                    <div className="flex items-center gap-2 px-4 py-2">
                      <FaGlobe className="text-gray-400" />
                      <div className="flex bg-gray-700/50 rounded-lg p-1">
                        <button
                          onClick={() => handleLanguageChange('pt')}
                          className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                            language === 'pt'
                              ? 'bg-orange-500 text-black'
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          PT
                        </button>
                        <button
                          onClick={() => handleLanguageChange('en')}
                          className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                            language === 'en'
                              ? 'bg-orange-500 text-black'
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          EN
                        </button>
                      </div>
                    </div>
                    
                    <Link href="/auth/login-new" className="block px-4 py-2 text-gray-300 hover:text-white transition-colors">
                      {currentT.login}
                    </Link>
                    <Link href="/auth/register-new" className="block px-4 py-2 text-orange-400 font-semibold">
                      {currentT.register}
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <div className="relative">
          {/* Back Button */}
          <div className="container mx-auto px-4 pt-8">
            <Link 
              href="/landingpage/home"
              className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors mb-6"
            >
              <FaArrowLeft />
              {currentT.backToHome}
            </Link>
          </div>

          {/* Header Section */}
          <section className="pb-16">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center"
              >
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                  {language === 'pt' ? 'Políticas e ' : 'Policies & '}
                  <span className="text-yellow-400">Termos</span>
                </h1>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  {currentT.subtitle}
                </p>
              </motion.div>
            </div>
          </section>

          {/* Tab Navigation */}
          <div className="container mx-auto px-4 pb-8">
            <div className="flex justify-center mb-8">
              <div className="flex bg-gray-800/50 rounded-xl p-1">
                <button
                  onClick={() => {
                    trackTabChange('terms');
                    setActiveTab('terms');
                  }}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                    activeTab === 'terms'
                      ? 'bg-orange-500 text-black'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <FaFileContract />
                  {currentT.termsOfUse}
                </button>
                <button
                  onClick={() => {
                    trackTabChange('privacy');
                    setActiveTab('privacy');
                  }}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                    activeTab === 'privacy'
                      ? 'bg-orange-500 text-black'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <FaShieldAlt />
                  {currentT.privacyPolicy}
                </button>
              </div>
            </div>

            {/* Terms of Use Content */}
            {activeTab === 'terms' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/30"
              >
                <div className="text-white space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold text-orange-400 mb-4">
                      {language === 'pt' ? 'Termos de Uso' : 'Terms of Use'}
                    </h2>
                    <p className="text-gray-400 mb-6">{currentT.lastUpdated}</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-black font-bold">1</div>
                        <h3 className="text-xl font-bold">
                          {language === 'pt' ? 'Aceitação dos Termos' : 'Acceptance of Terms'}
                        </h3>
                      </div>
                      <p className="text-gray-300 leading-relaxed">
                        {language === 'pt' 
                          ? 'Ao utilizar os serviços do CoinBitClub MARKETBOT ("Serviço", "nós", "nosso"), você concorda com estes Termos de Uso. Se você não concorda com qualquer parte destes termos, não deve usar nosso serviço.'
                          : 'By using CoinBitClub MARKETBOT services ("Service", "we", "our"), you agree to these Terms of Use. If you do not agree with any part of these terms, you should not use our service.'
                        }
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-black font-bold">2</div>
                        <h3 className="text-xl font-bold">
                          {language === 'pt' ? 'Descrição do Serviço' : 'Service Description'}
                        </h3>
                      </div>
                      <p className="text-gray-300 leading-relaxed mb-4">
                        {language === 'pt' 
                          ? 'O MARKETBOT é um sistema de trading automatizado que utiliza inteligência artificial para:'
                          : 'MARKETBOT is an automated trading system that uses artificial intelligence to:'
                        }
                      </p>
                      <ul className="text-gray-300 space-y-2 ml-6">
                        <li>• {language === 'pt' ? 'Analisar mercados de criptomoedas em tempo real' : 'Analyze cryptocurrency markets in real time'}</li>
                        <li>• {language === 'pt' ? 'Executar operações automatizadas baseadas em algoritmos' : 'Execute automated operations based on algorithms'}</li>
                        <li>• {language === 'pt' ? 'Gerenciar riscos através de stop loss e take profit' : 'Manage risks through stop loss and take profit'}</li>
                        <li>• {language === 'pt' ? 'Fornecer relatórios e análises de performance' : 'Provide performance reports and analysis'}</li>
                      </ul>
                      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mt-4">
                        <p className="text-yellow-300 font-semibold">⚠️ {language === 'pt' ? 'Importante:' : 'Important:'}</p>
                        <p className="text-yellow-200">
                          {language === 'pt' 
                            ? 'Trading de criptomoedas é altamente volátil e envolve riscos significativos.'
                            : 'Cryptocurrency trading is highly volatile and involves significant risks.'
                          }
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-black font-bold">3</div>
                        <h3 className="text-xl font-bold">
                          {language === 'pt' ? 'Segurança e Custódia' : 'Security and Custody'}
                        </h3>
                      </div>
                      <p className="text-gray-300 leading-relaxed mb-4">
                        <strong>
                          {language === 'pt' 
                            ? 'Seus fundos estão seguros:' 
                            : 'Your funds are safe:'
                          }
                        </strong> {language === 'pt' 
                          ? 'Não temos acesso aos seus fundos. Tudo fica na sua exchange, conectamos via API para trading.'
                          : 'We have no access to your funds. Everything stays on your exchange, we connect via API for trading.'
                        }
                      </p>
                      <ul className="text-gray-300 space-y-2 ml-6">
                        <li>• {language === 'pt' ? 'Não armazenamos chaves privadas ou senhas de exchanges' : 'We do not store private keys or exchange passwords'}</li>
                        <li>• {language === 'pt' ? 'Utilizamos apenas APIs de trading (sem retirada)' : 'We use only trading APIs (no withdrawal)'}</li>
                        <li>• {language === 'pt' ? 'Você mantém controle total dos seus ativos' : 'You maintain full control of your assets'}</li>
                        <li>• {language === 'pt' ? 'Pode desconectar o bot a qualquer momento' : 'You can disconnect the bot at any time'}</li>
                      </ul>
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-black font-bold">4</div>
                        <h3 className="text-xl font-bold">
                          {language === 'pt' ? 'Modelo de Cobrança' : 'Pricing Model'}
                        </h3>
                      </div>
                      <p className="text-gray-300 leading-relaxed mb-4">
                        {language === 'pt' 
                          ? 'Nosso modelo de cobrança é transparente e alinhado aos seus resultados:'
                          : 'Our pricing model is transparent and aligned with your results:'
                        }
                      </p>
                      <ul className="text-gray-300 space-y-2 ml-6">
                        <li>• {language === 'pt' ? 'Taxa de Performance: 10% ou 20% sobre o lucro real gerado, de acordo com o plano' : 'Performance Fee: 10% or 20% on actual profit generated, according to plan'}</li>
                        <li>• {language === 'pt' ? 'Teste gratuito: 7 dias sem cobrança (TESTNET)' : 'Free trial: 7 days without charge (TESTNET)'}</li>
                        <li>• {language === 'pt' ? 'Cancelamento: Pode cancelar a qualquer momento' : 'Cancellation: Can cancel at any time'}</li>
                      </ul>
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-black font-bold">5</div>
                        <h3 className="text-xl font-bold">
                          {language === 'pt' ? 'Limitações e Responsabilidades' : 'Limitations and Responsibilities'}
                        </h3>
                      </div>
                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
                        <p className="text-red-300 font-semibold">
                          {language === 'pt' ? 'Isenção de Responsabilidade:' : 'Disclaimer:'}
                        </p>
                        <p className="text-red-200">
                          {language === 'pt' 
                            ? 'O trading automatizado não garante lucros. Perdas são possíveis e fazem parte do trading.'
                            : 'Automated trading does not guarantee profits. Losses are possible and are part of trading.'
                          }
                        </p>
                      </div>
                      <ul className="text-gray-300 space-y-2 ml-6">
                        <li>• {language === 'pt' ? 'Não garantimos resultados específicos' : 'We do not guarantee specific results'}</li>
                        <li>• {language === 'pt' ? 'Você é responsável por suas decisões de investimento' : 'You are responsible for your investment decisions'}</li>
                        <li>• {language === 'pt' ? 'Não reembolsamos perdas' : 'We do not reimburse losses'}</li>
                      </ul>
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-black font-bold">6</div>
                        <h3 className="text-xl font-bold">
                          {language === 'pt' ? 'Modificações e Cancelamento' : 'Modifications and Cancellation'}
                        </h3>
                      </div>
                      <p className="text-gray-300 leading-relaxed">
                        {language === 'pt' 
                          ? 'Você pode cancelar sua assinatura a qualquer momento através do dashboard ou entrando em contato conosco. O cancelamento será efetivo no final do período de cobrança atual.'
                          : 'You can cancel your subscription at any time through the dashboard or by contacting us. Cancellation will be effective at the end of the current billing period.'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Privacy Policy Content */}
            {activeTab === 'privacy' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/30"
              >
                <div className="text-white space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold text-orange-400 mb-4">
                      {language === 'pt' ? 'Política de Privacidade' : 'Privacy Policy'}
                    </h2>
                    <p className="text-gray-400 mb-6">{currentT.lastUpdated}</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">1</div>
                        <h3 className="text-xl font-bold">
                          {language === 'pt' ? 'Informações que Coletamos' : 'Information We Collect'}
                        </h3>
                      </div>
                      <p className="text-gray-300 leading-relaxed mb-4">
                        {language === 'pt' 
                          ? 'Coletamos apenas as informações necessárias para fornecer nossos serviços:'
                          : 'We collect only the information necessary to provide our services:'
                        }
                      </p>
                      
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
                        <h4 className="text-blue-300 font-semibold mb-2">
                          {language === 'pt' ? 'Informações Pessoais:' : 'Personal Information:'}
                        </h4>
                        <ul className="text-gray-300 space-y-1 ml-4">
                          <li>• {language === 'pt' ? 'Nome completo' : 'Full name'}</li>
                          <li>• {language === 'pt' ? 'Endereço de email' : 'Email address'}</li>
                          <li>• {language === 'pt' ? 'Número de telefone' : 'Phone number'}</li>
                          <li>• {language === 'pt' ? 'País de residência' : 'Country of residence'}</li>
                        </ul>
                      </div>

                      <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 mb-4">
                        <h4 className="text-purple-300 font-semibold mb-2">
                          {language === 'pt' ? 'Dados de Trading:' : 'Trading Data:'}
                        </h4>
                        <ul className="text-gray-300 space-y-1 ml-4">
                          <li>• {language === 'pt' ? 'Histórico de operações (para relatórios)' : 'Trading history (for reports)'}</li>
                          <li>• {language === 'pt' ? 'Performance do bot' : 'Bot performance'}</li>
                          <li>• {language === 'pt' ? 'Configurações de trading' : 'Trading settings'}</li>
                          <li>• {language === 'pt' ? 'Dados de uso da plataforma' : 'Platform usage data'}</li>
                        </ul>
                      </div>

                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                        <p className="text-red-300 font-semibold">
                          {language === 'pt' ? 'Nunca coletamos:' : 'We never collect:'}
                        </p>
                        <p className="text-red-200">
                          {language === 'pt' 
                            ? 'Chaves privadas, senhas de exchanges, ou qualquer informação que dê acesso aos seus fundos.'
                            : 'Private keys, exchange passwords, or any information that gives access to your funds.'
                          }
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">2</div>
                        <h3 className="text-xl font-bold">
                          {language === 'pt' ? 'Como Usamos suas Informações' : 'How We Use Your Information'}
                        </h3>
                      </div>
                      <p className="text-gray-300 leading-relaxed mb-4">
                        {language === 'pt' 
                          ? 'Utilizamos suas informações exclusivamente para:'
                          : 'We use your information exclusively to:'
                        }
                      </p>
                      <ul className="text-gray-300 space-y-2 ml-6">
                        <li>• {language === 'pt' ? 'Fornecer e manter nossos serviços de trading automatizado' : 'Provide and maintain our automated trading services'}</li>
                        <li>• {language === 'pt' ? 'Enviar relatórios de performance e alertas' : 'Send performance reports and alerts'}</li>
                        <li>• {language === 'pt' ? 'Oferecer suporte técnico quando necessário' : 'Provide technical support when needed'}</li>
                        <li>• {language === 'pt' ? 'Melhorar nossos algoritmos e serviços' : 'Improve our algorithms and services'}</li>
                        <li>• {language === 'pt' ? 'Cumprir obrigações legais e regulatórias' : 'Comply with legal and regulatory obligations'}</li>
                      </ul>
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">3</div>
                        <h3 className="text-xl font-bold">
                          {language === 'pt' ? 'Proteção de Dados' : 'Data Protection'}
                        </h3>
                      </div>
                      <p className="text-gray-300 leading-relaxed mb-4">
                        {language === 'pt' 
                          ? 'Implementamos medidas de segurança rigorosas:'
                          : 'We implement rigorous security measures:'
                        }
                      </p>
                      <ul className="text-gray-300 space-y-2 ml-6">
                        <li>• {language === 'pt' ? 'Criptografia SSL/TLS para todas as comunicações' : 'SSL/TLS encryption for all communications'}</li>
                        <li>• {language === 'pt' ? 'Armazenamento seguro com criptografia de dados' : 'Secure storage with data encryption'}</li>
                        <li>• {language === 'pt' ? 'Acesso restrito apenas para equipe autorizada' : 'Restricted access only to authorized staff'}</li>
                        <li>• {language === 'pt' ? 'Monitoramento contínuo de segurança' : 'Continuous security monitoring'}</li>
                        <li>• {language === 'pt' ? 'Backups seguros e regulares' : 'Secure and regular backups'}</li>
                      </ul>
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mt-4">
                        <p className="text-green-300 font-semibold">
                          {language === 'pt' ? 'Conformidade LGPD:' : 'GDPR Compliance:'}
                        </p>
                        <p className="text-green-200">
                          {language === 'pt' 
                            ? 'Estamos em total conformidade com a Lei Geral de Proteção de Dados (LGPD).'
                            : 'We are in full compliance with the General Data Protection Regulation (GDPR).'
                          }
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">4</div>
                        <h3 className="text-xl font-bold">
                          {language === 'pt' ? 'Compartilhamento de Informações' : 'Information Sharing'}
                        </h3>
                      </div>
                      <p className="text-gray-300 leading-relaxed mb-4">
                        {language === 'pt' 
                          ? 'Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, exceto:'
                          : 'We do not sell, rent or share your personal information with third parties, except:'
                        }
                      </p>
                      <ul className="text-gray-300 space-y-2 ml-6">
                        <li>• {language === 'pt' ? 'Quando exigido por lei ou autoridades competentes' : 'When required by law or competent authorities'}</li>
                        <li>• {language === 'pt' ? 'Para provedores de serviços essenciais (com contratos de confidencialidade)' : 'To essential service providers (with confidentiality agreements)'}</li>
                        <li>• {language === 'pt' ? 'Com seu consentimento explícito' : 'With your explicit consent'}</li>
                      </ul>
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">5</div>
                        <h3 className="text-xl font-bold">
                          {language === 'pt' ? 'Retenção de Dados' : 'Data Retention'}
                        </h3>
                      </div>
                      <p className="text-gray-300 leading-relaxed">
                        {language === 'pt' 
                          ? 'Mantemos seus dados apenas pelo tempo necessário para fornecer nossos serviços ou conforme exigido por lei. Você pode solicitar a exclusão de seus dados a qualquer momento.'
                          : 'We keep your data only for the time necessary to provide our services or as required by law. You can request deletion of your data at any time.'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsNewPage;
