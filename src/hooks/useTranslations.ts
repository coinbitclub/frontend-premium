'use client';

import { useState, useEffect } from 'react';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  'pt-BR': {
    // Header
    'header.login': 'ENTRAR',
    'header.register': 'CADASTRE-SE',
    
    // Landing Page
    'hero.title': 'Robô que Ganha Dinheiro',
    'hero.subtitle': 'O único sistema de trading automatizado que opera 24/7 e só cobra comissão quando você lucra',
    'hero.cta': 'COMEÇAR AGORA',
    'hero.stats.users': 'Usuários Ativos',
    'hero.stats.volume': 'Volume Negociado',
    'hero.stats.roi': 'ROI Médio',
    
    // Features
    'features.title': 'Por que escolher o CoinBitClub?',
    'features.ai.title': 'IA Avançada',
    'features.ai.description': 'Algoritmos de machine learning que se adaptam às condições do mercado',
    'features.security.title': 'Segurança Total',
    'features.security.description': 'Criptografia de ponta e proteção multi-camadas',
    'features.support.title': 'Suporte 24/7',
    'features.support.description': 'Equipe especializada disponível sempre que precisar',
    
    // Plans
    'plans.title': 'Escolha seu Plano',
    'plans.basic.title': 'Básico',
    'plans.basic.price': 'R$ 197/mês',
    'plans.pro.title': 'Profissional',
    'plans.pro.price': 'R$ 497/mês',
    'plans.enterprise.title': 'Enterprise',
    'plans.enterprise.price': 'R$ 997/mês',
    'plans.cta': 'ESCOLHER PLANO',
    
    // Terms Page
    'terms.title': 'Termos e Condições',
    'terms.tab.terms': 'Termos de Uso',
    'terms.tab.privacy': 'Privacidade',
    'terms.tab.risks': 'Riscos',
    'terms.tab.compliance': 'Compliance',
    
    // Login Page
    'login.title': 'Bem-vindo de volta!',
    'login.subtitle': 'Faça login para acessar sua dashboard de trading',
    'login.email': 'E-mail',
    'login.password': 'Senha',
    'login.remember': 'Lembrar-me',
    'login.forgot': 'Esqueci minha senha',
    'login.submit': 'ENTRAR',
    'login.register.text': 'Não tem uma conta?',
    'login.register.link': 'Cadastre-se aqui',
    
    // Register Page
    'register.title': 'Crie sua Conta',
    'register.subtitle': 'Comece a negociar hoje',
    'register.step1': 'Dados Pessoais',
    'register.step2': 'Segurança',
    'register.fullName': 'Nome Completo',
    'register.email': 'E-mail',
    'register.phone': 'Telefone/WhatsApp',
    'register.country': 'País',
    'register.password': 'Senha',
    'register.confirmPassword': 'Confirmar Senha',
    'register.referralCode': 'Código de Indicação (opcional)',
    'register.referralName': 'Nome do Afiliado que Indicou (opcional)',
    'register.acceptTerms': 'Aceito os termos de uso',
    'register.acceptRisk': 'Entendo os riscos do trading',
    'register.next': 'PRÓXIMO',
    'register.create': 'CRIAR CONTA',
    'register.login.text': 'Já tem uma conta?',
    'register.login.link': 'Entre aqui'
  },
  'en-US': {
    // Header
    'header.login': 'LOGIN',
    'header.register': 'SIGN UP',
    
    // Landing Page
    'hero.title': 'Money-Making Robot',
    'hero.subtitle': 'The only automated trading system that operates 24/7 and only charges commission when you profit',
    'hero.cta': 'GET STARTED',
    'hero.stats.users': 'Active Users',
    'hero.stats.volume': 'Trading Volume',
    'hero.stats.roi': 'Average ROI',
    
    // Features
    'features.title': 'Why choose CoinBitClub?',
    'features.ai.title': 'Advanced AI',
    'features.ai.description': 'Machine learning algorithms that adapt to market conditions',
    'features.security.title': 'Total Security',
    'features.security.description': 'End-to-end encryption and multi-layer protection',
    'features.support.title': '24/7 Support',
    'features.support.description': 'Specialized team available whenever you need',
    
    // Plans
    'plans.title': 'Choose Your Plan',
    'plans.basic.title': 'Basic',
    'plans.basic.price': '$49/month',
    'plans.pro.title': 'Professional',
    'plans.pro.price': '$129/month',
    'plans.enterprise.title': 'Enterprise',
    'plans.enterprise.price': '$249/month',
    'plans.cta': 'CHOOSE PLAN',
    
    // Terms Page
    'terms.title': 'Terms and Conditions',
    'terms.tab.terms': 'Terms of Use',
    'terms.tab.privacy': 'Privacy',
    'terms.tab.risks': 'Risks',
    'terms.tab.compliance': 'Compliance',
    
    // Login Page
    'login.title': 'Welcome back!',
    'login.subtitle': 'Login to access your trading dashboard',
    'login.email': 'Email',
    'login.password': 'Password',
    'login.remember': 'Remember me',
    'login.forgot': 'Forgot password',
    'login.submit': 'LOGIN',
    'login.register.text': "Don't have an account?",
    'login.register.link': 'Sign up here',
    
    // Register Page
    'register.title': 'Create Your Account',
    'register.subtitle': 'Start trading today',
    'register.step1': 'Personal Information',
    'register.step2': 'Security',
    'register.fullName': 'Full Name',
    'register.email': 'Email',
    'register.phone': 'Phone/WhatsApp',
    'register.country': 'Country',
    'register.password': 'Password',
    'register.confirmPassword': 'Confirm Password',
    'register.referralCode': 'Referral Code (optional)',
    'register.referralName': 'Referrer Name (optional)',
    'register.acceptTerms': 'I accept the terms of use',
    'register.acceptRisk': 'I understand trading risks',
    'register.next': 'NEXT',
    'register.create': 'CREATE ACCOUNT',
    'register.login.text': 'Already have an account?',
    'register.login.link': 'Login here'
  }
};

export const useTranslations = () => {
  const [language, setLanguage] = useState('pt-BR');

  useEffect(() => {
    // Carrega idioma salvo
    const savedLanguage = localStorage.getItem('language') || 'pt-BR';
    setLanguage(savedLanguage);

    // Escuta mudanças de idioma
    const handleLanguageChange = (e: CustomEvent) => {
      setLanguage(e.detail);
    };

    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange as EventListener);
    };
  }, []);

  const t = (key: string): string => {
    return translations[language]?.[key] || key;
  };

  return { t, language };
};
