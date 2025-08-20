// 🌙 THEME PROVIDER PREMIUM
// Sistema completo de Dark/Light mode para trading

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: 'dark' | 'light'; // Tema real aplicado (resolvendo 'system')
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'coinbitclub-theme',
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [actualTheme, setActualTheme] = useState<'dark' | 'light'>('dark');

  // Detecta tema do sistema
  const getSystemTheme = (): 'dark' | 'light' => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark'; // Default para trading
  };

  // Resolve tema atual
  const resolveTheme = (currentTheme: Theme): 'dark' | 'light' => {
    if (currentTheme === 'system') {
      return getSystemTheme();
    }
    return currentTheme;
  };

  // Inicialização
  useEffect(() => {
    const storedTheme = localStorage.getItem(storageKey) as Theme;
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, [storageKey]);

  // Aplicar tema
  useEffect(() => {
    const root = window.document.documentElement;
    const resolved = resolveTheme(theme);
    
    setActualTheme(resolved);
    
    // Remove classes anteriores
    root.classList.remove('light', 'dark');
    
    // Adiciona nova classe
    root.classList.add(resolved);
    
    // Define data-theme para CSS variables
    root.setAttribute('data-theme', resolved);
    
    // Salva no localStorage
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

  // Escuta mudanças do sistema quando theme === 'system'
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      const resolved = resolveTheme('system');
      setActualTheme(resolved);
      
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(resolved);
      root.setAttribute('data-theme', resolved);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const value: ThemeContextType = {
    theme,
    setTheme,
    actualTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook para usar o tema
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

// 🎛️ THEME TOGGLE COMPONENT
import { Moon, Sun, Monitor } from 'lucide-react';
import { motion } from 'framer-motion';

interface ThemeToggleProps {
  variant?: 'default' | 'minimal' | 'dropdown';
  size?: 'sm' | 'md' | 'lg';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  variant = 'default',
  size = 'md' 
}) => {
  const { theme, setTheme, actualTheme } = useTheme();

  const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Light', icon: <Sun className="w-4 h-4" /> },
    { value: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4" /> },
    { value: 'system', label: 'System', icon: <Monitor className="w-4 h-4" /> },
  ];

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'p-1.5 text-sm';
      case 'lg':
        return 'p-3 text-lg';
      default:
        return 'p-2 text-base';
    }
  };

  if (variant === 'minimal') {
    const currentTheme = themes.find(t => t.value === theme);
    
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          const nextIndex = (themes.findIndex(t => t.value === theme) + 1) % themes.length;
          setTheme(themes[nextIndex].value);
        }}
        className={`
          ${getSizeClasses()}
          rounded-lg bg-white/10 backdrop-blur-sm border border-white/20
          hover:bg-white/20 transition-all duration-200
          text-gray-600 dark:text-gray-300
        `}
        title={`Current: ${currentTheme?.label} (${actualTheme})`}
      >
        {currentTheme?.icon}
      </motion.button>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div className="relative group">
        <motion.button
          whileHover={{ scale: 1.02 }}
          className={`
            ${getSizeClasses()}
            rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700
            hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200
            flex items-center gap-2 min-w-[120px] justify-between
          `}
        >
          <span className="flex items-center gap-2">
            {themes.find(t => t.value === theme)?.icon}
            {themes.find(t => t.value === theme)?.label}
          </span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.button>
        
        <div className="
          absolute top-full mt-1 left-0 w-full
          bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
          rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible
          transition-all duration-200 z-50
        ">
          {themes.map((themeOption) => (
            <motion.button
              key={themeOption.value}
              whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
              onClick={() => setTheme(themeOption.value)}
              className={`
                w-full p-2 text-left flex items-center gap-2
                hover:bg-gray-100 dark:hover:bg-gray-700
                first:rounded-t-lg last:rounded-b-lg
                ${theme === themeOption.value ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''}
              `}
            >
              {themeOption.icon}
              {themeOption.label}
              {theme === themeOption.value && (
                <span className="ml-auto text-xs">({actualTheme})</span>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  // Default variant - toggle buttons
  return (
    <div className="flex rounded-lg bg-gray-100 dark:bg-gray-800 p-1">
      {themes.map((themeOption) => (
        <motion.button
          key={themeOption.value}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setTheme(themeOption.value)}
          className={`
            ${getSizeClasses()}
            rounded-md flex items-center gap-2 transition-all duration-200
            ${theme === themeOption.value 
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }
          `}
          title={`Switch to ${themeOption.label} mode`}
        >
          {themeOption.icon}
          <span className="hidden sm:inline">{themeOption.label}</span>
        </motion.button>
      ))}
    </div>
  );
};

// CSS para transições suaves
export const themeTransitionCSS = `
  *, *::before, *::after {
    transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease !important;
  }
`;

export default ThemeProvider;
