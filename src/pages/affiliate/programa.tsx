import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import { PageTracker } from '../../components/PageTracker';
import { useTracking } from '../../hooks/useTracking';
import AffiliateLayout from '../../components/AffiliateLayout';
import {
  UserPlusIcon,
  MagnifyingGlassIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
  ArrowDownTrayIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  DevicePhoneMobileIcon,
} from '@heroicons/react/24/outline';

// Mock data
const mockSearchResults = [
  { 
    id: 1, 
    phone: '+55 21 99999-9999', 
    name: 'João Silva', 
    email: 'joao@email.com', 
    status: 'AVAILABLE',
    plan: 'Premium',
    joinDate: '2025-08-10' 
  },
  { 
    id: 2, 
    phone: '+55 11 88888-8888', 
    name: 'Maria Santos', 
    email: 'maria@email.com', 
    status: 'ALREADY_LINKED',
    plan: 'VIP',
    joinDate: '2025-08-12' 
  },
];

const mockWithdrawals = [
  {
    id: 1,
    amount: 250.00,
    method: 'PIX',
    fee: 8.50,
    status: 'PENDING',
    requestDate: '2025-08-15',
    processDate: null,
    pixKey: 'joao@email.com'
  },
  {
    id: 2,
    amount: 100.00,
    method: 'DEPOSIT',
    fee: 2.00,
    status: 'COMPLETED',
    requestDate: '2025-08-10',
    processDate: '2025-08-12',
    account: '****1234'
  },
];

