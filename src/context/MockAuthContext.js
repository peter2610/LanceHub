'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const MockAuthContext = createContext({});

export function MockAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      console.log('Login attempt with:', credentials); // Debug log
      
      // Mock authentication
      if (credentials.email === 'user@example.com' && credentials.password === 'password') {
        const userData = {
          id: '1',
          email: 'user@example.com',
          name: 'Test User',
          role: 'USER'
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('Login successful for user'); // Debug log
        return { success: true };
      }
      if (credentials.email === 'writer@example.com' && credentials.password === 'password') {
        const userData = {
          id: '2',
          email: 'writer@example.com',
          name: 'Test Writer',
          role: 'WRITER'
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('Login successful for writer'); // Debug log
        return { success: true };
      }
      if (credentials.email === 'admin@example.com' && credentials.password === 'password') {
        const userData = {
          id: '3',
          email: 'admin@example.com',
          name: 'Admin User',
          role: 'ADMIN'
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('Login successful for admin'); // Debug log
        return { success: true };
      }
      
      console.log('Login failed - invalid credentials'); // Debug log
      return { error: 'Invalid credentials' };
    } catch (error) {
      console.log('Login error:', error); // Debug log
      return { error: 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const hasRole = (requiredRole) => {
    if (!user?.role) return false;
    const roleHierarchy = {
      USER: 1,
      WRITER: 2,
      ADMIN: 3,
    };
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  };

  return (
    <MockAuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        hasRole,
      }}
    >
      {children}
    </MockAuthContext.Provider>
  );
}

export function useMockAuth() {
  const context = useContext(MockAuthContext);
  if (context === undefined) {
    throw new Error('useMockAuth must be used within a MockAuthProvider');
  }
  return context;
}
