'use client';

import Link from 'next/link';
import { useMockAuth } from '@/modules/shared/providers/MockAuthContext';

export default function HomepageFooter() {
  const { isAuthenticated, user } = useMockAuth();
  
  return (
    <footer>
      <div className="container">
        <p>&copy; 2024 LanceHub. All rights reserved.</p>
        <p>Professional Writing Services</p>
      </div>
      <div className="footer-links">
        <Link href="/">Home</Link>
        <Link href="/services">Services</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
        {isAuthenticated && user?.role === 'CLIENT' && (
          <Link href="/submission">My Submissions</Link>
        )}
      </div>
    </footer>
  );
}
