import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

export default function HomeSimple() {
  const [currentLanguage, setCurrentLanguage] = useState('pt');
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* SEÇÃO 1: Hero Principal Simplificado */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Conteúdo Principal - Esquerda */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left space-y-8"
            >
              {/* Título Principal */}
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight">
                  MARKETBOT
                </h1>
                <h2 className="text-2xl lg:text-4xl font-bold text-yellow-400 leading-tight">
                  a IA que transforma sinais em LUCRO EM DÓLAR!
                </h2>
              </div>

              {/* Proposta de Valor */}
              <div className="relative">
                <div className="relative bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-lg border-2 border-green-500/30 rounded-3xl p-8">
                  <p className="text-xl sm:text-2xl font-bold text-green-400 text-center leading-relaxed">
                    O robô de trade automatizado que SÓ LUCRA SE VOCÊ LUCRAR!
                  </p>
                </div>
              </div>

              {/* CTA Principal */}
              <div className="space-y-6">
                <motion.button
                  whileHover={{ scale: 1.05, y: -10 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/cadastro-new')}
                  className="relative group overflow-hidden w-full"
                >
                  <div className="relative bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-black text-2xl lg:text-3xl px-16 py-8 rounded-3xl transition-all duration-300 shadow-2xl">
                    <span className="flex items-center justify-center space-x-4">
                      <span className="text-3xl">🚀</span>
                      <span>Comece Agora</span>
                      <span className="text-3xl">💰</span>
                    </span>
                  </div>
                </motion.button>
                
                <p className="text-slate-400 text-center text-lg font-medium">
                  ✨ Grátis • ⚡ Sem compromisso • 🎯 Resultados em 2 minutos
                </p>
              </div>
            </motion.div>

            {/* Demo Placeholder - Direita */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="relative max-w-xl mx-auto">
                <div className="relative bg-slate-800/70 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-2xl">
                  <div className="text-center py-20">
                    <div className="text-6xl mb-4">🤖</div>
                    <h3 className="text-2xl font-bold text-white mb-2">Demo do Robot</h3>
                    <p className="text-slate-400">Funcionando em tempo real</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
          </div>
        </div>
      </section>

      {/* SEÇÃO 2: Operação do Robô em Tempo Real */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
              Operação do Robô em Tempo Real
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Acompanhe cada etapa do processo automatizado
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <div className="relative bg-slate-900/80 backdrop-blur-lg border border-slate-700/50 rounded-3xl p-8 lg:p-12">
              
              {/* Header da Operação */}
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-700/50">
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-bold text-lg">
                    Sistema Ativo - Online 24/7
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 text-sm">Ciclo Atual</p>
                  <p className="text-yellow-400 font-bold text-2xl">#18</p>
                </div>
              </div>

              {/* Etapas da Operação */}
              <div className="space-y-6">
                {/* Leitura de Mercado */}
                <div className="flex items-center space-x-6 p-6 bg-blue-500/10 border border-blue-500/30 rounded-2xl">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-blue-400 font-bold text-lg mb-2">LEITURA DE MERCADO</h3>
                    <p className="text-slate-300">
                      Analisando RSI: 21 (Oversold) | MACD: Bearish Cross | Volume: +63%
                    </p>
                  </div>
                </div>

                {/* Sinal Detectado */}
                <div className="flex items-center space-x-6 p-6 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-yellow-400 font-bold text-lg mb-2">SINAL DE COMPRA/VENDA</h3>
                    <p className="text-slate-300">
                      Sinal SHORT detectado! Venda: BTC/USDT com alta probabilidade
                    </p>
                  </div>
                </div>

                {/* Resultado Final */}
                <div className="flex items-center space-x-6 p-6 bg-green-500/20 border border-green-500/50 rounded-2xl">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-green-400 font-bold text-lg mb-2">RESULTADO (Lucro/Prejuízo)</h3>
                    <p className="text-green-400 font-bold text-xl">
                      ✅ LUCRO: +8.45% | Valor: +$5279.56 | Tempo: 1h 50min
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
