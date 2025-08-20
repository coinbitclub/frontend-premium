import React from 'react';
import Head from 'next/head';

export default function SimpleAdminDashboard() {
  return (
    <>
      <Head>
        <title>Dashboard Admin | CoinBitClub</title>
      </Head>
      
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(to bottom right, #1a1a1a, #2d2d2d)',
        padding: '20px',
        color: 'white',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>
          Dashboard Administrativo
        </h1>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{ 
            background: 'rgba(255,255,255,0.1)', 
            padding: '20px', 
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <h3 style={{ color: '#fbbf24' }}>Total de Usuários</h3>
            <p style={{ fontSize: '2rem', margin: '10px 0' }}>15,847</p>
            <p style={{ color: '#a78bfa' }}>12,394 ativos</p>
          </div>
          
          <div style={{ 
            background: 'rgba(255,255,255,0.1)', 
            padding: '20px', 
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <h3 style={{ color: '#10b981' }}>Receita Total</h3>
            <p style={{ fontSize: '2rem', margin: '10px 0' }}>$2,847,593</p>
            <p style={{ color: '#34d399' }}>+$156,847 no mês</p>
          </div>
          
          <div style={{ 
            background: 'rgba(255,255,255,0.1)', 
            padding: '20px', 
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <h3 style={{ color: '#f59e0b' }}>Afiliados</h3>
            <p style={{ fontSize: '2rem', margin: '10px 0' }}>2,156</p>
            <p style={{ color: '#fbbf24' }}>89 VIP</p>
          </div>
          
          <div style={{ 
            background: 'rgba(255,255,255,0.1)', 
            padding: '20px', 
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <h3 style={{ color: '#3b82f6' }}>Operações Ativas</h3>
            <p style={{ fontSize: '2rem', margin: '10px 0' }}>1,247</p>
            <p style={{ color: '#60a5fa' }}>99.7% uptime</p>
          </div>
        </div>
        
        <div style={{ 
          background: 'rgba(255,255,255,0.1)', 
          padding: '20px', 
          borderRadius: '10px',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <h3 style={{ marginBottom: '15px' }}>Status das Integrações</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
            gap: '10px'
          }}>
            {['OpenAI', 'Stripe', 'Twilio', 'Binance', 'Bybit', 'Database', 'API', 'Analytics'].map(service => (
              <div key={service} style={{ 
                background: 'rgba(34, 197, 94, 0.2)', 
                padding: '10px', 
                borderRadius: '8px',
                textAlign: 'center',
                border: '1px solid rgba(34, 197, 94, 0.3)'
              }}>
                <div style={{ color: '#22c55e', fontWeight: 'bold', fontSize: '0.8rem' }}>
                  {service}
                </div>
                <div style={{ color: '#22c55e', fontSize: '0.7rem', marginTop: '5px' }}>
                  ONLINE
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <p style={{ marginTop: '30px', textAlign: 'center', color: '#9ca3af' }}>
          CoinBitClub Market Bot - Dashboard Administrativo
        </p>
      </div>
    </>
  );
}
