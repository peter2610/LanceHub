'use client';

import Link from 'next/link';
import { useMockAuth } from '@/modules/shared/providers/MockAuthContext';

export default function CTASection() {
  const { isAuthenticated } = useMockAuth();
  
  return (
    <section className="cta-section">
      <div className="container">
        <h2>Ready to get started?</h2>
        <p>Submit your assignment today and receive high-quality work from our expert writers.</p>
        <Link href={isAuthenticated ? "/submit" : "/auth/register"} className="btn btn-primary">
          {isAuthenticated ? "Submit Assignment" : "Get Started Now"}
        </Link>
      </div>
    </section>
  );
}
