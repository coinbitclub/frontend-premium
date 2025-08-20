import React from 'react';

export default function TestSemFramer() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Teste Sem Framer Motion</h1>
      <p>Esta página não usa framer-motion para testar se o problema persiste.</p>
      <div style={{ 
        backgroundColor: '#f0f0f0', 
        padding: '10px', 
        marginTop: '10px',
        borderRadius: '5px'
      }}>
        <p>Se esta página carregar sem problemas de Fast Refresh, o problema era o framer-motion!</p>
      </div>
    </div>
  );
}
