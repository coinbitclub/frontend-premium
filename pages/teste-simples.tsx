export default function TesteSimples() {
  return (
    <html>
      <head>
        <title>Teste Simples</title>
      </head>
      <body style={{ margin: 0, padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1 style={{ color: 'red', fontSize: '24px' }}>🔥 TESTE FUNCIONANDO!</h1>
        <p style={{ color: 'blue', fontSize: '18px' }}>Se você está vendo este texto, a página carregou corretamente.</p>
        <div style={{ 
          backgroundColor: 'yellow', 
          padding: '10px', 
          border: '2px solid black',
          marginTop: '20px'
        }}>
          <strong>DIAGNÓSTICO:</strong> Página renderizada com sucesso!
        </div>
      </body>
    </html>
  );
}
