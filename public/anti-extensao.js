// Anti-extensão: Bloqueia mensagens que quebram HMR
(function() {
  'use strict';
  
  // Backup original
  const originalPostMessage = window.postMessage;
  const originalAddEventListener = window.addEventListener;
  
  // Interceptar postMessage e filtrar mensagens problemáticas
  window.postMessage = function(message, targetOrigin, transfer) {
    // Bloquear mensagens sem 'data' que quebram o HMR
    if (!message || typeof message !== 'object' || !message.hasOwnProperty('data')) {
      console.warn('[BLOQUEADO] Mensagem sem propriedade data:', message);
      return;
    }
    
    // Bloquear mensagens de extensões conhecidas
    if (message.source && (
        message.source.includes('ContentService') ||
        message.source.includes('ContentMain') ||
        message.source.includes('ExportExtension')
      )) {
      console.warn('[BLOQUEADO] Mensagem de extensão:', message);
      return;
    }
    
    return originalPostMessage.call(this, message, targetOrigin, transfer);
  };
  
  // Interceptar addEventListener para message events
  window.addEventListener = function(type, listener, options) {
    if (type === 'message') {
      const wrappedListener = function(event) {
        // Verificar se o evento tem a estrutura correta
        if (!event.data || typeof event.data !== 'object') {
          console.warn('[BLOQUEADO] Event listener - dados inválidos:', event);
          return;
        }
        
        // Aplicar o listener original apenas se os dados são válidos
        return listener.call(this, event);
      };
      
      return originalAddEventListener.call(this, type, wrappedListener, options);
    }
    
    return originalAddEventListener.call(this, type, listener, options);
  };
  
  console.log('[PROTEÇÃO] Anti-extensão ativado - HMR protegido');
})();
