/**
 * 👤 ENHANCED USER SETTINGS COMPONENT
 * Comprehensive user settings management with backend integration
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../hooks/useLanguage';
import { useToast } from './Toast';
import UserLayout from './UserLayout';
import { apiService } from '../services/apiService';
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
  FiRefreshCw,
  FiShield,
  FiLock,
  FiEye,
  FiEyeOff
} from 'react-icons/fi';

interface TradingSettings {
  max_leverage: number;
  take_profit_percentage: number;
  stop_loss_percentage: number;
  position_size_percentage: number;
  risk_level: 'low' | 'medium' | 'high';
  auto_trade_enabled: boolean;
  daily_loss_limit_percentage: number;
  max_open_positions: number;
  default_leverage: number;
  stop_loss_multiplier: number;
  take_profit_multiplier: number;
}

interface NotificationSettings {
  email_notifications: boolean;
  sms_notifications: boolean;
  push_notifications: boolean;
  trade_alerts: boolean;
  report_frequency: 'daily' | 'weekly' | 'monthly';
  profit_threshold_percentage: number;
  loss_threshold_percentage: number;
}

interface PersonalSettings {
  language: string;
  timezone: string;
  currency_preference: string;
  theme: 'light' | 'dark' | 'auto';
  date_format: string;
}

interface BankingSettings {
  pix_key: string;
  pix_type: 'email' | 'phone' | 'cpf' | 'random';
  bank_name: string;
  bank_code: string;
  agency: string;
  account: string;
  account_type: 'corrente' | 'poupanca';
  account_holder_name: string;
  cpf: string;
  phone: string;
}

interface SecuritySettings {
  two_factor_enabled: boolean;
  login_notifications: boolean;
  device_management: boolean;
  session_timeout_minutes: number;
  password_change_required: boolean;
}

interface ApiKey {
  id: number;
  exchange: string;
  api_key: string;
  api_secret: string;
  environment: 'testnet' | 'mainnet';
  is_active: boolean;
  last_connection: string;
  connection_status: 'connected' | 'disconnected' | 'error';
}

interface UserPreferences {
  dashboard_layout: any;
  widget_preferences: any;
  chart_preferences: any;
  alert_sounds: boolean;
  auto_refresh: boolean;
  refresh_interval_seconds: number;
}

const UserSettingsEnhanced: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const { showToast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('trading');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Settings state
  const [tradingSettings, setTradingSettings] = useState<TradingSettings | null>(null);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings | null>(null);
  const [personalSettings, setPersonalSettings] = useState<PersonalSettings | null>(null);
  const [bankingSettings, setBankingSettings] = useState<BankingSettings | null>(null);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings | null>(null);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  
  // API Key form state
  const [showApiForm, setShowApiForm] = useState({ binance: false, bybit: false });
  const [newApiKey, setNewApiKey] = useState({
    exchange: '',
    api_key: '',
    api_secret: '',
    passphrase: '',
    environment: 'testnet'
  });

  useEffect(() => {
    setMounted(true);
    loadAllSettings();
  }, []);

  const loadAllSettings = async () => {
    setLoading(true);
    try {
      const response = await apiService.getAllUserSettings();
      if (response.success) {
        const { settings } = response;
        setTradingSettings(settings.trading);
        setNotificationSettings(settings.notifications);
        setPersonalSettings(settings.personal);
        setBankingSettings(settings.banking);
        setSecuritySettings(settings.security);
        setApiKeys(settings.apiKeys || []);
        setPreferences(settings.preferences);
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to load settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const saveTradingSettings = async () => {
    if (!tradingSettings) return;
    
    setSaving(true);
    try {
      const response = await apiService.updateTradingSettings(tradingSettings);
      if (response.success) {
        showToast('Trading settings saved successfully!', 'success');
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to save trading settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const saveNotificationSettings = async () => {
    if (!notificationSettings) return;
    
    setSaving(true);
    try {
      const response = await apiService.updateNotificationSettings(notificationSettings);
      if (response.success) {
        showToast('Notification settings saved successfully!', 'success');
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to save notification settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const savePersonalSettings = async () => {
    if (!personalSettings) return;
    
    setSaving(true);
    try {
      const response = await apiService.updatePersonalSettings(personalSettings);
      if (response.success) {
        showToast('Personal settings saved successfully!', 'success');
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to save personal settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const saveBankingSettings = async () => {
    if (!bankingSettings) return;
    
    setSaving(true);
    try {
      const response = await apiService.updateBankingSettings(bankingSettings);
      if (response.success) {
        showToast('Banking settings saved successfully!', 'success');
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to save banking settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const saveSecuritySettings = async () => {
    if (!securitySettings) return;
    
    setSaving(true);
    try {
      const response = await apiService.updateSecuritySettings(securitySettings);
      if (response.success) {
        showToast('Security settings saved successfully!', 'success');
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to save security settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const addApiKey = async () => {
    setSaving(true);
    try {
      const response = await apiService.addApiKey(newApiKey);
      if (response.success) {
        showToast('API key added successfully!', 'success');
        setNewApiKey({ exchange: '', api_key: '', api_secret: '', passphrase: '', environment: 'testnet' });
        setShowApiForm({ binance: false, bybit: false });
        loadAllSettings(); // Reload to get updated API keys
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to add API key', 'error');
    } finally {
      setSaving(false);
    }
  };

  const deleteApiKey = async (id: number) => {
    setSaving(true);
    try {
      const response = await apiService.deleteApiKey(id.toString());
      if (response.success) {
        showToast('API key deleted successfully!', 'success');
        loadAllSettings(); // Reload to get updated API keys
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to delete API key', 'error');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'trading', label: language === 'pt' ? 'Trading' : 'Trading', icon: FiTrendingUp },
    { id: 'notifications', label: language === 'pt' ? 'Notificações' : 'Notifications', icon: FiBell },
    { id: 'personal', label: language === 'pt' ? 'Dados Pessoais' : 'Personal Data', icon: FiUser },
    { id: 'banking', label: language === 'pt' ? 'Dados Bancários' : 'Banking Data', icon: FiCreditCard },
    { id: 'security', label: language === 'pt' ? 'Segurança' : 'Security', icon: FiShield },
    { id: 'apis', label: 'API Keys', icon: FiKey },
    { id: 'preferences', label: language === 'pt' ? 'Preferências' : 'Preferences', icon: FiSettings }
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

  if (loading) {
    return (
      <UserLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-400 mb-4 mx-auto"></div>
            <h2 className="text-2xl font-bold text-white mb-2">Loading Settings...</h2>
            <p className="text-gray-400">Fetching your personalized settings...</p>
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
            {language === 'pt' ? 'Configurações Avançadas' : 'Advanced Settings'}
          </h1>
          <p className="text-gray-400 text-lg">
            {language === 'pt' ? 'Gerencie todas as suas configurações personalizadas' : 'Manage all your personalized settings'}
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
          {activeTab === 'trading' && tradingSettings && (
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
                          value={tradingSettings.max_leverage}
                          onChange={(e) => setTradingSettings(prev => prev ? { ...prev, max_leverage: parseInt(e.target.value) } : null)}
                          className="flex-1 accent-orange-500"
                        />
                        <span className="text-orange-400 font-bold text-lg w-12">{tradingSettings.max_leverage}x</span>
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
                            onClick={() => setTradingSettings(prev => prev ? { ...prev, risk_level: level as 'low' | 'medium' | 'high' } : null)}
                            className={`p-3 rounded-lg font-medium transition-all ${
                              tradingSettings.risk_level === level
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

                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        {language === 'pt' ? 'Trading Automático' : 'Auto Trading'}
                      </label>
                      <button
                        onClick={() => setTradingSettings(prev => prev ? { ...prev, auto_trade_enabled: !prev.auto_trade_enabled } : null)}
                        className={`w-12 h-6 rounded-full relative transition-all duration-300 ${
                          tradingSettings.auto_trade_enabled ? 'bg-orange-500' : 'bg-gray-600'
                        }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-300 ${
                          tradingSettings.auto_trade_enabled ? 'translate-x-7' : 'translate-x-1'
                        }`}></div>
                      </button>
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
                    <div className="p-4 bg-black/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-300 text-sm">
                          {language === 'pt' ? 'Alavancagem' : 'Leverage'}
                        </span>
                        <span className="text-orange-400 font-bold text-lg">
                          {tradingSettings.max_leverage}x
                        </span>
                      </div>
                    </div>

                    <div className="p-4 bg-black/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-300 text-sm">
                          {language === 'pt' ? 'Nível de Risco' : 'Risk Level'}
                        </span>
                        <span className={`font-bold text-lg ${
                          tradingSettings.risk_level === 'low' ? 'text-green-400' :
                          tradingSettings.risk_level === 'medium' ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {tradingSettings.risk_level}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 bg-black/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-300 text-sm">
                          {language === 'pt' ? 'Trading Automático' : 'Auto Trading'}
                        </span>
                        <span className={`font-bold text-lg ${
                          tradingSettings.auto_trade_enabled ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {tradingSettings.auto_trade_enabled ? 'ON' : 'OFF'}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 bg-black/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-300 text-sm">
                          {language === 'pt' ? 'Posições Máximas' : 'Max Positions'}
                        </span>
                        <span className="text-blue-400 font-bold text-lg">
                          {tradingSettings.max_open_positions}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-center">
                <button
                  onClick={saveTradingSettings}
                  disabled={saving}
                  className="px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-bold rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <FiSave className="w-5 h-5" />
                  {saving ? (language === 'pt' ? 'Salvando...' : 'Saving...') : (language === 'pt' ? 'Salvar Configurações de Trading' : 'Save Trading Settings')}
                </button>
              </div>
            </motion.div>
          )}

          {/* Other tabs would be implemented similarly */}
          {activeTab === 'notifications' && (
            <div className="text-center text-gray-400 py-8">
              <FiBell className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Notification Settings</h3>
              <p>Notification settings will be implemented here</p>
            </div>
          )}

          {activeTab === 'personal' && (
            <div className="text-center text-gray-400 py-8">
              <FiUser className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Personal Settings</h3>
              <p>Personal settings will be implemented here</p>
            </div>
          )}

          {activeTab === 'banking' && (
            <div className="text-center text-gray-400 py-8">
              <FiCreditCard className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Banking Settings</h3>
              <p>Banking settings will be implemented here</p>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="text-center text-gray-400 py-8">
              <FiShield className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Security Settings</h3>
              <p>Security settings will be implemented here</p>
            </div>
          )}

          {activeTab === 'apis' && (
            <div className="text-center text-gray-400 py-8">
              <FiKey className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">API Keys</h3>
              <p>API key management will be implemented here</p>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="text-center text-gray-400 py-8">
              <FiSettings className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">User Preferences</h3>
              <p>User preferences will be implemented here</p>
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
};

export default UserSettingsEnhanced;
 * 👤 ENHANCED USER SETTINGS COMPONENT
 * Comprehensive user settings management with backend integration
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../hooks/useLanguage';
import { useToast } from './Toast';
import UserLayout from './UserLayout';
import { apiService } from '../services/apiService';
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
  FiRefreshCw,
  FiShield,
  FiLock,
  FiEye,
  FiEyeOff
} from 'react-icons/fi';

