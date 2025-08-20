'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GlobeAltIcon,
  XMarkIcon,
  CheckIcon,
  InformationCircleIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  MegaphoneIcon
} from '@heroicons/react/24/outline';

interface CookieConsent {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
}

export const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consent, setConsent] = useState<CookieConsent>({
    necessary: true,
    analytics: false,
    marketing: false,
    timestamp: 0
  });

  useEffect(() => {
    // Check if user has already given consent
    const savedConsent = typeof window !== "undefined" && localStorage.getItem('cookie-consent');
    if (savedConsent) {
      const parsed = JSON.parse(savedConsent);
      setConsent(parsed);
      
      // Initialize services based on consent
      if (parsed.analytics) {
        initializeAnalytics();
      }
      if (parsed.marketing) {
        initializeFacebookPixel();
      }
    } else {
      // Show banner if no consent found
      setShowBanner(true);
    }
  }, []);

  const initializeAnalytics = () => {
    // Google Analytics is already loaded, just enable tracking
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', {
        analytics_storage: 'granted'
      });
    }
  };

  const initializeFacebookPixel = () => {
    // Initialize Facebook Pixel
    if (typeof window.initFacebookPixel === 'function') {
      typeof window !== "undefined" && window.initFacebookPixel();
    }
  };

  const saveConsent = (newConsent: Partial<CookieConsent>) => {
    const updatedConsent = {
      ...consent,
      ...newConsent,
      timestamp: Date.now()
    };
    
    setConsent(updatedConsent);
    typeof window !== "undefined" && localStorage.setItem('cookie-consent', JSON.stringify(updatedConsent));
    
    // Update window object for other scripts
    if (typeof window !== "undefined") {
      (window as any).cookieConsent = updatedConsent;
    }
    
    // Initialize services based on new consent
    if (updatedConsent.analytics) {
      initializeAnalytics();
    }
    if (updatedConsent.marketing) {
      initializeFacebookPixel();
    }
    
    setShowBanner(false);
    setShowDetails(false);
  };

  const acceptAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true
    });
  };

  const acceptNecessary = () => {
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false
    });
  };

  const acceptSelected = () => {
    saveConsent(consent);
  };

  const toggleConsent = (type: keyof CookieConsent) => {
    if (type === 'necessary') return; // Always required
    setConsent(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg"
        >
          <div className="max-w-7xl mx-auto p-4">
            {!showDetails ? (
              /* Simple Banner */
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex items-start space-x-3">
                  <GlobeAltIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      Utilizamos cookies para melhorar sua experiência
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Usamos cookies necessários para o funcionamento do site e opcionais para analytics e marketing.
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                  <button
                    onClick={() => setShowDetails(true)}
                    className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Personalizar
                  </button>
                  <button
                    onClick={acceptNecessary}
                    className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Apenas Necessários
                  </button>
                  <button
                    onClick={acceptAll}
                    className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Aceitar Todos
                  </button>
                </div>
              </div>
            ) : (
              /* Detailed Settings */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Configurações de Cookies
                  </h3>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="grid gap-4">
                  {/* Necessary Cookies */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <ShieldCheckIcon className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          Cookies Necessários
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Essenciais para o funcionamento básico do site. Sempre ativos.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <CheckIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Sempre ativo</span>
                    </div>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <ChartBarIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          Cookies de Analytics
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Google Analytics para entender como você usa nosso site e melhorar a experiência.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleConsent('analytics')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        consent.analytics ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          consent.analytics ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Marketing Cookies */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <MegaphoneIcon className="h-6 w-6 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          Cookies de Marketing
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Facebook Pixel para personalizar anúncios e medir efetividade das campanhas.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleConsent('marketing')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        consent.marketing ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          consent.marketing ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Privacy Notice */}
                <div className="flex items-start space-x-2 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <InformationCircleIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800 dark:text-blue-300">
                    <p>
                      <strong>Sua privacidade é importante para nós.</strong> Você pode alterar suas preferências a qualquer momento.
                      Consulte nossa <a href="/privacy" className="underline hover:no-underline">Política de Privacidade</a> para mais detalhes.
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={acceptNecessary}
                    className="flex-1 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Apenas Necessários
                  </button>
                  <button
                    onClick={acceptSelected}
                    className="flex-1 px-4 py-2 text-sm text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                  >
                    Salvar Seleção
                  </button>
                  <button
                    onClick={acceptAll}
                    className="flex-1 px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Aceitar Todos
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Cookie settings modal component for later access
export const CookieSettingsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [consent, setConsent] = useState<CookieConsent>({
    necessary: true,
    analytics: false,
    marketing: false,
    timestamp: 0
  });

  useEffect(() => {
    if (isOpen) {
      const savedConsent = typeof window !== "undefined" && localStorage.getItem('cookie-consent');
      if (savedConsent) {
        setConsent(JSON.parse(savedConsent));
      }
    }
  }, [isOpen]);

  const saveSettings = () => {
    const updatedConsent = {
      ...consent,
      timestamp: Date.now()
    };
    
    typeof window !== "undefined" && localStorage.setItem('cookie-consent', JSON.stringify(updatedConsent));
    if (typeof window !== "undefined") {
      (window as any).cookieConsent = updatedConsent;
    }
    
    // Reinitialize services
    if (updatedConsent.analytics && typeof gtag !== 'undefined') {
      gtag('consent', 'update', { analytics_storage: 'granted' });
    }
    if (updatedConsent.marketing && typeof window.initFacebookPixel === 'function') {
      typeof window !== "undefined" && window.initFacebookPixel();
    }
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Configurações de Cookies
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        {/* Same content as detailed settings above */}
        <div className="space-y-4">
          {/* Cookie categories would go here - same as above */}
          <button
            onClick={saveSettings}
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Salvar Configurações
          </button>
        </div>
      </motion.div>
    </div>
  );
};
