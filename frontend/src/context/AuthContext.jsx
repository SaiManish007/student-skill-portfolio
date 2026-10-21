import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('skillfolio_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('skillfolio_token');
      if (storedToken) {
        try {
          const response = await authApi.getCurrentUser();
          if (response.data?.success) {
            setUser(response.data.data);
            localStorage.setItem('skillfolio_user', JSON.stringify(response.data.data));
          } else {
            logout();
          }
        } catch (err) {
          console.error("Auth validation failed:", err);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const response = await authApi.login({ email, password });
    if (response.data?.success) {
      const { token: jwtToken, user: userData } = response.data.data;
      localStorage.setItem('skillfolio_token', jwtToken);
      localStorage.setItem('skillfolio_user', JSON.stringify(userData));
      setToken(jwtToken);
      setUser(userData);
      return userData;
    }
    throw new Error(response.data?.message || 'Login failed');
  };

  const register = async (fullName, email, password) => {
    const response = await authApi.register({ fullName, email, password });
    if (response.data?.success) {
      const { token: jwtToken, user: userData } = response.data.data;
      localStorage.setItem('skillfolio_token', jwtToken);
      localStorage.setItem('skillfolio_user', JSON.stringify(userData));
      setToken(jwtToken);
      setUser(userData);
      return userData;
    }
    throw new Error(response.data?.message || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('skillfolio_token');
    localStorage.removeItem('skillfolio_user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedData) => {
    setUser((prev) => {
      const next = { ...prev, ...updatedData };
      localStorage.setItem('skillfolio_user', JSON.stringify(next));
      return next;
    });
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'ADMIN',
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
