// 🎨 DESIGN SYSTEM PREMIUM - COINBITCLUB MARKETBOT
// Sistema de cores neon enterprise para trading em tempo real

export const designSystem = {
  // 🌈 CORES NEON PRINCIPAIS
  colors: {
    neon: {
      gold: '#FFD700',     // Dourado premium
      blue: '#00BFFF',     // Azul elétrico
      pink: '#FF69B4',     // Rosa vibrante
    },
    
    // Variações dourado
    gold: {
      50: '#FFFEF7',   // Dourado ultra claro
      100: '#FFF8DC',  // Dourado claro
      200: '#FFE55C',  // Dourado médio
      300: '#FFD700',  // Dourado neon (principal)
      400: '#FFC107',  // Dourado forte
      500: '#FF8F00',  // Dourado escuro
      600: '#FF6F00',  // Dourado muito escuro
      700: '#E65100',  // Dourado bronze
      800: '#BF360C',  // Dourado cobre
      900: '#3E2723',  // Dourado sombra
    },
    
    // Variações azul
    blue: {
      50: '#E3F2FD',   // Azul ultra claro
      100: '#BBDEFB',  // Azul claro
      200: '#90CAF9',  // Azul médio claro
      300: '#64B5F6',  // Azul médio
      400: '#42A5F5',  // Azul forte
      500: '#00BFFF',  // Azul neon (principal)
      600: '#1E88E5',  // Azul forte escuro
      700: '#1976D2',  // Azul escuro
      800: '#1565C0',  // Azul muito escuro
      900: '#0D47A1',  // Azul sombra
    },
    
    // Variações rosa
    pink: {
      50: '#FCE4EC',   // Rosa ultra claro
      100: '#F8BBD9',  // Rosa claro
      200: '#F48FB1',  // Rosa médio claro
      300: '#F06292',  // Rosa médio
      400: '#EC407A',  // Rosa forte
      500: '#FF69B4',  // Rosa neon (principal)
      600: '#E91E63',  // Rosa forte escuro
      700: '#C2185B',  // Rosa escuro
      800: '#AD1457',  // Rosa muito escuro
      900: '#880E4F',  // Rosa sombra
    },
    
    // 🌙 DARK THEME
    dark: {
      primary: '#0a0a0a',     // Fundo principal
      secondary: '#1a1a1a',   // Fundo secundário
      surface: '#2a2a2a',     // Superfície (cards)
      surfaceLight: '#3a3a3a', // Superfície clara
      border: '#404040',      // Bordas
      text: {
        primary: '#ffffff',   // Texto principal
        secondary: '#b0b0b0', // Texto secundário
        muted: '#808080',     // Texto esmaecido
      }
    },
    
    // ☀️ LIGHT THEME
    light: {
      primary: '#ffffff',     // Fundo principal
      secondary: '#f8f9fa',   // Fundo secundário
      surface: '#ffffff',     // Superfície (cards)
      surfaceGray: '#f5f5f5', // Superfície cinza
      border: '#e0e0e0',     // Bordas
      text: {
        primary: '#1a1a1a',   // Texto principal
        secondary: '#4a4a4a', // Texto secundário
        muted: '#6a6a6a',     // Texto esmaecido
      }
    },
    
    // 🎯 STATUS COLORS (para trading)
    status: {
      success: '#00FF7F',     // Verde neon (profit)
      error: '#FF4500',       // Vermelho (loss)
      warning: '#FFA500',     // Laranja (atenção)
      info: '#00CED1',        // Ciano (informação)
      pending: '#FFD700',     // Dourado (pendente)
    },
    
    // 📈 TRADING SPECIFIC
    trading: {
      profit: '#00FF7F',      // Verde para lucro
      loss: '#FF4500',        // Vermelho para prejuízo
      buy: '#00FF7F',         // Verde para compra
      sell: '#FF4500',        // Vermelho para venda
      neutral: '#FFD700',     // Dourado para neutro
    }
  },
  
  // 🎨 GRADIENTES PREMIUM
  gradients: {
    gold: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    blue: 'linear-gradient(135deg, #00BFFF 0%, #0080FF 100%)',
    pink: 'linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)',
    success: 'linear-gradient(135deg, #00FF7F 0%, #32CD32 100%)',
    error: 'linear-gradient(135deg, #FF4500 0%, #DC143C 100%)',
    
    // Gradientes para backgrounds
    darkHero: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2a2a2a 100%)',
    lightHero: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #f0f0f0 100%)',
    
    // Gradientes neon para efeitos
    neonGlow: 'linear-gradient(45deg, #FFD700, #00BFFF, #FF69B4)',
  },
  
  // 📝 TYPOGRAPHY SYSTEM
  typography: {
    fonts: {
      primary: '"Inter", system-ui, -apple-system, sans-serif',
      numbers: '"JetBrains Mono", "SF Mono", Consolas, monospace',
      display: '"Poppins", system-ui, -apple-system, sans-serif',
    },
    
    // Tamanhos responsivos
    sizes: {
      xs: 'clamp(0.75rem, 2vw, 0.875rem)',    // 12-14px
      sm: 'clamp(0.875rem, 2.5vw, 1rem)',     // 14-16px
      base: 'clamp(1rem, 3vw, 1.125rem)',     // 16-18px
      lg: 'clamp(1.125rem, 3.5vw, 1.25rem)',  // 18-20px
      xl: 'clamp(1.25rem, 4vw, 1.5rem)',      // 20-24px
      '2xl': 'clamp(1.5rem, 5vw, 2rem)',      // 24-32px
      '3xl': 'clamp(2rem, 6vw, 2.5rem)',      // 32-40px
      '4xl': 'clamp(2.5rem, 7vw, 3rem)',      // 40-48px
    },
    
    // Pesos
    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    
    // Line heights para diferentes contextos
    lineHeights: {
      tight: 1.2,     // Títulos
      normal: 1.5,    // Texto normal
      relaxed: 1.7,   // Texto longo
      numbers: 1.1,   // Números (trading)
    }
  },
  
  // 📱 BREAKPOINTS ENTERPRISE
  breakpoints: {
    mobile: '320px',      // iPhone SE
    mobileLg: '375px',    // iPhone 12
    tablet: '768px',      // iPad
    tabletLg: '1024px',   // iPad Pro
    desktop: '1280px',    // Desktop
    desktopLg: '1440px',  // Desktop grande
    desktopXl: '1920px',  // Monitor 1080p
    desktop2xl: '2560px', // Monitor 1440p
  },
  
  // 🎯 SPACING SYSTEM
  spacing: {
    px: '1px',
    0: '0',
    1: '0.25rem',    // 4px
    2: '0.5rem',     // 8px
    3: '0.75rem',    // 12px
    4: '1rem',       // 16px
    5: '1.25rem',    // 20px
    6: '1.5rem',     // 24px
    8: '2rem',       // 32px
    10: '2.5rem',    // 40px
    12: '3rem',      // 48px
    16: '4rem',      // 64px
    20: '5rem',      // 80px
    24: '6rem',      // 96px
    32: '8rem',      // 128px
  },
  
  // 🎨 SHADOWS PREMIUM
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    
    // Sombras neon
    neonGold: '0 0 20px rgba(255, 215, 0, 0.3)',
    neonBlue: '0 0 20px rgba(0, 191, 255, 0.3)',
    neonPink: '0 0 20px rgba(255, 105, 180, 0.3)',
    
    // Sombras para cards
    cardDark: '0 4px 20px rgba(0, 0, 0, 0.3)',
    cardLight: '0 4px 20px rgba(0, 0, 0, 0.1)',
  },
  
  // 🔄 ANIMATIONS
  animations: {
    duration: {
      fast: '150ms',
      normal: '200ms',
      slow: '300ms',
      slower: '500ms',
    },
    
    easing: {
      linear: 'linear',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
    
    // Animações específicas para trading
    trading: {
      priceFlash: {
        profit: 'flash-green 300ms ease-out',
        loss: 'flash-red 300ms ease-out',
      },
      notification: 'slide-in-notification 300ms ease-out',
      counter: 'counter-animation 500ms ease-in-out',
      skeleton: 'skeleton-pulse 1.5s ease-in-out infinite',
    }
  },
  
  // 📐 BORDER RADIUS
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px',
  },
  
  // 🎯 Z-INDEX LAYERS
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  }
};

