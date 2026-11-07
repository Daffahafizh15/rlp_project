import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (fullName: string, email: string, password: string, phone?: string) => Promise<User>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('forme_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('forme_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('forme_token');
      if (storedToken) {
        try {
          const res = await authApi.getProfile();
          setUser(res.data);
          localStorage.setItem('forme_user', JSON.stringify(res.data));
        } catch {
          localStorage.removeItem('forme_token');
          localStorage.removeItem('forme_user');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(email, password);
      const { accessToken, user: loggedUser } = res.data;
      localStorage.setItem('forme_token', accessToken);
      localStorage.setItem('forme_user', JSON.stringify(loggedUser));
      setToken(accessToken);
      setUser(loggedUser);
      return loggedUser;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (fullName: string, email: string, password: string, phone?: string) => {
    setIsLoading(true);
    try {
      const res = await authApi.register(fullName, email, password, phone);
      const { accessToken, user: registeredUser } = res.data;
      localStorage.setItem('forme_token', accessToken);
      localStorage.setItem('forme_user', JSON.stringify(registeredUser));
      setToken(accessToken);
      setUser(registeredUser);
      return registeredUser;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('forme_token');
    localStorage.removeItem('forme_user');
    setToken(null);
    setUser(null);
  };

  const refreshProfile = async () => {
    if (!token) return;
    try {
      const res = await authApi.getProfile();
      setUser(res.data);
      localStorage.setItem('forme_user', JSON.stringify(res.data));
    } catch (e) {
      console.error('Failed to refresh profile', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        refreshProfile,
        isAuthenticated: !!token && !!user,
        isAdmin: user?.role === 'ADMIN',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
