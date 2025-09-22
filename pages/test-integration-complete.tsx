/**
 * 🧪 COMPLETE INTEGRATION TEST PAGE
 * Test complete frontend-backend user profile system integration
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
  FiKey,
  FiLogin,
  FiServer,
  FiMonitor,
  FiGlobe
} from 'react-icons/fi';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  data?: any;
  duration?: number;
}

const TestIntegrationCompletePage: React.FC = () => {
  const { user, loading, login, logout } = useAuth();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testing, setTesting] = useState(false);
  const [currentTest, setCurrentTest] = useState('');

  const tests = [
    {
      category: 'Backend Server',
      tests: [
        {
          name: 'Health Check',
          endpoint: 'health',
          method: 'GET',
          icon: FiServer,
          description: 'Test backend server health'
        },
        {
          name: 'API Status',
          endpoint: 'api/status',
          method: 'GET',
          icon: FiMonitor,
          description: 'Test API status endpoint'
        },
        {
          name: 'Database Connection',
          endpoint: 'api/test-connection',
          method: 'GET',
          icon: FiDatabase,
          description: 'Test database connectivity'
        }
      ]
    },
    {
      category: 'Authentication',
      tests: [
        {
          name: 'Admin Login',
          endpoint: 'api/auth/login',
          method: 'POST',
          icon: FiLogin,
          description: 'Test admin user login',
          payload: { email: 'admin@coinbitclub.com', password: 'admin123' }
        },
        {
          name: 'User Login',
          endpoint: 'api/auth/login',
          method: 'POST',
          icon: FiLogin,
          description: 'Test regular user login',
          payload: { email: 'user@coinbitclub.com', password: 'user123' }
        },
        {
          name: 'Affiliate Login',
          endpoint: 'api/auth/login',
          method: 'POST',
          icon: FiLogin,
          description: 'Test affiliate user login',
          payload: { email: 'affiliate@coinbitclub.com', password: 'affiliate123' }
        }
      ]
    },
    {
      category: 'User Profile',
      tests: [
        {
          name: 'Get User Profile',
          endpoint: 'api/user/profile',
          method: 'GET',
          icon: FiUser,
          description: 'Test user profile retrieval',
          requiresAuth: true
        }
      ]
    },
    {
      category: 'User Settings',
      tests: [
        {
          name: 'Get All Settings',
          endpoint: 'api/user-settings/all',
          method: 'GET',
          icon: FiSettings,
          description: 'Test retrieving all user settings',
          requiresAuth: true
        },
        {
          name: 'Get Trading Settings',
          endpoint: 'api/user-settings/trading',
          method: 'GET',
          icon: FiTrendingUp,
          description: 'Test trading settings retrieval',
          requiresAuth: true
        },
        {
          name: 'Update Trading Settings',
          endpoint: 'api/user-settings/trading',
          method: 'PUT',
          icon: FiSettings,
          description: 'Test trading settings update',
          requiresAuth: true,
          payload: {
            max_leverage: 8,
            risk_level: 'high',
            auto_trade_enabled: true
          }
        }
      ]
    }
  ];

  const runAllTests = async () => {
    setTesting(true);
    setTestResults([]);
    let authToken = '';

    try {
      for (const category of tests) {
        for (const test of category.tests) {
          setCurrentTest(`${category.category}: ${test.name}`);
          
          const startTime = Date.now();
          const result: TestResult = {
            name: `${category.category}: ${test.name}`,
            status: 'pending',
            message: 'Running test...'
          };
          setTestResults(prev => [...prev, result]);

          try {
            let response;
            const url = `http://localhost:3336/${test.endpoint}`;
            
            if (test.method === 'GET') {
              response = await fetch(url, {
                headers: test.requiresAuth && authToken ? {
                  'Authorization': `Bearer ${authToken}`
                } : {}
              });
            } else if (test.method === 'POST') {
              response = await fetch(url, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(test.payload)
              });
            } else if (test.method === 'PUT') {
              response = await fetch(url, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  ...(test.requiresAuth && authToken ? {
                    'Authorization': `Bearer ${authToken}`
                  } : {})
                },
                body: JSON.stringify(test.payload)
              });
            }

            const data = await response.json();
            const duration = Date.now() - startTime;

            if (response.ok && data.success !== false) {
              result.status = 'success';
              result.message = 'Test passed successfully';
              result.data = data;
              result.duration = duration;

              // Store auth token for subsequent requests
              if (test.endpoint === 'api/auth/login' && data.accessToken) {
                authToken = data.accessToken;
              }
            } else {
              result.status = 'error';
              result.message = data.error || `HTTP ${response.status}: ${response.statusText}`;
              result.duration = duration;
            }

          } catch (error: any) {
            const duration = Date.now() - startTime;
            result.status = 'error';
            result.message = error.message || 'Test failed with unknown error';
            result.duration = duration;
          }

          setTestResults(prev => prev.map(r => r.name === result.name ? result : r));
          
          // Small delay between tests
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

    } catch (error: any) {
      console.error('Test suite error:', error);
    } finally {
      setTesting(false);
      setCurrentTest('');
    }
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Backend Server':
        return FiServer;
      case 'Authentication':
        return FiLogin;
      case 'User Profile':
        return FiUser;
      case 'User Settings':
        return FiSettings;
      default:
        return FiMonitor;
    }
  };

  return (
    <>
      <Head>
        <title>Complete Integration Test - CoinBitClub Enterprise</title>
        <meta name="description" content="Complete frontend-backend integration test" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent mb-4">
              Complete Integration Test
            </h1>
            <p className="text-gray-400 text-lg mb-6">
              Comprehensive testing of frontend-backend user profile system integration
            </p>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={runAllTests}
                disabled={testing}
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-bold rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <FiRefreshCw className={`w-5 h-5 ${testing ? 'animate-spin' : ''}`} />
                {testing ? 'Running Tests...' : 'Run All Tests'}
              </button>
              
              <button
                onClick={() => window.open('http://localhost:3003', '_blank')}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold rounded-xl transition-all flex items-center gap-2"
              >
                <FiGlobe className="w-5 h-5" />
                Open Frontend
              </button>
            </div>
          </div>

          {/* Current Test Status */}
          {testing && (
            <div className="mb-8 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-blue-500/30 p-6">
              <div className="flex items-center gap-3">
                <FiRefreshCw className="w-6 h-6 text-blue-400 animate-spin" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Currently Testing</h3>
                  <p className="text-gray-400">{currentTest}</p>
                </div>
              </div>
            </div>
          )}

          {/* Test Results by Category */}
          <div className="space-y-8">
            {tests.map((category, categoryIndex) => {
              const CategoryIcon = getCategoryIcon(category.category);
              const categoryResults = testResults.filter(r => r.name.startsWith(category.category));
              
              return (
                <div key={categoryIndex} className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <CategoryIcon className="w-6 h-6 text-orange-400" />
                    <h2 className="text-2xl font-bold text-white">{category.category}</h2>
                    <span className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-sm">
                      {categoryResults.length} tests
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {category.tests.map((test, testIndex) => {
                      const result = testResults.find(r => r.name === `${category.category}: ${test.name}`);
                      const TestIcon = test.icon;
                      
                      return (
                        <div
                          key={testIndex}
                          className={`border rounded-xl p-4 transition-all ${
                            result ? getStatusColor(result.status) : 'border-gray-600/50 bg-gray-700/20'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                              {result ? getStatusIcon(result.status) : <TestIcon className="w-5 h-5 text-gray-400" />}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <TestIcon className="w-4 h-4 text-gray-400" />
                                <h3 className="text-sm font-semibold text-white truncate">{test.name}</h3>
                              </div>
                              
                              <p className="text-xs text-gray-400 mb-3 line-clamp-2">{test.description}</p>
                              
                              {result && (
                                <>
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                      result.status === 'success' ? 'bg-green-500/20 text-green-400' :
                                      result.status === 'error' ? 'bg-red-500/20 text-red-400' :
                                      'bg-yellow-500/20 text-yellow-400'
                                    }`}>
                                      {result.status.toUpperCase()}
                                    </span>
                                    {result.duration && (
                                      <span className="text-xs text-gray-400">
                                        {result.duration}ms
                                      </span>
                                    )}
                                  </div>
                                  
                                  <p className="text-xs text-gray-300 mb-2">{result.message}</p>
                                  
                                  {result.data && (
                                    <details className="text-xs">
                                      <summary className="text-gray-400 cursor-pointer hover:text-gray-300">
                                        View Response
                                      </summary>
                                      <pre className="mt-2 p-2 bg-black/20 rounded text-xs text-gray-300 overflow-auto max-h-32">
                                        {JSON.stringify(result.data, null, 2)}
                                      </pre>
                                    </details>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          {testResults.length > 0 && !testing && (
            <div className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Test Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">
                    {testResults.length > 0 ? Math.round((testResults.filter(r => r.status === 'success').length / testResults.length) * 100) : 0}%
                  </div>
                  <div className="text-gray-400">Success Rate</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TestIntegrationCompletePage;
 * 🧪 COMPLETE INTEGRATION TEST PAGE
 * Test complete frontend-backend user profile system integration
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
  FiKey,
  FiLogin,
  FiServer,
  FiMonitor,
  FiGlobe
} from 'react-icons/fi';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  data?: any;
  duration?: number;
}

const TestIntegrationCompletePage: React.FC = () => {
  const { user, loading, login, logout } = useAuth();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testing, setTesting] = useState(false);
  const [currentTest, setCurrentTest] = useState('');

  const tests = [
    {
      category: 'Backend Server',
      tests: [
        {
          name: 'Health Check',
          endpoint: 'health',
          method: 'GET',
          icon: FiServer,
          description: 'Test backend server health'
        },
        {
          name: 'API Status',
          endpoint: 'api/status',
          method: 'GET',
          icon: FiMonitor,
          description: 'Test API status endpoint'
        },
        {
          name: 'Database Connection',
          endpoint: 'api/test-connection',
          method: 'GET',
          icon: FiDatabase,
          description: 'Test database connectivity'
        }
      ]
    },
    {
      category: 'Authentication',
      tests: [
        {
          name: 'Admin Login',
          endpoint: 'api/auth/login',
          method: 'POST',
          icon: FiLogin,
          description: 'Test admin user login',
          payload: { email: 'admin@coinbitclub.com', password: 'admin123' }
        },
        {
          name: 'User Login',
          endpoint: 'api/auth/login',
          method: 'POST',
          icon: FiLogin,
          description: 'Test regular user login',
          payload: { email: 'user@coinbitclub.com', password: 'user123' }
        },
        {
          name: 'Affiliate Login',
          endpoint: 'api/auth/login',
          method: 'POST',
          icon: FiLogin,
          description: 'Test affiliate user login',
          payload: { email: 'affiliate@coinbitclub.com', password: 'affiliate123' }
        }
      ]
    },
    {
      category: 'User Profile',
      tests: [
        {
          name: 'Get User Profile',
          endpoint: 'api/user/profile',
          method: 'GET',
          icon: FiUser,
          description: 'Test user profile retrieval',
          requiresAuth: true
        }
      ]
    },
    {
      category: 'User Settings',
      tests: [
        {
          name: 'Get All Settings',
          endpoint: 'api/user-settings/all',
          method: 'GET',
          icon: FiSettings,
          description: 'Test retrieving all user settings',
          requiresAuth: true
        },
        {
          name: 'Get Trading Settings',
          endpoint: 'api/user-settings/trading',
          method: 'GET',
          icon: FiTrendingUp,
          description: 'Test trading settings retrieval',
          requiresAuth: true
        },
        {
          name: 'Update Trading Settings',
          endpoint: 'api/user-settings/trading',
          method: 'PUT',
          icon: FiSettings,
          description: 'Test trading settings update',
          requiresAuth: true,
          payload: {
            max_leverage: 8,
            risk_level: 'high',
            auto_trade_enabled: true
          }
        }
      ]
    }
  ];

  const runAllTests = async () => {
    setTesting(true);
    setTestResults([]);
    let authToken = '';

    try {
      for (const category of tests) {
        for (const test of category.tests) {
          setCurrentTest(`${category.category}: ${test.name}`);
          
          const startTime = Date.now();
          const result: TestResult = {
            name: `${category.category}: ${test.name}`,
            status: 'pending',
            message: 'Running test...'
          };
          setTestResults(prev => [...prev, result]);

          try {
            let response;
            const url = `http://localhost:3336/${test.endpoint}`;
            
            if (test.method === 'GET') {
              response = await fetch(url, {
                headers: test.requiresAuth && authToken ? {
                  'Authorization': `Bearer ${authToken}`
                } : {}
              });
            } else if (test.method === 'POST') {
              response = await fetch(url, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(test.payload)
              });
            } else if (test.method === 'PUT') {
              response = await fetch(url, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  ...(test.requiresAuth && authToken ? {
                    'Authorization': `Bearer ${authToken}`
                  } : {})
                },
                body: JSON.stringify(test.payload)
              });
            }

            const data = await response.json();
            const duration = Date.now() - startTime;

            if (response.ok && data.success !== false) {
              result.status = 'success';
              result.message = 'Test passed successfully';
              result.data = data;
              result.duration = duration;

              // Store auth token for subsequent requests
              if (test.endpoint === 'api/auth/login' && data.accessToken) {
                authToken = data.accessToken;
              }
            } else {
              result.status = 'error';
              result.message = data.error || `HTTP ${response.status}: ${response.statusText}`;
              result.duration = duration;
            }

          } catch (error: any) {
            const duration = Date.now() - startTime;
            result.status = 'error';
            result.message = error.message || 'Test failed with unknown error';
            result.duration = duration;
          }

          setTestResults(prev => prev.map(r => r.name === result.name ? result : r));
          
          // Small delay between tests
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

    } catch (error: any) {
      console.error('Test suite error:', error);
    } finally {
      setTesting(false);
      setCurrentTest('');
    }
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Backend Server':
        return FiServer;
      case 'Authentication':
        return FiLogin;
      case 'User Profile':
        return FiUser;
      case 'User Settings':
        return FiSettings;
      default:
        return FiMonitor;
    }
  };

  return (
    <>
      <Head>
        <title>Complete Integration Test - CoinBitClub Enterprise</title>
        <meta name="description" content="Complete frontend-backend integration test" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent mb-4">
              Complete Integration Test
            </h1>
            <p className="text-gray-400 text-lg mb-6">
              Comprehensive testing of frontend-backend user profile system integration
            </p>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={runAllTests}
                disabled={testing}
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-bold rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <FiRefreshCw className={`w-5 h-5 ${testing ? 'animate-spin' : ''}`} />
                {testing ? 'Running Tests...' : 'Run All Tests'}
              </button>
              
              <button
                onClick={() => window.open('http://localhost:3003', '_blank')}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold rounded-xl transition-all flex items-center gap-2"
              >
                <FiGlobe className="w-5 h-5" />
                Open Frontend
              </button>
            </div>
          </div>

          {/* Current Test Status */}
          {testing && (
            <div className="mb-8 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-blue-500/30 p-6">
              <div className="flex items-center gap-3">
                <FiRefreshCw className="w-6 h-6 text-blue-400 animate-spin" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Currently Testing</h3>
                  <p className="text-gray-400">{currentTest}</p>
                </div>
              </div>
            </div>
          )}

          {/* Test Results by Category */}
          <div className="space-y-8">
            {tests.map((category, categoryIndex) => {
              const CategoryIcon = getCategoryIcon(category.category);
              const categoryResults = testResults.filter(r => r.name.startsWith(category.category));
              
              return (
                <div key={categoryIndex} className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <CategoryIcon className="w-6 h-6 text-orange-400" />
                    <h2 className="text-2xl font-bold text-white">{category.category}</h2>
                    <span className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-sm">
                      {categoryResults.length} tests
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {category.tests.map((test, testIndex) => {
                      const result = testResults.find(r => r.name === `${category.category}: ${test.name}`);
                      const TestIcon = test.icon;
                      
                      return (
                        <div
                          key={testIndex}
                          className={`border rounded-xl p-4 transition-all ${
                            result ? getStatusColor(result.status) : 'border-gray-600/50 bg-gray-700/20'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                              {result ? getStatusIcon(result.status) : <TestIcon className="w-5 h-5 text-gray-400" />}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <TestIcon className="w-4 h-4 text-gray-400" />
                                <h3 className="text-sm font-semibold text-white truncate">{test.name}</h3>
                              </div>
                              
                              <p className="text-xs text-gray-400 mb-3 line-clamp-2">{test.description}</p>
                              
                              {result && (
                                <>
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                      result.status === 'success' ? 'bg-green-500/20 text-green-400' :
                                      result.status === 'error' ? 'bg-red-500/20 text-red-400' :
                                      'bg-yellow-500/20 text-yellow-400'
                                    }`}>
                                      {result.status.toUpperCase()}
                                    </span>
                                    {result.duration && (
                                      <span className="text-xs text-gray-400">
                                        {result.duration}ms
                                      </span>
                                    )}
                                  </div>
                                  
                                  <p className="text-xs text-gray-300 mb-2">{result.message}</p>
                                  
                                  {result.data && (
                                    <details className="text-xs">
                                      <summary className="text-gray-400 cursor-pointer hover:text-gray-300">
                                        View Response
                                      </summary>
                                      <pre className="mt-2 p-2 bg-black/20 rounded text-xs text-gray-300 overflow-auto max-h-32">
                                        {JSON.stringify(result.data, null, 2)}
                                      </pre>
                                    </details>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          {testResults.length > 0 && !testing && (
            <div className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Test Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">
                    {testResults.length > 0 ? Math.round((testResults.filter(r => r.status === 'success').length / testResults.length) * 100) : 0}%
                  </div>
                  <div className="text-gray-400">Success Rate</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TestIntegrationCompletePage;
 * 🧪 COMPLETE INTEGRATION TEST PAGE
 * Test complete frontend-backend user profile system integration
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
  FiKey,
  FiLogin,
  FiServer,
  FiMonitor,
  FiGlobe
} from 'react-icons/fi';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  data?: any;
  duration?: number;
}

const TestIntegrationCompletePage: React.FC = () => {
  const { user, loading, login, logout } = useAuth();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testing, setTesting] = useState(false);
  const [currentTest, setCurrentTest] = useState('');

  const tests = [
    {
      category: 'Backend Server',
      tests: [
        {
          name: 'Health Check',
          endpoint: 'health',
          method: 'GET',
          icon: FiServer,
          description: 'Test backend server health'
        },
        {
          name: 'API Status',
          endpoint: 'api/status',
          method: 'GET',
          icon: FiMonitor,
          description: 'Test API status endpoint'
        },
        {
          name: 'Database Connection',
          endpoint: 'api/test-connection',
          method: 'GET',
          icon: FiDatabase,
          description: 'Test database connectivity'
        }
      ]
    },
    {
      category: 'Authentication',
      tests: [
        {
          name: 'Admin Login',
          endpoint: 'api/auth/login',
          method: 'POST',
          icon: FiLogin,
          description: 'Test admin user login',
          payload: { email: 'admin@coinbitclub.com', password: 'admin123' }
        },
        {
          name: 'User Login',
          endpoint: 'api/auth/login',
          method: 'POST',
          icon: FiLogin,
          description: 'Test regular user login',
          payload: { email: 'user@coinbitclub.com', password: 'user123' }
        },
        {
          name: 'Affiliate Login',
          endpoint: 'api/auth/login',
          method: 'POST',
          icon: FiLogin,
          description: 'Test affiliate user login',
          payload: { email: 'affiliate@coinbitclub.com', password: 'affiliate123' }
        }
      ]
    },
    {
      category: 'User Profile',
      tests: [
        {
          name: 'Get User Profile',
          endpoint: 'api/user/profile',
          method: 'GET',
          icon: FiUser,
          description: 'Test user profile retrieval',
          requiresAuth: true
        }
      ]
    },
    {
      category: 'User Settings',
      tests: [
        {
          name: 'Get All Settings',
          endpoint: 'api/user-settings/all',
          method: 'GET',
          icon: FiSettings,
          description: 'Test retrieving all user settings',
          requiresAuth: true
        },
        {
          name: 'Get Trading Settings',
          endpoint: 'api/user-settings/trading',
          method: 'GET',
          icon: FiTrendingUp,
          description: 'Test trading settings retrieval',
          requiresAuth: true
        },
        {
          name: 'Update Trading Settings',
          endpoint: 'api/user-settings/trading',
          method: 'PUT',
          icon: FiSettings,
          description: 'Test trading settings update',
          requiresAuth: true,
          payload: {
            max_leverage: 8,
            risk_level: 'high',
            auto_trade_enabled: true
          }
        }
      ]
    }
  ];

  const runAllTests = async () => {
    setTesting(true);
    setTestResults([]);
    let authToken = '';

    try {
      for (const category of tests) {
        for (const test of category.tests) {
          setCurrentTest(`${category.category}: ${test.name}`);
          
          const startTime = Date.now();
          const result: TestResult = {
            name: `${category.category}: ${test.name}`,
            status: 'pending',
            message: 'Running test...'
          };
          setTestResults(prev => [...prev, result]);

          try {
            let response;
            const url = `http://localhost:3336/${test.endpoint}`;
            
            if (test.method === 'GET') {
              response = await fetch(url, {
                headers: test.requiresAuth && authToken ? {
                  'Authorization': `Bearer ${authToken}`
                } : {}
              });
            } else if (test.method === 'POST') {
              response = await fetch(url, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(test.payload)
              });
            } else if (test.method === 'PUT') {
              response = await fetch(url, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  ...(test.requiresAuth && authToken ? {
                    'Authorization': `Bearer ${authToken}`
                  } : {})
                },
                body: JSON.stringify(test.payload)
              });
            }

            const data = await response.json();
            const duration = Date.now() - startTime;

            if (response.ok && data.success !== false) {
              result.status = 'success';
              result.message = 'Test passed successfully';
              result.data = data;
              result.duration = duration;

              // Store auth token for subsequent requests
              if (test.endpoint === 'api/auth/login' && data.accessToken) {
                authToken = data.accessToken;
              }
            } else {
              result.status = 'error';
              result.message = data.error || `HTTP ${response.status}: ${response.statusText}`;
              result.duration = duration;
            }

          } catch (error: any) {
            const duration = Date.now() - startTime;
            result.status = 'error';
            result.message = error.message || 'Test failed with unknown error';
            result.duration = duration;
          }

          setTestResults(prev => prev.map(r => r.name === result.name ? result : r));
          
          // Small delay between tests
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

    } catch (error: any) {
      console.error('Test suite error:', error);
    } finally {
      setTesting(false);
      setCurrentTest('');
    }
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Backend Server':
        return FiServer;
      case 'Authentication':
        return FiLogin;
      case 'User Profile':
        return FiUser;
      case 'User Settings':
        return FiSettings;
      default:
        return FiMonitor;
    }
  };

  return (
    <>
      <Head>
        <title>Complete Integration Test - CoinBitClub Enterprise</title>
        <meta name="description" content="Complete frontend-backend integration test" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent mb-4">
              Complete Integration Test
            </h1>
            <p className="text-gray-400 text-lg mb-6">
              Comprehensive testing of frontend-backend user profile system integration
            </p>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={runAllTests}
                disabled={testing}
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-bold rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <FiRefreshCw className={`w-5 h-5 ${testing ? 'animate-spin' : ''}`} />
                {testing ? 'Running Tests...' : 'Run All Tests'}
              </button>
              
              <button
                onClick={() => window.open('http://localhost:3003', '_blank')}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold rounded-xl transition-all flex items-center gap-2"
              >
                <FiGlobe className="w-5 h-5" />
                Open Frontend
              </button>
            </div>
          </div>

          {/* Current Test Status */}
          {testing && (
            <div className="mb-8 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-blue-500/30 p-6">
              <div className="flex items-center gap-3">
                <FiRefreshCw className="w-6 h-6 text-blue-400 animate-spin" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Currently Testing</h3>
                  <p className="text-gray-400">{currentTest}</p>
                </div>
              </div>
            </div>
          )}

          {/* Test Results by Category */}
          <div className="space-y-8">
            {tests.map((category, categoryIndex) => {
              const CategoryIcon = getCategoryIcon(category.category);
              const categoryResults = testResults.filter(r => r.name.startsWith(category.category));
              
              return (
                <div key={categoryIndex} className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <CategoryIcon className="w-6 h-6 text-orange-400" />
                    <h2 className="text-2xl font-bold text-white">{category.category}</h2>
                    <span className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-sm">
                      {categoryResults.length} tests
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {category.tests.map((test, testIndex) => {
                      const result = testResults.find(r => r.name === `${category.category}: ${test.name}`);
                      const TestIcon = test.icon;
                      
                      return (
                        <div
                          key={testIndex}
                          className={`border rounded-xl p-4 transition-all ${
                            result ? getStatusColor(result.status) : 'border-gray-600/50 bg-gray-700/20'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                              {result ? getStatusIcon(result.status) : <TestIcon className="w-5 h-5 text-gray-400" />}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <TestIcon className="w-4 h-4 text-gray-400" />
                                <h3 className="text-sm font-semibold text-white truncate">{test.name}</h3>
                              </div>
                              
                              <p className="text-xs text-gray-400 mb-3 line-clamp-2">{test.description}</p>
                              
                              {result && (
                                <>
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                      result.status === 'success' ? 'bg-green-500/20 text-green-400' :
                                      result.status === 'error' ? 'bg-red-500/20 text-red-400' :
                                      'bg-yellow-500/20 text-yellow-400'
                                    }`}>
                                      {result.status.toUpperCase()}
                                    </span>
                                    {result.duration && (
                                      <span className="text-xs text-gray-400">
                                        {result.duration}ms
                                      </span>
                                    )}
                                  </div>
                                  
                                  <p className="text-xs text-gray-300 mb-2">{result.message}</p>
                                  
                                  {result.data && (
                                    <details className="text-xs">
                                      <summary className="text-gray-400 cursor-pointer hover:text-gray-300">
                                        View Response
                                      </summary>
                                      <pre className="mt-2 p-2 bg-black/20 rounded text-xs text-gray-300 overflow-auto max-h-32">
                                        {JSON.stringify(result.data, null, 2)}
                                      </pre>
                                    </details>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          {testResults.length > 0 && !testing && (
            <div className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Test Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">
                    {testResults.length > 0 ? Math.round((testResults.filter(r => r.status === 'success').length / testResults.length) * 100) : 0}%
                  </div>
                  <div className="text-gray-400">Success Rate</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TestIntegrationCompletePage;
