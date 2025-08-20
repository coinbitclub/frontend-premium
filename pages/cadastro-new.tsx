import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaGlobe, FaUsers, FaTicketAlt, FaLock, FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';

const CadastroPage: NextPage = () => {
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
    confirmarSenha: ''
  });
  const [cupomValidado, setCupomValidado] = useState<null | { valido: boolean; desconto?: number; mensagem: string }>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Reset cupom validation se mudar o cupom
    if (field === 'cupomDesconto') {
      setCupomValidado(null);
    }
  };

  const formatarTelefone = (valor: string) => {
    // Remove tudo que não é número
    const apenasNumeros = valor.replace(/\D/g, '');
    
    // Aplica máscara baseada no tamanho
    if (apenasNumeros.length <= 2) {
      return apenasNumeros;
    } else if (apenasNumeros.length <= 10) {
      return apenasNumeros.replace(/(\d{2})(\d{4})(\d{0,4})/, '$1 $2-$3').replace(/-$/, '');
    } else {
      return apenasNumeros.replace(/(\d{2})(\d{5})(\d{0,4})/, '$1 $2-$3').replace(/-$/, '');
    }
  };

  const validarCupom = async () => {
    if (!formData.cupomDesconto.trim()) return;
    
    try {
      // Simular validação de cupom
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Cupons fictícios para demonstração
      const cuponsValidos = {
        'BEMVINDO': { desconto: 10, tipo: 'porcentagem' },
        'PROMO20': { desconto: 20, tipo: 'porcentagem' },
        'DESCONTO50': { desconto: 50, tipo: 'valor' }
      };
      
      const cupom = cuponsValidos[formData.cupomDesconto.toUpperCase() as keyof typeof cuponsValidos];
      
      if (cupom) {
        setCupomValidado({
          valido: true,
          desconto: cupom.desconto,
          mensagem: `Cupom válido! ${cupom.tipo === 'porcentagem' ? cupom.desconto + '% de desconto' : 'R$ ' + cupom.desconto + ' de desconto'}`
        });
      } else {
        setCupomValidado({
          valido: false,
          mensagem: 'Cupom inválido ou expirado'
        });
      }
    } catch (error) {
      setCupomValidado({
        valido: false,
        mensagem: 'Erro ao validar cupom'
      });
    }
  };

  const paisesDisponiveis = [
    { codigo: '+55', flag: '🇧🇷', nome: 'Brasil', pais: 'Brasil' },
    { codigo: '+1', flag: '��', nome: 'Estados Unidos', pais: 'Estados Unidos' },
    { codigo: '+86', flag: '🇨�', nome: 'China', pais: 'China' },
    { codigo: '+91', flag: '��', nome: 'Índia', pais: 'Índia' },
    { codigo: '+44', flag: '��', nome: 'Reino Unido', pais: 'Reino Unido' },
    { codigo: '+49', flag: '��', nome: 'Alemanha', pais: 'Alemanha' },
    { codigo: '+81', flag: '��', nome: 'Japão', pais: 'Japão' },
    { codigo: '+82', flag: '��', nome: 'Coreia do Sul', pais: 'Coreia do Sul' },
    { codigo: '+33', flag: '��', nome: 'França', pais: 'França' },
    { codigo: '+65', flag: '��', nome: 'Singapura', pais: 'Singapura' }
  ];

  const validateStep1 = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }
    if (!formData.sobrenome.trim()) {
      newErrors.sobrenome = 'Sobrenome é obrigatório';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.senha) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (formData.senha.length < 6) {
      newErrors.senha = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (!formData.confirmarSenha) {
      newErrors.confirmarSenha = 'Confirmação de senha é obrigatória';
    } else if (formData.senha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = 'Senhas não coincidem';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);

    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirecionar para dashboard ou login
      router.push('/auth/login');
      
    } catch (err: any) {
      setErrors({ general: 'Erro ao criar conta. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Cadastro - CoinBitClub MarketBot</title>
        <meta name="description" content="Crie sua conta no CoinBitClub e comece a lucrar com trading inteligente" />
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
            Voltar ao Início
          </Link>

          {/* Registration Card */}
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
                <h1 className="text-3xl font-bold text-white mb-2">Crie sua conta</h1>
                <p className="text-gray-400">Comece a lucrar com trading inteligente</p>
                
                {/* Step Indicator */}
                <div className="flex items-center justify-center gap-4 mt-6">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      step >= 1 ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-black' : 'bg-gray-600 text-gray-300'
                    }`}>
                      1
                    </div>
                    <span className="text-sm text-gray-300">Dados</span>
                  </div>
                  
                  <div className="w-8 h-0.5 bg-gray-600"></div>
                  
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      step >= 2 ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-black' : 'bg-gray-600 text-gray-300'
                    }`}>
                      2
                    </div>
                    <span className="text-sm text-gray-300">Senha</span>
                  </div>
                </div>
              </div>

              {/* Formulário Step 1 - Dados */}
              {step === 1 && (
                <form className="space-y-6">
                  {errors.general && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
                      {errors.general}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Nome *
                      </label>
                      <div className="relative">
                        <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Seu nome"
                          value={formData.nome}
                          onChange={(e) => handleInputChange('nome', e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                            errors.nome 
                              ? 'border-red-500 focus:ring-red-500/50' 
                              : 'border-gray-600 focus:border-orange-500 focus:ring-orange-500/50'
                          }`}
                        />
                      </div>
                      {errors.nome && (
                        <p className="mt-1 text-sm text-red-400">{errors.nome}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Sobrenome *
                      </label>
                      <div className="relative">
                        <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Seu sobrenome"
                          value={formData.sobrenome}
                          onChange={(e) => handleInputChange('sobrenome', e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                            errors.sobrenome 
                              ? 'border-red-500 focus:ring-red-500/50' 
                              : 'border-gray-600 focus:border-orange-500 focus:ring-orange-500/50'
                          }`}
                        />
                      </div>
                      {errors.sobrenome && (
                        <p className="mt-1 text-sm text-red-400">{errors.sobrenome}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                          errors.email 
                            ? 'border-red-500 focus:ring-red-500/50' 
                            : 'border-gray-600 focus:border-orange-500 focus:ring-orange-500/50'
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Telefone/WhatsApp *
                    </label>
                    <div className="flex gap-2">
                      <select 
                        value={formData.codigoPais}
                        onChange={(e) => {
                          const paisSelecionado = paisesDisponiveis.find(p => p.codigo === e.target.value);
                          handleInputChange('codigoPais', e.target.value);
                          if (paisSelecionado) {
                            handleInputChange('pais', paisSelecionado.pais);
                          }
                        }}
                        className="px-3 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 min-w-[120px]"
                      >
                        {paisesDisponiveis.map(pais => (
                          <option key={pais.codigo} value={pais.codigo}>
                            {pais.flag} {pais.codigo}
                          </option>
                        ))}
                      </select>
                      <div className="relative flex-1">
                        <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          placeholder="21 98765-4321"
                          value={formatarTelefone(formData.telefone)}
                          onChange={(e) => handleInputChange('telefone', e.target.value.replace(/\D/g, ''))}
                          className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                            errors.telefone 
                              ? 'border-red-500 focus:ring-red-500/50' 
                              : 'border-gray-600 focus:border-orange-500 focus:ring-orange-500/50'
                          }`}
                        />
                      </div>
                    </div>
                    {errors.telefone && (
                      <p className="mt-1 text-sm text-red-400">{errors.telefone}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      Será enviado um SMS de verificação para este número
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      País *
                    </label>
                    <div className="relative">
                      <FaGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <select
                        value={formData.pais}
                        onChange={(e) => {
                          const paisSelecionado = paisesDisponiveis.find(p => p.pais === e.target.value);
                          handleInputChange('pais', e.target.value);
                          if (paisSelecionado) {
                            handleInputChange('codigoPais', paisSelecionado.codigo);
                          }
                        }}
                        className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 appearance-none"
                      >
                        {paisesDisponiveis.map(pais => (
                          <option key={pais.pais} value={pais.pais}>
                            {pais.flag} {pais.nome}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Código do Afiliado (opcional)
                    </label>
                    <div className="relative">
                      <FaUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Código de quem indicou (opcional)"
                        value={formData.codigoAfiliado}
                        onChange={(e) => handleInputChange('codigoAfiliado', e.target.value.toUpperCase())}
                        className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Digite o código do afiliado que indicou você para ganhar benefícios
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Cupom de Desconto (opcional)
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <FaTicketAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Digite seu cupom de desconto"
                          value={formData.cupomDesconto}
                          onChange={(e) => handleInputChange('cupomDesconto', e.target.value.toUpperCase())}
                          className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                        />
                      </div>
                      {formData.cupomDesconto && (
                        <button
                          type="button"
                          onClick={validarCupom}
                          className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                        >
                          Validar
                        </button>
                      )}
                    </div>
                    
                    {cupomValidado && (
                      <div className={`mt-2 p-3 rounded-lg text-sm ${
                        cupomValidado.valido 
                          ? 'bg-green-500/10 border border-green-500/20 text-green-400' 
                          : 'bg-red-500/10 border border-red-500/20 text-red-400'
                      }`}>
                        {cupomValidado.mensagem}
                      </div>
                    )}
                  </div>
                </form>
              )}

              {/* Formulário Step 2 - Senha */}
              {step === 2 && (
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
                  {errors.general && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
                      {errors.general}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Senha *
                    </label>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Mínimo 6 caracteres"
                        value={formData.senha}
                        onChange={(e) => handleInputChange('senha', e.target.value)}
                        className={`w-full pl-10 pr-12 py-3 bg-gray-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                          errors.senha 
                            ? 'border-red-500 focus:ring-red-500/50' 
                            : 'border-gray-600 focus:border-orange-500 focus:ring-orange-500/50'
                        }`}
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
                    {errors.senha && (
                      <p className="mt-1 text-sm text-red-400">{errors.senha}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Confirmar Senha *
                    </label>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirme sua senha"
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
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {errors.confirmarSenha && (
                      <p className="mt-1 text-sm text-red-400">{errors.confirmarSenha}</p>
                    )}
                  </div>
                </form>
              )}

              {/* Botões */}
              <div className="mt-6 space-y-3">
                {step === 1 && (
                  <button
                    onClick={handleNext}
                    className="w-full py-3 px-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black transition-all"
                  >
                    Próximo →
                  </button>
                )}

                {step === 2 && (
                  <div className="space-y-3">
                    <button
                      onClick={handleSubmit}
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
                          Criando conta...
                        </div>
                      ) : (
                        'Criar Conta'
                      )}
                    </button>
                    
                    <button
                      onClick={() => setStep(1)}
                      className="w-full border border-gray-600 text-gray-300 py-3 px-4 rounded-xl hover:bg-gray-700/50 transition-all"
                    >
                      ← Voltar
                    </button>
                  </div>
                )}
              </div>

              {/* Link para Login */}
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

export default CadastroPage;
