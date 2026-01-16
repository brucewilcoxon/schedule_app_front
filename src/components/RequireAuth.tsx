import React, { FC, ReactNode } from "react";
import { TailSpin } from "react-loader-spinner";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

type RequireAuthProps = {
  children?: ReactNode;
};

/**
 * RequireAuth component protects routes by checking authentication state.
 * Uses AuthContext as the single source of truth (which is synced with /api/user).
 */
export const RequireAuth: FC<RequireAuthProps> = ({ children }) => {
  const { user, isLoading, isAuthenticated } = useAuth();

  // Show loading spinner while auth state is being determined
  if (isLoading) {
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

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;
