'use client';

import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { motion } from 'framer-motion';
import { FiDollarSign, FiCreditCard, FiGift, FiUsers, FiArrowUp, FiArrowDown, FiRefreshCw, FiCheck, FiStar, FiTrendingUp } from 'react-icons/fi';
import { useLanguage } from '../../hooks/useLanguage';
import UserLayout from '../../components/UserLayout';
import { useToast } from '../../components/Toast';

interface Plan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  features: string[];
  isPopular?: boolean;
  badge?: string;
}

const UserPlans: NextPage = () => {
  const { language, t } = useLanguage();
  const { showToast } = useToast();
  const [mounted, setMounted] = useState(false);
  
  // Estados para modais - funcionalidades de afiliado removidas para perfil USER
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showDowngradeModal, setShowDowngradeModal] = useState(false);
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [showAffiliateModal, setShowAffiliateModal] = useState(false);
  
  // Estados para formulários
  const [couponCode, setCouponCode] = useState('');
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  
  // Dados simulados (substituir por API futuramente)
  const currentPlan = 'trial';
  const prepaidBalance = 1500.00;

  useEffect(() => {
    setMounted(true);
  }, []);

  const plans: Plan[] = [
    {
      id: 'trial',
      name: language === 'pt' ? 'Trial Gratuito' : 'Free Trial',
      price: 0,
      badge: language === 'pt' ? 'GRÁTIS' : 'FREE',
      features: [
        language === 'pt' ? '✅ Teste grátis por 7 dias' : '✅ 7-day free trial',
        language === 'pt' ? '🔧 Trading TESTNET apenas' : '🔧 TESTNET trading only',
        language === 'pt' ? '⚡ Todas funcionalidades disponíveis' : '⚡ All features available',
        language === 'pt' ? '💬 Suporte básico por chat' : '💬 Basic chat support',
        language === 'pt' ? '👥 Acesso à comunidade' : '👥 Community access',
        language === 'pt' ? '📚 Material educativo gratuito' : '📚 Free educational material'
      ]
    },
    {
      id: 'flex',
      name: language === 'pt' ? 'FLEX (Brasil e Global)' : 'FLEX (Brazil and Global)',
      price: 0,
      badge: language === 'pt' ? 'SEM MENSALIDADE' : 'NO MONTHLY FEE',
      features: [
        language === 'pt' ? '🤖 Trading automático 24/7' : '🤖 24/7 Automated Trading',
        language === 'pt' ? '💰 20% comissão apenas sobre lucros' : '💰 20% commission only on profits',
        language === 'pt' ? '💳 Sistema pré-pago (sem mensalidade)' : '💳 Prepaid system (no monthly fees)',
        language === 'pt' ? '💵 Recarga mínima: R$150 (Brasil) / $30 USD (Global)' : '💵 Minimum deposit: R$150 (Brazil) / $30 USD (Global)',
        language === 'pt' ? '💬 Suporte padrão por chat' : '💬 Standard chat support',
        language === 'pt' ? '📈 Estratégias comprovadas de IA ÁGUIA' : '📈 Proven ÁGUIA AI strategies',
        language === 'pt' ? '👥 Comunidade geral' : '👥 General community',
        language === 'pt' ? '📊 Relatórios de performance' : '📊 Performance reports'
      ],
      isPopular: currentPlan === 'trial'
    },
    {
      id: 'pro-br',
      name: language === 'pt' ? 'PRO (Brasil)' : 'PRO (Brazil)',
      price: 297,
      originalPrice: 397,
      badge: language === 'pt' ? 'MAIS POPULAR' : 'MOST POPULAR',
      features: [
        language === 'pt' ? '🤖 Trading automático 24/7' : '🤖 24/7 Automated Trading',
        language === 'pt' ? '💰 10% comissão apenas sobre lucros' : '💰 10% commission only on profits',
        language === 'pt' ? '🎯 Suporte prioritário VIP' : '🎯 Priority VIP support',
        language === 'pt' ? '🧠 Estratégias avançadas com IA ÁGUIA' : '🧠 Advanced ÁGUIA AI strategies',
        language === 'pt' ? '👑 Comunidade exclusiva Premium' : '👑 Exclusive Premium community',
        language === 'pt' ? '⭐ Mais vantajoso para investimentos > $5k USD' : '⭐ Most advantageous for investments > $5k USD',
        language === 'pt' ? '🎁 Bônus de 10% no primeiro depósito' : '🎁 10% bonus on first deposit',
        language === 'pt' ? '📱 App mobile exclusivo' : '📱 Exclusive mobile app'
      ],
      isPopular: false
    },
    {
      id: 'pro-global',
      name: language === 'pt' ? 'PRO (Global)' : 'PRO (Global)',
      price: 50,
      badge: 'USD',
      features: [
        language === 'pt' ? '🤖 Trading automático 24/7' : '🤖 24/7 Automated Trading',
        language === 'pt' ? '💰 10% comissão apenas sobre lucros' : '💰 10% commission only on profits',
        language === 'pt' ? '🎯 Suporte VIP prioritário' : '🎯 Priority VIP support',
        language === 'pt' ? '🧠 Estratégias de IA ÁGUIA avançadas' : '🧠 Advanced ÁGUIA AI strategies',
        language === 'pt' ? '👑 Comunidade Premium exclusiva' : '👑 Exclusive Premium community',
        language === 'pt' ? '🌍 Suporte internacional 24h' : '🌍 24/7 international support',
        language === 'pt' ? '🎁 Bônus de 10% no primeiro depósito' : '🎁 10% bonus on first deposit'
      ]
    }
  ];

  const currentPlanData = plans.find(p => p.id === currentPlan);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400 mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">CoinBitClub</h2>
          <p className="text-gray-400">{t('common.loading')}...</p>
        </div>
      </div>
    );
  }

  return (
    <UserLayout 
      title={`${language === 'pt' ? 'Planos' : 'Plans'} | CoinBitClub`}
      description={language === 'pt' ? 'Gerencie seus planos e assinaturas' : 'Manage your plans and subscriptions'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-center mb-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-blue-400 bg-clip-text text-transparent">
              {language === 'pt' ? 'Gerenciar Planos' : 'Manage Plans'}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {language === 'pt' 
                ? 'Escolha o plano ideal para maximizar seus lucros com trading automatizado'
                : 'Choose the ideal plan to maximize your profits with automated trading'
              }
            </p>
          </motion.div>

          {/* Current Plan Card */}
          {currentPlanData && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-black/40 backdrop-blur-sm border border-yellow-400/50 rounded-xl p-8 mb-12 hover:shadow-lg hover:shadow-yellow-400/20 transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <FiStar className="text-yellow-400 text-2xl" />
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                      {language === 'pt' ? 'Plano Atual' : 'Current Plan'}
                    </h2>
                  </div>
                  
                  <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 rounded-xl p-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{currentPlanData.name}</h3>
                    <div className="flex items-center gap-4 mb-4">
                      {currentPlanData.price > 0 ? (
                        <span className="text-3xl font-bold text-yellow-400">
                          {currentPlanData.id === 'pro-global' ? '$' : 'R$'} {currentPlanData.price}
                        </span>
                      ) : (
                        <span className="text-3xl font-bold text-green-400">
                          {currentPlanData.badge}
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {currentPlanData.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <FiCheck className="text-green-400 flex-shrink-0" />
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => setShowRechargeModal(true)}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 transform transition-all duration-300 shadow-lg flex items-center gap-2"
                  >
                    <FiDollarSign />
                    {language === 'pt' ? 'Recarregar' : 'Recharge'}
                  </button>
                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 rounded-lg font-semibold hover:scale-105 transform transition-all duration-300 shadow-lg flex items-center gap-2"
                  >
                    <FiArrowUp />
                    {language === 'pt' ? 'Upgrade' : 'Upgrade'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Balance Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-black/40 backdrop-blur-sm border border-gray-700 rounded-xl p-8 mb-12 hover:border-green-400/50 transition-all duration-300"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <FiCreditCard className="text-green-400" />
              {language === 'pt' ? 'Saldo Pré-pago' : 'Prepaid Balance'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-300 mb-2">
                  {language === 'pt' ? 'Saldo Disponível' : 'Available Balance'}
                </h3>
                <p className="text-4xl font-bold text-green-400 mb-4">
                  R$ {prepaidBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowRechargeModal(true)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all"
                  >
                    💳 {language === 'pt' ? 'Recarregar' : 'Recharge'}
                  </button>
                  <button
                    onClick={() => setShowWithdrawModal(true)}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-all"
                  >
                    💰 {language === 'pt' ? 'Sacar' : 'Withdraw'}
                  </button>
                </div>
              </div>
              
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-300 mb-2">
                  {language === 'pt' ? 'Total Investido' : 'Total Invested'}
                </h3>
                <p className="text-4xl font-bold text-blue-400 mb-4">
                  R$ 3.500,00
                </p>
                <p className="text-sm text-blue-300">
                  {language === 'pt' ? 'Em operações ativas' : 'In active operations'}
                </p>
              </div>

              <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-300 mb-2">
                  {language === 'pt' ? 'Lucro Obtido' : 'Profit Earned'}
                </h3>
                <p className="text-4xl font-bold text-purple-400 mb-4">
                  R$ 1.247,50
                </p>
                <p className="text-sm text-purple-300">
                  {language === 'pt' ? 'ROI: +35.6%' : 'ROI: +35.6%'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Available Plans */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              {language === 'pt' ? 'Planos Disponíveis' : 'Available Plans'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {plans.filter(plan => plan.id !== currentPlan).map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className={`bg-black/40 backdrop-blur-sm border rounded-xl p-6 transition-all duration-300 hover:scale-105 ${
                    plan.isPopular 
                      ? 'border-yellow-400/50 ring-2 ring-yellow-400/20 hover:shadow-lg hover:shadow-yellow-400/20' 
                      : 'border-gray-700 hover:border-yellow-400/50 hover:shadow-lg hover:shadow-yellow-400/20'
                  }`}
                >
                  {plan.isPopular && (
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block">
                      ⭐ {plan.badge}
                    </div>
                  )}
                  
                  <h3 className="text-xl font-bold text-yellow-400 mb-4">{plan.name}</h3>
                  
                  <div className="mb-4">
                    {plan.price > 0 ? (
                      <div className="flex items-center gap-2">
                        {plan.originalPrice && (
                          <span className="text-lg text-gray-400 line-through">
                            {plan.id === 'pro-global' ? '$' : 'R$'} {plan.originalPrice}
                          </span>
                        )}
                        <span className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                          {plan.id === 'pro-global' ? '$' : 'R$'} {plan.price}
                        </span>
                      </div>
                    ) : (
                      <span className="text-3xl font-bold text-green-400">
                        {plan.badge}
                      </span>
                    )}
                  </div>
                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-2">
                        <FiCheck className="text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    className={`w-full font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 ${
                      plan.isPopular
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:shadow-lg'
                        : 'border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black'
                    }`}
                  >
                    {language === 'pt' ? 'Escolher Plano' : 'Choose Plan'}
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Coupon Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-xl p-6 mt-8"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <FiGift className="text-green-400 text-2xl" />
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {language === 'pt' ? 'Tem um cupom de desconto?' : 'Have a discount coupon?'}
                  </h3>
                  <p className="text-gray-300 text-sm">
                    {language === 'pt' ? 'Insira seu código para receber benefícios extras' : 'Enter your code to receive extra benefits'}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                {!showCouponInput ? (
                  <button
                    onClick={() => setShowCouponInput(true)}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition-all"
                  >
                    {language === 'pt' ? 'Usar Cupom' : 'Use Coupon'}
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder={language === 'pt' ? 'Digite o código' : 'Enter code'}
                      className="w-full px-4 py-3 bg-black/40 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300"
                    />
                    <button
                      onClick={() => {
                        console.log('Applying coupon:', couponCode);
                      }}
                      className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition-all"
                    >
                      {language === 'pt' ? 'Aplicar' : 'Apply'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Become Affiliate Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-br from-orange-900/30 via-yellow-900/20 to-red-900/30 backdrop-blur-sm rounded-2xl border border-orange-500/30 overflow-hidden mt-8"
          >
            <div className="p-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-yellow-500/10"></div>
              
              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-xl">
                    <FiUsers className="text-orange-400 text-3xl" />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {language === 'pt' ? 'Torne-se um Afiliado' : 'Become an Affiliate'}
                    </h3>
                    <p className="text-orange-200">
                      {language === 'pt' ? 'Ganhe comissões indicando novos usuários' : 'Earn commissions by referring new users'}
                    </p>
                    <div className="flex flex-col gap-1 mt-2">
                      <span className="text-orange-300 text-sm">
                        💰 {language === 'pt' ? 'Comissão de 1,5% sobre indicações' : 'Commission of 1.5% on referrals'}
                      </span>
                      <span className="text-orange-300 text-sm">
                        🎯 {language === 'pt' ? 'Suporte e materiais exclusivos' : 'Exclusive support and materials'}
                      </span>
                      <span className="text-orange-300 text-sm">
                        📈 {language === 'pt' ? 'Dashboard de afiliados completo' : 'Complete affiliate dashboard'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-center lg:text-right">
                  <button 
                    onClick={() => setShowAffiliateModal(true)}
                    className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-bold px-6 py-3 rounded-xl transition-all inline-flex items-center gap-2 hover:scale-105 transform"
                  >
                    {language === 'pt' ? 'Solicitar Agora' : 'Request Now'}
                    <span className="text-lg">→</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
      </div>

      {/* Modais */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 max-w-md w-full border border-gray-700"
          >
            <h3 className="text-xl font-bold text-white mb-4">
              {language === 'pt' ? 'Confirmar Upgrade' : 'Confirm Upgrade'}
            </h3>
            <p className="text-gray-300 mb-6">
              {language === 'pt' 
                ? 'Deseja realmente fazer upgrade do seu plano?'
                : 'Do you really want to upgrade your plan?'
              }
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 border border-gray-600 text-gray-300 font-semibold py-2 px-4 rounded-lg hover:bg-gray-700 transition-all"
              >
                {language === 'pt' ? 'Cancelar' : 'Cancel'}
              </button>
              <button className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold py-2 px-4 rounded-lg hover:scale-105 transition-all">
                {language === 'pt' ? 'Confirmar' : 'Confirm'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal de Solicitação de Afiliado */}
      {showAffiliateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-8 max-w-md w-full"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiUsers className="text-3xl text-orange-400" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">
                {language === 'pt' ? 'Tornar-se Afiliado' : 'Become an Affiliate'}
              </h3>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                {language === 'pt' 
                  ? 'Você aceita os termos e condições para tornar-se afiliado da CoinBitClub? Como afiliado, você poderá ganhar comissões indicando novos usuários para a plataforma.'
                  : 'Do you accept the terms and conditions to become a CoinBitClub affiliate? As an affiliate, you will be able to earn commissions by referring new users to the platform.'
                }
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAffiliateModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-xl transition-all"
                >
                  {language === 'pt' ? 'Cancelar' : 'Cancel'}
                </button>
                <button
                  onClick={() => {
                    setShowAffiliateModal(false);
                    showToast(
                      language === 'pt' ? 'Solicitação enviada! Você será notificado quando for aprovado.' : 'Request sent! You will be notified when approved.',
                      'success'
                    );
                  }}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-bold py-3 px-6 rounded-xl transition-all"
                >
                  {language === 'pt' ? 'Aceitar e Solicitar' : 'Accept and Request'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Outros modais similares seriam implementados aqui... */}
      {/* Recharge Modal, Withdraw Modal, etc. */}
      
    </UserLayout>
  );
};

export default UserPlans;
