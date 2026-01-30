'use client';

import { useState } from 'react';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false, 
  className = '', 
  onClick, 
  ...props 
}) {
  const [isPressed, setIsPressed] = useState(false);

  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-black text-white hover:bg-gray-800 focus:ring-black',
    secondary: 'bg-white text-black border border-black hover:bg-gray-100 focus:ring-black',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-600',
    ghost: 'bg-transparent text-black hover:bg-gray-100 focus:ring-gray-500'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const transformClasses = isPressed ? 'scale-95' : 'scale-100';

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${transformClasses} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V8C12 4.477 15.523 1 20 1s8 3.477 8 8v4a8 8 0 01-8 8z"></path>
        </svg>
      )}
      {children}
    </button>
  );
}
