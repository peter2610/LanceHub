'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMockAuth } from '@/modules/shared/providers/MockAuthContext';

export default function Dashboard() {
  const { user, loading } = useMockAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      // Redirect based on role
      switch (user.role) {
        case 'ADMIN':
          router.push('/dashboard/admin');
          break;
        case 'WRITER':
          router.push('/dashboard/writer');
          break;
        case 'CLIENT':
          router.push('/');
          break;
        default:
          router.push('/'); // Default to home
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
