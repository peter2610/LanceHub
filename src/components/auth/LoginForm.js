'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMockAuth } from '@/context/MockAuthContext';

export default function LoginForm() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useMockAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    
    try {
      const result = await login({
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        // Check for callbackUrl and redirect accordingly
        const callbackUrl = searchParams.get('callbackUrl');
        router.push(callbackUrl || '/submission');
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Sign In</h1>
          <p className="auth-subtitle">Welcome back to LanceHub</p>
        </div>
        
        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}
        
        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
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
                autoComplete="current-password"
                required
                className="auth-form-input password-input-with-toggle"
                placeholder="Enter your password"
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

          <div className="auth-form-actions">
            <div className="auth-checkbox-group">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="auth-checkbox"
                {...register('remember')}
              />
              <label htmlFor="remember" className="auth-checkbox-label">
                Remember me
              </label>
            </div>
            <a href="#" className="auth-link">
              Forgot your password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="auth-submit-btn"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p className="auth-footer-text">
            Don't have an account?{' '}
            <a href="/auth/register" className="auth-footer-link">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