interface TradingSettings {
  max_leverage: number;
  take_profit_percentage: number;
  stop_loss_percentage: number;
  position_size_percentage: number;
  risk_level: 'low' | 'medium' | 'high';
  auto_trade_enabled: boolean;
  daily_loss_limit_percentage: number;
  max_open_positions: number;
  default_leverage: number;
  stop_loss_multiplier: number;
  take_profit_multiplier: number;
}

interface NotificationSettings {
  email_notifications: boolean;
  sms_notifications: boolean;
  push_notifications: boolean;
  trade_alerts: boolean;
  report_frequency: 'daily' | 'weekly' | 'monthly';
  profit_threshold_percentage: number;
  loss_threshold_percentage: number;
}

interface PersonalSettings {
  language: string;
  timezone: string;
  currency_preference: string;
  theme: 'light' | 'dark' | 'auto';
  date_format: string;
}

interface BankingSettings {
  pix_key: string;
  pix_type: 'email' | 'phone' | 'cpf' | 'random';
  bank_name: string;
  bank_code: string;
  agency: string;
  account: string;
  account_type: 'corrente' | 'poupanca';
  account_holder_name: string;
  cpf: string;
  phone: string;
}

interface SecuritySettings {
  two_factor_enabled: boolean;
  login_notifications: boolean;
  device_management: boolean;
  session_timeout_minutes: number;
  password_change_required: boolean;
}

