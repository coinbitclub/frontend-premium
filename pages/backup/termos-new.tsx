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
      lastUpdated: 'Última atualização: novembro/2025'
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
      lastUpdated: 'Last updated: November/2025'
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

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-x-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-yellow-500/10"></div>
        <div className="absolute left-1/4 top-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute right-1/4 bottom-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

        {/* Header Navigation */}
        <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-700/30 sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/home" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center">
                  <span className="text-black font-bold text-lg">C</span>
                </div>
                <span className="text-xl font-bold text-white">CoinBitClub</span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-8">
                <Link href="/home" className="text-gray-300 hover:text-white transition-colors">
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
                  <Link href="/home" className="block px-4 py-2 text-gray-300 hover:text-white transition-colors">
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
              href="/home"
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
                          ? 'Ao utilizar os serviços do CoinbitClub MARKETBOT ("Serviço", "nós", "nosso"), você concorda com estes Termos de Uso. Caso não concorde com qualquer parte destes termos, não utilize o serviço.'
                          : 'By using CoinbitClub MARKETBOT services ("Service", "we", "our"), you agree to these Terms of Use. If you do not agree with any part of these terms, do not use the service.'
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
                          ? 'O MarketBot é um sistema de trading automatizado com inteligência artificial, desenvolvido para:'
                          : 'MarketBot is an automated trading system with artificial intelligence, developed to:'
                        }
                      </p>
                      <ul className="text-gray-300 space-y-2 ml-6">
                        <li>• {language === 'pt' ? 'Analisar mercados de criptomoedas em tempo real' : 'Analyze cryptocurrency markets in real time'}</li>
                        <li>• {language === 'pt' ? 'Executar operações automatizadas com base em algoritmos proprietários' : 'Execute automated operations based on proprietary algorithms'}</li>
                        <li>• {language === 'pt' ? 'Gerenciar riscos por meio de stop loss e take profit' : 'Manage risks through stop loss and take profit'}</li>
                        <li>• {language === 'pt' ? 'Fornecer relatórios de performance e análises de eficiência' : 'Provide performance reports and efficiency analysis'}</li>
                      </ul>
                      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mt-4">
                        <p className="text-yellow-300 font-semibold">⚠️ {language === 'pt' ? 'Atenção:' : 'Attention:'}</p>
                        <p className="text-yellow-200">
                          {language === 'pt' 
                            ? 'O mercado de criptomoedas é altamente volátil e envolve riscos significativos. Os resultados passados não garantem retornos futuros.'
                            : 'The cryptocurrency market is highly volatile and involves significant risks. Past results do not guarantee future returns.'
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
                        {language === 'pt' 
                          ? 'A segurança e o controle dos fundos são de total responsabilidade do usuário.'
                          : 'The security and control of funds is the full responsibility of the user.'
                        }
                      </p>
                      <ul className="text-gray-300 space-y-2 ml-6">
                        <li>• {language === 'pt' ? 'Não temos acesso direto aos seus fundos' : 'We have no direct access to your funds'}</li>
                        <li>• {language === 'pt' ? 'A conexão ocorre exclusivamente via API oficial das corretoras Binance ou Bybit' : 'Connection occurs exclusively via official API of Binance or Bybit exchanges'}</li>
                        <li>• {language === 'pt' ? 'O MarketBot utiliza permissões apenas de trading (sem saques)' : 'MarketBot uses only trading permissions (no withdrawals)'}</li>
                        <li>• {language === 'pt' ? 'Você pode pausar, encerrar ou desconectar o bot a qualquer momento' : 'You can pause, stop or disconnect the bot at any time'}</li>
                        <li>• {language === 'pt' ? 'Nenhuma chave privada ou senha de exchange é armazenada pela CoinbitClub' : 'No private keys or exchange passwords are stored by CoinbitClub'}</li>
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
                          ? 'O modelo de cobrança é transparente, fixo e baseado no volume operado.'
                          : 'The pricing model is transparent, fixed and based on traded volume.'
                        }
                      </p>
                      <ul className="text-gray-300 space-y-2 ml-6">
                        <li>• <strong>{language === 'pt' ? 'Taxa única:' : 'Single fee:'}</strong> {language === 'pt' ? '0,07% sobre o valor total da operação executada (por trade)' : '0.07% on the total value of the executed operation (per trade)'}</li>
                        <li>• <strong>{language === 'pt' ? 'Cobrança automática:' : 'Automatic billing:'}</strong> {language === 'pt' ? 'calculada e debitada conforme o volume de operações processadas' : 'calculated and debited according to the volume of processed operations'}</li>
                        <li>• <strong>{language === 'pt' ? 'Sem mensalidades:' : 'No monthly fees:'}</strong> {language === 'pt' ? 'ou comissões sobre lucros' : 'or profit commissions'}</li>
                        <li>• <strong>{language === 'pt' ? 'Teste gratuito:' : 'Free trial:'}</strong> {language === 'pt' ? 'acesso via Testnet sem custos para avaliação' : 'access via Testnet at no cost for evaluation'}</li>
                        <li>• <strong>{language === 'pt' ? 'Cancelamento:' : 'Cancellation:'}</strong> {language === 'pt' ? 'você pode interromper o uso do serviço a qualquer momento sem multa' : 'you can stop using the service at any time without penalty'}</li>
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
                            ? 'O trading automatizado não garante lucros e envolve riscos inerentes ao mercado.'
                            : 'Automated trading does not guarantee profits and involves inherent market risks.'
                          }
                        </p>
                      </div>
                      <ul className="text-gray-300 space-y-2 ml-6">
                        <li>• {language === 'pt' ? 'O usuário reconhece que perdas podem ocorrer' : 'The user acknowledges that losses may occur'}</li>
                        <li>• {language === 'pt' ? 'A CoinbitClub não se responsabiliza por perdas financeiras decorrentes de uso incorreto, falhas de conexão, ou comportamento de mercado' : 'CoinbitClub is not responsible for financial losses resulting from incorrect use, connection failures, or market behavior'}</li>
                        <li>• {language === 'pt' ? 'O usuário é integralmente responsável por suas decisões e configurações de trading' : 'The user is fully responsible for their trading decisions and configurations'}</li>
                        <li>• {language === 'pt' ? 'Não realizamos reembolsos de valores perdidos em operações de mercado' : 'We do not reimburse amounts lost in market operations'}</li>
                      </ul>
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-black font-bold">6</div>
                        <h3 className="text-xl font-bold">
                          {language === 'pt' ? 'Modificações e Cancelamento' : 'Modifications and Cancellation'}
                        </h3>
                      </div>
                      <div className="space-y-3">
                        <p className="text-gray-300 leading-relaxed">
                          {language === 'pt' 
                            ? 'A CoinbitClub poderá atualizar estes Termos de Uso periodicamente, mediante publicação nesta página.'
                            : 'CoinbitClub may update these Terms of Use periodically, by publishing on this page.'
                          }
                        </p>
                        <p className="text-gray-300 leading-relaxed">  
                          {language === 'pt' 
                            ? 'O usuário poderá cancelar o serviço a qualquer momento, diretamente pelo dashboard.'
                            : 'The user can cancel the service at any time, directly through the dashboard.'
                          }
                        </p>
                        <p className="text-gray-300 leading-relaxed">
                          {language === 'pt' 
                            ? 'O cancelamento interrompe novas operações, mas não gera reembolso de taxas já aplicadas.'
                            : 'Cancellation stops new operations, but does not generate refunds of fees already applied.'
                          }
                        </p>
                      </div>
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
                          {language === 'pt' ? 'Informações Pessoais' : 'Personal Information'}
                        </h4>
                        <ul className="text-gray-300 space-y-1 ml-4">
                          <li>• {language === 'pt' ? 'Nome completo' : 'Full name'}</li>
                          <li>• {language === 'pt' ? 'Endereço de e-mail' : 'Email address'}</li>
                          <li>• {language === 'pt' ? 'Número de telefone / WhatsApp' : 'Phone number / WhatsApp'}</li>
                          <li>• {language === 'pt' ? 'País de residência' : 'Country of residence'}</li>
                        </ul>
                      </div>

                      <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 mb-4">
                        <h4 className="text-purple-300 font-semibold mb-2">
                          {language === 'pt' ? 'Dados de Trading' : 'Trading Data'}
                        </h4>
                        <ul className="text-gray-300 space-y-1 ml-4">
                          <li>• {language === 'pt' ? 'Histórico de operações (para relatórios e estatísticas)' : 'Trading history (for reports and statistics)'}</li>
                          <li>• {language === 'pt' ? 'Configurações de trading' : 'Trading settings'}</li>
                          <li>• {language === 'pt' ? 'Desempenho do bot' : 'Bot performance'}</li>
                          <li>• {language === 'pt' ? 'Dados de uso da plataforma' : 'Platform usage data'}</li>
                        </ul>
                      </div>

                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                        <p className="text-red-300 font-semibold">
                          {language === 'pt' ? 'Nunca coletamos:' : 'We never collect:'}
                        </p>
                        <p className="text-red-200">
                          {language === 'pt' 
                            ? 'Chaves privadas, senhas ou quaisquer credenciais que permitam acesso direto aos seus fundos.'
                            : 'Private keys, passwords or any credentials that allow direct access to your funds.'
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
                          ? 'Usamos seus dados apenas para finalidades operacionais, incluindo:'
                          : 'We use your data only for operational purposes, including:'
                        }
                      </p>
                      <ul className="text-gray-300 space-y-2 ml-6">
                        <li>• {language === 'pt' ? 'Operar e manter o serviço de trading automatizado' : 'Operate and maintain the automated trading service'}</li>
                        <li>• {language === 'pt' ? 'Gerar relatórios de performance e resultados' : 'Generate performance and results reports'}</li>
                        <li>• {language === 'pt' ? 'Oferecer suporte técnico e notificações operacionais' : 'Provide technical support and operational notifications'}</li>
                        <li>• {language === 'pt' ? 'Melhorar os algoritmos e a experiência do usuário' : 'Improve algorithms and user experience'}</li>
                        <li>• {language === 'pt' ? 'Cumprir obrigações legais e regulatórias aplicáveis' : 'Comply with applicable legal and regulatory obligations'}</li>
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
                          ? 'Adotamos padrões avançados de segurança e confidencialidade:'
                          : 'We adopt advanced security and confidentiality standards:'
                        }
                      </p>
                      <ul className="text-gray-300 space-y-2 ml-6">
                        <li>• {language === 'pt' ? 'Criptografia SSL/TLS em todas as comunicações' : 'SSL/TLS encryption in all communications'}</li>
                        <li>• {language === 'pt' ? 'Armazenamento seguro com criptografia de dados' : 'Secure storage with data encryption'}</li>
                        <li>• {language === 'pt' ? 'Acesso restrito apenas à equipe autorizada' : 'Restricted access only to authorized team'}</li>
                        <li>• {language === 'pt' ? 'Monitoramento contínuo de segurança e auditorias internas' : 'Continuous security monitoring and internal audits'}</li>
                        <li>• {language === 'pt' ? 'Backups seguros e redundantes' : 'Secure and redundant backups'}</li>
                      </ul>
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mt-4">
                        <p className="text-green-300 font-semibold">
                          {language === 'pt' ? 'Conformidade LGPD:' : 'LGPD Compliance:'}
                        </p>
                        <p className="text-green-200">
                          {language === 'pt' 
                            ? 'A CoinbitClub atua em total conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).'
                            : 'CoinbitClub operates in full compliance with the General Data Protection Law (Law No. 13.709/2018).'
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
                          ? 'Não vendemos, alugamos nem compartilhamos suas informações pessoais, exceto:'
                          : 'We do not sell, rent or share your personal information, except:'
                        }
                      </p>
                      <ul className="text-gray-300 space-y-2 ml-6">
                        <li>• {language === 'pt' ? 'Quando exigido por autoridades legais ou regulatórias' : 'When required by legal or regulatory authorities'}</li>
                        <li>• {language === 'pt' ? 'Para provedores de serviços essenciais (hospedagem, infraestrutura, suporte), sob acordos de confidencialidade' : 'To essential service providers (hosting, infrastructure, support), under confidentiality agreements'}</li>
                        <li>• {language === 'pt' ? 'Mediante seu consentimento explícito' : 'With your explicit consent'}</li>
                      </ul>
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">5</div>
                        <h3 className="text-xl font-bold">
                          {language === 'pt' ? 'Retenção de Dados' : 'Data Retention'}
                        </h3>
                      </div>
                      <div className="space-y-3">
                        <p className="text-gray-300 leading-relaxed">
                          {language === 'pt' 
                            ? 'Os dados são mantidos apenas pelo tempo necessário para:'
                            : 'Data is kept only for the time necessary to:'
                          }
                        </p>
                        <ul className="text-gray-300 space-y-2 ml-6">
                          <li>• {language === 'pt' ? 'Cumprir as finalidades do serviço' : 'Fulfill service purposes'}</li>
                          <li>• {language === 'pt' ? 'Atender exigências legais ou regulatórias' : 'Meet legal or regulatory requirements'}</li>
                        </ul>
                        <p className="text-gray-300 leading-relaxed">
                          {language === 'pt' 
                            ? 'O usuário pode solicitar a exclusão permanente de seus dados, a qualquer momento, enviando requisição formal aos canais oficiais de suporte.'
                            : 'The user can request permanent deletion of their data at any time by sending a formal request to official support channels.'
                          }
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">6</div>
                        <h3 className="text-xl font-bold">
                          {language === 'pt' ? 'Contato' : 'Contact'}
                        </h3>
                      </div>
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                        <p className="text-gray-300 leading-relaxed mb-2">
                          {language === 'pt' 
                            ? 'Para dúvidas sobre privacidade ou solicitações relacionadas à LGPD:'
                            : 'For privacy questions or LGPD-related requests:'
                          }
                        </p>
                        <p className="text-blue-300 font-semibold">
                          📧 faleconosco@coinbitclub.vip
                        </p>
                      </div>
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
