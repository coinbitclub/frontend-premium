import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FaCheck, 
  FaRocket, 
  FaStar, 
  FaGlobe, 
  FaBars, 
  FaTimes, 
  FaPercent, 
  FaGift,
  FaCrown 
} from 'react-icons/fa';

interface Plan {
  id: string;
  name: string;
  price: number;
  priceSymbol?: string;
  originalPrice?: number;
  commission: number;
  features: string[];
  isPopular?: boolean;
  icon: React.ReactNode;
}

const PlansNewPage: NextPage = () => {
  // Language state - simplified direct management
  const [language, setLanguage] = useState<'pt' | 'en'>('pt');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Handle language change
  const handleLanguageChange = (lang: 'pt' | 'en') => {
    setLanguage(lang);
  };

  // Translations
  const t = {
    pt: {
      title: 'Planos',
      subtitle: 'Escolha o plano ideal para potencializar seus resultados no trading automatizado',
      home: 'Início',
      plans: 'Planos',
      terms: 'Termos e Políticas',
      login: 'Entrar',
      register: 'Cadastrar',
      choosePlan: 'Escolher Plano',
      mostPopular: 'Mais Popular',
      free: 'GRÁTIS',
      noFee: 'SEM TAXA',
      commissionOnly: 'Apenas comissão sobre lucros',
      commission: 'comissão',
      perMonth: '/mês',
      readyToStart: 'Pronto para começar?',
      readyDescription: 'Junte-se a milhares de traders que já estão lucrando com nosso sistema automatizado',
      startFreeTrial: 'Começar Teste Grátis',
      // Plan names and features
      trialName: 'Trial Gratuito',
      flexName: 'FLEX (Brasil/Global)',
      proBrName: 'Brasil PRO',
      proGlobalName: 'Global PRO',
      // Features
      freeTrial: '✅ Teste grátis por 7 dias',
      testnetOnly: '🔧 Trading TESTNET apenas',
      allFeatures: '⚡ Todas funcionalidades disponíveis',
      autoTrading: '🤖 Trading automático 24/7',
      profitCommission: '💰 20% comissão apenas sobre lucros',
      minDeposit: '💵 Recarga mínima: R$150 (Brasil) / $30 USD (Exterior)',
      brazilGlobal: '🌍 Brasil / Global',
      profitCommission10: '💰+ 10% comissão apenas sobre lucros',
      premiumCommunity: '👑 Comunidade exclusiva Premium',
      advantageous: '⭐ Mais vantajoso para investimentos > $5k USD'
    },
    en: {
      title: 'Plans',
      subtitle: 'Choose the ideal plan to maximize your automated trading results',
      home: 'Home',
      plans: 'Plans',
      terms: 'Terms & Policies',
      login: 'Login',
      register: 'Register',
      choosePlan: 'Choose Plan',
      mostPopular: 'Most Popular',
      free: 'FREE',
      noFee: 'NO FEE',
      commissionOnly: 'Commission on profits only',
      commission: 'commission',
      perMonth: '/month',
      readyToStart: 'Ready to get started?',
      readyDescription: 'Join thousands of traders who are already profiting with our automated system',
      startFreeTrial: 'Start Free Trial',
      // Plan names and features
      trialName: 'Free Trial',
      flexName: 'FLEX (Brazil/International)',
      proBrName: 'Brasil PRO',
      proGlobalName: 'Global PRO',
      // Features
      freeTrial: '✅ 7-day free trial',
      testnetOnly: '🔧 TESTNET trading only',
      allFeatures: '⚡ All features available',
      autoTrading: '🤖 24/7 Automated Trading',
      profitCommission: '💰 20% commission only on profits',
      minDeposit: '💵 Minimum deposit: R$150 (Brazil) / $30 USD (International)',
      brazilGlobal: '🌍 Brasil / Global',
      profitCommission10: '💰+ 10% commission only on profits',
      premiumCommunity: '👑 Exclusive Premium community',
      advantageous: '⭐ Most advantageous for investments > $5k USD'
    }
  };

  const currentT = t[language];

  const plans: Plan[] = [
    {
      id: 'trial',
      name: currentT.trialName,
      price: 0,
      commission: 0,
      icon: <FaRocket className="text-3xl text-blue-400" />,
      features: [
        currentT.freeTrial,
        currentT.testnetOnly,
        currentT.allFeatures
      ]
    },
    {
      id: 'flex',
      name: currentT.flexName,
      price: 0,
      commission: 20,
      icon: <FaStar className="text-3xl text-yellow-400" />,
      features: [
        currentT.autoTrading,
        currentT.profitCommission,
        currentT.minDeposit,
        currentT.brazilGlobal
      ]
    },
    {
      id: 'pro',
      name: currentT.proBrName,
      price: 297,
      originalPrice: 397,
      commission: 10,
      icon: <FaCrown className="text-3xl text-orange-400" />,
      isPopular: true,
      features: [
        currentT.autoTrading,
        currentT.profitCommission10,
        currentT.minDeposit,
        currentT.premiumCommunity,
        currentT.advantageous
      ]
    },
    {
      id: 'global',
      name: currentT.proGlobalName,
      price: 50,
      priceSymbol: '$',
      commission: 10,
      icon: <FaGlobe className="text-3xl text-purple-400" />,
      features: [
        currentT.autoTrading,
        currentT.profitCommission10,
        currentT.minDeposit,
        currentT.premiumCommunity,
        currentT.advantageous
      ]
    }
  ];

  const handleSelectPlan = (planId: string) => {
    // Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'plan_selection', {
        plan_id: planId,
        language: language,
        event_category: 'conversion'
      });
    }

    // Redirect to registration with SMS verification
    window.location.href = `/auth/register-new?plan=${planId}`;
  };

  return (
    <>
      <Head>
        <title>{currentT.title} - CoinBitClub</title>
        <meta 
          name="description" 
          content={currentT.subtitle} 
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-x-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-yellow-500/10"></div>
        <div className="absolute left-1/4 top-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute right-1/4 bottom-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-yellow-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

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
                <Link href="/planos-new" className="text-orange-400 font-semibold">
                  {currentT.plans}
                </Link>
                <Link href="/termos-new" className="text-gray-300 hover:text-white transition-colors">
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
                  <Link href="/planos-new" className="block px-4 py-2 text-orange-400 font-semibold">
                    {currentT.plans}
                  </Link>
                  <Link href="/termos-new" className="block px-4 py-2 text-gray-300 hover:text-white transition-colors">
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
        <div className="relative container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-bold text-white mb-6">
              {language === 'pt' ? 'Nossos Planos' : 'Our Plans'}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {currentT.subtitle}
            </p>
          </motion.div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                  plan.isPopular 
                    ? 'border-orange-500/50 shadow-orange-500/20' 
                    : 'border-gray-700/30 hover:border-gray-600/50'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-orange-500 text-black px-4 py-2 rounded-full text-sm font-bold">
                      {currentT.mostPopular}
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  {plan.icon}
                  <h3 className="text-2xl font-bold text-white mt-4">{plan.name}</h3>
                </div>

                <div className="text-center mb-8">
                  {plan.price > 0 ? (
                    <div className="flex items-baseline justify-center gap-2">
                      {plan.originalPrice && (
                        <span className="text-lg text-gray-500 line-through">
                          {plan.priceSymbol || 'R$'} {plan.originalPrice}
                        </span>
                      )}
                      <span className="text-4xl font-bold text-orange-400">
                        {plan.priceSymbol || 'R$'} {plan.price}
                      </span>
                      <span className="text-gray-400">{currentT.perMonth}</span>
                    </div>
                  ) : plan.id === 'trial' ? (
                    <span className="text-4xl font-bold text-green-400">
                      {currentT.free}
                    </span>
                  ) : (
                    <div className="text-center">
                      <span className="text-4xl font-bold text-blue-400">
                        {currentT.noFee}
                      </span>
                      <p className="text-sm text-gray-400 mt-2">
                        {currentT.commissionOnly}
                      </p>
                    </div>
                  )}
                  
                  {plan.commission > 0 && (
                    <p className="text-sm text-gray-400 mt-2">
                      {plan.commission}% {currentT.commission}
                    </p>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <FaCheck className="text-green-400 text-sm mt-1 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                    plan.isPopular
                      ? 'bg-orange-500 hover:bg-orange-600 text-black'
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                >
                  {currentT.choosePlan}
                </button>
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-16"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              {currentT.readyToStart}
            </h2>
            <p className="text-gray-300 mb-8">
              {currentT.readyDescription}
            </p>
            <button
              onClick={() => handleSelectPlan('trial')}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105"
            >
              {currentT.startFreeTrial}
            </button>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default PlansNewPage;