// 🎨 CSS CUSTOM PROPERTIES (para uso em CSS)
export const cssVariables = `
  :root {
    /* Cores neon */
    --color-neon-gold: ${designSystem.colors.neon.gold};
    --color-neon-blue: ${designSystem.colors.neon.blue};
    --color-neon-pink: ${designSystem.colors.neon.pink};
    
    /* Status */
    --color-success: ${designSystem.colors.status.success};
    --color-error: ${designSystem.colors.status.error};
    --color-warning: ${designSystem.colors.status.warning};
    --color-info: ${designSystem.colors.status.info};
    
    /* Gradientes */
    --gradient-gold: ${designSystem.gradients.gold};
    --gradient-blue: ${designSystem.gradients.blue};
    --gradient-pink: ${designSystem.gradients.pink};
    
    /* Fontes */
    --font-primary: ${designSystem.typography.fonts.primary};
    --font-numbers: ${designSystem.typography.fonts.numbers};
    --font-display: ${designSystem.typography.fonts.display};
    
    /* Animações */
    --duration-fast: ${designSystem.animations.duration.fast};
    --duration-normal: ${designSystem.animations.duration.normal};
    --duration-slow: ${designSystem.animations.duration.slow};
    
    /* Sombras neon */
    --shadow-neon-gold: ${designSystem.shadows.neonGold};
    --shadow-neon-blue: ${designSystem.shadows.neonBlue};
    --shadow-neon-pink: ${designSystem.shadows.neonPink};
  }
  
  [data-theme="dark"] {
    --bg-primary: ${designSystem.colors.dark.primary};
    --bg-secondary: ${designSystem.colors.dark.secondary};
    --bg-surface: ${designSystem.colors.dark.surface};
    --text-primary: ${designSystem.colors.dark.text.primary};
    --text-secondary: ${designSystem.colors.dark.text.secondary};
    --text-muted: ${designSystem.colors.dark.text.muted};
    --border: ${designSystem.colors.dark.border};
  }
  
  [data-theme="light"] {
    --bg-primary: ${designSystem.colors.light.primary};
    --bg-secondary: ${designSystem.colors.light.secondary};
    --bg-surface: ${designSystem.colors.light.surface};
    --text-primary: ${designSystem.colors.light.text.primary};
    --text-secondary: ${designSystem.colors.light.text.secondary};
    --text-muted: ${designSystem.colors.light.text.muted};
    --border: ${designSystem.colors.light.border};
  }
`;

export default designSystem;
