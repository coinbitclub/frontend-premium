'use client';

import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { motion } from 'framer-motion';
import { FiDollarSign, FiCreditCard, FiGift, FiUsers, FiSettings, FiTrendingUp, FiCheck, FiStar, FiArrowUp } from 'react-icons/fi';
import { useLanguage } from '../../hooks/useLanguage';
import StandardLayout from '../../components/StandardLayout';

const UserAccount: NextPage = () => {
  const { language, t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  
  // Estados para modais - funcionalidades de afiliado removidas para perfil USER
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  
  // Estados para formulários
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [couponCode, setCouponCode] = useState('');
  
  // Dados simulados
  const userBalance = 2450.75;
  const bonusBalance = 150.00;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400 mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">CoinBitClub</h2>
          <p className="text-gray-400">{t('common.loading')}...</p>
        </div>
      </div>
    );
  }

  return (
    <StandardLayout title="Minha Conta">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Minha Conta
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Gerencie seus planos, saldos e configurações com facilidade e segurança
            </p>
          </div>

          {/* Saldos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 rounded-2xl transform transition-transform group-hover:scale-105"></div>
              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white">Saldo Principal</h3>
                  </div>
                  <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <p className="text-4xl font-black text-white">R$ {userBalance.toFixed(2)}</p>
                  <p className="text-green-100 text-sm font-medium">Disponível para saque imediato</p>
                </div>
              </div>
            </div>
            
            <div className="group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 rounded-2xl transform transition-transform group-hover:scale-105"></div>
              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white">Saldo Bônus</h3>
                  </div>
                  <div className="w-3 h-3 bg-blue-300 rounded-full animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <p className="text-4xl font-black text-white">R$ {bonusBalance.toFixed(2)}</p>
                  <p className="text-blue-100 text-sm font-medium">Créditos promocionais ativos</p>
                </div>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <button className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-lg font-bold text-gray-800 dark:text-white group-hover:text-white transition-colors duration-300">Recarga</span>
              </div>
            </button>
            
            <button className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <span className="text-lg font-bold text-gray-800 dark:text-white group-hover:text-white transition-colors duration-300">Saque</span>
              </div>
            </button>
            
            <button className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <span className="text-lg font-bold text-gray-800 dark:text-white group-hover:text-white transition-colors duration-300">Cupom</span>
              </div>
            </button>
          </div>

          {/* Planos Ativos */}
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                Meus Planos
              </h2>
              <p className="text-indigo-100">Escolha o plano ideal para maximizar seus resultados</p>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Plano Brasil PRO */}
                <div className="group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-green-600 rounded-2xl transform rotate-1 group-hover:rotate-0 transition-transform duration-300"></div>
                  <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border-2 border-emerald-200 dark:border-emerald-800 transform -rotate-1 group-hover:rotate-0 transition-transform duration-300">
                    <div className="flex justify-between items-start mb-6">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Brasil PRO</h3>
                        </div>
                        <div className="flex items-baseline space-x-2">
                          <span className="text-4xl font-black text-emerald-600">R$ 297</span>
                          <span className="text-lg text-gray-500 dark:text-gray-400">/mês</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className="bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                          ✨ ATIVO
                        </span>
                        <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                        <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Trading automático 24/7</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                        <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Sinais premium em tempo real</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                        <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Suporte prioritário VIP</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                        <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Análises de mercado diárias</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Plano Global PRO */}
                <div className="group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl transform -rotate-1 group-hover:rotate-0 transition-transform duration-300"></div>
                  <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border-2 border-blue-200 dark:border-blue-800 transform rotate-1 group-hover:rotate-0 transition-transform duration-300">
                    <div className="flex justify-between items-start mb-6">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Global PRO</h3>
                        </div>
                        <div className="flex items-baseline space-x-2">
                          <span className="text-4xl font-black text-blue-600">$50</span>
                          <span className="text-lg text-gray-500 dark:text-gray-400">/mês</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg transform hover:scale-105 transition-all duration-200">
                          🚀 Ativar Agora
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">24/7 Automated Trading</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Real-time Premium Signals</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Priority Support</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Daily Market Analysis</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StandardLayout>
  );
};

export default UserAccount;
