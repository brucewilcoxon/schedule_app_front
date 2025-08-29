import { useMutation, useQuery, useQueryClient } from "react-query";
import * as api from "../api/intraClaimApi";
import { toast } from "react-toastify";

export const useGetIntraClaims = () => {
  return useQuery("intraClaims", () => api.getIntraClaims());
};

export const useShowDeparture = (id: number) => {
  return useQuery(["intraClaims", id], () => api.showIntraClaim(id));
};

export const useIntraApproveClaim = () => {
  const queryClient = useQueryClient();

  return useMutation(api.IntraApproveClaim, {
    onSuccess: () => {
      queryClient.invalidateQueries("departures");
      queryClient.invalidateQueries("intraClaims");
      queryClient.invalidateQueries("notifications");
      toast.success("イントラ依頼を承諾しました");
    },
    onError: () => {
      toast.error("承諾に失敗しました");
    },
  });
};

export const useRejectIntraClaim = () => {
  const queryClient = useQueryClient();

  return useMutation(api.rejectIntraClaim, {
    onSuccess: () => {
      queryClient.invalidateQueries("departures");
      queryClient.invalidateQueries("intraClaims");
      queryClient.invalidateQueries("notifications");
      toast.success("イントラ依頼を取り下げました");
    },
    onError: () => {
      toast.error("取り下げに失敗しました");
    },
  });
};
