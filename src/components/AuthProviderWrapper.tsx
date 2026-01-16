import React, { useState, useCallback, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { setAuthStateCallbacks, clearAuthState, setAuthToken } from '../api/commonApi';
import { User } from '../types/user';
import { AuthInitializer } from './AuthInitializer';

/**
 * AuthProviderWrapper manages the auth state and provides it to the app.
 * It also sets up callbacks for the axios interceptor.
 */
const AuthProviderWrapperInner: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const setUser = useCallback((newUser: User | undefined) => {
    setUserState(newUser);
    setIsLoading(false);
    
    if (newUser) {
      // Update React Query cache
      queryClient.setQueryData('user', newUser);
    } else {
      // Clear React Query cache
      queryClient.removeQueries('user');
    }
  }, [queryClient]);

  const clearAuth = useCallback(() => {
    setUserState(undefined);
    setIsLoading(false);
    clearAuthState();
    queryClient.removeQueries('user');
    queryClient.clear(); // Clear all queries on logout
  }, [queryClient]);

  // Set up axios interceptor callbacks
  React.useEffect(() => {
    setAuthStateCallbacks(setUser, clearAuth, navigate);
  }, [setUser, clearAuth, navigate]);

  const authValue = {
    user,
    isLoading,
    isAuthenticated: !!user,
    setUser,
    clearAuth,
  };

  return (
    <AuthProvider value={authValue}>
      <AuthInitializer>
        {children}
      </AuthInitializer>
    </AuthProvider>
  );
};

/**
 * Main AuthProviderWrapper that wraps the entire app
 */
export const AuthProviderWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <AuthProviderWrapperInner>{children}</AuthProviderWrapperInner>;
};
