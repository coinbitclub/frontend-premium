import React, { useState, useEffect, useCallback } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { 
  FaPhone, 
  FaArrowLeft, 
  FaCheck, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaGlobe,
  FaShieldAlt 
} from 'react-icons/fa';
// Authentication removed - PublicRoute disabled

const IS_DEV = process.env.NODE_ENV === 'development';

interface FormData {
  countryCode: string;
  phone: string;
  otpCode: string;
  newPassword: string;
  confirmPassword: string;
}

interface Errors {
  [key: string]: string;
}

interface Country {
  code: string;
  name: string;
  flag: string;
}

const ForgotPasswordPage: NextPage = () => {
  const router = useRouter();
  
  // Language state - simplified direct management
  const [language, setLanguage] = useState<'pt' | 'en'>('pt');

  // Form state
  const [step, setStep] = useState(1); // 1: phone, 2: OTP, 3: new password, 4: success
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  
  const [formData, setFormData] = useState<FormData>({
    countryCode: '+55',
    phone: '',
    otpCode: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState<Errors>({});

  // Analytics tracking on page load
  useEffect(() => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'forgot_password_page_view', {
        page_title: 'Forgot Password',
        language: language,
        event_category: 'authentication'
      });
    }
  }, []);

  // Analytics tracking functions
  const trackForgotPasswordStep = useCallback((step: number, action: string) => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'forgot_password_step', {
        step: step,
        action: action,
        language: language,
        event_category: 'authentication'
      });
    }
  }, [language]);

  // Available countries
  const availableCountries: Country[] = [
    { code: '+55', name: 'Brasil', flag: '🇧🇷' },
    { code: '+1', name: 'United States', flag: '🇺🇸' },
    { code: '+86', name: 'China', flag: '🇨🇳' },
    { code: '+91', name: 'India', flag: '🇮🇳' },
    { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
    { code: '+49', name: 'Germany', flag: '🇩🇪' },
    { code: '+81', name: 'Japan', flag: '🇯🇵' },
    { code: '+82', name: 'South Korea', flag: '🇰🇷' },
    { code: '+33', name: 'France', flag: '🇫🇷' },
    { code: '+65', name: 'Singapore', flag: '🇸🇬' }
  ];

  // Translations
  const t = {
    pt: {
      title: 'Esqueci minha senha',
      step1Title: 'Digite seu número de telefone',
      step2Title: 'Verificação SMS',
      step3Title: 'Nova senha',
      step4Title: 'Senha redefinida!',
      step1Description: 'Digite seu número de telefone para receber um código de verificação',
      step2Description: 'Enviamos um código de 6 dígitos para',
      step3Description: 'Defina uma nova senha para sua conta',
      step4Description: 'Sua senha foi redefinida com sucesso. Agora você pode fazer login com sua nova senha.',
      phoneLabel: 'Número de telefone',
      phonePlaceholder: '21 98765-4321',
      sendOtp: 'Enviar código SMS',
      otpCodeLabel: 'Código de verificação',
      otpPlaceholder: '000000',
      verifyOtp: 'Verificar código',
      newPasswordLabel: 'Nova senha',
      newPasswordPlaceholder: 'Mínimo 6 caracteres',
      confirmPasswordLabel: 'Confirmar nova senha',
      confirmPasswordPlaceholder: 'Repita a nova senha',
      redefinePassword: 'Redefinir senha',
      backToLogin: 'Voltar ao Login',
      loginNow: 'Fazer login agora',
      resendOtp: 'Reenviar código em',
      resendOtpReady: 'Reenviar código',
      loading: 'Carregando...',
      sending: 'Enviando SMS...',
      verifying: 'Verificando...',
      redefining: 'Redefinindo senha...',
      otpSent: 'Digite o código de 6 dígitos que enviamos via SMS',
      demoCode: 'Para demonstração, use o código 123456',
      passwordStrength: 'Força da senha:',
      weak: 'Fraca',
      medium: 'Média',
      strong: 'Forte',
      back: 'Voltar',
      next: 'Próximo',
      smsInfo: 'Será enviado um código de verificação via SMS para este número'
    },
    en: {
      title: 'Forgot Password',
      step1Title: 'Enter your phone number',
      step2Title: 'SMS Verification',
      step3Title: 'New password',
      step4Title: 'Password reset!',
      step1Description: 'Enter your phone number to receive a verification code',
      step2Description: 'We sent a 6-digit code to',
      step3Description: 'Set a new password for your account',
      step4Description: 'Your password has been successfully reset. You can now log in with your new password.',
      phoneLabel: 'Phone number',
      phonePlaceholder: '21 98765-4321',
      sendOtp: 'Send SMS code',
      otpCodeLabel: 'Verification code',
      otpPlaceholder: '000000',
      verifyOtp: 'Verify code',
      newPasswordLabel: 'New password',
      newPasswordPlaceholder: 'Minimum 6 characters',
      confirmPasswordLabel: 'Confirm new password',
      confirmPasswordPlaceholder: 'Repeat the new password',
      redefinePassword: 'Reset password',
      backToLogin: 'Back to Login',
      loginNow: 'Login now',
      resendOtp: 'Resend code in',
      resendOtpReady: 'Resend code',
      loading: 'Loading...',
      sending: 'Sending SMS...',
      verifying: 'Verifying...',
      redefining: 'Resetting password...',
      otpSent: 'Enter the 6-digit code we sent via SMS',
      demoCode: 'For demo purposes, use code 123456',
      passwordStrength: 'Password strength:',
      weak: 'Weak',
      medium: 'Medium',
      strong: 'Strong',
      back: 'Back',
      next: 'Next',
      smsInfo: 'A verification code will be sent via SMS to this number'
    }
  };

  const currentT = t[language];

  // Handle language change
  const handleLanguageChange = useCallback((lang: 'pt' | 'en') => {
    IS_DEV && console.log('Forgot password page - Language changed to:', lang);
    setLanguage(lang);
  }, []);

  // Handle input changes
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      // Only allow numbers and limit length
      const numericValue = value.replace(/\D/g, '').slice(0, 15);
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else if (name === 'otpCode') {
      // Only allow numbers and limit to 6 digits
      const numericValue = value.replace(/\D/g, '').slice(0, 6);
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  // Handle country change
  const handleCountryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, countryCode: e.target.value }));
  }, []);

  // Timer for OTP resend
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Validate form
  const validateStep = useCallback((currentStep: number): boolean => {
    const newErrors: Errors = {};

    if (currentStep === 1) {
      if (!formData.phone) {
        newErrors.phone = language === 'pt' 
          ? 'Telefone é obrigatório' 
          : 'Phone number is required';
      } else if (formData.phone.length < 10) {
        newErrors.phone = language === 'pt' 
          ? 'Telefone deve ter pelo menos 10 dígitos' 
          : 'Phone number must have at least 10 digits';
      }
    }

    if (currentStep === 2) {
      if (!formData.otpCode) {
        newErrors.otpCode = language === 'pt' 
          ? 'Código é obrigatório' 
          : 'Code is required';
      } else if (formData.otpCode.length !== 6) {
        newErrors.otpCode = language === 'pt' 
          ? 'Código deve ter 6 dígitos' 
          : 'Code must have 6 digits';
      }
    }

    if (currentStep === 3) {
      if (!formData.newPassword) {
        newErrors.newPassword = language === 'pt' 
          ? 'Nova senha é obrigatória' 
          : 'New password is required';
      } else if (formData.newPassword.length < 6) {
        newErrors.newPassword = language === 'pt' 
          ? 'Senha deve ter pelo menos 6 caracteres' 
          : 'Password must have at least 6 characters';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = language === 'pt' 
          ? 'Confirmação de senha é obrigatória' 
          : 'Password confirmation is required';
      } else if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = language === 'pt' 
          ? 'Senhas não coincidem' 
          : 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.phone, formData.otpCode, formData.newPassword, formData.confirmPassword, language]);

  // Send OTP code
  const sendOtpCode = useCallback(async () => {
    if (!validateStep(1)) return;

    setOtpLoading(true);
    setErrors({});

    try {
      // Analytics - track OTP request
      trackForgotPasswordStep(1, 'send_otp');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      IS_DEV && console.log('Sending SMS to:', formData.countryCode + formData.phone);
      
      setOtpSent(true);
      setStep(2);
      setResendTimer(300); // 5 minutes
      
      // Analytics - track successful OTP send
      trackForgotPasswordStep(2, 'otp_sent');
      
    } catch (error) {
      console.error('Error sending OTP:', error);
      setErrors({ 
        general: language === 'pt' 
          ? 'Erro ao enviar código. Tente novamente.' 
          : 'Error sending code. Please try again.'
      });
      
      // Analytics - track OTP send failure
      trackForgotPasswordStep(1, 'send_otp_failed');
    } finally {
      setOtpLoading(false);
    }
  }, [validateStep, trackForgotPasswordStep, formData.countryCode, formData.phone, language]);

  // Verify OTP code
  const verifyOtpCode = useCallback(async () => {
    if (!validateStep(2)) return;

    setOtpLoading(true);
    setErrors({});

    try {
      // Analytics - track OTP verification attempt
      trackForgotPasswordStep(2, 'verify_otp');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Accept 123456 for demo
      if (formData.otpCode === '123456') {
        setStep(3);
        setErrors({});
        
        // Analytics - track successful OTP verification
        trackForgotPasswordStep(3, 'otp_verified');
      } else {
        setErrors({ 
          otpCode: language === 'pt' 
            ? 'Código inválido. Use 123456 para demonstração.' 
            : 'Invalid code. Use 123456 for demo.'
        });
        
        // Analytics - track OTP verification failure
        trackForgotPasswordStep(2, 'verify_otp_failed');
      }
      
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setErrors({ 
        general: language === 'pt' 
          ? 'Erro ao verificar código. Tente novamente.' 
          : 'Error verifying code. Please try again.'
      });
    } finally {
      setOtpLoading(false);
    }
  }, [validateStep, trackForgotPasswordStep, formData.otpCode, language]);

  // Reset password
  const resetPassword = useCallback(async () => {
    if (!validateStep(3)) return;

    setLoading(true);
    setErrors({});

    try {
      // Analytics - track password reset attempt
      trackForgotPasswordStep(3, 'reset_password');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      IS_DEV && console.log('Resetting password for:', formData.countryCode + formData.phone);
      
      setStep(4);
      setErrors({});
      
      // Analytics - track successful password reset
      trackForgotPasswordStep(4, 'password_reset_complete');
      
    } catch (error) {
      console.error('Error resetting password:', error);
      setErrors({ 
        general: language === 'pt' 
          ? 'Erro ao redefinir senha. Tente novamente.' 
          : 'Error resetting password. Please try again.'
      });
      
      // Analytics - track password reset failure
      trackForgotPasswordStep(3, 'reset_password_failed');
    } finally {
      setLoading(false);
    }
  }, [validateStep, trackForgotPasswordStep, formData.countryCode, formData.phone, language]);

  // Calculate password strength
  const getPasswordStrength = useCallback((password: string): string => {
    if (password.length < 6) return currentT.weak;
    if (password.length >= 8 && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return currentT.strong;
    return currentT.medium;
  }, [currentT.weak, currentT.strong, currentT.medium]);

  // Format phone number
  const formatPhone = useCallback((phone: string) => {
    const numbers = phone.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '$1 $2-$3');
    } else {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '$1 $2-$3');
    }
  }, []);

  return (
    <>
      <Head>
        <title>{currentT.title} - CoinBitClub</title>
        <meta name="description" content={currentT.step1Description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-yellow-500/10"></div>
        <div className="absolute left-1/4 top-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute right-1/4 bottom-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="relative flex min-h-screen items-center justify-center p-8">
          {/* Back to Login Button */}
          <Link
            href="/auth/login-new"
            className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-orange-400 transition-colors z-10"
          >
            <FaArrowLeft />
            {currentT.backToLogin}
          </Link>

          {/* Language Selector */}
          <div className="absolute top-8 right-8 flex items-center gap-2 z-10">
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

          {/* Forgot Password Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md relative z-10"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/30 shadow-2xl">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center">
                    <span className="text-black font-bold text-xl">C</span>
                  </div>
                  <span className="text-2xl font-bold text-white">CoinBitClub</span>
                </div>

                {/* Progress Bar */}
                {step <= 3 && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">
                        {language === 'pt' ? 'Passo' : 'Step'} {step} {language === 'pt' ? 'de' : 'of'} 3
                      </span>
                      <span className="text-sm text-gray-400">{Math.round((step / 3) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(step / 3) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <>
                    <h1 className="text-3xl font-bold text-white mb-2">{currentT.title}</h1>
                    <p className="text-gray-400">{currentT.step1Description}</p>
                  </>
                )}
                
                {step === 2 && (
                  <>
                    <h1 className="text-3xl font-bold text-white mb-2">{currentT.step2Title}</h1>
                    <p className="text-gray-400 mb-4">{currentT.step2Description}</p>
                    <p className="text-orange-400 font-medium">
                      {formData.countryCode} {formatPhone(formData.phone)}
                    </p>
                  </>
                )}
                
                {step === 3 && (
                  <>
                    <h1 className="text-3xl font-bold text-white mb-2">{currentT.step3Title}</h1>
                    <p className="text-gray-400">{currentT.step3Description}</p>
                  </>
                )}
                
                {step === 4 && (
                  <>
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaCheck className="text-green-400 text-2xl" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">{currentT.step4Title}</h1>
                    <p className="text-gray-400">{currentT.step4Description}</p>
                  </>
                )}
              </div>

              {/* Error Message */}
              {errors.general && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-6">
                  <p className="text-red-400 text-sm">{errors.general}</p>
                </div>
              )}

              {/* Step 1 - Phone Number */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <label htmlFor="countryCode" className="block text-sm font-medium text-gray-300 mb-2">
                      {language === 'pt' ? 'País' : 'Country'}
                    </label>
                    <select 
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleCountryChange}
                      className="w-full px-3 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:border-orange-500 focus:outline-none"
                    >
                      {availableCountries.map(country => (
                        <option key={country.code} value={country.code}>
                          {country.flag} {country.name} ({country.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                      {currentT.phoneLabel}
                    </label>
                    <div className="flex">
                      <div className="flex items-center justify-center px-3 bg-gray-700/50 border border-r-0 border-gray-600 rounded-l-xl text-gray-300">
                        {formData.countryCode}
                      </div>
                      <div className="relative flex-1">
                        <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border rounded-r-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                            errors.phone 
                              ? 'border-red-500 focus:ring-red-500/50' 
                              : 'border-gray-600 focus:border-orange-500 focus:ring-orange-500/50'
                          }`}
                          placeholder={currentT.phonePlaceholder}
                          maxLength={15}
                        />
                      </div>
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-400">{errors.phone}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-400">{currentT.smsInfo}</p>
                  </div>

                  <button
                    type="button"
                    onClick={sendOtpCode}
                    disabled={otpLoading || !formData.phone}
                    className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-bold py-3 px-4 rounded-xl transition-all"
                  >
                    {otpLoading ? currentT.sending : currentT.sendOtp}
                  </button>
                </div>
              )}

              {/* Step 2 - OTP Verification */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <label htmlFor="otpCode" className="block text-sm font-medium text-gray-300 mb-2">
                      {currentT.otpCodeLabel}
                    </label>
                    <input
                      id="otpCode"
                      name="otpCode"
                      type="text"
                      value={formData.otpCode}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-gray-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all text-center text-2xl font-mono tracking-widest ${
                        errors.otpCode 
                          ? 'border-red-500 focus:ring-red-500/50' 
                          : 'border-gray-600 focus:border-orange-500 focus:ring-orange-500/50'
                      }`}
                      placeholder={currentT.otpPlaceholder}
                      maxLength={6}
                    />
                    {errors.otpCode && (
                      <p className="mt-1 text-sm text-red-400">{errors.otpCode}</p>
                    )}
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-blue-200 mb-3">{currentT.otpSent}</p>
                    {resendTimer > 0 ? (
                      <p className="text-xs text-gray-400">
                        {currentT.resendOtp} {Math.floor(resendTimer / 60)}:{(resendTimer % 60).toString().padStart(2, '0')}
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={sendOtpCode}
                        disabled={otpLoading}
                        className="text-sm text-orange-400 hover:text-orange-300 transition-colors underline"
                      >
                        {currentT.resendOtpReady}
                      </button>
                    )}
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                    <p className="text-blue-400 text-sm">
                      <strong>💡 {language === 'pt' ? 'Dica' : 'Tip'}:</strong> {currentT.demoCode}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-xl transition-all"
                    >
                      {currentT.back}
                    </button>
                    <button
                      type="button"
                      onClick={verifyOtpCode}
                      disabled={otpLoading || formData.otpCode.length !== 6}
                      className="flex-2 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-bold py-3 px-4 rounded-xl transition-all"
                    >
                      {otpLoading ? currentT.verifying : currentT.verifyOtp}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3 - New Password */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-2">
                      {currentT.newPasswordLabel}
                    </label>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        id="newPassword"
                        name="newPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-12 py-3 bg-gray-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                          errors.newPassword 
                            ? 'border-red-500 focus:ring-red-500/50' 
                            : 'border-gray-600 focus:border-orange-500 focus:ring-orange-500/50'
                        }`}
                        placeholder={currentT.newPasswordPlaceholder}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {errors.newPassword && (
                      <p className="mt-1 text-sm text-red-400">{errors.newPassword}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                      {currentT.confirmPasswordLabel}
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
                        placeholder={currentT.confirmPasswordPlaceholder}
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

                  {/* Password Strength */}
                  {formData.newPassword && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">{currentT.passwordStrength}</span>
                        <span className={`text-sm font-medium ${
                          getPasswordStrength(formData.newPassword) === currentT.strong ? 'text-green-400' :
                          getPasswordStrength(formData.newPassword) === currentT.medium ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {getPasswordStrength(formData.newPassword)}
                        </span>
                      </div>
                      <div className="flex space-x-1">
                        <div className={`h-2 rounded-full flex-1 ${
                          formData.newPassword.length >= 1 ? 'bg-red-500' : 'bg-gray-600'
                        }`}></div>
                        <div className={`h-2 rounded-full flex-1 ${
                          formData.newPassword.length >= 6 ? 'bg-yellow-500' : 'bg-gray-600'
                        }`}></div>
                        <div className={`h-2 rounded-full flex-1 ${
                          formData.newPassword.length >= 8 && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-600'
                        }`}></div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-xl transition-all"
                    >
                      {currentT.back}
                    </button>
                    <button
                      type="button"
                      onClick={resetPassword}
                      disabled={loading || !formData.newPassword || !formData.confirmPassword}
                      className="flex-2 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-bold py-3 px-4 rounded-xl transition-all"
                    >
                      {loading ? currentT.redefining : currentT.redefinePassword}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4 - Success */}
              {step === 4 && (
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                    <FaCheck className="text-green-400 text-3xl" />
                  </div>
                  
                  <Link href="/auth/login-new">
                    <button className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 text-black font-bold py-3 px-4 rounded-xl transition-all">
                      {currentT.loginNow}
                    </button>
                  </Link>
                </div>
              )}

              {/* Sign In Link - only show in step 1 */}
              {step === 1 && (
                <div className="mt-6 text-center">
                  <p className="text-gray-400 text-sm">
                    {language === 'pt' ? 'Lembrou da senha?' : 'Remember your password?'}{' '}
                    <Link
                      href="/auth/login-new"
                      className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
                    >
                      {language === 'pt' ? 'Entrar' : 'Sign In'}
                    </Link>
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;
