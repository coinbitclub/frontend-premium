import React from 'react';
import Head from 'next/head';
import Sidebar from '../Sidebar';
import { PageTracker } from '../PageTracker';

interface AffiliateLayoutProps {
  children: React.ReactNode;
  title?: string;
  pageTitle?: string;
  pageCategory?: string;
}

const AffiliateLayout: React.FC<AffiliateLayoutProps> = ({ 
  children, 
  title = 'Dashboard Afiliado',
  pageTitle,
  pageCategory = 'affiliate'
}) => {
  return (
    <>
      <Head>
        <title>{title} - CoinBitClub</title>
        <meta name="description" content="Área do afiliado CoinBitClub - Gerencie suas indicações e comissões" />
      </Head>
      
      <PageTracker 
        pageTitle={pageTitle || title}
        pageCategory={pageCategory}
        customParams={{ user_type: 'affiliate' }}
      />

      <div className="flex min-h-screen bg-black text-white">
        <Sidebar />
        
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </>
  );
};

export default AffiliateLayout;


