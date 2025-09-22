/**
 * 🧪 USER SETTINGS INTEGRATION TEST PAGE
 * Test page for verifying frontend-backend user settings integration
 */

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '../src/contexts/AuthContext';
import { apiService } from '../src/services/apiService';
import { 
  FiCheck, 
  FiX, 
  FiRefreshCw, 
  FiDatabase, 
  FiSettings,
  FiTrendingUp,
  FiBell,
  FiUser,
  FiCreditCard,
  FiShield,
  FiKey
} from 'react-icons/fi';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  data?: any;
}

const TestUserSettingsPage: React.FC = () => {
  const { user, loading } = useAuth();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testing, setTesting] = useState(false);

  const tests = [
    {
      name: 'Get All User Settings',
      endpoint: 'getAllUserSettings',
      icon: FiDatabase,
      description: 'Test fetching all user settings from the API'
    },
    {
      name: 'Get Trading Settings',
      endpoint: 'getTradingSettings',
      icon: FiTrendingUp,
      description: 'Test fetching trading-specific settings'
    },
    {
      name: 'Get Notification Settings',
      endpoint: 'getNotificationSettings',
      icon: FiBell,
      description: 'Test fetching notification preferences'
    },
    {
      name: 'Get Personal Settings',
      endpoint: 'getPersonalSettings',
      icon: FiUser,
      description: 'Test fetching personal data settings'
    },
    {
      name: 'Get Banking Settings',
      endpoint: 'getBankingSettings',
      icon: FiCreditCard,
      description: 'Test fetching banking information'
    },
    {
      name: 'Get Security Settings',
      endpoint: 'getSecuritySettings',
      icon: FiShield,
      description: 'Test fetching security preferences'
    },
    {
      name: 'Get API Keys',
      endpoint: 'getApiKeys',
      icon: FiKey,
      description: 'Test fetching user API keys'
    },
    {
      name: 'Update Trading Settings',
      endpoint: 'updateTradingSettings',
      icon: FiSettings,
      description: 'Test updating trading parameters'
    }
  ];

  const runAllTests = async () => {
    if (!user) return;

    setTesting(true);
    setTestResults([]);

    const results: TestResult[] = [];

    for (const test of tests) {
      try {
        const result: TestResult = {
          name: test.name,
          status: 'pending',
          message: 'Running test...'
        };
        results.push(result);
        setTestResults([...results]);

        let response;
        
        switch (test.endpoint) {
          case 'getAllUserSettings':
            response = await apiService.getAllUserSettings();
            break;
          case 'getTradingSettings':
            response = await apiService.getTradingSettings();
            break;
          case 'getNotificationSettings':
            response = await apiService.getNotificationSettings();
            break;
          case 'getPersonalSettings':
            response = await apiService.getPersonalSettings();
            break;
          case 'getBankingSettings':
            response = await apiService.getBankingSettings();
            break;
          case 'getSecuritySettings':
            response = await apiService.getSecuritySettings();
            break;
          case 'getApiKeys':
            response = await apiService.getApiKeys();
            break;
          case 'updateTradingSettings':
            response = await apiService.updateTradingSettings({
              max_leverage: 7,
              risk_level: 'high',
              auto_trade_enabled: true
            });
            break;
          default:
            throw new Error('Unknown test endpoint');
        }

        result.status = response.success ? 'success' : 'error';
        result.message = response.success ? 'Test passed successfully' : response.error || 'Test failed';
        result.data = response;

      } catch (error: any) {
        const result: TestResult = {
          name: test.name,
          status: 'error',
          message: error.message || 'Test failed with unknown error'
        };
        results.push(result);
      }

      setTestResults([...results]);
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setTesting(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <FiCheck className="w-5 h-5 text-green-400" />;
      case 'error':
        return <FiX className="w-5 h-5 text-red-400" />;
      default:
        return <FiRefreshCw className="w-5 h-5 text-yellow-400 animate-spin" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'border-green-500/50 bg-green-500/10';
      case 'error':
        return 'border-red-500/50 bg-red-500/10';
      default:
        return 'border-yellow-500/50 bg-yellow-500/10';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-400 mb-4 mx-auto"></div>
          <h2 className="text-2xl font-bold text-white mb-2">CoinBitClub</h2>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Authentication Required</h2>
          <p className="text-gray-400">Please log in to access the test page.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>User Settings API Test - CoinBitClub Enterprise</title>
        <meta name="description" content="Test page for user settings API integration" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent mb-4">
              User Settings API Test
            </h1>
            <p className="text-gray-400 text-lg mb-6">
              Comprehensive testing of the enhanced user settings API integration
            </p>
            
            <button
              onClick={runAllTests}
              disabled={testing}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-bold rounded-xl transition-all flex items-center gap-2 mx-auto disabled:opacity-50"
            >
              <FiRefreshCw className={`w-5 h-5 ${testing ? 'animate-spin' : ''}`} />
              {testing ? 'Running Tests...' : 'Run All Tests'}
            </button>
          </div>

          {/* User Info */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Current User</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-gray-400">Email:</span>
                <p className="text-white font-medium">{user.email}</p>
              </div>
              <div>
                <span className="text-gray-400">User Type:</span>
                <p className="text-white font-medium">{user.userType}</p>
              </div>
              <div>
                <span className="text-gray-400">ID:</span>
                <p className="text-white font-medium">{user.id}</p>
              </div>
            </div>
          </div>

          {/* Test Results */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-6">Test Results</h2>
            
            {testResults.length === 0 && !testing && (
              <div className="text-center py-12">
                <FiDatabase className="w-16 h-16 mx-auto text-gray-400 mb-4 opacity-50" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No Tests Run Yet</h3>
                <p className="text-gray-500">Click "Run All Tests" to start testing the user settings API</p>
              </div>
            )}

            {testResults.map((result, index) => {
              const test = tests.find(t => t.name === result.name);
              return (
                <div
                  key={index}
                  className={`border rounded-xl p-6 transition-all ${getStatusColor(result.status)}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(result.status)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {test?.icon && <test.icon className="w-5 h-5 text-gray-400" />}
                        <h3 className="text-lg font-semibold text-white">{result.name}</h3>
                      </div>
                      
                      <p className="text-gray-400 text-sm mb-3">{test?.description}</p>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          result.status === 'success' ? 'bg-green-500/20 text-green-400' :
                          result.status === 'error' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {result.status.toUpperCase()}
                        </span>
                      </div>
                      
                      <p className="text-gray-300">{result.message}</p>
                      
                      {result.data && (
                        <details className="mt-4">
                          <summary className="text-sm text-gray-400 cursor-pointer hover:text-gray-300">
                            View Response Data
                          </summary>
                          <pre className="mt-2 p-4 bg-black/20 rounded-lg text-xs text-gray-300 overflow-auto">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          {testResults.length > 0 && !testing && (
            <div className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Test Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">
                    {testResults.filter(r => r.status === 'success').length}
                  </div>
                  <div className="text-gray-400">Passed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-400">
                    {testResults.filter(r => r.status === 'error').length}
                  </div>
                  <div className="text-gray-400">Failed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">
                    {testResults.length}
                  </div>
                  <div className="text-gray-400">Total</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TestUserSettingsPage;
 * 🧪 USER SETTINGS INTEGRATION TEST PAGE
 * Test page for verifying frontend-backend user settings integration
 */

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '../src/contexts/AuthContext';
import { apiService } from '../src/services/apiService';
import { 
  FiCheck, 
  FiX, 
  FiRefreshCw, 
  FiDatabase, 
  FiSettings,
  FiTrendingUp,
  FiBell,
  FiUser,
  FiCreditCard,
  FiShield,
  FiKey
} from 'react-icons/fi';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  data?: any;
}

const TestUserSettingsPage: React.FC = () => {
  const { user, loading } = useAuth();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testing, setTesting] = useState(false);

  const tests = [
    {
      name: 'Get All User Settings',
      endpoint: 'getAllUserSettings',
      icon: FiDatabase,
      description: 'Test fetching all user settings from the API'
    },
    {
      name: 'Get Trading Settings',
      endpoint: 'getTradingSettings',
      icon: FiTrendingUp,
      description: 'Test fetching trading-specific settings'
    },
    {
      name: 'Get Notification Settings',
      endpoint: 'getNotificationSettings',
      icon: FiBell,
      description: 'Test fetching notification preferences'
    },
    {
      name: 'Get Personal Settings',
      endpoint: 'getPersonalSettings',
      icon: FiUser,
      description: 'Test fetching personal data settings'
    },
    {
      name: 'Get Banking Settings',
      endpoint: 'getBankingSettings',
      icon: FiCreditCard,
      description: 'Test fetching banking information'
    },
    {
      name: 'Get Security Settings',
      endpoint: 'getSecuritySettings',
      icon: FiShield,
      description: 'Test fetching security preferences'
    },
    {
      name: 'Get API Keys',
      endpoint: 'getApiKeys',
      icon: FiKey,
      description: 'Test fetching user API keys'
    },
    {
      name: 'Update Trading Settings',
      endpoint: 'updateTradingSettings',
      icon: FiSettings,
      description: 'Test updating trading parameters'
    }
  ];

  const runAllTests = async () => {
    if (!user) return;

    setTesting(true);
    setTestResults([]);

    const results: TestResult[] = [];

    for (const test of tests) {
      try {
        const result: TestResult = {
          name: test.name,
          status: 'pending',
          message: 'Running test...'
        };
        results.push(result);
        setTestResults([...results]);

        let response;
        
        switch (test.endpoint) {
          case 'getAllUserSettings':
            response = await apiService.getAllUserSettings();
            break;
          case 'getTradingSettings':
            response = await apiService.getTradingSettings();
            break;
          case 'getNotificationSettings':
            response = await apiService.getNotificationSettings();
            break;
          case 'getPersonalSettings':
            response = await apiService.getPersonalSettings();
            break;
          case 'getBankingSettings':
            response = await apiService.getBankingSettings();
            break;
          case 'getSecuritySettings':
            response = await apiService.getSecuritySettings();
            break;
          case 'getApiKeys':
            response = await apiService.getApiKeys();
            break;
          case 'updateTradingSettings':
            response = await apiService.updateTradingSettings({
              max_leverage: 7,
              risk_level: 'high',
              auto_trade_enabled: true
            });
            break;
          default:
            throw new Error('Unknown test endpoint');
        }

        result.status = response.success ? 'success' : 'error';
        result.message = response.success ? 'Test passed successfully' : response.error || 'Test failed';
        result.data = response;

      } catch (error: any) {
        const result: TestResult = {
          name: test.name,
          status: 'error',
          message: error.message || 'Test failed with unknown error'
        };
        results.push(result);
      }

      setTestResults([...results]);
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setTesting(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <FiCheck className="w-5 h-5 text-green-400" />;
      case 'error':
        return <FiX className="w-5 h-5 text-red-400" />;
      default:
        return <FiRefreshCw className="w-5 h-5 text-yellow-400 animate-spin" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'border-green-500/50 bg-green-500/10';
      case 'error':
        return 'border-red-500/50 bg-red-500/10';
      default:
        return 'border-yellow-500/50 bg-yellow-500/10';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-400 mb-4 mx-auto"></div>
          <h2 className="text-2xl font-bold text-white mb-2">CoinBitClub</h2>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Authentication Required</h2>
          <p className="text-gray-400">Please log in to access the test page.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>User Settings API Test - CoinBitClub Enterprise</title>
        <meta name="description" content="Test page for user settings API integration" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent mb-4">
              User Settings API Test
            </h1>
            <p className="text-gray-400 text-lg mb-6">
              Comprehensive testing of the enhanced user settings API integration
            </p>
            
            <button
              onClick={runAllTests}
              disabled={testing}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-bold rounded-xl transition-all flex items-center gap-2 mx-auto disabled:opacity-50"
            >
              <FiRefreshCw className={`w-5 h-5 ${testing ? 'animate-spin' : ''}`} />
              {testing ? 'Running Tests...' : 'Run All Tests'}
            </button>
          </div>

          {/* User Info */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Current User</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-gray-400">Email:</span>
                <p className="text-white font-medium">{user.email}</p>
              </div>
              <div>
                <span className="text-gray-400">User Type:</span>
                <p className="text-white font-medium">{user.userType}</p>
              </div>
              <div>
                <span className="text-gray-400">ID:</span>
                <p className="text-white font-medium">{user.id}</p>
              </div>
            </div>
          </div>

          {/* Test Results */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-6">Test Results</h2>
            
            {testResults.length === 0 && !testing && (
              <div className="text-center py-12">
                <FiDatabase className="w-16 h-16 mx-auto text-gray-400 mb-4 opacity-50" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No Tests Run Yet</h3>
                <p className="text-gray-500">Click "Run All Tests" to start testing the user settings API</p>
              </div>
            )}

            {testResults.map((result, index) => {
              const test = tests.find(t => t.name === result.name);
              return (
                <div
                  key={index}
                  className={`border rounded-xl p-6 transition-all ${getStatusColor(result.status)}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(result.status)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {test?.icon && <test.icon className="w-5 h-5 text-gray-400" />}
                        <h3 className="text-lg font-semibold text-white">{result.name}</h3>
                      </div>
                      
                      <p className="text-gray-400 text-sm mb-3">{test?.description}</p>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          result.status === 'success' ? 'bg-green-500/20 text-green-400' :
                          result.status === 'error' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {result.status.toUpperCase()}
                        </span>
                      </div>
                      
                      <p className="text-gray-300">{result.message}</p>
                      
                      {result.data && (
                        <details className="mt-4">
                          <summary className="text-sm text-gray-400 cursor-pointer hover:text-gray-300">
                            View Response Data
                          </summary>
                          <pre className="mt-2 p-4 bg-black/20 rounded-lg text-xs text-gray-300 overflow-auto">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          {testResults.length > 0 && !testing && (
            <div className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Test Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">
                    {testResults.filter(r => r.status === 'success').length}
                  </div>
                  <div className="text-gray-400">Passed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-400">
                    {testResults.filter(r => r.status === 'error').length}
                  </div>
                  <div className="text-gray-400">Failed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">
                    {testResults.length}
                  </div>
                  <div className="text-gray-400">Total</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TestUserSettingsPage;
 * 🧪 USER SETTINGS INTEGRATION TEST PAGE
 * Test page for verifying frontend-backend user settings integration
 */

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '../src/contexts/AuthContext';
import { apiService } from '../src/services/apiService';
import { 
  FiCheck, 
  FiX, 
  FiRefreshCw, 
  FiDatabase, 
  FiSettings,
  FiTrendingUp,
  FiBell,
  FiUser,
  FiCreditCard,
  FiShield,
  FiKey
} from 'react-icons/fi';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  data?: any;
}

const TestUserSettingsPage: React.FC = () => {
  const { user, loading } = useAuth();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testing, setTesting] = useState(false);

  const tests = [
    {
      name: 'Get All User Settings',
      endpoint: 'getAllUserSettings',
      icon: FiDatabase,
      description: 'Test fetching all user settings from the API'
    },
    {
      name: 'Get Trading Settings',
      endpoint: 'getTradingSettings',
      icon: FiTrendingUp,
      description: 'Test fetching trading-specific settings'
    },
    {
      name: 'Get Notification Settings',
      endpoint: 'getNotificationSettings',
      icon: FiBell,
      description: 'Test fetching notification preferences'
    },
    {
      name: 'Get Personal Settings',
      endpoint: 'getPersonalSettings',
      icon: FiUser,
      description: 'Test fetching personal data settings'
    },
    {
      name: 'Get Banking Settings',
      endpoint: 'getBankingSettings',
      icon: FiCreditCard,
      description: 'Test fetching banking information'
    },
    {
      name: 'Get Security Settings',
      endpoint: 'getSecuritySettings',
      icon: FiShield,
      description: 'Test fetching security preferences'
    },
    {
      name: 'Get API Keys',
      endpoint: 'getApiKeys',
      icon: FiKey,
      description: 'Test fetching user API keys'
    },
    {
      name: 'Update Trading Settings',
      endpoint: 'updateTradingSettings',
      icon: FiSettings,
      description: 'Test updating trading parameters'
    }
  ];

  const runAllTests = async () => {
    if (!user) return;

    setTesting(true);
    setTestResults([]);

    const results: TestResult[] = [];

    for (const test of tests) {
      try {
        const result: TestResult = {
          name: test.name,
          status: 'pending',
          message: 'Running test...'
        };
        results.push(result);
        setTestResults([...results]);

        let response;
        
        switch (test.endpoint) {
          case 'getAllUserSettings':
            response = await apiService.getAllUserSettings();
            break;
          case 'getTradingSettings':
            response = await apiService.getTradingSettings();
            break;
          case 'getNotificationSettings':
            response = await apiService.getNotificationSettings();
            break;
          case 'getPersonalSettings':
            response = await apiService.getPersonalSettings();
            break;
          case 'getBankingSettings':
            response = await apiService.getBankingSettings();
            break;
          case 'getSecuritySettings':
            response = await apiService.getSecuritySettings();
            break;
          case 'getApiKeys':
            response = await apiService.getApiKeys();
            break;
          case 'updateTradingSettings':
            response = await apiService.updateTradingSettings({
              max_leverage: 7,
              risk_level: 'high',
              auto_trade_enabled: true
            });
            break;
          default:
            throw new Error('Unknown test endpoint');
        }

        result.status = response.success ? 'success' : 'error';
        result.message = response.success ? 'Test passed successfully' : response.error || 'Test failed';
        result.data = response;

      } catch (error: any) {
        const result: TestResult = {
          name: test.name,
          status: 'error',
          message: error.message || 'Test failed with unknown error'
        };
        results.push(result);
      }

      setTestResults([...results]);
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setTesting(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <FiCheck className="w-5 h-5 text-green-400" />;
      case 'error':
        return <FiX className="w-5 h-5 text-red-400" />;
      default:
        return <FiRefreshCw className="w-5 h-5 text-yellow-400 animate-spin" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'border-green-500/50 bg-green-500/10';
      case 'error':
        return 'border-red-500/50 bg-red-500/10';
      default:
        return 'border-yellow-500/50 bg-yellow-500/10';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-400 mb-4 mx-auto"></div>
          <h2 className="text-2xl font-bold text-white mb-2">CoinBitClub</h2>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Authentication Required</h2>
          <p className="text-gray-400">Please log in to access the test page.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>User Settings API Test - CoinBitClub Enterprise</title>
        <meta name="description" content="Test page for user settings API integration" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent mb-4">
              User Settings API Test
            </h1>
            <p className="text-gray-400 text-lg mb-6">
              Comprehensive testing of the enhanced user settings API integration
            </p>
            
            <button
              onClick={runAllTests}
              disabled={testing}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-bold rounded-xl transition-all flex items-center gap-2 mx-auto disabled:opacity-50"
            >
              <FiRefreshCw className={`w-5 h-5 ${testing ? 'animate-spin' : ''}`} />
              {testing ? 'Running Tests...' : 'Run All Tests'}
            </button>
          </div>

          {/* User Info */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Current User</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-gray-400">Email:</span>
                <p className="text-white font-medium">{user.email}</p>
              </div>
              <div>
                <span className="text-gray-400">User Type:</span>
                <p className="text-white font-medium">{user.userType}</p>
              </div>
              <div>
                <span className="text-gray-400">ID:</span>
                <p className="text-white font-medium">{user.id}</p>
              </div>
            </div>
          </div>

          {/* Test Results */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-6">Test Results</h2>
            
            {testResults.length === 0 && !testing && (
              <div className="text-center py-12">
                <FiDatabase className="w-16 h-16 mx-auto text-gray-400 mb-4 opacity-50" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No Tests Run Yet</h3>
                <p className="text-gray-500">Click "Run All Tests" to start testing the user settings API</p>
              </div>
            )}

            {testResults.map((result, index) => {
              const test = tests.find(t => t.name === result.name);
              return (
                <div
                  key={index}
                  className={`border rounded-xl p-6 transition-all ${getStatusColor(result.status)}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(result.status)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {test?.icon && <test.icon className="w-5 h-5 text-gray-400" />}
                        <h3 className="text-lg font-semibold text-white">{result.name}</h3>
                      </div>
                      
                      <p className="text-gray-400 text-sm mb-3">{test?.description}</p>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          result.status === 'success' ? 'bg-green-500/20 text-green-400' :
                          result.status === 'error' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {result.status.toUpperCase()}
                        </span>
                      </div>
                      
                      <p className="text-gray-300">{result.message}</p>
                      
                      {result.data && (
                        <details className="mt-4">
                          <summary className="text-sm text-gray-400 cursor-pointer hover:text-gray-300">
                            View Response Data
                          </summary>
                          <pre className="mt-2 p-4 bg-black/20 rounded-lg text-xs text-gray-300 overflow-auto">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          {testResults.length > 0 && !testing && (
            <div className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Test Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">
                    {testResults.filter(r => r.status === 'success').length}
                  </div>
                  <div className="text-gray-400">Passed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-400">
                    {testResults.filter(r => r.status === 'error').length}
                  </div>
                  <div className="text-gray-400">Failed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">
                    {testResults.length}
                  </div>
                  <div className="text-gray-400">Total</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TestUserSettingsPage;
