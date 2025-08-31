import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '../hooks/useLanguage';
import { FaCheck, FaRocket, FaStar, FaGlobe, FaBars, FaTimes, FaUser, FaPercent, FaGift } from 'react-icons/fa';

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

const PlansPage: NextPage = () => {
  const [mounted, setMounted] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    setMounted(true);

    // Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'public_plans_view', {
        page_title: 'Public Plans',
        language: language,
        event_category: 'marketing'
      });
    }
  }, [language]);

  if (!mounted) {
    return null;
  }

  const plans: Plan[] = [
    {
      id: 'trial',
      name: language === 'pt' ? 'Trial Gratuito' : 'Free Trial',
      price: 0,
      commission: 0,
      icon: <FaRocket className="text-3xl text-blue-400" />,
      features: [
        language === 'pt' ? '✅ Teste grátis por 7 dias' : '✅ 7-day free trial',
        language === 'pt' ? '🔧 Trading TESTNET apenas' : '🔧 TESTNET trading only',
        language === 'pt' ? '⚡ Todas funcionalidades disponíveis' : '⚡ All features available'
      ]
    },
    {
      id: 'flex',
      name: language === 'pt' ? 'FLEX (Brasil/Internacional)' : 'FLEX (Brazil/International)',
      price: 0,
      commission: 20,
      icon: <FaStar className="text-3xl text-yellow-400" />,
      features: [
        language === 'pt' ? '🤖 Trading automático 24/7' : '🤖 24/7 Automated Trading',
        language === 'pt' ? '💰 20% comissão apenas sobre lucros' : '💰 20% commission only on profits',
        language === 'pt' ? '💵 Recarga mínima: R$150 (Brasil) / $30 USD (Exterior)' : '💵 Minimum deposit: R$150 (Brazil) / $30 USD (International)',
        language === 'pt' ? '🌍 Brasil / Global' : '🌍 Brasil / Global'
      ]
    },
    {
      id: 'pro',
      name: language === 'pt' ? 'Brasil PRO' : 'Brasil PRO',
      price: 297,
      originalPrice: 397,
      commission: 10,
      icon: <FaStar className="text-3xl text-orange-400" />,
      isPopular: true,
      features: [
        language === 'pt' ? '🤖 Trading automático 24/7' : '🤖 24/7 Automated Trading',
        language === 'pt' ? '💰+ 10% comissão apenas sobre lucros' : '💰+ 10% commission only on profits',
        language === 'pt' ? '💵 Recarga mínima: R$150 (Brasil) / $30 USD (Exterior)' : '💵 Minimum deposit: R$150 (Brazil) / $30 USD (International)',
        language === 'pt' ? '👑 Comunidade exclusiva Premium' : '👑 Exclusive Premium community',
        language === 'pt' ? '⭐ Mais vantajoso para investimentos > $5k USD' : '⭐ Most advantageous for investments > $5k USD'
      ]
    },
    {
      id: 'global',
      name: language === 'pt' ? 'Global PRO' : 'Global PRO',
      price: 50,
      priceSymbol: '$',
      commission: 10,
      icon: <FaGlobe className="text-3xl text-purple-400" />,
      features: [
        language === 'pt' ? '🤖 Trading automático 24/7' : '🤖 24/7 Automated Trading',
        language === 'pt' ? '💰+ 10% comissão apenas sobre lucros' : '💰+ 10% commission only on profits',
        language === 'pt' ? '💵 Recarga mínima: R$150 (Brasil) / $30 USD (Exterior)' : '💵 Minimum deposit: R$150 (Brazil) / $30 USD (International)',
        language === 'pt' ? '👑 Comunidade exclusiva Premium' : '👑 Exclusive Premium community',
        language === 'pt' ? '⭐ Mais vantajoso para investimentos > $5k USD' : '⭐ Most advantageous for investments > $5k USD'
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

    // Redirect to registration/login
    window.location.href = `/auth/register-new?plan=${planId}`;
  };

  return (
    <>
      <Head>
        <title>
          {language === 'pt' ? 'Planos - CoinBitClub' : 'Plans - CoinBitClub'}
        </title>
        <meta 
          name="description" 
          content={language === 'pt' 
            ? 'Escolha o melhor plano de trading automatizado para você. Comece com 7 dias grátis!'
            : 'Choose the best automated trading plan for you. Start with 7 days free!'
          } 
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
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
                  {language === 'pt' ? 'Início' : 'Home'}
                </Link>
                <Link href="/planos" className="text-orange-400 font-semibold">
                  {language === 'pt' ? 'Planos' : 'Plans'}
                </Link>
                <Link href="/termos-new" className="text-gray-300 hover:text-white transition-colors">
                  {language === 'pt' ? 'Termos e Políticas' : 'Terms & Policies'}
                </Link>
              </nav>

              {/* Action Buttons */}
              <div className="hidden md:flex items-center gap-4">
                <Link 
                  href="/auth/login-new"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {language === 'pt' ? 'Entrar' : 'Login'}
                </Link>
                <Link 
                  href="/auth/register-new"
                  className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-bold px-6 py-2 rounded-xl transition-all"
                >
                  {language === 'pt' ? 'Cadastrar' : 'Register'}
                </Link>
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
                    {language === 'pt' ? 'Início' : 'Home'}
                  </Link>
                  <Link href="/planos" className="block px-4 py-2 text-orange-400 font-semibold">
                    {language === 'pt' ? 'Planos' : 'Plans'}
                  </Link>
                  <Link href="/termos-new" className="block px-4 py-2 text-gray-300 hover:text-white transition-colors">
                    {language === 'pt' ? 'Termos e Políticas' : 'Terms & Policies'}
                  </Link>
                  <div className="border-t border-gray-700/30 pt-2 mt-2">
                    <Link href="/auth/login-new" className="block px-4 py-2 text-gray-300 hover:text-white transition-colors">
                      {language === 'pt' ? 'Entrar' : 'Login'}
                    </Link>
                    <Link href="/auth/register-new" className="block px-4 py-2 text-orange-400 font-semibold">
                      {language === 'pt' ? 'Cadastrar' : 'Register'}
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-16">
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
              {language === 'pt' 
                ? 'Escolha o plano ideal para potencializar seus resultados no trading automatizado'
                : 'Choose the ideal plan to maximize your automated trading results'
              }
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
                      {language === 'pt' ? 'Mais Popular' : 'Most Popular'}
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
                      <span className="text-gray-400">/mês</span>
                    </div>
                  ) : plan.id === 'trial' ? (
                    <span className="text-4xl font-bold text-green-400">
                      {language === 'pt' ? 'GRÁTIS' : 'FREE'}
                    </span>
                  ) : (
                    <div className="text-center">
                      <span className="text-4xl font-bold text-blue-400">
                        {language === 'pt' ? 'SEM TAXA' : 'NO FEE'}
                      </span>
                      <p className="text-sm text-gray-400 mt-2">
                        {language === 'pt' ? 'Apenas comissão sobre lucros' : 'Commission on profits only'}
                      </p>
                    </div>
                  )}
                  
                  {plan.commission > 0 && (
                    <p className="text-sm text-gray-400 mt-2">
                      {language === 'pt' ? `${plan.commission}% comissão` : `${plan.commission}% commission`}
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
                  {language === 'pt' ? 'Escolher Plano' : 'Choose Plan'}
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
              {language === 'pt' ? 'Pronto para começar?' : 'Ready to get started?'}
            </h2>
            <p className="text-gray-300 mb-8">
              {language === 'pt' 
                ? 'Junte-se a milhares de traders que já estão lucrando com nosso sistema automatizado'
                : 'Join thousands of traders who are already profiting with our automated system'
              }
            </p>
            <button
              onClick={() => handleSelectPlan('trial')}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105"
            >
              {language === 'pt' ? 'Começar Teste Grátis' : 'Start Free Trial'}
            </button>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default PlansPage;
