'use client';

import { useSession } from 'next-auth/react';

export default function TestSimple() {
  const { data: session, status } = useSession();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Simple Session Test</h1>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-100 rounded">
          <h2 className="font-semibold">Session Status:</h2>
          <p>{status}</p>
        </div>
        
        <div className="p-4 bg-gray-100 rounded">
          <h2 className="font-semibold">Session Data:</h2>
          <pre>{JSON.stringify(session, null, 2)}</pre>
        </div>
      </div>
      
      <div className="mt-8">
        <a href="/auth/login" className="text-blue-600 hover:underline">Go to Login</a>
      </div>
    </div>
  );
}
