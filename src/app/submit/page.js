'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMockAuth } from '@/modules/shared/providers/MockAuthContext';
import RoleBasedRoute from '@/modules/shared/components/RoleBasedRoute';
import LoadingSpinner from '@/modules/shared/components/LoadingSpinner';

export default function Submit() {
  return (
    <RoleBasedRoute requiredRole="CLIENT">
      <SubmitContent />
    </RoleBasedRoute>
  );
}

function SubmitContent() {
  const { isAuthenticated } = useMockAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    serviceType: '',
    projectDescription: '',
    deadline: '',
    file: null,
    additionalInfo: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      const callbackUrl = searchParams.get('callbackUrl') || '/submit';
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, router, searchParams]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        router.push('/submission');
      }, 3000);
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <form onSubmit={handleSubmit} style={{background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
            <div style={{marginBottom: '1.5rem'}}>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600'}}>Full Name</label>
              <input 
                type="text" 
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Your name" 
                required 
                style={{width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px'}}
              />
            </div>

            <div style={{marginBottom: '1.5rem'}}>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600'}}>Email Address</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com" 
                required 
                style={{width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px'}}
              />
            </div>

            <div style={{marginBottom: '1.5rem'}}>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600'}}>Service Type</label>
              <select 
                name="serviceType"
                value={formData.serviceType}
                onChange={handleInputChange}
                required 
                style={{width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px'}}
              >
                <option value="">Select a service</option>
                <option value="academic">Academic Writing</option>
                <option value="content">Content Creation</option>
                <option value="business">Business Documents</option>
                <option value="editing">Editing & Proofreading</option>
                <option value="copywriting">Copywriting</option>
                <option value="technical">Technical Writing</option>
              </select>
            </div>

            <div style={{marginBottom: '1.5rem'}}>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600'}}>Project Description</label>
              <textarea 
                name="projectDescription"
                value={formData.projectDescription}
                onChange={handleInputChange}
                placeholder="Describe your project in detail..." 
                rows="5" 
                required
                style={{width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', resize: 'vertical'}}
              />
            </div>

            <div style={{marginBottom: '1.5rem'}}>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600'}}>Deadline</label>
              <input 
                type="date" 
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                required 
                style={{width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px'}}
              />
            </div>

            <div style={{marginBottom: '1.5rem'}}>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600'}}>Upload File/Document</label>
              <input 
                type="file" 
                name="file"
                onChange={handleInputChange}
                accept=".pdf,.doc,.docx,.txt,.rtf"
                style={{width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px'}}
              />
              {formData.file && (
                <p style={{marginTop: '0.5rem', fontSize: '0.875rem', color: '#059669'}}>
                  Selected: {formData.file.name}
                </p>
              )}
            </div>

            <div style={{marginBottom: '1.5rem'}}>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600'}}>Additional Information</label>
              <textarea 
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleInputChange}
                placeholder="Any additional requirements or specifications..." 
                rows="3"
                style={{width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', resize: 'vertical'}}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={isSubmitting}
              style={{width: '100%', padding: '0.75rem', fontSize: '1rem', cursor: isSubmitting ? 'not-allowed' : 'pointer'}}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
            </button>
          </form>
        </div>
      </section>

      {/* Success Modal */}
      {showSuccess && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center'
          }}>
            <div style={{fontSize: '3rem', marginBottom: '1rem'}}>✅</div>
            <h3 style={{marginBottom: '1rem', color: '#111827'}}>Assignment Submitted Successfully!</h3>
            <p style={{color: '#6b7280', marginBottom: '1.5rem'}}>
              Your assignment has been submitted and will be reviewed by our team.
            </p>
            <p style={{color: '#6b7280', fontSize: '0.875rem'}}>
              Redirecting to your submissions...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
