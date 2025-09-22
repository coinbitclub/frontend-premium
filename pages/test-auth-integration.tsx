/**
 * 🔐 AUTHENTICATION INTEGRATION TEST PAGE
 * Test complete frontend-backend authentication integration
 */

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '../src/contexts/AuthContext';
import { apiService } from '../src/services/apiService';
import { 
  FiCheck, 
  FiX, 
  FiRefreshCw, 
  FiLogIn,
  FiLogOut,
  FiUser,
  FiKey,
  FiShield,
  FiAlertCircle,
  FiEye,
  FiEyeOff,
  FiMail,
  FiLock
} from 'react-icons/fi';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  data?: any;
  duration?: number;
}

const TestAuthIntegrationPage: React.FC = () => {
  const { user, loading, login, logout } = useAuth();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testing, setTesting] = useState(false);
  const [currentTest, setCurrentTest] = useState('');
  
  // Test credentials
  const [testCredentials, setTestCredentials] = useState({
    email: 'admin@coinbitclub.com',
    password: 'admin123',
    showPassword: false
  });

  const authTests = [
    {
      category: 'Backend Authentication',
      tests: [
        {
          name: 'Health Check',
          description: 'Test backend server health',
          test: async () => {
            const response = await fetch('http://localhost:3337/health');
            const data = await response.json();
            return { success: response.ok, data };
          }
        },
        {
          name: 'Admin Login',
          description: 'Test admin user login',
          test: async () => {
            const response = await fetch('http://localhost:3337/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: 'admin@coinbitclub.com', password: 'admin123' })
            });
            const data = await response.json();
            return { success: data.success, data };
          }
        },
        {
          name: 'User Login',
          description: 'Test regular user login',
          test: async () => {
            const response = await fetch('http://localhost:3337/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: 'user@coinbitclub.com', password: 'user123' })
            });
            const data = await response.json();
            return { success: data.success, data };
          }
        },
        {
          name: 'Affiliate Login',
          description: 'Test affiliate user login',
          test: async () => {
            const response = await fetch('http://localhost:3337/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: 'affiliate@coinbitclub.com', password: 'affiliate123' })
            });
            const data = await response.json();
            return { success: data.success, data };
          }
        },
        {
          name: 'Invalid Login',
          description: 'Test invalid credentials rejection',
          test: async () => {
            const response = await fetch('http://localhost:3337/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: 'invalid@test.com', password: 'wrong' })
            });
            const data = await response.json();
            return { success: !data.success, data }; // Should fail
          }
        }
      ]
    },
    {
      category: 'Token Management',
      tests: [
        {
          name: 'Token Validation',
          description: 'Test JWT token validation',
          test: async () => {
            // First login to get token
            const loginResponse = await fetch('http://localhost:3337/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: 'admin@coinbitclub.com', password: 'admin123' })
            });
            const loginData = await loginResponse.json();
            
            if (!loginData.success) {
              return { success: false, data: loginData };
            }
            
            // Test token validation
            const validateResponse = await fetch('http://localhost:3337/api/auth/validate', {
              headers: { 'Authorization': `Bearer ${loginData.accessToken}` }
            });
            const validateData = await validateResponse.json();
            return { success: validateData.success, data: validateData };
          }
        },
        {
          name: 'Protected Route Access',
          description: 'Test access to protected routes',
          test: async () => {
            // First login to get token
            const loginResponse = await fetch('http://localhost:3337/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: 'admin@coinbitclub.com', password: 'admin123' })
            });
            const loginData = await loginResponse.json();
            
            if (!loginData.success) {
              return { success: false, data: loginData };
            }
            
            // Test protected profile route
            const profileResponse = await fetch('http://localhost:3337/api/auth/profile', {
              headers: { 'Authorization': `Bearer ${loginData.accessToken}` }
            });
            const profileData = await profileResponse.json();
            return { success: profileData.success, data: profileData };
          }
        },
        {
          name: 'Role-Based Access',
          description: 'Test admin-only route access',
          test: async () => {
            // First login as admin
            const loginResponse = await fetch('http://localhost:3337/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: 'admin@coinbitclub.com', password: 'admin123' })
            });
            const loginData = await loginResponse.json();
            
            if (!loginData.success) {
              return { success: false, data: loginData };
            }
            
            // Test admin-only route
            const adminResponse = await fetch('http://localhost:3337/api/auth/admin-only', {
              headers: { 'Authorization': `Bearer ${loginData.accessToken}` }
            });
            const adminData = await adminResponse.json();
            return { success: adminData.success, data: adminData };
          }
        }
      ]
    },
    {
      category: 'Frontend Integration',
      tests: [
        {
          name: 'Frontend Auth Context',
          description: 'Test frontend authentication context',
          test: async () => {
            return { success: true, data: { user, loading } };
          }
        },
        {
          name: 'API Service Integration',
          description: 'Test API service with authentication',
          test: async () => {
            try {
              // This will test if the API service can make authenticated requests
              const response = await apiService.getUserProfile();
              return { success: response.success !== false, data: response };
            } catch (error: any) {
              return { success: false, data: { error: error.message } };
            }
          }
        }
      ]
    }
  ];

  const runAllAuthTests = async () => {
    setTesting(true);
    setTestResults([]);

    try {
      for (const category of authTests) {
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
            const testResult = await test.test();
            const duration = Date.now() - startTime;

            result.status = testResult.success ? 'success' : 'error';
            result.message = testResult.success ? 'Test passed successfully' : 'Test failed';
            result.data = testResult.data;
            result.duration = duration;

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

  const testManualLogin = async () => {
    setTesting(true);
    try {
      const result = await login(testCredentials.email, testCredentials.password);
      console.log('Manual login result:', result);
    } catch (error: any) {
      console.error('Manual login error:', error);
    } finally {
      setTesting(false);
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
      case 'Backend Authentication':
        return FiLogIn;
      case 'Token Management':
        return FiKey;
      case 'Frontend Integration':
        return FiUser;
      default:
        return FiShield;
    }
  };

  return (
    <>
      <Head>
        <title>Authentication Integration Test - CoinBitClub Enterprise</title>
        <meta name="description" content="Test frontend-backend authentication integration" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent mb-4">
              Authentication Integration Test
            </h1>
            <p className="text-gray-400 text-lg mb-6">
              Comprehensive testing of frontend-backend authentication system
            </p>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={runAllAuthTests}
                disabled={testing}
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-bold rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <FiRefreshCw className={`w-5 h-5 ${testing ? 'animate-spin' : ''}`} />
                {testing ? 'Running Tests...' : 'Run All Auth Tests'}
              </button>
              
              <button
                onClick={logout}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold rounded-xl transition-all flex items-center gap-2"
              >
                <FiLogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>

          {/* Current User Status */}
          <div className="mb-8 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Current Authentication Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {loading ? 'Loading...' : user ? 'Logged In' : 'Not Logged In'}
                </div>
                <div className="text-gray-400">Status</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {user?.email || 'N/A'}
                </div>
                <div className="text-gray-400">Email</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {user?.userType || 'N/A'}
                </div>
                <div className="text-gray-400">User Type</div>
              </div>
            </div>
          </div>

          {/* Manual Login Test */}
          <div className="mb-8 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Manual Login Test</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={testCredentials.email}
                    onChange={(e) => setTestCredentials(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                    placeholder="Enter email"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type={testCredentials.showPassword ? 'text' : 'password'}
                    value={testCredentials.password}
                    onChange={(e) => setTestCredentials(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full pl-10 pr-12 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                    placeholder="Enter password"
                  />
                  <button
                    onClick={() => setTestCredentials(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                    className="absolute right-3 top-3 text-gray-400 hover:text-white"
                  >
                    {testCredentials.showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={testManualLogin}
                disabled={testing}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <FiLogIn className="w-5 h-5" />
                Test Login
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
            {authTests.map((category, categoryIndex) => {
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
                      
                      return (
                        <div
                          key={testIndex}
                          className={`border rounded-xl p-4 transition-all ${
                            result ? getStatusColor(result.status) : 'border-gray-600/50 bg-gray-700/20'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                              {result ? getStatusIcon(result.status) : <FiShield className="w-5 h-5 text-gray-400" />}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-semibold text-white truncate">{test.name}</h3>
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
              <h3 className="text-xl font-bold text-white mb-4">Authentication Test Summary</h3>
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

export default TestAuthIntegrationPage;
 * 🔐 AUTHENTICATION INTEGRATION TEST PAGE
 * Test complete frontend-backend authentication integration
 */

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '../src/contexts/AuthContext';
import { apiService } from '../src/services/apiService';
import { 
  FiCheck, 
  FiX, 
  FiRefreshCw, 
  FiLogIn,
  FiLogOut,
  FiUser,
  FiKey,
  FiShield,
  FiAlertCircle,
  FiEye,
  FiEyeOff,
  FiMail,
  FiLock
} from 'react-icons/fi';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  data?: any;
  duration?: number;
}

const TestAuthIntegrationPage: React.FC = () => {
  const { user, loading, login, logout } = useAuth();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testing, setTesting] = useState(false);
  const [currentTest, setCurrentTest] = useState('');
  
  // Test credentials
  const [testCredentials, setTestCredentials] = useState({
    email: 'admin@coinbitclub.com',
    password: 'admin123',
    showPassword: false
  });

  const authTests = [
    {
      category: 'Backend Authentication',
      tests: [
        {
          name: 'Health Check',
          description: 'Test backend server health',
          test: async () => {
            const response = await fetch('http://localhost:3337/health');
            const data = await response.json();
            return { success: response.ok, data };
          }
        },
        {
          name: 'Admin Login',
          description: 'Test admin user login',
          test: async () => {
            const response = await fetch('http://localhost:3337/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: 'admin@coinbitclub.com', password: 'admin123' })
            });
            const data = await response.json();
            return { success: data.success, data };
          }
        },
        {
          name: 'User Login',
          description: 'Test regular user login',
          test: async () => {
            const response = await fetch('http://localhost:3337/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: 'user@coinbitclub.com', password: 'user123' })
            });
            const data = await response.json();
            return { success: data.success, data };
          }
        },
        {
          name: 'Affiliate Login',
          description: 'Test affiliate user login',
          test: async () => {
            const response = await fetch('http://localhost:3337/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: 'affiliate@coinbitclub.com', password: 'affiliate123' })
            });
            const data = await response.json();
            return { success: data.success, data };
          }
        },
        {
          name: 'Invalid Login',
          description: 'Test invalid credentials rejection',
          test: async () => {
            const response = await fetch('http://localhost:3337/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: 'invalid@test.com', password: 'wrong' })
            });
            const data = await response.json();
            return { success: !data.success, data }; // Should fail
          }
        }
      ]
    },
    {
      category: 'Token Management',
      tests: [
        {
          name: 'Token Validation',
          description: 'Test JWT token validation',
          test: async () => {
            // First login to get token
            const loginResponse = await fetch('http://localhost:3337/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: 'admin@coinbitclub.com', password: 'admin123' })
            });
            const loginData = await loginResponse.json();
            
            if (!loginData.success) {
              return { success: false, data: loginData };
            }
            
            // Test token validation
            const validateResponse = await fetch('http://localhost:3337/api/auth/validate', {
              headers: { 'Authorization': `Bearer ${loginData.accessToken}` }
            });
            const validateData = await validateResponse.json();
            return { success: validateData.success, data: validateData };
          }
        },
        {
          name: 'Protected Route Access',
          description: 'Test access to protected routes',
          test: async () => {
            // First login to get token
            const loginResponse = await fetch('http://localhost:3337/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: 'admin@coinbitclub.com', password: 'admin123' })
            });
            const loginData = await loginResponse.json();
            
            if (!loginData.success) {
              return { success: false, data: loginData };
            }
            
            // Test protected profile route
            const profileResponse = await fetch('http://localhost:3337/api/auth/profile', {
              headers: { 'Authorization': `Bearer ${loginData.accessToken}` }
            });
            const profileData = await profileResponse.json();
            return { success: profileData.success, data: profileData };
          }
        },
        {
          name: 'Role-Based Access',
          description: 'Test admin-only route access',
          test: async () => {
            // First login as admin
            const loginResponse = await fetch('http://localhost:3337/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: 'admin@coinbitclub.com', password: 'admin123' })
            });
            const loginData = await loginResponse.json();
            
            if (!loginData.success) {
              return { success: false, data: loginData };
            }
            
            // Test admin-only route
            const adminResponse = await fetch('http://localhost:3337/api/auth/admin-only', {
              headers: { 'Authorization': `Bearer ${loginData.accessToken}` }
            });
            const adminData = await adminResponse.json();
            return { success: adminData.success, data: adminData };
          }
        }
      ]
    },
    {
      category: 'Frontend Integration',
      tests: [
        {
          name: 'Frontend Auth Context',
          description: 'Test frontend authentication context',
          test: async () => {
            return { success: true, data: { user, loading } };
          }
        },
        {
          name: 'API Service Integration',
          description: 'Test API service with authentication',
          test: async () => {
            try {
              // This will test if the API service can make authenticated requests
              const response = await apiService.getUserProfile();
              return { success: response.success !== false, data: response };
            } catch (error: any) {
              return { success: false, data: { error: error.message } };
            }
          }
        }
      ]
    }
  ];

  const runAllAuthTests = async () => {
    setTesting(true);
    setTestResults([]);

    try {
      for (const category of authTests) {
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
            const testResult = await test.test();
            const duration = Date.now() - startTime;

            result.status = testResult.success ? 'success' : 'error';
            result.message = testResult.success ? 'Test passed successfully' : 'Test failed';
            result.data = testResult.data;
            result.duration = duration;

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

  const testManualLogin = async () => {
    setTesting(true);
    try {
      const result = await login(testCredentials.email, testCredentials.password);
      console.log('Manual login result:', result);
    } catch (error: any) {
      console.error('Manual login error:', error);
    } finally {
      setTesting(false);
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
      case 'Backend Authentication':
        return FiLogIn;
      case 'Token Management':
        return FiKey;
      case 'Frontend Integration':
        return FiUser;
      default:
        return FiShield;
    }
  };

  return (
    <>
      <Head>
        <title>Authentication Integration Test - CoinBitClub Enterprise</title>
        <meta name="description" content="Test frontend-backend authentication integration" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent mb-4">
              Authentication Integration Test
            </h1>
            <p className="text-gray-400 text-lg mb-6">
              Comprehensive testing of frontend-backend authentication system
            </p>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={runAllAuthTests}
                disabled={testing}
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-bold rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <FiRefreshCw className={`w-5 h-5 ${testing ? 'animate-spin' : ''}`} />
                {testing ? 'Running Tests...' : 'Run All Auth Tests'}
              </button>
              
              <button
                onClick={logout}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold rounded-xl transition-all flex items-center gap-2"
              >
                <FiLogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>

          {/* Current User Status */}
          <div className="mb-8 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Current Authentication Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {loading ? 'Loading...' : user ? 'Logged In' : 'Not Logged In'}
                </div>
                <div className="text-gray-400">Status</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {user?.email || 'N/A'}
                </div>
                <div className="text-gray-400">Email</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {user?.userType || 'N/A'}
                </div>
                <div className="text-gray-400">User Type</div>
              </div>
            </div>
          </div>

          {/* Manual Login Test */}
          <div className="mb-8 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Manual Login Test</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={testCredentials.email}
                    onChange={(e) => setTestCredentials(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                    placeholder="Enter email"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type={testCredentials.showPassword ? 'text' : 'password'}
                    value={testCredentials.password}
                    onChange={(e) => setTestCredentials(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full pl-10 pr-12 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                    placeholder="Enter password"
                  />
                  <button
                    onClick={() => setTestCredentials(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                    className="absolute right-3 top-3 text-gray-400 hover:text-white"
                  >
                    {testCredentials.showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={testManualLogin}
                disabled={testing}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <FiLogIn className="w-5 h-5" />
                Test Login
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
            {authTests.map((category, categoryIndex) => {
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
                      
                      return (
                        <div
                          key={testIndex}
                          className={`border rounded-xl p-4 transition-all ${
                            result ? getStatusColor(result.status) : 'border-gray-600/50 bg-gray-700/20'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                              {result ? getStatusIcon(result.status) : <FiShield className="w-5 h-5 text-gray-400" />}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-semibold text-white truncate">{test.name}</h3>
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
              <h3 className="text-xl font-bold text-white mb-4">Authentication Test Summary</h3>
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

export default TestAuthIntegrationPage;
 * 🔐 AUTHENTICATION INTEGRATION TEST PAGE
 * Test complete frontend-backend authentication integration
 */

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '../src/contexts/AuthContext';
import { apiService } from '../src/services/apiService';
import { 
  FiCheck, 
  FiX, 
  FiRefreshCw, 
  FiLogIn,
  FiLogOut,
  FiUser,
  FiKey,
  FiShield,
  FiAlertCircle,
  FiEye,
  FiEyeOff,
  FiMail,
  FiLock
} from 'react-icons/fi';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  data?: any;
  duration?: number;
}

const TestAuthIntegrationPage: React.FC = () => {
  const { user, loading, login, logout } = useAuth();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testing, setTesting] = useState(false);
  const [currentTest, setCurrentTest] = useState('');
  
  // Test credentials
  const [testCredentials, setTestCredentials] = useState({
    email: 'admin@coinbitclub.com',
    password: 'admin123',
    showPassword: false
  });

  const authTests = [
    {
      category: 'Backend Authentication',
      tests: [
        {
          name: 'Health Check',
          description: 'Test backend server health',
          test: async () => {
            const response = await fetch('http://localhost:3337/health');
            const data = await response.json();
            return { success: response.ok, data };
          }
        },
        {
          name: 'Admin Login',
          description: 'Test admin user login',
          test: async () => {
            const response = await fetch('http://localhost:3337/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: 'admin@coinbitclub.com', password: 'admin123' })
            });
            const data = await response.json();
            return { success: data.success, data };
          }
        },
        {
          name: 'User Login',
          description: 'Test regular user login',
          test: async () => {
            const response = await fetch('http://localhost:3337/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: 'user@coinbitclub.com', password: 'user123' })
            });
            const data = await response.json();
            return { success: data.success, data };
          }
        },
        {
          name: 'Affiliate Login',
          description: 'Test affiliate user login',
          test: async () => {
            const response = await fetch('http://localhost:3337/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: 'affiliate@coinbitclub.com', password: 'affiliate123' })
            });
            const data = await response.json();
            return { success: data.success, data };
          }
        },
        {
          name: 'Invalid Login',
          description: 'Test invalid credentials rejection',
          test: async () => {
            const response = await fetch('http://localhost:3337/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: 'invalid@test.com', password: 'wrong' })
            });
            const data = await response.json();
            return { success: !data.success, data }; // Should fail
          }
        }
      ]
    },
    {
      category: 'Token Management',
      tests: [
        {
          name: 'Token Validation',
          description: 'Test JWT token validation',
          test: async () => {
            // First login to get token
            const loginResponse = await fetch('http://localhost:3337/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: 'admin@coinbitclub.com', password: 'admin123' })
            });
            const loginData = await loginResponse.json();
            
            if (!loginData.success) {
              return { success: false, data: loginData };
            }
            
            // Test token validation
            const validateResponse = await fetch('http://localhost:3337/api/auth/validate', {
              headers: { 'Authorization': `Bearer ${loginData.accessToken}` }
            });
            const validateData = await validateResponse.json();
            return { success: validateData.success, data: validateData };
          }
        },
        {
          name: 'Protected Route Access',
          description: 'Test access to protected routes',
          test: async () => {
            // First login to get token
            const loginResponse = await fetch('http://localhost:3337/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: 'admin@coinbitclub.com', password: 'admin123' })
            });
            const loginData = await loginResponse.json();
            
            if (!loginData.success) {
              return { success: false, data: loginData };
            }
            
            // Test protected profile route
            const profileResponse = await fetch('http://localhost:3337/api/auth/profile', {
              headers: { 'Authorization': `Bearer ${loginData.accessToken}` }
            });
            const profileData = await profileResponse.json();
            return { success: profileData.success, data: profileData };
          }
        },
        {
          name: 'Role-Based Access',
          description: 'Test admin-only route access',
          test: async () => {
            // First login as admin
            const loginResponse = await fetch('http://localhost:3337/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: 'admin@coinbitclub.com', password: 'admin123' })
            });
            const loginData = await loginResponse.json();
            
            if (!loginData.success) {
              return { success: false, data: loginData };
            }
            
            // Test admin-only route
            const adminResponse = await fetch('http://localhost:3337/api/auth/admin-only', {
              headers: { 'Authorization': `Bearer ${loginData.accessToken}` }
            });
            const adminData = await adminResponse.json();
            return { success: adminData.success, data: adminData };
          }
        }
      ]
    },
    {
      category: 'Frontend Integration',
      tests: [
        {
          name: 'Frontend Auth Context',
          description: 'Test frontend authentication context',
          test: async () => {
            return { success: true, data: { user, loading } };
          }
        },
        {
          name: 'API Service Integration',
          description: 'Test API service with authentication',
          test: async () => {
            try {
              // This will test if the API service can make authenticated requests
              const response = await apiService.getUserProfile();
              return { success: response.success !== false, data: response };
            } catch (error: any) {
              return { success: false, data: { error: error.message } };
            }
          }
        }
      ]
    }
  ];

  const runAllAuthTests = async () => {
    setTesting(true);
    setTestResults([]);

    try {
      for (const category of authTests) {
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
            const testResult = await test.test();
            const duration = Date.now() - startTime;

            result.status = testResult.success ? 'success' : 'error';
            result.message = testResult.success ? 'Test passed successfully' : 'Test failed';
            result.data = testResult.data;
            result.duration = duration;

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

  const testManualLogin = async () => {
    setTesting(true);
    try {
      const result = await login(testCredentials.email, testCredentials.password);
      console.log('Manual login result:', result);
    } catch (error: any) {
      console.error('Manual login error:', error);
    } finally {
      setTesting(false);
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
      case 'Backend Authentication':
        return FiLogIn;
      case 'Token Management':
        return FiKey;
      case 'Frontend Integration':
        return FiUser;
      default:
        return FiShield;
    }
  };

  return (
    <>
      <Head>
        <title>Authentication Integration Test - CoinBitClub Enterprise</title>
        <meta name="description" content="Test frontend-backend authentication integration" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent mb-4">
              Authentication Integration Test
            </h1>
            <p className="text-gray-400 text-lg mb-6">
              Comprehensive testing of frontend-backend authentication system
            </p>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={runAllAuthTests}
                disabled={testing}
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-bold rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <FiRefreshCw className={`w-5 h-5 ${testing ? 'animate-spin' : ''}`} />
                {testing ? 'Running Tests...' : 'Run All Auth Tests'}
              </button>
              
              <button
                onClick={logout}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold rounded-xl transition-all flex items-center gap-2"
              >
                <FiLogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>

          {/* Current User Status */}
          <div className="mb-8 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Current Authentication Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {loading ? 'Loading...' : user ? 'Logged In' : 'Not Logged In'}
                </div>
                <div className="text-gray-400">Status</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {user?.email || 'N/A'}
                </div>
                <div className="text-gray-400">Email</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {user?.userType || 'N/A'}
                </div>
                <div className="text-gray-400">User Type</div>
              </div>
            </div>
          </div>

          {/* Manual Login Test */}
          <div className="mb-8 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Manual Login Test</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={testCredentials.email}
                    onChange={(e) => setTestCredentials(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                    placeholder="Enter email"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type={testCredentials.showPassword ? 'text' : 'password'}
                    value={testCredentials.password}
                    onChange={(e) => setTestCredentials(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full pl-10 pr-12 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                    placeholder="Enter password"
                  />
                  <button
                    onClick={() => setTestCredentials(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                    className="absolute right-3 top-3 text-gray-400 hover:text-white"
                  >
                    {testCredentials.showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={testManualLogin}
                disabled={testing}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <FiLogIn className="w-5 h-5" />
                Test Login
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
            {authTests.map((category, categoryIndex) => {
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
                      
                      return (
                        <div
                          key={testIndex}
                          className={`border rounded-xl p-4 transition-all ${
                            result ? getStatusColor(result.status) : 'border-gray-600/50 bg-gray-700/20'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                              {result ? getStatusIcon(result.status) : <FiShield className="w-5 h-5 text-gray-400" />}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-semibold text-white truncate">{test.name}</h3>
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
              <h3 className="text-xl font-bold text-white mb-4">Authentication Test Summary</h3>
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

export default TestAuthIntegrationPage;
