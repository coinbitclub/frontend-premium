/**
 * 👤 USER PROFILE PAGE
 * Page for user profile management
 */

import React from 'react';
import Head from 'next/head';
import { ProtectedRoute } from '../../src/contexts/AuthContext';
import UserProfileManager from '../../src/components/UserProfileManager';

const UserProfilePage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Perfil do Usuário - CoinBitClub</title>
        <meta name="description" content="Gerencie seu perfil e configurações" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ProtectedRoute>
        <UserProfileManager />
      </ProtectedRoute>
    </>
  );
};

export default UserProfilePage;
 * 👤 USER PROFILE PAGE
 * Page for user profile management
 */

import React from 'react';
import Head from 'next/head';
import { ProtectedRoute } from '../../src/contexts/AuthContext';
import UserProfileManager from '../../src/components/UserProfileManager';

const UserProfilePage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Perfil do Usuário - CoinBitClub</title>
        <meta name="description" content="Gerencie seu perfil e configurações" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ProtectedRoute>
        <UserProfileManager />
      </ProtectedRoute>
    </>
  );
};

export default UserProfilePage;
 * 👤 USER PROFILE PAGE
 * Page for user profile management
 */

import React from 'react';
import Head from 'next/head';
import { ProtectedRoute } from '../../src/contexts/AuthContext';
import UserProfileManager from '../../src/components/UserProfileManager';

const UserProfilePage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Perfil do Usuário - CoinBitClub</title>
        <meta name="description" content="Gerencie seu perfil e configurações" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ProtectedRoute>
        <UserProfileManager />
      </ProtectedRoute>
    </>
  );
};

export default UserProfilePage;
