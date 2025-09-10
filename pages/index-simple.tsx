import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Home() {
  const router = useRouter();
  const [showFAQ, setShowFAQ] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [currentCycle, setCurrentCycle] = useState(2);
  const [tradingData, setTradingData] = useState({
    phase: 'SINAL DE COMPRA/VENDA',
    status: 'EM EXECUÇÃO',
    signal: 'SHORT',
    pair: 'ADA/USDT',
    rsi: 27,
    macd: 'Bearish Cross',
    volume: '+77%',
    orderPrice: '$69328.09',
    stopLoss: '$65861.69',
    currentPrice: '$58616.90',
    pnl: '+$-10711.19',
    roi: '+15.45%',
    time: '5h 16min',
    commission: '$-97.51'
  });

  // Simulação de trading em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCycle(prev => prev === 2 ? 3 : 2);
      
      // Simular mudanças nos dados de trading
      setTradingData(prev => ({
        ...prev,
        currentPrice: `$${(Math.random() * 10000 + 50000).toFixed(2)}`,
        pnl: `${Math.random() > 0.7 ? '+' : '-'}$${(Math.random() * 2000 + 500).toFixed(2)}`,
        roi: `${Math.random() > 0.7 ? '+' : '-'}${(Math.random() * 20 + 5).toFixed(2)}%`,
        time: `${Math.floor(Math.random() * 12)}h ${Math.floor(Math.random() * 60)}min`
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const faqData = [
    {
      question: "Como funciona o período de teste grátis?",
      answer: "Você tem 7 dias para testar todas as funcionalidades do robô em modo TESTNET, sem risco ao seu capital."
    },
    {
      question: "O robô realmente só lucra se eu lucrar?",
      answer: "Sim! Cobramos apenas 1,5% de comissão sobre os lucros reais. Se não há lucro, não há cobrança."
    },
    {
      question: "Qual o valor mínimo para começar?",
      answer: "O valor mínimo varia conforme o plano escolhido, começando a partir de $30 USD para uso internacional."
    },
    {
      question: "Como funciona o programa de afiliados?",
      answer: "Ganhe comissões recorrentes indicando novos usuários para nossa plataforma. Sem limites de ganhos."
    },
    {
      question: "Posso cancelar a qualquer momento?",
      answer: "Sim, você pode cancelar sua assinatura a qualquer momento através do painel de controle."
    }
  ];

  const handleCTAClick = (action: string) => {
    if (action === 'register') {
      router.push('/auth/register-new');
    } else if (action === 'login') {
      router.push('/auth/login');
    } else if (action === 'plans') {
      router.push('/planos-new');
    }
  };

  const features = [
    {
      icon: "🔍",
      title: "Análise de Mercado",
      description: "IA monitora milhares de sinais em tempo real 24/7"
    },
    {
      icon: "📊",
      title: "Detecção de Oportunidades",
      description: "Algoritmos identificam os melhores pontos de entrada"
    },
    {
      icon: "⚡",
      title: "Execução Automática",
      description: "Robô executa operações instantaneamente"
    },
    {
      icon: "👁️",
      title: "Monitoramento Contínuo",
      description: "Acompanhamento em tempo real de todas as posições"
    },
    {
      icon: "💰",
      title: "Gestão de Lucros",
      description: "Stop loss e take profit automatizados"
    },
    {
      icon: "📈",
      title: "Relatórios Detalhados",
      description: "Dashboard completo com performance e analytics"
    }
  ];

  return (
    <>
      <Head>
        <title>CoinBitClub MARKETBOT - O robô que só lucra se você lucrar</title>
        <meta name="description" content="Trading automático com IA que monitora mercado 24/7. Comissão apenas sobre lucros reais. Teste grátis!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-x-hidden">
        {/* Header */}
        <header className="fixed top-0 w-full bg-slate-900/90 backdrop-blur-md z-50 border-b border-slate-700/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-black font-bold text-lg">₿</span>
                </div>
                <div>
                  <div className="text-yellow-400 font-bold text-xl">CoinBitClub</div>
                  <div className="text-yellow-400 text-sm">MARKETBOT</div>
                </div>
              </div>

              {/* Language Selector */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-slate-300">
                  <span>🌐</span> <span>BR</span> <span className="text-yellow-400">PT</span> <span>▼</span>
                </div>
                
                {/* Auth Buttons */}
                <button
                  onClick={() => handleCTAClick('login')}
                  className="px-4 py-2 text-yellow-400 border border-yellow-400 rounded-lg hover:bg-yellow-400 hover:text-black transition-all"
                >
                  🔑 LOGIN
                </button>
                <button
                  onClick={() => handleCTAClick('register')}
                  className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-lg hover:opacity-90 transition-opacity"
                >
                  🚀 Cadastrar
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="pt-24 pb-16 relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-orange-500/10"></div>
          <div className="absolute left-1/4 top-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute right-1/4 bottom-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="text-yellow-400">MARKETBOT</span>
              <span className="text-white">: o robô de trade automático</span>
              <br />
              <span className="bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
                que só lucra se você lucrar.
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 mb-8">
              Monitoramento de mercado com IA para entrada e saída dos sinais certos.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <button
                onClick={() => handleCTAClick('register')}
                className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-xl text-lg hover:opacity-90 transition-opacity"
              >
                🚀 Quero Testar Grátis
              </button>
              <button
                onClick={() => handleCTAClick('plans')}
                className="px-8 py-4 border-2 border-blue-500 text-blue-400 font-semibold rounded-xl text-lg hover:bg-blue-500 hover:text-white transition-all"
              >
                📊 Conhecer os Planos
              </button>
            </div>
          </div>
        </section>

        {/* Trading Simulation Section */}
        <section className="py-16 relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-4">
                Veja o Robô em Ação
              </h2>
              <p className="text-xl text-slate-300">
                Timeline em tempo real de uma operação completa
              </p>
            </div>

            {/* Trading Dashboard Simulation */}
            <div className="max-w-6xl mx-auto">
              <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">🤖</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">Operação do Robô em Tempo Real</h3>
                      <p className="text-slate-400">Acompanhe cada etapa do processo automatizado</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-400">Ciclo Atual</div>
                    <div className="text-2xl font-bold text-yellow-400">#{currentCycle}</div>
                  </div>
                </div>

                {/* Trading Steps */}
                <div className="space-y-4">
                  {/* Leitura de Mercado */}
                  <div className="flex items-center space-x-4 p-4 bg-slate-700/30 rounded-lg">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg">📊</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-blue-400 font-semibold">LEITURA DE MERCADO</div>
                      <div className="text-slate-300">Analisando RSI: {tradingData.rsi} (Oversold) | MACD: {tradingData.macd} | Volume: {tradingData.volume}</div>
                    </div>
                  </div>

                  {/* Sinal de Compra/Venda */}
                  <div className="flex items-center space-x-4 p-4 bg-yellow-500/20 rounded-lg border border-yellow-500/50">
                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-black text-lg">🎯</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <div className="text-yellow-400 font-semibold">SINAL DE COMPRA/VENDA</div>
                        <span className="px-2 py-1 bg-yellow-500 text-black text-xs font-bold rounded">EM EXECUÇÃO</span>
                      </div>
                      <div className="text-slate-300">Sinal {tradingData.signal} detectado! Vender {tradingData.pair} com alta probabilidade</div>
                    </div>
                    <div className="w-full bg-yellow-500/30 h-2 rounded-full max-w-xs">
                      <div className="bg-yellow-500 h-2 rounded-full w-3/4"></div>
                    </div>
                  </div>

                  {/* Abertura de Posição */}
                  <div className="flex items-center space-x-4 p-4 bg-slate-700/30 rounded-lg">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg">▶️</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-green-400 font-semibold">ABERTURA DE POSIÇÃO</div>
                      <div className="text-slate-300">Ordem executada: Venda {tradingData.pair} {tradingData.orderPrice} | Stop: {tradingData.stopLoss}</div>
                    </div>
                  </div>

                  {/* Monitoramento */}
                  <div className="flex items-center space-x-4 p-4 bg-slate-700/30 rounded-lg">
                    <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg">👁️</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-cyan-400 font-semibold">MONITORAMENTO EM TEMPO REAL</div>
                      <div className="text-slate-300">Preço atual: {tradingData.currentPrice} | P&L: {tradingData.pnl} | ROI: {tradingData.roi}</div>
                    </div>
                  </div>

                  {/* Fechamento */}
                  <div className="flex items-center space-x-4 p-4 bg-slate-700/30 rounded-lg">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg">📈</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-orange-400 font-semibold">FECHAMENTO DE POSIÇÃO</div>
                      <div className="text-slate-300">Take Profit atingido! Comprando {tradingData.pair} {tradingData.currentPrice}</div>
                    </div>
                  </div>

                  {/* Resultado */}
                  <div className="flex items-center space-x-4 p-4 bg-green-500/20 rounded-lg border border-green-500/50">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg">💰</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-green-400 font-semibold">RESULTADO (Lucro/Prejuízo)</div>
                      <div className="text-slate-300">✅ LUCRO: {tradingData.roi} | Valor: {tradingData.pnl} | Tempo: {tradingData.time}</div>
                    </div>
                  </div>

                  {/* Comissionamento */}
                  <div className="flex items-center space-x-4 p-4 bg-purple-500/20 rounded-lg border border-purple-500/50">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg">%</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-purple-400 font-semibold">COMISSIONAMENTO GERADO</div>
                      <div className="text-slate-300">🔒 Comissão (1.5%): {tradingData.commission} creditada na sua conta</div>
                    </div>
                  </div>
                </div>

                {/* Status Footer */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-700/50">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 font-semibold">Sistema Ativo</span>
                    <span className="text-slate-400">Velocidade: NORMAL</span>
                  </div>
                  <div className="text-slate-400">
                    Próximo ciclo inicia automaticamente
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Como Funciona Section */}
        <section className="py-16 bg-slate-800/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-blue-400 mb-4">
                Como Funciona
              </h2>
              <p className="text-xl text-slate-300">
                6 etapas simples para multiplicar seus resultados
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 hover:border-blue-500/50 transition-all group"
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Programa de Comissionamento */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-purple-400 mb-4">
                Programa de Comissionamento
              </h2>
              <p className="text-xl text-slate-300">
                Ganhe 1,5% sobre o lucro real de cada indicado
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 backdrop-blur-md rounded-3xl p-8 border border-purple-500/30">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-2xl">👥</span>
                      </div>
                      <h3 className="text-2xl font-bold text-white">Como Funciona</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                          <span className="text-black text-sm font-bold">💰</span>
                        </div>
                        <span className="text-slate-300">1,5% de comissão sobre lucro real</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">🚫</span>
                        </div>
                        <span className="text-slate-300">Sem esquema de pirâmide</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">💳</span>
                        </div>
                        <span className="text-slate-300">Saque ou crédito na plataforma</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">📊</span>
                        </div>
                        <span className="text-slate-300">Dashboard de acompanhamento</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">🎯</span>
                        </div>
                        <span className="text-slate-300">Sem limite de indicações</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-8 mb-6">
                      <div className="text-6xl font-bold text-white mb-2">1,5%</div>
                      <div className="text-white text-lg">sobre lucro real</div>
                    </div>
                    <button
                      onClick={() => handleCTAClick('register')}
                      className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl text-lg hover:opacity-90 transition-opacity"
                    >
                      → Começar Agora
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contato e Suporte */}
        <section className="py-16 bg-slate-800/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-4">
                Contato e Suporte
              </h2>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <a
                  href="https://wa.me/5521999596652"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 hover:bg-green-700 transition-colors rounded-2xl p-6 text-center group"
                >
                  <div className="text-4xl mb-3">💬</div>
                  <h3 className="text-xl font-bold text-white mb-2">WhatsApp</h3>
                  <p className="text-green-100">+55 21 99596-6652</p>
                </a>

                <a
                  href="mailto:faleconosco@coinbitclub.vip"
                  className="bg-blue-600 hover:bg-blue-700 transition-colors rounded-2xl p-6 text-center group"
                >
                  <div className="text-4xl mb-3">📧</div>
                  <h3 className="text-xl font-bold text-white mb-2">Email</h3>
                  <p className="text-blue-100">faleconosco@coinbitclub.vip</p>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Logo e Descrição */}
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-black font-bold text-lg">₿</span>
                  </div>
                  <div>
                    <div className="text-yellow-400 font-bold text-xl">CoinBitClub</div>
                    <div className="text-yellow-400 text-sm">MARKETBOT</div>
                  </div>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">
                  MARKETBOT: o robô de trade automático que só lucra se você lucrar. 
                  Tecnologia de ponta para maximizar seus resultados no mercado de criptomoedas.
                </p>
              </div>

              {/* Links Úteis */}
              <div>
                <h4 className="text-white font-semibold mb-4">Links Úteis</h4>
                <div className="space-y-2">
                  <a href="/terms" className="block text-slate-400 hover:text-yellow-400 transition-colors">
                    Termos de Uso
                  </a>
                  <a href="/privacy" className="block text-slate-400 hover:text-yellow-400 transition-colors">
                    Política de Privacidade
                  </a>
                  <button 
                    onClick={() => setShowFAQ(true)}
                    className="block text-slate-400 hover:text-yellow-400 transition-colors text-left"
                  >
                    Suporte
                  </button>
                </div>
              </div>

              {/* Contato */}
              <div>
                <h4 className="text-white font-semibold mb-4">Contato</h4>
                <div className="space-y-2">
                  <div className="text-slate-400">
                    <strong className="text-green-400">WhatsApp</strong><br />
                    faleconosco:
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-800 mt-8 pt-8 text-center">
              <p className="text-slate-500 text-sm">
                © 2025 CoinBitClub. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </footer>

        {/* FAQ Modal */}
        {showFAQ && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Perguntas Frequentes</h3>
                <button
                  onClick={() => setShowFAQ(false)}
                  className="text-slate-400 hover:text-white transition-colors text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                {faqData.map((faq, index) => (
                  <div key={index} className="border border-slate-700 rounded-lg">
                    <button
                      onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                      className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-slate-700/50 transition-colors"
                    >
                      <span className="text-white font-medium">{faq.question}</span>
                      <span className="text-slate-400 text-xl">
                        {openFAQ === index ? '−' : '+'}
                      </span>
                    </button>
                    {openFAQ === index && (
                      <div className="px-4 pb-3 text-slate-300">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Floating FAQ Button */}
        <button
          onClick={() => setShowFAQ(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all z-40"
        >
          <span className="text-black text-xl">💬</span>
        </button>
      </div>
    </>
  );
}
