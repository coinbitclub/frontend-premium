/**
 * 👤 ENHANCED USER SETTINGS PAGE
 * Comprehensive user settings management page
 */

import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import UserSettingsEnhanced from '../../src/components/UserSettingsEnhanced';
import { useAuth } from '../../src/contexts/AuthContext';

const UserSettingsEnhancedPage: React.FC = () => {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-400 mb-4 mx-auto"></div>
          <h2 className="text-2xl font-bold text-white mb-2">CoinBitClub</h2>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Enhanced Settings - CoinBitClub Enterprise</title>
        <meta name="description" content="Manage your comprehensive user settings including trading, notifications, banking, and security preferences" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <UserSettingsEnhanced />
    </>
  );
};

export default UserSettingsEnhancedPage;
 * 👤 ENHANCED USER SETTINGS PAGE
 * Comprehensive user settings management page
 */

import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import UserSettingsEnhanced from '../../src/components/UserSettingsEnhanced';
import { useAuth } from '../../src/contexts/AuthContext';

const UserSettingsEnhancedPage: React.FC = () => {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-400 mb-4 mx-auto"></div>
          <h2 className="text-2xl font-bold text-white mb-2">CoinBitClub</h2>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Enhanced Settings - CoinBitClub Enterprise</title>
        <meta name="description" content="Manage your comprehensive user settings including trading, notifications, banking, and security preferences" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <UserSettingsEnhanced />
    </>
  );
};

export default UserSettingsEnhancedPage;
 * 👤 ENHANCED USER SETTINGS PAGE
 * Comprehensive user settings management page
 */

import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import UserSettingsEnhanced from '../../src/components/UserSettingsEnhanced';
import { useAuth } from '../../src/contexts/AuthContext';

const UserSettingsEnhancedPage: React.FC = () => {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-400 mb-4 mx-auto"></div>
          <h2 className="text-2xl font-bold text-white mb-2">CoinBitClub</h2>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Enhanced Settings - CoinBitClub Enterprise</title>
        <meta name="description" content="Manage your comprehensive user settings including trading, notifications, banking, and security preferences" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <UserSettingsEnhanced />
    </>
  );
};

export default UserSettingsEnhancedPage;
