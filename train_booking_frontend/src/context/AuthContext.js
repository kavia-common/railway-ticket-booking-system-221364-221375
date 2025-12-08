/* eslint-disable react/prop-types */
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/client';

// PUBLIC_INTERFACE
export const AuthContext = createContext(null);

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /**
   * Provides authentication state and actions to child components.
   * Stores token and user info in localStorage under 'auth'.
   */
  const [auth, setAuth] = useState(() => {
    try {
      const raw = localStorage.getItem('auth');
      return raw ? JSON.parse(raw) : { token: null, user: null };
    } catch {
      return { token: null, user: null };
    }
  });
  const [loading, setLoading] = useState(false);
  const isAuthenticated = !!auth?.token;

  useEffect(() => {
    localStorage.setItem('auth', JSON.stringify(auth));
  }, [auth]);

  // PUBLIC_INTERFACE
  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await api.post('/auth/login', { email, password });
      setAuth({ token: data?.access_token || data?.token, user: data?.user || { email } });
      return data;
    } finally {
      setLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const data = await api.post('/auth/register', { name, email, password });
      // If backend logs in on register, store token; else require manual login
      if (data?.access_token || data?.token) {
        setAuth({ token: data.access_token || data.token, user: data?.user || { name, email } });
      }
      return data;
    } finally {
      setLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  const logout = () => {
    setAuth({ token: null, user: null });
    localStorage.removeItem('auth');
  };

  const value = useMemo(
    () => ({ ...auth, isAuthenticated, loading, login, register, logout, setAuth }),
    [auth, isAuthenticated, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuthContext() {
  /** Hook to access AuthContext */
  return useContext(AuthContext);
}
