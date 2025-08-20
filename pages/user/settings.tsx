import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../hooks/useLanguage';
import { useToast } from '../../components/Toast';
import UserLayout from '../../components/UserLayout';
import { 
  FiSettings, 
  FiBell, 
  FiGlobe,
  FiCreditCard,
  FiUser,
  FiKey,
  FiSave,
  FiDollarSign,
  FiTrendingUp,
  FiBarChart,
  FiTarget,
  FiPercent,
  FiSliders,
  FiDatabase,
  FiPlus,
  FiTrash2,
  FiCheck,
  FiX,
  FiRefreshCw
} from 'react-icons/fi';

const UserSettings: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const { showToast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('trading');
  
  // Trading Settings - Padrão do sistema (risco médio)
  const [tradingSettings, setTradingSettings] = useState({
    maxLeverage: 5,        // Alavancagem 5x (padrão)
    takeProfit: 15,        // 3x a alavancagem (3 * 5 = 15%)
    stopLoss: 10,          // 2x a alavancagem (2 * 5 = 10%)
    orderValue: 30,        // 30% do saldo na exchange por operação
    riskLevel: 'medium',
    autoTrade: true,
    dailyLossLimit: 10
  });

  // Personal Data
  const [personalData, setPersonalData] = useState({
    fullName: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '+55 11 98765-4321',
    cpf: '123.456.789-10',
    birthDate: '1990-05-15',
    country: 'BR'
  });

  // Banking Data
  const [bankingData, setBankingData] = useState({
    pixKey: 'joao.silva@email.com',
    pixType: 'email',
    bankAccount: {
      bank: '001 - Banco do Brasil',
      agency: '1234-5',
      account: '12345-6',
      accountType: 'corrente'
    }
  });

  // API Keys
  const [apiKeys, setApiKeys] = useState({
    binance: {
      apiKey: '',
      secretKey: '',
      connected: false,
      lastConnection: null
    },
    bybit: {
      apiKey: '',
      secretKey: '',
      connected: false,
      lastConnection: null
    }
  });

  const [showApiForm, setShowApiForm] = useState({ binance: false, bybit: false });
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    trades: true
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTradingChange = (field: string, value: any) => {
    setTradingSettings(prev => {
      const newSettings = { ...prev, [field]: value };
      
      // Aplicar regras de negócio quando alavancagem mudar
      if (field === 'maxLeverage') {
        const leverage = value;
        
        // Ajustar Take Profit para estar dentro do limite (até 5x a alavancagem)
        const maxTakeProfit = leverage * 5;
        if (newSettings.takeProfit > maxTakeProfit) {
          newSettings.takeProfit = leverage * 3; // Padrão: 3x a alavancagem
        }
        
        // Ajustar Stop Loss para estar dentro do limite (2x até 4x a alavancagem)
        const minStopLoss = leverage * 2;
        const maxStopLoss = leverage * 4;
        if (newSettings.stopLoss < minStopLoss || newSettings.stopLoss > maxStopLoss) {
          newSettings.stopLoss = leverage * 2; // Padrão: 2x a alavancagem
        }
      }
      
      return newSettings;
    });
  };

  const handleApiKeySubmit = async (exchange: 'binance' | 'bybit') => {
    // Simulate API key validation
    const keys = apiKeys[exchange];
    if (keys.apiKey && keys.secretKey) {
      setApiKeys(prev => ({
        ...prev,
        [exchange]: {
          ...prev[exchange],
          connected: true,
          lastConnection: new Date().toISOString()
        }
      }));
      setShowApiForm(prev => ({ ...prev, [exchange]: false }));
      showToast(
        language === 'pt' 
          ? `API Key ${exchange} conectada com sucesso!` 
          : `${exchange} API Key connected successfully!`,
        'success'
      );
    }
  };

  const handleDisconnectApi = (exchange: 'binance' | 'bybit') => {
    setApiKeys(prev => ({
      ...prev,
      [exchange]: {
        apiKey: '',
        secretKey: '',
        connected: false,
        lastConnection: null
      }
    }));
    showToast(
      language === 'pt' 
        ? `API Key ${exchange} desconectada` 
        : `${exchange} API Key disconnected`,
      'info'
    );
  };

  const tabs = [
    { id: 'trading', label: language === 'pt' ? 'Trading' : 'Trading', icon: FiTrendingUp },
    { id: 'personal', label: language === 'pt' ? 'Dados Pessoais' : 'Personal Data', icon: FiUser },
    { id: 'banking', label: language === 'pt' ? 'Dados Bancários' : 'Banking Data', icon: FiCreditCard },
    { id: 'apis', label: 'API Keys', icon: FiKey },
    { id: 'notifications', label: language === 'pt' ? 'Notificações' : 'Notifications', icon: FiBell }
  ];

  if (!mounted) {
    return (
      <UserLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-400 mb-4 mx-auto"></div>
            <h2 className="text-2xl font-bold text-white mb-2">CoinBitClub</h2>
            <p className="text-gray-400">{language === 'pt' ? 'Carregando...' : 'Loading...'}</p>
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent mb-2">
            {language === 'pt' ? 'Configurações' : 'Settings'}
          </h1>
          <p className="text-gray-400 text-lg">
            {language === 'pt' ? 'Personalize sua experiência de trading' : 'Customize your trading experience'}
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-8 bg-gray-800/50 p-2 rounded-xl"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-black'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:block">{tab.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Trading Settings Tab */}
          {activeTab === 'trading' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Trading Parameters */}
                <div className="bg-gradient-to-br from-orange-900/30 to-yellow-900/30 backdrop-blur-sm rounded-xl border border-orange-500/30 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <FiSliders className="w-6 h-6 text-orange-400" />
                    <h3 className="text-xl font-bold text-white">
                      {language === 'pt' ? 'Parâmetros de Trading' : 'Trading Parameters'}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        {language === 'pt' ? 'Alavancagem Máxima' : 'Max Leverage'}
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={tradingSettings.maxLeverage}
                          onChange={(e) => handleTradingChange('maxLeverage', parseInt(e.target.value))}
                          className="flex-1 accent-orange-500"
                        />
                        <span className="text-orange-400 font-bold text-lg w-12">{tradingSettings.maxLeverage}x</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        {language === 'pt' ? 'Take Profit (%)' : 'Take Profit (%)'}
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min="5"
                          max={tradingSettings.maxLeverage * 5}
                          step="1"
                          value={tradingSettings.takeProfit}
                          onChange={(e) => handleTradingChange('takeProfit', parseFloat(e.target.value))}
                          className="flex-1 accent-green-500"
                        />
                        <span className="text-green-400 font-bold text-lg w-12">{tradingSettings.takeProfit}%</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        {language === 'pt' ? 'Stop Loss (%)' : 'Stop Loss (%)'}
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min={tradingSettings.maxLeverage * 2}
                          max={tradingSettings.maxLeverage * 4}
                          step="1"
                          value={tradingSettings.stopLoss}
                          onChange={(e) => handleTradingChange('stopLoss', parseFloat(e.target.value))}
                          className="flex-1 accent-red-500"
                        />
                        <span className="text-red-400 font-bold text-lg w-12">{tradingSettings.stopLoss}%</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        {language === 'pt' ? 'Tamanho da Posição (% do Saldo)' : 'Position Size (% of Balance)'}
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min="10"
                          max="50"
                          value={tradingSettings.orderValue}
                          onChange={(e) => handleTradingChange('orderValue', parseInt(e.target.value))}
                          className="flex-1 accent-blue-500"
                        />
                        <span className="text-blue-400 font-bold text-lg w-12">{tradingSettings.orderValue}%</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        {language === 'pt' ? 'Nível de Risco' : 'Risk Level'}
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {['low', 'medium', 'high'].map((level) => (
                          <button
                            key={level}
                            onClick={() => handleTradingChange('riskLevel', level)}
                            className={`p-3 rounded-lg font-medium transition-all ${
                              tradingSettings.riskLevel === level
                                ? level === 'low' ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                                : level === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                                : 'bg-red-500/20 text-red-400 border border-red-500/50'
                                : 'bg-gray-700/50 text-gray-400 border border-gray-600/50 hover:bg-gray-600/50'
                            }`}
                          >
                            {level === 'low' ? (language === 'pt' ? 'Baixo' : 'Low') :
                             level === 'medium' ? (language === 'pt' ? 'Médio' : 'Medium') :
                             (language === 'pt' ? 'Alto' : 'High')}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Configuration Summary */}
                <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-sm rounded-xl border border-blue-500/30 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <FiBarChart className="w-6 h-6 text-blue-400" />
                    <h3 className="text-xl font-bold text-white">
                      {language === 'pt' ? 'Configurações Atuais' : 'Current Settings'}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Alavancagem */}
                    <div className="p-4 bg-black/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-300 text-sm">
                          {language === 'pt' ? 'Alavancagem' : 'Leverage'}
                        </span>
                        <span className="text-orange-400 font-bold text-lg">
                          {tradingSettings.maxLeverage}x
                        </span>
                      </div>
                    </div>

                    {/* Take Profit */}
                    <div className="p-4 bg-black/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-300 text-sm">Take Profit</span>
                        <div className="flex items-center gap-2">
                          <span className="text-green-400 font-bold text-sm">
                            {(tradingSettings.takeProfit / tradingSettings.maxLeverage).toFixed(1)}x
                          </span>
                          <span className="text-gray-500">|</span>
                          <span className="text-green-400 font-bold text-lg">
                            {tradingSettings.takeProfit}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stop Loss */}
                    <div className="p-4 bg-black/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-300 text-sm">Stop Loss</span>
                        <div className="flex items-center gap-2">
                          <span className="text-red-400 font-bold text-sm">
                            {(tradingSettings.stopLoss / tradingSettings.maxLeverage).toFixed(1)}x
                          </span>
                          <span className="text-gray-500">|</span>
                          <span className="text-red-400 font-bold text-lg">
                            {tradingSettings.stopLoss}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Tamanho da Posição */}
                    <div className="p-4 bg-black/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-300 text-sm">
                          {language === 'pt' ? 'Tamanho da Posição' : 'Position Size'}
                        </span>
                        <span className="text-blue-400 font-bold text-lg">
                          {tradingSettings.orderValue}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <p className="text-blue-300 text-sm">
                      <strong>{language === 'pt' ? 'Nota:' : 'Note:'}</strong> {' '}
                      {language === 'pt' 
                        ? 'Configurações dentro dos limites permitidos pelo sistema.'
                        : 'Settings within system allowed limits.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          {/* Personal Data Tab */}
          {activeTab === 'personal' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 backdrop-blur-sm rounded-xl border border-blue-500/30 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <FiUser className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-bold text-white">
                  {language === 'pt' ? 'Dados Pessoais' : 'Personal Data'}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 text-sm mb-2">
                    {language === 'pt' ? 'Nome Completo' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    value={personalData.fullName}
                    onChange={(e) => setPersonalData(prev => ({ ...prev, fullName: e.target.value }))
                    }
                    className="w-full bg-black/20 border border-gray-600 rounded-lg p-3 text-white focus:border-blue-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">Email</label>
                  <input
                    type="email"
                    value={personalData.email}
                    onChange={(e) => setPersonalData(prev => ({ ...prev, email: e.target.value }))
                    }
                    className="w-full bg-black/20 border border-gray-600 rounded-lg p-3 text-white focus:border-blue-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">
                    {language === 'pt' ? 'Telefone' : 'Phone'}
                  </label>
                  <input
                    type="tel"
                    value={personalData.phone}
                    onChange={(e) => setPersonalData(prev => ({ ...prev, phone: e.target.value }))
                    }
                    className="w-full bg-black/20 border border-gray-600 rounded-lg p-3 text-white focus:border-blue-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">CPF</label>
                  <input
                    type="text"
                    value={personalData.cpf}
                    onChange={(e) => setPersonalData(prev => ({ ...prev, cpf: e.target.value }))
                    }
                    className="w-full bg-black/20 border border-gray-600 rounded-lg p-3 text-white focus:border-blue-400 focus:outline-none"
                    placeholder="000.000.000-00"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">
                    {language === 'pt' ? 'Data de Nascimento' : 'Birth Date'}
                  </label>
                  <input
                    type="date"
                    value={personalData.birthDate}
                    onChange={(e) => setPersonalData(prev => ({ ...prev, birthDate: e.target.value }))
                    }
                    className="w-full bg-black/20 border border-gray-600 rounded-lg p-3 text-white focus:border-blue-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">
                    {language === 'pt' ? 'País' : 'Country'}
                  </label>
                  <select 
                    value={personalData.country}
                    onChange={(e) => setPersonalData(prev => ({ ...prev, country: e.target.value }))
                    }
                    className="w-full bg-black/20 border border-gray-600 rounded-lg p-3 text-white focus:border-blue-400 focus:outline-none"
                  >
                    <option value="BR">Brasil</option>
                    <option value="US">United States</option>
                    <option value="EU">Europe</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {/* Banking Data Tab */}
          {activeTab === 'banking' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* PIX Configuration */}
              <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-sm rounded-xl border border-green-500/30 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <FiDollarSign className="w-6 h-6 text-green-400" />
                  <h3 className="text-xl font-bold text-white">
                    {language === 'pt' ? 'Configuração PIX' : 'PIX Configuration'}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      {language === 'pt' ? 'Tipo de Chave PIX' : 'PIX Key Type'}
                    </label>
                    <select 
                      value={bankingData.pixType}
                      onChange={(e) => setBankingData(prev => ({ ...prev, pixType: e.target.value }))
                      }
                      className="w-full bg-black/20 border border-gray-600 rounded-lg p-3 text-white focus:border-green-400 focus:outline-none"
                    >
                      <option value="email">Email</option>
                      <option value="phone">Telefone</option>
                      <option value="cpf">CPF</option>
                      <option value="random">Chave Aleatória</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      {language === 'pt' ? 'Chave PIX' : 'PIX Key'}
                    </label>
                    <input
                      type="text"
                      value={bankingData.pixKey}
                      onChange={(e) => setBankingData(prev => ({ ...prev, pixKey: e.target.value }))
                      }
                      className="w-full bg-black/20 border border-gray-600 rounded-lg p-3 text-white focus:border-green-400 focus:outline-none"
                      placeholder={
                        bankingData.pixType === 'email' ? 'email@exemplo.com' :
                        bankingData.pixType === 'phone' ? '+55 11 99999-9999' :
                        bankingData.pixType === 'cpf' ? '000.000.000-00' :
                        '00000000-0000-0000-0000-000000000000'
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Bank Account */}
              <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-xl border border-purple-500/30 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <FiCreditCard className="w-6 h-6 text-purple-400" />
                  <h3 className="text-xl font-bold text-white">
                    {language === 'pt' ? 'Conta Bancária' : 'Bank Account'}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-gray-300 text-sm mb-2">
                      {language === 'pt' ? 'Banco' : 'Bank'}
                    </label>
                    <select 
                      value={bankingData.bankAccount.bank}
                      onChange={(e) => setBankingData(prev => ({ 
                        ...prev, 
                        bankAccount: { ...prev.bankAccount, bank: e.target.value }
                      }))
                      }
                      className="w-full bg-black/20 border border-gray-600 rounded-lg p-3 text-white focus:border-purple-400 focus:outline-none"
                    >
                      <option value="001 - Banco do Brasil">001 - Banco do Brasil</option>
                      <option value="033 - Santander">033 - Santander</option>
                      <option value="104 - Caixa Econômica">104 - Caixa Econômica</option>
                      <option value="237 - Bradesco">237 - Bradesco</option>
                      <option value="341 - Itaú">341 - Itaú</option>
                      <option value="260 - Nu Pagamentos">260 - Nu Pagamentos</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      {language === 'pt' ? 'Agência' : 'Agency'}
                    </label>
                    <input
                      type="text"
                      value={bankingData.bankAccount.agency}
                      onChange={(e) => setBankingData(prev => ({ 
                        ...prev, 
                        bankAccount: { ...prev.bankAccount, agency: e.target.value }
                      }))
                      }
                      className="w-full bg-black/20 border border-gray-600 rounded-lg p-3 text-white focus:border-purple-400 focus:outline-none"
                      placeholder="0000-0"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      {language === 'pt' ? 'Conta' : 'Account'}
                    </label>
                    <input
                      type="text"
                      value={bankingData.bankAccount.account}
                      onChange={(e) => setBankingData(prev => ({ 
                        ...prev, 
                        bankAccount: { ...prev.bankAccount, account: e.target.value }
                      }))
                      }
                      className="w-full bg-black/20 border border-gray-600 rounded-lg p-3 text-white focus:border-purple-400 focus:outline-none"
                      placeholder="00000-0"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      {language === 'pt' ? 'Tipo de Conta' : 'Account Type'}
                    </label>
                    <select 
                      value={bankingData.bankAccount.accountType}
                      onChange={(e) => setBankingData(prev => ({ 
                        ...prev, 
                        bankAccount: { ...prev.bankAccount, accountType: e.target.value }
                      }))
                      }
                      className="w-full bg-black/20 border border-gray-600 rounded-lg p-3 text-white focus:border-purple-400 focus:outline-none"
                    >
                      <option value="corrente">{language === 'pt' ? 'Conta Corrente' : 'Checking Account'}</option>
                      <option value="poupanca">{language === 'pt' ? 'Poupança' : 'Savings Account'}</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* API Keys Tab */}
          {activeTab === 'apis' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Binance API */}
              <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 backdrop-blur-sm rounded-xl border border-yellow-500/30 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-black font-bold text-sm">B</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">Binance API</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {apiKeys.binance.connected ? (
                      <>
                        <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
                          {language === 'pt' ? 'Conectado' : 'Connected'}
                        </span>
                        <button
                          onClick={() => handleDisconnectApi('binance')}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setShowApiForm(prev => ({ ...prev, binance: true }))
                        }
                        className="bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-lg hover:bg-yellow-500/30 transition-colors flex items-center gap-2"
                      >
                        <FiPlus className="w-4 h-4" />
                        {language === 'pt' ? 'Conectar' : 'Connect'}
                      </button>
                    )}
                  </div>
                </div>

                {apiKeys.binance.connected ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-black/20 rounded-lg">
                      <div className="text-gray-300 text-sm mb-1">API Key</div>
                      <div className="text-white font-mono">****...{apiKeys.binance.apiKey.slice(-8)}</div>
                    </div>
                    <div className="p-3 bg-black/20 rounded-lg">
                      <div className="text-gray-300 text-sm mb-1">
                        {language === 'pt' ? 'Última Conexão' : 'Last Connection'}
                      </div>
                      <div className="text-green-400">
                        {apiKeys.binance.lastConnection && new Date(apiKeys.binance.lastConnection).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ) : showApiForm.binance ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">API Key</label>
                      <input
                        type="text"
                        value={apiKeys.binance.apiKey}
                        onChange={(e) => setApiKeys(prev => ({
                          ...prev,
                          binance: { ...prev.binance, apiKey: e.target.value }
                        }))
                        }
                        className="w-full bg-black/20 border border-gray-600 rounded-lg p-3 text-white focus:border-yellow-400 focus:outline-none font-mono"
                        placeholder="Enter your Binance API Key"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">Secret Key</label>
                      <input
                        type="password"
                        value={apiKeys.binance.secretKey}
                        onChange={(e) => setApiKeys(prev => ({
                          ...prev,
                          binance: { ...prev.binance, secretKey: e.target.value }
                        }))
                        }
                        className="w-full bg-black/20 border border-gray-600 rounded-lg p-3 text-white focus:border-yellow-400 focus:outline-none font-mono"
                        placeholder="Enter your Binance Secret Key"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApiKeySubmit('binance')}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <FiCheck className="w-4 h-4" />
                        {language === 'pt' ? 'Conectar' : 'Connect'}
                      </button>
                      <button
                        onClick={() => setShowApiForm(prev => ({ ...prev, binance: false }))
                        }
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <FiX className="w-4 h-4" />
                        {language === 'pt' ? 'Cancelar' : 'Cancel'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    <FiKey className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>{language === 'pt' ? 'API Binance não conectada' : 'Binance API not connected'}</p>
                  </div>
                )}
              </div>

              {/* Bybit API */}
              <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 backdrop-blur-sm rounded-xl border border-blue-500/30 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xs">By</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">Bybit API</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {apiKeys.bybit.connected ? (
                      <>
                        <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
                          {language === 'pt' ? 'Conectado' : 'Connected'}
                        </span>
                        <button
                          onClick={() => handleDisconnectApi('bybit')}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setShowApiForm(prev => ({ ...prev, bybit: true }))
                        }
                        className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-colors flex items-center gap-2"
                      >
                        <FiPlus className="w-4 h-4" />
                        {language === 'pt' ? 'Conectar' : 'Connect'}
                      </button>
                    )}
                  </div>
                </div>

                {apiKeys.bybit.connected ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-black/20 rounded-lg">
                      <div className="text-gray-300 text-sm mb-1">API Key</div>
                      <div className="text-white font-mono">****...{apiKeys.bybit.apiKey.slice(-8)}</div>
                    </div>
                    <div className="p-3 bg-black/20 rounded-lg">
                      <div className="text-gray-300 text-sm mb-1">
                        {language === 'pt' ? 'Última Conexão' : 'Last Connection'}
                      </div>
                      <div className="text-green-400">
                        {apiKeys.bybit.lastConnection && new Date(apiKeys.bybit.lastConnection).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ) : showApiForm.bybit ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">API Key</label>
                      <input
                        type="text"
                        value={apiKeys.bybit.apiKey}
                        onChange={(e) => setApiKeys(prev => ({
                          ...prev,
                          bybit: { ...prev.bybit, apiKey: e.target.value }
                        }))
                        }
                        className="w-full bg-black/20 border border-gray-600 rounded-lg p-3 text-white focus:border-blue-400 focus:outline-none font-mono"
                        placeholder="Enter your Bybit API Key"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">Secret Key</label>
                      <input
                        type="password"
                        value={apiKeys.bybit.secretKey}
                        onChange={(e) => setApiKeys(prev => ({
                          ...prev,
                          bybit: { ...prev.bybit, secretKey: e.target.value }
                        }))
                        }
                        className="w-full bg-black/20 border border-gray-600 rounded-lg p-3 text-white focus:border-blue-400 focus:outline-none font-mono"
                        placeholder="Enter your Bybit Secret Key"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApiKeySubmit('bybit')}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <FiCheck className="w-4 h-4" />
                        {language === 'pt' ? 'Conectar' : 'Connect'}
                      </button>
                      <button
                        onClick={() => setShowApiForm(prev => ({ ...prev, bybit: false }))
                        }
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <FiX className="w-4 h-4" />
                        {language === 'pt' ? 'Cancelar' : 'Cancel'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    <FiKey className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>{language === 'pt' ? 'API Bybit não conectada' : 'Bybit API not connected'}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 backdrop-blur-sm rounded-xl border border-indigo-500/30 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <FiBell className="w-6 h-6 text-indigo-400" />
                <h3 className="text-xl font-bold text-white">
                  {language === 'pt' ? 'Preferências de Notificação' : 'Notification Preferences'}
                </h3>
              </div>

              <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-gray-600/30">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${value ? 'bg-green-400' : 'bg-gray-600'}`}></div>
                      <div>
                        <div className="text-white font-medium">
                          {key === 'email' ? 'Email' :
                           key === 'sms' ? 'SMS/WhatsApp' :
                           key === 'push' ? 'Push Notifications' : 
                           language === 'pt' ? 'Alertas de Operações' : 'Trade Alerts'}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {key === 'email' ? (language === 'pt' ? 'Relatórios e atualizações por email' : 'Reports and updates via email') :
                           key === 'sms' ? (language === 'pt' ? 'Alertas importantes via SMS' : 'Important alerts via SMS') :
                           key === 'push' ? (language === 'pt' ? 'Notificações no navegador' : 'Browser notifications') :
                           language === 'pt' ? 'Resultado de operações em tempo real' : 'Real-time operation results'}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setNotifications(prev => ({ ...prev, [key]: !value }))
                      }
                      className={`w-12 h-6 rounded-full relative transition-all duration-300 ${
                        value ? 'bg-indigo-500' : 'bg-gray-600'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-300 ${
                        value ? 'translate-x-7' : 'translate-x-1'
                      }`}></div>
                    </button>
                  </div>
                ))}

                <div className="mt-6 p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
                  <h4 className="text-indigo-300 font-medium mb-2">
                    {language === 'pt' ? 'Configurações Avançadas' : 'Advanced Settings'}
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">
                        {language === 'pt' ? 'Frequência de relatórios' : 'Report frequency'}
                      </span>
                      <select className="bg-black/20 border border-gray-600 rounded px-3 py-1 text-white text-sm">
                        <option value="daily">{language === 'pt' ? 'Diário' : 'Daily'}</option>
                        <option value="weekly">{language === 'pt' ? 'Semanal' : 'Weekly'}</option>
                        <option value="monthly">{language === 'pt' ? 'Mensal' : 'Monthly'}</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">
                        {language === 'pt' ? 'Notificar apenas lucros acima de' : 'Notify only profits above'}
                      </span>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          defaultValue="5"
                          className="w-16 bg-black/20 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                        />
                        <span className="text-gray-400 text-sm">%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 flex justify-center gap-4"
        >
          <button className="px-8 py-3 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded-xl transition-colors">
            {language === 'pt' ? 'Cancelar' : 'Cancel'}
          </button>
          <button 
            onClick={() => showToast(
              language === 'pt' ? 'Configurações salvas com sucesso!' : 'Settings saved successfully!',
              'success'
            )}
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-bold rounded-xl transition-all flex items-center gap-2"
          >
            <FiSave className="w-5 h-5" />
            {language === 'pt' ? 'Salvar Configurações' : 'Save Settings'}
          </button>
        </motion.div>
      </div>
    </UserLayout>
  );
};

export default UserSettings;
