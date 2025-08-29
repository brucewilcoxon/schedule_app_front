import { useMutation, useQuery, useQueryClient } from "react-query";
import * as api from "../api/noteApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const useNotes = (userId?: number) => {
  return useQuery(["notes", userId], () => api.getNotes(userId));
};

export const useCreateNote = () => {
  const queryClient = useQueryClient();

  return useMutation(api.createNote, {
    onSuccess: () => {
      queryClient.invalidateQueries("notes");
      toast.success("作成しました");
    },
    onError: () => {
      toast.error("登録に失敗しました");
    },
  });
};

export const useShowNote = (id: number) => {
  return useQuery(["notes", id], () => api.showNote(id));
};

export const useUpdateNote = () => {
  const queryClient = useQueryClient();

  return useMutation(api.updateNote, {
    onSuccess: () => {
      queryClient.invalidateQueries("notes");
      toast.success("ノートを編集しました");
    },
    onError: () => {
      toast.error("ノートの編集に失敗しました");
    },
  });
};
export const useDeleteNote = (navigate: (path: string) => void) => {
  const queryClient = useQueryClient();

  return useMutation(api.deleteNote, {
    onSuccess: () => {
      queryClient.invalidateQueries("notes");
      toast.success("削除しました");
      navigate("/windNote");
    },
    onError: () => {
      toast.error("削除に失敗しました");
    },
  });
};

export const useUpdateFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation(api.updateFavorite, {
    onSuccess: () => {
      queryClient.invalidateQueries("favorites");
      queryClient.invalidateQueries("notes");
    },
    onError: () => {
      toast.error("お気に入りに失敗しました");
    },
  });
};
