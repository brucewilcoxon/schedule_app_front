import { useMutation, useQuery, useQueryClient } from "react-query";
import * as api from "../api/questionApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const useQuestions = (userId?: number) => {
  return useQuery(["questions", userId], () => api.getQuestions(userId));
};

export const useCreateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation(api.createQuestion, {
    onSuccess: () => {
      queryClient.invalidateQueries("questions");
      toast.success("作成しました");
    },
    onError: () => {
      toast.error("登録に失敗しました");
    },
  });
};

export const useShowQuestion = (id: number) => {
  return useQuery(["questions", id], () => api.showQuestion(id));
};

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation(api.updateQuestion, {
    onSuccess: () => {
      queryClient.invalidateQueries("questions");
      toast.success("質問を編集しました");
    },
    onError: () => {
      toast.error("質問の編集に失敗しました");
    },
  });
};
export const useDeleteQuestion = (navigate: (path: string) => void) => {
  const queryClient = useQueryClient();

  return useMutation(api.deleteQuestion, {
    onSuccess: () => {
      queryClient.invalidateQueries("questions");
      toast.success("質問を削除しました");
      navigate("/question");
    },
    onError: () => {
      toast.error("質問の削除に失敗しました");
    },
  });
};
