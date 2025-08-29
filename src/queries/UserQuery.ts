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
    onSuccess: () => {
      queryClient.invalidateQueries("allUsers");
      queryClient.invalidateQueries("users");
    },
    onError: () => {
      toast.error("ユーザーの削除に失敗しました");
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
