'use client';

import Link from 'next/link';
import { useMockAuth } from '@/modules/shared/providers/MockAuthContext';
import ThemeToggle from '@/modules/shared/components/ThemeToggle';

export default function HomepageNavigation() {
  const { isAuthenticated, user, logout } = useMockAuth();
  
  return (
    <nav>
      <div className="container">
        <div style={{fontSize: '1.5rem', fontWeight: '700', color: 'black'}}>LanceHub</div>
        <div style={{display: 'flex', gap: '2rem', alignItems: 'center'}}>
          <Link href="/" style={{color: 'black', textDecoration: 'none'}}>Home</Link>
          <Link href="/services" style={{color: 'black', textDecoration: 'none'}}>Services</Link>
          <Link href="/about" style={{color: 'black', textDecoration: 'none'}}>About</Link>
          <Link href="/contact" style={{color: 'black', textDecoration: 'none'}}>Contact</Link>
          
          {/* Role-based navigation */}
          {isAuthenticated && (
            <>
              {user?.role === 'CLIENT' && (
                <>
                  <Link href="/submit" style={{color: 'black', textDecoration: 'none'}}>Submit Assignment</Link>
                  <Link href="/submission" style={{color: 'black', textDecoration: 'none'}}>My Submissions</Link>
                </>
              )}
              {(user?.role === 'ADMIN' || user?.role === 'WRITER') && (
                <Link href="/dashboard" style={{color: 'black', textDecoration: 'none'}}>Dashboard</Link>
              )}
            </>
          )}
          
          {!isAuthenticated ? (
            <Link href="/auth/login" style={{color: 'black', textDecoration: 'none'}}>Login</Link>
          ) : (
            <>
              <span style={{color: 'black'}}>Welcome, {user?.name}</span>
              <button 
                onClick={() => logout()}
                style={{background: 'none', border: 'none', color: 'black', cursor: 'pointer'}}
              >
                Logout
              </button>
            </>
          )}
          
          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
