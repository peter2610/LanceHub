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
      
      // Check for hardcoded test users first
      if (credentials.email === 'client@example.com' && credentials.password === 'password') {
        const userData = {
          id: '1',
          email: 'client@example.com',
          name: 'Test Client',
          role: 'CLIENT',
          token: btoa(JSON.stringify({ id: '1', email: 'client@example.com', role: 'CLIENT', exp: Date.now() + 24*60*60*1000 }))
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', userData.token);
        console.log('Login successful for test client'); // Debug log
        return { success: true };
      }
      if (credentials.email === 'writer@example.com' && credentials.password === 'password') {
        const userData = {
          id: '2',
          email: 'writer@example.com',
          name: 'Test Writer',
          role: 'WRITER',
          token: btoa(JSON.stringify({ id: '2', email: 'writer@example.com', role: 'WRITER', exp: Date.now() + 24*60*60*1000 }))
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', userData.token);
        console.log('Login successful for test writer'); // Debug log
        return { success: true };
      }
      if (credentials.email === 'admin@example.com' && credentials.password === 'password') {
        const userData = {
          id: '3',
          email: 'admin@example.com',
          name: 'Super Admin',
          role: 'ADMIN',
          token: btoa(JSON.stringify({ id: '3', email: 'admin@example.com', role: 'ADMIN', exp: Date.now() + 24*60*60*1000 }))
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', userData.token);
        console.log('Login successful for test admin'); // Debug log
        return { success: true };
      }
      
      // Check for registered users in localStorage
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const registeredUser = registeredUsers.find(u => 
        u.email === credentials.email && u.password === credentials.password
      );
      
      if (registeredUser) {
        const userData = {
          id: registeredUser.id,
          email: registeredUser.email,
          name: registeredUser.name,
          role: registeredUser.role || 'CLIENT',
          token: btoa(JSON.stringify({ 
            id: registeredUser.id, 
            email: registeredUser.email, 
            role: registeredUser.role || 'CLIENT', 
            exp: Date.now() + 24*60*60*1000 
          }))
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', userData.token);
        console.log('Login successful for registered user'); // Debug log
        return { success: true };
      }
      
      console.log('Login failed: invalid credentials'); // Debug log
      return { error: 'Invalid credentials' };
    } catch (error) {
      console.error('Login error:', error); // Debug log
      return { error: 'An error occurred during login' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const hasRole = (requiredRole) => {
    if (!user?.role) return false;
    const roleHierarchy = {
      CLIENT: 1,
      WRITER: 2,
      ADMIN: 3,
    };
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  };

  const isTokenValid = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    try {
      const decoded = JSON.parse(atob(token));
      return decoded.exp > Date.now();
    } catch {
      return false;
    }
  };

  return (
    <MockAuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user && isTokenValid(),
        hasRole,
        isTokenValid,
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
