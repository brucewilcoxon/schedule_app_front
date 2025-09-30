import { useMutation, useQuery, useQueryClient } from "react-query";
import * as api from "../api/userApi";
import { toast } from "react-toastify";
import { getUser } from "../api/authApi";

export const useGetSeniorUsers = () => {
  return useQuery("users", () => api.getSeniorUsers());
};

export const useGetUsers = () => {
  return useQuery("allUsers", () => api.getUsers());
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation(api.createUser, {
    onSuccess: () => {
      queryClient.invalidateQueries("allUsers");
      queryClient.invalidateQueries("users");
    },
    onError: () => {
      toast.error("ユーザーの作成に失敗しました");
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation(api.updateUser, {
    onSuccess: () => {
      queryClient.invalidateQueries("allUsers");
      queryClient.invalidateQueries("users");
      queryClient.invalidateQueries("user");
    },
    onError: () => {
      toast.error("ユーザーの更新に失敗しました");
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation(api.deleteUser, {
    onSuccess: (data) => {
      console.log('Delete mutation success:', data);
      queryClient.invalidateQueries("allUsers");
      queryClient.invalidateQueries("users");
    },
    onError: (error) => {
      console.error('Delete mutation error:', error);
      
      // Type guard to check if error has response property (Axios error)
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.error('Error response:', axiosError.response);
        console.error('Error status:', axiosError.response?.status);
        console.error('Error data:', axiosError.response?.data);
        
        // Show more specific error message
        const errorMessage = axiosError.response?.data?.message || "ユーザーの削除に失敗しました";
        toast.error(errorMessage);
      } else {
        console.error('Unknown error type:', error);
        toast.error("ユーザーの削除に失敗しました");
      }
    },
  });
};

export const useCreateUserProfile = (navigate: (path: string) => void) => {
  const queryClient = useQueryClient();

  return useMutation(api.createUserProfile, {
    onSuccess: () => {
      queryClient.invalidateQueries("user");
      toast.success("プロフィールを編集しました");
      navigate("/calendar");
    },
    onError: () => {
      toast.error("プロフィールの編集に失敗しました");
    },
  });
};
