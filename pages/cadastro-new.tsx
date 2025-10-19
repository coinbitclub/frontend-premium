import React, { useState, useEffect, useCallback } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaPhone, FaArrowLeft, FaGlobe, FaUsers, FaTicketAlt } from 'react-icons/fa';
import { useLanguage } from '../hooks/useLanguage';
import { useAuth } from '../src/contexts/AuthContext';
// Authentication removed - PublicRoute disabled

const IS_DEV = process.env.NODE_ENV === 'development';

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
  acceptMarketing: boolean;
}

const CadastroNewPage: NextPage = () => {
  const router = useRouter();
  const { language, changeLanguage, isLoaded } = useLanguage();
  const { register, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
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
    acceptMarketing: false
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [couponValidated, setCouponValidated] = useState<null | { valid: boolean; discount?: number; message: string }>(null);

  // Mount effect
  useEffect(() => {
    setMounted(true);
  }, []);

  // Available countries data
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

  // Define all callbacks and hooks BEFORE any conditional returns
  const handleLanguageChange = useCallback((lang: 'pt' | 'en') => {
    IS_DEV && console.log('Register page - Button clicked for language:', lang);
    if (changeLanguage && typeof changeLanguage === 'function') {
      changeLanguage(lang);
      IS_DEV && console.log('Language changed to:', lang);
    } else {
      console.error('changeLanguage function not available');
    }
  }, [changeLanguage]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const validateCoupon = useCallback(async () => {
    if (!formData.discountCoupon.trim()) return;
    
    try {
      // Simulate coupon validation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock coupons for demonstration
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
          message: `Cupom válido! ${coupon.type === 'percentage' ? coupon.discount + '% de desconto' : 'R$ ' + coupon.discount + ' de desconto'}`
        });
      } else {
        setCouponValidated({
          valid: false,
          message: 'Cupom inválido ou expirado'
        });
      }
    } catch (error) {
      setCouponValidated({
        valid: false,
        message: 'Erro ao validar cupom'
      });
    }
  }, [formData.discountCoupon]);

  const handleCountryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountry = availableCountries.find(c => c.code === e.target.value);
    if (selectedCountry) {
      setFormData(prev => ({
        ...prev,
        countryCode: selectedCountry.code,
        country: selectedCountry.country
      }));
    }
  }, [availableCountries]);

  const handleCouponChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      discountCoupon: e.target.value.toUpperCase()
    }));
    setCouponValidated(null);
  }, []);

  const validateStep1 = useCallback(() => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = language === 'pt' ? 'Nome é obrigatório' : 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = language === 'pt' ? 'Sobrenome é obrigatório' : 'Last name is required';
    }

    if (!formData.email) {
      newErrors.email = language === 'pt' ? 'Email é obrigatório' : 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = language === 'pt' ? 'Email inválido' : 'Invalid email';
    }

    if (!formData.phone) {
      newErrors.phone = language === 'pt' ? 'Telefone é obrigatório' : 'Phone is required';
    } else if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = language === 'pt' ? 'Telefone inválido. Use o formato (11) 99999-9999' : 'Invalid phone format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.firstName, formData.lastName, formData.email, formData.phone, language]);

  const validateStep2 = useCallback(() => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.password) {
      newErrors.password = language === 'pt' ? 'Senha é obrigatória' : 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = language === 'pt' ? 'Senha deve ter pelo menos 8 caracteres' : 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = language === 'pt' ? 'Senha deve conter pelo menos uma letra maiúscula, minúscula e um número' : 'Password must contain at least one uppercase, lowercase letter and a number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = language === 'pt' ? 'Confirmação de senha é obrigatória' : 'Password confirmation is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = language === 'pt' ? 'Senhas não coincidem' : 'Passwords do not match';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = language === 'pt' ? 'Você deve aceitar os termos de uso' : 'You must accept the terms of use';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.password, formData.confirmPassword, formData.acceptTerms, language]);

  const handleNextStep = useCallback(() => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  }, [currentStep, validateStep1]);

  const handlePrevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const formatPhone = useCallback((value: string) => {
    // Remove everything that is not a digit
    const numbers = value.replace(/\D/g, '');
    
    // Apply mask
    if (numbers.length <= 2) {
      return `(${numbers}`;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
  }, []);

  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData(prev => ({ ...prev, phone: formatted }));
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: '' }));
    }
  }, [formatPhone, errors.phone]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) return;

    setLoading(true);
    
    try {
      // Prepare user data for registration
      const userData = {
        username: formData.email.split('@')[0], // Use email prefix as username
        email: formData.email,
        password: formData.password,
        full_name: `${formData.firstName} ${formData.lastName}`,
        phone: `${formData.countryCode} ${formData.phone}`,
        country: formData.country,
        affiliate_code: formData.affiliateCode,
        discount_coupon: formData.discountCoupon,
        accept_terms: formData.acceptTerms,
        accept_marketing: formData.acceptMarketing
      };

      // Call the register function from AuthContext
      await register(userData);
      
      // Redirect to dashboard on success
      router.push('/user/dashboard');
    } catch (error: any) {
      console.error('Registration error:', error);
      setErrors({ 
        general: error.message || (language === 'pt' ? 'Erro ao criar conta. Tente novamente.' : 'Error creating account. Please try again.') 
      });
    } finally {
      setLoading(false);
    }
  }, [validateStep2, formData, register, router, language]);

  // Show loading state after all hooks are defined
  if (!mounted || !isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-black font-bold text-xl">₿</span>
          </div>
          <p className="text-slate-400">{language === 'pt' ? 'Carregando...' : 'Loading...'}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{language === 'pt' ? 'Cadastro - CoinBitClub MarketBot' : 'Sign Up - CoinBitClub MarketBot'}</title>
        <meta name="description" content={language === 'pt' ? 'Crie sua conta no CoinBitClub MarketBot e comece a lucrar com trading automatizado' : 'Create your CoinBitClub MarketBot account and start profiting with automated trading'} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-orange-500/10"></div>
        <div className="absolute left-1/4 top-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute right-1/4 bottom-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="relative flex min-h-screen items-center justify-center p-8">
          {/* Back to Home Button */}
          <Link
            href="/"
            className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-yellow-400 transition-colors"
          >
            <FaArrowLeft />
            {language === 'pt' ? 'Voltar ao Início' : 'Back to Home'}
          </Link>

          {/* Language Selector */}
          <div className="absolute top-8 right-8 flex items-center gap-2">
            <FaGlobe className="text-slate-400" />
            <div className="flex bg-slate-700/50 rounded-lg p-1">
              <button
                onClick={() => handleLanguageChange('pt')}
                className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                  language === 'pt'
                    ? 'bg-yellow-500 text-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                PT
              </button>
              <button
                onClick={() => handleLanguageChange('en')}
                className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                  language === 'en'
                    ? 'bg-yellow-500 text-black'
                    : 'text-slate-400 hover:text-white'
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
            className="w-full max-w-md relative z-10"
          >
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/30">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                    <span className="text-black font-bold text-xl">₿</span>
                  </div>
                  <span className="text-2xl font-bold text-white">CoinBitClub</span>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {language === 'pt' ? 'Criar Conta' : 'Create Account'}
                </h1>
                <p className="text-slate-400">
                  {currentStep === 1 
                    ? (language === 'pt' ? 'Informações pessoais' : 'Personal Information')
                    : (language === 'pt' ? 'Segurança da conta' : 'Account Security')
                  }
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">
                    {language === 'pt' ? 'Progresso' : 'Progress'}
                  </span>
                  <span className="text-sm text-slate-400">{currentStep}/2</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentStep / 2) * 100}%` }}
                  ></div>
                </div>
              </div>

              {currentStep === 1 ? (
                /* Step 1: Personal Information */
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-slate-300 mb-2">
                          {language === 'pt' ? 'Nome' : 'First Name'}
                        </label>
                        <div className="relative">
                          <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                          <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-4 py-3 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                              errors.firstName 
                                ? 'border-red-500 focus:ring-red-500/50' 
                                : 'border-slate-600 focus:border-yellow-500 focus:ring-yellow-500/50'
                            }`}
                            placeholder={language === 'pt' ? 'João' : 'John'}
                          />
                        </div>
                        {errors.firstName && (
                          <p className="mt-1 text-sm text-red-400">{errors.firstName}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-slate-300 mb-2">
                          {language === 'pt' ? 'Sobrenome' : 'Last Name'}
                        </label>
                        <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                            errors.lastName 
                              ? 'border-red-500 focus:ring-red-500/50' 
                              : 'border-slate-600 focus:border-yellow-500 focus:ring-yellow-500/50'
                          }`}
                          placeholder={language === 'pt' ? 'Silva' : 'Doe'}
                        />
                        {errors.lastName && (
                          <p className="mt-1 text-sm text-red-400">{errors.lastName}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                            errors.email 
                              ? 'border-red-500 focus:ring-red-500/50' 
                              : 'border-slate-600 focus:border-yellow-500 focus:ring-yellow-500/50'
                          }`}
                          placeholder="joao@email.com"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-2">
                        {language === 'pt' ? 'Telefone/WhatsApp *' : 'Phone/WhatsApp *'}
                      </label>
                      <div className="flex gap-2">
                        <select 
                          value={formData.countryCode}
                          onChange={handleCountryChange}
                          className="px-3 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:border-yellow-500 focus:outline-none min-w-[120px]"
                        >
                          {availableCountries.map(country => (
                            <option key={country.code} value={country.code}>
                              {country.flag} {country.code}
                            </option>
                          ))}
                        </select>
                        <div className="relative flex-1">
                          <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                          <input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handlePhoneChange}
                            className={`w-full pl-10 pr-4 py-3 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                              errors.phone 
                                ? 'border-red-500 focus:ring-red-500/50' 
                                : 'border-slate-600 focus:border-yellow-500 focus:ring-yellow-500/50'
                            }`}
                            placeholder={language === 'pt' ? 'Número sem código do país' : 'Number without country code'}
                            maxLength={15}
                          />
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {language === 'pt' ? 'Será enviado um SMS de verificação para este número' : 'A verification SMS will be sent to this number'}
                      </p>
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-400">{errors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-slate-300 mb-2">
                        {language === 'pt' ? 'País *' : 'Country *'}
                      </label>
                      <div className="relative">
                        <FaGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <select
                          id="country"
                          value={formData.country}
                          onChange={(e) => {
                            const selectedCountry = availableCountries.find(c => c.country === e.target.value);
                            if (selectedCountry) {
                              setFormData(prev => ({
                                ...prev,
                                country: e.target.value,
                                countryCode: selectedCountry.code
                              }));
                            }
                          }}
                          className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 appearance-none"
                        >
                          {availableCountries.map(country => (
                            <option key={country.country} value={country.country}>
                              {country.flag} {country.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="affiliateCode" className="block text-sm font-medium text-slate-300 mb-2">
                        {language === 'pt' ? 'Código do Afiliado (opcional)' : 'Affiliate Code (optional)'}
                      </label>
                      <div className="relative">
                        <FaUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input
                          id="affiliateCode"
                          name="affiliateCode"
                          type="text"
                          value={formData.affiliateCode}
                          onChange={(e) => setFormData(prev => ({ ...prev, affiliateCode: e.target.value.toUpperCase() }))}
                          className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                          placeholder={language === 'pt' ? 'Código de quem indicou' : 'Referrer code'}
                        />
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {language === 'pt' ? 'Digite o código do afiliado que indicou você para ganhar benefícios' : 'Enter the affiliate code of who referred you to earn benefits'}
                      </p>
                    </div>

                    <div>
                      <label htmlFor="discountCoupon" className="block text-sm font-medium text-slate-300 mb-2">
                        {language === 'pt' ? 'Cupom de Desconto (opcional)' : 'Discount Coupon (optional)'}
                      </label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <FaTicketAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                          <input
                            id="discountCoupon"
                            name="discountCoupon"
                            type="text"
                            value={formData.discountCoupon}
                            onChange={handleCouponChange}
                            className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                            placeholder={language === 'pt' ? 'Digite seu cupom de desconto' : 'Enter your discount coupon'}
                          />
                        </div>
                        {formData.discountCoupon && (
                          <button
                            type="button"
                            onClick={validateCoupon}
                            className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                          >
                            {language === 'pt' ? 'Validar' : 'Validate'}
                          </button>
                        )}
                      </div>
                      
                      {couponValidated && (
                        <div className={`mt-2 p-2 rounded-lg text-sm ${
                          couponValidated.valid 
                            ? 'bg-green-500/20 border border-green-500/50 text-green-400' 
                            : 'bg-red-500/20 border border-red-500/50 text-red-400'
                        }`}>
                          {couponValidated.message}
                        </div>
                      )}
                      
                      <p className="text-xs text-slate-400 mt-1">
                        {language === 'pt' ? 'Cupons disponíveis: WELCOME, PROMO20, DISCOUNT50' : 'Available coupons: WELCOME, PROMO20, DISCOUNT50'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleNextStep}
                    className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold rounded-xl transition-all"
                  >
                    {language === 'pt' ? 'Continuar' : 'Continue'}
                  </button>
                </motion.div>
              ) : (
                /* Step 2: Security */
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {errors.general && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
                        {errors.general}
                      </div>
                    )}

                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                        {language === 'pt' ? 'Senha' : 'Password'}
                      </label>
                      <div className="relative">
                        <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-12 py-3 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                            errors.password 
                              ? 'border-red-500 focus:ring-red-500/50' 
                              : 'border-slate-600 focus:border-yellow-500 focus:ring-yellow-500/50'
                          }`}
                          placeholder={language === 'pt' ? 'Sua senha' : 'Your password'}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
                        {language === 'pt' ? 'Confirmar Senha' : 'Confirm Password'}
                      </label>
                      <div className="relative">
                        <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-12 py-3 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                            errors.confirmPassword 
                              ? 'border-red-500 focus:ring-red-500/50' 
                              : 'border-slate-600 focus:border-yellow-500 focus:ring-yellow-500/50'
                          }`}
                          placeholder={language === 'pt' ? 'Confirme sua senha' : 'Confirm your password'}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                        >
                          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <label className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          name="acceptTerms"
                          checked={formData.acceptTerms}
                          onChange={handleInputChange}
                          className="w-4 h-4 mt-1 text-yellow-500 bg-slate-700 border-slate-600 rounded focus:ring-yellow-500 focus:ring-2"
                        />
                        <span className="text-sm text-slate-300">
                          {language === 'pt' ? 'Aceito os' : 'I accept the'}{' '}
                          <Link href="/termos" className="text-yellow-400 hover:text-yellow-300">
                            {language === 'pt' ? 'Termos de Uso' : 'Terms of Use'}
                          </Link>{' '}
                          {language === 'pt' ? 'e' : 'and'}{' '}
                          <Link href="/privacidade" className="text-yellow-400 hover:text-yellow-300">
                            {language === 'pt' ? 'Política de Privacidade' : 'Privacy Policy'}
                          </Link>
                        </span>
                      </label>
                      {errors.acceptTerms && (
                        <p className="text-sm text-red-400">{errors.acceptTerms}</p>
                      )}

                      <label className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          name="acceptMarketing"
                          checked={formData.acceptMarketing}
                          onChange={handleInputChange}
                          className="w-4 h-4 mt-1 text-yellow-500 bg-slate-700 border-slate-600 rounded focus:ring-yellow-500 focus:ring-2"
                        />
                        <span className="text-sm text-slate-300">
                          {language === 'pt' ? 'Aceito receber emails promocionais e novidades' : 'I accept receiving promotional emails and news'}
                        </span>
                      </label>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="flex-1 py-3 px-4 border border-slate-600 text-slate-300 font-semibold rounded-xl hover:bg-slate-700 transition-all"
                      >
                        {language === 'pt' ? 'Voltar' : 'Back'}
                      </button>
                      <button
                        type="submit"
                        disabled={loading || isLoading}
                        className={`flex-1 py-3 px-4 font-semibold rounded-xl transition-all ${
                          loading || isLoading
                            ? 'bg-slate-600 cursor-not-allowed text-slate-300'
                            : 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black'
                        }`}
                      >
                        {loading || isLoading ? (
                          <div className="flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-slate-300 border-t-transparent rounded-full animate-spin mr-2"></div>
                            {language === 'pt' ? 'Criando...' : 'Creating...'}
                          </div>
                        ) : (
                          language === 'pt' ? 'Criar Conta' : 'Create Account'
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Login Link */}
              <div className="mt-6 text-center">
                <p className="text-slate-400">
                  {language === 'pt' ? 'Já tem uma conta?' : "Already have an account?"}{' '}
                  <Link
                    href="/auth/login"
                    className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors"
                  >
                    {language === 'pt' ? 'Faça login' : 'Sign in'}
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

export default CadastroNewPage;

