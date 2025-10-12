import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FiCheck, FiStar, FiDollarSign, FiCreditCard, FiLoader, FiAlertCircle } from 'react-icons/fi';
import { useLanguage } from '../../hooks/useLanguage';
import UserLayout from '../../components/UserLayout';
import { useToast } from '../../components/Toast';
import authService from '../../src/services/authService';
import planService, { Plan } from '../../src/services/planService';
// Authentication removed - ProtectedRoute disabled

const IS_DEV = process.env.NODE_ENV === 'development';

const UserPlans: NextPage = () => {
  const { language, t } = useLanguage();
  const { showToast } = useToast();
  const router = useRouter();

  // Estados
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [userPlanStatus, setUserPlanStatus] = useState<any>(null);
  const [currentPlan, setCurrentPlan] = useState<any>(null);

  // Check for URL parameters (success/cancel from Stripe)
  useEffect(() => {
    if (!router.isReady) return;

    const { success, canceled, plan } = router.query;

    if (success === 'true') {
      showToast(
        language === 'pt'
          ? `Pagamento processado com sucesso! Plano ${plan} ativado.`
          : `Payment processed successfully! ${plan} plan activated.`,
        'success'
      );
      // Clean URL
      router.replace('/user/plans', undefined, { shallow: true });
    }

    if (canceled === 'true') {
      showToast(
        language === 'pt'
          ? 'Pagamento cancelado. Você pode tentar novamente.'
          : 'Payment canceled. You can try again.',
        'info'
      );
      // Clean URL
      router.replace('/user/plans', undefined, { shallow: true });
    }
  }, [router.isReady, router.query, showToast, language, router]);

  const initializePage = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      IS_DEV && console.log('📋 Plans: Loading plans...');

      // Load plans and user status in parallel
      const [plansResponse, planStatusResponse] = await Promise.allSettled([
        planService.getPlans(),
        planService.getPlanStatus()
      ]);

      // Handle plans response
      if (plansResponse.status === 'fulfilled') {
        setPlans(plansResponse.value.plans);
        // Extract current plan information from the response
        if (plansResponse.value.currentPlan) {
          setCurrentPlan(plansResponse.value.currentPlan);
        }
        IS_DEV && console.log('✅ Plans: Plans loaded', plansResponse.value.plans.length);
      } else {
        console.error('Failed to load plans:', plansResponse.reason);
        setError('Failed to load plans');
      }

      // Handle user status response
      if (planStatusResponse.status === 'fulfilled') {
        setUserPlanStatus(planStatusResponse.value);
      } else {
        console.error('Failed to load user plan status:', planStatusResponse.reason);
      }

    } catch (error) {
      console.error('Error initializing page:', error);
      setError('Failed to initialize page');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    initializePage();
  }, [initializePage]);

  const formatPrice = useCallback((price: number, currency: string) => {
    if (price === 0) {
      return language === 'pt' ? 'GRATUITO' : 'FREE';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  }, [language]);

  const handlePlanSubscribe = useCallback(async (plan: Plan) => {
    try {
      setSubscribing(plan.code);

      showToast(
        language === 'pt'
          ? `Iniciando assinatura do plano ${plan.name}...`
          : `Starting subscription to ${plan.name} plan...`,
        'info'
      );

      const response = await planService.subscribeToPlan(plan.code);

      if (response.success) {
        if (response.checkoutUrl) {
          // Redirect to Stripe checkout
          showToast(
            language === 'pt'
              ? 'Redirecionando para pagamento...'
              : 'Redirecting to payment...',
            'info'
          );
          window.location.href = response.checkoutUrl;
        } else {
          // Free plan activated directly
          showToast(response.message, 'success');
          // Reload page to reflect changes
          setTimeout(() => {
            initializePage();
          }, 1000);
        }
      } else {
        throw new Error(response.message || 'Subscription failed');
      }

    } catch (error) {
      console.error('Error subscribing to plan:', error);
      showToast(
        language === 'pt'
          ? `Erro ao processar assinatura: ${error.message}`
          : `Error processing subscription: ${error.message}`,
        'error'
      );
    } finally {
      setSubscribing(null);
    }
  }, [language, showToast, initializePage]);

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

  if (loading) {
    return (
      <UserLayout
        title={`${language === 'pt' ? 'Planos' : 'Plans'} | CoinBitClub`}
        description={language === 'pt' ? 'Gerencie seus planos e assinaturas' : 'Manage your plans and subscriptions'}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <FiLoader className="animate-spin text-yellow-400 text-4xl mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">
                {language === 'pt' ? 'Carregando planos...' : 'Loading plans...'}
              </h2>
            </div>
          </div>
        </div>
      </UserLayout>
    );
  }

  if (error) {
    return (
      <UserLayout
        title={`${language === 'pt' ? 'Planos' : 'Plans'} | CoinBitClub`}
        description={language === 'pt' ? 'Gerencie seus planos e assinaturas' : 'Manage your plans and subscriptions'}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <FiAlertCircle className="text-red-400 text-4xl mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">
                {language === 'pt' ? 'Erro ao carregar planos' : 'Error loading plans'}
              </h2>
              <p className="text-gray-400 mb-4">{error}</p>
              <button
                onClick={initializePage}
                className="bg-yellow-400 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
              >
                {language === 'pt' ? 'Tentar novamente' : 'Try again'}
              </button>
            </div>
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <>
    <UserLayout
      title={`${language === 'pt' ? 'Planos' : 'Plans'} | CoinBitClub`}
      description={language === 'pt' ? 'Escolha o plano ideal para trading automatizado' : 'Choose the ideal plan for automated trading'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-blue-400 bg-clip-text text-transparent">
            {language === 'pt' ? 'Planos com API' : 'Plans with API'}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {language === 'pt'
              ? 'Planos carregados dinamicamente via API com integração Stripe'
              : 'Plans loaded dynamically via API with Stripe integration'
            }
          </p>
          
          {/* Region Indicator */}
          {currentPlan && (
            <div className="mt-4 p-3 bg-blue-100 border border-blue-300 rounded-lg inline-block">
              <p className="text-blue-800 font-semibold">
                🌍 {language === 'pt' ? 'Região:' : 'Region:'} {currentPlan.region === 'brazil' ? '🇧🇷 Brasil' : '🌍 Internacional'}
                {currentPlan.userCountry && ` (${currentPlan.userCountry})`}
              </p>
            </div>
          )}

          {/* Current Plan Status */}
          {userPlanStatus && (
            <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded-lg inline-block">
              <p className="text-green-800 font-semibold">
                📊 {language === 'pt' ? 'Plano Atual:' : 'Current Plan:'} {userPlanStatus.user.planName}
                {userPlanStatus.user.subscriptionStatus === 'active' && ' ✅'}
              </p>
            </div>
          )}

          <div className="mt-4 p-4 bg-blue-100 border border-blue-300 rounded-lg inline-block">
            <p className="text-blue-800 font-semibold">
              🔗 {language === 'pt' ? 'API Conectada • Stripe Integrado • Pagamentos Reais' : 'API Connected • Stripe Integrated • Real Payments'}
            </p>
          </div>
        </motion.div>

        {/* Plans Grid */}
        {plans.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className={`bg-black/40 backdrop-blur-sm border rounded-xl p-6 transition-all duration-300 hover:scale-105 relative ${
                    plan.isPopular
                      ? 'border-yellow-400/50 ring-2 ring-yellow-400/20 hover:shadow-lg hover:shadow-yellow-400/20 scale-105'
                      : 'border-gray-700 hover:border-yellow-400/50 hover:shadow-lg hover:shadow-yellow-400/20'
                  }`}
                >
                  {/* Popular Badge */}
                  {plan.isPopular && plan.canPurchase && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                        🔥 {language === 'pt' ? 'MAIS POPULAR' : 'MOST POPULAR'}
                      </div>
                    </div>
                  )}

                  {/* Recommended Badge */}
                  {plan.isRecommended && plan.canPurchase && (
                    <div className="absolute -top-4 right-4">
                      <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                        ⭐ {language === 'pt' ? 'RECOMENDADO' : 'RECOMMENDED'}
                      </div>
                    </div>
                  )}

                  {/* Current Plan Badge */}
                  {!plan.canPurchase && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                        ✅ {language === 'pt' ? 'PLANO ATUAL' : 'CURRENT PLAN'}
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-yellow-400 mb-2">{plan.name}</h3>
                    <p className="text-gray-300 text-sm mb-4">{plan.description}</p>

                    {/* Price */}
                    <div className="mb-4">
                      <span className={`text-3xl font-bold ${plan.price > 0 ? 'bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent' : 'text-green-400'}`}>
                        {formatPrice(plan.price, plan.currency)}
                      </span>
                      {plan.billingPeriod !== 'none' && (
                        <span className="text-gray-400 ml-2">
                          /{language === 'pt' ? (plan.billingPeriod === 'month' ? 'mês' : plan.billingPeriod) : plan.billingPeriod}
                        </span>
                      )}
                    </div>

                    {/* Commission Info */}
                    {plan.commissionRate > 0 && (
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-700 mb-4">
                        💰 {plan.commissionRate}% {language === 'pt' ? 'comissão sobre lucros' : 'commission on profits'}
                      </div>
                    )}

                    {/* Minimum Balance */}
                    {plan.minimumBalance > 0 && (
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700 ml-2 mb-4">
                        💵 {language === 'pt' ? 'Mín:' : 'Min:'} ${plan.minimumBalance}
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-2">
                        <FiCheck className="text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Subscribe Button */}
                  <button
                    onClick={() => handlePlanSubscribe(plan)}
                    disabled={subscribing === plan.code || !plan.canPurchase}
                    className={`w-full font-semibold py-3 px-6 rounded-lg transition-all duration-300 ${
                      !plan.canPurchase
                        ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                        : plan.isPopular
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:shadow-lg hover:scale-105'
                        : 'border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black hover:scale-105'
                    }`}
                  >
                    {subscribing === plan.code ? (
                      <div className="flex items-center justify-center gap-2">
                        <FiLoader className="animate-spin" />
                        {language === 'pt' ? 'Processando...' : 'Processing...'}
                      </div>
                    ) : !plan.canPurchase ? (
                      <div className="flex items-center justify-center gap-2">
                        <FiAlertCircle />
                        {language === 'pt' ? 'Plano Atual' : 'Current Plan'}
                      </div>
                    ) : (
                      `${language === 'pt' ? 'Escolher' : 'Choose'} ${plan.name}`
                    )}
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Plans Comparison Table */}
        {plans.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-black/40 backdrop-blur-sm border border-gray-700 rounded-xl p-8 mb-12"
          >
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              {language === 'pt' ? 'Comparação de Planos' : 'Plan Comparison'}
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-left py-4 px-4 font-medium text-gray-300">
                      {language === 'pt' ? 'Recursos' : 'Features'}
                    </th>
                    {plans.map((plan) => (
                      <th key={plan.id} className="text-center py-4 px-4 font-medium text-yellow-400">
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-700">
                    <td className="py-4 px-4 font-medium text-gray-300">
                      {language === 'pt' ? 'Preço' : 'Price'}
                    </td>
                    {plans.map((plan) => (
                      <td key={plan.id} className="text-center py-4 px-4 text-white">
                        {formatPrice(plan.price, plan.currency)}
                        {plan.billingPeriod !== 'none' && `/${plan.billingPeriod}`}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="py-4 px-4 font-medium text-gray-300">
                      {language === 'pt' ? 'Comissão' : 'Commission'}
                    </td>
                    {plans.map((plan) => (
                      <td key={plan.id} className="text-center py-4 px-4 text-white">
                        {plan.commissionRate}%
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="py-4 px-4 font-medium text-gray-300">
                      {language === 'pt' ? 'Saldo Mínimo' : 'Min Balance'}
                    </td>
                    {plans.map((plan) => (
                      <td key={plan.id} className="text-center py-4 px-4 text-white">
                        ${plan.minimumBalance}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* API Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-lg shadow p-8"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            🔗 {language === 'pt' ? 'Informações da API' : 'API Information'}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-700">
            <div>
              <strong>{language === 'pt' ? 'Total de Planos:' : 'Total Plans:'}</strong> {plans.length}
            </div>
            <div>
              <strong>{language === 'pt' ? 'Fonte:' : 'Source:'}</strong> API
            </div>
            <div>
              <strong>{language === 'pt' ? 'Pagamentos:' : 'Payments:'}</strong> Stripe
            </div>
            <div>
              <strong>{language === 'pt' ? 'Status:' : 'Status:'}</strong> {userPlanStatus?.user.subscriptionStatus || 'N/A'}
            </div>
          </div>

          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">
              ✨ {language === 'pt' ? 'Recursos da Integração:' : 'Integration Features:'}
            </h4>
            <ul className="text-green-800 text-sm space-y-1">
              <li>• {language === 'pt' ? 'Dados em tempo real via API' : 'Real-time data via API'}</li>
              <li>• {language === 'pt' ? 'Pagamentos seguros com Stripe' : 'Secure payments with Stripe'}</li>
              <li>• {language === 'pt' ? 'Ativação automática de planos gratuitos' : 'Automatic free plan activation'}</li>
              <li>• {language === 'pt' ? 'Redirecionamento para checkout em planos pagos' : 'Checkout redirect for paid plans'}</li>
              <li>• {language === 'pt' ? 'Status de assinatura em tempo real' : 'Real-time subscription status'}</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </UserLayout>
    </>
  );
};

export default UserPlans;