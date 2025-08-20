/**
 * Utility functions for automatic plan detection and tracking
 * Detecção automática de plano baseado na região e preferências do usuário
 */

import { useState, useEffect } from 'react';

export interface UserRegionData {
  country: string;
  region: 'brazil' | 'international';
  currency: 'BRL' | 'USD';
  timezone: string;
  language: string;
}

export interface PlanRecommendation {
  planId: string;
  planName: string;
  price: number;
  currency: string;
  type: 'subscription' | 'prepaid';
  features: string[];
}

/**
 * Detecta região do usuário através de múltiplas fontes
 */
export function detectUserRegion(): UserRegionData {
  // Primeiro tenta detectar via timezone
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const isBrazil = timezone.includes('America/Sao_Paulo') || 
                   timezone.includes('America/Fortaleza') ||
                   timezone.includes('America/Recife') ||
                   timezone.includes('America/Manaus') ||
                   timezone.includes('America/Cuiaba');

  // Detecta via idioma do navegador
  const language = navigator.language || navigator.languages[0] || 'en';
  const isBrazilLanguage = language.startsWith('pt-BR') || language.startsWith('pt');

  // Detecta via Intl.Locale se disponível
  let countryFromLocale = '';
  try {
    if ('Locale' in Intl) {
      const locale = new Intl.Locale(language);
      countryFromLocale = locale.region || '';
    }
  } catch (e) {
    // Fallback se Intl.Locale não estiver disponível
  }

  // Determina se é Brasil baseado nos indicadores
  const isBrazilUser = isBrazil || 
                       isBrazilLanguage || 
                       countryFromLocale === 'BR' ||
                       language.includes('br');

  return {
    country: isBrazilUser ? 'BR' : 'US',
    region: isBrazilUser ? 'brazil' : 'international',
    currency: isBrazilUser ? 'BRL' : 'USD',
    timezone,
    language
  };
}

/**
 * Detecta preferência do usuário por tipo de plano
 */
export function detectPlanPreference(): 'subscription' | 'prepaid' {
  // Verifica se há preferência salva no localStorage
  const savedPreference = localStorage.getItem('plan_preference');
  if (savedPreference === 'subscription' || savedPreference === 'prepaid') {
    return savedPreference as 'subscription' | 'prepaid';
  }

  // Analisa comportamento do usuário para sugerir tipo de plano
  const userRegion = detectUserRegion();
  
  // Brasil: Flex (prepaid) é mais popular
  // Internacional: PRO (subscription) é mais popular
  if (userRegion.region === 'brazil') {
    return 'prepaid'; // Brasil FLEX é mais popular
  } else {
    return 'subscription'; // Global PRO é mais popular
  }
}

/**
 * Recomenda plano baseado na região e preferências
 */
export function getRecommendedPlan(): PlanRecommendation {
  const userRegion = detectUserRegion();
  const preference = detectPlanPreference();

  const planConfigs = {
    // 🇧🇷 BRASIL - Todos os planos têm mesmos acessos, diferença no comissionamento
    // PRO: Mais vantajoso para investimentos > USD 3.000 nas corretoras
    brasil_pro: {
      planId: 'brasil_pro',
      planName: 'Brasil PRO',
      price: 297,
      currency: 'BRL',
      type: 'subscription' as const,
      features: ['Trading 24/7', 'Suporte Prioritário', 'Relatórios IA', 'Gestão de Risco', 'Comissionamento Reduzido']
    },
    // FLEX: Recarga mínima flexível, comissionamento padrão
    brasil_flex: {
      planId: 'brasil_flex',
      planName: 'Brasil FLEX',
      price: 150,
      currency: 'BRL',
      type: 'prepaid' as const,
      features: ['Trading 24/7', 'Sem Mensalidade', 'Comissão Apenas no Lucro', 'Recarga Flexível']
    },
    // 🌍 GLOBAL - Todos os planos têm mesmos acessos, diferença no comissionamento
    // PRO: Mais vantajoso para investimentos > USD 3.000 nas corretoras
    global_pro: {
      planId: 'global_pro',
      planName: 'Global PRO',
      price: 50,
      currency: 'USD',
      type: 'subscription' as const,
      features: ['24/7 Trading', 'Priority Support', 'AI Reports', 'Risk Management', 'Reduced Commission']
    },
    // FLEX: Recarga mínima flexível, comissionamento padrão
    global_flex: {
      planId: 'global_flex',
      planName: 'Global FLEX',
      price: 30,
      currency: 'USD',
      type: 'prepaid' as const,
      features: ['24/7 Trading', 'No Monthly Fee', 'Commission on Profit Only', 'Flexible Recharge']
    }
  };

  // Determina o plano recomendado
  let recommendedPlanId: string;
  
  if (userRegion.region === 'brazil') {
    recommendedPlanId = preference === 'subscription' ? 'brasil_pro' : 'brasil_flex';
  } else {
    recommendedPlanId = preference === 'subscription' ? 'global_pro' : 'global_flex';
  }

  return planConfigs[recommendedPlanId as keyof typeof planConfigs];
}

