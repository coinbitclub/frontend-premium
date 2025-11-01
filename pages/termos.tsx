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

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-x-hidden">
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
                <Link href="/termos" className="text-orange-400 font-semibold">
                  {language === 'pt' ? 'Termos e Políticas' : 'Terms & Policies'}
                </Link>
              </nav>

              {/* Action Buttons */}
              <div className="hidden md:flex items-center gap-4">
                {/* Language Toggle */}
                <div className="flex items-center bg-gray-800/50 rounded-lg p-1">
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        localStorage.setItem('language', 'pt');
                        window.location.reload();
                      }
                    }}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                      language === 'pt'
                        ? 'bg-orange-500 text-black'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    PT
                  </button>
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        localStorage.setItem('language', 'en');
                        window.location.reload();
                      }
                    }}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                      language === 'en'
                        ? 'bg-orange-500 text-black'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    EN
                  </button>
                </div>

                <Link 
                  href="/auth/login"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 py-2 rounded-xl transition-all border border-blue-500/30"
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
                  <Link href="/termos" className="block px-4 py-2 text-orange-400 font-semibold">
                    {language === 'pt' ? 'Termos e Políticas' : 'Terms & Policies'}
                  </Link>
                  
                  {/* Language Toggle Mobile */}
                  <div className="px-4 py-2">
                    <p className="text-gray-400 text-sm mb-2">{language === 'pt' ? 'Idioma' : 'Language'}</p>
                    <div className="flex items-center bg-gray-800/50 rounded-lg p-1 w-fit">
                      <button
                        onClick={() => {
                          if (typeof window !== 'undefined') {
                            localStorage.setItem('language', 'pt');
                            window.location.reload();
                          }
                        }}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                          language === 'pt'
                            ? 'bg-orange-500 text-black'
                            : 'text-gray-300 hover:text-white'
                        }`}
                      >
                        PT
                      </button>
                      <button
                        onClick={() => {
                          if (typeof window !== 'undefined') {
                            localStorage.setItem('language', 'en');
                            window.location.reload();
                          }
                        }}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                          language === 'en'
                            ? 'bg-orange-500 text-black'
                            : 'text-gray-300 hover:text-white'
                        }`}
                      >
                        EN
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-gray-700/30 pt-2 mt-2">
                    <Link href="/auth/login" className="block mx-4 my-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all text-center">
                      {language === 'pt' ? 'Entrar' : 'Login'}
                    </Link>
                    <Link href="/auth/register" className="block mx-4 my-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-bold rounded-xl transition-all text-center">
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
                  <h2 className="text-3xl font-bold text-orange-400 mb-4 flex items-center gap-3">
                    <span className="text-2xl">🧾</span>
                    {language === 'pt' ? 'TERMOS DE USO – COINBITCLUB MARKETBOT' : 'TERMS OF USE – COINBITCLUB MARKETBOT'}
                  </h2>
                  <p className="text-gray-400 mb-6">
                    {language === 'pt' ? 'Última atualização: novembro/2025' : 'Last updated: November/2025'}
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-black font-bold">1</div>
                      <h3 className="text-xl font-bold">
                        {language === 'pt' ? 'Aceitação dos Termos' : 'Terms Acceptance'}
                      </h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      {language === 'pt' 
                        ? 'Ao utilizar o CoinbitClub MarketBot ("Serviço", "nós", "nosso"), o usuário declara ter lido, compreendido e aceitado integralmente estes Termos de Uso e a Política de Privacidade. Caso não concorde, o uso do serviço deve ser interrompido imediatamente.'
                        : 'By using CoinbitClub MarketBot ("Service", "we", "our"), the user declares to have read, understood and fully accepted these Terms of Use and Privacy Policy. If you do not agree, use of the service must be discontinued immediately.'
                      }
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-black font-bold">2</div>
                      <h3 className="text-xl font-bold">
                        {language === 'pt' ? 'Descrição do Serviço' : 'Service Description'}
                      </h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      {language === 'pt' 
                        ? 'O MarketBot é um sistema de trading automatizado com inteligência artificial, projetado para operar em tempo real nas corretoras Binance e Bybit por meio de conexão via API oficial e segura, sem permissão de saque.'
                        : 'MarketBot is an automated trading system with artificial intelligence, designed to operate in real-time on Binance and Bybit exchanges through official and secure API connection, without withdrawal permission.'
                      }
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                      {language === 'pt' 
                        ? 'O objetivo é oferecer ao usuário uma solução de automação de trading eficiente, segura e transparente, com total controle sobre os próprios ativos.'
                        : 'The goal is to offer users an efficient, secure and transparent trading automation solution, with full control over their own assets.'
                      }
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-black font-bold">3</div>
                      <h3 className="text-xl font-bold">
                        {language === 'pt' ? 'Segurança e Custódia dos Fundos' : 'Security and Fund Custody'}
                      </h3>
                    </div>
                    <ul className="text-gray-300 space-y-2 ml-6">
                      <li>• {language === 'pt' ? 'A CoinbitClub não tem acesso aos fundos do usuário.' : 'CoinbitClub has no access to user funds.'}</li>
                      <li>• {language === 'pt' ? 'Todas as operações são executadas diretamente na conta do usuário na corretora escolhida.' : 'All operations are executed directly in the user\'s account at the chosen exchange.'}</li>
                      <li>• {language === 'pt' ? 'O usuário pode pausar, encerrar ou desconectar o sistema a qualquer momento.' : 'The user can pause, stop or disconnect the system at any time.'}</li>
                      <li>• {language === 'pt' ? 'Nenhuma senha, chave privada ou dado bancário é armazenado pela CoinbitClub.' : 'No passwords, private keys or banking data are stored by CoinbitClub.'}</li>
                    </ul>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-black font-bold">4</div>
                      <h3 className="text-xl font-bold">
                        {language === 'pt' ? 'Modelo de Cobrança e Saldo Operacional' : 'Billing Model and Operational Balance'}
                      </h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      {language === 'pt' ? 'O modelo de cobrança é fixo, automático e transparente:' : 'The billing model is fixed, automatic and transparent:'}
                    </p>
                    <ul className="text-gray-300 space-y-2 ml-6 mb-4">
                      <li>• <strong>{language === 'pt' ? 'Taxa CoinbitClub:' : 'CoinbitClub Fee:'}</strong> {language === 'pt' ? '0,07% por operação aberta, calculada sobre o valor total da posição alavancada.' : '0.07% per opened operation, calculated on the total value of the leveraged position.'}</li>
                      <li>• {language === 'pt' ? 'A taxa é descontada no momento da abertura da operação, diretamente do saldo pré-pago do usuário mantido na CoinbitClub.' : 'The fee is deducted at the time of opening the operation, directly from the user\'s prepaid balance maintained at CoinbitClub.'}</li>
                      <li>• {language === 'pt' ? 'Caso o saldo esteja zerado, novas operações não serão executadas até que o usuário realize recarga.' : 'If the balance is zero, new operations will not be executed until the user recharges.'}</li>
                      <li>• <strong>{language === 'pt' ? 'Não há mensalidades, planos ou comissões sobre lucro.' : 'There are no monthly fees, plans or profit commissions.'}</strong></li>
                    </ul>
                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                      <p className="text-orange-300 font-semibold">⚙️ {language === 'pt' ? 'Regras de Operação:' : 'Operation Rules:'}</p>
                      <p className="text-orange-200">
                        {language === 'pt' 
                          ? 'As regras detalhadas de operação, personalização e gestão de risco estão descritas no documento oficial "Como Funciona o MarketBot", disponível no site.'
                          : 'Detailed operation, customization and risk management rules are described in the official document "How MarketBot Works", available on the website.'
                        }
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-black font-bold">5</div>
                      <h3 className="text-xl font-bold">
                        {language === 'pt' ? 'Reembolso do Saldo Pré-Pago' : 'Prepaid Balance Refund'}
                      </h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      {language === 'pt' 
                        ? 'O usuário pode solicitar, a qualquer momento, o saque ou reembolso do saldo pré-pago não utilizado, desde que o valor não tenha sido aplicado em taxas de operações já abertas ou efetivamente executadas.'
                        : 'The user can request, at any time, the withdrawal or refund of unused prepaid balance, provided that the amount has not been applied to fees for operations already opened or effectively executed.'
                      }
                    </p>
                    <ul className="text-gray-300 space-y-2 ml-6">
                      <li>• {language === 'pt' ? 'O pedido deve ser feito via painel de usuário ou canal de suporte oficial;' : 'The request must be made via user panel or official support channel;'}</li>
                      <li>• {language === 'pt' ? 'O reembolso será processado em até 5 (cinco) dias úteis após a solicitação;' : 'The refund will be processed within 5 (five) business days after the request;'}</li>
                      <li>• {language === 'pt' ? 'Taxas já aplicadas a operações abertas ou concluídas não são reembolsáveis sob nenhuma hipótese.' : 'Fees already applied to opened or completed operations are not refundable under any circumstances.'}</li>
                    </ul>
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mt-4">
                      <p className="text-yellow-300 font-semibold">⚠️ {language === 'pt' ? 'Importante sobre Créditos Promocionais:' : 'Important about Promotional Credits:'}</p>
                      <p className="text-yellow-200">
                        {language === 'pt' 
                          ? 'Créditos promocionais, bônus, cupons de teste ou qualquer valor concedido com desconto são não reembolsáveis, ainda que não utilizados integralmente. Esses créditos possuem caráter incentivo e não representam valor monetário real fora do ambiente CoinbitClub.'
                          : 'Promotional credits, bonuses, test coupons or any value granted with discount are non-refundable, even if not fully used. These credits have an incentive nature and do not represent real monetary value outside the CoinbitClub environment.'
                        }
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-black font-bold">6</div>
                      <h3 className="text-xl font-bold">
                        {language === 'pt' ? 'Riscos e Responsabilidades' : 'Risks and Responsibilities'}
                      </h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      {language === 'pt' ? 'O trading automatizado envolve risco de perda do capital investido.' : 'Automated trading involves risk of loss of invested capital.'}
                    </p>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      {language === 'pt' ? 'O usuário reconhece que:' : 'The user acknowledges that:'}
                    </p>
                    <ul className="text-gray-300 space-y-2 ml-6">
                      <li>• {language === 'pt' ? 'Resultados passados não garantem lucros futuros;' : 'Past results do not guarantee future profits;'}</li>
                      <li>• {language === 'pt' ? 'É responsável por suas configurações, saldo e permissões de API;' : 'Is responsible for their settings, balance and API permissions;'}</li>
                      <li>• {language === 'pt' ? 'A CoinbitClub não oferece consultoria financeira nem se responsabiliza por perdas decorrentes de variações de mercado, falhas de API ou interrupções externas.' : 'CoinbitClub does not offer financial advice nor is responsible for losses due to market variations, API failures or external interruptions.'}</li>
                    </ul>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-black font-bold">7</div>
                      <h3 className="text-xl font-bold">
                        {language === 'pt' ? 'Modificações e Cancelamento' : 'Modifications and Cancellation'}
                      </h3>
                    </div>
                    <ul className="text-gray-300 space-y-2 ml-6">
                      <li>• {language === 'pt' ? 'O usuário pode cancelar o uso do serviço a qualquer momento pelo painel da plataforma;' : 'The user can cancel the use of the service at any time through the platform panel;'}</li>
                      <li>• {language === 'pt' ? 'A CoinbitClub pode atualizar estes Termos mediante aviso prévio;' : 'CoinbitClub may update these Terms with prior notice;'}</li>
                      <li>• {language === 'pt' ? 'O cancelamento interrompe futuras operações, mas não gera direito a reembolso de taxas já aplicadas.' : 'Cancellation stops future operations, but does not generate right to refund of fees already applied.'}</li>
                    </ul>
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
                  <h2 className="text-3xl font-bold text-orange-400 mb-4 flex items-center gap-3">
                    <span className="text-2xl">🔒</span>
                    {language === 'pt' ? 'POLÍTICA DE PRIVACIDADE – COINBITCLUB MARKETBOT' : 'PRIVACY POLICY – COINBITCLUB MARKETBOT'}
                  </h2>
                  <p className="text-gray-400 mb-6">
                    {language === 'pt' ? 'Última atualização: novembro/2025' : 'Last updated: November/2025'}
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">1</div>
                      <h3 className="text-xl font-bold">
                        {language === 'pt' ? 'Dados Coletados' : 'Data Collected'}
                      </h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      {language === 'pt' 
                        ? 'A CoinbitClub coleta apenas as informações essenciais ao funcionamento do sistema:'
                        : 'CoinbitClub collects only the information essential for system operation:'
                      }
                    </p>
                    
                    <ul className="text-gray-300 space-y-2 ml-6 mb-4">
                      <li>• {language === 'pt' ? 'Nome completo' : 'Full name'}</li>
                      <li>• {language === 'pt' ? 'E-mail e senha criptografada (para login)' : 'Email and encrypted password (for login)'}</li>
                      <li>• {language === 'pt' ? 'Telefone/WhatsApp (para suporte e alertas)' : 'Phone/WhatsApp (for support and alerts)'}</li>
                      <li>• {language === 'pt' ? 'Dados de uso e performance (para relatórios operacionais)' : 'Usage and performance data (for operational reports)'}</li>
                    </ul>

                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                      <p className="text-red-300 font-semibold">
                        {language === 'pt' ? 'Não coletamos:' : 'We do not collect:'}
                      </p>
                      <div className="text-red-200 space-y-1 mt-2">
                        <p>• {language === 'pt' ? 'Chaves privadas, senhas de exchange ou informações bancárias' : 'Private keys, exchange passwords or banking information'}</p>
                        <p>• {language === 'pt' ? 'CPF, endereço, documentos ou quaisquer dados sensíveis' : 'SSN, address, documents or any sensitive data'}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">2</div>
                      <h3 className="text-xl font-bold">
                        {language === 'pt' ? 'Finalidade da Coleta' : 'Collection Purpose'}
                      </h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      {language === 'pt' ? 'Os dados são utilizados exclusivamente para:' : 'Data is used exclusively for:'}
                    </p>
                    <ul className="text-gray-300 space-y-2 ml-6 mb-4">
                      <li>• {language === 'pt' ? 'Criar e autenticar a conta do usuário;' : 'Create and authenticate the user account;'}</li>
                      <li>• {language === 'pt' ? 'Executar e manter os serviços automatizados;' : 'Execute and maintain automated services;'}</li>
                      <li>• {language === 'pt' ? 'Enviar relatórios e notificações técnicas;' : 'Send reports and technical notifications;'}</li>
                      <li>• {language === 'pt' ? 'Cumprir obrigações legais e de segurança.' : 'Comply with legal and security obligations.'}</li>
                    </ul>
                    <p className="text-gray-300 leading-relaxed">
                      {language === 'pt' ? 'Não utilizamos dados para marketing, publicidade ou repasse a terceiros.' : 'We do not use data for marketing, advertising or sharing with third parties.'}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">3</div>
                      <h3 className="text-xl font-bold">
                        {language === 'pt' ? 'Segurança da Informação' : 'Information Security'}
                      </h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      {language === 'pt' ? 'A CoinbitClub adota medidas rigorosas de segurança:' : 'CoinbitClub adopts rigorous security measures:'}
                    </p>
                    <ul className="text-gray-300 space-y-2 ml-6">
                      <li>• {language === 'pt' ? 'Criptografia SSL/TLS em todas as comunicações;' : 'SSL/TLS encryption in all communications;'}</li>
                      <li>• {language === 'pt' ? 'Senhas armazenadas com hash seguro;' : 'Passwords stored with secure hash;'}</li>
                      <li>• {language === 'pt' ? 'Acesso restrito à equipe técnica;' : 'Restricted access to technical team;'}</li>
                      <li>• {language === 'pt' ? 'Backups automáticos e auditorias de segurança regulares.' : 'Automatic backups and regular security audits.'}</li>
                    </ul>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">4</div>
                      <h3 className="text-xl font-bold">
                        {language === 'pt' ? 'Direitos do Usuário (LGPD)' : 'User Rights (LGPD)'}
                      </h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      {language === 'pt' ? 'O usuário pode, a qualquer momento:' : 'The user can, at any time:'}
                    </p>
                    <ul className="text-gray-300 space-y-2 ml-6 mb-4">
                      <li>• {language === 'pt' ? 'Solicitar acesso, correção ou exclusão de seus dados;' : 'Request access, correction or deletion of their data;'}</li>
                      <li>• {language === 'pt' ? 'Solicitar informações sobre o uso dos dados;' : 'Request information about data usage;'}</li>
                      <li>• {language === 'pt' ? 'Encerrar sua conta e remover permanentemente todas as informações.' : 'Close their account and permanently remove all information.'}</li>
                    </ul>
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
                      <p className="text-gray-300 leading-relaxed mb-2">
                        📧 {language === 'pt' ? 'Canal de contato:' : 'Contact channel:'}
                      </p>
                      <p className="text-blue-300 font-bold text-lg">
                        faleconosco@coinbitclub.vip
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">5</div>
                      <h3 className="text-xl font-bold">
                        {language === 'pt' ? 'Retenção e Exclusão de Dados' : 'Data Retention and Deletion'}
                      </h3>
                    </div>
                    <div className="space-y-3">
                      <p className="text-gray-300 leading-relaxed">
                        {language === 'pt' ? 'Os dados são mantidos apenas enquanto a conta estiver ativa.' : 'Data is kept only while the account is active.'}
                      </p>
                      <p className="text-gray-300 leading-relaxed">
                        {language === 'pt' ? 'Ao excluir a conta, todas as informações são apagadas de forma definitiva e irreversível.' : 'When deleting the account, all information is permanently and irreversibly deleted.'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">6</div>
                      <h3 className="text-xl font-bold">
                        {language === 'pt' ? 'Conformidade com a LGPD' : 'LGPD Compliance'}
                      </h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      {language === 'pt' ? 'A CoinbitClub atua conforme a Lei nº 13.709/2018 (LGPD), aplicando os princípios de:' : 'CoinbitClub operates in accordance with Law No. 13,709/2018 (LGPD), applying the principles of:'}
                    </p>
                    <ul className="text-gray-300 space-y-2 ml-6 mb-4">
                      <li>• {language === 'pt' ? 'Finalidade e minimização de dados;' : 'Purpose and data minimization;'}</li>
                      <li>• {language === 'pt' ? 'Transparência e consentimento;' : 'Transparency and consent;'}</li>
                      <li>• {language === 'pt' ? 'Segurança e confidencialidade;' : 'Security and confidentiality;'}</li>
                      <li>• {language === 'pt' ? 'Responsabilidade e prestação de contas.' : 'Responsibility and accountability.'}</li>
                    </ul>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                      <p className="text-green-200">
                        {language === 'pt' ? 'Por não tratar dados sensíveis nem realizar tratamento em larga escala, não há obrigatoriedade de nomeação formal de DPO, mas existe canal dedicado à privacidade e proteção de dados.' : 'As we do not handle sensitive data or perform large-scale processing, there is no obligation for formal DPO appointment, but there is a dedicated channel for privacy and data protection.'}
                      </p>
                    </div>
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
