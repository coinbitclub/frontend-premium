import React from 'react';
import Head from 'next/head';

export default function CadastroMinimo() {
  return (
    <>
      <Head>
        <title>Cadastro - CoinBitClub</title>
      </Head>
      
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1f1f23 0%, #2d2d35 100%)',
        padding: '20px',
        color: 'white',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <div style={{
          maxWidth: '400px',
          margin: '0 auto',
          paddingTop: '100px'
        }}>
          <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
            Cadastro CoinBitClub
          </h1>
          
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            padding: '30px',
            borderRadius: '10px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>Nome:</label>
              <input 
                type="text" 
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '5px',
                  border: '1px solid #444',
                  background: '#2a2a2a',
                  color: 'white'
                }}
                placeholder="Digite seu nome"
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>Email:</label>
              <input 
                type="email" 
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '5px',
                  border: '1px solid #444',
                  background: '#2a2a2a',
                  color: 'white'
                }}
                placeholder="seu@email.com"
              />
            </div>
            
            <button style={{
              width: '100%',
              padding: '15px',
              background: 'linear-gradient(45deg, #9333ea, #ec4899)',
              border: 'none',
              borderRadius: '5px',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
              Cadastrar
            </button>
          </div>
          
          <p style={{ textAlign: 'center', marginTop: '20px' }}>
            Já tem conta? <a href="/login" style={{ color: '#9333ea' }}>Fazer login</a>
          </p>
        </div>
      </div>
    </>
  );
}
