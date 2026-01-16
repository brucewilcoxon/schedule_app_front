import React, { createContext, useContext, ReactNode } from 'react';
import { User } from '../types/user';

interface AuthContextType {
  user: User | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | undefined) => void;
  clearAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
  value: AuthContextType;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, value }) => {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
