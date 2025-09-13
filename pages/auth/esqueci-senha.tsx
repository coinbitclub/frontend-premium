import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FaPhone, FaArrowLeft, FaCheckCircle, FaLock, FaEye, FaEyeSlash, FaGlobe, FaCheck } from 'react-icons/fa';
import { useLanguage } from '../../hooks/useLanguage';

const EsqueciSenhaPage: NextPage = () => {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();

  // Estados do componente
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1); // 1: telefone, 2: OTP, 3: nova senha, 4: sucesso
  const [loading, setLoading] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(0);
  const [formData, setFormData] = useState({
    telefone: '',
    codigoPais: '+55',
    pais: 'Brasil',
    codigoOtp: '',
    novaSenha: '',
    confirmarSenha: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLanguageChange = (lang: 'pt' | 'en') => {
    console.log('Esqueci senha page - Button clicked for language:', lang);
    if (setLanguage && typeof setLanguage === 'function') {
      setLanguage(lang);
    } else {
      console.error('setLanguage function not available');
    }
  };

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

  // Lista de países disponíveis - Brasil, EUA, China + top 7 países que mais operam com criptomoedas
  const paisesDisponiveis = [
    { codigo: '+55', nome: 'Brasil', bandeira: '🇧🇷' },
    { codigo: '+1', nome: 'Estados Unidos', bandeira: '🇺🇸' },
    { codigo: '+86', nome: 'China', bandeira: '🇨🇳' },
    { codigo: '+91', nome: 'Índia', bandeira: '🇮🇳' },
    { codigo: '+44', nome: 'Reino Unido', bandeira: '🇬🇧' },
    { codigo: '+49', nome: 'Alemanha', bandeira: '🇩🇪' },
    { codigo: '+81', nome: 'Japão', bandeira: '🇯🇵' },
    { codigo: '+82', nome: 'Coreia do Sul', bandeira: '🇰🇷' },
    { codigo: '+33', nome: 'França', bandeira: '🇫🇷' },
    { codigo: '+65', nome: 'Singapura', bandeira: '🇸🇬' }
  ];

  // Função para formatar telefone
  const formatarTelefone = (telefone: string) => {
    const apenasNumeros = telefone.replace(/\D/g, '');
    if (apenasNumeros.length <= 10) {
      return apenasNumeros.replace(/(\d{2})(\d{4})(\d{4})/, '$1 $2-$3');
    } else {
      return apenasNumeros.replace(/(\d{2})(\d{5})(\d{4})/, '$1 $2-$3');
    }
  };

  // Função para calcular força da senha
  const calcularForcaSenha = (senha: string): string => {
    if (senha.length < 6) return 'Fraca';
    if (senha.length >= 8 && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(senha)) return 'Forte';
    return 'Média';
  };

  // Função para lidar com mudanças nos inputs
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Timer para reenvio de código
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (tempoRestante > 0) {
      interval = setInterval(() => {
        setTempoRestante(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [tempoRestante]);

  // Função para enviar código OTP
  const enviarCodigoOtp = async () => {
    setLoadingOtp(true);
    setErrors({});

    // Validações
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.telefone) {
      newErrors.telefone = 'Telefone é obrigatório';
    } else if (formData.telefone.length < 10) {
      newErrors.telefone = 'Telefone deve ter pelo menos 10 dígitos';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoadingOtp(false);
      return;
    }

    try {
      // Simular envio do código
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Aqui você faria a chamada real para enviar o SMS
      console.log('Enviando SMS para:', formData.codigoPais + formData.telefone);
      
      setStep(2);
      setTempoRestante(300); // 5 minutos
      setErrors({});
      
    } catch (error) {
      console.error('Erro ao enviar código:', error);
      setErrors({ general: 'Erro ao enviar código. Tente novamente.' });
    } finally {
      setLoadingOtp(false);
    }
  };

  // Função para reenviar código OTP
  const reenviarCodigoOtp = async () => {
    setLoadingOtp(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setTempoRestante(300);
      setErrors({});
    } catch (error) {
      setErrors({ general: 'Erro ao reenviar código' });
    } finally {
      setLoadingOtp(false);
    }
  };

  // Função para verificar código OTP
  const verificarCodigoOtp = async () => {
    setLoadingOtp(true);
    setErrors({});

    // Validação
    if (!formData.codigoOtp || formData.codigoOtp.length !== 6) {
      setErrors({ codigoOtp: 'Código deve ter 6 dígitos' });
      setLoadingOtp(false);
      return;
    }

    try {
      // Simular verificação (aceita 123456 para demonstração)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (formData.codigoOtp === '123456') {
        setStep(3);
        setErrors({});
      } else {
        setErrors({ otp: 'Código inválido. Use 123456 para demonstração.' });
      }
      
    } catch (error) {
      console.error('Erro ao verificar código:', error);
      setErrors({ general: 'Erro ao verificar código. Tente novamente.' });
    } finally {
      setLoadingOtp(false);
    }
  };

  // Função para redefinir senha
  const redefinirSenha = async () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.novaSenha) {
      newErrors.novaSenha = 'Nova senha é obrigatória';
    } else if (formData.novaSenha.length < 6) {
      newErrors.novaSenha = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (!formData.confirmarSenha) {
      newErrors.confirmarSenha = 'Confirmação de senha é obrigatória';
    } else if (formData.novaSenha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = 'Senhas não coincidem';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      // Simular redefinição da senha
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Aqui você faria a chamada real para redefinir a senha
      const response = await fetch('/api/auth/redefinir-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telefone: formData.telefone,
          codigoPais: formData.codigoPais,
          novaSenha: formData.novaSenha
        })
      });
      
      if (response.ok) {
        setStep(4); // Sucesso
        setErrors({});
      } else {
        const data = await response.json();
        setErrors({ general: data.message || 'Erro ao redefinir senha' });
      }
      
    } catch (error) {
      setErrors({ general: 'Erro ao redefinir senha. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>
          {language === 'pt' ? 'Esqueci minha senha - CoinBitClub' : 'Forgot Password - CoinBitClub'}
        </title>
        <meta 
          name="description" 
          content={
            language === 'pt' 
              ? 'Redefina sua senha do CoinBitClub' 
              : 'Reset your CoinBitClub password'
          } 
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-x-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-yellow-500/10"></div>
        <div className="absolute left-1/4 top-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute right-1/4 bottom-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="relative flex min-h-screen items-center justify-center px-4 py-8 sm:p-8">
          {/* Back to Login Button */}
          <Link
            href="/auth/login"
            className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-orange-400 transition-colors"
          >
            <FaArrowLeft />
            Voltar ao Login
          </Link>

          {/* Forgot Password Card */}
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
                  <span className="text-2xl font-bold text-white">CoinBitClub</span>
                </div>

                {/* Indicadores de Passos para steps 1-3 */}
                {step <= 3 && (
                  <div className="flex justify-center items-center space-x-4 mb-6">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                        step >= 1 ? 'bg-orange-500 text-black' : 'bg-gray-600 text-gray-400'
                      }`}>
                        1
                      </div>
                      <span className="ml-2 text-sm text-gray-400 hidden sm:block">Telefone</span>
                    </div>
                    
                    <div className={`w-8 h-1 rounded-full transition-all ${
                      step >= 2 ? 'bg-orange-500' : 'bg-gray-600'
                    }`}></div>
                    
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                        step >= 2 ? 'bg-orange-500 text-black' : 'bg-gray-600 text-gray-400'
                      }`}>
                        2
                      </div>
                      <span className="ml-2 text-sm text-gray-400 hidden sm:block">Código</span>
                    </div>
                    
                    <div className={`w-8 h-1 rounded-full transition-all ${
                      step >= 3 ? 'bg-orange-500' : 'bg-gray-600'
                    }`}></div>
                    
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                        step >= 3 ? 'bg-orange-500 text-black' : 'bg-gray-600 text-gray-400'
                      }`}>
                        3
                      </div>
                      <span className="ml-2 text-sm text-gray-400 hidden sm:block">Nova Senha</span>
                    </div>
                  </div>
                )}
                
                {step === 1 && (
                  <>
                    <h1 className="text-3xl font-bold text-white mb-2">Esqueci minha senha</h1>
                    <p className="text-gray-400">Digite seu número de telefone para receber um código de verificação</p>
                  </>
                )}
                
                {step === 2 && (
                  <>
                    <h1 className="text-3xl font-bold text-white mb-2">Verificação SMS</h1>
                    <p className="text-gray-400 mb-4">Enviamos um código de 6 dígitos para</p>
                    <p className="text-orange-400 font-medium">
                      {formData.codigoPais} {formatarTelefone(formData.telefone)}
                    </p>
                  </>
                )}
                
                {step === 3 && (
                  <>
                    <h1 className="text-3xl font-bold text-white mb-2">Nova senha</h1>
                    <p className="text-gray-400">Defina uma nova senha para sua conta</p>
                  </>
                )}
                
                {step === 4 && (
                  <>
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaCheck className="text-green-400 text-2xl" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Senha redefinida!</h1>
                    <p className="text-gray-400">Sua senha foi redefinida com sucesso. Agora você pode fazer login com sua nova senha.</p>
                  </>
                )}
              </div>

              {/* Step 1 - Informar Telefone */}
              {step === 1 && (
                <form onSubmit={(e) => { e.preventDefault(); enviarCodigoOtp(); }} className="space-y-6">
                  {errors.general && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
                      {errors.general}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      País *
                    </label>
                    <div className="relative">
                      <FaGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <select
                        value={formData.codigoPais}
                        onChange={(e) => {
                          const paisSelecionado = paisesDisponiveis.find(p => p.codigo === e.target.value);
                          handleInputChange('codigoPais', e.target.value);
                          handleInputChange('pais', paisSelecionado?.nome || '');
                        }}
                        className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all appearance-none"
                      >
                        {paisesDisponiveis.map((pais) => (
                          <option key={pais.codigo} value={pais.codigo} className="bg-gray-700">
                            {pais.bandeira} {pais.nome} ({pais.codigo})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Número de telefone *
                    </label>
                    <div className="relative">
                      <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <div className="flex">
                        <div className="flex items-center justify-center px-3 bg-gray-700/50 border border-r-0 border-gray-600 rounded-l-xl text-gray-300">
                          {formData.codigoPais}
                        </div>
                        <input
                          type="tel"
                          placeholder="21 98765-4321"
                          value={formatarTelefone(formData.telefone)}
                          onChange={(e) => {
                            const valor = e.target.value.replace(/\D/g, '');
                            handleInputChange('telefone', valor);
                          }}
                          className={`flex-1 pl-3 pr-4 py-3 bg-gray-700/50 border rounded-r-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                            errors.telefone 
                              ? 'border-red-500 focus:ring-red-500/50' 
                              : 'border-gray-600 focus:border-orange-500 focus:ring-orange-500/50'
                          }`}
                          maxLength={15}
                          disabled={loadingOtp}
                        />
                      </div>
                    </div>
                    {errors.telefone && (
                      <p className="mt-1 text-sm text-red-400">{errors.telefone}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <button
                      type="submit"
                      disabled={loadingOtp}
                      className={`w-full py-3 px-4 rounded-xl font-semibold text-lg transition-all ${
                        loadingOtp
                          ? 'bg-gray-600 cursor-not-allowed'
                          : 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black'
                      }`}
                    >
                      {loadingOtp ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin mr-2"></div>
                          Enviando código...
                        </div>
                      ) : (
                        'Enviar código SMS'
                      )}
                    </button>

                    <Link href="/auth/login">
                      <button
                        type="button"
                        className="w-full border border-gray-600 text-gray-300 py-3 px-4 rounded-xl hover:bg-gray-700/50 transition-all"
                      >
                        ← Voltar para login
                      </button>
                    </Link>
                  </div>
                </form>
              )}

              {/* Step 2 - Verificação OTP */}
              {step === 2 && (
                <form onSubmit={(e) => { e.preventDefault(); verificarCodigoOtp(); }} className="space-y-6">
                  {errors.general && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
                      {errors.general}
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div className="text-gray-300 mb-4">
                      Enviamos um código de verificação para:
                    </div>
                    <div className="text-orange-400 font-semibold">
                      {formData.codigoPais} {formatarTelefone(formData.telefone)}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Código de verificação *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="000000"
                        value={formData.codigoOtp}
                        onChange={(e) => {
                          const valor = e.target.value.replace(/\D/g, '').slice(0, 6);
                          handleInputChange('codigoOtp', valor);
                        }}
                        className={`w-full px-4 py-3 bg-gray-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all text-center text-2xl font-mono tracking-widest ${
                          errors.codigoOtp 
                            ? 'border-red-500 focus:ring-red-500/50' 
                            : 'border-gray-600 focus:border-orange-500 focus:ring-orange-500/50'
                        }`}
                        maxLength={6}
                        disabled={loading || loadingOtp}
                      />
                    </div>
                    {errors.codigoOtp && (
                      <p className="mt-1 text-sm text-red-400">{errors.codigoOtp}</p>
                    )}
                    {errors.otp && (
                      <p className="mt-1 text-sm text-red-400">{errors.otp}</p>
                    )}
                  </div>

                  <div className="text-center">
                    {tempoRestante > 0 ? (
                      <p className="text-gray-400 text-sm">
                        Reenviar código em {Math.floor(tempoRestante / 60)}:{(tempoRestante % 60).toString().padStart(2, '0')}
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={reenviarCodigoOtp}
                        disabled={loadingOtp}
                        className="text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors disabled:opacity-50"
                      >
                        {loadingOtp ? 'Reenviando...' : 'Reenviar código'}
                      </button>
                    )}
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                    <p className="text-blue-400 text-sm">
                      <strong>💡 Dica:</strong> Para demonstração, use o código <strong>123456</strong>
                    </p>
                  </div>

                  <div className="space-y-3">
                    <button
                      type="submit"
                      disabled={loadingOtp || formData.codigoOtp.length !== 6}
                      className={`w-full py-3 px-4 rounded-xl font-semibold text-lg transition-all ${
                        loadingOtp || formData.codigoOtp.length !== 6
                          ? 'bg-gray-600 cursor-not-allowed'
                          : 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black'
                      }`}
                    >
                      {loadingOtp ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin mr-2"></div>
                          Verificando...
                        </div>
                      ) : (
                        'Verificar código'
                      )}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-full border border-gray-600 text-gray-300 py-3 px-4 rounded-xl hover:bg-gray-700/50 transition-all"
                    >
                      ← Voltar
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3 - Nova Senha */}
              {step === 3 && (
                <form onSubmit={(e) => { e.preventDefault(); redefinirSenha(); }} className="space-y-6">
                  {errors.general && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
                      {errors.general}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nova senha *
                    </label>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Mínimo 6 caracteres"
                        value={formData.novaSenha}
                        onChange={(e) => handleInputChange('novaSenha', e.target.value)}
                        className={`w-full pl-10 pr-12 py-3 bg-gray-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                          errors.novaSenha 
                            ? 'border-red-500 focus:ring-red-500/50' 
                            : 'border-gray-600 focus:border-orange-500 focus:ring-orange-500/50'
                        }`}
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {errors.novaSenha && (
                      <p className="mt-1 text-sm text-red-400">{errors.novaSenha}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Confirmar nova senha *
                    </label>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Repita a nova senha"
                        value={formData.confirmarSenha}
                        onChange={(e) => handleInputChange('confirmarSenha', e.target.value)}
                        className={`w-full pl-10 pr-12 py-3 bg-gray-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                          errors.confirmarSenha 
                            ? 'border-red-500 focus:ring-red-500/50' 
                            : 'border-gray-600 focus:border-orange-500 focus:ring-orange-500/50'
                        }`}
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {errors.confirmarSenha && (
                      <p className="mt-1 text-sm text-red-400">{errors.confirmarSenha}</p>
                    )}
                  </div>

                  {/* Força da senha */}
                  {formData.novaSenha && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Força da senha:</span>
                        <span className={`text-sm font-medium ${
                          calcularForcaSenha(formData.novaSenha) === 'Forte' ? 'text-green-400' :
                          calcularForcaSenha(formData.novaSenha) === 'Média' ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {calcularForcaSenha(formData.novaSenha)}
                        </span>
                      </div>
                      <div className="flex space-x-1">
                        <div className={`h-2 rounded-full flex-1 ${
                          formData.novaSenha.length >= 1 ? 'bg-red-500' : 'bg-gray-600'
                        }`}></div>
                        <div className={`h-2 rounded-full flex-1 ${
                          formData.novaSenha.length >= 6 ? 'bg-yellow-500' : 'bg-gray-600'
                        }`}></div>
                        <div className={`h-2 rounded-full flex-1 ${
                          formData.novaSenha.length >= 8 && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.novaSenha) ? 'bg-green-500' : 'bg-gray-600'
                        }`}></div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <button
                      type="submit"
                      disabled={loading || !formData.novaSenha || !formData.confirmarSenha}
                      className={`w-full py-3 px-4 rounded-xl font-semibold text-lg transition-all ${
                        loading || !formData.novaSenha || !formData.confirmarSenha
                          ? 'bg-gray-600 cursor-not-allowed'
                          : 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black'
                      }`}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin mr-2"></div>
                          Redefinindo senha...
                        </div>
                      ) : (
                        'Redefinir senha'
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="w-full border border-gray-600 text-gray-300 py-3 px-4 rounded-xl hover:bg-gray-700/50 transition-all"
                    >
                      ← Voltar
                    </button>
                  </div>
                </form>
              )}

              {/* Step 4 - Sucesso */}
              {step === 4 && (
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                    <FaCheck className="text-green-400 text-3xl" />
                  </div>
                  
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Senha redefinida!</h1>
                    <p className="text-gray-400">
                      Sua senha foi redefinida com sucesso. Agora você pode fazer login com sua nova senha.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Link href="/auth/login">
                      <button className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black py-3 px-4 rounded-xl font-semibold text-lg transition-all">
                        Fazer login agora
                      </button>
                    </Link>
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default EsqueciSenhaPage;
