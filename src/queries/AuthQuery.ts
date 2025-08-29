import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import * as api from "../api/authApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { User, LoginCredentials } from "../types/user";
import { AxiosError } from "axios";

export const useGetUser = () => {
  return useQuery("user", () => api.getUser(), {
    onError: (error) => {
      console.error("Error fetching user:", error);
    },
    onSuccess: (data) => {
      console.log("User data received:", data);
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation(api.login, {
    onSuccess: (data) => {
      console.log("Login response:", data);
      // Store the user data in the cache
      if (data.user) {
        console.log("Setting user data in cache:", data.user);
        queryClient.setQueryData("user", data.user);
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

  return useMutation(api.signUp, {
    onSuccess: async (user, variables: LoginCredentials) => {
      const loginResponse = await loginMutation.mutateAsync({
        email: variables.email,
        password: variables.password,
      });
      
      // Store the user data in the cache
      if (loginResponse.user) {
        queryClient.setQueryData("user", loginResponse.user);
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
  
  return useMutation(api.logout, {
    onSuccess: () => {
      // Clear all React Query cache
      queryClient.clear();
      // Clear user-specific queries
      queryClient.invalidateQueries("user");
      
      // Force clear any remaining cookies that might have been missed
      const forceClearCookies = () => {
        const cookieNames = [
          'XSRF-TOKEN',
          'laravel_session',
          'windap_session',
          'remember_web',
          'remember_token',
          'session',
          'auth'
        ];
        
        cookieNames.forEach(name => {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/api`;
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/sanctum`;
        });
      };
      
      forceClearCookies();
      toast.success("ログアウトしました");
      
      // Navigate to login page after a short delay to ensure cleanup is complete
      setTimeout(() => {
        navigate("/login");
      }, 100);
    },
    onError: () => {
      toast.error("ログアウトに失敗しました");
    },
  });
};
