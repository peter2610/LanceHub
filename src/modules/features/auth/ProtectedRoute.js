'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/modules/shared/providers/AuthContext';

export default function ProtectedRoute({ requiredRole, children }) {
  const { user, loading, hasRole } = useAuth();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in, redirect to login
        router.push('/auth/login');
      } else if (requiredRole && !hasRole(requiredRole)) {
        // Logged in but not authorized, redirect to unauthorized or home
        router.push('/unauthorized');
      } else {
        // Authorized
        setAuthorized(true);
      }
    }
  }, [user, loading, requiredRole, hasRole, router]);

  if (loading || !authorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <>{children}</>;
}
