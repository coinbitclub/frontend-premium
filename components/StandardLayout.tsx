import React, { ReactNode } from 'react';
import Head from 'next/head';

interface StandardLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

const StandardLayout: React.FC<StandardLayoutProps> = ({ 
  children, 
  title = 'CoinBitClub', 
  description = 'Plataforma de Trading Profissional',
  className = '' 
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black ${className}`}>
        <main className="container mx-auto px-4 py-4">
          {children}
        </main>
      </div>
    </>
  );
};

export default StandardLayout;
