'use client';

import { useSession, signIn } from 'next-auth/react';

export default function TestNextAuth() {
  const { data: session, status } = useSession();

  const handleLogin = async () => {
    await signIn('credentials', {
      email: 'user@example.com',
      password: 'password',
      redirect: false,
    });
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">NextAuth Direct Test</h1>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-100 rounded">
          <h2 className="font-semibold">Session Status:</h2>
          <p>{status}</p>
        </div>
        
        <div className="p-4 bg-gray-100 rounded">
          <h2 className="font-semibold">Session Data:</h2>
          <pre>{JSON.stringify(session, null, 2)}</pre>
        </div>
        
        <button
          onClick={handleLogin}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Test Login
        </button>
      </div>
    </div>
  );
}
