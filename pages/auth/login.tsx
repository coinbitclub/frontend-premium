import React, { useState, useEffect, useCallback } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaArrowLeft, FaGlobe, FaShieldAlt } from 'react-icons/fa';
import { useLanguage } from '../../hooks/useLanguage';
import { useAuth } from '../../src/contexts/AuthContext';
// Authentication removed - PublicRoute disabled

const IS_DEV = process.env.NODE_ENV === 'development';

const LoginPage: NextPage = () => {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const { login } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    twoFactorCode: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  // ALL HOOKS MUST BE DEFINED BEFORE ANY EARLY RETURNS
  const handleLanguageChange = useCallback((lang: 'pt' | 'en') => {
    IS_DEV && console.log('Login page - Button clicked for language:', lang);
    IS_DEV && console.log('Current language state:', language);
    IS_DEV && console.log('setLanguage function available:', !!setLanguage);
    
    if (setLanguage && typeof setLanguage === 'function') {
      setLanguage(lang);
      IS_DEV && console.log('Language change function called with:', lang);
      
      // Force re-render by checking state after a small delay
      setTimeout(() => {
        IS_DEV && console.log('Language after change:', language);
      }, 100);
    } else {
      console.error('setLanguage function not available:', setLanguage);
    }
  }, [language, setLanguage]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.email) {
      newErrors.email = language === 'pt' ? 'Email é obrigatório' : 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = language === 'pt' ? 'Email inválido' : 'Invalid email';
    }

    if (!formData.password) {
      newErrors.password = language === 'pt' ? 'Senha é obrigatória' : 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = language === 'pt' ? 'Senha deve ter pelo menos 6 caracteres' : 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.email, formData.password, language]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});
    
    try {
      await login(formData.email, formData.password, formData.twoFactorCode);

      // Login successful - redirect to dashboard
      IS_DEV && console.log('✅ Login successful, redirecting to dashboard...');
      
      // Manual redirect since authentication routes are disabled
      router.push('/user/dashboard');

    } catch (error: any) {
      if (error.message === '2FA_REQUIRED') {
        setShowTwoFactor(true);
        setErrors({ twoFactor: language === 'pt' ? 'Código 2FA necessário' : '2FA code required' });
      } else {
        setErrors({ 
          general: error.message || (language === 'pt' ? 'Credenciais inválidas. Tente novamente.' : 'Invalid credentials. Please try again.') 
        });
      }
    } finally {
      setLoading(false);
    }
  }, [validateForm, login, formData.email, formData.password, formData.twoFactorCode, language, router]);

  // Early return AFTER all hooks are defined
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-black font-bold text-xl">C</span>
          </div>
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>
          {language === 'pt' ? 'Login - CoinBitClub MarketBot' : 'Login - CoinBitClub MarketBot'}
        </title>
        <meta 
          name="description" 
          content={language === 'pt' 
            ? 'Faça login em sua conta CoinBitClub MarketBot' 
            : 'Login to your CoinBitClub MarketBot account'
          } 
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-x-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-yellow-500/10 overflow-hidden"></div>
        <div className="absolute left-1/4 top-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute right-1/4 bottom-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-yellow-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="relative flex min-h-screen items-center justify-center px-4 py-8 sm:p-8">
          {/* Back to Home Button */}
          <Link
            href="/home"
            className="absolute top-4 left-4 sm:top-8 sm:left-8 flex items-center gap-2 text-gray-400 hover:text-orange-400 transition-colors text-sm sm:text-base"
          >
            <FaArrowLeft />
            {language === 'pt' ? 'Voltar ao Início' : 'Back to Home'}
          </Link>

          {/* Language Selector */}
          <div className="absolute top-4 right-4 sm:top-8 sm:right-8 flex items-center gap-2">
            <FaGlobe className="text-gray-400 text-sm sm:text-base" />
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

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md relative z-10"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-700/30">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center">
                    <span className="text-black font-bold text-xl">C</span>
                  </div>
                  <span className="text-xl sm:text-2xl font-bold text-white">CoinBitClub</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  {language === 'pt' ? 'Bem-vindo de volta!' : 'Welcome back!'}
                </h1>
                <p className="text-gray-400">
                  {language === 'pt' ? 'Faça login para acessar sua conta' : 'Sign in to access your account'}
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {errors.general && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
                    {errors.general}
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      autoComplete="email"
                      className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                        errors.email
                          ? 'border-red-500 focus:ring-red-500/50'
                          : 'border-gray-600 focus:border-orange-500 focus:ring-orange-500/50'
                      }`}
                      placeholder={language === 'pt' ? 'seu@email.com' : 'your@email.com'}
                      disabled={loading}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                    {language === 'pt' ? 'Senha' : 'Password'}
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      autoComplete="current-password"
                      className={`w-full pl-10 pr-12 py-3 bg-gray-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                        errors.password
                          ? 'border-red-500 focus:ring-red-500/50'
                          : 'border-gray-600 focus:border-orange-500 focus:ring-orange-500/50'
                      }`}
                      placeholder={language === 'pt' ? 'Sua senha' : 'Your password'}
                      disabled={loading}
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

                {/* 2FA Code Field */}
                {showTwoFactor && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    <label htmlFor="twoFactorCode" className="block text-sm font-medium text-gray-300 mb-2">
                      {language === 'pt' ? 'Código 2FA' : '2FA Code'}
                    </label>
                    <div className="relative">
                      <FaShieldAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        id="twoFactorCode"
                        name="twoFactorCode"
                        type="text"
                        value={formData.twoFactorCode}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                          errors.twoFactor 
                            ? 'border-red-500 focus:ring-red-500/50' 
                            : 'border-gray-600 focus:border-orange-500 focus:ring-orange-500/50'
                        }`}
                        placeholder={language === 'pt' ? 'Digite o código 2FA' : 'Enter 2FA code'}
                        disabled={loading}
                        maxLength={6}
                      />
                    </div>
                    {errors.twoFactor && (
                      <p className="mt-1 text-sm text-red-400">{errors.twoFactor}</p>
                    )}
                  </motion.div>
                )}

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-orange-500 bg-gray-700 border-gray-600 rounded focus:ring-orange-500 focus:ring-2"
                      disabled={loading}
                    />
                    <span className="ml-2 text-sm text-gray-300">
                      {language === 'pt' ? 'Lembrar de mim' : 'Remember me'}
                    </span>
                  </label>
                  <Link
                    href="/auth/esqueci-senha"
                    className="text-sm text-orange-400 hover:text-orange-300 transition-colors"
                  >
                    {language === 'pt' ? 'Esqueceu a senha?' : 'Forgot password?'}
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-xl font-semibold text-lg transition-all ${
                    loading
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin mr-2"></div>
                      {language === 'pt' ? 'Entrando...' : 'Signing in...'}
                    </div>
                  ) : (
                    language === 'pt' ? 'Entrar' : 'Sign In'
                  )}
                </button>
              </form>

              {/* Register Link */}
              <div className="mt-6 text-center">
                <p className="text-gray-400">
                  {language === 'pt' ? 'Não tem uma conta?' : "Don't have an account?"}{' '}
                  <Link
                    href="/cadastro-new"
                    className="text-orange-400 hover:text-orange-300 font-semibold transition-colors"
                  >
                    {language === 'pt' ? 'Cadastre-se agora' : 'Sign up now'}
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

export default LoginPage;
