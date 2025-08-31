import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaPhone, FaArrowLeft, FaGlobe, FaUsers, FaTicketAlt } from 'react-icons/fa';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  countryCode: string;
  country: string;
  affiliateCode: string;
  discountCoupon: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  phoneVerified: boolean;
  otpCode: string;
}

const RegisterPage: NextPage = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [language, setLanguageState] = useState<'pt' | 'en'>('pt');
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    countryCode: '+55',
    country: 'Brasil',
    affiliateCode: '',
    discountCoupon: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    phoneVerified: false,
    otpCode: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [couponValidated, setCouponValidated] = useState<null | { valid: boolean; discount?: number; message: string }>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    setMounted(true);
    
    // Analytics - track register page view
    if (typeof gtag !== 'undefined') {
      gtag('event', 'register_page_view', {
        page_title: 'Register',
        language: language,
        event_category: 'authentication'
      });
    }
    
    // Carregar idioma do localStorage
    try {
      const savedLanguage = localStorage.getItem('coinbitclub-language') as 'pt' | 'en';
      if (savedLanguage && (savedLanguage === 'pt' || savedLanguage === 'en')) {
        setLanguageState(savedLanguage);
      }
    } catch (error) {
      console.warn('Error loading language:', error);
    }
  }, []);

  const handleLanguageChange = (lang: 'pt' | 'en') => {
    console.log('Mudando idioma para:', lang);
    setLanguageState(lang);
    try {
      localStorage.setItem('coinbitclub-language', lang);
      console.log('Idioma alterado para:', lang);
    } catch (error) {
      console.error('Função changeLanguage não disponível');
    }
  };

  // Timer para reenvio do OTP
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  const sendOtpCode = async () => {
    if (!formData.phone) {
      setErrors({ phone: t.phoneRequired });
      return;
    }

    setOtpLoading(true);
    try {
      // Simular envio de OTP
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setOtpSent(true);
      setResendTimer(60); // 60 segundos para reenvio
      setErrors({ ...errors, phone: '', otp: '' });
      
      // Mock: Log do código para desenvolvimento
      console.log('Código SMS enviado para:', formData.countryCode + formData.phone);
      console.log('Código mock: 123456');
      
    } catch (error) {
      setErrors({ ...errors, phone: 'Erro ao enviar código. Tente novamente.' });
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyOtpCode = async () => {
    if (!formData.otpCode || formData.otpCode.length !== 6) {
      setErrors({ ...errors, otpCode: t.invalidOtp });
      return;
    }

    setOtpLoading(true);
    try {
      // Simular verificação de OTP
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock: aceitar 123456 como código válido
      if (formData.otpCode === '123456') {
        setFormData(prev => ({ ...prev, phoneVerified: true }));
        setErrors({ ...errors, otpCode: '' });
        console.log('✅ Telefone verificado com sucesso!');
      } else {
        setErrors({ ...errors, otpCode: t.invalidOtp });
      }
      
    } catch (error) {
      setErrors({ ...errors, otpCode: 'Erro ao verificar código. Tente novamente.' });
    } finally {
      setOtpLoading(false);
    }
  };

  // Textos por idioma
  const texts = {
    pt: {
      title: 'Criar Conta',
      subtitle: 'Junte-se ao CoinBitClub',
      step1Title: 'Informações Pessoais',
      step2Title: 'Segurança da Conta',
      firstNameLabel: 'Nome *',
      firstNamePlaceholder: 'Seu primeiro nome',
      lastNameLabel: 'Sobrenome *',
      lastNamePlaceholder: 'Seu sobrenome',
      emailLabel: 'Email *',
      emailPlaceholder: 'seu@email.com',
      phoneLabel: 'Telefone *',
      phonePlaceholder: 'Número sem código do país',
      countryLabel: 'País *',
      affiliateLabel: 'Código de Afiliado',
      affiliatePlaceholder: 'Opcional',
      couponLabel: 'Cupom de Desconto',
      couponPlaceholder: 'Código do cupom',
      validateCoupon: 'Validar Cupom',
      passwordLabel: 'Senha *',
      passwordPlaceholder: 'Mínimo 8 caracteres',
      confirmPasswordLabel: 'Confirmar Senha *',
      confirmPasswordPlaceholder: 'Digite a senha novamente',
      acceptTerms: 'Aceito os Termos de Uso e Política de Privacidade',
      backToHome: 'Voltar ao Início',
      nextStep: 'Próximo',
      previousStep: 'Anterior',
      createAccount: 'Criar Conta',
      alreadyHaveAccount: 'Já tem uma conta?',
      signIn: 'Entrar',
      loading: 'Carregando...',
      validCoupon: 'Cupom válido!',
      invalidCoupon: 'Cupom inválido ou expirado',
      firstNameRequired: 'Nome é obrigatório',
      lastNameRequired: 'Sobrenome é obrigatório',
      emailRequired: 'Email é obrigatório',
      phoneRequired: 'Telefone é obrigatório',
      passwordRequired: 'Senha é obrigatória',
      confirmPasswordRequired: 'Confirmação de senha é obrigatória',
      termsRequired: 'Você deve aceitar os termos de uso',
      emailInvalid: 'Email inválido',
      phoneInvalid: 'Telefone inválido. Use o formato (11) 99999-9999',
      passwordTooShort: 'Senha deve ter pelo menos 8 caracteres',
      passwordWeak: 'Senha deve conter pelo menos uma letra maiúscula, minúscula e um número',
      passwordMismatch: 'Senhas não coincidem',
      sendOtp: 'Enviar Código',
      verifyOtp: 'Verificar',
      otpSent: 'Código enviado! Verifique seu WhatsApp',
      otpLabel: 'Código de Verificação',
      otpPlaceholder: 'Digite o código de 6 dígitos',
      phoneNotVerified: 'Número de telefone deve ser verificado',
      invalidOtp: 'Código inválido',
      resendOtp: 'Reenviar código em',
      resendOtpReady: 'Reenviar código',
      smsVerification: 'Verificação por SMS'
    },
    en: {
      title: 'Create Account',
      subtitle: 'Join CoinBitClub',
      step1Title: 'Personal Information',
      step2Title: 'Account Security',
      firstNameLabel: 'First Name *',
      firstNamePlaceholder: 'Your first name',
      lastNameLabel: 'Last Name *',
      lastNamePlaceholder: 'Your last name',
      emailLabel: 'Email *',
      emailPlaceholder: 'your@email.com',
      phoneLabel: 'Phone *',
      phonePlaceholder: 'Number without country code',
      countryLabel: 'Country *',
      affiliateLabel: 'Affiliate Code',
      affiliatePlaceholder: 'Optional',
      couponLabel: 'Discount Coupon',
      couponPlaceholder: 'Coupon code',
      validateCoupon: 'Validate Coupon',
      passwordLabel: 'Password *',
      passwordPlaceholder: 'Minimum 8 characters',
      confirmPasswordLabel: 'Confirm Password *',
      confirmPasswordPlaceholder: 'Enter password again',
      acceptTerms: 'I accept the Terms of Use and Privacy Policy',
      backToHome: 'Back to Home',
      nextStep: 'Next',
      previousStep: 'Previous',
      createAccount: 'Create Account',
      alreadyHaveAccount: 'Already have an account?',
      signIn: 'Sign In',
      loading: 'Loading...',
      validCoupon: 'Valid coupon!',
      invalidCoupon: 'Invalid or expired coupon',
      firstNameRequired: 'First name is required',
      lastNameRequired: 'Last name is required',
      emailRequired: 'Email is required',
      phoneRequired: 'Phone is required',
      passwordRequired: 'Password is required',
      confirmPasswordRequired: 'Password confirmation is required',
      termsRequired: 'You must accept the terms of use',
      emailInvalid: 'Invalid email',
      phoneInvalid: 'Invalid phone. Use format (11) 99999-9999',
      passwordTooShort: 'Password must be at least 8 characters',
      passwordWeak: 'Password must contain at least one uppercase letter, lowercase letter and number',
      passwordMismatch: 'Passwords do not match',
      sendOtp: 'Send Code',
      verifyOtp: 'Verify',
      otpSent: 'Code sent! Check your WhatsApp',
      otpLabel: 'Verification Code',
      otpPlaceholder: 'Enter 6-digit code',
      phoneNotVerified: 'Phone number must be verified',
      invalidOtp: 'Invalid code',
      resendOtp: 'Resend code in',
      resendOtpReady: 'Resend code',
      smsVerification: 'SMS Verification'
    }
  };

  const t = texts[language || 'pt'] || texts.pt;

  const availableCountries = [
    { code: '+55', flag: '🇧🇷', name: 'Brasil', country: 'Brasil' },
    { code: '+1', flag: '🇺🇸', name: 'Estados Unidos', country: 'Estados Unidos' },
    { code: '+86', flag: '🇨🇳', name: 'China', country: 'China' },
    { code: '+91', flag: '🇮🇳', name: 'Índia', country: 'Índia' },
    { code: '+44', flag: '🇬🇧', name: 'Reino Unido', country: 'Reino Unido' },
    { code: '+49', flag: '🇩🇪', name: 'Alemanha', country: 'Alemanha' },
    { code: '+81', flag: '🇯🇵', name: 'Japão', country: 'Japão' },
    { code: '+82', flag: '🇰🇷', name: 'Coreia do Sul', country: 'Coreia do Sul' },
    { code: '+33', flag: '🇫🇷', name: 'França', country: 'França' },
    { code: '+65', flag: '🇸🇬', name: 'Singapura', country: 'Singapura' }
  ];

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-black font-bold text-xl">C</span>
          </div>
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountry = availableCountries.find(c => c.code === e.target.value);
    if (selectedCountry) {
      setFormData(prev => ({
        ...prev,
        countryCode: selectedCountry.code,
        country: selectedCountry.country
      }));
    }
  };

  const validateCoupon = async () => {
    if (!formData.discountCoupon.trim()) return;
    
    try {
      // Simular validação de cupom
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Cupons fictícios para demonstração
      const validCoupons = {
        'WELCOME': { discount: 10, type: 'percentage' },
        'PROMO20': { discount: 20, type: 'percentage' },
        'DISCOUNT50': { discount: 50, type: 'value' }
      };
      
      const coupon = validCoupons[formData.discountCoupon.toUpperCase() as keyof typeof validCoupons];
      
      if (coupon) {
        setCouponValidated({
          valid: true,
          discount: coupon.discount,
          message: `${t.validCoupon} ${coupon.type === 'percentage' ? coupon.discount + '% de desconto' : 'R$ ' + coupon.discount + ' de desconto'}`
        });
      } else {
        setCouponValidated({
          valid: false,
          message: t.invalidCoupon
        });
      }
    } catch (error) {
      setCouponValidated({
        valid: false,
        message: t.invalidCoupon
      });
    }
  };

  const validateStep1 = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = t.firstNameRequired;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = t.lastNameRequired;
    }

    if (!formData.email) {
      newErrors.email = t.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t.emailInvalid;
    }

    if (!formData.phone) {
      newErrors.phone = t.phoneRequired;
    }

    if (!formData.phoneVerified) {
      newErrors.phone = t.phoneNotVerified;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.password) {
      newErrors.password = t.passwordRequired;
    } else if (formData.password.length < 8) {
      newErrors.password = t.passwordTooShort;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = t.passwordWeak;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t.confirmPasswordRequired;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t.passwordMismatch;
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = t.termsRequired;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) {
      return;
    }

    setLoading(true);
    
    try {
      // Simular registro
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock de registro bem-sucedido
      localStorage.setItem('user', JSON.stringify({
        email: formData.email,
        name: `${formData.firstName} ${formData.lastName}`,
        type: 'user'
      }));
      
      // Redirecionar para dashboard
      router.push('/dashboard');
    } catch (error) {
      setErrors({ general: 'Erro ao criar conta. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>{t.title} - CoinBitClub MarketBot</title>
        <meta name="description" content={t.subtitle} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-yellow-500/10"></div>
        <div className="absolute left-1/4 top-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute right-1/4 bottom-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="relative flex min-h-screen items-center justify-center p-4 sm:p-8">
          {/* Back to Home Button */}
          <Link
            href="/home"
            className="absolute top-4 left-4 sm:top-8 sm:left-8 flex items-center gap-2 text-gray-400 hover:text-orange-400 transition-colors z-10 text-sm sm:text-base"
          >
            <FaArrowLeft />
            <span className="hidden sm:inline">{t.backToHome}</span>
          </Link>

          {/* Language Selector */}
          <div className="absolute top-4 right-4 sm:top-8 sm:right-8 flex items-center gap-2 z-10">
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

          {/* Register Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-sm sm:max-w-md relative z-10"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-700/30 shadow-2xl">
              {/* Header */}
              <div className="text-center mb-6 sm:mb-8">
                <div className="flex items-center justify-center gap-3 mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center">
                    <span className="text-black font-bold text-lg sm:text-xl">C</span>
                  </div>
                  <span className="text-xl sm:text-2xl font-bold text-white">CoinBitClub</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{t.title}</h1>
                <p className="text-gray-400 text-sm sm:text-base">
                  {currentStep === 1 ? t.step1Title : t.step2Title}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">
                    {language === 'pt' ? 'Passo' : 'Step'} {currentStep} {language === 'pt' ? 'de' : 'of'} 2
                  </span>
                  <span className="text-sm text-gray-400">{Math.round((currentStep / 2) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(currentStep / 2) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {currentStep === 1 && (
                  <>
                    {/* Nome e Sobrenome */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                          {t.firstNameLabel}
                        </label>
                        <div className="relative">
                          <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                              errors.firstName 
                                ? 'border-red-500 focus:ring-red-500/50' 
                                : 'border-gray-600 focus:border-orange-500 focus:ring-orange-500/50'
                            }`}
                            placeholder={t.firstNamePlaceholder}
                          />
                        </div>
                        {errors.firstName && (
                          <p className="mt-1 text-sm text-red-400">{errors.firstName}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                          {t.lastNameLabel}
                        </label>
                        <div className="relative">
                          <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                              errors.lastName 
                                ? 'border-red-500 focus:ring-red-500/50' 
                                : 'border-gray-600 focus:border-orange-500 focus:ring-orange-500/50'
                            }`}
                            placeholder={t.lastNamePlaceholder}
                          />
                        </div>
                        {errors.lastName && (
                          <p className="mt-1 text-sm text-red-400">{errors.lastName}</p>
                        )}
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                        {t.emailLabel}
                      </label>
                      <div className="relative">
                        <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                            errors.email 
                              ? 'border-red-500 focus:ring-red-500/50' 
                              : 'border-gray-600 focus:border-orange-500 focus:ring-orange-500/50'
                          }`}
                          placeholder={t.emailPlaceholder}
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                      )}
                    </div>

                    {/* Telefone com País e Verificação SMS */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                        {t.phoneLabel}
                      </label>
                      
                      {/* Campo de telefone */}
                      <div className="mb-3">
                        <div className="flex gap-2">
                          <select 
                            value={formData.countryCode}
                            onChange={handleCountryChange}
                            className="px-3 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:border-orange-500 focus:outline-none min-w-[130px]"
                          >
                            {availableCountries.map(country => (
                              <option key={country.code} value={country.code}>
                                {country.flag} {country.code}
                              </option>
                            ))}
                          </select>
                          <div className="relative flex-1">
                            <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                              id="phone"
                              name="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={handleInputChange}
                              disabled={formData.phoneVerified}
                              className={`w-full pl-10 pr-12 py-3 bg-gray-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                                formData.phoneVerified 
                                  ? 'border-green-500 bg-green-900/20'
                                  : errors.phone 
                                  ? 'border-red-500 focus:ring-red-500/50' 
                                  : 'border-gray-600 focus:border-orange-500 focus:ring-orange-500/50'
                              }`}
                              placeholder={t.phonePlaceholder}
                              maxLength={15}
                            />
                            {formData.phoneVerified && (
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400 text-lg">
                                ✓
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Botão de envio SMS - separado */}
                      {!formData.phoneVerified && (
                        <div className="mb-3">
                          <button
                            type="button"
                            onClick={sendOtpCode}
                            disabled={!formData.phone || otpLoading}
                            className="w-full px-4 py-3 bg-orange-500 hover:bg-orange-400 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-medium rounded-xl transition-colors"
                          >
                            {otpLoading ? 'Enviando SMS...' : t.sendOtp}
                          </button>
                        </div>
                      )}

                      {/* Verificação SMS */}
                      {otpSent && !formData.phoneVerified && (
                        <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl mb-3">
                          <h4 className="text-sm font-medium text-blue-300 mb-3">{t.smsVerification}</h4>
                          <p className="text-xs text-blue-200 mb-4">{t.otpSent}</p>
                          
                          <div className="space-y-3">
                            <input
                              name="otpCode"
                              type="text"
                              value={formData.otpCode}
                              onChange={handleInputChange}
                              className={`w-full px-4 py-3 bg-gray-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all text-center text-lg tracking-widest ${
                                errors.otpCode 
                                  ? 'border-red-500 focus:ring-red-500/50' 
                                  : 'border-gray-600 focus:border-orange-500 focus:ring-orange-500/50'
                              }`}
                              placeholder={t.otpPlaceholder}
                              maxLength={6}
                            />
                            
                            <button
                              type="button"
                              onClick={verifyOtpCode}
                              disabled={!formData.otpCode || formData.otpCode.length !== 6 || otpLoading}
                              className="w-full px-4 py-3 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors"
                            >
                              {otpLoading ? 'Verificando...' : t.verifyOtp}
                            </button>
                          </div>

                          {errors.otpCode && (
                            <p className="mt-2 text-sm text-red-400">{errors.otpCode}</p>
                          )}
                          
                          {/* Botão de reenvio */}
                          <div className="mt-4 text-center">
                            {resendTimer > 0 ? (
                              <p className="text-xs text-gray-400">
                                {t.resendOtp} {resendTimer}s
                              </p>
                            ) : (
                              <button
                                type="button"
                                onClick={sendOtpCode}
                                disabled={otpLoading}
                                className="text-sm text-orange-400 hover:text-orange-300 transition-colors underline"
                              >
                                {t.resendOtpReady}
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      <p className="text-xs text-gray-400">
                        {language === 'pt' 
                          ? 'Será enviado um código de verificação via SMS para este número' 
                          : 'A verification code will be sent via SMS to this number'
                        }
                      </p>
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-400">{errors.phone}</p>
                      )}
                    </div>

                    {/* Código de Afiliado */}
                    <div>
                      <label htmlFor="affiliateCode" className="block text-sm font-medium text-gray-300 mb-2">
                        {t.affiliateLabel}
                      </label>
                      <div className="relative">
                        <FaUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          id="affiliateCode"
                          name="affiliateCode"
                          type="text"
                          value={formData.affiliateCode}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-orange-500 focus:ring-orange-500/50 transition-all"
                          placeholder={t.affiliatePlaceholder}
                        />
                      </div>
                    </div>

                    {/* Cupom de Desconto */}
                    <div>
                      <label htmlFor="discountCoupon" className="block text-sm font-medium text-gray-300 mb-2">
                        {t.couponLabel}
                      </label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <FaTicketAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            id="discountCoupon"
                            name="discountCoupon"
                            type="text"
                            value={formData.discountCoupon}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-orange-500 focus:ring-orange-500/50 transition-all"
                            placeholder={t.couponPlaceholder}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={validateCoupon}
                          className="px-4 py-3 bg-orange-500 hover:bg-orange-400 text-black font-medium rounded-xl transition-colors"
                        >
                          {t.validateCoupon}
                        </button>
                      </div>
                      {couponValidated && (
                        <p className={`mt-1 text-sm ${couponValidated.valid ? 'text-green-400' : 'text-red-400'}`}>
                          {couponValidated.message}
                        </p>
                      )}
                    </div>

                    {/* Next Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={handleNextStep}
                      className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 text-black font-bold py-3 px-4 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    >
                      {t.nextStep}
                    </motion.button>
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    {/* Password */}
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                        {t.passwordLabel}
                      </label>
                      <div className="relative">
                        <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-12 py-3 bg-gray-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                            errors.password 
                              ? 'border-red-500 focus:ring-red-500/50' 
                              : 'border-gray-600 focus:border-orange-500 focus:ring-orange-500/50'
                          }`}
                          placeholder={t.passwordPlaceholder}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                        {t.confirmPasswordLabel}
                      </label>
                      <div className="relative">
                        <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-12 py-3 bg-gray-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                            errors.confirmPassword 
                              ? 'border-red-500 focus:ring-red-500/50' 
                              : 'border-gray-600 focus:border-orange-500 focus:ring-orange-500/50'
                          }`}
                          placeholder={t.confirmPasswordPlaceholder}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        >
                          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
                      )}
                    </div>

                    {/* Terms */}
                    <div className="space-y-4">
                      <label className="flex items-start gap-3">
                        <input
                          name="acceptTerms"
                          type="checkbox"
                          checked={formData.acceptTerms}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-orange-500 bg-gray-700 border-gray-600 rounded focus:ring-orange-500 focus:ring-2 mt-0.5"
                        />
                        <span className="text-sm text-gray-300 leading-relaxed">
                          {language === 'pt' ? (
                            <>
                              Aceito os{' '}
                              <Link href="/terms" className="text-orange-400 hover:text-orange-300 underline" target="_blank">
                                Termos de Uso
                              </Link>
                              {' '}e{' '}
                              <Link href="/privacy" className="text-orange-400 hover:text-orange-300 underline" target="_blank">
                                Política de Privacidade
                              </Link>
                            </>
                          ) : (
                            <>
                              I accept the{' '}
                              <Link href="/terms" className="text-orange-400 hover:text-orange-300 underline" target="_blank">
                                Terms of Use
                              </Link>
                              {' '}and{' '}
                              <Link href="/privacy" className="text-orange-400 hover:text-orange-300 underline" target="_blank">
                                Privacy Policy
                              </Link>
                            </>
                          )}
                        </span>
                      </label>
                      {errors.acceptTerms && (
                        <p className="text-sm text-red-400">{errors.acceptTerms}</p>
                      )}
                    </div>

                    {/* Error Message */}
                    {errors.general && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                        <p className="text-red-400 text-sm">{errors.general}</p>
                      </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={handlePrevStep}
                        className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-gray-500/50"
                      >
                        {t.previousStep}
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="flex-2 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 text-black font-bold py-3 px-4 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? t.loading : t.createAccount}
                      </motion.button>
                    </div>
                  </>
                )}
              </form>

              {/* Sign In Link */}
              <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                  {t.alreadyHaveAccount}{' '}
                  <Link
                    href="/auth/login-new"
                    className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
                  >
                    {t.signIn}
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