/**
 * Salva preferência do usuário
 */
export function savePlanPreference(preference: 'subscription' | 'prepaid'): void {
  localStorage.setItem('plan_preference', preference);
}

/**
 * Formata preço baseado na moeda
 */
export function formatPrice(price: number, currency: string): string {
  const formatters = {
    BRL: new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }),
    USD: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })
  };

  const formatter = formatters[currency as keyof typeof formatters];
  return formatter ? formatter.format(price) : `${currency} ${price}`;
}

/**
 * Converte preço entre moedas (estimativa)
 */
export function convertPrice(amount: number, fromCurrency: string, toCurrency: string): number {
  if (fromCurrency === toCurrency) return amount;

  // Taxas aproximadas (em produção, usar API de câmbio)
  const rates: Record<string, number> = {
    'BRL_TO_USD': 0.20,
    'USD_TO_BRL': 5.00
  };

  const conversionKey = `${fromCurrency}_TO_${toCurrency}`;
  const rate = rates[conversionKey];
  
  if (!rate) {
    console.warn(`Conversion rate not found for ${conversionKey}`);
    return amount;
  }

  return Math.round(amount * rate * 100) / 100;
}

/**
 * Gera URL de checkout com plano automático
 */
export function generateCheckoutUrl(customPlanId?: string): string {
  const planId = customPlanId || getRecommendedPlan().planId;
  return `/checkout?plan=${planId}&auto=true`;
}

/**
 * Gera parâmetros para tracking automático
 */
export function generateTrackingParams(planId?: string) {
  const plan = planId ? 
    getRecommendedPlan() : // Se não especificado, usa recomendado
    { planId, planName: 'Custom Plan', price: 0, currency: 'USD' };

  const userRegion = detectUserRegion();
  
  return {
    plan_id: plan.planId,
    plan_name: plan.planName,
    value: plan.price,
    currency: plan.currency,
    user_region: userRegion.region,
    user_country: userRegion.country,
    auto_detected: !planId // Se foi auto-detectado
  };
}

/**
 * Hook React para detecção automática de plano
 */
export function useAutoDetectedPlan() {
  const [recommendedPlan, setRecommendedPlan] = useState<PlanRecommendation | null>(null);
  const [userRegion, setUserRegion] = useState<UserRegionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Executa detecção apenas no cliente
    if (typeof window !== 'undefined') {
      const region = detectUserRegion();
      const plan = getRecommendedPlan();
      
      setUserRegion(region);
      setRecommendedPlan(plan);
      setIsLoading(false);
    }
  }, []);

  return {
    recommendedPlan,
    userRegion,
    isLoading,
    refreshRecommendation: () => {
      const plan = getRecommendedPlan();
      setRecommendedPlan(plan);
    }
  };
}

// Função de conveniência para importação fácil
export default {
  detectUserRegion,
  detectPlanPreference,
  getRecommendedPlan,
  savePlanPreference,
  formatPrice,
  convertPrice,
  generateCheckoutUrl,
  generateTrackingParams,
  useAutoDetectedPlan
};
