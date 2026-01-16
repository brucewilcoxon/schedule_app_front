import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import * as api from "../api/authApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoginCredentials } from "../types/user";
import { AxiosError } from "axios";
import { useAuth } from "../contexts/AuthContext";

/**
 * useGetUser hook - DEPRECATED: Use useAuth() from AuthContext instead.
 * This hook is kept for backward compatibility but now uses AuthContext.
 * 
 * For new code, use: const { user, isLoading, isAuthenticated } = useAuth();
 */
export const useGetUser = () => {
  const { user, isLoading } = useAuth();
  
  // Return a query-like interface for backward compatibility
  return {
    data: user,
    isLoading,
    error: null,
    refetch: async () => {
      // If needed, we can refetch from API and update context
      // But typically AuthContext is the source of truth
      try {
        const freshUser = await api.getUser();
        // This would need to be handled by AuthContext
        return { data: freshUser };
      } catch (error) {
        throw error;
      }
    }
  };
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuth();
  
  return useMutation(api.login, {
    onSuccess: (data) => {
      // Store the user data in the cache and context
      if (data.user) {
        queryClient.setQueryData("user", data.user);
        setUser(data.user); // Update AuthContext
      }
      queryClient.invalidateQueries("user");
      toast.success("ログインしました");
    },
    onError: (error: AxiosError) => {
      console.error("Login error:", error);
      error?.response?.status === 401
        ? toast.error("メールアドレスかパスワードが間違っています")
        : toast.error("ログインに失敗しました");
    },
  });
};

export const useSignUp = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const { setUser } = useAuth();

  return useMutation(api.signUp, {
    onSuccess: async (user, variables: LoginCredentials) => {
      const loginResponse = await loginMutation.mutateAsync({
        email: variables.email,
        password: variables.password,
      });
      
      // Store the user data in the cache and context
      if (loginResponse.user) {
        queryClient.setQueryData("user", loginResponse.user);
        setUser(loginResponse.user); // Update AuthContext
      }
      
      queryClient.invalidateQueries("user");
      toast.success("アカウントを作成しました");
      navigate("/myPage/profile");
    },
    onError: (error: AxiosError) => {
      error?.response?.status === 422
        ? toast.error("メールアドレスが既に存在しています")
        : toast.error("アカウントの作成に失敗しました");
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { clearAuth } = useAuth();
  
  return useMutation(api.logout, {
    onSuccess: () => {
      // Clear AuthContext (this also clears localStorage and cookies)
      clearAuth();
      
      // Clear all React Query cache
      queryClient.clear();
      queryClient.invalidateQueries("user");
      
      toast.success("ログアウトしました");
      
      // Navigate to login page
      navigate("/login", { replace: true });
    },
    onError: () => {
      // Even on error, clear local state
      clearAuth();
      queryClient.clear();
      navigate("/login", { replace: true });
      toast.error("ログアウトに失敗しました");
    },
  });
};
