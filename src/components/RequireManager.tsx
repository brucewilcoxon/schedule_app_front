import React, { FC, ReactNode, useEffect } from "react";
import { TailSpin } from "react-loader-spinner";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

// Prevent duplicate manager-permission toasts across multiple mounts
let hasShownManagerToast = false;

type RequireManagerProps = {
  children?: ReactNode;
};

/**
 * RequireManager component protects routes that require manager role.
 * Uses AuthContext as the single source of truth.
 */
export const RequireManager: FC<RequireManagerProps> = ({ children }) => {
  const { user, isLoading, isAuthenticated } = useAuth();

  const role = user?.role;
  const isNotManager = role !== undefined && role !== "manager";

  // Run the toast effect unconditionally; guard inside to satisfy hooks rules
  useEffect(() => {
    if (!isLoading && user && isNotManager && !hasShownManagerToast) {
      hasShownManagerToast = true;
      toast.error("この機能にアクセスするにはマネージャー権限が必要です");
    }
  }, [isLoading, user, isNotManager]);

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

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (isNotManager) {
    return <Navigate to="/calendar" replace />;
  }

  return <>{children}</>;
};

export default RequireManager;
