import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../hooks/useLanguage';
import AdminLayout from '../../components/AdminLayout';
import { 
  FiSettings, 
  FiShield,
  FiDatabase,
  FiKey,
  FiGlobe,
  FiUser,
  FiCreditCard,
  FiBarChart,
  FiAlertTriangle
} from 'react-icons/fi';

const AdminSettings: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState({
    security: {
      twoFactor: true,
      passwordExpiry: 90,
      sessionTimeout: 30,
      ipWhitelist: false
    },
    platform: {
      maintenanceMode: false,
      registrationOpen: true,
      tradingEnabled: true,
      withdrawalEnabled: true,
      maxDailyWithdrawal: 50000,
      minDeposit: 100
    },
    fees: {
      depositFee: 0,
      withdrawalFee: 2.5,
      tradingFee: 0.1,
      affiliateCommission: 3.0
    }
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = (section: string, key: string) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: !prev[section][key]
      }
    }));
  };

  const handleNumberChange = (section: string, key: string, value: number) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  if (!mounted) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-400 mb-4 mx-auto"></div>
            <h2 className="text-2xl font-bold text-white mb-2">CoinBitClub Admin</h2>
            <p className="text-gray-400">{language === 'pt' ? 'Carregando...' : 'Loading...'}</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            {language === 'pt' ? 'Configurações do Sistema' : 'System Settings'}
          </h1>
          <p className="text-gray-400">
            {language === 'pt' ? 'Gerencie todas as configurações da plataforma' : 'Manage all platform settings'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Security Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-red-900/40 to-red-800/30 backdrop-blur-sm rounded-xl border border-red-500/30 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <FiShield className="w-6 h-6 text-red-400" />
              <h2 className="text-xl font-bold text-white">
                {language === 'pt' ? 'Segurança' : 'Security'}
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                <div>
                  <div className="text-white font-medium">2FA</div>
                  <div className="text-gray-400 text-sm">
                    {language === 'pt' ? 'Autenticação de dois fatores' : 'Two-factor authentication'}
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('security', 'twoFactor')}
                  className={`w-12 h-6 rounded-full relative transition-colors ${
                    settings.security.twoFactor ? 'bg-red-500' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                    settings.security.twoFactor ? 'translate-x-7' : 'translate-x-1'
                  }`}></div>
                </button>
              </div>

              <div className="p-3 bg-black/20 rounded-lg">
                <div className="text-white font-medium mb-2">
                  {language === 'pt' ? 'Expiração de Senha (dias)' : 'Password Expiry (days)'}
                </div>
                <input
                  type="number"
                  value={settings.security.passwordExpiry}
                  onChange={(e) => handleNumberChange('security', 'passwordExpiry', parseInt(e.target.value))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
                />
              </div>

              <div className="p-3 bg-black/20 rounded-lg">
                <div className="text-white font-medium mb-2">
                  {language === 'pt' ? 'Timeout de Sessão (min)' : 'Session Timeout (min)'}
                </div>
                <input
                  type="number"
                  value={settings.security.sessionTimeout}
                  onChange={(e) => handleNumberChange('security', 'sessionTimeout', parseInt(e.target.value))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                <div>
                  <div className="text-white font-medium">IP Whitelist</div>
                  <div className="text-gray-400 text-sm">
                    {language === 'pt' ? 'Restringir por IP' : 'Restrict by IP'}
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('security', 'ipWhitelist')}
                  className={`w-12 h-6 rounded-full relative transition-colors ${
                    settings.security.ipWhitelist ? 'bg-red-500' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                    settings.security.ipWhitelist ? 'translate-x-7' : 'translate-x-1'
                  }`}></div>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Platform Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-green-900/40 to-green-800/30 backdrop-blur-sm rounded-xl border border-green-500/30 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <FiSettings className="w-6 h-6 text-green-400" />
              <h2 className="text-xl font-bold text-white">
                {language === 'pt' ? 'Plataforma' : 'Platform'}
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                <div>
                  <div className="text-white font-medium">
                    {language === 'pt' ? 'Modo Manutenção' : 'Maintenance Mode'}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {language === 'pt' ? 'Desabilitar acesso público' : 'Disable public access'}
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('platform', 'maintenanceMode')}
                  className={`w-12 h-6 rounded-full relative transition-colors ${
                    settings.platform.maintenanceMode ? 'bg-yellow-500' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                    settings.platform.maintenanceMode ? 'translate-x-7' : 'translate-x-1'
                  }`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                <div>
                  <div className="text-white font-medium">
                    {language === 'pt' ? 'Cadastros Abertos' : 'Registration Open'}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {language === 'pt' ? 'Permitir novos usuários' : 'Allow new users'}
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('platform', 'registrationOpen')}
                  className={`w-12 h-6 rounded-full relative transition-colors ${
                    settings.platform.registrationOpen ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                    settings.platform.registrationOpen ? 'translate-x-7' : 'translate-x-1'
                  }`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                <div>
                  <div className="text-white font-medium">
                    {language === 'pt' ? 'Trading Habilitado' : 'Trading Enabled'}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {language === 'pt' ? 'Permitir operações' : 'Allow operations'}
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('platform', 'tradingEnabled')}
                  className={`w-12 h-6 rounded-full relative transition-colors ${
                    settings.platform.tradingEnabled ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                    settings.platform.tradingEnabled ? 'translate-x-7' : 'translate-x-1'
                  }`}></div>
                </button>
              </div>

              <div className="p-3 bg-black/20 rounded-lg">
                <div className="text-white font-medium mb-2">
                  {language === 'pt' ? 'Saque Máximo Diário ($)' : 'Max Daily Withdrawal ($)'}
                </div>
                <input
                  type="number"
                  value={settings.platform.maxDailyWithdrawal}
                  onChange={(e) => handleNumberChange('platform', 'maxDailyWithdrawal', parseInt(e.target.value))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
                />
              </div>

              <div className="p-3 bg-black/20 rounded-lg">
                <div className="text-white font-medium mb-2">
                  {language === 'pt' ? 'Depósito Mínimo ($)' : 'Minimum Deposit ($)'}
                </div>
                <input
                  type="number"
                  value={settings.platform.minDeposit}
                  onChange={(e) => handleNumberChange('platform', 'minDeposit', parseInt(e.target.value))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
                />
              </div>
            </div>
          </motion.div>

          {/* Fee Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-purple-900/40 to-purple-800/30 backdrop-blur-sm rounded-xl border border-purple-500/30 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <FiCreditCard className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-bold text-white">
                {language === 'pt' ? 'Taxas e Comissões' : 'Fees & Commissions'}
              </h2>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-black/20 rounded-lg">
                <div className="text-white font-medium mb-2">
                  {language === 'pt' ? 'Taxa de Depósito (%)' : 'Deposit Fee (%)'}
                </div>
                <input
                  type="number"
                  step="0.1"
                  value={settings.fees.depositFee}
                  onChange={(e) => handleNumberChange('fees', 'depositFee', parseFloat(e.target.value))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
                />
              </div>

              <div className="p-3 bg-black/20 rounded-lg">
                <div className="text-white font-medium mb-2">
                  {language === 'pt' ? 'Taxa de Saque (%)' : 'Withdrawal Fee (%)'}
                </div>
                <input
                  type="number"
                  step="0.1"
                  value={settings.fees.withdrawalFee}
                  onChange={(e) => handleNumberChange('fees', 'withdrawalFee', parseFloat(e.target.value))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
                />
              </div>

              <div className="p-3 bg-black/20 rounded-lg">
                <div className="text-white font-medium mb-2">
                  {language === 'pt' ? 'Taxa de Trading (%)' : 'Trading Fee (%)'}
                </div>
                <input
                  type="number"
                  step="0.01"
                  value={settings.fees.tradingFee}
                  onChange={(e) => handleNumberChange('fees', 'tradingFee', parseFloat(e.target.value))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
                />
              </div>

              <div className="p-3 bg-black/20 rounded-lg">
                <div className="text-white font-medium mb-2">
                  {language === 'pt' ? 'Comissão de Afiliado (%)' : 'Affiliate Commission (%)'}
                </div>
                <input
                  type="number"
                  step="0.1"
                  value={settings.fees.affiliateCommission}
                  onChange={(e) => handleNumberChange('fees', 'affiliateCommission', parseFloat(e.target.value))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
                />
              </div>
            </div>
          </motion.div>

          {/* Language & General */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-yellow-900/40 to-yellow-800/30 backdrop-blur-sm rounded-xl border border-yellow-500/30 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <FiGlobe className="w-6 h-6 text-yellow-400" />
              <h2 className="text-xl font-bold text-white">
                {language === 'pt' ? 'Geral' : 'General'}
              </h2>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-black/20 rounded-lg">
                <div className="text-white font-medium mb-2">
                  {language === 'pt' ? 'Idioma da Interface' : 'Interface Language'}
                </div>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'pt' | 'en')}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
                >
                  <option value="pt">Português</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div className="p-3 bg-black/20 rounded-lg">
                <div className="text-white font-medium mb-2">
                  {language === 'pt' ? 'Timezone' : 'Timezone'}
                </div>
                <select className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white">
                  <option value="America/Sao_Paulo">São Paulo (UTC-3)</option>
                  <option value="America/New_York">New York (UTC-5)</option>
                  <option value="Europe/London">London (UTC+0)</option>
                </select>
              </div>

              <div className="p-4 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <FiAlertTriangle className="w-5 h-5 text-yellow-400" />
                  <div className="text-yellow-400 font-medium">
                    {language === 'pt' ? 'Atenção' : 'Warning'}
                  </div>
                </div>
                <p className="text-yellow-300 text-sm">
                  {language === 'pt' 
                    ? 'Alterações nas configurações de segurança e taxas podem afetar todos os usuários. Proceda com cuidado.'
                    : 'Changes to security settings and fees may affect all users. Proceed with caution.'
                  }
                </p>
              </div>
            </div>
          </motion.div>

          {/* System Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-slate-900/40 to-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-500/30 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <FiDatabase className="w-6 h-6 text-slate-400" />
              <h2 className="text-xl font-bold text-white">
                {language === 'pt' ? 'Status do Sistema' : 'System Status'}
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                <div className="text-white font-medium">Database</div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400 text-sm">Online</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                <div className="text-white font-medium">API Server</div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400 text-sm">Operational</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                <div className="text-white font-medium">Trading Engine</div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400 text-sm">Active</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                <div className="text-white font-medium">Payment Gateway</div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-yellow-400 text-sm">Maintenance</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex justify-center"
        >
          <button className="px-8 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold rounded-lg hover:from-red-600 hover:to-pink-700 transition-all">
            {language === 'pt' ? 'Salvar Configurações' : 'Save Settings'}
          </button>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
