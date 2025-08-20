import React from 'react';

/**
 * PÁGINA ULTRA-SIMPLES - ZERO JAVASCRIPT DINÂMICO
 * Sem hooks, sem efeitos, sem estado - apenas HTML estático
 */
export default function PaginaEstatica() {
  return (
    <div>
      <h1>✅ PÁGINA COMPLETAMENTE ESTÁTICA</h1>
      
      <div style={{ 
        padding: '20px',
        backgroundColor: '#d4edda',
        border: '1px solid #c3e6cb',
        color: '#155724',
        margin: '20px 0'
      }}>
        <h2>🎯 TESTE DE ESTABILIDADE</h2>
        <p>Esta página não possui:</p>
        <ul>
          <li>❌ useState</li>
          <li>❌ useEffect</li>
          <li>❌ Hooks customizados</li>
          <li>❌ Event handlers</li>
          <li>❌ JavaScript dinâmico</li>
        </ul>
        <p><strong>Se esta página piscar, o problema está no Next.js core.</strong></p>
      </div>
      
      <div style={{ 
        padding: '20px',
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6'
      }}>
        <h3>📊 Status do Sistema:</h3>
        <p>Porta: 3003</p>
        <p>Modo: Desenvolvimento Ultra-Estável</p>
        <p>Status: Funcionando</p>
      </div>
      
      <div style={{ 
        padding: '20px',
        backgroundColor: '#fff3cd',
        border: '1px solid #ffeaa7',
        color: '#856404',
        marginTop: '20px'
      }}>
        <h3>⚠️ IMPORTANTE:</h3>
        <p>Esta é uma página de teste para diagnosticar o problema do "piscando".</p>
        <p>Se ela funcionar sem piscar, poderemos gradualmente adicionar funcionalidades.</p>
      </div>
    </div>
  );
}
