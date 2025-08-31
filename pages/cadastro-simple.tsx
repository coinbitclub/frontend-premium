import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaGlobe, FaUsers, FaTicketAlt, FaLock, FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';

const CadastroSimplePage: NextPage = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    telefone: '',
    codigoPais: '+55',
    pais: 'Brasil',
    codigoAfiliado: '',
    cupomDesconto: '',
    senha: '',
    confirmarSenha: '',
    codigoOtp: ''
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Não renderiza nada até estar montado para evitar hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-white/70">Carregando cadastro...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Cadastro - CoinBitClub MarketBot</title>
        <meta name="description" content="Crie sua conta CoinBitClub" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        {/* Header simples */}
        <div className="flex justify-between items-center p-6">
          <Link href="/home" className="text-white hover:text-purple-400 transition-colors">
            <FaArrowLeft className="text-xl" />
          </Link>
          <h1 className="text-white text-xl font-bold">Cadastro CoinBitClub</h1>
          <div></div>
        </div>

        {/* Conteúdo principal */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Criar Conta
                </h2>
                <p className="text-gray-400">
                  Preencha os dados para começar
                </p>
              </div>

              {/* Etapa 1 - Dados pessoais */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nome Completo
                    </label>
                    <div className="relative">
                      <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                        placeholder="Digite seu nome completo"
                        value={formData.nome}
                        onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Telefone/WhatsApp
                    </label>
                    <div className="flex space-x-2">
                      <select 
                        className="w-24 px-3 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                        value={formData.codigoPais}
                        onChange={(e) => setFormData({...formData, codigoPais: e.target.value})}
                      >
                        <option value="+55">🇧🇷 +55</option>
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+34">🇪🇸 +34</option>
                        <option value="+33">🇫🇷 +33</option>
                      </select>
                      <div className="relative flex-1">
                        <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                          placeholder="21 98765-4321"
                          value={formData.telefone}
                          onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep(2)}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
                  >
                    Continuar
                  </motion.button>
                </div>
              )}

              {/* Etapa 2 - Senha */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Senha
                    </label>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        className="w-full pl-10 pr-12 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                        placeholder="Digite sua senha"
                        value={formData.senha}
                        onChange={(e) => setFormData({...formData, senha: e.target.value})}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Confirmar Senha
                    </label>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className="w-full pl-10 pr-12 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                        placeholder="Confirme sua senha"
                        value={formData.confirmarSenha}
                        onChange={(e) => setFormData({...formData, confirmarSenha: e.target.value})}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setStep(1)}
                      className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-all"
                    >
                      Voltar
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setStep(3)}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
                    >
                      Continuar
                    </motion.button>
                  </div>
                </div>
              )}

              {/* Etapa 3 - Verificação */}
              {step === 3 && (
                <div className="space-y-6 text-center">
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
                    <div className="text-green-400 text-4xl mb-4">✅</div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Cadastro Realizado!
                    </h3>
                    <p className="text-gray-400">
                      Sua conta foi criada com sucesso.
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push('/login')}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
                  >
                    Fazer Login
                  </motion.button>
                </div>
              )}
            </motion.div>

            {/* Link para login */}
            <div className="text-center mt-6">
              <p className="text-gray-400">
                Já tem uma conta?{' '}
                <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium">
                  Fazer login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CadastroSimplePage;
