'use client';

import { useAuth } from '@/context/AuthContext';
import { useSession } from 'next-auth/react';

export default function TestAuth() {
  const { user, isAuthenticated, hasRole } = useAuth();
  const { data: session, status } = useSession();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Authentication Test Page</h1>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-100 rounded">
          <h2 className="font-semibold">Session Status:</h2>
          <p>{status}</p>
        </div>
        
        <div className="p-4 bg-gray-100 rounded">
          <h2 className="font-semibold">Session Data:</h2>
          <pre>{JSON.stringify(session, null, 2)}</pre>
        </div>
        
        <div className="p-4 bg-gray-100 rounded">
          <h2 className="font-semibold">Auth Context User:</h2>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
        
        <div className="p-4 bg-gray-100 rounded">
          <h2 className="font-semibold">Is Authenticated:</h2>
          <p>{isAuthenticated ? 'Yes' : 'No'}</p>
        </div>
        
        <div className="p-4 bg-gray-100 rounded">
          <h2 className="font-semibold">Role Checks:</h2>
          <p>Has USER role: {hasRole ? hasRole('USER') ? 'Yes' : 'No' : 'N/A'}</p>
          <p>Has WRITER role: {hasRole ? hasRole('WRITER') ? 'Yes' : 'No' : 'N/A'}</p>
          <p>Has ADMIN role: {hasRole ? hasRole('ADMIN') ? 'Yes' : 'No' : 'N/A'}</p>
        </div>
      </div>
      
      <div className="mt-8">
        <a href="/auth/login" className="text-blue-600 hover:underline">Go to Login</a>
        <span className="mx-4">|</span>
        <a href="/" className="text-blue-600 hover:underline">Go Home</a>
      </div>
    </div>
  );
}