export default function AffiliatePrograma() {
  const [activeTab, setActiveTab] = useState<'link' | 'withdraw'>('link');
  const [phoneSearch, setPhoneSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState<'PIX' | 'DEPOSIT'>('PIX');
  const [pixKey, setPixKey] = useState('');
  const { trackPageView } = useTracking();

  useEffect(() => {
    trackPageView('Programa Afiliados', {
      page_category: 'affiliate_programa',
      user_type: 'affiliate'
    });
  }, [trackPageView]);

  const searchUser = async () => {
    if (!phoneSearch.trim()) return;
    
    setIsSearching(true);
    // Simular busca
    setTimeout(() => {
      const results = mockSearchResults.filter(user => 
        user.phone.includes(phoneSearch)
      );
      setSearchResults(results);
      setIsSearching(false);
    }, 1000);
  };

  const linkAffiliate = (userId: number) => {
    alert('Usuário vinculado com sucesso!');
    // Aqui faria a integração real
  };

  const requestWithdraw = () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) < 50) {
      alert('Valor mínimo para saque é R$ 50,00');
      return;
    }

    if (withdrawMethod === 'PIX' && !pixKey) {
      alert('Chave PIX é obrigatória');
      return;
    }

    alert('Solicitação de saque enviada com sucesso!');
    setWithdrawAmount('');
    setPixKey('');
  };

  const getFeeAmount = () => {
    return withdrawMethod === 'PIX' ? 8.50 : 2.00;
  };

  const getFinalAmount = () => {
    const amount = parseFloat(withdrawAmount) || 0;
    const fee = getFeeAmount();
    return Math.max(0, amount - fee);
  };

  return (
    <AffiliateLayout
      title="Programa de Afiliados - CoinBitClub"
    >
      <PageTracker 
        pageTitle="Programa Afiliados"
        pageCategory="affiliate_programa"
        customParams={{ user_type: 'affiliate' }}
      />

      <div className="p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-amber-400 glow-gold">Programa de Afiliados</h1>
            <p className="text-blue-400 glow-blue">Vincule usuários e solicite saques</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-black/30 rounded-lg p-1 border border-gray-700/50">
            <button
              onClick={() => setActiveTab('link')}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md transition-all ${
                activeTab === 'link'
                  ? 'bg-gradient-to-r from-blue-500/20 to-pink-500/20 text-blue-400 border border-blue-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <UserPlusIcon className="h-5 w-5" />
              <span>Vincular Usuário</span>
            </button>
            <button
              onClick={() => setActiveTab('withdraw')}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md transition-all ${
                activeTab === 'withdraw'
                  ? 'bg-gradient-to-r from-amber-500/20 to-pink-500/20 text-amber-400 border border-amber-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <ArrowDownTrayIcon className="h-5 w-5" />
              <span>Solicitar Saque</span>
            </button>
          </div>
        </div>

        {/* Vincular Usuário */}
        {activeTab === 'link' && (
          <div className="space-y-6">
            <Card className="bg-black border border-blue-500 rounded-lg p-6 shadow-lg hover:shadow-blue-400/20 transition-all">
              <h3 className="text-xl font-semibold text-blue-500 glow-blue mb-4">
                Vincular Usuário por Telefone
              </h3>
              
              <div className="flex space-x-4 mb-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-blue-400 mb-2">
                    Número de Telefone
                  </label>
                  <div className="relative">
                    <DevicePhoneMobileIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      value={phoneSearch}
                      onChange={(e) => setPhoneSearch(e.target.value)}
                      placeholder="+55 21 99999-9999"
                      className="w-full pl-10 pr-4 py-3 bg-black/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={searchUser}
                    disabled={isSearching || !phoneSearch.trim()}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center space-x-2"
                  >
                    <MagnifyingGlassIcon className="h-5 w-5" />
                    <span>{isSearching ? 'Buscando...' : 'Buscar'}</span>
                  </button>
                </div>
              </div>

              {/* Resultados da Busca */}
              {searchResults.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-blue-400">Resultados:</h4>
                  {searchResults.map((user) => (
                    <div key={user.id} className="bg-black/50 border border-gray-700/50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-pink-500 flex items-center justify-center">
                              <span className="text-white font-bold">{user.name.charAt(0)}</span>
                            </div>
                            <div>
                              <p className="text-white font-semibold">{user.name}</p>
                              <p className="text-gray-400 text-sm">{user.email}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-400">Telefone:</span>
                              <p className="text-blue-400">{user.phone}</p>
                            </div>
                            <div>
                              <span className="text-gray-400">Plano:</span>
                              <p className="text-amber-400">{user.plan}</p>
                            </div>
                            <div>
                              <span className="text-gray-400">Cadastro:</span>
                              <p className="text-pink-400">{new Date(user.joinDate).toLocaleDateString('pt-BR')}</p>
                            </div>
                          </div>
                        </div>
                        <div className="ml-6">
                          {user.status === 'AVAILABLE' ? (
                            <button
                              onClick={() => linkAffiliate(user.id)}
                              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-lg font-semibold transition-all flex items-center space-x-2"
                            >
                              <CheckCircleIcon className="h-5 w-5" />
                              <span>Vincular</span>
                            </button>
                          ) : (
                            <div className="flex items-center space-x-2 text-gray-400">
                              <XCircleIcon className="h-5 w-5" />
                              <span>Já vinculado</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Solicitar Saque */}
        {activeTab === 'withdraw' && (
          <div className="space-y-6">
            <Card className="bg-black border border-amber-500 rounded-lg p-6 shadow-lg hover:shadow-amber-400/20 transition-all">
              <h3 className="text-xl font-semibold text-amber-500 glow-gold mb-4">
                Solicitar Saque
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-amber-400 mb-2">
                    Valor do Saque (R$)
                  </label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="50.00"
                    min="50"
                    step="0.01"
                    className="w-full px-4 py-3 bg-black/50 border border-amber-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-400"
                  />
                  <p className="text-xs text-gray-400 mt-1">Valor mínimo: R$ 50,00</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-amber-400 mb-2">
                    Método de Pagamento
                  </label>
                  <select
                    value={withdrawMethod}
                    onChange={(e) => setWithdrawMethod(e.target.value as 'PIX' | 'DEPOSIT')}
                    className="w-full px-4 py-3 bg-black/50 border border-amber-500/30 rounded-lg text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="PIX">PIX (Taxa: R$ 8,50)</option>
                    <option value="DEPOSIT">Depósito (Taxa: R$ 2,00)</option>
                  </select>
                </div>
              </div>

              {withdrawMethod === 'PIX' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-amber-400 mb-2">
                    Chave PIX
                  </label>
                  <input
                    type="text"
                    value={pixKey}
                    onChange={(e) => setPixKey(e.target.value)}
                    placeholder="seu@email.com ou CPF ou telefone"
                    className="w-full px-4 py-3 bg-black/50 border border-amber-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-400"
                  />
                </div>
              )}

              {/* Resumo do Saque */}
              {withdrawAmount && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-6">
                  <h4 className="text-amber-400 font-semibold mb-3">Resumo da Solicitação:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Valor solicitado:</span>
                      <span className="text-white">R$ {parseFloat(withdrawAmount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Taxa ({withdrawMethod}):</span>
                      <span className="text-red-400">- R$ {getFeeAmount().toFixed(2)}</span>
                    </div>
                    <div className="border-t border-amber-500/30 pt-2 flex justify-between font-semibold">
                      <span className="text-amber-400">Valor líquido:</span>
                      <span className="text-amber-400">R$ {getFinalAmount().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={requestWithdraw}
                disabled={!withdrawAmount || parseFloat(withdrawAmount) < 50 || (withdrawMethod === 'PIX' && !pixKey)}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-gray-600 disabled:to-gray-700 text-white py-3 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2"
              >
                <BanknotesIcon className="h-5 w-5" />
                <span>Solicitar Saque</span>
              </button>
            </Card>

            {/* Histórico de Saques */}
            <Card className="bg-black border border-pink-500 rounded-lg p-6 shadow-lg hover:shadow-pink-400/20 transition-all">
              <h3 className="text-xl font-semibold text-pink-500 glow-pink mb-4">
                Histórico de Saques
              </h3>

              <div className="space-y-3">
                {mockWithdrawals.map((withdrawal) => (
                  <div key={withdrawal.id} className="bg-black/50 border border-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          withdrawal.status === 'COMPLETED' ? 'bg-green-400' :
                          withdrawal.status === 'PENDING' ? 'bg-yellow-400' : 'bg-red-400'
                        }`}></div>
                        <span className="text-white font-semibold">R$ {withdrawal.amount.toFixed(2)}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-blue-400">{withdrawal.method}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        withdrawal.status === 'COMPLETED' ? 'bg-green-900/50 text-green-400 border border-green-500' :
                        withdrawal.status === 'PENDING' ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-500' :
                        'bg-red-900/50 text-red-400 border border-red-500'
                      }`}>
                        {withdrawal.status === 'COMPLETED' ? 'Concluído' :
                         withdrawal.status === 'PENDING' ? 'Pendente' : 'Cancelado'}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Solicitado:</span>
                        <p className="text-pink-400">{new Date(withdrawal.requestDate).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Taxa:</span>
                        <p className="text-red-400">R$ {withdrawal.fee.toFixed(2)}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Líquido:</span>
                        <p className="text-amber-400">R$ {(withdrawal.amount - withdrawal.fee).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </AffiliateLayout>
  );
}
