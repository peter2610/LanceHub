'use client';

import Link from 'next/link';
import { useMockAuth } from '@/context/MockAuthContext';

export default function HomepageNavigation() {
  const { isAuthenticated, user, logout } = useMockAuth();
  
  return (
    <nav>
      <div className="container">
        <div style={{fontSize: '1.5rem', fontWeight: '700', color: '#0066ff'}}>LanceHub</div>
        <div style={{display: 'flex', gap: '2rem', alignItems: 'center'}}>
          <Link href="/">Home</Link>
          <Link href="/services">Services</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/submission">Submission</Link>
          {isAuthenticated ? (
            <>
              <span style={{color: '#666'}}>Welcome, {user?.name}</span>
              <button 
                onClick={() => logout()}
                style={{background: 'none', border: 'none', color: '#0066ff', cursor: 'pointer'}}
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/auth/login" style={{color: '#0066ff', textDecoration: 'none'}}>Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
