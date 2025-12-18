'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      setUser(session.user);
      setLoading(false);
    } else if (status === 'unauthenticated') {
      setUser(null);
      setLoading(false);
    }
  }, [status, session]);

  const login = async (credentials) => {
    const result = await signIn('credentials', {
      redirect: false,
      ...credentials,
    });
    return result;
  };

  const logout = async () => {
    await signOut({ redirect: false });
    setUser(null);
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
    <AuthContext.Provider
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
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
