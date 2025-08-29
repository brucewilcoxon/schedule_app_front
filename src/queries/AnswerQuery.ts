import { useMutation, useQuery, useQueryClient } from "react-query";
import * as api from "../api/answerApi";
import { toast } from "react-toastify";

export const useGetAnswers = (userId?: number) => {
  return useQuery(["answers", userId], () => api.getAnswers(userId));
};

export const useCreateAnswer = () => {
  const queryClient = useQueryClient();

  return useMutation(api.createAnswer, {
    onSuccess: () => {
      queryClient.invalidateQueries("questions");
      queryClient.invalidateQueries("answers");
      toast.success("回答しました");
    },
    onError: () => {
      toast.error("回答に失敗しました");
    },
  });
};

export const useUpdateAnswer = () => {
  const queryClient = useQueryClient();

  return useMutation(api.updateAnswer, {
    onSuccess: () => {
      queryClient.invalidateQueries("questions");
      queryClient.invalidateQueries("answers");
      toast.success("解答を編集しました");
    },
    onError: () => {
      toast.error("解答の編集に失敗しました");
    },
  });
};

export const useDeleteAnswer = (navigate: (path: string) => void) => {
  const queryClient = useQueryClient();

  return useMutation(api.deleteAnswer, {
    onSuccess: () => {
      queryClient.invalidateQueries("questions");
      toast.success("削除しました");
      navigate("/question");
    },
    onError: () => {
      toast.error("削除に失敗しました");
    },
  });
};
