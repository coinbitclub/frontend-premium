import React from 'react';

export default function TestPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Página de Teste</h1>
      <p>Se você está vendo esta página, o Next.js está funcionando!</p>
      <p>Data/Hora: {new Date().toLocaleString()}</p>
    </div>
  );
}
