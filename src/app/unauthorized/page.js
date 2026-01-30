'use client';

import Link from 'next/link';
import { useMockAuth } from '@/modules/shared/providers/MockAuthContext';

export default function Unauthorized() {
  const { user } = useMockAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-red-600">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Access Denied
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            You don't have permission to access this page.
          </p>
          {user && (
            <p className="mt-1 text-sm text-gray-500">
              Your current role: <span className="font-medium">{user.role}</span>
            </p>
          )}
        </div>
        
        <div className="mt-8 space-y-4">
          <div className="rounded-md shadow">
            <Link
              href="/dashboard"
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go to Dashboard
            </Link>
          </div>
          
          <div className="text-center">
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-500 text-sm font-medium"
            >
              Back to Home
            </Link>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Need Help?</h3>
          <p className="text-sm text-blue-700">
            If you believe this is an error, please contact support or check with your administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
