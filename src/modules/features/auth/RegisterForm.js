'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

export default function RegisterForm() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    
    console.log('Registration attempt with data:', data); // Debug log
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      console.log('Registration response status:', response.status); // Debug log
      const result = await response.json();
      console.log('Registration response data:', result); // Debug log

      if (!response.ok) {
        throw new Error(result.error || result.message || 'Registration failed');
      }

      console.log('Registration successful, saving user to localStorage'); // Debug log
      
      // Save the registered user to localStorage for login functionality
      if (result.userData) {
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        registeredUsers.push(result.userData);
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        console.log('User saved to localStorage'); // Debug log
      }
      
      // Redirect to login or dashboard based on auto-login preference
      router.push('/auth/login?registered=true');
    } catch (err) {
      console.error('Registration error:', err); // Debug log
      setError(err.message || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join LanceHub and start submitting assignments</p>
        </div>
        
        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}
        
        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="auth-form-row">
            <div className="auth-form-group">
              <label htmlFor="first-name" className="auth-form-label">
                First name
              </label>
              <input
                id="first-name"
                name="firstName"
                type="text"
                autoComplete="given-name"
                required
                className="auth-form-input"
                placeholder="First name"
                {...register('firstName', {
                  required: 'First name is required',
                })}
              />
              {errors.firstName && (
                <p className="auth-field-error">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="auth-form-group">
              <label htmlFor="last-name" className="auth-form-label">
                Last name
              </label>
              <input
                id="last-name"
                name="lastName"
                type="text"
                autoComplete="family-name"
                required
                className="auth-form-input"
                placeholder="Last name"
                {...register('lastName', {
                  required: 'Last name is required',
                })}
              />
              {errors.lastName && (
                <p className="auth-field-error">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>
          
          <div className="auth-form-group">
            <label htmlFor="email" className="auth-form-label">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="auth-form-input"
              placeholder="Enter your email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />
            {errors.email && (
              <p className="auth-field-error">
                {errors.email.message}
              </p>
            )}
          </div>
          
          <div className="auth-form-group">
            <label htmlFor="password" className="auth-form-label">
              Password
            </label>
            <div className="password-input-wrapper">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                className="auth-form-input password-input-with-toggle"
                placeholder="Create a password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                {showPassword ? (
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="auth-field-error">
                {errors.password.message}
              </p>
            )}
          </div>
          
          <div className="auth-form-group">
            <label htmlFor="confirm-password" className="auth-form-label">
              Confirm password
            </label>
            <div className="password-input-wrapper">
              <input
                id="confirm-password"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                className="auth-form-input password-input-with-toggle"
                placeholder="Confirm your password"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) => value === watch('password') || 'Passwords do not match',
                })}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="password-toggle"
              >
                {showConfirmPassword ? (
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="auth-field-error">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="auth-submit-btn"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p className="auth-footer-text">
            Already have an account?{' '}
            <a href="/auth/login" className="auth-footer-link">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
