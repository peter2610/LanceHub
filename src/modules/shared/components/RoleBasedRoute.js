'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMockAuth } from '@/modules/shared/providers/MockAuthContext';

export default function RoleBasedRoute({ requiredRole, children, fallbackPath = '/auth/login' }) {
  const { user, loading, isAuthenticated, hasRole } = useMockAuth();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        // Not logged in, redirect to login
        router.push(fallbackPath);
      } else if (requiredRole && !hasRole(requiredRole)) {
        // Logged in but doesn't have required role
        router.push('/unauthorized');
      } else {
        setAuthorized(true);
      }
    }
  }, [loading, isAuthenticated, hasRole, requiredRole, router, fallbackPath]);

  if (loading || !authorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return children;
}
