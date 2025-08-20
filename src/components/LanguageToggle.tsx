'use client';

import React, { useState, useEffect } from 'react';
import { GlobeAltIcon } from '@heroicons/react/24/outline';

interface LanguageToggleProps {
  className?: string;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ className = '' }) => {
  const [language, setLanguage] = useState('pt-BR');

  useEffect(() => {
    // Carrega idioma salvo no localStorage
    const savedLanguage = localStorage.getItem('language') || 'pt-BR';
    setLanguage(savedLanguage);
    
    // Aplica o idioma ao documento
    document.documentElement.lang = savedLanguage === 'pt-BR' ? 'pt' : 'en';
  }, []);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    document.documentElement.lang = newLanguage === 'pt-BR' ? 'pt' : 'en';
    
    // Disparar evento customizado para notificar outros componentes
    window.dispatchEvent(new CustomEvent('languageChange', { detail: newLanguage }));
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <GlobeAltIcon className="w-4 h-4 text-blue-400" />
      <select 
        value={language}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className="bg-transparent text-white border-none outline-none text-sm cursor-pointer"
      >
        <option value="pt-BR" className="bg-gray-800">🇧🇷 PT</option>
        <option value="en-US" className="bg-gray-800">🇺🇸 EN</option>
      </select>
    </div>
  );
};
