import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '../hooks/useLanguage';
import { FaBars, FaTimes, FaShieldAlt, FaFileContract, FaHome } from 'react-icons/fa';

const TermsPage: NextPage = () => {
  const [mounted, setMounted] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeTab, setActiveTab] = useState('terms');
  const { language } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <Head>
        <title>
          {language === 'pt' ? 'Termos e Políticas - CoinBitClub' : 'Terms & Policies - CoinBitClub'}
        </title>
        <meta 
          name="description" 
          content={language === 'pt' 
            ? 'Transparência total sobre como operamos e protegemos você'
            : 'Total transparency about how we operate and protect you'
          } 
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        {/* Header Navigation */}
        <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-700/30 sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/home" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center">
                  <span className="text-black font-bold text-lg">C</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-white">CoinBitClub</span>
                  <span className="text-sm text-orange-400 font-semibold -mt-1">MARKETBOT</span>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-8">
                <Link href="/home" className="text-gray-300 hover:text-white transition-colors">
                  {language === 'pt' ? 'Início' : 'Home'}
                </Link>
                <Link href="/planos" className="text-gray-300 hover:text-white transition-colors">
                  {language === 'pt' ? 'Planos' : 'Plans'}
                </Link>
                <Link href="/termos" className="text-orange-400 font-semibold">
                  {language === 'pt' ? 'Termos e Políticas' : 'Terms & Policies'}
                </Link>
              </nav>

              {/* Action Buttons */}
              <div className="hidden md:flex items-center gap-4">
                <Link 
                  href="/auth/login"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {language === 'pt' ? 'Entrar' : 'Login'}
                </Link>
                <Link 
                  href="/auth/register"
                  className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-bold px-6 py-2 rounded-xl transition-all"
                >
                  {language === 'pt' ? 'Cadastrar' : 'Register'}
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden text-white p-2"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                {showMobileMenu ? <FaTimes /> : <FaBars />}
              </button>
            </div>

            {/* Mobile Menu */}
            {showMobileMenu && (
              <div className="md:hidden bg-gray-800/90 backdrop-blur-sm border-t border-gray-700/30">
                <div className="py-4 space-y-2">
                  <Link href="/home" className="block px-4 py-2 text-gray-300 hover:text-white transition-colors">
                    {language === 'pt' ? 'Início' : 'Home'}
                  </Link>
                  <Link href="/planos" className="block px-4 py-2 text-gray-300 hover:text-white transition-colors">
                    {language === 'pt' ? 'Planos' : 'Plans'}
                  </Link>
                  <Link href="/termos" className="block px-4 py-2 text-orange-400 font-semibold">
                    {language === 'pt' ? 'Termos e Políticas' : 'Terms & Policies'}
                  </Link>
                  <div className="border-t border-gray-700/30 pt-2 mt-2">
                    <Link href="/auth/login" className="block px-4 py-2 text-gray-300 hover:text-white transition-colors">
                      {language === 'pt' ? 'Entrar' : 'Login'}
                    </Link>
                    <Link href="/auth/register" className="block px-4 py-2 text-orange-400 font-semibold">
                      {language === 'pt' ? 'Cadastrar' : 'Register'}
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Header Section */}
        <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <Link 
                href="/home"
                className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors mb-6"
              >
                <FaHome />
                {language === 'pt' ? 'Voltar para Home' : 'Back to Home'}
              </Link>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                {language === 'pt' ? 'Políticas e ' : 'Policies & '}
                <span className="text-yellow-400">Termos</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                {language === 'pt' 
                  ? 'Transparência total sobre como operamos e protegemos você'
                  : 'Total transparency about how we operate and protect you'
                }
              </p>
            </motion.div>
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center mb-8">
            <div className="flex bg-gray-800/50 rounded-xl p-1">
              <button
                onClick={() => setActiveTab('terms')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === 'terms'
                    ? 'bg-orange-500 text-black'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <FaFileContract />
                {language === 'pt' ? 'Termos de Uso' : 'Terms of Use'}
              </button>
              <button
                onClick={() => setActiveTab('privacy')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === 'privacy'
                    ? 'bg-orange-500 text-black'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <FaShieldAlt />
                {language === 'pt' ? 'Política de Privacidade' : 'Privacy Policy'}
              </button>
            </div>
          </div>

          {/* Terms of Use Content */}
          {activeTab === 'terms' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/30"
            >
              <div className="text-white space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-orange-400 mb-4">Termos de Uso</h2>
                  <p className="text-gray-400 mb-6">Última atualização: agosto/2025</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-black font-bold">1</div>
                      <h3 className="text-xl font-bold">Aceitação dos Termos</h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      Ao utilizar os serviços do CoinBitClub MARKETBOT ("Serviço", "nós", "nosso"), você concorda com estes Termos de Uso. Se você não concorda com qualquer parte destes termos, não deve usar nosso serviço.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-black font-bold">2</div>
                      <h3 className="text-xl font-bold">Descrição do Serviço</h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      O MARKETBOT é um sistema de trading automatizado que utiliza inteligência artificial para:
                    </p>
                    <ul className="text-gray-300 space-y-2 ml-6">
                      <li>• Analisar mercados de criptomoedas em tempo real</li>
                      <li>• Executar operações automatizadas baseadas em algoritmos</li>
                      <li>• Gerenciar riscos através de stop loss e take profit</li>
                      <li>• Fornecer relatórios e análises de performance</li>
                    </ul>
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mt-4">
                      <p className="text-yellow-300 font-semibold">⚠️ Importante:</p>
                      <p className="text-yellow-200">Trading de criptomoedas é altamente volátilenvolve riscos significativos.</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-black font-bold">3</div>
                      <h3 className="text-xl font-bold">Segurança e Custódia</h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      <strong>Seus fundos estão seguros:</strong> Não temos acesso aos seus fundos. Tudo fica na sua exchange, conectamos via API para trading.
                    </p>
                    <ul className="text-gray-300 space-y-2 ml-6">
                      <li>• Não armazenamos chaves privadas ou senhas de exchanges</li>
                      <li>• Utilizamos apenas APIs de trading (sem retirada)</li>
                      <li>• Você mantém controle total dos seus ativos</li>
                      <li>• Pode desconectar o bot a qualquer momento</li>
                    </ul>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-black font-bold">4</div>
                      <h3 className="text-xl font-bold">Modelo de Cobrança</h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      Nosso modelo de cobrança é transparente e alinhado aos seus resultados:
                    </p>
                    <ul className="text-gray-300 space-y-2 ml-6">
                      <li>• Taxa de Performance: 10% ou 20% sobre o lucro real gerado, de acordo com o plano.</li>
                      <li>• Teste gratuito: 7 dias sem cobrança (TESTNET)</li>
                      <li>• Cancelamento: Pode cancelar a qualquer momento</li>
                    </ul>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-black font-bold">5</div>
                      <h3 className="text-xl font-bold">Limitações e Responsabilidades</h3>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
                      <p className="text-red-300 font-semibold">Isenção de Responsabilidade:</p>
                      <p className="text-red-200">O trading automatizado não garante lucros. Perdas são possíveis e fazem parte do trading.</p>
                    </div>
                    <ul className="text-gray-300 space-y-2 ml-6">
                      <li>• Não garantimos resultados específicos</li>
                      <li>• Você é responsável por suas decisões de investimento</li>
                      <li>• Não reembolsamos perdas.</li>
                    </ul>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-black font-bold">6</div>
                      <h3 className="text-xl font-bold">Modificações e Cancelamento</h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      Você pode cancelar sua assinatura a qualquer momento através do dashboard ou entrando em contato conosco. O cancelamento será efetivo no final do período de cobrança atual.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Privacy Policy Content */}
          {activeTab === 'privacy' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/30"
            >
              <div className="text-white space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-orange-400 mb-4">Política de Privacidade</h2>
                  <p className="text-gray-400 mb-6">Última atualização: agosto/2025</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">1</div>
                      <h3 className="text-xl font-bold">Informações que Coletamos</h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      Coletamos apenas as informações necessárias para fornecer nossos serviços:
                    </p>
                    
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
                      <h4 className="text-blue-300 font-semibold mb-2">Informações Pessoais:</h4>
                      <ul className="text-gray-300 space-y-1 ml-4">
                        <li>• Nome completo</li>
                        <li>• Endereço de email</li>
                        <li>• Número de telefone/WhatsApp</li>
                        <li>• País de residência</li>
                      </ul>
                    </div>

                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 mb-4">
                      <h4 className="text-purple-300 font-semibold mb-2">Dados de Trading:</h4>
                      <ul className="text-gray-300 space-y-1 ml-4">
                        <li>• Histórico de operações (para relatórios)</li>
                        <li>• Performance do bot</li>
                        <li>• Configurações de trading</li>
                        <li>• Dados de uso da plataforma</li>
                      </ul>
                    </div>

                    <p className="text-gray-300 leading-relaxed">
                      Informações bancárias em caso de reembolso e saque de comissão.
                    </p>

                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                      <p className="text-red-300 font-semibold">Nunca coletamos:</p>
                      <p className="text-red-200">Chaves privadas, senhas de exchanges, ou qualquer informação que dê acesso aos seus fundos.</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">2</div>
                      <h3 className="text-xl font-bold">Como Usamos suas Informações</h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      Utilizamos suas informações exclusivamente para:
                    </p>
                    <ul className="text-gray-300 space-y-2 ml-6">
                      <li>• Fornecer e manter nossos serviços de trading automatizado</li>
                      <li>• Enviar relatórios de performance e alertas</li>
                      <li>• Oferecer suporte técnico quando necessário</li>
                      <li>• Melhorar nossos algoritmos e serviços</li>
                      <li>• Cumprir obrigações legais e regulatórias</li>
                    </ul>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">3</div>
                      <h3 className="text-xl font-bold">Proteção de Dados</h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      Implementamos medidas de segurança rigorosas:
                    </p>
                    <ul className="text-gray-300 space-y-2 ml-6">
                      <li>• Criptografia SSL/TLS para todas as comunicações</li>
                      <li>• Armazenamento seguro com criptografia de dados</li>
                      <li>• Acesso restrito apenas para equipe autorizada</li>
                      <li>• Monitoramento contínuo de segurança</li>
                      <li>• Backups seguros e regulares</li>
                    </ul>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mt-4">
                      <p className="text-green-300 font-semibold">Conformidade LGPD:</p>
                      <p className="text-green-200">Estamos em total conformidade com a Lei Geral de Proteção de Dados (LGPD).</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">4</div>
                      <h3 className="text-xl font-bold">Compartilhamento de Informações</h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, exceto:
                    </p>
                    <ul className="text-gray-300 space-y-2 ml-6">
                      <li>• Quando exigido por lei ou autoridades competentes</li>
                      <li>• Para provedores de serviços essenciais (com contratos de confidencialidade)</li>
                      <li>• Com seu consentimento explícito</li>
                    </ul>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">5</div>
                      <h3 className="text-xl font-bold">Retenção de Dados</h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      Mantemos seus dados apenas pelo tempo necessário para fornecer nossos serviços ou conforme exigido por lei. Você pode solicitar a exclusão de seus dados a qualquer momento.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default TermsPage;
