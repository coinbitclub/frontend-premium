'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Layout/Sidebar';
import Header from './Layout/Header';
import DashboardOverview from './Dashboard/DashboardOverview';
import TradingSignals from './Dashboard/TradingSignals';
import PerformanceCharts from './Dashboard/PerformanceCharts';
import RecentActivity from './Dashboard/RecentActivity';
import QuickActions from './Dashboard/QuickActions';

interface DashboardProps {
  userRole?: 'admin' | 'premium' | 'basic';
  userId?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  userRole = 'premium', 
  userId = 'user-demo' 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [metrics, setMetrics] = useState({
    successRate: 80.5,
    totalSignals: 156,
    totalProfit: 12.7,
    avgDuration: 4.2
  });

  // Theme & Language hooks
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<'pt' | 'en'>('pt');

  useEffect(() => {
    // Load saved preferences
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    const savedLanguage = localStorage.getItem('language') as 'pt' | 'en' || 'pt';
    setTheme(savedTheme);
    setLanguage(savedLanguage);

    // Apply theme
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }

    // Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'page_view', {
        page_title: 'Dashboard',
        page_location: window.location.href,
        user_role: userRole,
        language: savedLanguage
      });
    }
  }, [userRole]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'theme_change', {
        theme: newTheme,
        event_category: 'engagement'
      });
    }
  };

  const toggleLanguage = () => {
    const newLanguage = language === 'pt' ? 'en' : 'pt';
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    
    // Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'language_change', {
        new_language: newLanguage,
        event_category: 'engagement'
      });
    }
  };

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    
    // Update metrics based on period
    const metricsData = {
      today: { successRate: 85.7, totalSignals: 7, totalProfit: 2.4, avgDuration: 3.2 },
      week: { successRate: 83.3, totalSignals: 36, totalProfit: 8.9, avgDuration: 4.1 },
      month: { successRate: 80.5, totalSignals: 156, totalProfit: 12.7, avgDuration: 4.2 },
      quarter: { successRate: 78.9, totalSignals: 467, totalProfit: 34.2, avgDuration: 4.5 },
      year: { successRate: 76.4, totalSignals: 1892, totalProfit: 127.3, avgDuration: 4.8 }
    };

    setMetrics(metricsData[period as keyof typeof metricsData] || metricsData.month);

    // Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'period_change', {
        period: period,
        event_category: 'analytics'
      });
    }
  };

  const handleQuickAction = (action: string, data?: any) => {
    console.log('Quick action:', action, data);
    // Handle quick actions here
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        userRole={userRole}
        language={language}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          onThemeToggle={toggleTheme}
          onLanguageToggle={toggleLanguage}
          theme={theme}
          language={language}
          userRole={userRole}
          userName="Usuário Demo"
          notifications={3}
        />

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="p-6 space-y-6">
            {/* Page Title */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {language === 'pt' ? 'Dashboard' : 'Dashboard'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {language === 'pt' 
                  ? 'Visão geral da sua performance de trading' 
                  : 'Overview of your trading performance'
                }
              </p>
            </motion.div>

            {/* Metrics Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <DashboardOverview
                language={language}
                period={selectedPeriod}
                successRate={metrics.successRate}
              />
            </motion.div>

            {/* Charts and Signals */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <PerformanceCharts
                  period={selectedPeriod}
                  language={language}
                  successRate={metrics.successRate}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <TradingSignals
                  language={language}
                  period={selectedPeriod}
                />
              </motion.div>
            </div>

            {/* Activity and Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div
                className="lg:col-span-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <RecentActivity
                  language={language}
                  userRole={userRole}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <QuickActions 
                  language={language}
                  userRole={userRole}
                  onAction={handleQuickAction}
                />
              </motion.div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
