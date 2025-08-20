import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface LanguageContextType {
  language: 'pt' | 'en';
  setLanguage: (lang: 'pt' | 'en') => void;
  changeLanguage: (lang: 'pt' | 'en') => void; // Legacy alias
  t: (key: string) => string;
  isLoaded?: boolean; // Legacy property
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

// Traduções básicas
const translations = {
  pt: {
    welcome: 'Bem-vindo',
    loading: 'Carregando...',
    error: 'Erro',
    success: 'Sucesso',
    save: 'Salvar',
    cancel: 'Cancelar',
    yes: 'Sim',
    no: 'Não',
    confirm: 'Confirmar',
    close: 'Fechar',
    dashboard: 'Dashboard',
    admin: 'Administração',
    users: 'Usuários',
    settings: 'Configurações',
    logout: 'Sair',
    login: 'Entrar',
    register: 'Cadastrar',
    profile: 'Perfil',
    language: 'Idioma',
  },
  en: {
    welcome: 'Welcome',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    save: 'Save',
    cancel: 'Cancel',
    yes: 'Yes',
    no: 'No',
    confirm: 'Confirm',
    close: 'Close',
    dashboard: 'Dashboard',
    admin: 'Administration',
    users: 'Users',
    settings: 'Settings',
    logout: 'Logout',
    login: 'Login',
    register: 'Register',
    profile: 'Profile',
    language: 'Language',
  }
};

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<'pt' | 'en'>('pt');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Indicar que estamos no cliente
    setIsClient(true);
    
    // Tentar carregar idioma do localStorage apenas no cliente
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language') as 'pt' | 'en';
      if (savedLanguage) {
        setLanguage(savedLanguage);
      }
    }
  }, []);

  useEffect(() => {
    // Salvar idioma no localStorage quando mudar (apenas no cliente)
    if (isClient && typeof window !== 'undefined') {
      localStorage.setItem('language', language);
    }
  }, [language, isClient]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.pt] || key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    changeLanguage: setLanguage, // Legacy alias
    t,
    isLoaded: isClient, // Carregado apenas quando no cliente
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}