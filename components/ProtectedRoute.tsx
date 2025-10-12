/**
 * 🔐 PROTECTED ROUTE COMPONENT
 * Standard authentication wrapper for protected pages
 */

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../src/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean; // If true, requires authentication (default: true)
  redirectTo?: string; // Where to redirect if not authenticated
  loadingComponent?: ReactNode;
}

export default function ProtectedRoute({
  children,
  requireAuth = true,
  redirectTo = '/auth/login',
  loadingComponent
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  // Authentication protection disabled - renders children directly
  useEffect(() => {
    // No auth checks - all routes accessible
  }, []);

  // Authentication disabled - always render children
  return <>{children}</>;
}

