'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMockAuth } from '@/context/MockAuthContext';
import LoadingSpinner from '@/components/layout/LoadingSpinner';

export default function Submit() {
  const { isAuthenticated } = useMockAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      const callbackUrl = searchParams.get('callbackUrl') || '/submit';
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, router, searchParams]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <section className="hero-section">
        <div className="container">
          <h1>Submit Your Assignment</h1>
          <p>Get started with your writing project today</p>
        </div>
      </section>

      <section className="services-section">
        <div className="container" style={{maxWidth: '600px'}}>
          <form style={{background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
            <div style={{marginBottom: '1.5rem'}}>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600'}}>Full Name</label>
              <input type="text" placeholder="Your name" required />
            </div>

            <div style={{marginBottom: '1.5rem'}}>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600'}}>Email Address</label>
              <input type="email" placeholder="your@email.com" required />
            </div>

            <div style={{marginBottom: '1.5rem'}}>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600'}}>Service Type</label>
              <select required>
                <option>Select a service</option>
                <option>Academic Writing</option>
                <option>Content Creation</option>
                <option>Business Documents</option>
                <option>Editing & Proofreading</option>
                <option>Copywriting</option>
                <option>Technical Writing</option>
              </select>
            </div>

            <div style={{marginBottom: '1.5rem'}}>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600'}}>Project Description</label>
              <textarea placeholder="Describe your project in detail..." rows="5" required></textarea>
            </div>

            <div style={{marginBottom: '1.5rem'}}>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600'}}>Deadline</label>
              <input type="date" required />
            </div>

            <button type="submit" className="btn btn-primary" style={{width: '100%'}}>Submit Assignment</button>
          </form>
        </div>
      </section>
    </div>
  );
}
