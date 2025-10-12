/**
 * 🌐 PUBLIC ROUTE COMPONENT
 * Wrapper for public pages (login, register) that redirects authenticated users
 */

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../src/contexts/AuthContext';

interface PublicRouteProps {
  children: ReactNode;
  redirectIfAuthenticated?: boolean; // If true, redirect authenticated users (default: true)
  redirectTo?: string; // Where to redirect authenticated users
}

export default function PublicRoute({
  children,
  redirectIfAuthenticated = true,
  redirectTo = '/user/dashboard'
}: PublicRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  // Authentication protection disabled - renders children directly
  useEffect(() => {
    // No auth checks - all routes accessible
  }, []);

  // Authentication disabled - always render children
  return <>{children}</>;
}

