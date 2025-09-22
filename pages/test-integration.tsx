/**
 * 🧪 INTEGRATION TEST PAGE
 * Test page to verify frontend-backend integration
 */

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '../src/contexts/AuthContext';
import { apiService } from '../src/services/apiService';

interface TestResult {
  test: string;
  status: 'success' | 'error' | 'pending';
  message: string;
  data?: any;
}

const IntegrationTestPage: React.FC = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  const [tests, setTests] = useState<TestResult[]>([]);
  const [running, setRunning] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: 'admin@coinbitclub.com',
    password: 'admin123'
  });

  const addTestResult = (test: string, status: 'success' | 'error' | 'pending', message: string, data?: any) => {
    setTests(prev => [...prev, { test, status, message, data }]);
  };

  const clearTests = () => {
    setTests([]);
  };

  const runTests = async () => {
    setRunning(true);
    clearTests();

    try {
      // Test 1: Backend Health Check
      addTestResult('Backend Health', 'pending', 'Checking backend status...');
      try {
        const response = await fetch('http://localhost:3333/api/status');
        const data = await response.json();
        addTestResult('Backend Health', 'success', 'Backend is operational', data);
      } catch (error: any) {
        addTestResult('Backend Health', 'error', `Backend error: ${error.message}`);
      }

      // Test 2: Frontend Health Check
      addTestResult('Frontend Health', 'pending', 'Checking frontend status...');
      try {
        const response = await fetch('http://localhost:3003');
        if (response.ok) {
          addTestResult('Frontend Health', 'success', 'Frontend is operational');
        } else {
          addTestResult('Frontend Health', 'error', `Frontend returned status: ${response.status}`);
        }
      } catch (error: any) {
        addTestResult('Frontend Health', 'error', `Frontend error: ${error.message}`);
      }

      // Test 3: Authentication (if not authenticated)
      if (!isAuthenticated) {
        addTestResult('Authentication', 'pending', 'Testing login...');
        try {
          await login(loginForm.email, loginForm.password);
          addTestResult('Authentication', 'success', 'Login successful');
        } catch (error: any) {
          addTestResult('Authentication', 'error', `Login failed: ${error.message}`);
        }
      } else {
        addTestResult('Authentication', 'success', 'User is already authenticated');
      }

      // Test 4: User Profile API
      if (isAuthenticated) {
        addTestResult('User Profile API', 'pending', 'Testing user profile endpoint...');
        try {
          const response = await apiService.getUserProfile();
          addTestResult('User Profile API', 'success', 'Profile data retrieved', response);
        } catch (error: any) {
          addTestResult('User Profile API', 'error', `Profile API error: ${error.message}`);
        }

        // Test 5: User Settings API
        addTestResult('User Settings API', 'pending', 'Testing user settings endpoint...');
        try {
          const response = await apiService.getUserSettings();
          addTestResult('User Settings API', 'success', 'Settings data retrieved', response);
        } catch (error: any) {
          addTestResult('User Settings API', 'error', `Settings API error: ${error.message}`);
        }

        // Test 6: Token Storage
        addTestResult('Token Storage', 'pending', 'Checking token storage...');
        const token = localStorage.getItem('auth_access_token');
        if (token) {
          addTestResult('Token Storage', 'success', 'Token is stored in localStorage');
        } else {
          addTestResult('Token Storage', 'error', 'No token found in localStorage');
        }

        // Test 7: Trading Status API
        addTestResult('Trading Status API', 'pending', 'Testing trading status endpoint...');
        try {
          const response = await apiService.getTradingStatus();
          addTestResult('Trading Status API', 'success', 'Trading status retrieved', response);
        } catch (error: any) {
          addTestResult('Trading Status API', 'error', `Trading API error: ${error.message}`);
        }

        // Test 8: Financial Balances API
        addTestResult('Financial Balances API', 'pending', 'Testing financial balances endpoint...');
        try {
          const response = await apiService.getBalances();
          addTestResult('Financial Balances API', 'success', 'Balances retrieved', response);
        } catch (error: any) {
          addTestResult('Financial Balances API', 'error', `Balances API error: ${error.message}`);
        }
      }

    } catch (error) {
      console.error('Test suite error:', error);
    } finally {
      setRunning(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(loginForm.email, loginForm.password);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      clearTests();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <Head>
        <title>Integration Test - CoinBitClub</title>
        <meta name="description" content="Test frontend-backend integration" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">🧪 Integration Test</h1>
            <p className="text-gray-400">
              Test the integration between frontend and backend systems
            </p>
          </div>

          {/* Authentication Status */}
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
            {isAuthenticated ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-400 font-medium">Authenticated</span>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <p><strong>User:</strong> {user?.full_name || user?.email}</p>
                  <p><strong>Type:</strong> {user?.user_type}</p>
                  <p><strong>Admin:</strong> {user?.is_admin ? 'Yes' : 'No'}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-red-400 font-medium">Not Authenticated</span>
                </div>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                      className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Email"
                    />
                    <input
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                      className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Password"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    Login
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Test Controls */}
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
            <div className="flex space-x-4">
              <button
                onClick={runTests}
                disabled={running}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  running
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {running ? 'Running Tests...' : 'Run All Tests'}
              </button>
              <button
                onClick={clearTests}
                disabled={running}
                className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Clear Results
              </button>
            </div>
          </div>

          {/* Test Results */}
          {tests.length > 0 && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Test Results</h2>
              <div className="space-y-4">
                {tests.map((test, index) => (
                  <div key={index} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{test.test}</h3>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${
                          test.status === 'success' ? 'bg-green-500' :
                          test.status === 'error' ? 'bg-red-500' :
                          'bg-yellow-500 animate-pulse'
                        }`}></div>
                        <span className={`text-sm font-medium ${
                          test.status === 'success' ? 'text-green-400' :
                          test.status === 'error' ? 'text-red-400' :
                          'text-yellow-400'
                        }`}>
                          {test.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-300 mb-2">{test.message}</p>
                    {test.data && (
                      <details className="text-sm">
                        <summary className="cursor-pointer text-blue-400 hover:text-blue-300">
                          View Data
                        </summary>
                        <pre className="mt-2 p-3 bg-gray-800 rounded text-gray-300 overflow-x-auto">
                          {JSON.stringify(test.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default IntegrationTestPage;
 * 🧪 INTEGRATION TEST PAGE
 * Test page to verify frontend-backend integration
 */

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '../src/contexts/AuthContext';
import { apiService } from '../src/services/apiService';

interface TestResult {
  test: string;
  status: 'success' | 'error' | 'pending';
  message: string;
  data?: any;
}

const IntegrationTestPage: React.FC = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  const [tests, setTests] = useState<TestResult[]>([]);
  const [running, setRunning] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: 'admin@coinbitclub.com',
    password: 'admin123'
  });

  const addTestResult = (test: string, status: 'success' | 'error' | 'pending', message: string, data?: any) => {
    setTests(prev => [...prev, { test, status, message, data }]);
  };

  const clearTests = () => {
    setTests([]);
  };

  const runTests = async () => {
    setRunning(true);
    clearTests();

    try {
      // Test 1: Backend Health Check
      addTestResult('Backend Health', 'pending', 'Checking backend status...');
      try {
        const response = await fetch('http://localhost:3333/api/status');
        const data = await response.json();
        addTestResult('Backend Health', 'success', 'Backend is operational', data);
      } catch (error: any) {
        addTestResult('Backend Health', 'error', `Backend error: ${error.message}`);
      }

      // Test 2: Frontend Health Check
      addTestResult('Frontend Health', 'pending', 'Checking frontend status...');
      try {
        const response = await fetch('http://localhost:3003');
        if (response.ok) {
          addTestResult('Frontend Health', 'success', 'Frontend is operational');
        } else {
          addTestResult('Frontend Health', 'error', `Frontend returned status: ${response.status}`);
        }
      } catch (error: any) {
        addTestResult('Frontend Health', 'error', `Frontend error: ${error.message}`);
      }

      // Test 3: Authentication (if not authenticated)
      if (!isAuthenticated) {
        addTestResult('Authentication', 'pending', 'Testing login...');
        try {
          await login(loginForm.email, loginForm.password);
          addTestResult('Authentication', 'success', 'Login successful');
        } catch (error: any) {
          addTestResult('Authentication', 'error', `Login failed: ${error.message}`);
        }
      } else {
        addTestResult('Authentication', 'success', 'User is already authenticated');
      }

      // Test 4: User Profile API
      if (isAuthenticated) {
        addTestResult('User Profile API', 'pending', 'Testing user profile endpoint...');
        try {
          const response = await apiService.getUserProfile();
          addTestResult('User Profile API', 'success', 'Profile data retrieved', response);
        } catch (error: any) {
          addTestResult('User Profile API', 'error', `Profile API error: ${error.message}`);
        }

        // Test 5: User Settings API
        addTestResult('User Settings API', 'pending', 'Testing user settings endpoint...');
        try {
          const response = await apiService.getUserSettings();
          addTestResult('User Settings API', 'success', 'Settings data retrieved', response);
        } catch (error: any) {
          addTestResult('User Settings API', 'error', `Settings API error: ${error.message}`);
        }

        // Test 6: Token Storage
        addTestResult('Token Storage', 'pending', 'Checking token storage...');
        const token = localStorage.getItem('auth_access_token');
        if (token) {
          addTestResult('Token Storage', 'success', 'Token is stored in localStorage');
        } else {
          addTestResult('Token Storage', 'error', 'No token found in localStorage');
        }

        // Test 7: Trading Status API
        addTestResult('Trading Status API', 'pending', 'Testing trading status endpoint...');
        try {
          const response = await apiService.getTradingStatus();
          addTestResult('Trading Status API', 'success', 'Trading status retrieved', response);
        } catch (error: any) {
          addTestResult('Trading Status API', 'error', `Trading API error: ${error.message}`);
        }

        // Test 8: Financial Balances API
        addTestResult('Financial Balances API', 'pending', 'Testing financial balances endpoint...');
        try {
          const response = await apiService.getBalances();
          addTestResult('Financial Balances API', 'success', 'Balances retrieved', response);
        } catch (error: any) {
          addTestResult('Financial Balances API', 'error', `Balances API error: ${error.message}`);
        }
      }

    } catch (error) {
      console.error('Test suite error:', error);
    } finally {
      setRunning(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(loginForm.email, loginForm.password);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      clearTests();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <Head>
        <title>Integration Test - CoinBitClub</title>
        <meta name="description" content="Test frontend-backend integration" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">🧪 Integration Test</h1>
            <p className="text-gray-400">
              Test the integration between frontend and backend systems
            </p>
          </div>

          {/* Authentication Status */}
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
            {isAuthenticated ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-400 font-medium">Authenticated</span>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <p><strong>User:</strong> {user?.full_name || user?.email}</p>
                  <p><strong>Type:</strong> {user?.user_type}</p>
                  <p><strong>Admin:</strong> {user?.is_admin ? 'Yes' : 'No'}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-red-400 font-medium">Not Authenticated</span>
                </div>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                      className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Email"
                    />
                    <input
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                      className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Password"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    Login
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Test Controls */}
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
            <div className="flex space-x-4">
              <button
                onClick={runTests}
                disabled={running}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  running
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {running ? 'Running Tests...' : 'Run All Tests'}
              </button>
              <button
                onClick={clearTests}
                disabled={running}
                className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Clear Results
              </button>
            </div>
          </div>

          {/* Test Results */}
          {tests.length > 0 && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Test Results</h2>
              <div className="space-y-4">
                {tests.map((test, index) => (
                  <div key={index} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{test.test}</h3>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${
                          test.status === 'success' ? 'bg-green-500' :
                          test.status === 'error' ? 'bg-red-500' :
                          'bg-yellow-500 animate-pulse'
                        }`}></div>
                        <span className={`text-sm font-medium ${
                          test.status === 'success' ? 'text-green-400' :
                          test.status === 'error' ? 'text-red-400' :
                          'text-yellow-400'
                        }`}>
                          {test.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-300 mb-2">{test.message}</p>
                    {test.data && (
                      <details className="text-sm">
                        <summary className="cursor-pointer text-blue-400 hover:text-blue-300">
                          View Data
                        </summary>
                        <pre className="mt-2 p-3 bg-gray-800 rounded text-gray-300 overflow-x-auto">
                          {JSON.stringify(test.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default IntegrationTestPage;
 * 🧪 INTEGRATION TEST PAGE
 * Test page to verify frontend-backend integration
 */

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '../src/contexts/AuthContext';
import { apiService } from '../src/services/apiService';

interface TestResult {
  test: string;
  status: 'success' | 'error' | 'pending';
  message: string;
  data?: any;
}

const IntegrationTestPage: React.FC = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  const [tests, setTests] = useState<TestResult[]>([]);
  const [running, setRunning] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: 'admin@coinbitclub.com',
    password: 'admin123'
  });

  const addTestResult = (test: string, status: 'success' | 'error' | 'pending', message: string, data?: any) => {
    setTests(prev => [...prev, { test, status, message, data }]);
  };

  const clearTests = () => {
    setTests([]);
  };

  const runTests = async () => {
    setRunning(true);
    clearTests();

    try {
      // Test 1: Backend Health Check
      addTestResult('Backend Health', 'pending', 'Checking backend status...');
      try {
        const response = await fetch('http://localhost:3333/api/status');
        const data = await response.json();
        addTestResult('Backend Health', 'success', 'Backend is operational', data);
      } catch (error: any) {
        addTestResult('Backend Health', 'error', `Backend error: ${error.message}`);
      }

      // Test 2: Frontend Health Check
      addTestResult('Frontend Health', 'pending', 'Checking frontend status...');
      try {
        const response = await fetch('http://localhost:3003');
        if (response.ok) {
          addTestResult('Frontend Health', 'success', 'Frontend is operational');
        } else {
          addTestResult('Frontend Health', 'error', `Frontend returned status: ${response.status}`);
        }
      } catch (error: any) {
        addTestResult('Frontend Health', 'error', `Frontend error: ${error.message}`);
      }

      // Test 3: Authentication (if not authenticated)
      if (!isAuthenticated) {
        addTestResult('Authentication', 'pending', 'Testing login...');
        try {
          await login(loginForm.email, loginForm.password);
          addTestResult('Authentication', 'success', 'Login successful');
        } catch (error: any) {
          addTestResult('Authentication', 'error', `Login failed: ${error.message}`);
        }
      } else {
        addTestResult('Authentication', 'success', 'User is already authenticated');
      }

      // Test 4: User Profile API
      if (isAuthenticated) {
        addTestResult('User Profile API', 'pending', 'Testing user profile endpoint...');
        try {
          const response = await apiService.getUserProfile();
          addTestResult('User Profile API', 'success', 'Profile data retrieved', response);
        } catch (error: any) {
          addTestResult('User Profile API', 'error', `Profile API error: ${error.message}`);
        }

        // Test 5: User Settings API
        addTestResult('User Settings API', 'pending', 'Testing user settings endpoint...');
        try {
          const response = await apiService.getUserSettings();
          addTestResult('User Settings API', 'success', 'Settings data retrieved', response);
        } catch (error: any) {
          addTestResult('User Settings API', 'error', `Settings API error: ${error.message}`);
        }

        // Test 6: Token Storage
        addTestResult('Token Storage', 'pending', 'Checking token storage...');
        const token = localStorage.getItem('auth_access_token');
        if (token) {
          addTestResult('Token Storage', 'success', 'Token is stored in localStorage');
        } else {
          addTestResult('Token Storage', 'error', 'No token found in localStorage');
        }

        // Test 7: Trading Status API
        addTestResult('Trading Status API', 'pending', 'Testing trading status endpoint...');
        try {
          const response = await apiService.getTradingStatus();
          addTestResult('Trading Status API', 'success', 'Trading status retrieved', response);
        } catch (error: any) {
          addTestResult('Trading Status API', 'error', `Trading API error: ${error.message}`);
        }

        // Test 8: Financial Balances API
        addTestResult('Financial Balances API', 'pending', 'Testing financial balances endpoint...');
        try {
          const response = await apiService.getBalances();
          addTestResult('Financial Balances API', 'success', 'Balances retrieved', response);
        } catch (error: any) {
          addTestResult('Financial Balances API', 'error', `Balances API error: ${error.message}`);
        }
      }

    } catch (error) {
      console.error('Test suite error:', error);
    } finally {
      setRunning(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(loginForm.email, loginForm.password);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      clearTests();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <Head>
        <title>Integration Test - CoinBitClub</title>
        <meta name="description" content="Test frontend-backend integration" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">🧪 Integration Test</h1>
            <p className="text-gray-400">
              Test the integration between frontend and backend systems
            </p>
          </div>

          {/* Authentication Status */}
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
            {isAuthenticated ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-400 font-medium">Authenticated</span>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <p><strong>User:</strong> {user?.full_name || user?.email}</p>
                  <p><strong>Type:</strong> {user?.user_type}</p>
                  <p><strong>Admin:</strong> {user?.is_admin ? 'Yes' : 'No'}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-red-400 font-medium">Not Authenticated</span>
                </div>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                      className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Email"
                    />
                    <input
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                      className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Password"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    Login
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Test Controls */}
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
            <div className="flex space-x-4">
              <button
                onClick={runTests}
                disabled={running}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  running
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {running ? 'Running Tests...' : 'Run All Tests'}
              </button>
              <button
                onClick={clearTests}
                disabled={running}
                className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Clear Results
              </button>
            </div>
          </div>

          {/* Test Results */}
          {tests.length > 0 && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Test Results</h2>
              <div className="space-y-4">
                {tests.map((test, index) => (
                  <div key={index} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{test.test}</h3>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${
                          test.status === 'success' ? 'bg-green-500' :
                          test.status === 'error' ? 'bg-red-500' :
                          'bg-yellow-500 animate-pulse'
                        }`}></div>
                        <span className={`text-sm font-medium ${
                          test.status === 'success' ? 'text-green-400' :
                          test.status === 'error' ? 'text-red-400' :
                          'text-yellow-400'
                        }`}>
                          {test.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-300 mb-2">{test.message}</p>
                    {test.data && (
                      <details className="text-sm">
                        <summary className="cursor-pointer text-blue-400 hover:text-blue-300">
                          View Data
                        </summary>
                        <pre className="mt-2 p-3 bg-gray-800 rounded text-gray-300 overflow-x-auto">
                          {JSON.stringify(test.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default IntegrationTestPage;
