import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaPhone, FaArrowLeft, FaGlobe, FaUsers, FaTicketAlt } from 'react-icons/fa';
import { useLanguage } from '../../hooks/useLanguage';

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

const RegisterPage: NextPage = () => {
  const router = useRouter();
  const { language, changeLanguage, isLoaded } = useLanguage();
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

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLanguageChange = (lang: 'pt' | 'en') => {
    console.log('Register page - Button clicked for language:', lang);
    if (changeLanguage && typeof changeLanguage === 'function') {
      changeLanguage(lang);
      console.log('Language changed to:', lang);
    } else {
      console.error('changeLanguage function not available');
    }
  };

  if (!mounted || !isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-black font-bold text-xl">C</span>
          </div>
          <p className="text-gray-400">{language === 'pt' ? 'Carregando...' : 'Loading...'}</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const availableCountries = [
    { code: '+55', flag: '🇧🇷', name: 'Brasil', country: 'Brasil' },
    { code: '+1', flag: '��', name: 'Estados Unidos', country: 'Estados Unidos' },
    { code: '+86', flag: '🇨�', name: 'China', country: 'China' },
    { code: '+91', flag: '��', name: 'Índia', country: 'Índia' },
    { code: '+44', flag: '��', name: 'Reino Unido', country: 'Reino Unido' },
    { code: '+49', flag: '��', name: 'Alemanha', country: 'Alemanha' },
    { code: '+81', flag: '��', name: 'Japão', country: 'Japão' },
    { code: '+82', flag: '��', name: 'Coreia do Sul', country: 'Coreia do Sul' },
    { code: '+33', flag: '��', name: 'França', country: 'França' },
    { code: '+65', flag: '��', name: 'Singapura', country: 'Singapura' }
  ];

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

  const handleCouponChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      discountCoupon: e.target.value.toUpperCase()
    }));
    setCouponValidated(null);
  };

  const validateStep1 = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Nome é obrigatório';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Sobrenome é obrigatório';
    }

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.phone) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = 'Telefone inválido. Use o formato (11) 99999-9999';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Senha deve ter pelo menos 8 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Senha deve conter pelo menos uma letra maiúscula, minúscula e um número';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Você deve aceitar os termos de uso';
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

  const formatPhone = (value: string) => {
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a máscara
    if (numbers.length <= 2) {
      return `(${numbers}`;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData(prev => ({ ...prev, phone: formatted }));
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) return;

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
        <title>Cadastro - CoinBitClub MarketBot</title>
        <meta name="description" content="Crie sua conta no CoinBitClub MarketBot e comece a lucrar com trading automatizado" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-yellow-500/10"></div>
        <div className="absolute left-1/4 top-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute right-1/4 bottom-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="relative flex min-h-screen items-center justify-center p-8">
          {/* Back to Home Button */}
          <Link
            href="/landingpage/home"
            className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-orange-400 transition-colors"
          >
            <FaArrowLeft />
            {language === 'pt' ? 'Voltar ao Início' : 'Back to Home'}
          </Link>

          {/* Language Selector */}
          <div className="absolute top-8 right-8 flex items-center gap-2">
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
            className="w-full max-w-md relative z-10"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/30">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center">
                    <span className="text-black font-bold text-xl">C</span>
                  </div>
                  <span className="text-2xl font-bold text-white">CoinBitClub</span>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Criar Conta</h1>
                <p className="text-gray-400">
                  {currentStep === 1 ? 'Informações pessoais' : 'Segurança da conta'}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Progresso</span>
                  <span className="text-sm text-gray-400">{currentStep}/2</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2 rounded-full transition-all duration-300"
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
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                          Nome
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
                            placeholder="João"
                          />
                        </div>
                        {errors.firstName && (
                          <p className="mt-1 text-sm text-red-400">{errors.firstName}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                          Sobrenome
                        </label>
                        <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 bg-gray-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                            errors.lastName 
                              ? 'border-red-500 focus:ring-red-500/50' 
                              : 'border-gray-600 focus:border-orange-500 focus:ring-orange-500/50'
                          }`}
                          placeholder="Silva"
                        />
                        {errors.lastName && (
                          <p className="mt-1 text-sm text-red-400">{errors.lastName}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                        Email
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
                          placeholder="joao@email.com"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                        Telefone/WhatsApp *
                      </label>
                      <div className="flex gap-2">
                        <select 
                          value={formData.countryCode}
                          onChange={handleCountryChange}
                          className="px-3 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:border-orange-500 focus:outline-none min-w-[120px]"
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
                            onChange={handlePhoneChange}
                            className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                              errors.phone 
                                ? 'border-red-500 focus:ring-red-500/50' 
                                : 'border-gray-600 focus:border-orange-500 focus:ring-orange-500/50'
                            }`}
                            placeholder="Número sem código do país"
                            maxLength={15}
                          />
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Será enviado um SMS de verificação para este número
                      </p>
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-400">{errors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-2">
                        País *
                      </label>
                      <div className="relative">
                        <FaGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
                          className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 appearance-none"
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
                      <label htmlFor="affiliateCode" className="block text-sm font-medium text-gray-300 mb-2">
                        Código do Afiliado (opcional)
                      </label>
                      <div className="relative">
                        <FaUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          id="affiliateCode"
                          name="affiliateCode"
                          type="text"
                          value={formData.affiliateCode}
                          onChange={(e) => setFormData(prev => ({ ...prev, affiliateCode: e.target.value.toUpperCase() }))}
                          className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                          placeholder="Código de quem indicou"
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Digite o código do afiliado que indicou você para ganhar benefícios
                      </p>
                    </div>

                    <div>
                      <label htmlFor="discountCoupon" className="block text-sm font-medium text-gray-300 mb-2">
                        Cupom de Desconto (opcional)
                      </label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <FaTicketAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            id="discountCoupon"
                            name="discountCoupon"
                            type="text"
                            value={formData.discountCoupon}
                            onChange={handleCouponChange}
                            className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                            placeholder="Digite seu cupom de desconto"
                          />
                        </div>
                        {formData.discountCoupon && (
                          <button
                            type="button"
                            onClick={validateCoupon}
                            className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                          >
                            Validar
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
                      
                      <p className="text-xs text-gray-400 mt-1">
                        Cupons disponíveis: WELCOME, PROMO20, DISCOUNT50
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleNextStep}
                    className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-semibold rounded-xl transition-all"
                  >
                    Continuar
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
                      <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                        Senha
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
                          placeholder="Sua senha"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                        Confirmar Senha
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
                          placeholder="Confirme sua senha"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
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
                          className="w-4 h-4 mt-1 text-orange-500 bg-gray-700 border-gray-600 rounded focus:ring-orange-500 focus:ring-2"
                        />
                        <span className="text-sm text-gray-300">
                          Aceito os{' '}
                          <Link href="/termos" className="text-orange-400 hover:text-orange-300">
                            Termos de Uso
                          </Link>{' '}
                          e{' '}
                          <Link href="/privacidade" className="text-orange-400 hover:text-orange-300">
                            Política de Privacidade
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
                          className="w-4 h-4 mt-1 text-orange-500 bg-gray-700 border-gray-600 rounded focus:ring-orange-500 focus:ring-2"
                        />
                        <span className="text-sm text-gray-300">
                          Aceito receber emails promocionais e novidades
                        </span>
                      </label>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="flex-1 py-3 px-4 border border-gray-600 text-gray-300 font-semibold rounded-xl hover:bg-gray-700 transition-all"
                      >
                        Voltar
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className={`flex-1 py-3 px-4 font-semibold rounded-xl transition-all ${
                          loading
                            ? 'bg-gray-600 cursor-not-allowed text-gray-300'
                            : 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black'
                        }`}
                      >
                        {loading ? (
                          <div className="flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin mr-2"></div>
                            Criando...
                          </div>
                        ) : (
                          'Criar Conta'
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Login Link */}
              <div className="mt-6 text-center">
                <p className="text-gray-400">
                  Já tem uma conta?{' '}
                  <Link
                    href="/auth/login"
                    className="text-orange-400 hover:text-orange-300 font-semibold transition-colors"
                  >
                    Faça login
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
