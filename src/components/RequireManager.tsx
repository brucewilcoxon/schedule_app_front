import React, { FC, ReactNode, useEffect } from "react";
import { TailSpin } from "react-loader-spinner";
import { Navigate } from "react-router-dom";
import { useGetUser } from "../queries/AuthQuery";
import { toast } from "react-toastify";

// Prevent duplicate manager-permission toasts across multiple mounts
let hasShownManagerToast = false;

type RequireManagerProps = {
  children?: ReactNode;
};

export const RequireManager: FC<RequireManagerProps> = ({ children }) => {
  const { data: user, isLoading } = useGetUser();

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
    return <TailSpin height="80" width="80" color="#00aab9" />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (isNotManager) {
    return <Navigate to="/calendar" />;
  }

  return <>{children}</>;
};

export default RequireManager;
