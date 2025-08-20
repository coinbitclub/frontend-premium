import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useLanguage } from '../hooks/useLanguage';

export default function Home() {
  const router = useRouter();
  const { language, changeLanguage, isLoaded } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isOperationActive, setIsOperationActive] = useState(true);
  const [operationStats, setOperationStats] = useState({
    totalTrades: 247,
    successRate: 94.7,
    totalProfit: 15420.50,
    activeUsers: 1247
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLanguageChange = (lang: 'pt' | 'en') => {
    console.log('Button clicked for language:', lang);
    if (changeLanguage && typeof changeLanguage === 'function') {
      changeLanguage(lang);
    } else {
      console.error('changeLanguage function not available');
    }
  };

  const operationSteps = [
    {
      id: 1,
      title: language === 'pt' ? "ANÁLISE DE MERCADO" : "MARKET ANALYSIS",
      subtitle: language === 'pt' ? "IA monitora as TOP 100 maiores moedas em tempo real - BINANCE e BYBIT" : "AI monitors TOP 100 coins in real time - BINANCE and BYBIT",
      status: "analyzing",
      icon: "🔍",
      color: "blue",
      details: language === 'pt' ? [
        "Monitoramento das TOP 100 criptomoedas",
        "Análise técnica em tempo real",
        "Identificação de oportunidades"
      ] : [
        "Monitoring TOP 100 cryptocurrencies",
        "Real-time technical analysis", 
        "Opportunity identification"
      ],
      metrics: {
        timeFrame: "1m",
        accuracy: "97.3%",
        nextOperation: language === 'pt' ? "Em 15 segundos" : "In 15 seconds"
      }
    },
    {
      id: 2,
      title: language === 'pt' ? "SINAL IDENTIFICADO" : "SIGNAL IDENTIFIED",
      subtitle: language === 'pt' ? "BTC/USDT - COMPRA detectada pela IA - Probabilidade: 94%" : "BTC/USDT - BUY detected by AI - Probability: 94%",
      status: "signal",
      icon: "📊",
      color: "green",
      details: language === 'pt' ? [
        "Par: BTC/USDT",
        "Tipo: COMPRA (LONG)",
        "Confiança: 94%"
      ] : [
        "Pair: BTC/USDT",
        "Type: BUY (LONG)",
        "Confidence: 94%"
      ],
      metrics: {
        timeFrame: "5m",
        accuracy: "94%",
        nextOperation: language === 'pt' ? "Executando..." : "Executing..."
      }
    },
    {
      id: 3,
      title: language === 'pt' ? "EXECUTANDO OPERAÇÃO" : "EXECUTING TRADE",
      subtitle: language === 'pt' ? "Comprando BTC/USDT - $2,500 USDT - Preço: $43,250" : "Buying BTC/USDT - $2,500 USDT - Price: $43,250",
      status: "executing",
      icon: "⚡",
      color: "yellow",
      details: language === 'pt' ? [
        "Valor: $2,500 USDT",
        "Preço de entrada: $43,250",
        "Stop Loss: $42,800"
      ] : [
        "Amount: $2,500 USDT",
        "Entry price: $43,250",
        "Stop Loss: $42,800"
      ],
      metrics: {
        timeFrame: "Instant",
        accuracy: "100%",
        nextOperation: language === 'pt' ? "Monitorando..." : "Monitoring..."
      }
    },
    {
      id: 4,
      title: language === 'pt' ? "OPERAÇÃO FINALIZADA" : "TRADE COMPLETED",
      subtitle: language === 'pt' ? "✅ LUCRO: +$347.50 (+13.9%) - BTC vendido em $43,597.50" : "✅ PROFIT: +$347.50 (+13.9%) - BTC sold at $43,597.50",
      status: "completed",
      icon: "✅",
      color: "green",
      details: language === 'pt' ? [
        "Lucro: +$347.50",
        "ROI: +13.9%",
        "Tempo: 4min 32seg"
      ] : [
        "Profit: +$347.50",
        "ROI: +13.9%",
        "Time: 4min 32sec"
      ],
      metrics: {
        timeFrame: "4m 32s",
        accuracy: "SUCCESS",
        nextOperation: "In 15 seconds"
      }
    }
  ];

  // Animação da demonstração
  useEffect(() => {
    if (!isOperationActive) return;

    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= operationSteps.length - 1) {
          // Reinicia o ciclo e atualiza as estatísticas
          setOperationStats(prevStats => ({
            totalTrades: prevStats.totalTrades + 1,
            successRate: parseFloat((Math.random() * 2 + 93).toFixed(1)),
            totalProfit: prevStats.totalProfit + Math.random() * 1000 + 200,
            activeUsers: prevStats.activeUsers + Math.floor(Math.random() * 5)
          }));
          return 0;
        }
        return prev + 1;
      });
    }, 4000); // 4 segundos por etapa

    return () => clearInterval(interval);
  }, [isOperationActive, operationSteps.length]);

  const currentOperation = operationSteps[currentStep];

  // Corrigir o problema do loop de carregamento
  if (!mounted && !isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
            <span className="text-black font-bold text-xl">₿</span>
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
          {language === 'pt' 
            ? 'CoinBitClub MarketBot - Trading Automatizado de Criptomoedas' 
            : 'CoinBitClub MarketBot - Automated Cryptocurrency Trading'
          }
        </title>
        <meta 
          name="description" 
          content={language === 'pt' 
            ? "Plataforma de trading automatizado de criptomoedas com IA. Ganhe dinheiro no piloto automático 24/7 com nossa tecnologia avançada." 
            : "AI-powered automated cryptocurrency trading platform. Make money on autopilot 24/7 with our advanced technology."
          } 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-x-hidden">
        {/* Header */}
        <header className="fixed top-0 w-full bg-slate-900/90 backdrop-blur-md z-50 border-b border-slate-700/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-black font-bold text-lg sm:text-xl">₿</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                    CoinBitClub
                  </h1>
                  <p className="text-xs text-gray-400">MarketBot</p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                <a href="#features" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  {language === 'pt' ? 'Recursos' : 'Features'}
                </a>
                <a href="#demo" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  {language === 'pt' ? 'Demo' : 'Demo'}
                </a>
                <a href="#pricing" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  {language === 'pt' ? 'Preços' : 'Pricing'}
                </a>
              </nav>

              {/* Language Selector */}
              <div className="flex items-center space-x-4">
                <div className="flex bg-slate-800 rounded-lg p-1">
                  <button
                    onClick={() => handleLanguageChange('pt')}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      language === 'pt' 
                        ? 'bg-yellow-500 text-black font-medium' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    PT
                  </button>
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      language === 'en' 
                        ? 'bg-yellow-500 text-black font-medium' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    EN
                  </button>
                </div>

                <button 
                  onClick={() => router.push('/auth/login')}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  {language === 'pt' ? 'Login' : 'Login'}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  {language === 'pt' ? 'Trading Automatizado' : 'Automated Trading'}
                </span>
                <br />
                {language === 'pt' ? 'de Criptomoedas com IA' : 'of Cryptocurrencies with AI'}
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                {language === 'pt' 
                  ? 'Ganhe dinheiro no piloto automático 24/7 com nossa plataforma de trading inteligente. Tecnologia avançada que opera enquanto você dorme.'
                  : 'Make money on autopilot 24/7 with our intelligent trading platform. Advanced technology that operates while you sleep.'
                }
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <button 
                  onClick={() => router.push('/cadastro')}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold px-8 py-4 rounded-xl text-lg transition-all transform hover:scale-105"
                >
                  {language === 'pt' ? 'Começar Agora' : 'Start Now'}
                </button>
                <button 
                  onClick={() => router.push('/auth/login')}
                  className="border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black font-bold px-8 py-4 rounded-xl text-lg transition-all"
                >
                  {language === 'pt' ? 'Fazer Login' : 'Login'}
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">{operationStats.totalTrades}</div>
                  <div className="text-gray-400">{language === 'pt' ? 'Operações' : 'Trades'}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">{operationStats.successRate}%</div>
                  <div className="text-gray-400">{language === 'pt' ? 'Taxa de Sucesso' : 'Success Rate'}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">${operationStats.totalProfit.toLocaleString()}</div>
                  <div className="text-gray-400">{language === 'pt' ? 'Lucro Total' : 'Total Profit'}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">{operationStats.activeUsers}</div>
                  <div className="text-gray-400">{language === 'pt' ? 'Usuários Ativos' : 'Active Users'}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section id="demo" className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                {language === 'pt' ? 'Veja o Bot em Ação' : 'See the Bot in Action'}
              </h2>
              <p className="text-gray-300 text-lg">
                {language === 'pt' 
                  ? 'Demonstração em tempo real de como nossa IA opera no mercado'
                  : 'Real-time demonstration of how our AI operates in the market'
                }
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/30">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">
                    {language === 'pt' ? 'Operação em Andamento' : 'Operation in Progress'}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm font-medium">
                      {language === 'pt' ? 'AO VIVO' : 'LIVE'}
                    </span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-slate-800/50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{currentOperation.icon}</span>
                        <div>
                          <h4 className="font-semibold text-lg">{currentOperation.title}</h4>
                          <p className="text-gray-400 text-sm">{currentOperation.subtitle}</p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        currentOperation.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                        currentOperation.color === 'green' ? 'bg-green-500/20 text-green-400' :
                        currentOperation.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {currentOperation.status.toUpperCase()}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h5 className="font-medium mb-2">{language === 'pt' ? 'Detalhes:' : 'Details:'}</h5>
                        <ul className="space-y-1 text-sm text-gray-300">
                          {currentOperation.details.map((detail, index) => (
                            <li key={index}>• {detail}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">{language === 'pt' ? 'Métricas:' : 'Metrics:'}</h5>
                        <div className="space-y-1 text-sm">
                          {Object.entries(currentOperation.metrics).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-gray-400 capitalize">{key}:</span>
                              <span className="text-white">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
                      <div 
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${((currentStep + 1) / operationSteps.length) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>{language === 'pt' ? 'Progresso' : 'Progress'}</span>
                      <span>{currentStep + 1}/{operationSteps.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
