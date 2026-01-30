'use client';

import Link from 'next/link';
import { useMockAuth } from '@/modules/shared/providers/MockAuthContext';

export default function HeroSection() {
  const { isAuthenticated } = useMockAuth();
  
  return (
    <section className="hero-section">
      <div className="container">
        <h1>Professional Writing Services</h1>
        <p>High-quality content delivered on time, every time</p>
        <div style={{marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center'}}>
          <Link href="/submit" className="btn btn-primary">Submit Assignment</Link>
          <Link href="/services" className="btn btn-secondary">Our Services</Link>
        </div>
      </div>
    </section>
  );
}
