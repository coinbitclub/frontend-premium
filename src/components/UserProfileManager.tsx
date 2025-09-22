/**
 * 👤 USER PROFILE MANAGER - FRONTEND
 * Complete user profile management component with backend integration
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/apiService';

interface UserProfile {
  id: number;
  email: string;
  username: string;
  full_name: string;
  user_type: string;
  is_admin: boolean;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  created_at: string;
  last_login_at?: string;
}

interface UserSettings {
  trading: {
    enabled: boolean;
    maxPositions: number;
  };
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  language: string;
  theme: string;
  timezone: string;
}

const UserProfileManager: React.FC = () => {
  const { user, getProfile, updateProfile } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [success, setSuccess] = useState<string>('');

  // Form states
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    username: '',
    phone: '',
    address: '',
    city: '',
    country: ''
  });

  const [settingsForm, setSettingsForm] = useState({
    trading: {
      enabled: true,
      maxPositions: 2
    },
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    language: 'pt-BR',
    theme: 'dark',
    timezone: 'America/Sao_Paulo'
  });

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (user) {
      setProfileForm({
        full_name: user.full_name || '',
        username: user.username || '',
        phone: '',
        address: '',
        city: '',
        country: ''
      });
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      setErrors({});

      const [profileData, settingsData] = await Promise.all([
        apiService.getUserProfile(),
        apiService.getUserSettings()
      ]);

      if (profileData.success) {
        setProfile(profileData.user);
        setProfileForm({
          full_name: profileData.user.full_name || '',
          username: profileData.user.username || '',
          phone: profileData.user.phone || '',
          address: profileData.user.address || '',
          city: profileData.user.city || '',
          country: profileData.user.country || ''
        });
      }

      if (settingsData.success) {
        setSettings(settingsData.settings);
        setSettingsForm(settingsData.settings);
      }

    } catch (error) {
      console.error('Error loading user data:', error);
      setErrors({ general: 'Erro ao carregar dados do usuário' });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setSuccess('');

    try {
      const response = await apiService.updateUserProfile(profileForm);
      
      if (response.success) {
        setSuccess('Perfil atualizado com sucesso!');
        await getProfile(); // Refresh user data in context
        await loadUserData(); // Reload component data
      } else {
        setErrors({ general: response.message || 'Erro ao atualizar perfil' });
      }
    } catch (error: any) {
      console.error('Profile update error:', error);
      setErrors({ general: error.message || 'Erro ao atualizar perfil' });
    } finally {
      setSaving(false);
    }
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setSuccess('');

    try {
      const response = await apiService.updateUserSettings(settingsForm);
      
      if (response.success) {
        setSuccess('Configurações atualizadas com sucesso!');
        await loadUserData();
      } else {
        setErrors({ general: response.message || 'Erro ao atualizar configurações' });
      }
    } catch (error: any) {
      console.error('Settings update error:', error);
      setErrors({ general: error.message || 'Erro ao atualizar configurações' });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setSettingsForm(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof UserSettings],
          [child]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }
      }));
    } else {
      setProfileForm(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }));
    }
  };

  const getUserTypeDisplay = (userType: string) => {
    const types = {
      ADMIN: 'Administrador',
      GESTOR: 'Gestor',
      OPERADOR: 'Operador',
      AFFILIATE_VIP: 'Afiliado VIP',
      AFFILIATE: 'Afiliado',
      USER: 'Usuário'
    };
    return types[userType as keyof typeof types] || userType;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando perfil...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Gerenciar Perfil</h1>
          <div className="flex items-center space-x-4">
            <span className="px-3 py-1 bg-blue-600 rounded-full text-sm">
              {getUserTypeDisplay(user?.user_type || 'USER')}
            </span>
            <span className="text-gray-400">
              {user?.email}
            </span>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-green-400">
            {success}
          </div>
        )}

        {/* Error Message */}
        {errors.general && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
            {errors.general}
          </div>
        )}

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'profile'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Perfil
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'settings'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Configurações
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Informações do Perfil</h2>
            
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={profileForm.full_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nome de Usuário
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={profileForm.username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileForm.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    País
                  </label>
                  <select
                    name="country"
                    value={profileForm.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecione um país</option>
                    <option value="BR">Brasil</option>
                    <option value="US">Estados Unidos</option>
                    <option value="AR">Argentina</option>
                    <option value="MX">México</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Endereço
                </label>
                <input
                  type="text"
                  name="address"
                  value={profileForm.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Cidade
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={profileForm.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email (somente leitura)
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-3 bg-gray-600 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                  saving
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {saving ? 'Salvando...' : 'Salvar Perfil'}
              </button>
            </form>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Configurações</h2>
            
            <form onSubmit={handleSettingsSubmit} className="space-y-8">
              {/* Trading Settings */}
              <div>
                <h3 className="text-lg font-medium mb-4">Configurações de Trading</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="trading.enabled"
                      checked={settingsForm.trading.enabled}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <label className="ml-2 text-gray-300">
                      Habilitar Trading
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Máximo de Posições Abertas
                    </label>
                    <input
                      type="number"
                      name="trading.maxPositions"
                      value={settingsForm.trading.maxPositions}
                      onChange={handleInputChange}
                      min="1"
                      max="10"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div>
                <h3 className="text-lg font-medium mb-4">Notificações</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="notifications.email"
                      checked={settingsForm.notifications.email}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <label className="ml-2 text-gray-300">
                      Notificações por Email
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="notifications.push"
                      checked={settingsForm.notifications.push}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <label className="ml-2 text-gray-300">
                      Notificações Push
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="notifications.sms"
                      checked={settingsForm.notifications.sms}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <label className="ml-2 text-gray-300">
                      Notificações por SMS
                    </label>
                  </div>
                </div>
              </div>

              {/* General Settings */}
              <div>
                <h3 className="text-lg font-medium mb-4">Configurações Gerais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Idioma
                    </label>
                    <select
                      name="language"
                      value={settingsForm.language}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pt-BR">Português (Brasil)</option>
                      <option value="en-US">English (US)</option>
                      <option value="es-ES">Español</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Tema
                    </label>
                    <select
                      name="theme"
                      value={settingsForm.theme}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="dark">Escuro</option>
                      <option value="light">Claro</option>
                      <option value="auto">Automático</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Fuso Horário
                    </label>
                    <select
                      name="timezone"
                      value={settingsForm.timezone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="America/Sao_Paulo">Brasília (UTC-3)</option>
                      <option value="America/New_York">New York (UTC-5)</option>
                      <option value="Europe/London">London (UTC+0)</option>
                      <option value="Asia/Tokyo">Tokyo (UTC+9)</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                  saving
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {saving ? 'Salvando...' : 'Salvar Configurações'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileManager;
 * 👤 USER PROFILE MANAGER - FRONTEND
 * Complete user profile management component with backend integration
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/apiService';

interface UserProfile {
  id: number;
  email: string;
  username: string;
  full_name: string;
  user_type: string;
  is_admin: boolean;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  created_at: string;
  last_login_at?: string;
}

interface UserSettings {
  trading: {
    enabled: boolean;
    maxPositions: number;
  };
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  language: string;
  theme: string;
  timezone: string;
}

const UserProfileManager: React.FC = () => {
  const { user, getProfile, updateProfile } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [success, setSuccess] = useState<string>('');

  // Form states
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    username: '',
    phone: '',
    address: '',
    city: '',
    country: ''
  });

  const [settingsForm, setSettingsForm] = useState({
    trading: {
      enabled: true,
      maxPositions: 2
    },
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    language: 'pt-BR',
    theme: 'dark',
    timezone: 'America/Sao_Paulo'
  });

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (user) {
      setProfileForm({
        full_name: user.full_name || '',
        username: user.username || '',
        phone: '',
        address: '',
        city: '',
        country: ''
      });
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      setErrors({});

      const [profileData, settingsData] = await Promise.all([
        apiService.getUserProfile(),
        apiService.getUserSettings()
      ]);

      if (profileData.success) {
        setProfile(profileData.user);
        setProfileForm({
          full_name: profileData.user.full_name || '',
          username: profileData.user.username || '',
          phone: profileData.user.phone || '',
          address: profileData.user.address || '',
          city: profileData.user.city || '',
          country: profileData.user.country || ''
        });
      }

      if (settingsData.success) {
        setSettings(settingsData.settings);
        setSettingsForm(settingsData.settings);
      }

    } catch (error) {
      console.error('Error loading user data:', error);
      setErrors({ general: 'Erro ao carregar dados do usuário' });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setSuccess('');

    try {
      const response = await apiService.updateUserProfile(profileForm);
      
      if (response.success) {
        setSuccess('Perfil atualizado com sucesso!');
        await getProfile(); // Refresh user data in context
        await loadUserData(); // Reload component data
      } else {
        setErrors({ general: response.message || 'Erro ao atualizar perfil' });
      }
    } catch (error: any) {
      console.error('Profile update error:', error);
      setErrors({ general: error.message || 'Erro ao atualizar perfil' });
    } finally {
      setSaving(false);
    }
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setSuccess('');

    try {
      const response = await apiService.updateUserSettings(settingsForm);
      
      if (response.success) {
        setSuccess('Configurações atualizadas com sucesso!');
        await loadUserData();
      } else {
        setErrors({ general: response.message || 'Erro ao atualizar configurações' });
      }
    } catch (error: any) {
      console.error('Settings update error:', error);
      setErrors({ general: error.message || 'Erro ao atualizar configurações' });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setSettingsForm(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof UserSettings],
          [child]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }
      }));
    } else {
      setProfileForm(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }));
    }
  };

  const getUserTypeDisplay = (userType: string) => {
    const types = {
      ADMIN: 'Administrador',
      GESTOR: 'Gestor',
      OPERADOR: 'Operador',
      AFFILIATE_VIP: 'Afiliado VIP',
      AFFILIATE: 'Afiliado',
      USER: 'Usuário'
    };
    return types[userType as keyof typeof types] || userType;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando perfil...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Gerenciar Perfil</h1>
          <div className="flex items-center space-x-4">
            <span className="px-3 py-1 bg-blue-600 rounded-full text-sm">
              {getUserTypeDisplay(user?.user_type || 'USER')}
            </span>
            <span className="text-gray-400">
              {user?.email}
            </span>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-green-400">
            {success}
          </div>
        )}

        {/* Error Message */}
        {errors.general && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
            {errors.general}
          </div>
        )}

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'profile'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Perfil
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'settings'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Configurações
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Informações do Perfil</h2>
            
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={profileForm.full_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nome de Usuário
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={profileForm.username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileForm.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    País
                  </label>
                  <select
                    name="country"
                    value={profileForm.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecione um país</option>
                    <option value="BR">Brasil</option>
                    <option value="US">Estados Unidos</option>
                    <option value="AR">Argentina</option>
                    <option value="MX">México</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Endereço
                </label>
                <input
                  type="text"
                  name="address"
                  value={profileForm.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Cidade
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={profileForm.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email (somente leitura)
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-3 bg-gray-600 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                  saving
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {saving ? 'Salvando...' : 'Salvar Perfil'}
              </button>
            </form>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Configurações</h2>
            
            <form onSubmit={handleSettingsSubmit} className="space-y-8">
              {/* Trading Settings */}
              <div>
                <h3 className="text-lg font-medium mb-4">Configurações de Trading</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="trading.enabled"
                      checked={settingsForm.trading.enabled}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <label className="ml-2 text-gray-300">
                      Habilitar Trading
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Máximo de Posições Abertas
                    </label>
                    <input
                      type="number"
                      name="trading.maxPositions"
                      value={settingsForm.trading.maxPositions}
                      onChange={handleInputChange}
                      min="1"
                      max="10"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div>
                <h3 className="text-lg font-medium mb-4">Notificações</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="notifications.email"
                      checked={settingsForm.notifications.email}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <label className="ml-2 text-gray-300">
                      Notificações por Email
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="notifications.push"
                      checked={settingsForm.notifications.push}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <label className="ml-2 text-gray-300">
                      Notificações Push
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="notifications.sms"
                      checked={settingsForm.notifications.sms}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <label className="ml-2 text-gray-300">
                      Notificações por SMS
                    </label>
                  </div>
                </div>
              </div>

              {/* General Settings */}
              <div>
                <h3 className="text-lg font-medium mb-4">Configurações Gerais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Idioma
                    </label>
                    <select
                      name="language"
                      value={settingsForm.language}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pt-BR">Português (Brasil)</option>
                      <option value="en-US">English (US)</option>
                      <option value="es-ES">Español</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Tema
                    </label>
                    <select
                      name="theme"
                      value={settingsForm.theme}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="dark">Escuro</option>
                      <option value="light">Claro</option>
                      <option value="auto">Automático</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Fuso Horário
                    </label>
                    <select
                      name="timezone"
                      value={settingsForm.timezone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="America/Sao_Paulo">Brasília (UTC-3)</option>
                      <option value="America/New_York">New York (UTC-5)</option>
                      <option value="Europe/London">London (UTC+0)</option>
                      <option value="Asia/Tokyo">Tokyo (UTC+9)</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                  saving
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {saving ? 'Salvando...' : 'Salvar Configurações'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileManager;
 * 👤 USER PROFILE MANAGER - FRONTEND
 * Complete user profile management component with backend integration
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/apiService';

interface UserProfile {
  id: number;
  email: string;
  username: string;
  full_name: string;
  user_type: string;
  is_admin: boolean;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  created_at: string;
  last_login_at?: string;
}

interface UserSettings {
  trading: {
    enabled: boolean;
    maxPositions: number;
  };
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  language: string;
  theme: string;
  timezone: string;
}

const UserProfileManager: React.FC = () => {
  const { user, getProfile, updateProfile } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [success, setSuccess] = useState<string>('');

  // Form states
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    username: '',
    phone: '',
    address: '',
    city: '',
    country: ''
  });

  const [settingsForm, setSettingsForm] = useState({
    trading: {
      enabled: true,
      maxPositions: 2
    },
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    language: 'pt-BR',
    theme: 'dark',
    timezone: 'America/Sao_Paulo'
  });

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (user) {
      setProfileForm({
        full_name: user.full_name || '',
        username: user.username || '',
        phone: '',
        address: '',
        city: '',
        country: ''
      });
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      setErrors({});

      const [profileData, settingsData] = await Promise.all([
        apiService.getUserProfile(),
        apiService.getUserSettings()
      ]);

      if (profileData.success) {
        setProfile(profileData.user);
        setProfileForm({
          full_name: profileData.user.full_name || '',
          username: profileData.user.username || '',
          phone: profileData.user.phone || '',
          address: profileData.user.address || '',
          city: profileData.user.city || '',
          country: profileData.user.country || ''
        });
      }

      if (settingsData.success) {
        setSettings(settingsData.settings);
        setSettingsForm(settingsData.settings);
      }

    } catch (error) {
      console.error('Error loading user data:', error);
      setErrors({ general: 'Erro ao carregar dados do usuário' });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setSuccess('');

    try {
      const response = await apiService.updateUserProfile(profileForm);
      
      if (response.success) {
        setSuccess('Perfil atualizado com sucesso!');
        await getProfile(); // Refresh user data in context
        await loadUserData(); // Reload component data
      } else {
        setErrors({ general: response.message || 'Erro ao atualizar perfil' });
      }
    } catch (error: any) {
      console.error('Profile update error:', error);
      setErrors({ general: error.message || 'Erro ao atualizar perfil' });
    } finally {
      setSaving(false);
    }
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setSuccess('');

    try {
      const response = await apiService.updateUserSettings(settingsForm);
      
      if (response.success) {
        setSuccess('Configurações atualizadas com sucesso!');
        await loadUserData();
      } else {
        setErrors({ general: response.message || 'Erro ao atualizar configurações' });
      }
    } catch (error: any) {
      console.error('Settings update error:', error);
      setErrors({ general: error.message || 'Erro ao atualizar configurações' });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setSettingsForm(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof UserSettings],
          [child]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }
      }));
    } else {
      setProfileForm(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }));
    }
  };

  const getUserTypeDisplay = (userType: string) => {
    const types = {
      ADMIN: 'Administrador',
      GESTOR: 'Gestor',
      OPERADOR: 'Operador',
      AFFILIATE_VIP: 'Afiliado VIP',
      AFFILIATE: 'Afiliado',
      USER: 'Usuário'
    };
    return types[userType as keyof typeof types] || userType;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando perfil...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Gerenciar Perfil</h1>
          <div className="flex items-center space-x-4">
            <span className="px-3 py-1 bg-blue-600 rounded-full text-sm">
              {getUserTypeDisplay(user?.user_type || 'USER')}
            </span>
            <span className="text-gray-400">
              {user?.email}
            </span>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-green-400">
            {success}
          </div>
        )}

        {/* Error Message */}
        {errors.general && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
            {errors.general}
          </div>
        )}

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'profile'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Perfil
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'settings'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Configurações
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Informações do Perfil</h2>
            
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={profileForm.full_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nome de Usuário
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={profileForm.username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileForm.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    País
                  </label>
                  <select
                    name="country"
                    value={profileForm.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecione um país</option>
                    <option value="BR">Brasil</option>
                    <option value="US">Estados Unidos</option>
                    <option value="AR">Argentina</option>
                    <option value="MX">México</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Endereço
                </label>
                <input
                  type="text"
                  name="address"
                  value={profileForm.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Cidade
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={profileForm.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email (somente leitura)
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-3 bg-gray-600 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                  saving
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {saving ? 'Salvando...' : 'Salvar Perfil'}
              </button>
            </form>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Configurações</h2>
            
            <form onSubmit={handleSettingsSubmit} className="space-y-8">
              {/* Trading Settings */}
              <div>
                <h3 className="text-lg font-medium mb-4">Configurações de Trading</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="trading.enabled"
                      checked={settingsForm.trading.enabled}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <label className="ml-2 text-gray-300">
                      Habilitar Trading
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Máximo de Posições Abertas
                    </label>
                    <input
                      type="number"
                      name="trading.maxPositions"
                      value={settingsForm.trading.maxPositions}
                      onChange={handleInputChange}
                      min="1"
                      max="10"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div>
                <h3 className="text-lg font-medium mb-4">Notificações</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="notifications.email"
                      checked={settingsForm.notifications.email}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <label className="ml-2 text-gray-300">
                      Notificações por Email
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="notifications.push"
                      checked={settingsForm.notifications.push}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <label className="ml-2 text-gray-300">
                      Notificações Push
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="notifications.sms"
                      checked={settingsForm.notifications.sms}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <label className="ml-2 text-gray-300">
                      Notificações por SMS
                    </label>
                  </div>
                </div>
              </div>

              {/* General Settings */}
              <div>
                <h3 className="text-lg font-medium mb-4">Configurações Gerais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Idioma
                    </label>
                    <select
                      name="language"
                      value={settingsForm.language}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pt-BR">Português (Brasil)</option>
                      <option value="en-US">English (US)</option>
                      <option value="es-ES">Español</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Tema
                    </label>
                    <select
                      name="theme"
                      value={settingsForm.theme}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="dark">Escuro</option>
                      <option value="light">Claro</option>
                      <option value="auto">Automático</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Fuso Horário
                    </label>
                    <select
                      name="timezone"
                      value={settingsForm.timezone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="America/Sao_Paulo">Brasília (UTC-3)</option>
                      <option value="America/New_York">New York (UTC-5)</option>
                      <option value="Europe/London">London (UTC+0)</option>
                      <option value="Asia/Tokyo">Tokyo (UTC+9)</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                  saving
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {saving ? 'Salvando...' : 'Salvar Configurações'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileManager;
