import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TailSpin } from 'react-loader-spinner';
import { useQueryClient } from 'react-query';
import { setAuthToken } from '../api/commonApi';
import { getUser } from '../api/authApi';
import { useAuth } from '../contexts/AuthContext';

/**
 * AuthInitializer blocks the app from rendering until authentication state is verified.
 * This ensures we never have a half-authenticated state where localStorage has a token
 * but the backend says the user is not authenticated.
 * 
 * This component must be used INSIDE AuthProvider to access useAuth hook.
 */
export const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const { setUser, clearAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if we have a token in localStorage
        const token = localStorage.getItem('auth_token');
        
        if (token) {
          // Set the token in axios headers
          setAuthToken(token);
          
          try {
            // Verify the token by calling /api/user
            // This is the SINGLE SOURCE OF TRUTH for auth state
            const user = await getUser();
            
            if (user) {
              // Token is valid, user is authenticated
              setUser(user);
              queryClient.setQueryData('user', user);
            } else {
              // No user returned, clear auth
              clearAuth();
            }
          } catch (error: any) {
            // Token is invalid or expired
            // Clear all auth state
            clearAuth();
            
            // If we're on a protected route, redirect to login
            // But don't redirect if we're already on login/signup
            const publicRoutes = ['/login', '/signUp'];
            if (!publicRoutes.includes(location.pathname)) {
              navigate('/login', { replace: true });
            }
          }
        } else {
          // No token, user is not authenticated
          clearAuth();
          
          // Redirect to login if on protected route
          const publicRoutes = ['/login', '/signUp'];
          if (!publicRoutes.includes(location.pathname)) {
            navigate('/login', { replace: true });
          }
        }
      } catch (error) {
        // Unexpected error during initialization
        console.error('Auth initialization error:', error);
        clearAuth();
        
        const publicRoutes = ['/login', '/signUp'];
        if (!publicRoutes.includes(location.pathname)) {
          navigate('/login', { replace: true });
        }
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Show loading spinner while initializing
  if (isInitializing) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw'
      }}>
        <TailSpin height="80" width="80" color="#00aab9" />
      </div>
    );
  }

  return <>{children}</>;
};
