import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaLock, FaEye, FaEyeSlash, FaArrowLeft, FaCheck } from 'react-icons/fa';

const ResetPasswordPage: NextPage = () => {
  const router = useRouter();
  const { token } = router.query;
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    setMounted(true);
    
    // Verificar se o token é válido
    if (!token) {
      router.push('/auth/esqueci-senha');
    }
  }, [token, router]);

  if (!mounted) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.password) {
      newErrors.password = 'Nova senha é obrigatória';
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      // Simular redefinição de senha
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
    } catch (error) {
      setErrors({ general: 'Erro ao redefinir senha. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    return strength;
  };

  const getStrengthColor = (strength: number) => {
    if (strength <= 2) return 'bg-red-500';
    if (strength <= 3) return 'bg-yellow-500';
    if (strength <= 4) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const getStrengthText = (strength: number) => {
    if (strength <= 2) return 'Fraca';
    if (strength <= 3) return 'Moderada';
    if (strength <= 4) return 'Forte';
    return 'Muito Forte';
  };

  return (
    <>
      <Head>
        <title>Redefinir Senha - CoinBitClub MarketBot</title>
        <meta name="description" content="Redefina sua senha do CoinBitClub MarketBot" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10"></div>
        <div className="absolute left-1/4 top-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute right-1/4 bottom-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="relative flex min-h-screen items-center justify-center px-4 py-8 sm:p-8">
          {/* Card Principal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md relative z-10"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-700/30">
              {success ? (
                /* Success State */
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <div className="mb-6 flex justify-center">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                      <FaCheck className="text-3xl text-green-400" />
                    </div>
                  </div>
                  <h1 className="text-2xl font-bold text-white mb-4">
                    Senha Redefinida!
                  </h1>
                  <p className="text-gray-300 mb-8">
                    Sua senha foi redefinida com sucesso. Agora você pode fazer login com sua nova senha.
                  </p>
                  <Link
                    href="/auth/login"
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold px-6 py-3 rounded-xl transition-all"
                  >
                    Fazer Login
                  </Link>
                </motion.div>
              ) : (
                /* Form State */
                <>
                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className="mb-4 flex justify-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <FaShieldAlt className="text-2xl text-white" />
                      </div>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">
                      Redefinir Senha
                    </h1>
                    <p className="text-gray-400">
                      Digite sua nova senha abaixo
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {errors.general && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
                        {errors.general}
                      </div>
                    )}

                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                        Nova Senha
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
                              : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500/50'
                          }`}
                          placeholder="Digite sua nova senha"
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

                      {/* Password Strength Indicator */}
                      {formData.password && (
                        <div className="mt-2">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-gray-400">Força da senha:</span>
                            <span className={`text-xs font-medium ${
                              getPasswordStrength() <= 2 ? 'text-red-400' :
                              getPasswordStrength() <= 3 ? 'text-yellow-400' :
                              getPasswordStrength() <= 4 ? 'text-orange-400' : 'text-green-400'
                            }`}>
                              {getStrengthText(getPasswordStrength())}
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(getPasswordStrength())}`}
                              style={{ width: `${(getPasswordStrength() / 5) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {errors.password && (
                        <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                        Confirmar Nova Senha
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
                              : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500/50'
                          }`}
                          placeholder="Confirme sua nova senha"
                          disabled={loading}
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

                    <button
                      type="submit"
                      disabled={loading || !formData.password || !formData.confirmPassword}
                      className={`w-full py-3 px-4 rounded-xl font-semibold text-lg transition-all ${
                        loading || !formData.password || !formData.confirmPassword
                          ? 'bg-gray-600 cursor-not-allowed text-gray-300'
                          : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
                      }`}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin mr-2"></div>
                          Redefinindo...
                        </div>
                      ) : (
                        'Redefinir Senha'
                      )}
                    </button>

                    <div className="text-center">
                      <Link
                        href="/auth/login"
                        className="inline-flex items-center text-sm text-gray-400 transition-colors hover:text-blue-400"
                      >
                        <FaArrowLeft className="mr-1 text-xs" />
                        Voltar ao Login
                      </Link>
                    </div>
                  </form>
                </>
              )}
            </div>

            {/* Security Notice */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                <FaShieldAlt className="inline mr-1" />
                Suas informações estão protegidas com criptografia de ponta
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordPage;