interface ApiKey {
  id: number;
  exchange: string;
  api_key: string;
  api_secret: string;
  environment: 'testnet' | 'mainnet';
  is_active: boolean;
  last_connection: string;
  connection_status: 'connected' | 'disconnected' | 'error';
}

interface UserPreferences {
  dashboard_layout: any;
  widget_preferences: any;
  chart_preferences: any;
  alert_sounds: boolean;
  auto_refresh: boolean;
  refresh_interval_seconds: number;
}

const UserSettingsEnhanced: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const { showToast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('trading');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Settings state
  const [tradingSettings, setTradingSettings] = useState<TradingSettings | null>(null);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings | null>(null);
  const [personalSettings, setPersonalSettings] = useState<PersonalSettings | null>(null);
  const [bankingSettings, setBankingSettings] = useState<BankingSettings | null>(null);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings | null>(null);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  
  // API Key form state
  const [showApiForm, setShowApiForm] = useState({ binance: false, bybit: false });
  const [newApiKey, setNewApiKey] = useState({
    exchange: '',
    api_key: '',
    api_secret: '',
    passphrase: '',
    environment: 'testnet'
  });

  useEffect(() => {
    setMounted(true);
    loadAllSettings();
  }, []);

  const loadAllSettings = async () => {
    setLoading(true);
    try {
      const response = await apiService.getAllUserSettings();
      if (response.success) {
        const { settings } = response;
        setTradingSettings(settings.trading);
        setNotificationSettings(settings.notifications);
        setPersonalSettings(settings.personal);
        setBankingSettings(settings.banking);
        setSecuritySettings(settings.security);
        setApiKeys(settings.apiKeys || []);
        setPreferences(settings.preferences);
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to load settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const saveTradingSettings = async () => {
    if (!tradingSettings) return;
    
    setSaving(true);
    try {
      const response = await apiService.updateTradingSettings(tradingSettings);
      if (response.success) {
        showToast('Trading settings saved successfully!', 'success');
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to save trading settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const saveNotificationSettings = async () => {
    if (!notificationSettings) return;
    
    setSaving(true);
    try {
      const response = await apiService.updateNotificationSettings(notificationSettings);
      if (response.success) {
        showToast('Notification settings saved successfully!', 'success');
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to save notification settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const savePersonalSettings = async () => {
    if (!personalSettings) return;
    
    setSaving(true);
    try {
      const response = await apiService.updatePersonalSettings(personalSettings);
      if (response.success) {
        showToast('Personal settings saved successfully!', 'success');
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to save personal settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const saveBankingSettings = async () => {
    if (!bankingSettings) return;
    
    setSaving(true);
    try {
      const response = await apiService.updateBankingSettings(bankingSettings);
      if (response.success) {
        showToast('Banking settings saved successfully!', 'success');
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to save banking settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const saveSecuritySettings = async () => {
    if (!securitySettings) return;
    
    setSaving(true);
    try {
      const response = await apiService.updateSecuritySettings(securitySettings);
      if (response.success) {
        showToast('Security settings saved successfully!', 'success');
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to save security settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const addApiKey = async () => {
    setSaving(true);
    try {
      const response = await apiService.addApiKey(newApiKey);
      if (response.success) {
        showToast('API key added successfully!', 'success');
        setNewApiKey({ exchange: '', api_key: '', api_secret: '', passphrase: '', environment: 'testnet' });
        setShowApiForm({ binance: false, bybit: false });
        loadAllSettings(); // Reload to get updated API keys
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to add API key', 'error');
    } finally {
      setSaving(false);
    }
  };

  const deleteApiKey = async (id: number) => {
    setSaving(true);
    try {
      const response = await apiService.deleteApiKey(id.toString());
      if (response.success) {
        showToast('API key deleted successfully!', 'success');
        loadAllSettings(); // Reload to get updated API keys
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to delete API key', 'error');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'trading', label: language === 'pt' ? 'Trading' : 'Trading', icon: FiTrendingUp },
    { id: 'notifications', label: language === 'pt' ? 'Notificações' : 'Notifications', icon: FiBell },
    { id: 'personal', label: language === 'pt' ? 'Dados Pessoais' : 'Personal Data', icon: FiUser },
    { id: 'banking', label: language === 'pt' ? 'Dados Bancários' : 'Banking Data', icon: FiCreditCard },
    { id: 'security', label: language === 'pt' ? 'Segurança' : 'Security', icon: FiShield },
    { id: 'apis', label: 'API Keys', icon: FiKey },
    { id: 'preferences', label: language === 'pt' ? 'Preferências' : 'Preferences', icon: FiSettings }
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

  if (loading) {
    return (
      <UserLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-400 mb-4 mx-auto"></div>
            <h2 className="text-2xl font-bold text-white mb-2">Loading Settings...</h2>
            <p className="text-gray-400">Fetching your personalized settings...</p>
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
            {language === 'pt' ? 'Configurações Avançadas' : 'Advanced Settings'}
          </h1>
          <p className="text-gray-400 text-lg">
            {language === 'pt' ? 'Gerencie todas as suas configurações personalizadas' : 'Manage all your personalized settings'}
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
          {activeTab === 'trading' && tradingSettings && (
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
                          value={tradingSettings.max_leverage}
                          onChange={(e) => setTradingSettings(prev => prev ? { ...prev, max_leverage: parseInt(e.target.value) } : null)}
                          className="flex-1 accent-orange-500"
                        />
                        <span className="text-orange-400 font-bold text-lg w-12">{tradingSettings.max_leverage}x</span>
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
                            onClick={() => setTradingSettings(prev => prev ? { ...prev, risk_level: level as 'low' | 'medium' | 'high' } : null)}
                            className={`p-3 rounded-lg font-medium transition-all ${
                              tradingSettings.risk_level === level
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

                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        {language === 'pt' ? 'Trading Automático' : 'Auto Trading'}
                      </label>
                      <button
                        onClick={() => setTradingSettings(prev => prev ? { ...prev, auto_trade_enabled: !prev.auto_trade_enabled } : null)}
                        className={`w-12 h-6 rounded-full relative transition-all duration-300 ${
                          tradingSettings.auto_trade_enabled ? 'bg-orange-500' : 'bg-gray-600'
                        }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-300 ${
                          tradingSettings.auto_trade_enabled ? 'translate-x-7' : 'translate-x-1'
                        }`}></div>
                      </button>
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
                    <div className="p-4 bg-black/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-300 text-sm">
                          {language === 'pt' ? 'Alavancagem' : 'Leverage'}
                        </span>
                        <span className="text-orange-400 font-bold text-lg">
                          {tradingSettings.max_leverage}x
                        </span>
                      </div>
                    </div>

                    <div className="p-4 bg-black/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-300 text-sm">
                          {language === 'pt' ? 'Nível de Risco' : 'Risk Level'}
                        </span>
                        <span className={`font-bold text-lg ${
                          tradingSettings.risk_level === 'low' ? 'text-green-400' :
                          tradingSettings.risk_level === 'medium' ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {tradingSettings.risk_level}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 bg-black/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-300 text-sm">
                          {language === 'pt' ? 'Trading Automático' : 'Auto Trading'}
                        </span>
                        <span className={`font-bold text-lg ${
                          tradingSettings.auto_trade_enabled ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {tradingSettings.auto_trade_enabled ? 'ON' : 'OFF'}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 bg-black/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-300 text-sm">
                          {language === 'pt' ? 'Posições Máximas' : 'Max Positions'}
                        </span>
                        <span className="text-blue-400 font-bold text-lg">
                          {tradingSettings.max_open_positions}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-center">
                <button
                  onClick={saveTradingSettings}
                  disabled={saving}
                  className="px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-bold rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <FiSave className="w-5 h-5" />
                  {saving ? (language === 'pt' ? 'Salvando...' : 'Saving...') : (language === 'pt' ? 'Salvar Configurações de Trading' : 'Save Trading Settings')}
                </button>
              </div>
            </motion.div>
          )}

          {/* Other tabs would be implemented similarly */}
          {activeTab === 'notifications' && (
            <div className="text-center text-gray-400 py-8">
              <FiBell className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Notification Settings</h3>
              <p>Notification settings will be implemented here</p>
            </div>
          )}

          {activeTab === 'personal' && (
            <div className="text-center text-gray-400 py-8">
              <FiUser className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Personal Settings</h3>
              <p>Personal settings will be implemented here</p>
            </div>
          )}

          {activeTab === 'banking' && (
            <div className="text-center text-gray-400 py-8">
              <FiCreditCard className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Banking Settings</h3>
              <p>Banking settings will be implemented here</p>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="text-center text-gray-400 py-8">
              <FiShield className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Security Settings</h3>
              <p>Security settings will be implemented here</p>
            </div>
          )}

          {activeTab === 'apis' && (
            <div className="text-center text-gray-400 py-8">
              <FiKey className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">API Keys</h3>
              <p>API key management will be implemented here</p>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="text-center text-gray-400 py-8">
              <FiSettings className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">User Preferences</h3>
              <p>User preferences will be implemented here</p>
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
};

export default UserSettingsEnhanced;
 * 👤 ENHANCED USER SETTINGS COMPONENT
 * Comprehensive user settings management with backend integration
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../hooks/useLanguage';
import { useToast } from './Toast';
import UserLayout from './UserLayout';
import { apiService } from '../services/apiService';
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
  FiRefreshCw,
  FiShield,
  FiLock,
  FiEye,
  FiEyeOff
} from 'react-icons/fi';

interface TradingSettings {
  max_leverage: number;
  take_profit_percentage: number;
  stop_loss_percentage: number;
  position_size_percentage: number;
  risk_level: 'low' | 'medium' | 'high';
  auto_trade_enabled: boolean;
  daily_loss_limit_percentage: number;
  max_open_positions: number;
  default_leverage: number;
  stop_loss_multiplier: number;
  take_profit_multiplier: number;
}

interface NotificationSettings {
  email_notifications: boolean;
  sms_notifications: boolean;
  push_notifications: boolean;
  trade_alerts: boolean;
  report_frequency: 'daily' | 'weekly' | 'monthly';
  profit_threshold_percentage: number;
  loss_threshold_percentage: number;
}

interface PersonalSettings {
  language: string;
  timezone: string;
  currency_preference: string;
  theme: 'light' | 'dark' | 'auto';
  date_format: string;
}

interface BankingSettings {
  pix_key: string;
  pix_type: 'email' | 'phone' | 'cpf' | 'random';
  bank_name: string;
  bank_code: string;
  agency: string;
  account: string;
  account_type: 'corrente' | 'poupanca';
  account_holder_name: string;
  cpf: string;
  phone: string;
}

interface SecuritySettings {
  two_factor_enabled: boolean;
  login_notifications: boolean;
  device_management: boolean;
  session_timeout_minutes: number;
  password_change_required: boolean;
}

interface ApiKey {
  id: number;
  exchange: string;
  api_key: string;
  api_secret: string;
  environment: 'testnet' | 'mainnet';
  is_active: boolean;
  last_connection: string;
  connection_status: 'connected' | 'disconnected' | 'error';
}

interface UserPreferences {
  dashboard_layout: any;
  widget_preferences: any;
  chart_preferences: any;
  alert_sounds: boolean;
  auto_refresh: boolean;
  refresh_interval_seconds: number;
}

const UserSettingsEnhanced: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const { showToast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('trading');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Settings state
  const [tradingSettings, setTradingSettings] = useState<TradingSettings | null>(null);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings | null>(null);
  const [personalSettings, setPersonalSettings] = useState<PersonalSettings | null>(null);
  const [bankingSettings, setBankingSettings] = useState<BankingSettings | null>(null);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings | null>(null);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  
  // API Key form state
  const [showApiForm, setShowApiForm] = useState({ binance: false, bybit: false });
  const [newApiKey, setNewApiKey] = useState({
    exchange: '',
    api_key: '',
    api_secret: '',
    passphrase: '',
    environment: 'testnet'
  });

  useEffect(() => {
    setMounted(true);
    loadAllSettings();
  }, []);

  const loadAllSettings = async () => {
    setLoading(true);
    try {
      const response = await apiService.getAllUserSettings();
      if (response.success) {
        const { settings } = response;
        setTradingSettings(settings.trading);
        setNotificationSettings(settings.notifications);
        setPersonalSettings(settings.personal);
        setBankingSettings(settings.banking);
        setSecuritySettings(settings.security);
        setApiKeys(settings.apiKeys || []);
        setPreferences(settings.preferences);
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to load settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const saveTradingSettings = async () => {
    if (!tradingSettings) return;
    
    setSaving(true);
    try {
      const response = await apiService.updateTradingSettings(tradingSettings);
      if (response.success) {
        showToast('Trading settings saved successfully!', 'success');
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to save trading settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const saveNotificationSettings = async () => {
    if (!notificationSettings) return;
    
    setSaving(true);
    try {
      const response = await apiService.updateNotificationSettings(notificationSettings);
      if (response.success) {
        showToast('Notification settings saved successfully!', 'success');
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to save notification settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const savePersonalSettings = async () => {
    if (!personalSettings) return;
    
    setSaving(true);
    try {
      const response = await apiService.updatePersonalSettings(personalSettings);
      if (response.success) {
        showToast('Personal settings saved successfully!', 'success');
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to save personal settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const saveBankingSettings = async () => {
    if (!bankingSettings) return;
    
    setSaving(true);
    try {
      const response = await apiService.updateBankingSettings(bankingSettings);
      if (response.success) {
        showToast('Banking settings saved successfully!', 'success');
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to save banking settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const saveSecuritySettings = async () => {
    if (!securitySettings) return;
    
    setSaving(true);
    try {
      const response = await apiService.updateSecuritySettings(securitySettings);
      if (response.success) {
        showToast('Security settings saved successfully!', 'success');
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to save security settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const addApiKey = async () => {
    setSaving(true);
    try {
      const response = await apiService.addApiKey(newApiKey);
      if (response.success) {
        showToast('API key added successfully!', 'success');
        setNewApiKey({ exchange: '', api_key: '', api_secret: '', passphrase: '', environment: 'testnet' });
        setShowApiForm({ binance: false, bybit: false });
        loadAllSettings(); // Reload to get updated API keys
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to add API key', 'error');
    } finally {
      setSaving(false);
    }
  };

  const deleteApiKey = async (id: number) => {
    setSaving(true);
    try {
      const response = await apiService.deleteApiKey(id.toString());
      if (response.success) {
        showToast('API key deleted successfully!', 'success');
        loadAllSettings(); // Reload to get updated API keys
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to delete API key', 'error');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'trading', label: language === 'pt' ? 'Trading' : 'Trading', icon: FiTrendingUp },
    { id: 'notifications', label: language === 'pt' ? 'Notificações' : 'Notifications', icon: FiBell },
    { id: 'personal', label: language === 'pt' ? 'Dados Pessoais' : 'Personal Data', icon: FiUser },
    { id: 'banking', label: language === 'pt' ? 'Dados Bancários' : 'Banking Data', icon: FiCreditCard },
    { id: 'security', label: language === 'pt' ? 'Segurança' : 'Security', icon: FiShield },
    { id: 'apis', label: 'API Keys', icon: FiKey },
    { id: 'preferences', label: language === 'pt' ? 'Preferências' : 'Preferences', icon: FiSettings }
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

  if (loading) {
    return (
      <UserLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-400 mb-4 mx-auto"></div>
            <h2 className="text-2xl font-bold text-white mb-2">Loading Settings...</h2>
            <p className="text-gray-400">Fetching your personalized settings...</p>
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
            {language === 'pt' ? 'Configurações Avançadas' : 'Advanced Settings'}
          </h1>
          <p className="text-gray-400 text-lg">
            {language === 'pt' ? 'Gerencie todas as suas configurações personalizadas' : 'Manage all your personalized settings'}
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
          {activeTab === 'trading' && tradingSettings && (
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
                          value={tradingSettings.max_leverage}
                          onChange={(e) => setTradingSettings(prev => prev ? { ...prev, max_leverage: parseInt(e.target.value) } : null)}
                          className="flex-1 accent-orange-500"
                        />
                        <span className="text-orange-400 font-bold text-lg w-12">{tradingSettings.max_leverage}x</span>
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
                            onClick={() => setTradingSettings(prev => prev ? { ...prev, risk_level: level as 'low' | 'medium' | 'high' } : null)}
                            className={`p-3 rounded-lg font-medium transition-all ${
                              tradingSettings.risk_level === level
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

                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        {language === 'pt' ? 'Trading Automático' : 'Auto Trading'}
                      </label>
                      <button
                        onClick={() => setTradingSettings(prev => prev ? { ...prev, auto_trade_enabled: !prev.auto_trade_enabled } : null)}
                        className={`w-12 h-6 rounded-full relative transition-all duration-300 ${
                          tradingSettings.auto_trade_enabled ? 'bg-orange-500' : 'bg-gray-600'
                        }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-300 ${
                          tradingSettings.auto_trade_enabled ? 'translate-x-7' : 'translate-x-1'
                        }`}></div>
                      </button>
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
                    <div className="p-4 bg-black/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-300 text-sm">
                          {language === 'pt' ? 'Alavancagem' : 'Leverage'}
                        </span>
                        <span className="text-orange-400 font-bold text-lg">
                          {tradingSettings.max_leverage}x
                        </span>
                      </div>
                    </div>

                    <div className="p-4 bg-black/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-300 text-sm">
                          {language === 'pt' ? 'Nível de Risco' : 'Risk Level'}
                        </span>
                        <span className={`font-bold text-lg ${
                          tradingSettings.risk_level === 'low' ? 'text-green-400' :
                          tradingSettings.risk_level === 'medium' ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {tradingSettings.risk_level}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 bg-black/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-300 text-sm">
                          {language === 'pt' ? 'Trading Automático' : 'Auto Trading'}
                        </span>
                        <span className={`font-bold text-lg ${
                          tradingSettings.auto_trade_enabled ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {tradingSettings.auto_trade_enabled ? 'ON' : 'OFF'}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 bg-black/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-300 text-sm">
                          {language === 'pt' ? 'Posições Máximas' : 'Max Positions'}
                        </span>
                        <span className="text-blue-400 font-bold text-lg">
                          {tradingSettings.max_open_positions}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-center">
                <button
                  onClick={saveTradingSettings}
                  disabled={saving}
                  className="px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-bold rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <FiSave className="w-5 h-5" />
                  {saving ? (language === 'pt' ? 'Salvando...' : 'Saving...') : (language === 'pt' ? 'Salvar Configurações de Trading' : 'Save Trading Settings')}
                </button>
              </div>
            </motion.div>
          )}

          {/* Other tabs would be implemented similarly */}
          {activeTab === 'notifications' && (
            <div className="text-center text-gray-400 py-8">
              <FiBell className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Notification Settings</h3>
              <p>Notification settings will be implemented here</p>
            </div>
          )}

          {activeTab === 'personal' && (
            <div className="text-center text-gray-400 py-8">
              <FiUser className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Personal Settings</h3>
              <p>Personal settings will be implemented here</p>
            </div>
          )}

          {activeTab === 'banking' && (
            <div className="text-center text-gray-400 py-8">
              <FiCreditCard className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Banking Settings</h3>
              <p>Banking settings will be implemented here</p>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="text-center text-gray-400 py-8">
              <FiShield className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Security Settings</h3>
              <p>Security settings will be implemented here</p>
            </div>
          )}

          {activeTab === 'apis' && (
            <div className="text-center text-gray-400 py-8">
              <FiKey className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">API Keys</h3>
              <p>API key management will be implemented here</p>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="text-center text-gray-400 py-8">
              <FiSettings className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">User Preferences</h3>
              <p>User preferences will be implemented here</p>
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
};

export default UserSettingsEnhanced;
