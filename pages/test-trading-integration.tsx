/**
 * 📈 TRADING INTEGRATION TEST PAGE
 * Test complete frontend-backend trading system integration
 */

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '../src/contexts/AuthContext';
import { apiService } from '../src/services/apiService';
import { 
  FiCheck, 
  FiX, 
  FiRefreshCw, 
  FiTrendingUp,
  FiBarChart,
  FiTarget,
  FiActivity,
  FiDollarSign,
  FiPlay,
  FiPause,
  FiAlertCircle,
  FiSettings,
  FiUsers,
  FiShield,
  FiClock,
  FiZap
} from 'react-icons/fi';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  data?: any;
  duration?: number;
}

const TestTradingIntegrationPage: React.FC = () => {
  const { user, loading } = useAuth();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testing, setTesting] = useState(false);
  const [currentTest, setCurrentTest] = useState('');
  const [tradingData, setTradingData] = useState<any>(null);

  const tradingTests = [
    {
      category: 'Backend Trading API',
      tests: [
        {
          name: 'Trading Status',
          description: 'Test trading system status endpoint',
          test: async () => {
            const response = await apiService.getTradingStatus();
            return { success: true, data: response };
          }
        },
        {
          name: 'Get Positions',
          description: 'Test get user positions',
          test: async () => {
            const response = await apiService.getPositions();
            return { success: true, data: response };
          }
        },
        {
          name: 'Market Analysis',
          description: 'Test market analysis endpoint',
          test: async () => {
            const response = await apiService.getMarketAnalysis();
            return { success: true, data: response };
          }
        },
        {
          name: 'Open Position',
          description: 'Test opening a new position',
          test: async () => {
            const response = await apiService.openPosition({
              symbol: 'BTCUSDT',
              side: 'LONG',
              size: 0.001,
              leverage: 5,
              entry_price: 50000,
              stop_loss: 48000,
              take_profit: 52000
            });
            return { success: true, data: response };
          }
        },
        {
          name: 'Close Position',
          description: 'Test closing a position',
          test: async () => {
            const response = await apiService.closePosition('pos_123');
            return { success: true, data: response };
          }
        },
        {
          name: 'Process Signal',
          description: 'Test trading signal processing',
          test: async () => {
            const response = await apiService.processSignal({
              symbol: 'BTCUSDT',
              action: 'BUY',
              price: 50000,
              strength: 85,
              confidence: 75,
              source: 'TRADINGVIEW'
            });
            return { success: true, data: response };
          }
        }
      ]
    },
    {
      category: 'User Trading Data',
      tests: [
        {
          name: 'User Balances',
          description: 'Test user balance retrieval',
          test: async () => {
            const response = await apiService.getBalances();
            return { success: true, data: response };
          }
        },
        {
          name: 'Trading Settings',
          description: 'Test trading settings retrieval',
          test: async () => {
            const response = await apiService.getTradingSettings();
            return { success: true, data: response };
          }
        },
        {
          name: 'Update Trading Settings',
          description: 'Test updating trading settings',
          test: async () => {
            const response = await apiService.updateTradingSettings({
              max_leverage: 10,
              risk_level: 'high',
              auto_trade_enabled: true
            });
            return { success: true, data: response };
          }
        }
      ]
    },
    {
      category: 'Frontend Components',
      tests: [
        {
          name: 'User Dashboard',
          description: 'Test dashboard component data loading',
          test: async () => {
            // Simulate dashboard data loading
            const [balances, tradingStatus] = await Promise.all([
              apiService.getBalances(),
              apiService.getTradingStatus()
            ]);
            return { 
              success: true, 
              data: { balances, tradingStatus } 
            };
          }
        },
        {
          name: 'Operations Page',
          description: 'Test operations page data flow',
          test: async () => {
            const [positions, analysis] = await Promise.all([
              apiService.getPositions(),
              apiService.getMarketAnalysis()
            ]);
            return { 
              success: true, 
              data: { positions, analysis } 
            };
          }
        },
        {
          name: 'Trading Permissions',
          description: 'Test trading permission validation',
          test: async () => {
            try {
              const status = await apiService.getTradingStatus();
              return { 
                success: status.canTrade !== false, 
                data: { canTrade: status.canTrade, userType: user?.user_type } 
              };
            } catch (error: any) {
              return { 
                success: false, 
                data: { error: error.message } 
              };
            }
          }
        }
      ]
    }
  ];

  const runAllTradingTests = async () => {
    setTesting(true);
    setTestResults([]);
    setTradingData(null);

    try {
      for (const category of tradingTests) {
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

            // Store important trading data
            if (test.name === 'User Dashboard' && testResult.success) {
              setTradingData(testResult.data);
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
      case 'Backend Trading API':
        return FiTrendingUp;
      case 'User Trading Data':
        return FiUsers;
      case 'Frontend Components':
        return FiActivity;
      default:
        return FiBarChart;
    }
  };

  return (
    <>
      <Head>
        <title>Trading Integration Test - CoinBitClub Enterprise</title>
        <meta name="description" content="Test frontend-backend trading system integration" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent mb-4">
              Trading Integration Test
            </h1>
            <p className="text-gray-400 text-lg mb-6">
              Comprehensive testing of frontend-backend trading system
            </p>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={runAllTradingTests}
                disabled={testing}
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-bold rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <FiRefreshCw className={`w-5 h-5 ${testing ? 'animate-spin' : ''}`} />
                {testing ? 'Running Tests...' : 'Run Trading Tests'}
              </button>
            </div>
          </div>

          {/* Current User Status */}
          <div className="mb-8 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Current User Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {tradingData?.tradingStatus?.canTrade ? 'Yes' : 'No'}
                </div>
                <div className="text-gray-400">Can Trade</div>
              </div>
            </div>
          </div>

          {/* Trading Data Display */}
          {tradingData && (
            <div className="mb-8 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Trading Data</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-blue-400 mb-2">Trading Status</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className="text-white">{tradingData.tradingStatus?.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Can Trade:</span>
                      <span className="text-white">{tradingData.tradingStatus?.canTrade ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Max Positions:</span>
                      <span className="text-white">{tradingData.tradingStatus?.maxPositions}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-green-400 mb-2">Balances</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total BRL:</span>
                      <span className="text-white">R$ {tradingData.balances?.total?.brl?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total USD:</span>
                      <span className="text-white">$ {tradingData.balances?.total?.usd?.toFixed(2) || '0.00'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

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
            {tradingTests.map((category, categoryIndex) => {
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
                              {result ? getStatusIcon(result.status) : <FiBarChart className="w-5 h-5 text-gray-400" />}
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
              <h3 className="text-xl font-bold text-white mb-4">Trading Integration Test Summary</h3>
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

export default TestTradingIntegrationPage;
 * 📈 TRADING INTEGRATION TEST PAGE
 * Test complete frontend-backend trading system integration
 */

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '../src/contexts/AuthContext';
import { apiService } from '../src/services/apiService';
import { 
  FiCheck, 
  FiX, 
  FiRefreshCw, 
  FiTrendingUp,
  FiBarChart,
  FiTarget,
  FiActivity,
  FiDollarSign,
  FiPlay,
  FiPause,
  FiAlertCircle,
  FiSettings,
  FiUsers,
  FiShield,
  FiClock,
  FiZap
} from 'react-icons/fi';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  data?: any;
  duration?: number;
}

const TestTradingIntegrationPage: React.FC = () => {
  const { user, loading } = useAuth();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testing, setTesting] = useState(false);
  const [currentTest, setCurrentTest] = useState('');
  const [tradingData, setTradingData] = useState<any>(null);

  const tradingTests = [
    {
      category: 'Backend Trading API',
      tests: [
        {
          name: 'Trading Status',
          description: 'Test trading system status endpoint',
          test: async () => {
            const response = await apiService.getTradingStatus();
            return { success: true, data: response };
          }
        },
        {
          name: 'Get Positions',
          description: 'Test get user positions',
          test: async () => {
            const response = await apiService.getPositions();
            return { success: true, data: response };
          }
        },
        {
          name: 'Market Analysis',
          description: 'Test market analysis endpoint',
          test: async () => {
            const response = await apiService.getMarketAnalysis();
            return { success: true, data: response };
          }
        },
        {
          name: 'Open Position',
          description: 'Test opening a new position',
          test: async () => {
            const response = await apiService.openPosition({
              symbol: 'BTCUSDT',
              side: 'LONG',
              size: 0.001,
              leverage: 5,
              entry_price: 50000,
              stop_loss: 48000,
              take_profit: 52000
            });
            return { success: true, data: response };
          }
        },
        {
          name: 'Close Position',
          description: 'Test closing a position',
          test: async () => {
            const response = await apiService.closePosition('pos_123');
            return { success: true, data: response };
          }
        },
        {
          name: 'Process Signal',
          description: 'Test trading signal processing',
          test: async () => {
            const response = await apiService.processSignal({
              symbol: 'BTCUSDT',
              action: 'BUY',
              price: 50000,
              strength: 85,
              confidence: 75,
              source: 'TRADINGVIEW'
            });
            return { success: true, data: response };
          }
        }
      ]
    },
    {
      category: 'User Trading Data',
      tests: [
        {
          name: 'User Balances',
          description: 'Test user balance retrieval',
          test: async () => {
            const response = await apiService.getBalances();
            return { success: true, data: response };
          }
        },
        {
          name: 'Trading Settings',
          description: 'Test trading settings retrieval',
          test: async () => {
            const response = await apiService.getTradingSettings();
            return { success: true, data: response };
          }
        },
        {
          name: 'Update Trading Settings',
          description: 'Test updating trading settings',
          test: async () => {
            const response = await apiService.updateTradingSettings({
              max_leverage: 10,
              risk_level: 'high',
              auto_trade_enabled: true
            });
            return { success: true, data: response };
          }
        }
      ]
    },
    {
      category: 'Frontend Components',
      tests: [
        {
          name: 'User Dashboard',
          description: 'Test dashboard component data loading',
          test: async () => {
            // Simulate dashboard data loading
            const [balances, tradingStatus] = await Promise.all([
              apiService.getBalances(),
              apiService.getTradingStatus()
            ]);
            return { 
              success: true, 
              data: { balances, tradingStatus } 
            };
          }
        },
        {
          name: 'Operations Page',
          description: 'Test operations page data flow',
          test: async () => {
            const [positions, analysis] = await Promise.all([
              apiService.getPositions(),
              apiService.getMarketAnalysis()
            ]);
            return { 
              success: true, 
              data: { positions, analysis } 
            };
          }
        },
        {
          name: 'Trading Permissions',
          description: 'Test trading permission validation',
          test: async () => {
            try {
              const status = await apiService.getTradingStatus();
              return { 
                success: status.canTrade !== false, 
                data: { canTrade: status.canTrade, userType: user?.user_type } 
              };
            } catch (error: any) {
              return { 
                success: false, 
                data: { error: error.message } 
              };
            }
          }
        }
      ]
    }
  ];

  const runAllTradingTests = async () => {
    setTesting(true);
    setTestResults([]);
    setTradingData(null);

    try {
      for (const category of tradingTests) {
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

            // Store important trading data
            if (test.name === 'User Dashboard' && testResult.success) {
              setTradingData(testResult.data);
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
      case 'Backend Trading API':
        return FiTrendingUp;
      case 'User Trading Data':
        return FiUsers;
      case 'Frontend Components':
        return FiActivity;
      default:
        return FiBarChart;
    }
  };

  return (
    <>
      <Head>
        <title>Trading Integration Test - CoinBitClub Enterprise</title>
        <meta name="description" content="Test frontend-backend trading system integration" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent mb-4">
              Trading Integration Test
            </h1>
            <p className="text-gray-400 text-lg mb-6">
              Comprehensive testing of frontend-backend trading system
            </p>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={runAllTradingTests}
                disabled={testing}
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-bold rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <FiRefreshCw className={`w-5 h-5 ${testing ? 'animate-spin' : ''}`} />
                {testing ? 'Running Tests...' : 'Run Trading Tests'}
              </button>
            </div>
          </div>

          {/* Current User Status */}
          <div className="mb-8 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Current User Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {tradingData?.tradingStatus?.canTrade ? 'Yes' : 'No'}
                </div>
                <div className="text-gray-400">Can Trade</div>
              </div>
            </div>
          </div>

          {/* Trading Data Display */}
          {tradingData && (
            <div className="mb-8 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Trading Data</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-blue-400 mb-2">Trading Status</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className="text-white">{tradingData.tradingStatus?.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Can Trade:</span>
                      <span className="text-white">{tradingData.tradingStatus?.canTrade ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Max Positions:</span>
                      <span className="text-white">{tradingData.tradingStatus?.maxPositions}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-green-400 mb-2">Balances</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total BRL:</span>
                      <span className="text-white">R$ {tradingData.balances?.total?.brl?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total USD:</span>
                      <span className="text-white">$ {tradingData.balances?.total?.usd?.toFixed(2) || '0.00'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

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
            {tradingTests.map((category, categoryIndex) => {
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
                              {result ? getStatusIcon(result.status) : <FiBarChart className="w-5 h-5 text-gray-400" />}
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
              <h3 className="text-xl font-bold text-white mb-4">Trading Integration Test Summary</h3>
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

export default TestTradingIntegrationPage;
 * 📈 TRADING INTEGRATION TEST PAGE
 * Test complete frontend-backend trading system integration
 */

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '../src/contexts/AuthContext';
import { apiService } from '../src/services/apiService';
import { 
  FiCheck, 
  FiX, 
  FiRefreshCw, 
  FiTrendingUp,
  FiBarChart,
  FiTarget,
  FiActivity,
  FiDollarSign,
  FiPlay,
  FiPause,
  FiAlertCircle,
  FiSettings,
  FiUsers,
  FiShield,
  FiClock,
  FiZap
} from 'react-icons/fi';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  data?: any;
  duration?: number;
}

const TestTradingIntegrationPage: React.FC = () => {
  const { user, loading } = useAuth();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testing, setTesting] = useState(false);
  const [currentTest, setCurrentTest] = useState('');
  const [tradingData, setTradingData] = useState<any>(null);

  const tradingTests = [
    {
      category: 'Backend Trading API',
      tests: [
        {
          name: 'Trading Status',
          description: 'Test trading system status endpoint',
          test: async () => {
            const response = await apiService.getTradingStatus();
            return { success: true, data: response };
          }
        },
        {
          name: 'Get Positions',
          description: 'Test get user positions',
          test: async () => {
            const response = await apiService.getPositions();
            return { success: true, data: response };
          }
        },
        {
          name: 'Market Analysis',
          description: 'Test market analysis endpoint',
          test: async () => {
            const response = await apiService.getMarketAnalysis();
            return { success: true, data: response };
          }
        },
        {
          name: 'Open Position',
          description: 'Test opening a new position',
          test: async () => {
            const response = await apiService.openPosition({
              symbol: 'BTCUSDT',
              side: 'LONG',
              size: 0.001,
              leverage: 5,
              entry_price: 50000,
              stop_loss: 48000,
              take_profit: 52000
            });
            return { success: true, data: response };
          }
        },
        {
          name: 'Close Position',
          description: 'Test closing a position',
          test: async () => {
            const response = await apiService.closePosition('pos_123');
            return { success: true, data: response };
          }
        },
        {
          name: 'Process Signal',
          description: 'Test trading signal processing',
          test: async () => {
            const response = await apiService.processSignal({
              symbol: 'BTCUSDT',
              action: 'BUY',
              price: 50000,
              strength: 85,
              confidence: 75,
              source: 'TRADINGVIEW'
            });
            return { success: true, data: response };
          }
        }
      ]
    },
    {
      category: 'User Trading Data',
      tests: [
        {
          name: 'User Balances',
          description: 'Test user balance retrieval',
          test: async () => {
            const response = await apiService.getBalances();
            return { success: true, data: response };
          }
        },
        {
          name: 'Trading Settings',
          description: 'Test trading settings retrieval',
          test: async () => {
            const response = await apiService.getTradingSettings();
            return { success: true, data: response };
          }
        },
        {
          name: 'Update Trading Settings',
          description: 'Test updating trading settings',
          test: async () => {
            const response = await apiService.updateTradingSettings({
              max_leverage: 10,
              risk_level: 'high',
              auto_trade_enabled: true
            });
            return { success: true, data: response };
          }
        }
      ]
    },
    {
      category: 'Frontend Components',
      tests: [
        {
          name: 'User Dashboard',
          description: 'Test dashboard component data loading',
          test: async () => {
            // Simulate dashboard data loading
            const [balances, tradingStatus] = await Promise.all([
              apiService.getBalances(),
              apiService.getTradingStatus()
            ]);
            return { 
              success: true, 
              data: { balances, tradingStatus } 
            };
          }
        },
        {
          name: 'Operations Page',
          description: 'Test operations page data flow',
          test: async () => {
            const [positions, analysis] = await Promise.all([
              apiService.getPositions(),
              apiService.getMarketAnalysis()
            ]);
            return { 
              success: true, 
              data: { positions, analysis } 
            };
          }
        },
        {
          name: 'Trading Permissions',
          description: 'Test trading permission validation',
          test: async () => {
            try {
              const status = await apiService.getTradingStatus();
              return { 
                success: status.canTrade !== false, 
                data: { canTrade: status.canTrade, userType: user?.user_type } 
              };
            } catch (error: any) {
              return { 
                success: false, 
                data: { error: error.message } 
              };
            }
          }
        }
      ]
    }
  ];

  const runAllTradingTests = async () => {
    setTesting(true);
    setTestResults([]);
    setTradingData(null);

    try {
      for (const category of tradingTests) {
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

            // Store important trading data
            if (test.name === 'User Dashboard' && testResult.success) {
              setTradingData(testResult.data);
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
      case 'Backend Trading API':
        return FiTrendingUp;
      case 'User Trading Data':
        return FiUsers;
      case 'Frontend Components':
        return FiActivity;
      default:
        return FiBarChart;
    }
  };

  return (
    <>
      <Head>
        <title>Trading Integration Test - CoinBitClub Enterprise</title>
        <meta name="description" content="Test frontend-backend trading system integration" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent mb-4">
              Trading Integration Test
            </h1>
            <p className="text-gray-400 text-lg mb-6">
              Comprehensive testing of frontend-backend trading system
            </p>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={runAllTradingTests}
                disabled={testing}
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-bold rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <FiRefreshCw className={`w-5 h-5 ${testing ? 'animate-spin' : ''}`} />
                {testing ? 'Running Tests...' : 'Run Trading Tests'}
              </button>
            </div>
          </div>

          {/* Current User Status */}
          <div className="mb-8 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Current User Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {tradingData?.tradingStatus?.canTrade ? 'Yes' : 'No'}
                </div>
                <div className="text-gray-400">Can Trade</div>
              </div>
            </div>
          </div>

          {/* Trading Data Display */}
          {tradingData && (
            <div className="mb-8 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Trading Data</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-blue-400 mb-2">Trading Status</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className="text-white">{tradingData.tradingStatus?.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Can Trade:</span>
                      <span className="text-white">{tradingData.tradingStatus?.canTrade ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Max Positions:</span>
                      <span className="text-white">{tradingData.tradingStatus?.maxPositions}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-green-400 mb-2">Balances</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total BRL:</span>
                      <span className="text-white">R$ {tradingData.balances?.total?.brl?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total USD:</span>
                      <span className="text-white">$ {tradingData.balances?.total?.usd?.toFixed(2) || '0.00'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

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
            {tradingTests.map((category, categoryIndex) => {
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
                              {result ? getStatusIcon(result.status) : <FiBarChart className="w-5 h-5 text-gray-400" />}
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
              <h3 className="text-xl font-bold text-white mb-4">Trading Integration Test Summary</h3>
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

export default TestTradingIntegrationPage;
