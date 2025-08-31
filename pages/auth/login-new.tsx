import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaArrowLeft, FaGlobe } from 'react-icons/fa';

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const LoginPage: NextPage = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [language, setLanguageState] = useState<'pt' | 'en'>('pt');
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    setMounted(true);
    
    // Analytics - track login page view
    if (typeof gtag !== 'undefined') {
      gtag('event', 'login_page_view', {
        page_title: 'Login',
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

  // Textos por idioma
  const texts = {
    pt: {
      title: 'Entrar na Conta',
      subtitle: 'Acesse sua conta CoinBitClub',
      emailLabel: 'Email',
      emailPlaceholder: 'seu@email.com',
      passwordLabel: 'Senha',
      passwordPlaceholder: 'Sua senha',
      rememberMe: 'Lembrar de mim',
      forgotPassword: 'Esqueceu a senha?',
      loginButton: 'Entrar',
      noAccount: 'Não tem uma conta?',
      signUp: 'Cadastre-se',
      backToHome: 'Voltar ao Início',
      invalidCredentials: 'Credenciais inválidas. Tente novamente.',
      emailRequired: 'Email é obrigatório',
      passwordRequired: 'Senha é obrigatória',
      loading: 'Carregando...'
    },
    en: {
      title: 'Sign In',
      subtitle: 'Access your CoinBitClub account',
      emailLabel: 'Email',
      emailPlaceholder: 'your@email.com',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Your password',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot password?',
      loginButton: 'Sign In',
      noAccount: "Don't have an account?",
      signUp: 'Sign Up',
      backToHome: 'Back to Home',
      invalidCredentials: 'Invalid credentials. Please try again.',
      emailRequired: 'Email is required',
      passwordRequired: 'Password is required',
      loading: 'Loading...'
    }
  };

  const t = texts[language || 'pt'] || texts.pt;

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

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.email) {
      newErrors.email = t.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = t.passwordRequired;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Simular autenticação
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock de autenticação bem-sucedida
      localStorage.setItem('user', JSON.stringify({
        email: formData.email,
        name: 'Usuário Demo',
        type: 'user'
      }));
      
      // Redirecionar para dashboard
      router.push('/dashboard');
    } catch (error) {
      setErrors({ general: t.invalidCredentials });
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

        <div className="relative flex min-h-screen items-center justify-center p-8">
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

          {/* Login Card */}
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
                <h1 className="text-3xl font-bold text-white mb-2">{t.title}</h1>
                <p className="text-gray-400">{t.subtitle}</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    {t.emailLabel}
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      name="rememberMe"
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-orange-500 bg-gray-700 border-gray-600 rounded focus:ring-orange-500 focus:ring-2"
                    />
                    <span className="ml-2 text-sm text-gray-300">{t.rememberMe}</span>
                  </label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-orange-400 hover:text-orange-300 transition-colors"
                  >
                    {t.forgotPassword}
                  </Link>
                </div>

                {/* Error Message */}
                {errors.general && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <p className="text-red-400 text-sm">{errors.general}</p>
                  </div>
                )}

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 text-black font-bold py-3 px-4 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? t.loading : t.loginButton}
                </motion.button>
              </form>

              {/* Sign Up Link */}
              <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                  {t.noAccount}{' '}
                  <Link
                    href="/auth/register-new"
                    className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
                  >
                    {t.signUp}
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
